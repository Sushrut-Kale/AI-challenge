'use client';

import React from 'react';
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
      {/* Registration Anchor Card */}
      <div id="registration" className="mb-20 scroll-mt-24">
        <div className="max-w-4xl mx-auto p-6 sm:p-10 border-4 border-[#3a2816] bg-[#1a1208] shadow-[0_16px_36px_rgba(0,0,0,0.85)] relative overflow-hidden text-center">
          <div className="pointer-events-none absolute inset-1.5 border-2 border-[#543b22]" />

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

            <p className="font-sans text-sm sm:text-base text-amber-100/90 max-w-xl mx-auto leading-relaxed mb-6">
              Compete for the <strong>{prizes.totalPool}</strong> prize pool and exclusive{' '}
              <strong>internship opportunities</strong>. Open to FY innovators (separate track) and
              SY, TY, B.Tech student developers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <MinecraftButton
                variant="gold"
                size="lg"
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
              >
                CONTACT DESK ({contact.name})
              </MinecraftButton>

              <MinecraftButton
                variant="emerald"
                size="lg"
                href="#about"
              >
                VIEW BRIEFING
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
        {/* Campus Venue */}
        <PixelCard
          variant="stone"
          title="Campus Venue"
          headerIcon="📍"
          badge={<PixelBadge variant="emerald">OFFLINE FINALE</PixelBadge>}
        >
          <h4 className="font-pixel text-xs sm:text-sm text-white mb-2">
            {organizers.institution.name}
          </h4>
          <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
            {contact.venueAddress}
          </p>
          <div className="p-3 bg-black/40 border border-neutral-700 font-pixel text-[9px] text-neutral-400">
            {organizers.institution.affiliation}
          </div>
        </PixelCard>

        {/* Official Contact Person from Poster */}
        <PixelCard
          variant="stone"
          title="Official Contact Desk"
          headerIcon="📞"
          badge={<PixelBadge variant="gold">STUDENT COORDINATOR</PixelBadge>}
        >
          <div className="space-y-4 font-sans text-sm text-neutral-300">
            <div>
              <span className="font-pixel text-[9px] text-neutral-400 block uppercase mb-1">
                Contact Person
              </span>
              <span className="font-pixel text-sm text-amber-300">
                {contact.name}
              </span>
            </div>

            <div>
              <span className="font-pixel text-[9px] text-neutral-400 block uppercase mb-1">
                Phone Helpline
              </span>
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className="font-pixel text-xs sm:text-sm text-emerald-400 hover:underline block"
                data-interactive="true"
              >
                {contact.phone}
              </a>
            </div>

            <div>
              <span className="font-pixel text-[9px] text-neutral-400 block uppercase mb-1">
                Organizing Chapter
              </span>
              <p className="text-xs text-neutral-300">
                {organizers.lead} in association with AlgoVedas & ASTRA
              </p>
            </div>
          </div>
        </PixelCard>
      </div>
    </SectionContainer>
  );
}
