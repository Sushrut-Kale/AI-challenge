'use client';

import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveObjectProps {
  id: string;
  name: string;
  icon?: string;
  badge?: string;
  badgeOffset?: [number, number, number];
  onClick: () => void;
  children: React.ReactNode;
}

export default function InteractiveObject({
  id,
  name,
  icon = '📍',
  badge,
  badgeOffset = [0, 2.5, 0],
  onClick,
  children,
}: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOpen = () => setPanelOpen(true);
    const handleClose = () => setPanelOpen(false);
    const handleHash = () => setPanelOpen(!!window.location.hash && window.location.hash !== '#');

    if (window.location.hash && window.location.hash !== '#') {
      setPanelOpen(true);
    }

    window.addEventListener('minecraft:open-panel', handleOpen);
    window.addEventListener('minecraft:close-panel', handleClose);
    window.addEventListener('hashchange', handleHash);

    return () => {
      window.removeEventListener('minecraft:open-panel', handleOpen);
      window.removeEventListener('minecraft:close-panel', handleClose);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Target Children */}
      {children}

      {/* 3D Floating Minecraft Nameplate Marker (hidden when reading modal) */}
      {!panelOpen && (
        <Html
          position={badgeOffset}
          center
          distanceFactor={35}
          zIndexRange={[100, 0]}
          className="pointer-events-auto select-none transition-all duration-300"
        >
        <button
          type="button"
          onClick={handleClick}
          onPointerEnter={handlePointerOver}
          onPointerLeave={handlePointerOut}
          aria-label={`Open ${name}`}
          className={`cursor-pointer px-2.5 py-1 rounded-none border-2 flex items-center gap-1.5 shadow-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-[#10b981] font-pixel ${
            hovered
              ? 'bg-[#10b981] border-white text-black scale-110 shadow-[0_0_12px_#10b981]'
              : 'bg-[#1e232a]/90 border-[#fbbf24]/80 text-[#fbbf24] hover:bg-[#10b981] hover:text-black hover:border-white'
          }`}
          style={{
            fontSize: '10px',
            whiteSpace: 'nowrap',
            imageRendering: 'pixelated',
          }}
        >
          <span>{icon}</span>
          <span className="tracking-wider">{badge || name}</span>
        </button>
        </Html>
      )}
    </group>
  );
}
