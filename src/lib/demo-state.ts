// ============================================================================
// AGENTCRAFT — Shared In-Memory Demo State
// Single source of truth for demo/preview mode data across all API routes.
// This module is shared in the same server process so mutations persist
// across route handlers until the server restarts.
// ============================================================================

export interface DemoSubmission {
  id: string;
  project_name: string;
  track: string;
  synopsis: string;
  repo_url: string;
  demo_url: string;
  hosted_url: string;
  status: 'draft' | 'submitted';
  submitted_at: string | null;
  created_at: string;
  files: Array<{
    id: string;
    file_name: string;
    file_type: string;
    file_path: string;
    file_size_bytes: number;
    mime_type: string;
  }>;
  team?: {
    id: string;
    team_id: string;
    team_name: string;
    leader_name: string;
    leader_email: string;
  };
}

export interface DemoTeam {
  id: string;
  team_id: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  college: string;
  track: string;
  is_active: boolean;
  auth_user_id: string | null;
  created_at: string;
  members: Array<{ id: string; name: string; role?: string }>;
  submissions: Array<{ id: string; status: string; submitted_at?: string; project_name?: string }>;
}

// ---------------------------------------------------------------------------
// Team AC-001 submission (the team the user logs in as)
// This is mutated by POST /api/submissions when running in demo mode.
// ---------------------------------------------------------------------------
const initialDemoSubmission: DemoSubmission = {
  id: 'demo-sub-1',
  project_name: 'EcoAgent — Autonomous Precision Agriculture Drone Fleet',
  track: 'SDG 13: Climate Action',
  synopsis:
    'An autonomous multi-agent swarm architecture utilizing small language models on edge devices to orchestrate precision drone operations for carbon sequestration monitoring, soil moisture tracking, and chemical fertilizer reduction across agricultural acreage.',
  repo_url: 'https://github.com/agentcraft-ai/eco-agent-swarm',
  demo_url: 'https://youtu.be/dQw4w9WgXcQ',
  hosted_url: 'https://ecoagent-demo.vercel.app',
  status: 'draft',
  submitted_at: null,
  created_at: '2026-10-19T09:00:00Z',
  files: [
    {
      id: 'f1',
      file_name: 'EcoAgent_Pitch_Deck_v2.pdf',
      file_type: 'pitch_deck',
      file_path: 'submissions/AC-2026-0001/draft/pitch_deck/deck.pdf',
      file_size_bytes: 4280000,
      mime_type: 'application/pdf',
    },
  ],
  team: {
    id: 'team-demo-1',
    team_id: 'AC-001',
    team_name: 'Voxel Agents',
    leader_name: 'Alex Chen',
    leader_email: 'team@agentcraft.ai',
  },
};

const g = globalThis as unknown as { __agentcraft_demo_submission?: DemoSubmission };
if (!g.__agentcraft_demo_submission) {
  g.__agentcraft_demo_submission = initialDemoSubmission;
}

export function getDemoSubmission(): DemoSubmission {
  if (!g.__agentcraft_demo_submission) {
    g.__agentcraft_demo_submission = { ...initialDemoSubmission };
  }
  return g.__agentcraft_demo_submission;
}

export function updateDemoSubmission(updates: Partial<DemoSubmission>): DemoSubmission {
  const current = getDemoSubmission();
  g.__agentcraft_demo_submission = {
    ...current,
    ...updates,
    team: {
      ...current.team,
      ...(updates.team || {}),
    } as DemoSubmission['team'],
  };
  return g.__agentcraft_demo_submission;
}

