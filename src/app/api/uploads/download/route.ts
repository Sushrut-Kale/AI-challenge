// ============================================================================
// AGENTCRAFT — Presigned Download URL API Route
// Generates short-lived Cloudflare R2 presigned URLs for downloading submission files
// GET /api/uploads/download?fileId=...
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserTeam, getServiceClient } from '@/lib/supabase-server';
import { getPresignedDownloadUrl } from '@/lib/r2-storage';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('agentcraft_demo_session')?.value;

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'fileId parameter is required.' }, { status: 400 });
    }

    if (demoRole === 'admin' || demoRole === 'team') {
      return NextResponse.json({
        downloadUrl: `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`,
        fileName: 'Submission_Document.pdf',
        isMock: true,
      });
    }

    const authData = await getCurrentUserTeam();
    if (!authData || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const serviceClient = getServiceClient();
    const { data: file, error: fileError } = await serviceClient
      .from('submission_files')
      .select('*, submission:submissions(team_id)')
      .eq('id', fileId)
      .single();

    if (fileError || !file) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    // Check authorization: admin or owner team
    if (!authData.isAdmin) {
      if (!authData.team || file.submission?.team_id !== authData.team.id) {
        return NextResponse.json({ error: 'Forbidden: you cannot download this file.' }, { status: 403 });
      }
    }

    // If R2 is not configured, return mock URL
    if (
      !process.env.R2_ACCOUNT_ID ||
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.R2_BUCKET_NAME
    ) {
      return NextResponse.json({
        downloadUrl: `https://mock-storage.agentcraft.local/${file.file_path}`,
        fileName: file.file_name,
        isMock: true,
      });
    }

    const downloadUrl = await getPresignedDownloadUrl(file.file_path);

    return NextResponse.json({
      downloadUrl,
      fileName: file.file_name,
      isMock: false,
    });
  } catch (err: unknown) {
    console.error('[UPLOADS/DOWNLOAD] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate download URL.' },
      { status: 500 }
    );
  }
}
