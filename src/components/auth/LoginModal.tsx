'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { playMinecraftClick, playMinecraftPop } from '@/components/ui/MinecraftAudioManager';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const { refreshTeam } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier) {
      setErrorMessage('Please enter your Team ID or registered email.');
      return;
    }

    if (!isResetMode && !password) {
      setErrorMessage('Please enter your access password.');
      return;
    }

    setIsLoading(true);
    playMinecraftClick();

    try {
      if (isResetMode) {
        // Password reset flow
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier }),
        });
        const data = await res.json();
        setIsLoading(false);

        if (!res.ok) {
          setErrorMessage(data.error || 'Failed to request password reset.');
        } else {
          setSuccessMessage(data.message || 'Reset link dispatched! Please check your registered email.');
          playMinecraftPop(1.4);
        }
        return;
      }

      // Regular login flow
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
      } else {
        const destination = data.redirect || (data.isAdmin ? '/admin' : '/dashboard');
        const roleTitle = data.isAdmin ? 'Admin Desk' : 'Team Command Centre';
        setSuccessMessage(`ACCESS GRANTED — Loading ${roleTitle}...`);
        playMinecraftPop(1.5);

        await refreshTeam();

        setTimeout(() => {
          onClose();
          window.location.href = destination;
        }, 500);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed. Please check network.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playMinecraftClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Minecraft GUI Window Container */}
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-[#1a140f] border-4 border-[#3d2e20] shadow-[inset_2px_2px_0_#5a3d24,inset_-2px_-2px_0_#0d0a08,0_24px_64px_rgba(0,0,0,0.95)]">
        {/* Close Button */}
        <button
          onClick={() => {
            playMinecraftClick();
            onClose();
          }}
          type="button"
          aria-label="Close Login Modal"
          className="absolute top-3 right-3 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center bg-[#2b1f16] border-2 border-[#54381e] text-neutral-400 hover:text-amber-400 hover:border-amber-400 transition-colors font-pixel text-xs cursor-pointer select-none"
          data-interactive="true"
        >
          ✕
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-[#2b1f16] border-2 border-[#54381e] mb-3 shadow-[inset_1px_1px_0_#6b4928]">
            <Image
              src="/assets/sword.png"
              alt="Sword"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <h2
            id="login-modal-title"
            className="font-pixel text-base sm:text-lg text-amber-300 tracking-wider uppercase"
            style={{
              textShadow:
                '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
            }}
          >
            {isResetMode ? 'RESET ACCESS' : 'TEAM PORTAL'}
          </h2>
          <p className="mt-1 font-sans text-xs text-neutral-400">
            {isResetMode
              ? 'Enter your registered email or Team ID to receive a reset link'
              : 'Sign in with your Team ID (e.g. AC-001) or Admin'}
          </p>
        </div>

        {/* Error / Success Banners */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/80 border-2 border-red-700/80 text-red-200 font-sans text-xs leading-relaxed flex items-start gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
            <span className="font-pixel text-[10px] text-red-400 shrink-0">!</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/80 border-2 border-emerald-600 text-emerald-200 font-sans text-xs leading-relaxed flex items-start gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
            <span className="font-pixel text-[10px] text-emerald-400 shrink-0">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login / Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-1.5">
              TEAM ID OR USERNAME / EMAIL
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="AC-001 or admin"
              className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 placeholder-neutral-600 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
            />
          </div>

          {!isResetMode && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest">
                  ACCESS PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(true);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-pixel text-[8px] text-neutral-400 hover:text-amber-300 transition-colors"
                >
                  FORGOT?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 placeholder-neutral-600 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 min-h-[44px] bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-[#78350f] font-pixel text-xs text-[#1a1206] font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4),0_4px_0_#451a03] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-50 cursor-pointer select-none"
              data-interactive="true"
            >
              {isLoading
                ? 'AUTHENTICATING...'
                : isResetMode
                ? 'SEND RESET LINK ➔'
                : 'LOGIN TO ARENA ➔'}
            </button>
          </div>

          {isResetMode && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-pixel text-[9px] text-amber-400 hover:underline"
              >
                ← BACK TO LOGIN
              </button>
            </div>
          )}
        </form>

        {/* Security Note */}
        <div className="mt-5 pt-3 border-t border-[#2e2116] text-center">
          <p className="font-pixel text-[7px] text-neutral-500 uppercase tracking-wider">
            AGENTCRAFT 2026 • MIT AOE NATIONAL AI CHALLENGE
          </p>
        </div>
      </div>
    </div>
  );
}
