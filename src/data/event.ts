// Centralized Event Configuration — AGENTCRAFT: National Agentic AI Challenge for SDGs
// Source: Official Event Poster — AAAI Global Professional Chapter & MIT Academy of Engineering

export interface PrizeItem {
  place: string;
  title: string;
  reward: string;
  badge: string;
}

export type PrizeData = PrizeItem[] & {
  totalPool: string;
  totalPoolAmount: number;
  perks: string[];
  note: string;
};

export interface SponsorItem {
  name: string;
  tier: string;
  role: string;
}

export type SponsorData = SponsorItem[] & {
  organizer: string;
  academicPartner: string;
  statusNote: string;
};

export interface SdgTrackItem {
  id: number | string;
  name: string;
  trackName: string;
  sdgNumber: string;
  sdgTitle: string;
  color: string;
  badgeBg: string;
  badgeTextColor?: string;
  borderColor?: string;
  dividerGradient: string;
  icon: string;
  iconAlt: string;
  description: string;
}

export interface EventData {
  name: string;
  shortName: string;
  tagline: string;
  subtitle: string;
  organizers: {
    lead: string;
    chapter: string;
    studentChapter: string;
    associated: Array<{
      name: string;
      role: string;
      category: string;
    }>;
    institution: {
      name: string;
      affiliation: string;
      campus: string;
      location: string;
    };
  };
  organizer: {
    name: string;
    department: string;
    location: string;
    shortName: string;
    logoUrl?: string;
  };
  details: {
    eventDate: string;
    eventDateISO: string; // ISO string in Asia/Kolkata timezone
    registrationDeadline: string;
    registrationDeadlineISO: string;
    venue: string;
    format: string;
    registrationFee: string;
    registrationFeeAmount: number;
    teamSize: string;
    mentorAllowed: string;
    eligibility: string;
    evaluationCategories: Array<{
      category: string;
      note: string;
    }>;
  };
  challenge: {
    overview: string;
    sdgTracks: SdgTrackItem[];
  };
  rounds: Array<{
    roundNumber: number;
    name: string;
    date: string;
    format: string;
    description: string;
    deliverables: string[];
  }>;
  timeline: Array<{
    phase: string;
    title: string;
    date: string;
    description: string;
    status: 'active' | 'upcoming' | 'completed';
  }>;
  rules: string[];
  registration: {
    isOpen: boolean;
    url: string;
    formUrl?: string;
    unstopUrl?: string;
    note: string;
  };
  prizes: PrizeData;
  sponsors: SponsorData;
  contact: {
    name: string;
    role: string;
    phone: string;
    email: string;
    venueAddress: string;
    helpline?: string;
  };
  community: {
    platform: string;
    note: string;
    status: string;
    url?: string;
  };
  agents: Record<
    string,
    {
      id: string;
      name: string;
      role: string;
      color: string;
      accentColor: string;
      description: string;
      sdgFocus: string;
      specialAbility: string;
      stats: { build: number; analyze: number; innovate: number };
    }
  >;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

// Build prize items
const prizeList: PrizeItem[] = [
  {
    place: 'Championship Pool',
    title: 'Grand AGENTCRAFT Champion',
    reward: 'Share of ₹30,000 Cash Pool + Internship Opportunities *',
    badge: '🏆',
  },
  {
    place: 'Track A: FY Innovators',
    title: 'First Year Excellence Award',
    reward: 'Cash Prize, Trophy & Industry Mentorship Pathways',
    badge: '🥈',
  },
  {
    place: 'Track B: Senior Developers',
    title: 'SY, TY & Open to All Agentic Architecture Award',
    reward: 'Cash Prize, Trophy & Fast-Track Internship Pathways',
    badge: '🎖️',
  },
];

const prizesData = Object.assign(prizeList, {
  totalPool: '₹30,000/-',
  totalPoolAmount: 30000,
  perks: [
    'Grand Cash Awards & Trophies',
    'Winners get Internship Opportunities *',
    'Certificates of Excellence from AAAI Global Chapter & MIT AOE',
    'Mentorship from Industry AI Architects',
  ],
  note: '* Internship opportunities subject to sponsor partner evaluation and performance in the grand finale.',
});

// Build sponsor items
const sponsorList: SponsorItem[] = [
  {
    name: 'SAGVEEK Technologies Pvt. Ltd.',
    tier: 'Industry Partner',
    role: 'Technology & Cloud Solutions',
  },
  {
    name: 'AiSyntelligence LLP',
    tier: 'AI Ecosystem Partner',
    role: 'Agentic Intelligence & Research',
  },
  {
    name: 'Capabl.',
    tier: 'Career & Platform Partner',
    role: 'Skill Acceleration & Internship Pathways',
  },
];

const sponsorsData = Object.assign(sponsorList, {
  organizer: 'ASTRA Student Association & MIT Academy of Engineering',
  academicPartner: 'In association with AAAI Global Professional Chapter & AlgoVedas (CSE AIML)',
  statusNote: 'Official industry sponsors and career pathways presented on the official poster.',
});

export const REGISTRATION_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeVtP4bfeKOlwPIV_j_Y7uUMZcPUagIhHenXpkZ4ZD1fS5FBA/viewform?usp=publish-editor';

export const UNSTOP_REGISTRATION_URL =
  'https://unstop.com/o/ty2qnMX?lb=useP3YRL&utm_medium=Share&utm_source=dipteghu57679&utm_campaign=Competitions';

export const EVENT_DATA: EventData = {
  name: 'AGENTCRAFT',
  shortName: 'AGENTCRAFT 2026',
  tagline: 'Build Intelligent Agents. Solve Real-World Problems. Create Sustainable Impact.',
  subtitle: 'National Agentic AI Challenge for Sustainable Development Goals',
  organizers: {
    lead: 'ASTRA Student Association',
    chapter: 'AAAI Global Professional Chapter',
    studentChapter: 'ASTRA Student Association',
    associated: [
      {
        name: 'ASTRA',
        role: 'Primary Student Organizing Body (Department of CSE-AIML)',
        category: 'Student Association',
      },
      {
        name: 'AAAI Global Professional Chapter',
        role: 'Associated Professional Chapter',
        category: 'Professional Society',
      },
      {
        name: 'AlgoVedas',
        role: 'Department Technical Society (CSE AIML)',
        category: 'Department Community',
      },
    ],
    institution: {
      name: 'MIT Academy of Engineering',
      affiliation: 'An Autonomous Institute Affiliated to Savitribai Phule Pune University',
      campus: 'Alandi, Pune',
      location: 'Alandi, Pune, Maharashtra, India',
    },
  },
  organizer: {
    name: 'MIT Academy of Engineering',
    department: 'AAAI Chapter & Department of CSE (AI & ML)',
    location: 'Alandi, Pune, Maharashtra, India',
    shortName: 'MIT AOE',
    logoUrl: '/images/mitaoe-logo.png',
  },
  details: {
    eventDate: '17th November 2026',
    eventDateISO: '2026-11-17T09:00:00+05:30',
    registrationDeadline: '30th October 2026',
    registrationDeadlineISO: '2026-10-30T23:59:59+05:30',
    venue: 'MIT Academy of Engineering, Alandi, Pune',
    format: '2 Rounds: Online Screening & Offline Grand Finale',
    registrationFee: '₹400/Team',
    registrationFeeAmount: 400,
    teamSize: '2–4 Students',
    mentorAllowed: '1 Mentor (Optional)',
    eligibility: 'Open to students across India (FY dedicated track; SY, TY & Open to All stream)',
    evaluationCategories: [
      {
        category: 'First Year (FY)',
        note: 'Separate Dedicated Evaluation Track for FY innovators',
      },
      {
        category: 'SY, TY & Open to All',
        note: 'Open competitive tier across autonomous multi-agent systems',
      },
    ],
  },
  challenge: {
    overview:
      'AGENTCRAFT invites student teams to build autonomous multi-agent AI systems that address real-world Sustainable Development Goals (SDGs). Move beyond simple chatbots into true agentic architectures capable of reasoning, planning, tool usage, and cooperative execution.',
    sdgTracks: [
      {
        id: 4,
        name: 'VidyaMitra — Quality Education',
        trackName: 'VidyaMitra',
        sdgNumber: 'SDG 04',
        sdgTitle: 'Quality Education',
        color: '#c5192d',
        badgeBg: '#8b1e2a',
        badgeTextColor: '#ffe4e6',
        borderColor: '#5c0f18',
        dividerGradient: 'from-red-600 via-rose-400 to-red-600',
        icon: '/assets/items/book_quill.png',
        iconAlt: 'Book and Quill',
        description:
          'Adaptive learning, knowledge-gap detection, personalized learning paths, and evaluating learning improvement.',
      },
      {
        id: 2,
        name: 'KrishiMitra — Zero Hunger',
        trackName: 'KrishiMitra',
        sdgNumber: 'SDG 02',
        sdgTitle: 'Zero Hunger',
        color: '#dca225',
        badgeBg: '#8b6819',
        badgeTextColor: '#fef3c7',
        borderColor: '#523c08',
        dividerGradient: 'from-yellow-600 via-amber-400 to-yellow-600',
        icon: '/assets/items/grass_block.png',
        iconAlt: 'Grass Block',
        description:
          'Precision agriculture, smart irrigation, crop health, soil and weather monitoring, and water-resource optimization.',
      },
      {
        id: 3,
        name: 'AarogyaSetu AI — Good Health and Well-being',
        trackName: 'AarogyaSetu AI',
        sdgNumber: 'SDG 03',
        sdgTitle: 'Good Health and Well-being',
        color: '#4c9f38',
        badgeBg: '#246b1c',
        badgeTextColor: '#dcfce7',
        borderColor: '#14400e',
        dividerGradient: 'from-emerald-600 via-green-400 to-emerald-600',
        icon: '/assets/items/golden_apple.png',
        iconAlt: 'Golden Apple',
        description:
          'Preventive health information, evidence-based guidance, source citations, and safe navigation toward appropriate healthcare.',
      },
      {
        id: 12,
        name: 'GreenGuardian — Responsible Consumption and Production',
        trackName: 'GreenGuardian',
        sdgNumber: 'SDG 12',
        sdgTitle: 'Responsible Consumption and Production',
        color: '#bf8b2e',
        badgeBg: '#785616',
        badgeTextColor: '#fef9c3',
        borderColor: '#4a340a',
        dividerGradient: 'from-amber-700 via-yellow-500 to-amber-700',
        icon: '/assets/items/chest.png',
        iconAlt: 'Chest',
        description:
          'Waste classification, recycling and recovery pathways, collection optimization, and circular resource management.',
      },
      {
        id: '11 & 13',
        name: 'RakshaGrid — Disaster Intelligence and Response',
        trackName: 'RakshaGrid',
        sdgNumber: 'SDGS 11 & 13',
        sdgTitle: 'Sustainable Cities & Climate Action',
        color: '#0284c7',
        badgeBg: '#155e75',
        badgeTextColor: '#cffafe',
        borderColor: '#0e3a47',
        dividerGradient: 'from-cyan-600 via-teal-400 to-cyan-600',
        icon: '/assets/items/ender_eye.png',
        iconAlt: 'Eye of Ender',
        description:
          'Disaster response, evacuation planning, rescue coordination, emergency resource allocation, and adaptive planning in simulated disaster scenarios.',
      },
      {
        id: 7,
        name: 'GridMind — Affordable and Clean Energy',
        trackName: 'GridMind',
        sdgNumber: 'SDG 07',
        sdgTitle: 'Affordable and Clean Energy',
        color: '#f59e0b',
        badgeBg: '#8b5219',
        badgeTextColor: '#ffe6a3',
        borderColor: '#522d08',
        dividerGradient: 'from-amber-600 via-amber-400 to-amber-600',
        icon: '/assets/items/redstone.png',
        iconAlt: 'Redstone Dust',
        description:
          'Renewable-energy forecasting, microgrid optimization, battery scheduling, and energy-resource management in a simulated environment.',
      },
      {
        id: 9,
        name: 'CyberSentinel — Autonomous Cyber Defense',
        trackName: 'CyberSentinel',
        sdgNumber: 'SDG 09',
        sdgTitle: 'Industry, Innovation and Infrastructure',
        color: '#ea580c',
        badgeBg: '#7c2d12',
        badgeTextColor: '#ffedd5',
        borderColor: '#4a1707',
        dividerGradient: 'from-orange-600 via-orange-400 to-orange-600',
        icon: '/assets/items/iron_pickaxe.png',
        iconAlt: 'Iron Pickaxe',
        description:
          'Defensive cybersecurity, suspicious-event detection, incident investigation, evidence-based response, and authorized containment in isolated environments.',
      },
      {
        id: 'open',
        name: 'Open Innovation — Any Relevant SDG',
        trackName: 'Open Innovation',
        sdgNumber: 'SDGs 01–17',
        sdgTitle: 'Global Goals Open Track',
        color: '#a855f7',
        badgeBg: '#581c87',
        badgeTextColor: '#f3e8ff',
        borderColor: '#3b0764',
        dividerGradient: 'from-purple-600 via-fuchsia-400 to-purple-600',
        icon: '/assets/items/totem.png',
        iconAlt: 'Totem of Undying',
        description:
          'Pioneer novel agentic systems beyond official tracks (e.g. diagnostics, cyber defense, DeFi, adaptive education, scientific discovery). Define your own baseline and at least 30 held-out test scenarios.',
      },
    ],
  },
  rounds: [
    {
      roundNumber: 1,
      name: 'Round 1: Online Screening',
      date: '2nd November 2026',
      format: 'Online PPT + Solution + AI Agent Demo',
      description:
        'Teams submit their conceptual multi-agent architecture, SDG problem statement, and an interactive prototype demonstration.',
      deliverables: ['Solution Architecture Presentation (PPT)', 'Working AI Agent Demo', 'SDG Problem Alignment'],
    },
    {
      roundNumber: 2,
      name: 'Round 2: Grand Finale',
      date: '17th November 2026',
      format: 'Offline Final Presentation',
      description:
        'Shortlisted finalists showcase their autonomous agentic solutions live before an esteemed jury panel on campus at MIT Academy of Engineering, Alandi, Pune.',
      deliverables: ['Live System Execution', 'Technical Q&A with Jury', 'Codebase & Deployment Inspection'],
    },
  ],
  timeline: [
    {
      phase: 'Phase 1',
      title: 'Registration Closing',
      date: '30th October 2026',
      description: 'Deadline to register teams (₹400/Team) across FY and SY, TY & Open to All streams.',
      status: 'active',
    },
    {
      phase: 'Phase 2',
      title: 'Round 1: First Screening',
      date: '2nd November 2026',
      description: 'Online submission of PPT, architecture solution, and working AI agent prototype demo.',
      status: 'upcoming',
    },
    {
      phase: 'Phase 3',
      title: 'Round 2: Grand Finale at MIT AOE',
      date: '17th November 2026',
      description: 'Offline final presentation & live multi-agent execution before jury on campus.',
      status: 'upcoming',
    },
  ],
  rules: [
    'Teams must comprise 2 to 4 student members, plus 1 optional mentor.',
    'Registration fee of ₹400/Team must be completed before the 30th October 2026 deadline.',
    'First Year (FY) innovators are evaluated in their own separate dedicated track.',
    'Round 1 deliverables: Solution PPT, architecture overview, and working AI agent demo.',
    'Round 2 finalists must present in person at MIT Academy of Engineering, Alandi, Pune on 17th November 2026.',
  ],
  registration: {
    isOpen: true,
    url: REGISTRATION_FORM_URL,
    formUrl: REGISTRATION_FORM_URL,
    unstopUrl: UNSTOP_REGISTRATION_URL,
    note: 'Registration is ₹400/Team. Register directly via the official Google Form or through Unstop.',
  },
  prizes: prizesData,
  sponsors: sponsorsData,
  contact: {
    name: 'Ashish Lenka',
    role: 'Student Coordinator / Contact Person',
    phone: '+91 81170 31180',
    email: 'astra.cseaiml@mitaoe.ac.in',
    venueAddress: 'MIT Academy of Engineering, Dehu Phata, Alandi, Pune - 412105, Maharashtra, India',
    helpline: 'Ashish Lenka (+91 81170 31180)',
  },
  community: {
    platform: 'WhatsApp Community',
    note: 'Join the official AGENTCRAFT WhatsApp Community for round announcements, mentor office hours, and team coordination.',
    status: 'Official community hub managed by AAAI Student Chapter & AlgoVedas.',
    url: 'https://chat.whatsapp.com/HCoLTsCSoQ2J6N35w1eh1A',
  },
  agents: {
    builder: {
      id: 'builder',
      name: 'Agent Alpha',
      role: 'Voxel Architect & Systems Builder',
      color: '#10b981',
      accentColor: '#059669',
      description:
        'Constructs foundational multi-agent infrastructure, tool-use pipelines, and physical/digital environmental scaffolds for SDG applications.',
      sdgFocus: 'SDG 7 (Clean Energy) & SDG 9 (Infrastructure)',
      specialAbility: 'Autonomous Structural Synthesis & Smart Tool Binding',
      stats: { build: 95, analyze: 65, innovate: 80 },
    },
    analyst: {
      id: 'analyst',
      name: 'Agent Beta',
      role: 'Data Analyst & Optimization Engine',
      color: '#38bdf8',
      accentColor: '#0284c7',
      description:
        'Parses telemetry streams, calculates optimal distribution vectors, and coordinates multi-agent consensus protocols.',
      sdgFocus: 'SDG 11 (Sustainable Cities) & SDG 12 (Responsible Consumption)',
      specialAbility: 'Predictive Resource Simulation & Real-Time Telemetry',
      stats: { build: 60, analyze: 98, innovate: 75 },
    },
    innovator: {
      id: 'innovator',
      name: 'Agent Gamma',
      role: 'Creative Heuristics & Strategic Planner',
      color: '#c026d3',
      accentColor: '#9333ea',
      description:
        'Experiments with emergent multi-agent collaboration strategies, reflection loops, and adaptive problem-solving heuristics.',
      sdgFocus: 'SDG 13 (Climate Action) & SDG 17 (Partnerships for the Goals)',
      specialAbility: 'Emergent Strategy Synthesis & Tree-of-Thought Reasoning',
      stats: { build: 75, analyze: 70, innovate: 96 },
    },
  },
  faqs: [
    {
      question: 'What is AGENTCRAFT?',
      answer:
        'AGENTCRAFT is the National Agentic AI Challenge organized by AAAI Global Professional Chapter in association with AlgoVedas and ASTRA at MIT Academy of Engineering, Alandi, Pune. It challenges collegiate teams to build autonomous multi-agent AI systems that address real-world Sustainable Development Goals (SDGs).',
    },
    {
      question: 'Who is eligible to participate and how are teams evaluated?',
      answer:
        'Students from all years and disciplines are welcome! Teams consist of 2 to 4 students, plus 1 optional mentor. To ensure fair competition, there is a separate dedicated evaluation for First Year (FY) students, and a competitive tier for SY, TY & Open to All students.',
    },
    {
      question: 'What are the competition rounds and dates?',
      answer:
        'The challenge has two rounds: Round 1 (Online Screening on 2nd November 2026) involves submitting an online PPT, solution architecture, and AI agent demo. Shortlisted finalists advance to Round 2 (Offline Grand Finale on 17th November 2026) for in-person presentations at MIT Academy of Engineering, Alandi, Pune.',
    },
    {
      question: 'What are the championship rewards and perks?',
      answer:
        'Registration is ₹400 per team. Winners receive grand cash awards (revealed at the bedrock mining vault), exclusive internship opportunities with our sponsor partners, trophies, and certificates of excellence.',
    },
    {
      question: 'When is the registration deadline?',
      answer:
        'The official registration deadline is 30th October 2026. Register early through the official portal or WhatsApp community desk.',
    },
    {
      question: 'Who can I contact for queries or support?',
      answer:
        'For official inquiries, contact Ashish Lenka at +91 81170 31180 or visit the AAAI Student Chapter coordination desk at MIT AOE.',
    },
  ],
};

export interface DocumentItem {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  fileName: string;
  fileUrl: string;
  fileType: 'pdf' | 'pptx';
  formatLabel: string;
  badge: string;
  badgeVariant: 'emerald' | 'gold' | 'diamond' | 'stone';
  itemIcon: string;
  description: string;
  previewPrefix?: string;
  totalPages?: number;
  totalSlides?: number;
}

export interface RulebookSection {
  num: string;
  title: string;
  page: number;
  summary: string;
}

export interface PresentationSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  keyRequirements: string[];
  scoringTips: string;
  deliverableFocus: string;
}

