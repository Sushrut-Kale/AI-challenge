// ============================================================================
// AGENTCRAFT — Presigned Upload URL API Route
// Generates short-lived Cloudflare R2 presigned URLs for client-side direct upload
// POST /api/uploads/presign
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserTeam, getServiceClient } from '@/lib/supabase-server';
import {
  validateFile,
  generateObjectKey,
  getPresignedUploadUrl,
} from '@/lib/r2-storage';

import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('agentcraft_demo_session')?.value;

    const authData = await getCurrentUserTeam();
    if (!authData || !authData.user) {
      if (demoRole !== 'team' && demoRole !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
      }
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Missing request body.' }, { status: 400 });
    }

    const { fileName, mimeType, fileSize, fileType, submissionId } = body;

    if (!fileName || !mimeType || typeof fileSize !== 'number' || !fileType) {
      return NextResponse.json(
        { error: 'fileName, mimeType, fileSize, and fileType are required.' },
        { status: 400 }
      );
    }

    // Validate file against security restrictions
    const validation = validateFile(fileName, mimeType, fileSize, fileType);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const serviceClient = getServiceClient();

    // Determine team authorization
    let teamId = 'ADMIN';
    if (!authData?.isAdmin) {
      if (demoRole === 'team') {
        teamId = 'AC-001';
      } else if (!authData?.team) {
        return NextResponse.json({ error: 'No team associated with this account.' }, { status: 403 });
      } else {
        teamId = authData.team.team_id;
      }

      // Check deadline
      const deadlineStr = process.env.SUBMISSION_DEADLINE || '2026-11-02T23:59:59+05:30';
      const deadline = new Date(deadlineStr);
      if (Date.now() > deadline.getTime()) {
        return NextResponse.json(
          { error: 'The submission deadline has passed. File uploads are locked.' },
          { status: 403 }
        );
      }

      // Check if team already has a finalized submission
      if (authData?.team) {
        const { data: teamSub } = await serviceClient
          .from('submissions')
          .select('id, team_id, status')
          .eq('team_id', authData.team.id)
          .eq('status', 'submitted')
          .limit(1)
          .maybeSingle();

        if (teamSub) {
          return NextResponse.json(
            { error: 'Your team submission has already been finalized and locked. Uploads are permanently prohibited.' },
            { status: 403 }
          );
        }
      }
    }

    const subId = submissionId || 'draft';
    const objectKey = generateObjectKey(teamId, subId, fileType, fileName);

    // If R2 is not configured, return a mock upload URL for development/demo
    if (
      !process.env.R2_ACCOUNT_ID ||
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.R2_BUCKET_NAME
    ) {
      return NextResponse.json({
        uploadUrl: `https://mock-storage.agentcraft.local/${objectKey}?mock=true`,
        objectKey,
        isMock: true,
      });
    }

    const uploadUrl = await getPresignedUploadUrl(objectKey, mimeType, fileSize);

    return NextResponse.json({
      uploadUrl,
      objectKey,
      isMock: false,
    });
  } catch (err: unknown) {
    console.error('[UPLOADS/PRESIGN] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate upload URL.' },
      { status: 500 }
    );
  }
}
