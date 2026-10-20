// ============================================================================
// AGENTCRAFT — Admin Teams Management API Route
// GET: List teams with members and submission status
// PATCH: Toggle team active status
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getServiceClient, logAuditEvent } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const DEMO_TEAMS: any[] = [
  {
    id: 'team-demo-1',
    team_id: 'AC-2026-0001',
    team_name: 'Voxel Agents',
    leader_name: 'Alex Chen',
    leader_email: 'team@agentcraft.ai',
    leader_phone: '+91 98765 43210',
    college: 'MIT Academy of Engineering, Pune',
    track: 'SDG 13: Climate Action',
    is_active: true,
    auth_user_id: 'auth-user-1',
    created_at: '2026-10-18T10:00:00Z',
    members: [
      { id: 'm1', name: 'Alex Chen', role: 'Leader' },
      { id: 'm2', name: 'Maya Lin', role: 'Member' },
      { id: 'm3', name: 'Rahul Sharma', role: 'Member' },
    ],
    submissions: [{ id: 'sub-1', status: 'draft', project_name: 'EcoAgent Swarm' }],
  },
  {
    id: 'team-demo-2',
    team_id: 'AC-2026-0002',
    team_name: 'Neural Crafters',
    leader_name: 'Priya Patel',
    leader_email: 'priya@example.com',
    leader_phone: '+91 91234 56789',
    college: 'COEP Technological University',
    track: 'SDG 3: Good Health & Well-Being',
    is_active: true,
    auth_user_id: 'auth-user-2',
    created_at: '2026-10-18T11:30:00Z',
    members: [
      { id: 'm4', name: 'Priya Patel', role: 'Leader' },
      { id: 'm5', name: 'Ananya Deshmukh', role: 'Member' },
    ],
    submissions: [{ id: 'sub-2', status: 'submitted', submitted_at: '2026-10-19T14:20:00Z', project_name: 'MedAgent Vision' }],
  },
  {
    id: 'team-demo-3',
    team_id: 'AC-2026-0003',
    team_name: 'Quantum Pioneers',
    leader_name: 'Rohan Joshi',
    leader_email: 'rohan.j@gmail.com',
    leader_phone: '+91 99887 76655',
    college: 'PICT Pune',
    track: 'SDG 7: Affordable & Clean Energy',
    is_active: true,
    auth_user_id: null,
    created_at: '2026-10-19T08:15:00Z',
    members: [
      { id: 'm6', name: 'Rohan Joshi', role: 'Leader' },
      { id: 'm7', name: 'Sneha Kulkarni', role: 'Member' },
      { id: 'm8', name: 'Vikram Rao', role: 'Member' },
    ],
    submissions: [],
  },
];

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('agentcraft_demo_session')?.value;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase() || '';
    const track = searchParams.get('track') || '';
    const status = searchParams.get('status') || '';

    if (demoRole === 'admin') {
      let filtered = [...DEMO_TEAMS];
      if (search) {
        filtered = filtered.filter(
          (t) =>
            t.team_id.toLowerCase().includes(search) ||
            t.team_name.toLowerCase().includes(search) ||
            t.leader_name.toLowerCase().includes(search) ||
            t.leader_email.toLowerCase().includes(search) ||
            t.college.toLowerCase().includes(search)
        );
      }
      if (track) filtered = filtered.filter((t) => t.track === track);
      if (status === 'provisioned') filtered = filtered.filter((t) => t.auth_user_id !== null);
      if (status === 'unprovisioned') filtered = filtered.filter((t) => t.auth_user_id === null);

      return NextResponse.json({
        teams: filtered,
        totalCount: filtered.length,
      });
    }

    const user = await getCurrentUser();
    if (!user || user.app_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const serviceClient = getServiceClient();
    let query = serviceClient
      .from('teams')
      .select('*, members:team_members(*), submissions(id, status, submitted_at, project_name)')
      .order('created_at', { ascending: false });

    if (track) query = query.eq('track', track);
    if (status === 'provisioned') query = query.not('auth_user_id', 'is', null);
    else if (status === 'unprovisioned') query = query.is('auth_user_id', null);

    const { data: teams, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let filteredTeams = teams || [];
    if (search) {
      filteredTeams = filteredTeams.filter(
        (t) =>
          t.team_id.toLowerCase().includes(search) ||
          t.team_name.toLowerCase().includes(search) ||
          t.leader_name.toLowerCase().includes(search) ||
          t.leader_email.toLowerCase().includes(search) ||
          (t.college && t.college.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      teams: filteredTeams,
      totalCount: filteredTeams.length,
    });
  } catch (err: unknown) {
    console.error('[ADMIN/TEAMS/GET] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch teams.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('agentcraft_demo_session')?.value;

    const body = await request.json().catch(() => null);
    if (!body?.id || typeof body?.is_active !== 'boolean') {
      return NextResponse.json({ error: 'id and is_active are required.' }, { status: 400 });
    }

    if (demoRole === 'admin') {
      const target = DEMO_TEAMS.find((t) => t.id === body.id);
      if (target) target.is_active = body.is_active;
      return NextResponse.json({ success: true, team: target });
    }

    const user = await getCurrentUser();
    if (!user || user.app_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const serviceClient = getServiceClient();
    const { data: updatedTeam, error } = await serviceClient
      .from('teams')
      .update({ is_active: body.is_active, updated_at: new Date().toISOString() })
      .eq('id', body.id)
      .select()
      .single();

    if (error || !updatedTeam) {
      return NextResponse.json({ error: error?.message || 'Failed to update team.' }, { status: 500 });
    }

    await logAuditEvent(
      user.id,
      body.is_active ? 'team_activated' : 'team_deactivated',
      'team',
      updatedTeam.id,
      { team_id: updatedTeam.team_id, is_active: body.is_active },
      ip
    );

    return NextResponse.json({
      success: true,
      team: updatedTeam,
    });
  } catch (err: unknown) {
    console.error('[ADMIN/TEAMS/PATCH] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update team.' },
      { status: 500 }
    );
  }
}
