'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

// Web Audio API Context singleton
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Authentic Minecraft Wooden Button Click Sound (`ui.button.click`)
 * Synthesized with a dual-stage wooden transient: sharp attack + resonant wood cavity.
 */
export function playMinecraftClick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Stage 1: Sharp high-frequency click transient (noise snap)
  const bufferSize = ctx.sampleRate * 0.02; // 20ms
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.003));
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1250, now);
  filter.Q.setValueAtTime(2.5, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.35, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

  whiteNoise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  whiteNoise.start(now);
  whiteNoise.stop(now + 0.025);

  // Stage 2: Low-end wooden body knock (pitch drops from 320Hz to 160Hz)
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.035);

  oscGain.gain.setValueAtTime(0.28, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

/**
 * Authentic Minecraft Item Pop Sound (`random.pop`)
 * Used for item slot selections or toggles
 */
export function playMinecraftPop(pitchMult = 1.0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  const baseFreq = 650 * pitchMult;
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.045);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.065);
}

/**
 * Authentic Minecraft Diamond Sword Slash Sound (`entity.player.attack.sweep`)
 */
export function playMinecraftSwordSweep() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.18;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(2800, now + 0.06);
  filter.frequency.exponentialRampToValueAtTime(400, now + 0.18);
  filter.Q.setValueAtTime(3.0, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.19);
}

/**
 * Classic Minecraft C418-Inspired Ambient Generative Soundtrack (Piano Chords + Warm Soft Pads)
 */
class MinecraftAmbientMusicEngine {
  private isPlaying = false;
  private timer: NodeJS.Timeout | null = null;
  private chords = [
    // Fmaj7
    [174.61, 220.0, 261.63, 329.63],
    // Cmaj7
    [130.81, 196.0, 246.94, 329.63],
    // G
    [196.0, 246.94, 293.66, 392.0],
    // Am9
    [110.0, 164.81, 220.0, 261.63, 329.63],
    // Em7
    [164.81, 196.0, 246.94, 293.66],
  ];
  private chordIndex = 0;

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playNextChord();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private playNextChord() {
    if (!this.isPlaying) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const chord = this.chords[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    const now = ctx.currentTime;

    // Warm ambient pad note
    chord.forEach((freq, noteIdx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = noteIdx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + noteIdx * 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      // Slow gentle attack and long, nostalgic release
      const startTime = now + noteIdx * 0.12;
      const duration = 5.5;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.045, startTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });

    // Schedule next chord in 6.0 seconds for that calm, spacious Minecraft feeling
    this.timer = setTimeout(() => {
      this.playNextChord();
    }, 6200);
  }
}

const ambientMusic = new MinecraftAmbientMusicEngine();

export default function MinecraftAudioManager() {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initialize preferences
  useEffect(() => {
    try {
      const savedSfx = localStorage.getItem('agentcraft_sfx');
      if (savedSfx !== null) {
        setSfxEnabled(savedSfx === 'true');
      }
      const savedBgm = localStorage.getItem('agentcraft_bgm');
      if (savedBgm === 'true') {
        setBgmEnabled(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Sync BGM
  useEffect(() => {
    if (bgmEnabled && hasInteracted) {
      ambientMusic.start();
    } else {
      ambientMusic.stop();
    }
    return () => ambientMusic.stop();
  }, [bgmEnabled, hasInteracted]);

  // Global Click Sound Listener: Reflects authentic Minecraft sound whenever the user clicks ANY element
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      setHasInteracted(true);
      getAudioContext();

      if (!sfxEnabled) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if target or any parent is interactive
      const interactiveEl = target.closest(
        'button, a, input, select, textarea, summary, [role="button"], [data-interactive="true"], .mc-card, .mc-hotbar-slot'
      );

      if (interactiveEl) {
        // Special check: if sword slot clicked
        if (interactiveEl.getAttribute('data-slot') === '9') {
          playMinecraftSwordSweep();
        } else {
          // Play classic Minecraft wooden click
          playMinecraftClick();
        }
      }
    };

    const handleCustomBurst = () => {
      if (sfxEnabled) {
        playMinecraftSwordSweep();
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('minecraft-slash-burst', handleCustomBurst);

    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('minecraft-slash-burst', handleCustomBurst);
    };
  }, [sfxEnabled]);

  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    try {
      localStorage.setItem('agentcraft_sfx', next ? 'true' : 'false');
    } catch {
      // ignore
    }
    if (next) {
      playMinecraftPop(1.2);
    }
  };

  const toggleBgm = () => {
    setHasInteracted(true);
    getAudioContext();
    const next = !bgmEnabled;
    setBgmEnabled(next);
    try {
      localStorage.setItem('agentcraft_bgm', next ? 'true' : 'false');
    } catch {
      // ignore
    }
    if (next) {
      ambientMusic.start();
    } else {
      ambientMusic.stop();
    }
  };

  return (
    <div
      className="fixed top-20 right-3 sm:right-6 z-40 flex items-center gap-1.5 pointer-events-auto select-none"
      aria-label="Minecraft Audio Controls"
    >
      {/* SFX Click Sound Toggle */}
      <button
        onClick={toggleSfx}
        type="button"
        title={sfxEnabled ? 'Minecraft Click Sounds: ON' : 'Minecraft Click Sounds: OFF'}
        aria-label={sfxEnabled ? 'Disable Minecraft Click Sounds' : 'Enable Minecraft Click Sounds'}
        className={`px-2.5 py-1.5 flex items-center gap-1.5 border-2 font-pixel text-[9px] uppercase transition-all shadow-[2px_2px_0_rgba(0,0,0,0.85)] ${
          sfxEnabled
            ? 'bg-[#1b3d1c] border-[#48bb78] text-[#48bb78]'
            : 'bg-[#1a1714]/90 border-[#3d2e20] text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <span>{sfxEnabled ? '🔊 SFX' : '🔇 SFX'}</span>
      </button>

      {/* Classic Minecraft Ambient Music (C418) Toggle */}
      <button
        onClick={toggleBgm}
        type="button"
        title={bgmEnabled ? 'Minecraft Ambient Music: PLAYING' : 'Minecraft Ambient Music: OFF'}
        aria-label={bgmEnabled ? 'Pause Minecraft Ambient Music' : 'Play Minecraft Ambient Music'}
        className={`px-2.5 py-1.5 flex items-center gap-1.5 border-2 font-pixel text-[9px] uppercase transition-all shadow-[2px_2px_0_rgba(0,0,0,0.85)] ${
          bgmEnabled
            ? 'bg-[#2b1f48] border-[#a855f7] text-[#c084fc] animate-pulse'
            : 'bg-[#1a1714]/90 border-[#3d2e20] text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <span>{bgmEnabled ? '🎵 MUSIC: ON' : '🎵 MUSIC: OFF'}</span>
      </button>
    </div>
  );
}