export interface EvaluationCriterion {
  category: string;
  points: number;
  description: string;
  rubricItems: string[];
  accentColor: string;
}

export const OFFICIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'rulebook',
    title: 'Official Rulebook',
    shortTitle: 'Rulebook',
    subtitle: 'Regulations, Streams & Guidelines',
    fileName: 'AgentCraft_Official_Rulebook.pdf',
    fileUrl: '/docs/AgentCraft_Official_Rulebook.pdf',
    fileType: 'pdf',
    formatLabel: 'PDF · 14 Pages',
    badge: 'OFFICIAL RULEBOOK',
    badgeVariant: 'emerald',
    itemIcon: '/assets/items/book_quill.png',
    description:
      'Authoritative charter covering eligibility, First Year (Stream A) vs Senior (Stream B) streams, timeline, 100-point rubric, and code of conduct.',
    previewPrefix: '/docs/preview/rulebook_page_',
    totalPages: 14,
  },
  {
    id: 'tracks',
    title: 'Challenge Problem Tracks',
    shortTitle: 'Problem Tracks',
    subtitle: 'Technical Specifications & Engineering Standards',
    fileName: 'AgentCraft_Problem_Tracks.pdf',
    fileUrl: '/docs/AgentCraft_Problem_Tracks.pdf',
    fileType: 'pdf',
    formatLabel: 'PDF · 10 Pages',
    badge: 'TECHNICAL SPECS',
    badgeVariant: 'diamond',
    itemIcon: '/assets/items/ender_eye.png',
    description:
      'Detailed specifications for all challenge tracks, simulation targets, sensor disruptions, advanced requirements, and shared engineering standards.',
    previewPrefix: '/docs/preview/tracks_page_',
    totalPages: 10,
  },
  {
    id: 'template',
    title: 'Round 1 Pitch Template',
    shortTitle: 'Pitch Deck',
    subtitle: 'Official 9-Slide Presentation Deck',
    fileName: 'AgentCraft_Template.pptx',
    fileUrl: '/docs/AgentCraft_Template.pptx',
    fileType: 'pptx',
    formatLabel: 'PPTX · 9 Slides',
    badge: 'ROUND 1 TEMPLATE',
    badgeVariant: 'gold',
    itemIcon: '/assets/items/chest.png',
    description:
      'Standardized PowerPoint template for Round 1 online screening submission, covering problem context, agentic workflow, architecture, and safety.',
    totalSlides: 9,
  },
];