// ---------------------------------------------------------------------------
// Other demo teams & submissions (static, shown alongside the live one)
// ---------------------------------------------------------------------------
export const DEMO_OTHER_SUBMISSIONS: DemoSubmission[] = [
  {
    id: 'sub-demo-2',
    project_name: 'MedAgent Vision — Autonomous Diagnostic Triage in Rural Clinics',
    track: 'SDG 3: Good Health & Well-Being',
    synopsis:
      'A federated multi-modal clinical reasoning agent trained to assist community health workers with differential diagnosis, prescription verification, and emergency patient triage in connectivity-constrained rural healthcare outposts.',
    repo_url: 'https://github.com/agentcraft-ai/medagent-vision',
    demo_url: 'https://youtu.be/dQw4w9WgXcQ',
    hosted_url: 'https://medagent-rural.vercel.app',
    status: 'submitted',
    submitted_at: '2026-10-19T14:20:00Z',
    created_at: '2026-10-18T16:30:00Z',
    team: {
      id: 'team-demo-2',
      team_id: 'AC-2026-0002',
      team_name: 'Neural Crafters',
      leader_name: 'Priya Patel',
      leader_email: 'priya@example.com',
    },
    files: [
      {
        id: 'f2',
        file_name: 'MedAgent_Architecture_Report.pdf',
        file_type: 'report',
        file_path: 'submissions/AC-2026-0002/final/report/architecture.pdf',
        file_size_bytes: 5120000,
        mime_type: 'application/pdf',
      },
    ],
  },
];

export function getAllDemoSubmissions(): DemoSubmission[] {
  return [getDemoSubmission(), ...DEMO_OTHER_SUBMISSIONS];
}

// ---------------------------------------------------------------------------
// Demo teams list (admin teams tab)
// The first team's submission status is dynamically derived from
// getDemoSubmission() so admin always sees the real-time status.
// ---------------------------------------------------------------------------
export function getDemoTeams(): DemoTeam[] {
  const currentSub = getDemoSubmission();
  return [
    {
      id: 'team-demo-1',
      team_id: 'AC-001',
      team_name: 'Voxel Agents',
      leader_name: 'Alex Chen',
      leader_email: 'team@agentcraft.ai',
      leader_phone: '+91 98765 43210',
      college: 'MIT Academy of Engineering, Pune',
      track: 'SDG 13: Climate Action',
      is_active: true,
      auth_user_id: 'auth-user-1',
      created_at: '2026-10-18T10:00:00Z',
      members: [
        { id: 'm1', name: 'Alex Chen', role: 'Leader' },
        { id: 'm2', name: 'Maya Lin', role: 'Member' },
        { id: 'm3', name: 'Rahul Sharma', role: 'Member' },
      ],
      submissions: [
        {
          id: currentSub.id,
          status: currentSub.status,
          submitted_at: currentSub.submitted_at || undefined,
          project_name: currentSub.project_name,
        },
      ],
    },
    {
      id: 'team-demo-2',
      team_id: 'AC-2026-0002',
      team_name: 'Neural Crafters',
      leader_name: 'Priya Patel',
      leader_email: 'priya@example.com',
      leader_phone: '+91 91234 56789',
      college: 'COEP Technological University',
      track: 'SDG 3: Good Health & Well-Being',
      is_active: true,
      auth_user_id: 'auth-user-2',
      created_at: '2026-10-18T11:30:00Z',
      members: [
        { id: 'm4', name: 'Priya Patel', role: 'Leader' },
        { id: 'm5', name: 'Ananya Deshmukh', role: 'Member' },
      ],
      submissions: [
        { id: 'sub-2', status: 'submitted', submitted_at: '2026-10-19T14:20:00Z', project_name: 'MedAgent Vision' },
      ],
    },
    {
      id: 'team-demo-3',
      team_id: 'AC-2026-0003',
      team_name: 'Quantum Pioneers',
      leader_name: 'Rohan Joshi',
      leader_email: 'rohan.j@gmail.com',
      leader_phone: '+91 99887 76655',
      college: 'PICT Pune',
      track: 'SDG 7: Affordable & Clean Energy',
      is_active: true,
      auth_user_id: null,
      created_at: '2026-10-19T08:15:00Z',
      members: [
        { id: 'm6', name: 'Rohan Joshi', role: 'Leader' },
        { id: 'm7', name: 'Sneha Kulkarni', role: 'Member' },
        { id: 'm8', name: 'Vikram Rao', role: 'Member' },
      ],
      submissions: [],
    },
  ];
}
