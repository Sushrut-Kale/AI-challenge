'use client';

import React, { useState, useEffect } from 'react';
import IntroExperience from '@/components/intro/IntroExperience';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import TracksSection from '@/components/sections/TracksSection';
import TimelineSection from '@/components/sections/TimelineSection';
import RulesSection from '@/components/sections/RulesSection';
import PrizesSection from '@/components/sections/PrizesSection';
import SponsorsSection from '@/components/sections/SponsorsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';

export default function HomePage() {
  const [isIntroActive, setIsIntroActive] = useState(true);

  useEffect(() => {
    // If user has already visited in this session, skip intro
    if (typeof window !== 'undefined') {
      const viewed = sessionStorage.getItem('agentcraft_intro_viewed');
      if (viewed) {
        setIsIntroActive(false);
      }
    }
  }, []);

  const handleIntroComplete = () => {
    setIsIntroActive(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('agentcraft_intro_viewed', 'true');
    }
  };

  return (
    <>
      {/* Three.js Opening Cinematic Knowledge Hall Intro */}
      <IntroExperience
        onIntroComplete={handleIntroComplete}
        isCompleted={!isIntroActive}
      />

      {/* Minecraft-styled Experience Progress Bar (active after entering) */}
      {!isIntroActive && <ScrollProgress />}

      {/* Minecraft Top Navigation: Compact during intro, full after entering */}
      <Navbar isIntro={isIntroActive} />

      {/* Conventional Minecraft Event Landing Page */}
      <main
        className={`relative flex flex-col w-full min-h-screen bg-[#0c0e14] transition-opacity duration-700 ${
          isIntroActive ? 'opacity-0 pointer-events-none h-screen overflow-hidden' : 'opacity-100'
        }`}
      >
        <HeroSection />
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