export const TRACKS_SECTIONS: RulebookSection[] = [
  { num: '01', title: 'Cover & Challenge Overview', page: 1, summary: 'National AI Agent Challenge overview & core principles.' },
  { num: '02', title: 'Technical Requirements & Principles', page: 2, summary: 'Autonomous AI agents that plan, use tools & verify outcomes.' },
  { num: '03', title: 'AgentCraft Challenge Framework', page: 3, summary: 'Simulated block worlds, dynamic environments & tool APIs.' },
  { num: '04', title: 'Track 01 & 02: VidyaMitra & KrishiMitra', page: 4, summary: 'Adaptive learning (SDG 4) & smart irrigation (SDG 2).' },
  { num: '05', title: 'Track 03: AarogyaSetu AI', page: 5, summary: 'Evidence-based health navigation & triage (SDG 3).' },
  { num: '06', title: 'Track 04 & 05: GreenGuardian & RakshaGrid', page: 6, summary: 'Circular resource recovery (SDG 12) & disaster response (SDG 11 & 13).' },
  { num: '07', title: 'Track 06: GridMind', page: 7, summary: 'Microgrid & renewable energy management (SDG 7).' },
  { num: '08', title: 'Track 07: CyberSentinel', page: 8, summary: 'Defensive cyber triage & sandbox containment (SDG 9).' },
  { num: '09', title: 'Shared Engineering Requirements', page: 9, summary: 'Autonomy, state memory, tool execution & responsible AI.' },
  { num: '10', title: 'Official 100-Point Judging Rubric', page: 10, summary: 'Autonomy, depth, safety, performance, innovation & demo.' },
];

