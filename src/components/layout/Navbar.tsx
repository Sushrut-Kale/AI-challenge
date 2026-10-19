'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MinecraftButton from '@/components/ui/MinecraftButton';
import { EVENT_DATA } from '@/data/event';

const NAV_LINKS = [
  { label: 'ABOUT', href: '#about' },
  { label: 'ROUNDS', href: '#rounds' },
  { label: 'TIMELINE', href: '#timeline' },
  { label: 'RULES', href: '#rules' },
  { label: 'PRIZES', href: '#prizes' },
  { label: 'SPONSORS', href: '#sponsors' },
  { label: 'FAQS', href: '#faqs' },
  { label: 'CONTACT', href: '#contact' },
];

interface NavbarProps {
  isIntro?: boolean;
}

export default function Navbar({ isIntro = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // During intro, render ONLY the compact brand lockup (Official Logo + Event Name)
  if (isIntro) {
    return (
      <header className="fixed inset-x-4 top-4 z-50 flex justify-center pointer-events-auto animate-in fade-in duration-300">
        <div className="relative">
          {/* Top Grass Trim */}
          <div
            className="absolute inset-x-0 -top-[9px] h-[10px] border-2 border-b-0 border-[#1f2e14]"
            style={{
              backgroundImage: 'url(/assets/grass.png)',
              backgroundSize: '16px 16px',
              backgroundRepeat: 'repeat',
              imageRendering: 'pixelated',
            }}
            aria-hidden="true"
          />

          {/* Dirt Textured Compact Container */}
          <div
            className="flex items-center justify-center px-6 py-2.5 rounded-b-[12px] border-2 border-[#1f2e14] shadow-[0_10px_28px_rgba(0,0,0,0.7)]"
            style={{
              backgroundImage: 'url(/assets/dirt.png)',
              backgroundSize: '32px 32px',
              backgroundRepeat: 'repeat',
              imageRendering: 'pixelated',
            }}
          >
            {/* Real Official AGENTCRAFT 3D Minecraft Wordmark */}
            <div className="relative h-8 sm:h-9 w-auto shrink-0 flex items-center">
              <Image
                src="/assets/agentcraft_navbar_logo.png"
                alt="AGENTCRAFT"
                width={220}
                height={36}
                className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                priority
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // After intro, render the full Minecraft-inspired Navigation Bar
  return (
    <header className="fixed inset-x-2 sm:inset-x-6 top-3 z-50 transition-all duration-200">
      <div className="relative mx-auto max-w-7xl">
        {/* Top Grass Border */}
        <div
          className="absolute inset-x-0 -top-[9px] h-[10px] border-2 border-b-0 border-[#1f2e14]"
          style={{
            backgroundImage: 'url(/assets/grass.png)',
            backgroundSize: '16px 16px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated',
          }}
          aria-hidden="true"
        />

        {/* Dirt-textured Main Navbar Header */}
        <div
          className={`flex items-center justify-between gap-2 rounded-b-[14px] border-2 border-[#1f2e14] px-3 py-2 sm:px-5 shadow-[0_10px_28px_rgba(0,0,0,0.6)] transition-all duration-200 ${
            isScrolled ? 'brightness-95' : 'brightness-100'
          }`}
          style={{
            backgroundImage: 'url(/assets/dirt.png)',
            backgroundSize: '32px 32px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated',
          }}
        >
          {/* Brand Logo */}
          <a
            href="#hero"
            className="flex items-center transition-transform hover:scale-105 active:scale-95 outline-none"
            aria-label="AGENTCRAFT Home"
            data-interactive="true"
          >
            <Image
              src="/assets/agentcraft_navbar_logo.png"
              alt="AGENTCRAFT"
              width={200}
              height={32}
              className="h-7 sm:h-8 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              priority
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-pixel text-[9px] tracking-[0.14em] uppercase text-neutral-200 hover:text-white px-2.5 py-1.5 transition-colors hover:bg-white/10"
                style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}
                data-interactive="true"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Register CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <a
              href="#registration"
              className="mc-shine border-2 border-[#7a4f05] bg-[#fbbf24] px-3 py-2 font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider text-[#1a1206] shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4),0_3px_0_#382618] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              data-interactive="true"
            >
              <span className="sm:hidden">REGISTER</span>
              <span className="hidden sm:inline">REGISTER NOW ({EVENT_DATA.details.registrationFee})</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center border-2 border-[#1f2e14] bg-[#2a1d13] text-amber-200 xl:hidden active:bg-[#3d2c1d] transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              data-interactive="true"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                {mobileMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 3h2v2H3V3zm4 4H5V5h2v2zm2 0h2V5H9v2zm2 2v2h-2V9h2zm-4 0v2H5V9h2zm6 4h-2v-2h2v2zM3 13h2v-2H3v2z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 4h14v2H2V4zm0 4h14v2H2V8zm0 4h14v2H2v-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="xl:hidden mt-2 p-4 border-2 border-[#1f2e14] rounded-md shadow-[0_16px_36px_rgba(0,0,0,0.95)]"
            style={{
              backgroundImage: 'url(/assets/dirt.png)',
              backgroundSize: '32px 32px',
              backgroundRepeat: 'repeat',
              imageRendering: 'pixelated',
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-pixel text-[9px] text-amber-100 hover:text-white p-2.5 bg-black/40 border border-black/40 hover:border-amber-400 transition-colors text-center"
                  data-interactive="true"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-black/40">
              <a
                href="#registration"
                onClick={() => setMobileMenuOpen(false)}
                className="mc-shine block w-full text-center border-2 border-[#7a4f05] bg-[#fbbf24] py-2 font-pixel text-[9px] uppercase tracking-wider text-[#1a1206] shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4)]"
                data-interactive="true"
              >
                REGISTER NOW ({EVENT_DATA.details.registrationFee})
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
