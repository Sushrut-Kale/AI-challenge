'use client';

import React, { useState, useEffect, useCallback } from 'react';
import IntroExperience, { IntroLifecycle } from '@/components/intro/IntroExperience';
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
  const [introState, setIntroState] = useState<IntroLifecycle>('INTRO');

  useEffect(() => {
    // Intro Persistence Policy:
    // 1. In a new session, intro plays once.
    // 2. Once entered, sessionStorage suppresses intro on refresh to avoid disrupting repeat navigation.
    // 3. User can explicitly re-trigger via ?replay=true or ?intro=true in the URL.
    // 4. Scrolling upward, clicking anchors, or re-renders can NEVER revive the intro once in MAIN_SITE.
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('replay') === 'true' || params.get('intro') === 'true') {
        sessionStorage.removeItem('agentcraft_intro_viewed');
        setIntroState('INTRO');
        return;
      }
      const viewed = sessionStorage.getItem('agentcraft_intro_viewed');
      if (viewed) {
        setIntroState('MAIN_SITE');
      }
    }
  }, []);

  // Idempotent start transition callback
  const handleStartTransition = useCallback(() => {
    setIntroState((prev) => {
      if (prev !== 'INTRO') return prev;
      return 'TRANSITIONING';
    });
  }, []);

  // Idempotent complete transition callback
  const handleCompleteTransition = useCallback(() => {
    setIntroState('MAIN_SITE');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('agentcraft_intro_viewed', 'true');
    }
  }, []);

  const isIntro = introState === 'INTRO';
  const isMainSite = introState === 'MAIN_SITE';

  return (
    <>
      {/* Three.js Opening Cinematic Knowledge Hall Intro:
          Mounted during INTRO and TRANSITIONING, permanently unmounted in MAIN_SITE */}
      {!isMainSite && (
        <IntroExperience
          introState={introState}
          onStartTransition={handleStartTransition}
          onCompleteTransition={handleCompleteTransition}
        />
      )}

      {/* Minecraft-styled Experience Progress Bar (active after entering main site) */}
      {isMainSite && <ScrollProgress />}

      {/* Minecraft Top Navigation: Compact during intro, full after entering */}
      <Navbar isIntro={isIntro} />

      {/* Conventional Minecraft Event Landing Page */}
      <main
        className={`relative flex flex-col w-full min-h-screen bg-[#0c0e14] transition-opacity duration-700 ${
          isIntro ? 'opacity-0 pointer-events-none h-screen overflow-hidden' : 'opacity-100'
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
