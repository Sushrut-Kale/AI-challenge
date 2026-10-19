'use client';

import React, { useState } from 'react';
import IntroExperience from '@/components/intro/IntroExperience';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutSection from '@/components/sections/AboutSection';
import TracksSection from '@/components/sections/TracksSection';
import TimelineSection from '@/components/sections/TimelineSection';
import RulesSection from '@/components/sections/RulesSection';
import PrizesSection from '@/components/sections/PrizesSection';
import SponsorsSection from '@/components/sections/SponsorsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';

export default function HomePage() {
  const [heroProgress, setHeroProgress] = useState(0);

  // Compact navbar during early intro frames (<0.68), full navigation bar in later frames and site
  const isIntroNavbar = heroProgress < 0.68;

  return (
    <>
      {/* Minecraft-styled Experience Progress Bar */}
      <ScrollProgress />

      {/* Minecraft Top Navigation: Compact during intro, full after entering */}
      <Navbar isIntro={isIntroNavbar} />

      {/* 4-5 Frame Minecraft Scrollytelling Sequence (Advances on Scroll Down, Reverses on Scroll Up) */}
      <IntroExperience onProgressChange={setHeroProgress} />

      {/* Conventional Minecraft Event Landing Page */}
      <main className="relative z-10 flex flex-col w-full min-h-screen bg-[#0d0b09]">
        <AboutSection />
        <TracksSection />
        <TimelineSection />
        <RulesSection />
        <PrizesSection />
        <SponsorsSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
