// ============================================================================
// AGENTCRAFT — Admin Submissions Review API Route
// GET: List all submissions with team data and attached files
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getServiceClient, isAdminUser } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const DEMO_SUBMISSIONS: any[] = [
  {
    id: 'sub-demo-1',
    project_name: 'EcoAgent — Autonomous Precision Agriculture Swarm',
    track: 'SDG 13: Climate Action',
    synopsis:
      'Autonomous multi-agent swarm architecture utilizing small language models on edge devices to orchestrate precision drone operations for carbon sequestration monitoring, soil moisture tracking, and chemical fertilizer reduction across agricultural acreage.',
    repo_url: 'https://github.com/agentcraft-ai/eco-agent-swarm',
    demo_url: 'https://youtu.be/dQw4w9WgXcQ',
    hosted_url: 'https://ecoagent-demo.vercel.app',
    status: 'draft',
    submitted_at: null,
    created_at: '2026-10-19T09:00:00Z',
    team: {
      id: 'team-demo-1',
      team_id: 'AC-2026-0001',
      team_name: 'Voxel Agents',
      leader_name: 'Alex Chen',
      leader_email: 'team@agentcraft.ai',
    },
    files: [
      {
        id: 'f1',
        file_name: 'EcoAgent_Pitch_Deck_v2.pdf',
        file_type: 'pitch_deck',
        file_path: 'submissions/AC-2026-0001/draft/pitch_deck/deck.pdf',
        file_size_bytes: 4280000,
        mime_type: 'application/pdf',
      },
    ],
  },
  {
    id: 'sub-demo-2',
    project_name: 'MedAgent Vision — Autonomous Diagnostic Triage in Rural Clinics',
    track: 'SDG 3: Good Health & Well-Being',
    synopsis:
      'A federated multi-modal clinical reasoning agent trained to assist community health workers with differential diagnosis, prescription verification, and emergency patient triage in connectivity-constrained rural healthcare outposts.',
    repo_url: 'https://github.com/agentcraft-ai/medagent-vision',
    demo_url: 'https://youtu.be/dQw4w9WgXcQ',
    hosted_url: 'https://medagent-rural.vercel.app',
    status: 'submitted',
    submitted_at: '2026-10-19T14:20:00Z',
    created_at: '2026-10-18T16:30:00Z',
    team: {
      id: 'team-demo-2',
      team_id: 'AC-2026-0002',
      team_name: 'Neural Crafters',
      leader_name: 'Priya Patel',
      leader_email: 'priya@example.com',
    },
    files: [
      {
        id: 'f2',
        file_name: 'MedAgent_Architecture_Report.pdf',
        file_type: 'report',
        file_path: 'submissions/AC-2026-0002/final/report/architecture.pdf',
        file_size_bytes: 5120000,
        mime_type: 'application/pdf',
      },
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('agentcraft_demo_session')?.value;

    const { searchParams } = new URL(request.url);
    const track = searchParams.get('track') || '';
    const status = searchParams.get('status') || '';

    if (demoRole === 'admin') {
      let filtered = [...DEMO_SUBMISSIONS];
      if (track) filtered = filtered.filter((s) => s.track === track);
      if (status) filtered = filtered.filter((s) => s.status === status);

      return NextResponse.json({
        submissions: filtered,
        stats: {
          total: DEMO_SUBMISSIONS.length,
          submitted: DEMO_SUBMISSIONS.filter((s) => s.status === 'submitted').length,
          draft: DEMO_SUBMISSIONS.filter((s) => s.status === 'draft').length,
        },
      });
    }

    const user = await getCurrentUser();
    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const serviceClient = getServiceClient();

    let query = serviceClient
      .from('submissions')
      .select('*, team:teams(*), files:submission_files(*)')
      .order('submitted_at', { ascending: false, nullsFirst: false });

    if (track) query = query.eq('track', track);
    if (status) query = query.eq('status', status);

    const { data: submissions, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalSubmissions = submissions?.length || 0;
    const finalizedCount = submissions?.filter((s) => s.status === 'submitted').length || 0;
    const draftCount = submissions?.filter((s) => s.status === 'draft').length || 0;

    return NextResponse.json({
      submissions: submissions || [],
      stats: {
        total: totalSubmissions,
        submitted: finalizedCount,
        draft: draftCount,
      },
    });
  } catch (err: unknown) {
    console.error('[ADMIN/SUBMISSIONS] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch submissions.' },
      { status: 500 }
    );
  }
}
