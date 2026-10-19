'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, useCallback } from 'react';
import MinecraftLoadingScreen from './MinecraftLoadingScreen';
import MinecraftPanel, { PanelTab } from './MinecraftPanel';
import WebsiteHUD from './WebsiteHUD';

// Dynamically import the WorldCanvas with no SSR
const WorldCanvas = dynamic(
  () => import('@/components/world/WorldCanvas'),
  {
    ssr: false,
    loading: () => <MinecraftLoadingScreen progress={15} isReady={false} />,
  }
);

export default function WorldPage() {
  const [activePanel, setActivePanel] = useState<PanelTab | null>(null);
  const [activePreset, setActivePreset] = useState<'overview' | 'sunset' | 'castle' | 'closeup'>('overview');
  const [isOrbiting, setIsOrbiting] = useState(true);

  const selectPreset = (name: 'overview' | 'sunset' | 'castle' | 'closeup') => {
    setActivePreset(name);
    window.dispatchEvent(new CustomEvent('minecraft:camera-preset', { detail: name }));
  };

  const toggleOrbit = useCallback(() => {
    setIsOrbiting((prev) => {
      const next = !prev;
      window.dispatchEvent(new CustomEvent('minecraft:toggle-orbit', { detail: next }));
      return next;
    });
  }, []);

  const resetCamera = useCallback(() => {
    setActivePreset('overview');
    setIsOrbiting(true);
    window.dispatchEvent(new CustomEvent('minecraft:reset-camera'));
  }, []);

  const openPanel = useCallback((tab: PanelTab) => {
    setActivePanel(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      window.dispatchEvent(new CustomEvent('minecraft:open-panel', { detail: tab }));
    }
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel(null);
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
      window.dispatchEvent(new CustomEvent('minecraft:close-panel'));
    }
  }, []);

  // Hash change and custom event synchronizations
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace('#', '') as PanelTab;
      if (
        hash &&
        [
          'about',
          'challenge',
          'rules',
          'timeline',
          'prizes',
          'sponsors',
          'registration',
          'faqs',
          'agent-builder',
          'agent-analyst',
          'agent-innovator',
        ].includes(hash)
      ) {
        setActivePanel(hash);
      } else if (!hash) {
        setActivePanel(null);
      }
    };

    const handleOpenPanelEvent = (e: any) => {
      if (e.detail) {
        openPanel(e.detail as PanelTab);
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('minecraft:open-panel', handleOpenPanelEvent);

    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('minecraft:open-panel', handleOpenPanelEvent);
    };
  }, [openPanel]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanel();
      } else if (!activePanel) {
        if (e.key === ' ') {
          toggleOrbit();
        } else if (e.key === '1') {
          selectPreset('overview');
        } else if (e.key === '2') {
          selectPreset('sunset');
        } else if (e.key === '3') {
          selectPreset('castle');
        } else if (e.key === '4') {
          selectPreset('closeup');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOrbiting, activePanel, closePanel, toggleOrbit]);

  return (
    <main className="fixed inset-0 w-full h-full bg-[#080d22] overflow-hidden select-none">
      {/* 3D World Canvas — persistent background, never unmounted */}
      <Suspense fallback={null}>
        <div className="absolute inset-0">
          <WorldCanvas />
        </div>
      </Suspense>

      {/* Lightweight Website HUD Overlay */}
      <WebsiteHUD
        activePanel={activePanel}
        onOpenPanel={openPanel}
        onSelectCameraPreset={selectPreset}
        activePreset={activePreset}
        isOrbiting={isOrbiting}
        onToggleOrbit={toggleOrbit}
        onResetCamera={resetCamera}
      />

      {/* Minecraft-Style Information Panel Modal */}
      <MinecraftPanel
        activeTab={activePanel}
        onClose={closePanel}
        onSelectTab={(tab) => openPanel(tab)}
      />
    </main>
  );
}
