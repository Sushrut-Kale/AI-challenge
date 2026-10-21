'use client';

import React from 'react';
import Image from 'next/image';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import MinecraftButton from '@/components/ui/MinecraftButton';
import { EVENT_DATA } from '@/data/event';

export default function ContactSection() {
  const { contact, organizers, details, prizes, registration } = EVENT_DATA;

  return (
    <SectionContainer id="contact" variant="default" showTopSeam>
      {/* Registration Anchor Card with Nether Portal Frame (Section Effect) */}
      <div id="registration" className="mb-20 scroll-mt-24 relative">
        {/* Obsidian Portal Corner Bricks */}
        <div className="pointer-events-none absolute -top-2 -left-2 w-4 h-4 bg-[#140b20] border-2 border-[#3b1762] z-20" />
        <div className="pointer-events-none absolute -top-2 -right-2 w-4 h-4 bg-[#140b20] border-2 border-[#3b1762] z-20" />
        <div className="pointer-events-none absolute -bottom-2 -left-2 w-4 h-4 bg-[#140b20] border-2 border-[#3b1762] z-20" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 w-4 h-4 bg-[#140b20] border-2 border-[#3b1762] z-20" />

        <div className="max-w-4xl mx-auto p-6 sm:p-10 border-4 border-[#3b1762] bg-[#12081f] shadow-[0_0_30px_rgba(168,85,247,0.25)] relative overflow-hidden text-center animate-portal-swirl">
          <div className="pointer-events-none absolute inset-1.5 border-2 border-[#581c87]/60" />

          <div className="relative z-10 flex flex-col items-center">
            <PixelBadge variant="gold" icon="🔮" className="mb-4">
              OFFICIAL REGISTRATION DESK
            </PixelBadge>

            <h3 className="font-pixel text-xl sm:text-3xl text-amber-300 uppercase tracking-wider mb-2">
              AGENTCRAFT REGISTRATION
            </h3>

            <p className="font-pixel text-xs text-emerald-400 mb-4">
              ENTRY: {details.registrationFee} • DEADLINE: {details.registrationDeadline}
            </p>

            <p className="font-terminal text-base sm:text-lg text-amber-100/90 max-w-xl mx-auto leading-relaxed mb-6">
              Compete for exclusive <strong>championship awards</strong> and career-defining{' '}
              <strong>internship opportunities</strong>. Open to FY innovators (separate track) and
              SY, TY & Open to All student developers.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
              <a
                href={registration.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mc-shine inline-flex items-center gap-2 px-6 py-3.5 bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-[#b45309] font-pixel text-xs sm:text-sm text-[#1a1206] font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),0_4px_0_#78350f] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
                data-interactive="true"
                title="Fill Official Google Registration Form"
              >
                <span>📝</span>
                <span>REGISTER TEAM NOW (FORM) ↗</span>
              </a>

              {registration.unstopUrl && (
                <a
                  href={registration.unstopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mc-shine inline-flex items-center gap-2 px-5 py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] border-2 border-[#1e40af] font-pixel text-xs sm:text-sm text-white font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_rgba(255,255,255,0.3),0_4px_0_#172554] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
                  data-interactive="true"
                  title="View & Register on Unstop"
                >
                  <span>🏆</span>
                  <span>UNSTOP PORTAL ↗</span>
                </a>
              )}

              <a
                href="https://chat.whatsapp.com/HCoLTsCSoQ2J6N35w1eh1A"
                target="_blank"
                rel="noopener noreferrer"
                className="mc-shine inline-flex items-center gap-2 px-5 py-3.5 bg-[#10b981] hover:bg-[#059669] border-2 border-[#047857] font-pixel text-xs sm:text-sm text-black font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),0_4px_0_#064e3b] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
                data-interactive="true"
              >
                <span>💬</span>
                <span>WHATSAPP DESK ↗</span>
              </a>

              <MinecraftButton
                variant="gold"
                size="lg"
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
              >
                CALL DESK ({contact.name})
              </MinecraftButton>
            </div>
          </div>
        </div>
      </div>

      <SectionHeading
        tag="REACH THE COORDINATORS"
        title="VENUE & CONTACT"
        subtitle="Direct inquiries regarding AGENTCRAFT team registrations, offline final venue, or mentorship."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Campus Venue in Minecraft Frame */}
        <div className="mc-arena-frame p-5 sm:p-6 shadow-[0_12px_28px_rgba(0,0,0,0.85)]">
          {/* Top Slot Header Bar */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#3b1c10]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-[#583d29] bg-[#2a1d12] flex items-center justify-center p-1 shadow-inner">
                <Image
                  src="/assets/items/compass.png"
                  alt="Compass"
                  width={28}
                  height={28}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h3 className="font-pixel text-xs sm:text-sm text-white uppercase tracking-wider font-bold">
                Campus Venue
              </h3>
            </div>
            <PixelBadge variant="emerald">OFFLINE FINALE</PixelBadge>
          </div>

          <div>
            <h4 className="font-pixel text-xs sm:text-sm text-amber-300 mb-2 font-bold">
              {organizers.institution.name}
            </h4>
            <p className="font-terminal text-sm sm:text-base text-neutral-200 leading-relaxed mb-4 font-medium">
              {contact.venueAddress}
            </p>
            <div className="p-3 bg-black/60 border border-[#3b1c10] font-pixel text-[9px] text-neutral-400 leading-relaxed">
              {organizers.institution.affiliation}
            </div>
          </div>
        </div>

        {/* Official Contact Desk in Minecraft Frame */}
        <div className="mc-arena-frame p-5 sm:p-6 shadow-[0_12px_28px_rgba(0,0,0,0.85)]">
          {/* Top Slot Header Bar */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#3b1c10]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-[#583d29] bg-[#2a1d12] flex items-center justify-center p-1 text-lg shadow-inner">
                📞
              </div>
              <h3 className="font-pixel text-xs sm:text-sm text-white uppercase tracking-wider font-bold">
                Official Contact Desk
              </h3>
            </div>
            <PixelBadge variant="gold">STUDENT COORDINATOR</PixelBadge>
          </div>

          <div className="space-y-4 font-terminal text-base">
            <div>
              <span className="font-pixel text-[9px] text-neutral-400 block uppercase mb-1">
                Contact Person
              </span>
              <span className="font-pixel text-sm text-amber-300 font-bold">
                {contact.name}
              </span>
            </div>

            <div>
              <span className="font-pixel text-[9px] text-neutral-400 block uppercase mb-1">
                Phone Helpline
              </span>
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className="font-pixel text-xs sm:text-sm text-emerald-400 hover:underline block font-bold"
                data-interactive="true"
              >
                {contact.phone}
              </a>
            </div>

            <div>
              <span className="font-pixel text-[9px] text-neutral-400 block uppercase mb-1">
                Official Email
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="font-terminal text-sm sm:text-base text-sky-400 hover:text-sky-300 hover:underline block font-bold break-all"
                data-interactive="true"
              >
                {contact.email}
              </a>
            </div>

            <div>
              <span className="font-pixel text-[9px] text-neutral-400 block uppercase mb-1">
                Organizing Chapter
              </span>
              <p className="text-xs text-neutral-200 font-medium">
                {organizers.lead} in association with AlgoVedas & AAAI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SOCIAL & COMMUNITY (HORIZONTAL SECTION) ================= */}
      <div id="socials" className="mt-16 pt-12 border-t-2 border-[#3b1c10]/80 max-w-5xl mx-auto scroll-mt-24">
        <div className="text-center mb-8">
          <h3 className="font-pixel text-xl sm:text-2xl text-white uppercase tracking-wider mb-2">
            SOCIAL & COMMUNITY
          </h3>
          <p className="font-terminal text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto">
            Connect with fellow developers, coordinators, and receive official hackathon alerts:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* WhatsApp Community */}
          <a
            href="https://chat.whatsapp.com/HCoLTsCSoQ2J6N35w1eh1A"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 sm:p-4 bg-[#0a1910] hover:bg-[#0f2418] border-2 border-[#10b981] transition-all group shadow-[inset_1px_1px_0_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:translate-y-0.5 cursor-pointer"
            data-interactive="true"
            title="Join WhatsApp Community"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#10b981]/20 border border-[#10b981]/70 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-[#10b981]" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-pixel text-[11px] sm:text-xs text-[#e6f4ea] block font-bold truncate">
                  WhatsApp Community
                </span>
                <span className="font-terminal text-sm sm:text-base text-neutral-300 block truncate">
                  Official Discussion Hub
                </span>
              </div>
            </div>
            <span className="font-pixel text-[9px] sm:text-[10px] text-[#34d399] shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform font-bold">
              JOIN ↗
            </span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/astra_mitaoe/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 sm:p-4 bg-[#1a0c16] hover:bg-[#26101f] border-2 border-[#ec4899] transition-all group shadow-[inset_1px_1px_0_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:translate-y-0.5 cursor-pointer"
            data-interactive="true"
            title="Follow on Instagram"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#ec4899]/20 border border-[#ec4899]/70 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-[#ec4899]" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-pixel text-[11px] sm:text-xs text-[#fce7f3] block font-bold truncate">
                  Instagram
                </span>
                <span className="font-terminal text-sm sm:text-base text-neutral-300 block truncate">
                  @astra_mitaoe
                </span>
              </div>
            </div>
            <span className="font-pixel text-[9px] sm:text-[10px] text-[#f472b6] shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform font-bold">
              FOLLOW ↗
            </span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/school/mit-academy-of-engineering/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 sm:p-4 bg-[#0a1826] hover:bg-[#102438] border-2 border-[#0284c7] transition-all group shadow-[inset_1px_1px_0_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:translate-y-0.5 cursor-pointer"
            data-interactive="true"
            title="Connect on LinkedIn"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#38bdf8]/20 border border-[#38bdf8]/70 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-[#38bdf8]" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-pixel text-[11px] sm:text-xs text-[#e0f2fe] block font-bold truncate">
                  LinkedIn
                </span>
                <span className="font-terminal text-sm sm:text-base text-neutral-300 block truncate">
                  MIT Academy of Engineering
                </span>
              </div>
            </div>
            <span className="font-pixel text-[9px] sm:text-[10px] text-[#38bdf8] shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform font-bold">
              CONNECT ↗
            </span>
          </a>
        </div>
      </div>
    </SectionContainer>
  );
}
