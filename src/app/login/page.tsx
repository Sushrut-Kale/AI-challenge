'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { playMinecraftClick, playMinecraftPop } from '@/components/ui/MinecraftAudioManager';

export default function LoginPage() {
  const router = useRouter();
  const [teamEmail, setTeamEmail] = useState('aarav.sharma@mitaoe.ac.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    playMinecraftClick();

    setTimeout(() => {
      playMinecraftPop(1.5);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0d0906] flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-black">
      {/* Background motif */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, #381f0b 1px, transparent 1px), linear-gradient(to bottom, #381f0b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-[#1a1208] border-4 border-[#3d2e20] shadow-[inset_2px_2px_0_#5a3d24,0_24px_64px_rgba(0,0,0,0.95)] space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <div className="relative h-10 w-48 mx-auto">
              <Image
                src="/assets/agentcraft_navbar_logo.png"
                alt="AGENTCRAFT"
                fill
                className="object-contain drop-shadow"
                priority
              />
            </div>
          </Link>

          <div className="pt-2">
            <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest block font-bold">
              OFFICIAL TEAM PORTAL
            </span>
            <h1 className="font-pixel text-base sm:text-lg text-white uppercase tracking-wider font-bold">
              PARTICIPANT AUTHENTICATION
            </h1>
            <p className="font-sans text-xs text-neutral-300 mt-1">
              Sign in with credentials assigned to your registered team.
            </p>
          </div>
        </div>

        {/* Demo Fast-Login Notice */}
        <div className="p-3 bg-[#11261a] border border-emerald-500/80 text-emerald-200 text-xs flex items-center justify-between gap-2">
          <span>✓ Local Dev Environment Ready</span>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-2.5 py-1 bg-emerald-500 text-black font-pixel text-[9px] uppercase font-bold hover:bg-emerald-400"
          >
            Direct Access →
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-pixel text-[9px] text-amber-300 uppercase tracking-widest mb-1">
              REGISTERED TEAM LEADER EMAIL
            </label>
            <input
              type="email"
              required
              value={teamEmail}
              onChange={(e) => setTeamEmail(e.target.value)}
              placeholder="lead@mitaoe.ac.in"
              className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 font-sans text-sm outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block font-pixel text-[9px] text-amber-300 uppercase tracking-widest mb-1">
              ACCESS PASSWORD / TOKEN
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 font-sans text-sm outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-[#78350f] font-pixel text-xs text-black font-bold uppercase tracking-wider shadow-[0_4px_0_#451a03] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-50"
          >
            {isLoading ? 'AUTHENTICATING...' : 'ENTER TEAM DASHBOARD ➔'}
          </button>
        </form>

        <div className="pt-2 border-t border-[#312010] flex items-center justify-between text-xs text-neutral-400 font-pixel text-[9px]">
          <Link href="/" className="hover:text-amber-300 underline">
            ← Return to Home
          </Link>
          <a href="mailto:astra.cseaiml@mitaoe.ac.in" className="hover:text-amber-300 underline">
            Need Help? Contact Support ↗
          </a>
        </div>
      </div>
    </div>
  );
}
