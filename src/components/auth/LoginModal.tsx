'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { playMinecraftClick, playMinecraftPop } from '@/components/ui/MinecraftAudioManager';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both team email and password.');
      return;
    }

    setIsLoading(true);
    playMinecraftClick();

    try {
      if (!isSupabaseConfigured) {
        // Mock successful validation for development when Supabase keys are not set yet
        setTimeout(() => {
          setIsLoading(false);
          setSuccessMessage('ACCESS GRANTED — Welcome to the AGENTCRAFT Portal! (Supabase client ready)');
          playMinecraftPop(1.4);
        }, 800);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setIsLoading(false);

      if (error) {
        setErrorMessage(error.message);
      } else if (data.user) {
        setSuccessMessage(`ACCESS GRANTED — Welcome, ${data.user.email}!`);
        playMinecraftPop(1.5);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
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
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[#2b1f16] border-2 border-[#54381e] text-neutral-400 hover:text-amber-400 hover:border-amber-400 transition-colors font-pixel text-xs"
          data-interactive="true"
        >
          ✕
        </button>

        {/* Header with Minecraft Icon */}
        <div className="text-center mb-6">
          <div className="relative w-12 h-12 mx-auto mb-3">
            <Image
              src="/assets/items/ender_eye.png"
              alt="Ender Eye"
              fill
              className="object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <h2
            id="login-modal-title"
            className="font-pixel text-sm sm:text-base text-amber-300 uppercase tracking-wider mb-2 font-bold"
          >
            PARTICIPANT LOGIN
          </h2>
          <p className="font-sans text-xs text-neutral-300 leading-relaxed">
            Enter the authorized team credentials provided by the AGENTCRAFT organizing committee.
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/80 border-2 border-red-600 text-red-200 font-sans text-xs flex items-center gap-2">
            <span>⚠</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 font-sans text-xs flex items-center gap-2">
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-1.5">
              TEAM EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="team@agentcraft.ai"
              className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 placeholder-neutral-600 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
            />
          </div>

          <div>
            <label className="block font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-1.5">
              ACCESS PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 placeholder-neutral-600 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-[#78350f] font-pixel text-xs text-[#1a1206] font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4),0_4px_0_#451a03] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-50"
              data-interactive="true"
            >
              {isLoading ? 'AUTHENTICATING...' : 'LOGIN TO ARENA ➔'}
            </button>
          </div>
        </form>

        {/* Security Note */}
        <div className="mt-5 pt-3 border-t border-[#2e2116] text-center">
          <p className="font-pixel text-[7px] text-neutral-500 uppercase tracking-wider">
            POWERED BY SUPABASE AUTH • MIT AOE AGENTCRAFT 2026
          </p>
        </div>
      </div>
    </div>
  );
}
