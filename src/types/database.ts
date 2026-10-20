// ============================================================================
// AGENTCRAFT — Database Type Definitions
// Auto-maintained: keep in sync with supabase/migrations/001_initial_schema.sql
// ============================================================================

// ----- Enums -----

export type RegistrationStatus = 'pending' | 'verified' | 'rejected';
export type TrackType = 'FY' | 'Open';
export type TeamMemberRole = 'leader' | 'member' | 'mentor';
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type SubmissionStatus = 'draft' | 'submitted' | 'resubmitted';
export type FileType = 'pitch_deck' | 'report' | 'supporting';
export type UploadStatus = 'pending' | 'uploaded' | 'failed';
export type UserRole = 'admin' | 'team';

// ----- Row Types -----

export interface Team {
  id: string;
  team_id: string; // AC-2026-0001
  auth_user_id: string | null;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone?: string | null;
  college?: string | null;
  registration_source?: string;
  registration_ref: string | null;
  registration_status: RegistrationStatus;
  track: TrackType | null;
  is_active: boolean;
  password_changed: boolean;
  provisioned_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  name: string;
  email: string | null;
  role: TeamMemberRole;
  created_at: string;
}

export interface RegistrationImport {
  id: string;
  filename: string;
  imported_by: string | null;
  total_rows: number;
  successful: number;
  duplicates: number;
  errors: number;
  status: ImportStatus;
  error_details: ImportError[];
  created_at: string;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
}

export interface Submission {
  id: string;
  team_id: string;
  project_title: string;
  track: string;
  problem_statement: string | null;
  description: string;
  github_url: string | null;
  demo_url: string | null;
  status: SubmissionStatus;
  version: number;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionFile {
  id: string;
  submission_id: string;
  team_id: string;
  file_name: string;
  file_type: FileType;
  mime_type: string;
  file_size: number;
  r2_object_key: string;
  upload_status: UploadStatus;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// ----- Insert Types -----

export interface TeamInsert {
  team_name: string;
  leader_name: string;
  leader_email: string;
  registration_ref?: string;
  registration_status?: RegistrationStatus;
  track?: TrackType;
}

export interface TeamMemberInsert {
  team_id: string;
  name: string;
  email?: string;
  role?: TeamMemberRole;
}

export interface SubmissionInsert {
  team_id: string;
  project_title: string;
  track: string;
  problem_statement?: string;
  description: string;
  github_url?: string;
  demo_url?: string;
}

export interface SubmissionUpdate {
  project_title?: string;
  track?: string;
  problem_statement?: string;
  description?: string;
  github_url?: string;
  demo_url?: string;
  status?: SubmissionStatus;
}

// ----- CSV Import Types -----

export interface CsvRegistrationRow {
  registration_id?: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  track?: string;
  member_2_name?: string;
  member_2_email?: string;
  member_3_name?: string;
  member_3_email?: string;
  member_4_name?: string;
  member_4_email?: string;
  mentor_name?: string;
  mentor_email?: string;
}

// ----- API Response Types -----

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface TeamWithMembers extends Team {
  members: TeamMember[];
}

export interface TeamDashboardData {
  team: TeamWithMembers;
  submission: Submission | null;
  submission_files: SubmissionFile[];
  deadline: string;
  is_past_deadline: boolean;
}

export interface ProvisionResult {
  team_id: string;
  team_name: string;
  setup_link: string | null;
  temp_password?: string; // Only shown once to admin
}

export interface ImportPreview {
  valid_rows: CsvRegistrationRow[];
  duplicate_refs: string[];
  errors: ImportError[];
  total: number;
}
