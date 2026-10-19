'use client';

export interface AIAgentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export type AgentRole = 'builder' | 'analyst' | 'innovator';

export { default as BuilderAgent } from './BuilderAgent';
export { default as AnalystAgent } from './AnalystAgent';
export { default as InnovatorAgent } from './InnovatorAgent';
export { default as AIAgentsGroup } from './AIAgentsGroup';
