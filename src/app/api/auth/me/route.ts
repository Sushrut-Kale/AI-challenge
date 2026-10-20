// ============================================================================
// AGENTCRAFT — Current User / Team Data API Route
// GET /api/auth/me
// ============================================================================

import { NextResponse } from 'next/server';
import { getCurrentUser, getServiceClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('agentcraft_demo_session')?.value;

    if (demoRole === 'admin') {
      return NextResponse.json({
        user: { id: 'demo-admin-id', email: 'admin@agentcraft.ai' },
        isAdmin: true,
        team: null,
      });
    }

    if (demoRole === 'team') {
      return NextResponse.json({
        user: { id: 'demo-team-id', email: 'team@agentcraft.ai' },
        isAdmin: false,
        team: {
          id: 'demo-team-uuid',
          team_id: 'AC-2026-0001',
          team_name: 'Voxel Agents',
          leader_name: 'Alex Chen',
          leader_email: 'team@agentcraft.ai',
          leader_phone: '+91 98765 43210',
          college: 'MIT Academy of Engineering, Pune',
          track: 'SDG 13: Climate Action',
          is_active: true,
          password_changed: true,
          members: [
            { id: 'm1', name: 'Alex Chen', role: 'Leader' },
            { id: 'm2', name: 'Maya Lin', role: 'AI Agent Architect' },
            { id: 'm3', name: 'Rahul Sharma', role: 'Full Stack Engineer' },
          ],
        },
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      user.email?.toLowerCase() === 'admin@agentcraft.ai';

    if (isAdmin) {
      return NextResponse.json({
        user: { id: user.id, email: user.email },
        isAdmin: true,
        team: null,
      });
    }

    // Fetch team data with members
    const serviceClient = getServiceClient();
    const { data: team, error } = await serviceClient
      .from('teams')
      .select('*, members:team_members(*)')
      .eq('auth_user_id', user.id)
      .single();

    if (error || !team) {
      return NextResponse.json({
        user: { id: user.id, email: user.email },
        isAdmin: false,
        team: null,
      });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      isAdmin: false,
      team,
    });
  } catch (err) {
    console.error('[AUTH/ME] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
