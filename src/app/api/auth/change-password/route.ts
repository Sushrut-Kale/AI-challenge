// ============================================================================
// AGENTCRAFT — Change Password API Route
// POST /api/auth/change-password
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerClient, logAuditEvent } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const body = await request.json().catch(() => null);

    if (!body?.new_password) {
      return NextResponse.json(
        { error: 'New password is required.' },
        { status: 400 }
      );
    }

    const newPassword = String(body.new_password);
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const supabase = await getServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    await logAuditEvent(
      user.id,
      'password_changed',
      'auth',
      user.id,
      { user_id: user.id },
      ip
    );

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated.',
    });
  } catch (err) {
    console.error('[AUTH/CHANGE-PASSWORD] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
