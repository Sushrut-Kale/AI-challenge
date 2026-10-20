# ⚔️ AGENTCRAFT — National Agentic AI Challenge 2026

> **An immersive, Minecraft-inspired 3D web experience for the National Agentic AI Challenge at MIT Academy of Engineering (MIT AOE), Alandi, Pune in partnership with AAAI Global Chapter.**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.29-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## 🌟 Overview

**AGENTCRAFT** is a modern hackathon platform combining a retro Minecraft voxel aesthetic with cutting-edge web technologies. It features interactive 3D voxel landscapes, procedural environmental themes, a cinematic scroll-driven intro flyover, authentic Minecraft sound synthesis via Web Audio API, dynamic HUD controls, and an interactive 8-hit mining vault to uncover championship rewards.

---

## 🚀 Key Features

- **🎮 Cinematic 3D Intro Experience**: Immersive Minecraft camera flight through floating voxel islands, banners, and battle arena briefing with skip controls.
- **🌍 Dynamic Environmental Biomes**: Multi-biome world background (Overworld Forest, Desert Temple, Nether Fortress, End Dimension) synchronized to page scroll sections.
- **⛏️ 8-Hit Minecraft Mining Vault**: Interactive brown wooden crate vault covering championship rewards. Clicking triggers radiating 3D box-splitting voxel shards, progressive block cracks across 8 distinct stages, and an explosive reveal on the 8th hit.
- **🔨 Authentic Minecraft Steve Cursor**: Custom pixel-art Steve character holding a smithing hammer with realistic strike kinematics, impact sparks, and zero pointer lag.
- **🎒 9-Slot Minecraft Hotbar HUD**: Persistent navigation bar with XP level counter, smooth section scrolling, and a radiating particle celebration burst (Slot 9) with auto-clearing CSS animations.
- **🔊 Web Audio API Sound Engine**: Zero-asset procedural audio generation for stone hits, block breaks, level-up chimes, sword sweeps, and UI clicks.
- **🔐 Team Authentication Portal**: Clean modal supporting team email/password login, pre-wired for Supabase Auth with graceful mock fallback during development.
- **📱 Fully Responsive & SEO Optimized**: Pixel-perfect scaling across mobile, tablet, and desktop viewports with structured metadata and OpenGraph tags.

---

## 📁 Repository Structure

```text
AI-challenge/
├── public/                       # Static public assets
│   ├── assets/                   # Pixel art items, icons, and textures
│   └── logos/                    # Partner and organizer logos (transparent PNGs)
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── globals.css           # Core Minecraft design system, pixel fonts & keyframes
│   │   ├── layout.tsx            # Global metadata, fonts, audio manager & hotbar
│   │   └── page.tsx              # Main challenge landing page
│   ├── components/
│   │   ├── auth/                 # Team authentication (LoginModal.tsx)
│   │   ├── intro/                # Cinematic 3D intro flyover & transition sequence
│   │   ├── layout/               # Header, pixelated sticky navbar, and footer
│   │   ├── sections/             # Challenge sections:
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── TracksSection.tsx (First-Year & SY, TY & Open to All tracks)
│   │   │   ├── TimelineSection.tsx (Milestone roadmaps)
│   │   │   ├── RulesSection.tsx
│   │   │   ├── PrizesSection.tsx
│   │   │   ├── MiningPrizeVault.tsx (8-hit brown box mining vault)
│   │   │   ├── SponsorsSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── ui/                   # Minecraft UI elements (Hotbar, Cursor, Buttons, Badges)
│   │   └── world/                # Three.js / React Three Fiber 3D scene & voxel terrain
│   ├── context/                  # Environmental theme state management
│   ├── data/                     # Event configuration & challenge data (event.ts)
│   ├── hooks/                    # Custom hooks (e.g., useReducedMotion)
│   ├── lib/                      # Supabase client & procedural world generation utilities
│   └── types/                    # TypeScript interfaces & Three.js JSX declarations
├── .env.example                  # Environment configuration template
├── next.config.mjs               # Next.js build optimizations
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler options
└── vercel.json                   # Vercel deployment & caching headers
```

---

## 🛠️ Local Development

### Prerequisites

- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone & Install

```bash
git clone https://github.com/Sushrut-Kale/AI-challenge.git
cd AI-challenge
npm install
```

### 2. Configure Environment (Optional)

Copy the environment template:

```bash
cp .env.example .env.local
```

*(You can run the app without setting Supabase variables; the portal will automatically use mock validation until keys are configured).*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port displayed in your terminal) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🚢 Deployment Guide (Vercel)

The project is pre-configured for seamless 1-click deployment on **Vercel**.

### Option A: Deploy via Vercel Web Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Import the repository: `Sushrut-Kale/AI-challenge`.
4. In the configuration settings:
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (default)
5. **Environment Variables** *(Can be added now or later)*:
   - `NEXT_PUBLIC_SUPABASE_URL`: *(Your Supabase project URL)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(Your Supabase anon key)*
6. Click **"Deploy"**. Vercel will build and assign a live URL (e.g., `https://ai-challenge.vercel.app`).

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

For production deployment:

```bash
vercel --prod
```

---

## 🔒 Supabase Authentication Roadmap

The authentication flow is pre-wired in [`src/lib/supabase.ts`](src/lib/supabase.ts) and [`src/components/auth/LoginModal.tsx`](src/components/auth/LoginModal.tsx):

1. **Current State**: The portal opens, validates inputs, and triggers a simulated "ACCESS GRANTED" status without needing active database credentials.
2. **Next Steps (When Ready)**:
   - Create a project on [supabase.com](https://supabase.com).
   - Under **Authentication** → **Users**, add authorized team accounts (or invite teams with predefined passwords).
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel Project Settings → Environment Variables.
   - The application will automatically switch from mock mode to live Supabase Auth without any code changes!

---

## 📜 License

Created for **AGENTCRAFT — National Agentic AI Challenge 2026** at MIT Academy of Engineering (MIT AOE), Alandi, Pune. All rights reserved.
