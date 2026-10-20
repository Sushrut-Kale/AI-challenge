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
 * Authentic Minecraft Stone Hit / Dig Sound (`block.stone.hit`)
 * Produces crisp mineral impact crunch + low deepslate body resonance
 */
export function playMinecraftStoneHit() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Mineral crunch noise
  const bufferSize = ctx.sampleRate * 0.05;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1400 + Math.random() * 400, now);
  filter.Q.setValueAtTime(1.8, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.45, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.06);

  // Rock body impact thud
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  const rockPitch = 180 + Math.random() * 40;
  osc.frequency.setValueAtTime(rockPitch, now);
  osc.frequency.exponentialRampToValueAtTime(70, now + 0.06);

  oscGain.gain.setValueAtTime(0.3, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

/**
 * Authentic Minecraft Block Break & Celebration Chime (`block.stone.break` + Level Up Chime)
 */
export function playMinecraftBlockBreak() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Heavy shatter explosion burst
  const bufferSize = ctx.sampleRate * 0.22;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.frequency.exponentialRampToValueAtTime(300, now + 0.2);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.6, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.23);

  // 2. Triumphant Minecraft Level-Up Chime Arpeggio (C5 -> E5 -> G5 -> C6)
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const startTime = now + 0.06 + idx * 0.07;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    noteGain.gain.setValueAtTime(0.22, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

    osc.connect(noteGain);
    noteGain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.3);
  });
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
  private volume = 0.4;

  setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

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
      const targetGain = Math.max(0.001, 0.045 * this.volume);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(targetGain, startTime + 0.8);
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

interface AudioContextType {
  sfxEnabled: boolean;
  bgmEnabled: boolean;
  volume: number;
  toggleSfx: () => void;
  toggleBgm: () => void;
  toggleAll: () => void;
  setVolume: (val: number) => void;
}

const AudioCtx = React.createContext<AudioContextType | undefined>(undefined);

