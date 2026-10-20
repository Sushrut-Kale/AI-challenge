// ============================================================================
// AGENTCRAFT — Admin Submissions Review API Route
// GET: List all submissions with team data and attached files
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getServiceClient, isAdminUser } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { getAllDemoSubmissions } from '@/lib/demo-state';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('agentcraft_demo_session')?.value;

    const { searchParams } = new URL(request.url);
    const track = searchParams.get('track') || '';
    const status = searchParams.get('status') || '';

    if (demoRole === 'admin') {
      const demoSubs = getAllDemoSubmissions();
      let filtered = [...demoSubs];
      if (track) filtered = filtered.filter((s) => s.track === track);
      if (status) filtered = filtered.filter((s) => s.status === status);

      return NextResponse.json({
        submissions: filtered,
        stats: {
          total: demoSubs.length,
          submitted: demoSubs.filter((s) => s.status === 'submitted').length,
          draft: demoSubs.filter((s) => s.status === 'draft').length,
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
