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
    <footer className="relative bg-[#0d0b09] border-t-4 border-[#3d2c1c] text-neutral-300 font-terminal pt-16 pb-12 overflow-hidden">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Organizers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-[#5d8a2e] bg-[#1a2e14] flex items-center justify-center shadow-[inset_2px_2px_0_#7bb53b]">
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

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-terminal">
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
                  → 2 Rounds & 7 Tracks
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → Milestone Timeline
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → FY & Senior Tracks
                </a>
              </li>
              <li>
                <a href="#prizes" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → Championship Perks
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Action Links */}
          <div>
            <h4 className="font-pixel text-xs text-white uppercase tracking-wider mb-4">
              Actions
            </h4>
            <ul className="space-y-2 text-xs font-pixel text-neutral-400">
              <li>
                <a
                  href="https://unstop.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-amber-300 font-semibold"
                  data-interactive="true"
                >
                  ★ Register on Unstop ↗
                </a>
              </li>
              <li>
                <a href="#sponsors" className="hover:text-emerald-400 transition-colors" data-interactive="true">
                  → Sponsors & Partners
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

            <div className="mt-5">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 border-2 border-neutral-700 bg-neutral-900 px-3 py-2 font-pixel text-[9px] text-neutral-300 hover:text-white hover:border-emerald-500 transition-colors cursor-pointer"
                data-interactive="true"
              >
                <span>↑</span> BACK TO TOP
              </button>
            </div>
          </div>

          {/* Col 4: Official Socials & Community */}
          <div>
            <h4 className="font-pixel text-xs text-white uppercase tracking-wider mb-4">
              Social & Community
            </h4>
            <p className="font-terminal text-sm text-neutral-400 mb-3 leading-relaxed">
              Connect with fellow developers, coordinators, and receive official hackathon alerts:
            </p>

            <div className="space-y-2.5">
              {/* WhatsApp Community */}
              <a
                href="https://chat.whatsapp.com/HCoLTsCSoQ2J6N35w1eh1A"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 bg-[#0b2416] hover:bg-[#103320] border-2 border-[#15803d] transition-all group shadow-[inset_1px_1px_0_rgba(255,255,255,0.15),0_2px_0_#052e16] hover:-translate-y-0.5"
                data-interactive="true"
                title="Join Official WhatsApp Community"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-[#22c55e]/20 border border-[#22c55e]/60 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 fill-[#22c55e]" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-pixel text-[9px] text-emerald-200 block font-bold leading-tight">
                      WhatsApp Community
                    </span>
                    <span className="font-terminal text-xs text-neutral-400 block">
                      Official Discussion Hub
                    </span>
                  </div>
                </div>
                <span className="font-pixel text-[8px] text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  JOIN ↗
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/astra_mitaoe/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 bg-[#260f1d] hover:bg-[#38162b] border-2 border-[#be185d] transition-all group shadow-[inset_1px_1px_0_rgba(255,255,255,0.15),0_2px_0_#500724] hover:-translate-y-0.5"
                data-interactive="true"
                title="Follow on Instagram"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-[#ec4899]/20 border border-[#ec4899]/60 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 fill-[#ec4899]" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-pixel text-[9px] text-pink-200 block font-bold leading-tight">
                      Instagram
                    </span>
                    <span className="font-terminal text-xs text-neutral-400 block">
                      @astra_mitaoe
                    </span>
                  </div>
                </div>
                <span className="font-pixel text-[8px] text-pink-400 group-hover:translate-x-0.5 transition-transform">
                  FOLLOW ↗
                </span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/school/mit-academy-of-engineering/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 bg-[#0b2034] hover:bg-[#122e49] border-2 border-[#0284c7] transition-all group shadow-[inset_1px_1px_0_rgba(255,255,255,0.15),0_2px_0_#082f49] hover:-translate-y-0.5"
                data-interactive="true"
                title="Connect on LinkedIn"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-[#38bdf8]/20 border border-[#38bdf8]/60 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 fill-[#38bdf8]" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-pixel text-[9px] text-sky-200 block font-bold leading-tight">
                      LinkedIn
                    </span>
                    <span className="font-terminal text-xs text-neutral-400 block">
                      MIT Academy of Engineering
                    </span>
                  </div>
                </div>
                <span className="font-pixel text-[8px] text-sky-400 group-hover:translate-x-0.5 transition-transform">
                  CONNECT ↗
                </span>
              </a>
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
          <div className="mt-3 pt-2 border-t border-[#2b1f15] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="font-terminal text-sm text-neutral-300">
              📍 Dehu Phata, Alandi (Dandi), Pune, Maharashtra - 412105, India
            </span>
            <span className="font-pixel text-[9px] text-emerald-400 font-bold uppercase tracking-wide">
              ROUND 2: OFFLINE GRAND FINALE • 17TH NOV 2026
            </span>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
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
