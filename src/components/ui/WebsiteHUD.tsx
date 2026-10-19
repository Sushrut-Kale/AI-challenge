'use client';

import React, { useState, useEffect } from 'react';
import { EVENT_DATA } from '@/data/event';
import { PanelTab } from './MinecraftPanel';

interface WebsiteHUDProps {
  activePanel: PanelTab | null;
  onOpenPanel: (tab: PanelTab) => void;
  onSelectCameraPreset: (name: 'overview' | 'sunset' | 'castle' | 'closeup') => void;
  activePreset: string;
  isOrbiting: boolean;
  onToggleOrbit: () => void;
  onResetCamera: () => void;
}

export default function WebsiteHUD({
  activePanel,
  onOpenPanel,
  onSelectCameraPreset,
  activePreset,
  isOrbiting,
  onToggleOrbit,
  onResetCamera,
}: WebsiteHUDProps) {
  const [hudVisible, setHudVisible] = useState(true);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Web Audio synthesizer for retro Minecraft-style chimes & clicks
  const playRetroSound = (type: 'click' | 'portal' | 'chime') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'portal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.26);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setHudVisible((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        onResetCamera();
      } else if (e.key === 'm' || e.key === 'M') {
        setSoundEnabled((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResetCamera]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-[500]">
      {/* Top Header & Event Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
        {/* Left: Event Badge and Logo Placeholder */}
        <div className="glass-panel px-3.5 py-2 rounded-lg border border-white/10 shadow-2xl flex items-center gap-3 pointer-events-auto">
          <div className="w-8 h-8 bg-[#ea580c] border border-[#fbbf24] flex items-center justify-center font-bold text-white text-xs shadow-md">
            ⚔
          </div>
          <div className="flex flex-col">
            <span
              className="text-white font-bold tracking-wider text-[10px] md:text-xs"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                textShadow: '1px 1px 0 #ea580c',
              }}
            >
              {EVENT_DATA.name}
            </span>
            <span className="text-[#fbbf24] text-[8px] font-mono">
              {EVENT_DATA.organizer.shortName} · {EVENT_DATA.subtitle}
            </span>
          </div>
        </div>

        {/* Right: Actions, World Atlas Menu, Audio & HUD Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* World Navigation Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                playRetroSound('click');
                setNavMenuOpen((prev) => !prev);
              }}
              className="px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-[#fbbf24] border border-[#fbbf24]/60 text-[9px] font-bold shadow-xl transition cursor-pointer flex items-center gap-1.5"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              <span>🗺 World Atlas</span>
              <span className="text-[7px]">{navMenuOpen ? '▲' : '▼'}</span>
            </button>

            {/* Dropdown Menu */}
            {navMenuOpen && (
              <div
                className="absolute top-full mt-1.5 right-0 w-64 bg-[#111827] border-2 border-[#fbbf24] p-1.5 shadow-2xl z-50 flex flex-col gap-1"
                style={{ imageRendering: 'pixelated' }}
              >
                <div className="px-2 py-1 border-b border-white/10 mb-1">
                  <span className="text-[#10b981] text-[8px] font-bold uppercase font-mono">
                    Fast Travel Destinations
                  </span>
                </div>

                {[
                  { tab: 'about', label: '📜 Quest Board (About)', pos: [6, 7, 6], target: [-4, 3.5, -2] },
                  { tab: 'challenge', label: '🎯 Challenge & SDGs', pos: [-16, 7.5, -14], target: [-25, 5, -20] },
                  { tab: 'rules', label: '🛠 Workshop (Rules)', pos: [-16, 7.5, -14], target: [-25, 5, -20] },
                  { tab: 'timeline', label: '🗺 Pathway (Timeline)', pos: [18, 6.5, 14], target: [12, 2.5, 8] },
                  { tab: 'prizes', label: '🏆 Reward Chamber (Prizes)', pos: [-28, 18, -32], target: [-40, 14, -45] },
                  { tab: 'sponsors', label: '🏛 Sponsor Plaza', pos: [-10, 6.5, -5], target: [-16, 4, -10] },
                  { tab: 'registration', label: '🔮 Nether Portal (Register)', pos: [18, 6.5, -1], target: [26, 4.5, -6] },
                  { tab: 'agent-builder', label: '⛏ Agent Alpha (Builder)', pos: [6, 7.2, 8], target: [-2.4, 5.2, 0.4] },
                  { tab: 'agent-analyst', label: '📊 Agent Beta (Analyst)', pos: [8, 7.2, 5], target: [2.4, 5.2, 0.4] },
                  { tab: 'agent-innovator', label: '⚡ Agent Gamma (Innovator)', pos: [4, 7.2, 6], target: [0, 5.2, -0.2] },
                  { tab: 'faqs', label: '❓ FAQ & Help', pos: [46, 30, 52], target: [0, 2, 0] },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playRetroSound('click');
                      setNavMenuOpen(false);
                      window.dispatchEvent(
                        new CustomEvent('minecraft:camera-target', {
                          detail: { pos: item.pos, target: item.target },
                        })
                      );
                      onOpenPanel(item.tab as PanelTab);
                    }}
                    className="text-left px-2 py-1.5 text-[9px] text-gray-200 hover:text-black hover:bg-[#fbbf24] transition flex items-center justify-between cursor-pointer font-mono"
                  >
                    <span>{item.label}</span>
                    <span className="text-gray-400 text-[8px]">▶</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Registration Portal CTA Button */}
          <button
            onClick={() => {
              playRetroSound('portal');
              window.dispatchEvent(
                new CustomEvent('minecraft:camera-target', {
                  detail: { pos: [18, 6.5, -1], target: [26, 4.5, -6] },
                })
              );
              onOpenPanel('registration');
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-[#9333ea] to-[#c026d3] hover:from-[#a855f7] hover:to-[#d946ef] text-white border-2 border-white/60 text-[9px] font-bold rounded-none shadow-[0_0_12px_rgba(192,38,211,0.5)] transition cursor-pointer flex items-center gap-1.5"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <span>🔮 Register</span>
          </button>

          {/* Retro Audio Toggle Button */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playRetroSound('chime');
            }}
            className={`px-2.5 py-2 rounded text-[9px] border transition cursor-pointer flex items-center gap-1 shadow-lg ${
              soundEnabled
                ? 'bg-[#10b981] border-[#059669] text-black font-bold shadow-[0_0_8px_#10b981]'
                : 'glass-panel border-white/20 text-gray-300 hover:text-white'
            }`}
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            title="Toggle Audio Effects (Key: M)"
          >
            <span>{soundEnabled ? '🔊 ON' : '🔇 OFF'}</span>
          </button>

          {/* HUD Visibility Toggle Button */}
          <button
            onClick={() => setHudVisible((prev) => !prev)}
            className="glass-panel px-2.5 py-2 rounded text-[9px] text-gray-200 hover:text-white border border-white/20 transition cursor-pointer shadow-lg"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            title="Toggle HUD (Key: H)"
          >
            <span>{hudVisible ? '👁' : '👁 Show'}</span>
          </button>
        </div>
      </div>

      {/* Main Bottom HUD Overlays (when visible) */}
      {hudVisible && (
        <>
          {/* Bottom Center Bar: Camera Presets, Reset & Orbit Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto">
            <div className="glass-panel rounded-lg p-1.5 flex items-center gap-1.5 border border-white/10 shadow-2xl backdrop-blur-md">
              {[
                { id: 'overview', label: 'Overview [1]' },
                { id: 'sunset', label: 'Sunset Horizon [2]' },
                { id: 'castle', label: 'Castle [3]' },
                { id: 'closeup', label: 'AI Agents [4]' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    playRetroSound('click');
                    onSelectCameraPreset(b.id as any);
                  }}
                  className={`px-3 py-2 rounded text-[9px] transition cursor-pointer font-mono ${
                    activePreset === b.id
                      ? 'bg-[#ea580c] text-white font-bold shadow-lg shadow-orange-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {b.label}
                </button>
              ))}

              <div className="w-px h-6 bg-white/20 mx-1" />

              {/* Camera Reset Button */}
              <button
                onClick={() => {
                  playRetroSound('click');
                  onResetCamera();
                }}
                className="px-2.5 py-2 rounded text-[9px] text-[#fbbf24] hover:bg-[#fbbf24]/10 transition cursor-pointer font-mono border border-[#fbbf24]/40"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
                title="Reset Camera to Overview (Key: R)"
              >
                ↺ Reset
              </button>

              {/* Orbit Toggle */}
              <button
                onClick={() => {
                  playRetroSound('click');
                  onToggleOrbit();
                }}
                className={`px-3 py-2 rounded text-[9px] transition cursor-pointer font-mono ${
                  isOrbiting
                    ? 'bg-[#4338ca] text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
                style={{ fontFamily: '"Press Start 2P", monospace' }}
                title="Toggle Auto Orbit (Spacebar)"
              >
                {isOrbiting ? '⏸ Orbit' : '▶ Orbit'}
              </button>
            </div>
          </div>

          {/* Bottom Left: Controls Legend */}
          <div className="absolute bottom-4 left-4">
            <div
              className="glass-panel rounded-lg px-4 py-2.5 text-[11px] text-gray-300 border border-white/10 shadow-xl"
              style={{ fontFamily: 'monospace' }}
            >
              <p className="flex items-center gap-2">
                <span>🖱 Drag orbit</span>
                <span>·</span>
                <span>Scroll zoom</span>
                <span>·</span>
                <span>Click landmarks</span>
                <span>·</span>
                <span>[ESC] Close</span>
              </p>
            </div>
          </div>

          {/* Bottom Right: Live Status Badge */}
          <div className="absolute bottom-4 right-4">
            <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2.5 border border-white/10 shadow-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
              <div className="flex flex-col">
                <span className="text-emerald-400 text-[10px] font-mono font-bold">
                  World Online
                </span>
                <span className="text-gray-400 text-[8px] font-mono">
                  Interactive Sandbox
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
