'use client';

import React from 'react';
import QuestBoard from './QuestBoard';
import NetherPortal from './NetherPortal';
import InteractiveObject from './InteractiveObject';
import { EVENT_DATA } from '@/data/event';

export default function WorldLocations() {
  const handleSelectLocation = (
    tab: string,
    cameraPos: [number, number, number],
    cameraTarget: [number, number, number]
  ) => {
    // Smooth camera glide
    window.dispatchEvent(
      new CustomEvent('minecraft:camera-target', {
        detail: { pos: cameraPos, target: cameraTarget },
      })
    );

    // Open corresponding panel
    window.dispatchEvent(
      new CustomEvent('minecraft:open-panel', {
        detail: tab,
      })
    );
  };

  return (
    <group name="interactive-world-locations">
      {/* 1. Wooden Quest Board — Near Central Plaza */}
      <QuestBoard
        position={[-5.8, 3.8, 3.2]}
        rotation={[0, 0.45, 0]}
        onSelect={() =>
          handleSelectLocation('about', [4, 6.8, 8], [-5.8, 4.5, 3.2])
        }
      />

      {/* 2. Nether Registration Portal — Eastern Crag Edge */}
      <NetherPortal
        position={[26, 3.5, -6]}
        rotation={[0, -Math.PI / 4, 0]}
        onSelect={() =>
          handleSelectLocation('registration', [18, 6.5, -1], [26, 4.5, -6])
        }
      />

      {/* 3. Reward Chamber (Main Castle Battlements) */}
      <InteractiveObject
        id="rewards"
        name="Reward Chamber"
        badge="🏆 Reward Chamber"
        icon="🏆"
        badgeOffset={[-40, 24, -45]}
        onClick={() =>
          handleSelectLocation('prizes', [-28, 18, -32], [-40, 14, -45])
        }
      >
        <group position={[-40, 13, -45]}>
          {/* Subtle golden beacon beam atop the castle */}
          <mesh position={[0, 10, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 20, 8]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 4. AI Workshop & Rules (Village Crafting House) */}
      <InteractiveObject
        id="workshop"
        name="AI Workshop & Rules"
        badge="🛠 Workshop & Rules"
        icon="🛠"
        badgeOffset={[-25, 11, -20]}
        onClick={() =>
          handleSelectLocation('rules', [-16, 7.5, -14], [-25, 5.0, -20])
        }
      >
        <group position={[-25, 4.5, -20]}>
          <mesh position={[0, 4.5, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 5. Sponsor Plaza (Pillared Courtyard) */}
      <InteractiveObject
        id="sponsors"
        name="Sponsor Plaza"
        badge="🏛 Sponsor Plaza"
        icon="🏛"
        badgeOffset={[-16, 8.5, -10]}
        onClick={() =>
          handleSelectLocation('sponsors', [-10, 6.5, -5], [-16, 4.0, -10])
        }
      >
        <group position={[-16, 3.8, -10]}>
          <mesh position={[0, 3.5, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#d97706"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 6. Stone Pathway & Bridge (Event Timeline) */}
      <InteractiveObject
        id="pathway"
        name="Event Pathway & Timeline"
        badge="🗺 Pathway & Timeline"
        icon="🗺"
        badgeOffset={[12, 6.5, 8]}
        onClick={() =>
          handleSelectLocation('timeline', [18, 6.5, 14], [12, 2.5, 8])
        }
      >
        <group position={[12, 2.5, 8]}>
          <mesh position={[0, 2.8, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#059669"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      </InteractiveObject>
    </group>
  );
}
