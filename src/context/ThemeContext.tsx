'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeId, ThemeConfig, THEMES, SECTION_THEME_MAP } from '@/types/theme';

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeConfig;
  setTheme: (id: ThemeId) => void;
  isTransitioning: boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
  playThemeSound: (freq?: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Web Audio API synthesized 8-bit sound generator (zero external assets needed)
function play8BitChime(frequency: number) {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // Smooth 8-bit chiptune sound
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Ignore audio errors on unsupported browsers
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>('overworld');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agentcraft_theme') as ThemeId | null;
      if (saved && THEMES[saved]) {
        setThemeIdState(saved);
      }
      const savedSound = localStorage.getItem('agentcraft_sound');
      if (savedSound === 'true') {
        setSoundEnabled(true);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  // Section-to-Background Auto-Sync: Automatically changes the 3D world theme as visitor scrolls each section
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sections = Object.keys(SECTION_THEME_MAP);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const mappedTheme = SECTION_THEME_MAP[sectionId];
            if (mappedTheme && mappedTheme !== themeId) {
              setThemeIdState(mappedTheme);
            }
          }
        });
      },
      {
        rootMargin: '-25% 0px -45% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [themeId]);

  const playThemeSound = useCallback(
    (freq?: number) => {
      if (!soundEnabled) return;
      const targetFreq = freq || THEMES[themeId].soundPitch;
      play8BitChime(targetFreq);
    },
    [soundEnabled, themeId]
  );

  const setTheme = useCallback(
    (id: ThemeId) => {
      if (id === themeId || !THEMES[id]) return;

      setIsTransitioning(true);
      setThemeIdState(id);

      try {
        localStorage.setItem('agentcraft_theme', id);
      } catch {
        // ignore storage errors
      }

      // Play 8-bit chime if sound is enabled
      if (soundEnabled) {
        play8BitChime(THEMES[id].soundPitch);
      }

      // Smooth portal dimension flash duration
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 450);

      return () => clearTimeout(timer);
    },
    [themeId, soundEnabled]
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('agentcraft_sound', next ? 'true' : 'false');
      } catch {
        // ignore
      }
      if (next) {
        play8BitChime(520);
      }
      return next;
    });
  }, []);

  const value: ThemeContextType = {
    themeId,
    theme: THEMES[themeId],
    setTheme,
    isTransitioning,
    soundEnabled,
    toggleSound,
    playThemeSound,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {/* Dimension Warp Screen Flash */}
      {isTransitioning && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
          style={{
            backgroundColor: THEMES[themeId].accentColor,
            opacity: 0.12,
            mixBlendMode: 'screen',
          }}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
