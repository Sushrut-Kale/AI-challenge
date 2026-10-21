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