export function useAudio(): AudioContextType {
  const context = React.useContext(AudioCtx);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [volume, setVolumeState] = useState(0.4);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initialize audio preferences from storage
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
      const savedVol = localStorage.getItem('agentcraft_volume');
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (!isNaN(v)) {
          setVolumeState(v);
          ambientMusic.setVolume(v);
        }
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

      const interactiveEl = target.closest(
        'button, a, input, select, textarea, summary, [role="button"], [data-interactive="true"], .mc-card, .mc-hotbar-slot'
      );

      if (interactiveEl) {
        if (interactiveEl.getAttribute('data-slot') === '9') {
          playMinecraftSwordSweep();
        } else {
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

  const toggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('agentcraft_sfx', next ? 'true' : 'false');
      } catch {}
      if (next) {
        playMinecraftPop(1.2);
      }
      return next;
    });
  }, []);

  const toggleBgm = useCallback(() => {
    setHasInteracted(true);
    getAudioContext();
    setBgmEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('agentcraft_bgm', next ? 'true' : 'false');
      } catch {}
      if (next) {
        ambientMusic.start();
      } else {
        ambientMusic.stop();
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setHasInteracted(true);
    getAudioContext();
    if (bgmEnabled || sfxEnabled) {
      setBgmEnabled(false);
      setSfxEnabled(false);
      ambientMusic.stop();
      try {
        localStorage.setItem('agentcraft_bgm', 'false');
        localStorage.setItem('agentcraft_sfx', 'false');
      } catch {}
    } else {
      setBgmEnabled(true);
      setSfxEnabled(true);
      ambientMusic.start();
      playMinecraftPop(1.2);
      try {
        localStorage.setItem('agentcraft_bgm', 'true');
        localStorage.setItem('agentcraft_sfx', 'true');
      } catch {}
    }
  }, [bgmEnabled, sfxEnabled]);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    ambientMusic.setVolume(clamped);
    try {
      localStorage.setItem('agentcraft_volume', clamped.toString());
    } catch {}
  }, []);

  const value = React.useMemo(
    () => ({
      sfxEnabled,
      bgmEnabled,
      volume,
      toggleSfx,
      toggleBgm,
      toggleAll,
      setVolume,
    }),
    [sfxEnabled, bgmEnabled, volume, toggleSfx, toggleBgm, toggleAll, setVolume]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

/**
 * Top-Right Desktop Audio Control Button for Navbar
 */
export function AudioNavbarButton() {
  const { sfxEnabled, bgmEnabled, volume, toggleSfx, toggleBgm, toggleAll, setVolume } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isAudioActive = bgmEnabled || sfxEnabled;

  return (
    <div className="relative shrink-0" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`border-2 px-2.5 sm:px-3 py-2 min-h-[40px] font-pixel text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-[inset_1px_1px_0_rgba(255,255,255,0.25),0_3px_0_#1a1309] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
          isAudioActive
            ? 'border-[#2d5a27] bg-[#1d4319] hover:bg-[#255720] text-emerald-300'
            : 'border-[#4a3928] bg-[#211810] hover:bg-[#322315] text-neutral-400'
        }`}
        title={isAudioActive ? 'Audio Settings (Active)' : 'Audio Settings (Muted)'}
        aria-label="Audio Controls"
        aria-expanded={isOpen}
        data-interactive="true"
      >
        <span>{bgmEnabled ? '🎵' : sfxEnabled ? '🔊' : '🔇'}</span>
        <span className="hidden xl:inline whitespace-nowrap">{bgmEnabled ? 'MUSIC' : sfxEnabled ? 'SFX ON' : 'MUTED'}</span>
        <span className="text-[7px] opacity-75">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Minecraft-styled Audio Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-[#14100c]/98 border-2 border-[#5a3f24] shadow-[0_12px_32px_rgba(0,0,0,0.95)] z-[100] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#3d2a17] pb-2 mb-2.5 font-pixel text-[8px] text-amber-300 tracking-wider uppercase">
            <span>MINECRAFT AUDIO</span>
            <span className="text-emerald-400 text-[7px]">C418 SYNTH</span>
          </div>

          <div className="space-y-2">
            {/* Background Music Toggle */}
            <div className="flex items-center justify-between gap-2 p-1.5 bg-black/40 border border-[#302112]">
              <div className="flex flex-col">
                <span className="font-pixel text-[8px] text-neutral-200">BGM MUSIC</span>
                <span className="text-[9px] text-neutral-400 font-sans">Subwoofer Lullaby</span>
              </div>
              <button
                type="button"
                onClick={toggleBgm}
                className={`px-2.5 py-1 border font-pixel text-[8px] uppercase transition-all ${
                  bgmEnabled
                    ? 'bg-[#2b1f48] border-[#a855f7] text-[#c084fc] animate-pulse'
                    : 'bg-[#1a1714] border-[#444] text-neutral-400 hover:text-neutral-200'
                }`}
                data-interactive="true"
              >
                {bgmEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between gap-2 p-1.5 bg-black/40 border border-[#302112]">
              <div className="flex flex-col">
                <span className="font-pixel text-[8px] text-neutral-200">SOUND FX</span>
                <span className="text-[9px] text-neutral-400 font-sans">Clicks & Sweeps</span>
              </div>
              <button
                type="button"
                onClick={toggleSfx}
                className={`px-2.5 py-1 border font-pixel text-[8px] uppercase transition-all ${
                  sfxEnabled
                    ? 'bg-[#1b3d1c] border-[#48bb78] text-[#48bb78]'
                    : 'bg-[#1a1714] border-[#444] text-neutral-400 hover:text-neutral-200'
                }`}
                data-interactive="true"
              >
                {sfxEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="p-1.5 bg-black/40 border border-[#302112]">
              <div className="flex justify-between font-pixel text-[7px] text-neutral-300 uppercase mb-1">
                <span>VOLUME</span>
                <span className="text-amber-400">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-[#261a0f] rounded cursor-pointer py-1"
                aria-label="Volume slider"
                data-interactive="true"
              />
            </div>

            {/* Quick Master Mute / Unmute Button */}
            <button
              type="button"
              onClick={toggleAll}
              className="w-full py-2 min-h-[36px] border border-[#4a3520] bg-[#1e140b] hover:bg-[#2b1d0f] font-pixel text-[8px] uppercase tracking-wider text-amber-200 transition-colors text-center cursor-pointer"
              data-interactive="true"
            >
              {isAudioActive ? '🔇 MUTE ALL SOUNDS' : '🔊 UNMUTE ALL SOUNDS'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Mobile Drawer Audio Control Block
 * Integrated inside the hamburger drawer
 */
export function AudioDrawerControl() {
  const { sfxEnabled, bgmEnabled, volume, toggleSfx, toggleBgm, toggleAll, setVolume } = useAudio();
  const isAudioActive = bgmEnabled || sfxEnabled;

  return (
    <div className="mt-3 p-2.5 bg-black/60 border-2 border-[#3b2716] rounded shadow-inner">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#3b2716] font-pixel text-[8px] text-amber-300 uppercase tracking-wider">
        <span>🔊 AUDIO CONTROLS</span>
        <button
          type="button"
          onClick={toggleAll}
          className="text-[7px] text-amber-400 hover:underline font-mono"
        >
          {isAudioActive ? 'MUTE ALL' : 'UNMUTE ALL'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <button
          type="button"
          onClick={toggleBgm}
          className={`py-2 px-1 border font-pixel text-[8px] uppercase tracking-wider text-center transition-all ${
            bgmEnabled
              ? 'bg-[#2b1f48] border-[#a855f7] text-[#c084fc]'
              : 'bg-[#18130e] border-[#422e1b] text-neutral-400'
          }`}
          data-interactive="true"
        >
          🎵 MUSIC {bgmEnabled ? 'ON' : 'OFF'}
        </button>

        <button
          type="button"
          onClick={toggleSfx}
          className={`py-2 px-1 border font-pixel text-[8px] uppercase tracking-wider text-center transition-all ${
            sfxEnabled
              ? 'bg-[#1b3d1c] border-[#48bb78] text-[#48bb78]'
              : 'bg-[#18130e] border-[#422e1b] text-neutral-400'
          }`}
          data-interactive="true"
        >
          🔊 SFX {sfxEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="flex items-center gap-2 px-1">
        <span className="font-pixel text-[7px] text-neutral-400 uppercase">VOL</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-amber-500 h-1.5 bg-[#261a0f] rounded cursor-pointer"
          aria-label="Volume slider"
        />
        <span className="font-pixel text-[7px] text-amber-400 w-7 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}

/**
 * Backwards-compatible dummy component (floating bottom-right widget removed)
 */
export default function MinecraftAudioManager() {
  return null;
}
