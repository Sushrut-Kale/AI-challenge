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
  const { contact, organizers, details, prizes } = EVENT_DATA;

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
              SY, TY, B.Tech student developers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://chat.whatsapp.com/HCoLTsCSoQ2J6N35w1eh1A"
                target="_blank"
                rel="noopener noreferrer"
                className="mc-shine inline-flex items-center gap-2 px-6 py-3.5 bg-[#10b981] hover:bg-[#059669] border-2 border-[#047857] font-pixel text-xs sm:text-sm text-black font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),0_4px_0_#064e3b] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                data-interactive="true"
              >
                <span>💬</span>
                <span>WHATSAPP REGISTRATION DESK ↗</span>
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
    </SectionContainer>
  );
}
