export interface TeamMember {
  id: string;
  name: string;
  role: string;
  year: string;
  college: string;
  email: string;
  isLeader: boolean;
}

export interface SubmissionData {
  projectTitle: string;
  problemStatement: string;
  sdgCategory: string;
  trackId: string;
  abstract: string;
  githubUrl: string;
  pptUrl: string;
  docUrl: string;
  demoVideoUrl: string;
  liveDemoUrl: string;
  additionalResources: string;
  declarationConfirmed: boolean;
  status: 'draft' | 'submitted' | 'under_review' | 'shortlisted';
  receiptId?: string;
  lastUpdated?: string;
  version: number;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: 'CRITICAL' | 'IMPORTANT' | 'UPDATE' | 'RESOURCES';
  link?: string;
  linkText?: string;
}

export const INITIAL_TEAM_DATA = {
  teamId: 'AGENT-2026-TEAM',
  teamName: 'Registered Team',
  unstopId: 'UNSTOP-ID',
  track: 'SDG Track',
  status: 'VERIFIED',
  currentRound: 'Round 1: Online Screening',
  deadline: '2nd November 2026, 11:59 PM IST',
  college: 'Registered Institution',
  members: [
    {
      id: 'm1',
      name: 'Team Leader',
      role: 'Team Lead / Multi-Agent Architect',
      year: 'B.Tech',
      college: 'Registered Institution',
      email: 'team.lead@example.com',
      isLeader: true,
    },
    {
      id: 'm2',
      name: 'Team Member 2',
      role: 'AI Model & Agent Developer',
      year: 'B.Tech',
      college: 'Registered Institution',
      email: 'member2@example.com',
      isLeader: false,
    },
    {
      id: 'm3',
      name: 'Team Member 3',
      role: 'Integration & Data Specialist',
      year: 'B.Tech',
      college: 'Registered Institution',
      email: 'member3@example.com',
      isLeader: false,
    },
  ],
};

export type TeamData = typeof INITIAL_TEAM_DATA;

export const INITIAL_SUBMISSION_DATA: SubmissionData = {
  projectTitle: '',
  problemStatement: '',
  sdgCategory: 'SDG 11: Sustainable Cities & Communities',
  trackId: 'track-1',
  abstract: '',
  githubUrl: '',
  pptUrl: '',
  docUrl: '',
  demoVideoUrl: '',
  liveDemoUrl: '',
  additionalResources: '',
  declarationConfirmed: false,
  status: 'draft',
  receiptId: undefined,
  lastUpdated: undefined,
  version: 1,
};

export const OFFICIAL_RESOURCES = [
  {
    title: 'Official AGENTCRAFT PPT Template (16:9)',
    description: 'Required presentation template covering problem, agent architecture, tech stack, and SDG impact.',
    url: 'https://drive.google.com/drive/folders/agentcraft-official-ppt-template',
    badge: 'MANDATORY',
    icon: '📊',
  },
  {
    title: 'Screening Round Submission Guidelines',
    description: 'Detailed instructions on video duration (min 5-6 mins), GitHub repository documentation, and link deliverables.',
    url: 'https://drive.google.com/drive/folders/agentcraft-screening-guidelines',
    badge: 'GUIDELINE',
    icon: '📜',
  },
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Official 16:9 Presentation Template Released!',
    content:
      'All registered teams must use the official AGENTCRAFT PPT template for Round 1 submission. Ensure all slide sections are addressed.',
    date: '20th Oct 2026',
    tag: 'RESOURCES',
    link: 'https://drive.google.com/drive/folders/agentcraft-official-ppt-template',
    linkText: 'Download Template ↗',
  },
  {
    id: 'ann-2',
    title: 'Online Screening Round 1 Deadline Confirmation',
    content:
      'The deadline to submit project links (GitHub, PPT, Documentation, and 5-6 min Demo Video) is 2nd November 2026, 11:59 PM IST. Late submissions will not be evaluated.',
    date: '19th Oct 2026',
    tag: 'CRITICAL',
  },
  {
    id: 'ann-3',
    title: 'First-Year (FY) Dedicated Evaluation Track',
    content:
      'Reminder: Teams consisting entirely of First Year students will be evaluated on a separate dedicated track with equal cash award distribution.',
    date: '18th Oct 2026',
    tag: 'IMPORTANT',
  },
  {
    id: 'ann-4',
    title: 'Grand Finale Offline Venue: MIT AOE, Alandi, Pune',
    content:
      'Shortlisted teams for Round 2 will present physically on 17th November 2026 at MIT Academy of Engineering. Travel guidelines will follow shortlist announcement.',
    date: '16th Oct 2026',
    tag: 'UPDATE',
  },
];
