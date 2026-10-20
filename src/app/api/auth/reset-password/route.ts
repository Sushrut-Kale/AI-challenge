// ============================================================================
// AGENTCRAFT — Password Reset Request API Route
// POST /api/auth/reset-password
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient, logAuditEvent } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const body = await request.json().catch(() => null);

    if (!body?.identifier) {
      return NextResponse.json(
        { error: 'Team ID or email address is required.' },
        { status: 400 }
      );
    }

    const identifier = String(body.identifier).trim();
    const serviceClient = getServiceClient();

    let targetEmail: string | null = null;
    let teamId: string | null = null;

    if (/^AC-\d{4}-\d{4}$/i.test(identifier)) {
      // Identifier is a Team ID
      const { data: team } = await serviceClient
        .from('teams')
        .select('team_id, leader_email, auth_user_id')
        .eq('team_id', identifier.toUpperCase())
        .single();

      if (team && team.auth_user_id) {
        teamId = team.team_id;
        const { data: authUser } = await serviceClient.auth.admin.getUserById(team.auth_user_id);
        targetEmail = authUser?.user?.email || team.leader_email;
      }
    } else if (identifier.includes('@')) {
      targetEmail = identifier.toLowerCase();
    }

    // Always respond with success to avoid account enumeration
    if (targetEmail) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agentcraft.vercel.app';
      await serviceClient.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${siteUrl}/dashboard?reset=true`,
      });

      await logAuditEvent(
        null,
        'password_reset_requested',
        'auth',
        null,
        { identifier, team_id: teamId },
        ip
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If an active account was found, a password reset email has been dispatched to the registered team email address.',
    });
  } catch (err) {
    console.error('[AUTH/RESET] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
