// ============================================================================
// AGENTCRAFT — Server-Side Supabase Client
// Used in API routes and server components. Never import this in client code.
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// ----- Environment validation -----

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Check your .env.local or Vercel environment settings.`
    );
  }
  return value;
}

// ----- Service Role Client -----
// Full admin access. NEVER expose in client code.
// Used for: creating auth users, admin operations, bypassing RLS.

let _serviceClient: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (_serviceClient) return _serviceClient;

  const url = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

  _serviceClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _serviceClient;
}

// ----- Server Client (with cookie-based auth) -----
// Respects the currently authenticated user's session via cookies.
// Used for: RLS-protected queries in API routes.

export async function getServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll can fail in Server Components (read-only cookies)
            // This is expected — session refresh will happen in middleware
          }
        },
      },
    }
  );
}

// ----- Auth Helpers -----

export async function getCurrentUser() {
  const supabase = await getServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getCurrentUserTeam() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isAdmin = user.app_metadata?.role === 'admin';
  if (isAdmin) return { user, team: null, isAdmin: true as const };

  const supabase = getServiceClient();
  const { data: team } = await supabase
    .from('teams')
    .select('*, members:team_members(*)')
    .eq('auth_user_id', user.id)
    .single();

  return { user, team, isAdmin: false as const };
}

export function isAdminUser(user: { app_metadata?: Record<string, unknown> }): boolean {
  return user.app_metadata?.role === 'admin';
}

// ----- Audit Logging -----

export async function logAuditEvent(
  actorId: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  details?: Record<string, unknown>,
  ipAddress?: string
) {
  try {
    const supabase = getServiceClient();
    await supabase.from('audit_log').insert({
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || null,
      ip_address: ipAddress || null,
    });
  } catch (err) {
    // Audit logging should never crash the main operation
    console.error('[AUDIT] Failed to log event:', action, err);
  }
}
