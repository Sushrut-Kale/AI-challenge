// ============================================================================
// AGENTCRAFT — Logout API Route
// POST /api/auth/logout
// ============================================================================

import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('agentcraft_demo_session');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const supabase = await getServerClient();
      await supabase.auth.signOut();
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
