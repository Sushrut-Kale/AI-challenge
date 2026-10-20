// ============================================================================
// AGENTCRAFT — Login API Route
// Supports both Team ID (AC-2026-XXXX) and Email login server-side,
// sets Supabase session cookies or demo session cookies, and logs audit events.
// POST /api/auth/login
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getServiceClient, logAuditEvent } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const body = await request.json().catch(() => null);
    const identifier = String(body?.team_id || body?.email || body?.identifier || '').trim();
    const password = String(body?.password || '');

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Team ID / Email and password are required.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // ----- Built-in Demo Credentials Support -----
    // Allows local testing even without live Supabase database connected
    const isDemoAdmin =
      (identifier.toLowerCase() === 'admin@agentcraft.ai' || identifier.toLowerCase() === 'admin') &&
      (password === 'admin123' || password === 'agentcraft');

    const isDemoTeam =
      (identifier.toUpperCase() === 'AC-2026-0001' || identifier.toLowerCase() === 'team@agentcraft.ai') &&
      (password === 'demo123' || password === 'agentcraft' || password === 'password');

    if (isDemoAdmin) {
      cookieStore.set('agentcraft_demo_session', 'admin', {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        success: true,
        redirect: '/admin',
        isAdmin: true,
        teamId: null,
      });
    }

    if (isDemoTeam) {
      cookieStore.set('agentcraft_demo_session', 'team', {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        success: true,
        redirect: '/dashboard',
        isAdmin: false,
        teamId: 'AC-2026-0001',
      });
    }

    // ----- Live Supabase Authentication -----
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !serviceKey) {
      return NextResponse.json(
        {
          error:
            'Invalid credentials. For local preview, use Demo Team (AC-2026-0001 / demo123) or Admin (admin@agentcraft.ai / admin123).',
        },
        { status: 401 }
      );
    }

    const serviceClient = getServiceClient();
    let authEmail: string | null = null;
    let teamRecord: { id: string; team_id: string; is_active: boolean; auth_user_id: string | null } | null = null;

    if (/^AC-\d{4}-\d{4}$/i.test(identifier)) {
      // Team ID login
      const formattedTeamId = identifier.toUpperCase();
      const { data: team, error: teamError } = await serviceClient
        .from('teams')
        .select('id, team_id, leader_email, auth_user_id, is_active')
        .eq('team_id', formattedTeamId)
        .single();

      if (teamError || !team) {
        return NextResponse.json(
          { error: 'Invalid credentials. Please check your Team ID and password.' },
          { status: 401 }
        );
      }

      if (!team.is_active) {
        return NextResponse.json(
          { error: 'This team account is deactivated. Contact organizers for assistance.' },
          { status: 403 }
        );
      }

      if (!team.auth_user_id) {
        return NextResponse.json(
          { error: 'Your team account is not yet activated. Please contact the organizers.' },
          { status: 403 }
        );
      }

      teamRecord = team;

      const { data: authUser } = await serviceClient.auth.admin.getUserById(team.auth_user_id);
      if (!authUser?.user?.email) {
        return NextResponse.json(
          { error: 'Invalid credentials. Please check your Team ID and password.' },
          { status: 401 }
        );
      }
      authEmail = authUser.user.email;
    } else if (identifier.includes('@')) {
      authEmail = identifier.toLowerCase();

      const { data: team } = await serviceClient
        .from('teams')
        .select('id, team_id, leader_email, auth_user_id, is_active')
        .eq('leader_email', authEmail)
        .maybeSingle();

      if (team) {
        if (!team.is_active) {
          return NextResponse.json(
            { error: 'This team account is deactivated. Contact organizers for assistance.' },
            { status: 403 }
          );
        }
        teamRecord = team;
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials format. Enter your Team ID (AC-2026-XXXX) or registered email.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Edge cases
          }
        },
      },
    });

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    });

    if (signInError || !signInData.user) {
      await logAuditEvent(
        null,
        'login_failed',
        'auth',
        teamRecord?.id || null,
        { identifier, reason: signInError?.message || 'invalid_credentials' },
        ip
      );
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your details and password.' },
        { status: 401 }
      );
    }

    const isAdmin =
      signInData.user.app_metadata?.role === 'admin' ||
      signInData.user.user_metadata?.role === 'admin' ||
      signInData.user.email?.toLowerCase() === 'admin@agentcraft.ai';
    const redirectPath = isAdmin ? '/admin' : '/dashboard';

    await logAuditEvent(
      signInData.user.id,
      'login_success',
      isAdmin ? 'admin' : 'team',
      teamRecord?.id || signInData.user.id,
      { identifier, isAdmin },
      ip
    );

    return NextResponse.json({
      success: true,
      redirect: redirectPath,
      isAdmin,
      teamId: teamRecord?.team_id || null,
    });
  } catch (err: unknown) {
    console.error('[AUTH/LOGIN] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
