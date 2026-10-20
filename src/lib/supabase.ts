import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_TEAM_DATA,
  INITIAL_SUBMISSION_DATA,
  INITIAL_ANNOUNCEMENTS,
  TeamData,
  SubmissionData,
  AnnouncementItem,
} from '@/data/dashboardMock';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch team data from Supabase or fallback to initial mock
 */
export async function getTeamData(teamId: string = 'AGENT-2026-042'): Promise<TeamData> {
  if (!isSupabaseConfigured) {
    return INITIAL_TEAM_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('team_id', teamId)
      .maybeSingle();

    if (error || !data) {
      return INITIAL_TEAM_DATA;
    }

    return {
      teamId: data.team_id || INITIAL_TEAM_DATA.teamId,
      teamName: data.team_name || INITIAL_TEAM_DATA.teamName,
      track: data.track || INITIAL_TEAM_DATA.track,
      unstopId: data.unstop_id || INITIAL_TEAM_DATA.unstopId,
      status: 'VERIFIED',
      currentRound: 'Round 1: Online Screening',
      deadline: '31st October 2026, 11:59 PM IST',
      college: data.college || INITIAL_TEAM_DATA.college,
      members: data.members || INITIAL_TEAM_DATA.members,
    };
  } catch (err) {
    console.warn('Failed to load team from Supabase, using mock fallback:', err);
    return INITIAL_TEAM_DATA;
  }
}

/**
 * Fetch submission data from Supabase or fallback
 */
export async function getSubmissionData(teamId: string = 'AGENT-2026-042'): Promise<SubmissionData> {
  if (!isSupabaseConfigured) {
    return INITIAL_SUBMISSION_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('team_id', teamId)
      .maybeSingle();

    if (error || !data) {
      return INITIAL_SUBMISSION_DATA;
    }

    const validStatus: SubmissionData['status'] =
      data.status === 'submitted' || data.status === 'under_review' || data.status === 'shortlisted'
        ? data.status
        : 'draft';

    return {
      projectTitle: data.project_title || INITIAL_SUBMISSION_DATA.projectTitle,
      problemStatement: data.problem_statement || INITIAL_SUBMISSION_DATA.problemStatement,
      abstract: data.abstract || INITIAL_SUBMISSION_DATA.abstract,
      sdgCategory: data.sdg_category || INITIAL_SUBMISSION_DATA.sdgCategory,
      trackId: data.track_id || INITIAL_SUBMISSION_DATA.trackId,
      githubUrl: data.github_url || INITIAL_SUBMISSION_DATA.githubUrl,
      pptUrl: data.ppt_url || INITIAL_SUBMISSION_DATA.pptUrl,
      docUrl: data.doc_url || INITIAL_SUBMISSION_DATA.docUrl,
      demoVideoUrl: data.demo_video_url || INITIAL_SUBMISSION_DATA.demoVideoUrl,
      liveDemoUrl: data.live_demo_url || '',
      additionalResources: data.additional_resources || '',
      declarationConfirmed: Boolean(data.declaration_confirmed),
      status: validStatus,
      receiptId: data.receipt_id || undefined,
      lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleString() : undefined,
      version: data.version || 1,
    };
  } catch (err) {
    console.warn('Failed to load submission from Supabase, using mock fallback:', err);
    return INITIAL_SUBMISSION_DATA;
  }
}

/**
 * Upsert submission data to Supabase
 */
export async function saveSubmissionToSupabase(
  teamId: string,
  formData: SubmissionData
): Promise<{ success: boolean; receiptId?: string; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true, receiptId: formData.receiptId };
  }

  try {
    const receipt = formData.receiptId || `AGENTCRAFT-SUB-${Math.floor(10000 + Math.random() * 90000)}-R1`;
    const payload = {
      team_id: teamId,
      project_title: formData.projectTitle,
      problem_statement: formData.problemStatement,
      abstract: formData.abstract,
      sdg_category: formData.sdgCategory,
      github_url: formData.githubUrl,
      ppt_url: formData.pptUrl,
      doc_url: formData.docUrl,
      demo_video_url: formData.demoVideoUrl,
      live_demo_url: formData.liveDemoUrl,
      additional_resources: formData.additionalResources,
      declaration_confirmed: formData.declarationConfirmed,
      status: formData.status,
      receipt_id: receipt,
      version: formData.version,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('submissions')
      .upsert(payload, { onConflict: 'team_id' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, receiptId: receipt };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown database error';
    return { success: false, error: message };
  }
}

/**
 * Fetch announcements from Supabase
 */
export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  if (!isSupabaseConfigured) {
    return INITIAL_ANNOUNCEMENTS;
  }

  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_ANNOUNCEMENTS;
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      date: item.date,
      tag: item.tag,
      link: item.link || undefined,
      linkText: item.link_text || undefined,
    }));
  } catch (err) {
    console.warn('Failed to load announcements from Supabase:', err);
    return INITIAL_ANNOUNCEMENTS;
  }
}
