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
    <footer className="relative bg-[#0d0b09] border-t-4 border-[#3d2c1c] text-neutral-300 font-terminal pt-14 pb-20 sm:pb-24 overflow-hidden">
      {/* Decorative Minecraft Grass Strip */}
      <div
        className="absolute top-0 inset-x-0 h-2 border-b border-[#281d14]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #5d8a2e 0px, #5d8a2e 12px, #3d5a1e 12px, #3d5a1e 24px, #7bb53b 24px, #7bb53b 36px)',
          imageRendering: 'pixelated',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-white/10">
          {/* Col 1: Brand & Organizers */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-[#5d8a2e] bg-[#1a2e14] flex items-center justify-center shadow-[inset_2px_2px_0_#7bb53b] shrink-0">
                <span className="font-pixel text-xs text-white">AC</span>
              </div>
              <div>
                <h3 className="font-pixel text-xs sm:text-sm text-white tracking-wider">
                  {EVENT_DATA.name}
                </h3>
                <p className="text-[10px] text-emerald-400 font-pixel mt-0.5">
                  {EVENT_DATA.subtitle}
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-terminal max-w-xl">
              Organized by <strong>ASTRA Student Association</strong> (Department of CSE-AIML) in association with{' '}
              <strong>AAAI Global Professional Chapter</strong> and <strong>AlgoVedas</strong> at{' '}
              <strong>{organizers.institution.name}</strong>, Alandi, Pune.
            </p>

            <div className="text-sm text-neutral-400 space-y-1 font-terminal">
              <p>📍 {contact.venueAddress}</p>
              <p>📞 Contact: {contact.name} ({contact.phone})</p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="sm:col-span-1 lg:col-span-3 lg:pl-4">
            <h4 className="font-pixel text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-emerald-400">❖</span> Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-pixel text-neutral-400">
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5" data-interactive="true">
                  <span>→</span> About Event
                </a>
              </li>
              <li>
                <a href="#rounds" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5" data-interactive="true">
                  <span>→</span> 2 Rounds & 7 Tracks
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5" data-interactive="true">
                  <span>→</span> Milestone Timeline
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5" data-interactive="true">
                  <span>→</span> FY & Senior Tracks
                </a>
              </li>
              <li>
                <a href="#prizes" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5" data-interactive="true">
                  <span>→</span> Championship Perks
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Actions & Quick Links */}
          <div className="sm:col-span-1 lg:col-span-4 lg:pl-4 flex flex-col justify-between">
            <div>
              <h4 className="font-pixel text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-amber-400">★</span> Quick Actions
              </h4>
              <ul className="space-y-2.5 text-xs font-pixel text-neutral-400">
                <li>
                  <a
                    href="https://unstop.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition-colors text-amber-400 font-bold inline-flex items-center gap-1.5"
                    data-interactive="true"
                  >
                    <span>★</span> Register on Unstop ↗
                  </a>
                </li>
                <li>
                  <a href="#sponsors" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5" data-interactive="true">
                    <span>→</span> Sponsors & Partners
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5" data-interactive="true">
                    <span>→</span> FAQs
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5" data-interactive="true">
                    <span>→</span> Reach Coordinators
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 border-2 border-neutral-700 bg-neutral-900/90 hover:bg-neutral-800 px-4 py-2.5 font-pixel text-[9px] text-neutral-300 hover:text-white hover:border-emerald-500 transition-all cursor-pointer shadow-[inset_1px_1px_0_rgba(255,255,255,0.1)] active:translate-y-0.5"
                data-interactive="true"
              >
                <span>↑</span> BACK TO TOP
              </button>
            </div>
          </div>
        </div>

        {/* ================= MIT ACADEMY OF ENGINEERING GOOGLE MAP HOLDER ================= */}
        <div className="my-10 p-4 sm:p-6 bg-[#16120d] border-4 border-[#3d2c1c] shadow-[inset_2px_2px_0_#543c26,inset_-2px_-2px_0_#0d0a08,0_16px_36px_rgba(0,0,0,0.85)]">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b-2 border-[#3d2c1c]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#7a4e23] bg-[#2a1d12] flex items-center justify-center p-1 shadow-inner shrink-0">
                <span className="text-base select-none">🗺️</span>
              </div>
              <div>
                <h4 className="font-pixel text-xs sm:text-sm text-amber-300 uppercase tracking-wider font-bold">
                  CAMPUS LOCATION & OFFLINE FINALE VENUE
                </h4>
                <p className="font-terminal text-xs sm:text-sm text-neutral-400">
                  MIT Academy of Engineering (MITAOE) • Dehu Phata, Alandi, Pune
                </p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=MIT+Academy+of+Engineering+Alandi+Pune"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-[#78350f] font-pixel text-[9px] text-[#1a1206] font-bold uppercase tracking-wider shadow-[0_2px_0_#451a03] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer shrink-0"
              data-interactive="true"
              title="Open full interactive map on Google Maps"
            >
              <span>🧭</span>
              <span>OPEN IN GOOGLE MAPS ↗</span>
            </a>
          </div>

          {/* Embedded Google Map Holder */}
          <div className="relative w-full h-64 sm:h-72 md:h-80 border-2 border-[#2b1f15] bg-[#0c0906] overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.625367683933!2d73.8863146!3d18.6756615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c86423086771%3A0x8673f4439c093aee!2sMIT%20Academy%20of%20Engineering!5e0!3m2!1sen!2sin!4v1729420000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MIT Academy of Engineering Campus Location Map"
              className="w-full h-full filter contrast-105 brightness-95"
            />
          </div>

          {/* Bottom Venue Footer Bar */}
          <div className="mt-3 pt-2.5 border-t border-[#2b1f15] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="font-terminal text-sm text-neutral-300">
              📍 Dehu Phata, Alandi (Dandi), Pune, Maharashtra - 412105, India
            </span>
            <span className="font-pixel text-[9px] text-emerald-400 font-bold uppercase tracking-wide">
              ROUND 2: OFFLINE GRAND FINALE • 17TH NOV 2026
            </span>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} {EVENT_DATA.name} • {organizers.lead} &amp; {organizers.institution.name}.
          </p>
          <p className="text-[11px] text-neutral-600 text-center sm:text-right max-w-md">
            Educational innovation hackathon. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}