export const RULEBOOK_SECTIONS: RulebookSection[] = [
  { num: '01', title: 'Introduction & Philosophy', page: 2, summary: 'Autonomous multi-agent AI systems: Reason, Act & Impact pillars.' },
  { num: '02', title: 'Challenge Objectives & Theme', page: 3, summary: 'AI for SDGs, deployability, real-world impact & fair evaluation.' },
  { num: '03', title: 'Eligibility Criteria & Streams', page: 3, summary: 'Open to FY, SY, TY, Final Year; Stream A (FY) vs Stream B (Senior).' },
  { num: '04', title: 'Team Formation & Registration', page: 4, summary: '2–4 students + optional mentor. ₹400/team fee. Deadline 30 Oct 2026.' },
  { num: '05', title: 'Competition Timeline & Dates', page: 4, summary: 'Round 1 screening (2 Nov) & Round 2 Grand Finale (17 Nov at MIT AOE).' },
  { num: '06', title: 'Problem Statements & 8 Tracks', page: 5, summary: 'VidyaMitra, KrishiMitra, AarogyaSetu, GreenGuardian, RakshaGrid, GridMind, CyberSentinel, Open Innovation.' },
  { num: '07', title: 'Shared Architecture Requirements', page: 8, summary: 'Core engineering, agent roles, tool interfaces & API standards.' },
  { num: '08', title: 'Memory, Tools & Agent Protocols', page: 8, summary: 'State transitions, tool calling, reflection loops & consensus.' },
  { num: '09', title: 'Development & Resource Usage', page: 9, summary: 'Git repositories, README documentation, API keys in environment.' },
  { num: '10', title: 'Submission Guidelines & Deliverables', page: 9, summary: 'Round 1 PPT, runnable code, agent architecture & test package.' },
  { num: '11', title: 'Evaluation Criteria (100-Point Rubric)', page: 10, summary: 'Autonomy (20), Depth (20), Safety (20), Performance (20), Innovation (10), Demo (10).' },
  { num: '12', title: 'Demo, Presentation & Q&A Guidelines', page: 10, summary: 'Online presentation protocol and in-person final jury inspection.' },
  { num: '13', title: 'Code of Conduct & Sportsmanship', page: 11, summary: 'Professional conduct, mutual respect & campus policies.' },
  { num: '14', title: 'Academic Integrity & Disqualification', page: 11, summary: 'Zero tolerance for plagiarism, fabrication or pre-built projects.' },
  { num: '15', title: 'Responsible AI, Ethics & Safety', page: 11, summary: 'Human oversight, uncertainty transparency & track safety boundaries.' },
  { num: '16', title: 'Data Privacy & Information Security', page: 12, summary: 'Synthetic data, no exposed API keys or private credentials.' },
  { num: '17', title: 'Intellectual Property Rights', page: 12, summary: 'Teams retain full code ownership; promotional showcase rights.' },
  { num: '18', title: 'Participant Dashboard & Portal Rules', page: 12, summary: 'Official links only; single submission per team via team leader.' },
  { num: '19', title: 'Prizes, Awards & Result Declaration', page: 12, summary: '₹30,000 cash pool + internship opportunities with sponsor partners.' },
  { num: '20', title: 'Grievance Redressal & Appeals', page: 13, summary: '24-hour formal review process for procedural or technical errors.' },
  { num: '21', title: 'Organizer Rights & Rule Amendments', page: 13, summary: 'Official announcements prevail on WhatsApp Community & website.' },
  { num: '22', title: 'Terms & Conditions', page: 13, summary: 'Participant compliance and campus event responsibilities.' },
  { num: '23', title: 'Contact Information & Official Channels', page: 14, summary: 'Ashish Lenka (+91 81170 31180) & official communications.' },
];

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    slideNumber: 1,
    title: 'Cover & Team Credentials',
    subtitle: 'Track, Problem Statement Title, Team Name & Roster',
    keyRequirements: [
      'Problem Statement Title & Assigned SDG Track',
      'Team Name & Registered College / Department',
      'Team Members (2 to 4 students with Year of Study)',
      'Optional Mentor Name & Affiliation',
    ],
    scoringTips: 'Ensure your track name matches official documentation and all student years are accurately declared.',
    deliverableFocus: 'Identity & Track Alignment',
  },
  {
    slideNumber: 2,
    title: 'Problem Statement',
    subtitle: 'Clear Definition of the Real-World Bottleneck',
    keyRequirements: [
      'Specific real-world bottleneck or market inefficiency',
      'Why existing static or chatbot solutions fail at this problem',
      'Target context, environmental constraints & scope',
    ],
    scoringTips: 'Ground your challenge in measurable reality. Avoid generic buzzwords; explain the exact operational friction.',
    deliverableFocus: 'Domain Need & Failure of Traditional AI',
  },
  {
    slideNumber: 3,
    title: 'Proposed Solution',
    subtitle: 'Autonomous Multi-Agent Systems Approach',
    keyRequirements: [
      'Conceptual core of your multi-agent architecture',
      'How specialized agents divide, reason, and conquer the problem',
      'Primary innovations & why agentic coordination is essential',
    ],
    scoringTips: 'Highlight the Reason-Act-Impact paradigm. Show how agents take autonomous actions rather than just generating text.',
    deliverableFocus: 'Core Agentic Value Proposition',
  },
  {
    slideNumber: 4,
    title: 'Targeted Users & SDG Impact',
    subtitle: 'User Personas & Measurable Sustainability Metrics',
    keyRequirements: [
      'Direct and indirect stakeholders / user personas',
      'Primary UN Sustainable Development Goal alignment & target indicators',
      'Measurable impact metrics (e.g., % water saved, hours reclaimed, detection rate)',
    ],
    scoringTips: 'Connect prototype outcomes directly to UN SDG targets. Use quantitative indicators wherever possible.',
    deliverableFocus: 'Beneficiaries & Social ROI',
  },
  {
    slideNumber: 5,
    title: 'Agentic AI Workflow',
    subtitle: 'Planning, Tool Selection, Execution & Reflection Loops',
    keyRequirements: [
      'Step-by-step agentic execution loop diagram',
      'Goal decomposition, planning heuristics, and dynamic replanning',
      'Tool execution, sensory feedback ingestion & memory state transitions',
    ],
    scoringTips: 'Crucial for 20 pts of Autonomy & Planning. Clearly display decision branches, error recovery, and reflection.',
    deliverableFocus: 'Orchestration & Cognitive Loops',
  },
  {
    slideNumber: 6,
    title: 'System Architecture & Tech Stack',
    subtitle: 'Engines, Frameworks, Tool APIs & Data Pipelines',
    keyRequirements: [
      'Orchestration framework (LangGraph, CrewAI, AutoGen, or custom runtime)',
      'LLM models, vector stores, memory backends, and external APIs',
      'Data ingestion pipelines, sandbox environments, and interface layer',
    ],
    scoringTips: 'Judges reward architectural depth and modularity. Clearly illustrate boundaries and state management.',
    deliverableFocus: 'Engineering Rigor & Modularity',
  },
  {
    slideNumber: 7,
    title: 'Impact & Feasibility',
    subtitle: 'Benchmark Comparisons, Quantitative Results & Deployment',
    keyRequirements: [
      'Performance compared against a baseline (fixed rules or single LLM prompt)',
      'Test results on held-out scenarios or stress conditions',
      'Computational efficiency, cost per run, and operational deployability',
    ],
    scoringTips: 'Earns 20 pts in Measurable Performance. Unsupported claims get 0 points; show tangible baseline improvements.',
    deliverableFocus: 'Empirical Proof & Real-World Viability',
  },
  {
    slideNumber: 8,
    title: 'Safety, Security & Limitations',
    subtitle: 'Guardrails, Human Oversight & Responsible AI Safeguards',
    keyRequirements: [
      'Human-in-the-loop oversight mechanisms for high-consequence actions',
      'Privacy safeguards, synthetic data boundaries, and API protection',
      'Known failure modes, hallucinations, edge-case limitations, and mitigations',
    ],
    scoringTips: 'Earns 20 pts in Reliability & Safety. Demonstrating honest limitations and error containment beats overclaiming.',
    deliverableFocus: 'Responsible AI & Threat Mitigation',
  },
  {
    slideNumber: 9,
    title: 'Conclusion & Next Steps',
    subtitle: 'Roadmap, Key Takeaways & Thank You',
    keyRequirements: [
      'Summary of prototype achievements & key lessons learned',
      'Future roadmap for Grand Finale live deployment at MIT AOE',
      'Open invitation for Jury Q&A and code inspection link',
    ],
    scoringTips: 'End on a confident, structured note. Prepare your team to defend live execution and edge cases during Q&A.',
    deliverableFocus: 'Synthesis & Finale Readiness',
  },
];

