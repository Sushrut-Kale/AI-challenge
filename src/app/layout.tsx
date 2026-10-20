import type { Metadata, Viewport } from 'next';
import { Press_Start_2P, VT323 } from 'next/font/google';
import './globals.css';
import MinecraftCursor from '@/components/ui/MinecraftCursor';
import MinecraftHotbar from '@/components/ui/MinecraftHotbar';
import MinecraftAmbientParticles from '@/components/ui/MinecraftAmbientParticles';
import { ThemeProvider } from '@/context/ThemeContext';
import { CursorProvider } from '@/context/CursorContext';
import { AuthProvider } from '@/context/AuthContext';
import WorldBackground from '@/components/world/WorldBackground';
import { AudioProvider } from '@/components/ui/MinecraftAudioManager';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const terminalFont = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-terminal',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0d0b09',
};

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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/assets/items/grass_block.png', type: 'image/png', sizes: '128x128' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${terminalFont.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap"
        />
      </head>
      <body className="min-h-screen bg-[#0d0b09] text-neutral-100 selection:bg-emerald-500 selection:text-black font-terminal text-lg leading-relaxed pb-[calc(6rem+env(safe-area-inset-bottom,0px))] sm:pb-24">
        <ThemeProvider>
          <AuthProvider>
            <CursorProvider>
              <AudioProvider>
                <MinecraftCursor />
                <MinecraftAmbientParticles />
                <WorldBackground />
                {children}
                <MinecraftHotbar />
              </AudioProvider>
            </CursorProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
