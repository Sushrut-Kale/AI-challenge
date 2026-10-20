// ============================================================================
// AGENTCRAFT — Next.js Middleware
// Protects /dashboard and /admin routes. Supports Supabase and local dev demo sessions.
// ============================================================================

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard and /admin routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check demo session cookie for local preview
  const demoRole = request.cookies.get('agentcraft_demo_session')?.value;
  if (demoRole === 'admin') {
    return NextResponse.next();
  }
  if (demoRole === 'team') {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured and no demo session, redirect to home with login prompt
  if (!supabaseUrl || !supabaseAnonKey) {
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('login', 'required');
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('login', 'required');
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      user.email?.toLowerCase() === 'admin@agentcraft.ai';
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