export const EVALUATION_RUBRIC: EvaluationCriterion[] = [
  {
    category: 'Agent Autonomy & Planning',
    points: 20,
    description: 'Goal decomposition, multi-step execution, dynamic tool selection, and replanning upon environmental changes.',
    accentColor: '#10b981',
    rubricItems: [
      'Decomposes complex ambiguous goals into actionable sub-tasks',
      'Selects and executes appropriate tools dynamically based on environment state',
      'Recovers autonomously from execution exceptions and invalid tool calls',
      'Re-plans when environmental parameters or feedback invalidate prior assumptions',
    ],
  },
  {
    category: 'Technical Depth & Architecture',
    points: 20,
    description: 'Engineering rigor, data flow design, memory hierarchies, multi-agent coordination, and code quality.',
    accentColor: '#38bdf8',
    rubricItems: [
      'Clean separation of concerns across specialized agents and modules',
      'Robust short-term and persistent memory design across conversational sessions',
      'Effective inter-agent communication, consensus, or delegation protocols',
      'Modular, extensible codebase with clear environment variables and documentation',
    ],
  },
  {
    category: 'Reliability & Safety',
    points: 20,
    description: 'Constraint enforcement, uncertainty handling, fail-safes, human oversight, and adherence to safety boundaries.',
    accentColor: '#f59e0b',
    rubricItems: [
      'Respects track safety boundaries (synthetic data, sandbox isolation, simulation only)',
      'Incorporates human-in-the-loop gates for high-impact or destructive actions',
      'Handles incomplete, delayed, or contradictory sensor/log telemetry gracefully',
      'Transparently discloses uncertainty, limitations, and failure boundaries',
    ],
  },
  {
    category: 'Measurable Performance',
    points: 20,
    description: 'Empirical benchmark comparisons against baseline controllers, held-out test evaluations, and quantitative outcomes.',
    accentColor: '#8b5cf6',
    rubricItems: [
      'Evaluated against a credible baseline (e.g. fixed-rule heuristics or vanilla LLM)',
      'Tested against held-out or unseen evaluation test cases (not just cherry-picked demos)',
      'Demonstrates statistically or quantitatively measurable impact in SDG metrics',
      'Substantiates all performance claims with reproducible evaluation logs',
    ],
  },
  {
    category: 'Innovation & Real-World Impact',
    points: 10,
    description: 'Novelty of the agentic approach, practical feasibility, and genuine alignment with UN Sustainable Development Goals.',
    accentColor: '#ec4899',
    rubricItems: [
      'Addresses a genuine real-world bottleneck aligned with the selected SDG',
      'Original conceptual approach beyond standard off-the-shelf tutorials',
      'Feasible transition from collegiate prototype to field deployment',
    ],
  },
  {
    category: 'Demonstration & Reproducibility',
    points: 10,
    description: 'Working live or recorded prototype, comprehensive documentation, and easily reproducible setup.',
    accentColor: '#14b8a6',
    rubricItems: [
      'Clean runnable codebase with step-by-step setup instructions in README',
      'Live demonstration includes at least one intentional failure or recovery case',
      'All team members articulate their design decisions during Q&A',
    ],
  },
];

