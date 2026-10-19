import type { Metadata } from 'next';
import { Press_Start_2P, Inter } from 'next/font/google';
import './globals.css';
import MinecraftCursor from '@/components/ui/MinecraftCursor';
import MinecraftHotbar from '@/components/ui/MinecraftHotbar';
import MinecraftAmbientParticles from '@/components/ui/MinecraftAmbientParticles';
import { ThemeProvider } from '@/context/ThemeContext';
import WorldBackground from '@/components/world/WorldBackground';
import ThemeSelector from '@/components/ui/ThemeSelector';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const sansFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AGENTCRAFT — National Agentic AI Challenge 2026 | MIT AOE',
  description:
    'AGENTCRAFT: National Agentic AI Challenge for Sustainable Development Goals. Presented by AAAI Global Professional Chapter, AlgoVedas, and ASTRA at MIT Academy of Engineering, Alandi, Pune. Build intelligent agents, solve real-world problems, and compete for ₹30,000 + internships.',
  keywords: [
    'AGENTCRAFT',
    'Agentic AI',
    'AI Challenge',
    'AAAI Global Professional Chapter',
    'AAAI Student Chapter',
    'AlgoVedas',
    'ASTRA',
    'MIT Academy of Engineering',
    'MITAOE',
    'Sustainable Development Goals',
    'SDGs',
    'Minecraft AI Hackathon',
  ],
  authors: [{ name: 'AAAI Global Professional Chapter & MIT AOE' }],
  openGraph: {
    title: 'AGENTCRAFT — National Agentic AI Challenge 2026',
    description:
      'Build Intelligent Agents. Solve Real-World Problems. Create Sustainable Impact. 17th November 2026 at MIT Academy of Engineering, Alandi, Pune.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${sansFont.variable}`}>
      <body className="min-h-screen bg-[#0d0b09] text-neutral-100 selection:bg-emerald-500 selection:text-black font-sans pb-20">
        <ThemeProvider>
          <MinecraftCursor />
          <MinecraftAmbientParticles />
          <WorldBackground />
          <ThemeSelector />
          {children}
          <MinecraftHotbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
