-- ========================================================
-- AGENTCRAFT — Supabase Production Database Schema
-- National Agentic AI Challenge 2026 | MIT AOE Pune
-- ========================================================
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run

-- 1. Create Teams Table
create table if not exists public.teams (
  id uuid default gen_random_uuid() primary key,
  team_id text unique not null,                  -- e.g. 'AGENT-2026-001'
  team_name text not null,                       -- e.g. 'Your Team Name'
  track text not null,                           -- SDG Track assigned
  unstop_id text,                                -- e.g. 'UNSTOP-REG-XXXXX'
  leader_name text not null,
  leader_email text not null,
  leader_phone text,
  college text not null,
  members jsonb default '[]'::jsonb,             -- list of team member objects
  mentor jsonb default '{}'::jsonb,              -- mentor info
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Submissions Table (Link-Based Deliverables)
create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  team_id text references public.teams(team_id) on delete cascade not null,
  project_title text default '',
  problem_statement text default '',
  abstract text default '',
  sdg_category text default '',
  github_url text default '',                    -- Mandatory GitHub repo URL
  ppt_url text default '',                       -- Mandatory 16:9 Presentation URL
  doc_url text default '',                       -- Mandatory Technical Report URL
  demo_video_url text default '',                -- Mandatory 5-6 min Video URL
  live_demo_url text default '',                 -- Optional live deployment
  additional_resources text default '',          -- Optional resources
  declaration_confirmed boolean default false,
  status text default 'draft',                   -- 'draft' | 'submitted' | 'under_review' | 'shortlisted'
  receipt_id text default null,                  -- e.g. 'AGENTCRAFT-SUB-89420-R1'
  version integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Announcements Table
create table if not exists public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  date text not null,
  tag text default 'NOTICE',                     -- 'CRITICAL' | 'RESOURCES' | 'IMPORTANT' | 'UPDATE'
  link text,
  link_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.teams enable row level security;
alter table public.submissions enable row level security;
alter table public.announcements enable row level security;

-- Public read access policies for participants & evaluation
create policy "Allow public read access to announcements"
  on public.announcements for select
  using (true);

create policy "Allow public read access to teams"
  on public.teams for select
  using (true);

create policy "Allow teams to view submissions"
  on public.submissions for select
  using (true);

create policy "Allow teams to upsert submissions"
  on public.submissions for all
  using (true)
  with check (true);

-- 5. Seed Official Event Announcements (No Dummy Teams or Dummy Submissions)
insert into public.announcements (title, content, date, tag, link, link_text)
values
  ('Official 16:9 Presentation Template Released!', 'All registered teams must use the official AGENTCRAFT PPT template for Round 1 submission. Ensure all slide sections are addressed.', '20th Oct 2026', 'RESOURCES', 'https://drive.google.com/drive/folders/agentcraft-official-ppt-template', 'Download Template ↗'),
  ('Online Screening Round 1 Deadline Confirmation', 'The deadline to submit project links (GitHub, PPT, Documentation, and 5-6 min Demo Video) is 31st October 2026, 11:59 PM IST. Late submissions will not be evaluated.', '19th Oct 2026', 'CRITICAL', null, null)
on conflict do nothing;
