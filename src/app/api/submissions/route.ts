// ============================================================================
// AGENTCRAFT — Submission Management API Route
// GET: Fetch team submission
// POST: Save draft or finalize submission with strict server-side deadline enforcement
// /api/submissions
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserTeam, getServiceClient, logAuditEvent } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// In-memory demo submission state for local preview
let demoSubmissionState: any = {
  id: 'demo-sub-1',
  project_name: 'EcoAgent — Autonomous Precision Agriculture Drone Fleet',
  track: 'SDG 13: Climate Action',
  synopsis:
    'An autonomous multi-agent swarm architecture utilizing small language models on edge devices to orchestrate precision drone operations for carbon sequestration monitoring, soil moisture tracking, and chemical fertilizer reduction across agricultural acreage.',
  repo_url: 'https://github.com/agentcraft-ai/eco-agent-swarm',
  demo_url: 'https://youtu.be/dQw4w9WgXcQ',
  hosted_url: 'https://ecoagent-demo.vercel.app',
  status: 'draft',
  submitted_at: null,
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
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('agentcraft_demo_session')?.value;

    const deadlineStr = process.env.SUBMISSION_DEADLINE || '2026-10-31T23:59:59+05:30';

    if (demoRole === 'team' || demoRole === 'admin') {
      return NextResponse.json({
        submission: demoSubmissionState,
        team: {
          id: 'demo-team-uuid',
          team_id: 'AC-2026-0001',
          team_name: 'Voxel Agents',
          leader_name: 'Alex Chen',
          leader_email: 'team@agentcraft.ai',
          track: 'SDG 13: Climate Action',
        },
        deadline: deadlineStr,
        isExpired: Date.now() > new Date(deadlineStr).getTime(),
      });
    }

    const authData = await getCurrentUserTeam();
    if (!authData || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (!authData.team) {
      return NextResponse.json({ error: 'No team associated with this account.' }, { status: 403 });
    }

    const serviceClient = getServiceClient();
    const { data: submission, error } = await serviceClient
      .from('submissions')
      .select('*, files:submission_files(*)')
      .eq('team_id', authData.team.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      submission: submission || null,
      team: authData.team,
      deadline: deadlineStr,
      isExpired: Date.now() > new Date(deadlineStr).getTime(),
    });
  } catch (err: unknown) {
    console.error('[SUBMISSIONS/GET] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch submission.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('agentcraft_demo_session')?.value;

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Missing request body.' }, { status: 400 });
    }

    const {
      project_name,
      track,
      synopsis,
      repo_url,
      demo_url,
      hosted_url,
      files,
      is_final,
    } = body;

    // Strict server-side deadline enforcement
    const deadlineStr = process.env.SUBMISSION_DEADLINE || '2026-10-31T23:59:59+05:30';
    const deadline = new Date(deadlineStr);
    const isPastDeadline = Date.now() > deadline.getTime();

    if (isPastDeadline) {
      return NextResponse.json(
        { error: 'The submission deadline has passed. No further changes can be submitted.' },
        { status: 403 }
      );
    }

    // Demo Mode Handler
    if (demoRole === 'team' || demoRole === 'admin') {
      const status = is_final ? 'submitted' : 'draft';
      const submittedAt = is_final ? new Date().toISOString() : null;

      demoSubmissionState = {
        ...demoSubmissionState,
        project_name: project_name?.trim() || demoSubmissionState.project_name,
        track: track?.trim() || demoSubmissionState.track,
        synopsis: synopsis?.trim() || demoSubmissionState.synopsis,
        repo_url: repo_url?.trim() || demoSubmissionState.repo_url,
        demo_url: demo_url?.trim() || demoSubmissionState.demo_url,
        hosted_url: hosted_url?.trim() || demoSubmissionState.hosted_url,
        status,
        submitted_at: submittedAt,
        files: files && files.length > 0 ? files : demoSubmissionState.files,
      };

      return NextResponse.json({
        success: true,
        submissionId: 'demo-sub-1',
        status,
        message: is_final ? 'Project successfully submitted!' : 'Draft saved successfully.',
      });
    }

    const authData = await getCurrentUserTeam();
    if (!authData || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    if (!authData.team) {
      return NextResponse.json({ error: 'No team associated with this account.' }, { status: 403 });
    }

    const team = authData.team;
    const serviceClient = getServiceClient();

    // Check existing submission
    const { data: existingSub } = await serviceClient
      .from('submissions')
      .select('id, status')
      .eq('team_id', team.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSub && existingSub.status === 'submitted') {
      return NextResponse.json(
        { error: 'Your submission has already been finalized and locked.' },
        { status: 403 }
      );
    }

    // Validation for final submission
    if (is_final) {
      if (!project_name?.trim()) {
        return NextResponse.json({ error: 'Project title is required for final submission.' }, { status: 400 });
      }
      if (!track?.trim()) {
        return NextResponse.json({ error: 'Problem track selection is required.' }, { status: 400 });
      }
      if (!synopsis?.trim() || synopsis.trim().length < 50) {
        return NextResponse.json(
          { error: 'Project synopsis/abstract must be at least 50 characters long.' },
          { status: 400 }
        );
      }
      if (!repo_url?.trim()) {
        return NextResponse.json({ error: 'Repository URL is required.' }, { status: 400 });
      }
      if (!demo_url?.trim()) {
        return NextResponse.json({ error: 'Video demo URL is required.' }, { status: 400 });
      }

      try {
        new URL(repo_url);
        new URL(demo_url);
        if (hosted_url) new URL(hosted_url);
      } catch {
        return NextResponse.json({ error: 'Please enter valid URLs for your project links.' }, { status: 400 });
      }
    }

    const status = is_final ? 'submitted' : 'draft';
    const submittedAt = is_final ? new Date().toISOString() : null;

    let submissionId = existingSub?.id;

    if (submissionId) {
      const { error: updateError } = await serviceClient
        .from('submissions')
        .update({
          project_name: project_name?.trim() || null,
          track: track?.trim() || team.track,
          synopsis: synopsis?.trim() || null,
          repo_url: repo_url?.trim() || null,
          demo_url: demo_url?.trim() || null,
          hosted_url: hosted_url?.trim() || null,
          status,
          submitted_at: submittedAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      const { data: newSub, error: insertError } = await serviceClient
        .from('submissions')
        .insert({
          team_id: team.id,
          project_name: project_name?.trim() || `${team.team_name} Project`,
          track: track?.trim() || team.track,
          synopsis: synopsis?.trim() || null,
          repo_url: repo_url?.trim() || null,
          demo_url: demo_url?.trim() || null,
          hosted_url: hosted_url?.trim() || null,
          status,
          submitted_at: submittedAt,
        })
        .select()
        .single();

      if (insertError || !newSub) {
        return NextResponse.json({ error: insertError?.message || 'Failed to create submission.' }, { status: 500 });
      }
      submissionId = newSub.id;
    }

    if (files && Array.isArray(files) && files.length > 0) {
      for (const f of files) {
        if (f.file_name && f.file_path && f.file_type) {
          await serviceClient.from('submission_files').insert({
            submission_id: submissionId,
            file_name: f.file_name,
            file_type: f.file_type,
            file_path: f.file_path,
            file_size_bytes: f.file_size_bytes || 0,
            mime_type: f.mime_type || 'application/octet-stream',
          });
        }
      }
    }

    await logAuditEvent(
      authData.user.id,
      is_final ? 'submission_finalized' : 'submission_draft_saved',
      'submission',
      submissionId,
      { team_id: team.team_id, status },
      ip
    );

    return NextResponse.json({
      success: true,
      submissionId,
      status,
      message: is_final ? 'Project successfully submitted!' : 'Draft saved successfully.',
    });
  } catch (err: unknown) {
    console.error('[SUBMISSIONS/POST] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save submission.' },
      { status: 500 }
    );
  }
}
