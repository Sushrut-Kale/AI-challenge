-- ============================================================================
-- AGENTCRAFT — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Teams, members, registrations, submissions, files, audit log
-- ============================================================================

-- ============================================================================
-- 1. SEQUENCES
-- ============================================================================

-- Concurrency-safe sequence for Team ID generation (AC-2026-XXXX)
CREATE SEQUENCE IF NOT EXISTS team_id_seq START WITH 1 INCREMENT BY 1;

-- ============================================================================
-- 2. HELPER FUNCTIONS (Independent of tables)
-- ============================================================================

-- Generate a human-readable Team ID from the sequence
CREATE OR REPLACE FUNCTION generate_team_id()
RETURNS TEXT
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'AC-2026-' || LPAD(nextval('team_id_seq')::TEXT, 4, '0');
$$;

-- Auto-update updated_at timestamp on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Check if the current user has admin role (set via app_metadata by service role)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    FALSE
  );
$$;

-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- ----- TEAMS -----
CREATE TABLE IF NOT EXISTS teams (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id             TEXT NOT NULL UNIQUE,             -- AC-2026-0001
  auth_user_id        UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  team_name           TEXT NOT NULL,
  leader_name         TEXT NOT NULL,
  leader_email        TEXT NOT NULL,
  leader_phone        TEXT,
  college             TEXT,
  registration_source TEXT NOT NULL DEFAULT 'unstop',
  registration_ref    TEXT,                            -- Unstop registration/participant ID
  registration_status TEXT NOT NULL DEFAULT 'verified'
    CHECK (registration_status IN ('pending', 'verified', 'rejected')),
  track               TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  password_changed    BOOLEAN NOT NULL DEFAULT FALSE,
  provisioned_at      TIMESTAMPTZ,                      -- When auth account was created
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent duplicate Unstop registrations
CREATE UNIQUE INDEX IF NOT EXISTS idx_teams_registration_ref
  ON teams (registration_ref)
  WHERE registration_ref IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_teams_auth_user_id ON teams (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_teams_leader_email ON teams (leader_email);
CREATE INDEX IF NOT EXISTS idx_teams_is_active ON teams (is_active);

-- ----- TEAM MEMBERS -----
CREATE TABLE IF NOT EXISTS team_members (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id    UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  role       TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members (team_id);

-- ----- REGISTRATION IMPORTS -----
CREATE TABLE IF NOT EXISTS registration_imports (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename        TEXT NOT NULL,
  imported_by     UUID REFERENCES auth.users(id),
  total_rows      INTEGER NOT NULL DEFAULT 0,
  imported_count  INTEGER NOT NULL DEFAULT 0,
  skipped_count   INTEGER NOT NULL DEFAULT 0,
  successful      INTEGER NOT NULL DEFAULT 0,
  duplicates      INTEGER NOT NULL DEFAULT 0,
  errors          INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'completed'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_details   JSONB DEFAULT '[]'::JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----- SUBMISSIONS -----
CREATE TABLE IF NOT EXISTS submissions (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id           UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  project_name      TEXT NOT NULL,
  track             TEXT NOT NULL,
  synopsis          TEXT,
  repo_url          TEXT,
  demo_url          TEXT,
  hosted_url        TEXT,
  status            TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'resubmitted')),
  submitted_at      TIMESTAMPTZ,
  reviewer_feedback TEXT,
  score             NUMERIC(5,2),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One active submission per team
CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_team_id ON submissions (team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status);

-- ----- SUBMISSION FILES -----
CREATE TABLE IF NOT EXISTS submission_files (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  team_id         UUID REFERENCES teams(id) ON DELETE CASCADE,
  file_name       TEXT NOT NULL,
  file_type       TEXT NOT NULL,
  mime_type       TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  file_path       TEXT NOT NULL,
  upload_status   TEXT NOT NULL DEFAULT 'uploaded',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submission_files_submission_id ON submission_files (submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_files_team_id ON submission_files (team_id);

-- ----- AUDIT LOG -----
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id    UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  details     JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id ON audit_log (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log (created_at DESC);

-- ============================================================================
-- 4. TABLE-DEPENDENT HELPER FUNCTIONS
-- Defined AFTER tables exist so relation "teams" is resolvable
-- ============================================================================

-- Get the team UUID for the currently authenticated user
CREATE OR REPLACE FUNCTION get_user_team_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM teams WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS trg_teams_updated_at ON teams;
CREATE TRIGGER trg_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_submissions_updated_at ON submissions;
CREATE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if rerun
DO $$
BEGIN
  -- Teams
  DROP POLICY IF EXISTS teams_select_own ON teams;
  DROP POLICY IF EXISTS teams_insert_admin ON teams;
  DROP POLICY IF EXISTS teams_update_admin ON teams;
  DROP POLICY IF EXISTS teams_update_own_password ON teams;
  
  -- Team Members
  DROP POLICY IF EXISTS members_select_own ON team_members;
  DROP POLICY IF EXISTS members_all_admin ON team_members;
  
  -- Registration Imports
  DROP POLICY IF EXISTS imports_admin_only ON registration_imports;
  
  -- Submissions
  DROP POLICY IF EXISTS submissions_select_own ON submissions;
  DROP POLICY IF EXISTS submissions_insert_own ON submissions;
  DROP POLICY IF EXISTS submissions_update_own ON submissions;
  DROP POLICY IF EXISTS submissions_admin_all ON submissions;
  
  -- Submission Files
  DROP POLICY IF EXISTS files_select_own ON submission_files;
  DROP POLICY IF EXISTS files_insert_own ON submission_files;
  DROP POLICY IF EXISTS files_delete_own ON submission_files;
  DROP POLICY IF EXISTS files_admin_all ON submission_files;
  
  -- Audit Log
  DROP POLICY IF EXISTS audit_log_admin_read ON audit_log;
  DROP POLICY IF EXISTS audit_log_insert_service ON audit_log;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- ----- TEAMS RLS -----
CREATE POLICY teams_select_own ON teams
  FOR SELECT USING (auth_user_id = auth.uid() OR is_admin());

CREATE POLICY teams_insert_admin ON teams
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY teams_update_admin ON teams
  FOR UPDATE USING (is_admin());

CREATE POLICY teams_update_own_password ON teams
  FOR UPDATE USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- ----- TEAM MEMBERS RLS -----
CREATE POLICY members_select_own ON team_members
  FOR SELECT USING (team_id = get_user_team_id() OR is_admin());

CREATE POLICY members_all_admin ON team_members
  FOR ALL USING (is_admin());

-- ----- REGISTRATION IMPORTS RLS -----
CREATE POLICY imports_admin_only ON registration_imports
  FOR ALL USING (is_admin());

-- ----- SUBMISSIONS RLS -----
CREATE POLICY submissions_select_own ON submissions
  FOR SELECT USING (team_id = get_user_team_id() OR is_admin());

CREATE POLICY submissions_insert_own ON submissions
  FOR INSERT WITH CHECK (team_id = get_user_team_id());

CREATE POLICY submissions_update_own ON submissions
  FOR UPDATE USING (team_id = get_user_team_id() AND status = 'draft')
  WITH CHECK (team_id = get_user_team_id());

CREATE POLICY submissions_admin_all ON submissions
  FOR ALL USING (is_admin());

-- ----- SUBMISSION FILES RLS -----
CREATE POLICY files_select_own ON submission_files
  FOR SELECT USING (
    submission_id IN (SELECT id FROM submissions WHERE team_id = get_user_team_id())
    OR is_admin()
  );

CREATE POLICY files_insert_own ON submission_files
  FOR INSERT WITH CHECK (
    submission_id IN (SELECT id FROM submissions WHERE team_id = get_user_team_id() AND status = 'draft')
  );

CREATE POLICY files_delete_own ON submission_files
  FOR DELETE USING (
    submission_id IN (SELECT id FROM submissions WHERE team_id = get_user_team_id() AND status = 'draft')
  );

CREATE POLICY files_admin_all ON submission_files
  FOR ALL USING (is_admin());

-- ----- AUDIT LOG RLS -----
CREATE POLICY audit_log_admin_read ON audit_log
  FOR SELECT USING (is_admin());

CREATE POLICY audit_log_insert_service ON audit_log
  FOR INSERT WITH CHECK (TRUE);
