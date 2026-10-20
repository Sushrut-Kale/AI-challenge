// ============================================================================
// AGENTCRAFT — Authentication Context Provider
// Provides session state, team data, login/logout functions to the entire app.
// ============================================================================

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Session, User } from '@supabase/supabase-js';
import type { TeamWithMembers } from '@/types/database';

interface AuthState {
  user: User | null;
  session: Session | null;
  team: TeamWithMembers | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsPasswordChange: boolean;
}

interface AuthContextType extends AuthState {
  loginWithTeamId: (teamId: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ error?: string }>;
  refreshTeam: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    team: null,
    isAdmin: false,
    isLoading: true,
    isAuthenticated: false,
    needsPasswordChange: false,
  });

  const supabaseRef = useRef(getBrowserClient());

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.user || null,
          session: null,
          team: data.team || null,
          isAdmin: Boolean(data.isAdmin),
          isLoading: false,
          isAuthenticated: true,
          needsPasswordChange: data.team?.password_changed === false,
        });
        return;
      }
    } catch {
      // ignore network errors
    }

    const supabase = supabaseRef.current;
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const isAdmin = session.user.app_metadata?.role === 'admin';
        setState({
          user: session.user,
          session,
          team: null,
          isAdmin,
          isLoading: false,
          isAuthenticated: true,
          needsPasswordChange: false,
        });
        return;
      }
    }

    setState({
      user: null,
      session: null,
      team: null,
      isAdmin: false,
      isLoading: false,
      isAuthenticated: false,
      needsPasswordChange: false,
    });
  }, []);

  useEffect(() => {
    checkAuth();

    const supabase = supabaseRef.current;
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            checkAuth();
          } else {
            setState({
              user: null,
              session: null,
              team: null,
              isAdmin: false,
              isLoading: false,
              isAuthenticated: false,
              needsPasswordChange: false,
            });
          }
        }
      );
      return () => subscription.unsubscribe();
    }
  }, [checkAuth]);

  const loginWithTeamId = useCallback(async (teamId: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: teamId, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Login failed' };
      }

      await checkAuth();
      return {};
    } catch {
      return { error: 'Network error. Please try again.' };
    }
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      const supabase = supabaseRef.current;
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore
    }
    setState({
      user: null,
      session: null,
      team: null,
      isAdmin: false,
      isLoading: false,
      isAuthenticated: false,
      needsPasswordChange: false,
    });
  }, []);

  const changePassword = useCallback(async (newPassword: string) => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Password change failed' };
      }

      setState(prev => ({
        ...prev,
        needsPasswordChange: false,
        team: prev.team ? { ...prev.team, password_changed: true } : null,
      }));

      return {};
    } catch {
      return { error: 'Network error. Please try again.' };
    }
  }, []);

  const refreshTeam = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginWithTeamId,
        logout,
        changePassword,
        refreshTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
