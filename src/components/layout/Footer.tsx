'use client';

import React from 'react';
import { EVENT_DATA } from '@/data/event';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const { organizers, contact } = EVENT_DATA;

  return (
    <footer className="relative bg-[#07090e] border-t-4 border-[#222838] text-neutral-400 font-sans pt-16 pb-12 overflow-hidden">
      {/* Decorative Minecraft Grass Strip */}
      <div
        className="absolute top-0 inset-x-0 h-2 border-b border-[#141824]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #5d8a2e 0px, #5d8a2e 12px, #3d5a1e 12px, #3d5a1e 24px, #7bb53b 24px, #7bb53b 36px)',
          imageRendering: 'pixelated',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Organizers */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-[#5d8a2e] bg-[#1a2e14] flex items-center justify-center shadow-[inset_2px_2px_0_#7bb53b]">
                <span className="font-pixel text-xs text-white">AC</span>
              </div>
              <div>
                <h3 className="font-pixel text-xs sm:text-sm text-white tracking-wider">
                  {EVENT_DATA.name}
                </h3>
                <p className="text-xs text-emerald-400 font-pixel mt-0.5">
                  {EVENT_DATA.subtitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-neutral-300 max-w-md leading-relaxed">
              Presented by <strong>{organizers.lead}</strong> in association with{' '}
              <strong>AlgoVedas</strong> and <strong>ASTRA</strong> at{' '}
              <strong>{organizers.institution.name}</strong>, Alandi, Pune.
            </p>

            <div className="text-xs text-neutral-400 space-y-1 font-sans">
              <p>📍 {contact.venueAddress}</p>
              <p>📞 Contact: {contact.name} ({contact.phone})</p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-pixel text-xs text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-pixel text-neutral-400">
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → About Event
                </a>
              </li>
              <li>
                <a href="#rounds" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → 2 Rounds
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → Milestone Timeline
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → FY & B.Tech Tracks
                </a>
              </li>
              <li>
                <a href="#prizes" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → ₹30K Prize Pool
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Actions & Top Button */}
          <div>
            <h4 className="font-pixel text-xs text-white uppercase tracking-wider mb-4">
              Action
            </h4>
            <ul className="space-y-2 text-xs font-pixel text-neutral-400">
              <li>
                <a href="#registration" className="hover:text-amber-400 transition-colors" data-interactive="true">
                  ★ Register (₹400 / Team)
                </a>
              </li>
              <li>
                <a href="#sponsors" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → Our Sponsors
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → Reach Coordinators
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 border-2 border-neutral-700 bg-neutral-900 px-3 py-2 font-pixel text-[9px] text-neutral-300 hover:text-white hover:border-emerald-500 transition-colors"
                data-interactive="true"
              >
                <span>↑</span> BACK TO TOP
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} {EVENT_DATA.name} • {organizers.lead} & {organizers.institution.name}.
          </p>
          <p className="text-[11px] text-neutral-600 text-center sm:text-right max-w-md">
            Educational innovation hackathon. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}
