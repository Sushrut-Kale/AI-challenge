'use client';

import React from 'react';
import BuilderAgent from './BuilderAgent';
import AnalystAgent from './AnalystAgent';
import InnovatorAgent from './InnovatorAgent';
import InteractiveObject from '../interactive/InteractiveObject';

interface AIAgentsGroupProps {
  onSelectAgent?: (agentId: string) => void;
}

export default function AIAgentsGroup({ onSelectAgent }: AIAgentsGroupProps) {
  const handleSelect = (agentId: string, cameraPos: [number, number, number], target: [number, number, number]) => {
    // Dispatch camera move
    window.dispatchEvent(
      new CustomEvent('minecraft:camera-target', {
        detail: { pos: cameraPos, target },
      })
    );

    if (onSelectAgent) {
      onSelectAgent(agentId);
    } else {
      window.dispatchEvent(
        new CustomEvent('minecraft:open-panel', {
          detail: agentId,
        })
      );
    }
  };

  return (
    <group name="ai-agents-trio">
      {/* Agent Alpha — Builder (Left) */}
      <InteractiveObject
        id="agent-builder"
        name="Agent Alpha"
        badge="⛏ Builder Alpha"
        icon="⛏"
        badgeOffset={[-2.4, 7.8, 0.4]}
        onClick={() => handleSelect('agent-builder', [6, 7.2, 8], [-2.4, 5.2, 0.4])}
      >
        <BuilderAgent
          position={[-2.4, 5.05, 0.4]}
          rotation={[0, 0.9, 0]}
          scale={1.1}
        />
      </InteractiveObject>

      {/* Agent Gamma — Innovator (Center Stage) */}
      <InteractiveObject
        id="agent-innovator"
        name="Agent Gamma"
        badge="⚡ Innovator Gamma"
        icon="⚡"
        badgeOffset={[0, 8.0, -0.2]}
        onClick={() => handleSelect('agent-innovator', [4, 7.2, 6], [0, 5.2, -0.2])}
      >
        <InnovatorAgent
          position={[0, 5.05, -0.2]}
          rotation={[0, 0.72, 0]}
          scale={1.15}
        />
      </InteractiveObject>

      {/* Agent Beta — Analyst (Right) */}
      <InteractiveObject
        id="agent-analyst"
        name="Agent Beta"
        badge="📊 Analyst Beta"
        icon="📊"
        badgeOffset={[2.4, 7.8, 0.4]}
        onClick={() => handleSelect('agent-analyst', [8, 7.2, 5], [2.4, 5.2, 0.4])}
      >
        <AnalystAgent
          position={[2.4, 5.05, 0.4]}
          rotation={[0, 0.55, 0]}
          scale={1.1}
        />
      </InteractiveObject>
    </group>
  );
}
