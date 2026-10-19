'use client';

import React, { useEffect, useState } from 'react';
import { EVENT_DATA, EventData } from '@/data/event';

export type PanelTab =
  | 'about'
  | 'challenge'
  | 'rules'
  | 'timeline'
  | 'prizes'
  | 'sponsors'
  | 'registration'
  | 'faqs'
  | 'agent-builder'
  | 'agent-analyst'
  | 'agent-innovator';

interface MinecraftPanelProps {
  activeTab: PanelTab | null;
  onClose: () => void;
  onSelectTab?: (tab: PanelTab) => void;
}

export default function MinecraftPanel({
  activeTab,
  onClose,
  onSelectTab,
}: MinecraftPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activeTab) return null;

  // Determine which section to show
  const isAgent = activeTab.startsWith('agent-');
  const agentKey = isAgent ? activeTab.replace('agent-', '') : null;
  const agentData = agentKey ? EVENT_DATA.agents[agentKey] : null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      {/* Minecraft Inventory / Crafting GUI Container */}
      <div
        className="relative w-full max-w-2xl bg-[#c6c6c6] border-4 border-t-white border-l-white border-b-[#555] border-r-[#555] p-3 md:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] max-h-[88vh] flex flex-col"
        style={{
          boxShadow: 'inset -3px -3px 0px #555, inset 3px 3px 0px #fff, 0 16px 40px rgba(0,0,0,0.8)',
          imageRendering: 'pixelated',
        }}
      >
        {/* Title Bar with Minecraft Style */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#8b8b8b]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">
              {isAgent
                ? '🤖'
                : activeTab === 'about'
                ? '📜'
                : activeTab === 'challenge'
                ? '🎯'
                : activeTab === 'rules'
                ? '⚖'
                : activeTab === 'timeline'
                ? '🗺'
                : activeTab === 'prizes'
                ? '🏆'
                : activeTab === 'sponsors'
                ? '🏛'
                : activeTab === 'registration'
                ? '🔮'
                : '❓'}
            </span>
            <h2
              className="text-[#373737] font-bold text-xs md:text-sm tracking-wider uppercase"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {isAgent && agentData
                ? `${agentData.name} · ${agentData.role.split('&')[0]}`
                : activeTab === 'about'
                ? 'Event Dossier · Overview'
                : activeTab === 'challenge'
                ? 'Challenge & SDG Tracks'
                : activeTab === 'rules'
                ? 'Rules & Eligibility'
                : activeTab === 'timeline'
                ? 'Challenge Pathway & Timeline'
                : activeTab === 'prizes'
                ? 'Reward Chamber · Prizes'
                : activeTab === 'sponsors'
                ? 'Sponsor Plaza & Partners'
                : activeTab === 'registration'
                ? 'Nether Portal · Registration'
                : 'Frequently Asked Questions'}
            </h2>
          </div>

          {/* Close Button — Minecraft Red Button Style */}
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[#d9534f] hover:bg-[#c9302c] active:bg-[#ac2925] text-white text-xs font-bold border-2 border-t-[#ff7675] border-l-[#ff7675] border-b-[#7c1d1d] border-r-[#7c1d1d] flex items-center justify-center cursor-pointer transition"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            title="Close Panel (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Content Area with Inset Dark Stone Panel */}
        <div
          className="flex-1 overflow-y-auto bg-[#2b2b2b] border-2 border-t-[#1a1a1a] border-l-[#1a1a1a] border-b-[#4a4a4a] border-r-[#4a4a4a] p-4 md:p-5 text-gray-200 text-xs leading-relaxed space-y-4"
          style={{ fontFamily: 'monospace' }}
        >
          {/* ================= AGENT PROFILE VARIANT ================= */}
          {isAgent && agentData && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#1e1e1e] p-3 border border-[#444]">
                {/* Agent Avatar Badge */}
                <div
                  className="w-16 h-16 border-2 flex items-center justify-center text-3xl shadow-md"
                  style={{
                    backgroundColor: agentData.accentColor,
                    borderColor: agentData.color,
                  }}
                >
                  {agentKey === 'builder' ? '⛏' : agentKey === 'analyst' ? '📊' : '⚡'}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3
                    className="font-bold text-sm tracking-wide"
                    style={{
                      color: agentData.color,
                      fontFamily: '"Press Start 2P", monospace',
                    }}
                  >
                    {agentData.name}
                  </h3>
                  <p className="text-[#fbbf24] text-[11px] font-bold mt-1">
                    {agentData.role}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-0.5">
                    Target: {agentData.sdgFocus}
                  </p>
                </div>
              </div>

              {/* Agent Thematic Description */}
              <div className="bg-[#1e1e1e]/60 p-3 border border-[#3a3a3a]">
                <h4
                  className="text-white text-[10px] font-bold mb-2 uppercase"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  Agentic Purpose:
                </h4>
                <p className="text-gray-300 leading-relaxed text-xs">
                  {agentData.description}
                </p>
              </div>

              {/* Special Ability */}
              <div className="p-3 bg-[#1e1e1e]/60 border border-[#3a3a3a]">
                <h4
                  className="text-[#10b981] text-[10px] font-bold mb-1 uppercase"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  Autonomous Core Capability:
                </h4>
                <p className="text-gray-200 text-xs">
                  {agentData.specialAbility}
                </p>
              </div>

              {/* Agent Stat Attributes */}
              <div className="p-3 bg-[#1e1e1e] border border-[#3a3a3a] space-y-2">
                <h4
                  className="text-white text-[10px] font-bold uppercase mb-2"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  Agent Attribute Matrix:
                </h4>
                {[
                  { label: 'Construction & Synthesis', val: agentData.stats.build, color: '#10b981' },
                  { label: 'Telemetry & Optimization', val: agentData.stats.analyze, color: '#38bdf8' },
                  { label: 'Emergent Innovation Heuristics', val: agentData.stats.innovate, color: '#c026d3' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>{stat.label}</span>
                      <span className="font-bold" style={{ color: stat.color }}>
                        {stat.val}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#111] border border-[#333]">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${stat.val}%`,
                          backgroundColor: stat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= ABOUT VARIANT ================= */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-3.5 border border-[#444]">
                <h3
                  className="text-[#fbbf24] text-xs font-bold mb-2 uppercase"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  Event Mission
                </h3>
                <p className="text-gray-300 leading-relaxed text-xs">
                  {EVENT_DATA.challenge.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#1e1e1e] p-3 border border-[#3a3a3a]">
                  <span className="text-[#10b981] font-bold text-[10px] block mb-1">
                    ORGANIZED BY
                  </span>
                  <p className="text-white font-bold">{EVENT_DATA.organizer.name}</p>
                  <p className="text-gray-400 text-[11px]">{EVENT_DATA.organizer.department}</p>
                  <p className="text-gray-400 text-[10px]">{EVENT_DATA.organizer.location}</p>
                </div>

                <div className="bg-[#1e1e1e] p-3 border border-[#3a3a3a]">
                  <span className="text-[#38bdf8] font-bold text-[10px] block mb-1">
                    FORMAT & VENUE
                  </span>
                  <p className="text-white font-bold">{EVENT_DATA.details.format}</p>
                  <p className="text-gray-400 text-[11px]">{EVENT_DATA.details.venue}</p>
                  <p className="text-[#fbbf24] text-[10px] mt-1">
                    👥 Team Size: {EVENT_DATA.details.teamSize}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= CHALLENGE TRACKS VARIANT ================= */}
          {activeTab === 'challenge' && (
            <div className="space-y-3">
              <p className="text-gray-300 text-xs">
                Teams develop agentic AI architectures tailored to one or more of the UN Sustainable Development Goals:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {EVENT_DATA.challenge.sdgTracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-[#1e1e1e] p-3 border border-[#444] hover:border-white/40 transition"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="px-2 py-0.5 text-[9px] font-bold text-white rounded-none"
                        style={{ backgroundColor: track.color }}
                      >
                        SDG {track.id}
                      </span>
                      <h4 className="text-white font-bold text-xs">{track.name}</h4>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= RULES VARIANT ================= */}
          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="bg-[#1e1e1e] p-3 border border-[#444]">
                <h4
                  className="text-[#fbbf24] text-xs font-bold mb-1.5"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  Eligibility
                </h4>
                <p className="text-gray-300 text-xs">{EVENT_DATA.details.eligibility}</p>
              </div>

              <div className="bg-[#1e1e1e] p-3 border border-[#444] space-y-2">
                <h4
                  className="text-[#10b981] text-xs font-bold mb-2 uppercase"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  Hackathon Guidelines
                </h4>
                <ul className="space-y-2 text-xs text-gray-300 list-disc list-inside">
                  {EVENT_DATA.rules.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ================= TIMELINE VARIANT ================= */}
          {activeTab === 'timeline' && (
            <div className="space-y-2.5">
              {EVENT_DATA.timeline.map((step, i) => (
                <div
                  key={i}
                  className={`p-3 border flex gap-3 items-start ${
                    step.status === 'active'
                      ? 'bg-[#10b981]/15 border-[#10b981]'
                      : 'bg-[#1e1e1e] border-[#3a3a3a]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 flex-shrink-0 flex items-center justify-center font-bold text-xs ${
                      step.status === 'active'
                        ? 'bg-[#10b981] text-black shadow-[0_0_8px_#10b981]'
                        : 'bg-[#333] text-gray-300'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#fbbf24] text-[10px] font-bold">
                        {step.phase} · {step.date}
                      </span>
                      {step.status === 'active' && (
                        <span className="px-1.5 py-0.2 bg-[#10b981] text-black text-[8px] font-bold animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <h4 className="text-white font-bold text-xs mt-0.5">{step.title}</h4>
                    <p className="text-gray-300 text-[11px] mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= PRIZES VARIANT ================= */}
          {activeTab === 'prizes' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2.5">
                {EVENT_DATA.prizes.map((p, i) => (
                  <div
                    key={i}
                    className="bg-[#1e1e1e] p-3.5 border border-[#444] flex items-center gap-3.5"
                  >
                    <span className="text-3xl">{p.badge}</span>
                    <div>
                      <span className="text-[#fbbf24] text-[10px] font-bold uppercase tracking-wider block">
                        {p.place}
                      </span>
                      <h4 className="text-white font-bold text-xs">{p.title}</h4>
                      <p className="text-[#10b981] text-[11px] font-bold mt-1">
                        {p.reward}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 italic text-center pt-2">
                * Trophies, cash awards, and certificates provided by MIT Academy of Engineering.
              </p>
            </div>
          )}

          {/* ================= SPONSORS VARIANT ================= */}
          {activeTab === 'sponsors' && (
            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-4 border border-[#444] text-center">
                <span className="text-3xl mb-2 block">🏛</span>
                <h3 className="text-white font-bold text-sm">
                  {EVENT_DATA.sponsors.organizer}
                </h3>
                <p className="text-[#fbbf24] text-xs font-semibold mt-1">
                  {EVENT_DATA.sponsors.academicPartner}
                </p>
                <p className="text-gray-400 text-[11px] mt-2">
                  A premier engineering institution fostering agentic AI research, innovation, and sustainable technology.
                </p>
              </div>

              <div className="bg-[#1e1e1e]/60 p-3 border border-[#3a3a3a] text-center">
                <p className="text-gray-300 text-xs">
                  {EVENT_DATA.sponsors.statusNote}
                </p>
              </div>
            </div>
          )}

          {/* ================= REGISTRATION VARIANT ================= */}
          {activeTab === 'registration' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto bg-[#581c87] border-2 border-[#c026d3] flex items-center justify-center text-3xl shadow-[0_0_16px_rgba(192,38,211,0.6)]">
                🔮
              </div>
              <div>
                <h3
                  className="text-white font-bold text-sm tracking-wide"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  Nether Registration Portal
                </h3>
                <p className="text-[#c026d3] text-xs font-semibold mt-1.5">
                  National Agentic AI Challenge 2026
                </p>
              </div>

              <div className="bg-[#1e1e1e] p-3.5 border border-[#444] text-left space-y-2 text-xs">
                <p className="text-gray-200">
                  <strong className="text-[#fbbf24]">Status:</strong> {EVENT_DATA.registration.note}
                </p>
                <p className="text-gray-300">
                  <strong className="text-[#10b981]">Team Size:</strong> {EVENT_DATA.details.teamSize}
                </p>
                <p className="text-gray-300">
                  <strong className="text-[#38bdf8]">Eligibility:</strong> {EVENT_DATA.details.eligibility}
                </p>
              </div>

              {EVENT_DATA.registration.url ? (
                <a
                  href={EVENT_DATA.registration.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold border-2 border-[#047857] shadow-lg transition uppercase tracking-wider"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  ⚡ Register Team Now
                </a>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 bg-[#444] text-gray-300 text-xs font-bold border-2 border-[#222] cursor-not-allowed opacity-80"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  Registration Opening Soon
                </button>
              )}
            </div>
          )}

          {/* ================= FAQS VARIANT ================= */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              {EVENT_DATA.faqs.map((faq, i) => (
                <div key={i} className="bg-[#1e1e1e] p-3 border border-[#444]">
                  <h4 className="text-[#fbbf24] font-bold text-xs mb-1">
                    Q: {faq.question}
                  </h4>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation Bar — Minecraft Grey Inset */}
        <div className="mt-3 pt-2.5 border-t-2 border-[#8b8b8b] flex flex-wrap items-center justify-between gap-2">
          {/* Quick Category Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'about', label: 'About' },
              { id: 'challenge', label: 'SDGs' },
              { id: 'rules', label: 'Rules' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'prizes', label: 'Prizes' },
              { id: 'registration', label: 'Register' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectTab?.(tab.id as PanelTab)}
                className={`px-2.5 py-1 text-[9px] font-bold border-2 transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#555] text-[#fbbf24] border-t-black border-l-black border-b-white border-r-white'
                    : 'bg-[#8b8b8b] hover:bg-[#9e9e9e] text-black border-t-white border-l-white border-b-black border-r-black'
                }`}
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Close / Return to World Action */}
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#8b8b8b] hover:bg-[#a0a0a0] active:bg-[#666] text-[#222] font-bold text-[9px] border-2 border-t-white border-l-white border-b-black border-r-black cursor-pointer transition flex items-center gap-1.5"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <span>↩ Return to World</span>
          </button>
        </div>
      </div>
    </div>
  );
}
