// ============================================================================
// AGENTCRAFT — Team Provisioning API Route
// Creates Supabase Auth accounts for registered teams and generates initial credentials
// POST /api/admin/provision
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getServiceClient, isAdminUser, logAuditEvent } from '@/lib/supabase-server';
import crypto from 'crypto';

function generateSecurePassword(): string {
  // Generates readable yet strong password e.g. "Craft-9482-Emerald"
  const numbers = Math.floor(1000 + Math.random() * 9000);
  const words = ['Diamond', 'Nether', 'Redstone', 'Emerald', 'Voxel', 'Beacon', 'Obsidian', 'Craft'];
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];
  return `${word1}-${numbers}-${word2}`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const user = await getCurrentUser();

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { team_id, provision_all } = body;

    const serviceClient = getServiceClient();

    // Query teams that need provisioning
    let query = serviceClient
      .from('teams')
      .select('id, team_id, team_name, leader_name, leader_email, auth_user_id, is_active')
      .is('auth_user_id', null)
      .eq('is_active', true);

    if (team_id && !provision_all) {
      query = query.eq('team_id', team_id.toUpperCase());
    }

    const { data: teamsToProvision, error: queryError } = await query;

    if (queryError || !teamsToProvision || teamsToProvision.length === 0) {
      return NextResponse.json({
        message: 'No unprovisioned active teams found.',
        provisioned: [],
      });
    }

    const results: Array<{
      team_id: string;
      team_name: string;
      leader_email: string;
      temp_password?: string;
      status: 'success' | 'error';
      error?: string;
    }> = [];

    for (const team of teamsToProvision) {
      try {
        const tempPassword = generateSecurePassword();

        // Create auth user in Supabase Auth
        const { data: authUser, error: authError } = await serviceClient.auth.admin.createUser({
          email: team.leader_email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            role: 'team',
            team_id: team.team_id,
            team_name: team.team_name,
            leader_name: team.leader_name,
          },
        });

        if (authError || !authUser.user) {
          results.push({
            team_id: team.team_id,
            team_name: team.team_name,
            leader_email: team.leader_email,
            status: 'error',
            error: authError?.message || 'Failed to create auth user',
          });
          continue;
        }

        // Link auth user to team
        await serviceClient
          .from('teams')
          .update({
            auth_user_id: authUser.user.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', team.id);

        results.push({
          team_id: team.team_id,
          team_name: team.team_name,
          leader_email: team.leader_email,
          temp_password: tempPassword,
          status: 'success',
        });
      } catch (err: unknown) {
        results.push({
          team_id: team.team_id,
          team_name: team.team_name,
          leader_email: team.leader_email,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown provisioning error',
        });
      }
    }

    const successCount = results.filter((r) => r.status === 'success').length;

    await logAuditEvent(
      user.id,
      'teams_provisioned',
      'team',
      null,
      { attempted: teamsToProvision.length, succeeded: successCount },
      ip
    );

    return NextResponse.json({
      success: true,
      totalAttempted: teamsToProvision.length,
      successCount,
      credentials: results,
    });
  } catch (err: unknown) {
    console.error('[ADMIN/PROVISION] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Provisioning failed.' },
      { status: 500 }
    );
  }
}
