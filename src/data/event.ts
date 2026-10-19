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
    sdgTracks: Array<{
      id: number;
      name: string;
      color: string;
      description: string;
    }>;
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
    title: 'SY, TY, B.Tech Agentic Architecture Award',
    reward: 'Cash Prize, Trophy & Fast-Track Internship Pathways',
    badge: '🎖️',
  },
];

const prizesData = Object.assign(prizeList, {
  totalPool: '₹30,000/-',
  totalPoolAmount: 30000,
  perks: [
    'Cash Prize Pool of ₹30,000/-',
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
    registrationFee: '₹400 / Team',
    registrationFeeAmount: 400,
    teamSize: '2–4 Students',
    mentorAllowed: '1 Mentor (Optional)',
    eligibility: 'Open to engineering students across India (FY dedicated track; SY, TY, B.Tech open stream)',
    evaluationCategories: [
      {
        category: 'First Year (FY)',
        note: 'Separate Dedicated Evaluation Track for FY innovators',
      },
      {
        category: 'Upper Years (SY, TY, B.Tech)',
        note: 'Open competitive tier across autonomous multi-agent systems',
      },
    ],
  },
  challenge: {
    overview:
      'AGENTCRAFT invites student teams to build autonomous multi-agent AI systems that address real-world Sustainable Development Goals (SDGs). Move beyond simple chatbots into true agentic architectures capable of reasoning, planning, tool usage, and cooperative execution.',
    sdgTracks: [
      {
        id: 7,
        name: 'Affordable & Clean Energy (SDG 7)',
        color: '#f59e0b',
        description: 'Multi-agent grid balancing, renewable energy forecasting, and micro-grid efficiency optimization.',
      },
      {
        id: 9,
        name: 'Industry, Innovation & Infrastructure (SDG 9)',
        color: '#ea580c',
        description: 'Autonomous supply chain agents, predictive maintenance, and sustainable manufacturing pipelines.',
      },
      {
        id: 11,
        name: 'Sustainable Cities & Communities (SDG 11)',
        color: '#10b981',
        description: 'Decentralized traffic management, municipal waste routing, and urban climate resilience agents.',
      },
      {
        id: 13,
        name: 'Climate Action (SDG 13)',
        color: '#06b6d4',
        description: 'Carbon emission monitoring, environmental sensor network coordination, and climate telemetry.',
      },
    ],
  },
  rounds: [
    {
      roundNumber: 1,
      name: 'Round 1: Online Screening',
      date: '31st October 2026',
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
      description: 'Deadline to register teams (₹400 / Team) across FY and SY/TY/B.Tech streams.',
      status: 'active',
    },
    {
      phase: 'Phase 2',
      title: 'Round 1: First Screening',
      date: '31st October 2026',
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
    'Registration fee of ₹400 / Team must be completed before the 30th October 2026 deadline.',
    'First Year (FY) innovators are evaluated in their own separate dedicated track.',
    'Round 1 deliverables: Solution PPT, architecture overview, and working AI agent demo.',
    'Round 2 finalists must present in person at MIT Academy of Engineering, Alandi, Pune on 17th November 2026.',
  ],
  registration: {
    isOpen: true,
    url: '', // Left blank per instruction: do not invent fake registration URL
    note: 'Registration is ₹400 / Team. Contact Ashish Lenka (+91 81170 31180) or visit the official WhatsApp community desk.',
  },
  prizes: prizesData,
  sponsors: sponsorsData,
  contact: {
    name: 'Ashish Lenka',
    role: 'Student Coordinator / Contact Person',
    phone: '+91 81170 31180',
    email: 'agentcraft@mitaoe.ac.in',
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
        'Students from all years are welcome! Teams consist of 2 to 4 students, plus 1 optional mentor. To ensure fair competition, there is a separate dedicated evaluation for First Year (FY) students, and a competitive tier for SY, TY, and B.Tech students.',
    },
    {
      question: 'What are the competition rounds and dates?',
      answer:
        'The challenge has two rounds: Round 1 (Online Screening on 31st October 2026) involves submitting an online PPT, solution architecture, and AI agent demo. Shortlisted finalists advance to Round 2 (Offline Grand Finale on 17th November 2026) for in-person presentations at MIT Academy of Engineering, Alandi, Pune.',
    },
    {
      question: 'What is the registration fee and prize pool?',
      answer:
        'Registration is ₹400 per team. The total prize pool is ₹30,000/-, and winners also receive exclusive internship opportunities with our sponsor partners.',
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
