'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  OFFICIAL_DOCUMENTS,
  RULEBOOK_SECTIONS,
  PRESENTATION_SLIDES,
  DocumentItem,
} from '@/data/event';
import PixelBadge from '@/components/ui/PixelBadge';
import { playMinecraftClick } from '@/components/ui/MinecraftAudioManager';

export interface DocumentViewerState {
  isOpen: boolean;
  activeDocId: 'rulebook' | 'template';
  currentPage: number; // 1 to 14
  currentSlide: number; // 1 to 9
}

export default function DocumentViewerModal() {
  const [state, setState] = useState<DocumentViewerState>({
    isOpen: false,
    activeDocId: 'rulebook',
    currentPage: 1,
    currentSlide: 1,
  });

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showOutline, setShowOutline] = useState<boolean>(true);

  // Listen for custom open events from anywhere on the page
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{
        docId?: 'rulebook' | 'template';
        page?: number;
        slide?: number;
      }>;
      const docId = customEvent.detail?.docId || 'rulebook';
      const page = customEvent.detail?.page || 1;
      const slide = customEvent.detail?.slide || 1;

      setState({
        isOpen: true,
        activeDocId: docId,
        currentPage: Math.max(1, Math.min(14, page)),
        currentSlide: Math.max(1, Math.min(9, slide)),
      });
      setZoomLevel(100);
      try {
        playMinecraftClick();
      } catch {}
    };

    window.addEventListener('agentcraft:open-document-viewer', handleOpen);
    return () => {
      window.removeEventListener('agentcraft:open-document-viewer', handleOpen);
    };
  }, []);

  const closeModal = useCallback(() => {
    try {
      playMinecraftClick();
    } catch {}
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!state.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (state.activeDocId === 'rulebook') {
          setState((prev) => ({
            ...prev,
            currentPage: Math.min(14, prev.currentPage + 1),
          }));
        } else {
          setState((prev) => ({
            ...prev,
            currentSlide: Math.min(9, prev.currentSlide + 1),
          }));
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (state.activeDocId === 'rulebook') {
          setState((prev) => ({
            ...prev,
            currentPage: Math.max(1, prev.currentPage - 1),
          }));
        } else {
          setState((prev) => ({
            ...prev,
            currentSlide: Math.max(1, prev.currentSlide - 1),
          }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isOpen, state.activeDocId, closeModal]);

  if (!state.isOpen) return null;

  const currentDoc: DocumentItem =
    OFFICIAL_DOCUMENTS.find((d) => d.id === state.activeDocId) ||
    OFFICIAL_DOCUMENTS[0];
  const isRulebook = state.activeDocId === 'rulebook';
  const currentSlideData = PRESENTATION_SLIDES[state.currentSlide - 1];

  const handleSwitchDoc = (docId: 'rulebook' | 'template') => {
    try {
      playMinecraftClick();
    } catch {}
    setState((prev) => ({
      ...prev,
      activeDocId: docId,
    }));
    setZoomLevel(100);
  };

  const jumpToPage = (page: number) => {
    try {
      playMinecraftClick();
    } catch {}
    setState((prev) => ({ ...prev, currentPage: page }));
  };

  const jumpToSlide = (slide: number) => {
    try {
      playMinecraftClick();
    } catch {}
    setState((prev) => ({ ...prev, currentSlide: slide }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Official Document Viewer"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
    >
      {/* Minecraft Inventory / Dossier Frame Container */}
      <div
        className="relative w-full max-w-6xl h-[94vh] sm:h-[90vh] bg-[#c6c6c6] border-4 border-t-white border-l-white border-b-[#404040] border-r-[#404040] p-2.5 sm:p-4 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        style={{
          boxShadow:
            'inset -3px -3px 0px #404040, inset 3px 3px 0px #ffffff, 0 20px 60px rgba(0,0,0,0.9)',
        }}
      >
        {/* Top Header / Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-[#8b8b8b] shrink-0">
          {/* Document Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleSwitchDoc('rulebook')}
              className={`px-2.5 sm:px-3.5 py-1.5 font-pixel text-[9px] sm:text-[11px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 border-2 ${
                isRulebook
                  ? 'border-[#1b3a1a] bg-[#2e5d2b] text-white shadow-[inset_2px_2px_0_#4ade80,inset_-2px_-2px_0_#142b13]'
                  : 'border-[#71717a] bg-[#8a8a8a] text-neutral-800 hover:text-white hover:bg-[#737373]'
              }`}
            >
              <span>📜</span>
              <span>RULEBOOK v1.0 (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchDoc('template')}
              className={`px-2.5 sm:px-3.5 py-1.5 font-pixel text-[9px] sm:text-[11px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 border-2 ${
                !isRulebook
                  ? 'border-[#78350f] bg-[#d97706] text-white shadow-[inset_2px_2px_0_#fde68a,inset_-2px_-2px_0_#451a03]'
                  : 'border-[#71717a] bg-[#8a8a8a] text-neutral-800 hover:text-white hover:bg-[#737373]'
              }`}
            >
              <span>📊</span>
              <span>ROUND 1 TEMPLATE (PPTX)</span>
            </button>
          </div>

          {/* Action CTAs: Direct Download & Close */}
          <div className="flex items-center gap-2">
            <a
              href={currentDoc.fileUrl}
              download={currentDoc.fileName}
              className="border-2 border-[#166534] bg-[#22c55e] hover:bg-[#16a34a] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 font-pixel text-[8px] sm:text-[10px] uppercase font-bold tracking-wider shadow-[inset_2px_2px_0_#86efac,inset_-2px_-2px_0_#14532d] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-1 cursor-pointer"
              title={`Download ${currentDoc.fileName} (${currentDoc.fileSize})`}
              onClick={() => {
                try {
                  playMinecraftClick();
                } catch {}
              }}
            >
              <span>⬇</span>
              <span className="hidden xs:inline">DOWNLOAD</span>
              <span>({currentDoc.fileSize})</span>
            </a>

            <a
              href={currentDoc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#1e293b] bg-[#334155] hover:bg-[#475569] text-white px-2 sm:px-2.5 py-1 sm:py-1.5 font-pixel text-[8px] sm:text-[10px] uppercase font-bold tracking-wider shadow-[inset_2px_2px_0_#94a3b8,inset_-2px_-2px_0_#0f172a] hidden md:inline-flex items-center gap-1 cursor-pointer"
              title="Open raw document in new browser tab"
            >
              <span>↗</span>
              <span>NEW TAB</span>
            </a>

            {/* Minecraft Close Button */}
            <button
              type="button"
              onClick={closeModal}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-[#7f1d1d] bg-[#b91c1c] hover:bg-[#dc2626] text-white font-pixel text-xs sm:text-sm font-bold shadow-[inset_2px_2px_0_#fca5a5,inset_-2px_-2px_0_#450a0a] active:translate-y-0.5 transition-transform cursor-pointer"
              aria-label="Close document viewer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Subheader / File Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#404040] text-neutral-200 border border-[#2b2b2b] mb-3 text-xs font-terminal shrink-0">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-amber-400 font-pixel text-[10px]">
              {isRulebook ? 'DOC // RULEBOOK' : 'DOC // PRESENTATION TEMPLATE'}
            </span>
            <span className="opacity-40">|</span>
            <span className="font-bold text-white text-[11px] sm:text-xs">
              {currentDoc.fileName}
            </span>
            <span className="opacity-40">•</span>
            <span className="text-emerald-400 font-pixel text-[9px]">
              {currentDoc.version}
            </span>
          </div>

          <div className="flex items-center gap-3 font-pixel text-[9px] text-neutral-300">
            {isRulebook ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowOutline(!showOutline)}
                  className="hover:text-amber-300 underline cursor-pointer"
                >
                  {showOutline ? 'HIDE INDEX' : 'SHOW INDEX'}
                </button>
                <span>PAGE {state.currentPage} OF 14</span>
              </>
            ) : (
              <span>SLIDE {state.currentSlide} OF 9</span>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative flex-1 flex gap-3 min-h-0 overflow-hidden">
          {isRulebook ? (
            /* =================== RULEBOOK PDF VIEWER =================== */
            <div className="flex-1 flex gap-3 h-full min-h-0 overflow-hidden">
              {/* Optional Section Navigator Index */}
              {showOutline && (
                <div className="hidden lg:flex flex-col w-64 bg-[#2e2e2e] border-2 border-[#1c1c1c] p-2 text-neutral-200 overflow-y-auto shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                  <div className="pb-1.5 mb-2 border-b border-white/10 font-pixel text-[9px] text-amber-400 flex items-center justify-between">
                    <span>📑 TABLE OF CONTENTS</span>
                    <span>23 SECTIONS</span>
                  </div>
                  <div className="space-y-1 font-terminal text-xs">
                    {RULEBOOK_SECTIONS.map((sec) => {
                      const isActive = state.currentPage === sec.page;
                      return (
                        <button
                          key={sec.num}
                          type="button"
                          onClick={() => jumpToPage(sec.page)}
                          className={`w-full text-left px-2 py-1.5 rounded transition-colors flex items-start gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-[#1e3a24] text-emerald-300 border-l-2 border-emerald-400'
                              : 'hover:bg-[#3d3d3d] text-neutral-300'
                          }`}
                        >
                          <span className="font-pixel text-[8px] text-amber-400/90 shrink-0">
                            {sec.num}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-pixel text-[9px] truncate">
                              {sec.title}
                            </p>
                            <p className="text-[10px] text-neutral-400 truncate">
                              p. {sec.page} · {sec.summary}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PDF Preview Canvas */}
              <div className="flex-1 flex flex-col bg-[#1c1c1c] border-2 border-[#000000] rounded overflow-hidden">
                {/* Canvas Toolbar */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#262626] border-b border-[#3d3d3d] text-xs font-pixel text-neutral-300 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={state.currentPage <= 1}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          currentPage: Math.max(1, prev.currentPage - 1),
                        }))
                      }
                      className="px-2 py-1 bg-[#3a3a3a] hover:bg-[#4a4a4a] disabled:opacity-40 border border-[#525252] text-[9px] cursor-pointer"
                    >
                      ◀ PREV
                    </button>
                    <span className="px-2 font-bold text-white text-[10px]">
                      {state.currentPage} / 14
                    </span>
                    <button
                      type="button"
                      disabled={state.currentPage >= 14}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          currentPage: Math.min(14, prev.currentPage + 1),
                        }))
                      }
                      className="px-2 py-1 bg-[#3a3a3a] hover:bg-[#4a4a4a] disabled:opacity-40 border border-[#525252] text-[9px] cursor-pointer"
                    >
                      NEXT ▶
                    </button>
                  </div>

                  {/* Zoom controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setZoomLevel((prev) => Math.max(60, prev - 15))
                      }
                      className="px-2 py-0.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] border border-[#525252] text-[9px] cursor-pointer"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span className="text-[9px] w-9 text-center">
                      {zoomLevel}%
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setZoomLevel((prev) => Math.min(150, prev + 15))
                      }
                      className="px-2 py-0.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] border border-[#525252] text-[9px] cursor-pointer"
                      title="Zoom In"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(100)}
                      className="px-1.5 py-0.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] border border-[#525252] text-[8px] cursor-pointer"
                      title="Reset Zoom"
                    >
                      FIT
                    </button>
                  </div>
                </div>

                {/* Page Image Display Container */}
                <div className="flex-1 overflow-auto p-3 sm:p-4 flex items-center justify-center bg-[#141414]">
                  <div
                    className="relative transition-transform duration-150 origin-top shadow-[0_10px_30px_rgba(0,0,0,0.85)] border-2 border-[#333]"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      maxWidth: '100%',
                    }}
                  >
                    {/* Rendered PDF Page Preview Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/docs/preview/rulebook_page_${state.currentPage}.png`}
                      alt={`AgentCraft Official Rulebook Page ${state.currentPage}`}
                      className="max-h-[70vh] w-auto object-contain bg-white block"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Bottom Quick Page Scroller */}
                <div className="p-2 bg-[#212121] border-t border-[#333] flex items-center justify-center gap-1 overflow-x-auto shrink-0">
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => jumpToPage(p)}
                      className={`h-6 min-w-[24px] px-1 font-pixel text-[8px] border transition-colors cursor-pointer ${
                        state.currentPage === p
                          ? 'border-emerald-400 bg-emerald-700 text-white font-bold'
                          : 'border-[#444] bg-[#2d2d2d] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* =================== PPTX TEMPLATE VIEWER =================== */
            <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full min-h-0 overflow-hidden">
              {/* Left Column: Slide List / Quick Jump */}
              <div className="w-full lg:w-72 bg-[#2d2d2d] border-2 border-[#1c1c1c] p-2 sm:p-3 text-neutral-200 overflow-y-auto shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                <div className="pb-1.5 mb-2 border-b border-white/10 font-pixel text-[9px] text-amber-400 flex items-center justify-between">
                  <span>📊 9 TEMPLATE SLIDES</span>
                  <span>ROUND 1 DECK</span>
                </div>

                <div className="space-y-1.5">
                  {PRESENTATION_SLIDES.map((slide) => {
                    const isActive = state.currentSlide === slide.slideNumber;
                    return (
                      <button
                        key={slide.slideNumber}
                        type="button"
                        onClick={() => jumpToSlide(slide.slideNumber)}
                        className={`w-full text-left p-2 rounded transition-all flex items-start gap-2 border cursor-pointer ${
                          isActive
                            ? 'bg-[#3c2a12] border-amber-500 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                            : 'bg-[#222222] border-[#383838] hover:bg-[#333333] text-neutral-300'
                        }`}
                      >
                        <span
                          className={`font-pixel text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                            isActive
                              ? 'bg-amber-500 text-black'
                              : 'bg-neutral-700 text-neutral-300'
                          }`}
                        >
                          #{slide.slideNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-pixel text-[9px] sm:text-[10px] text-white truncate font-bold">
                            {slide.title}
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-terminal truncate">
                            {slide.deliverableFocus}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Slide Deep-Dive & Scoring Breakdown */}
              <div className="flex-1 flex flex-col bg-[#1c1c1c] border-2 border-[#000000] rounded p-3 sm:p-5 overflow-y-auto">
                {/* Slide Header Card */}
                <div className="p-4 bg-[#262626] border-2 border-[#3d3d3d] rounded mb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <PixelBadge variant="gold">
                      SLIDE {currentSlideData.slideNumber} OF 9
                    </PixelBadge>
                    <span className="font-pixel text-[9px] text-amber-300 uppercase tracking-wider">
                      Focus: {currentSlideData.deliverableFocus}
                    </span>
                  </div>

                  <h3 className="font-pixel text-base sm:text-xl text-white mb-1 uppercase tracking-wide">
                    {currentSlideData.title}
                  </h3>
                  <p className="font-terminal text-xs sm:text-sm text-neutral-300">
                    {currentSlideData.subtitle}
                  </p>
                </div>

                {/* Mandatory Inclusions Grid */}
                <div className="mb-4">
                  <h4 className="font-pixel text-[10px] sm:text-xs text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>✔</span> Mandatory Slide Requirements
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentSlideData.keyRequirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#171717] border border-[#333] rounded flex items-start gap-2 text-xs font-terminal text-neutral-200"
                      >
                        <span className="text-emerald-400 font-pixel text-[9px] mt-0.5">
                          ►
                        </span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scoring Rubric Tip Box */}
                <div className="p-3.5 bg-[#172554]/50 border-2 border-blue-500/60 rounded mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-pixel text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                      ⚖ Judge Evaluation Tip
                    </span>
                    <span className="text-[10px] text-neutral-400 font-terminal">
                      (Mapped to 100-Point Official Rubric)
                    </span>
                  </div>
                  <p className="font-terminal text-xs sm:text-sm text-blue-200 leading-relaxed font-medium">
                    {currentSlideData.scoringTips}
                  </p>
                </div>

                {/* Slide Navigation Buttons & PPTX Download */}
                <div className="mt-auto pt-3 border-t border-[#333] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={state.currentSlide <= 1}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          currentSlide: Math.max(1, prev.currentSlide - 1),
                        }))
                      }
                      className="px-3 py-1.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] disabled:opacity-30 border border-[#555] font-pixel text-[9px] text-white cursor-pointer"
                    >
                      ◀ PREVIOUS SLIDE
                    </button>
                    <button
                      type="button"
                      disabled={state.currentSlide >= 9}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          currentSlide: Math.min(9, prev.currentSlide + 1),
                        }))
                      }
                      className="px-3 py-1.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] disabled:opacity-30 border border-[#555] font-pixel text-[9px] text-white cursor-pointer"
                    >
                      NEXT SLIDE ▶
                    </button>
                  </div>

                  <a
                    href="/docs/AgentCraft_Template.pptx"
                    download="AgentCraft_Template.pptx"
                    className="px-4 py-2 border-2 border-[#78350f] bg-[#d97706] hover:bg-[#b45309] text-white font-pixel text-[9px] sm:text-[10px] uppercase font-bold tracking-wider shadow-[inset_2px_2px_0_#fde68a,inset_-2px_-2px_0_#451a03] inline-flex items-center gap-1.5 cursor-pointer"
                    onClick={() => {
                      try {
                        playMinecraftClick();
                      } catch {}
                    }}
                  >
                    <span>⬇ DOWNLOAD COMPLETE 9-SLIDE PPTX (3.76 MB)</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Help Bar */}
        <div className="pt-2.5 mt-2.5 border-t-2 border-[#8b8b8b] flex flex-wrap items-center justify-between gap-2 text-neutral-700 font-pixel text-[8px] sm:text-[9px] shrink-0">
          <div className="flex items-center gap-3">
            <span>NAVIGATE: [ARROW KEYS] OR [CLICKS]</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">ESC TO EXIT</span>
          </div>
          <span className="text-neutral-800 font-bold">
            AGENTCRAFT 2026 · OFFICIAL CHALLENGE ASSETS
          </span>
        </div>
      </div>
    </div>
  );
}
