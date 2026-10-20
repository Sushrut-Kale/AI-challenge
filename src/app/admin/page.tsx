// ============================================================================
// AGENTCRAFT — Admin Command Portal
// CSV Import, Team Provisioning, Account Management, Submissions Review
// /admin
// ============================================================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { playMinecraftClick, playMinecraftPop } from '@/components/ui/MinecraftAudioManager';

interface TeamItem {
  id: string;
  team_id: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone?: string;
  college?: string;
  track: string;
  is_active: boolean;
  auth_user_id?: string | null;
  created_at: string;
  members?: Array<{ id: string; name: string; role?: string; email?: string }>;
  submissions?: Array<{ id: string; status: 'draft' | 'submitted'; submitted_at?: string; project_name?: string }>;
}

interface SubmissionItem {
  id: string;
  project_name: string;
  track: string;
  synopsis: string;
  repo_url: string;
  demo_url: string;
  hosted_url?: string;
  status: 'draft' | 'submitted';
  submitted_at?: string;
  created_at: string;
  team?: TeamItem;
  files?: Array<{
    id: string;
    file_name: string;
    file_type: string;
    file_path: string;
    file_size_bytes: number;
    mime_type: string;
  }>;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'import' | 'teams' | 'submissions'>('teams');

  // Teams state
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [teamSearch, setTeamSearch] = useState('');
  const [teamTrackFilter, setTeamTrackFilter] = useState('');
  const [teamStatusFilter, setTeamStatusFilter] = useState('');
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Submissions state
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [subStats, setSubStats] = useState({ total: 0, submitted: 0, draft: 0 });
  const [subTrackFilter, setSubTrackFilter] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState('');
  const [loadingSubs, setLoadingSubs] = useState(false);

  // CSV Import state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    summary?: { totalRows: number; imported: number; duplicateCount: number; errorCount: number };
    createdTeams?: Array<{ team_id: string; team_name: string; leader_email: string }>;
    duplicates?: Array<{ row: number; teamName: string; email: string; reason: string }>;
    errors?: Array<{ row: number; error: string }>;
  } | null>(null);

  // Provisioning state
  const [provisioning, setProvisioning] = useState(false);
  const [provisionCredentials, setProvisionCredentials] = useState<
    Array<{ team_id: string; team_name: string; leader_email: string; temp_password?: string; status: string; error?: string }>
  >([]);

  // Security check: redirect non-admins
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [authLoading, isAdmin, router]);

  // Fetch teams
  const fetchTeams = useCallback(async () => {
    setLoadingTeams(true);
    try {
      const params = new URLSearchParams();
      if (teamSearch) params.set('q', teamSearch);
      if (teamTrackFilter) params.set('track', teamTrackFilter);
      if (teamStatusFilter) params.set('status', teamStatusFilter);

      const res = await fetch(`/api/admin/teams?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams || []);
      }
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    } finally {
      setLoadingTeams(false);
    }
  }, [teamSearch, teamTrackFilter, teamStatusFilter]);

  // Fetch submissions
  const fetchSubmissions = useCallback(async () => {
    setLoadingSubs(true);
    try {
      const params = new URLSearchParams();
      if (subTrackFilter) params.set('track', subTrackFilter);
      if (subStatusFilter) params.set('status', subStatusFilter);

      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
        if (data.stats) setSubStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoadingSubs(false);
    }
  }, [subTrackFilter, subStatusFilter]);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'teams') fetchTeams();
      if (activeTab === 'submissions') fetchSubmissions();
    }
  }, [isAdmin, activeTab, fetchTeams, fetchSubmissions]);

  // CSV Import handler
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setImporting(true);
    setImportResult(null);
    playMinecraftClick();

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setImporting(false);

      if (!res.ok) {
        alert(data.error || 'Import failed.');
      } else {
        playMinecraftPop(1.5);
        setImportResult(data);
        fetchTeams();
      }
    } catch (err) {
      setImporting(false);
      alert('Network error during import.');
    }
  };

  // Bulk Provision handler
  const handleBulkProvision = async () => {
    if (!confirm('Provision Supabase Auth accounts for all unprovisioned active teams?')) return;

    setProvisioning(true);
    playMinecraftClick();

    try {
      const res = await fetch('/api/admin/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provision_all: true }),
      });

      const data = await res.json();
      setProvisioning(false);

      if (!res.ok) {
        alert(data.error || 'Provisioning failed.');
      } else {
        playMinecraftPop(1.5);
        if (data.credentials) {
          setProvisionCredentials(data.credentials);
        }
        alert(`Successfully provisioned ${data.successCount} teams!`);
        fetchTeams();
      }
    } catch {
      setProvisioning(false);
      alert('Error during provisioning.');
    }
  };

  // Toggle team active state
  const handleToggleTeamActive = async (teamId: string, currentActive: boolean) => {
    playMinecraftClick();
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: teamId, is_active: !currentActive }),
      });

      if (res.ok) {
        fetchTeams();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update team.');
      }
    } catch {
      alert('Error updating team status.');
    }
  };

  // Export credentials CSV
  const exportCredentialsCsv = () => {
    if (provisionCredentials.length === 0) {
      alert('No provisioned credentials in memory to export. Run provisioning first.');
      return;
    }

    const headers = ['Team ID', 'Team Name', 'Leader Email', 'Temporary Password', 'Status'];
    const rows = provisionCredentials.map((c) => [
      `"${c.team_id}"`,
      `"${c.team_name}"`,
      `"${c.leader_email}"`,
      `"${c.temp_password || ''}"`,
      `"${c.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agentcraft_credentials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export submissions CSV
  const exportSubmissionsCsv = () => {
    if (submissions.length === 0) {
      alert('No submissions to export.');
      return;
    }

    const headers = [
      'Team ID',
      'Team Name',
      'Track',
      'Project Title',
      'Synopsis',
      'Repository URL',
      'Demo Video URL',
      'Live App URL',
      'Status',
      'Submitted At',
    ];

    const rows = submissions.map((s) => [
      `"${s.team?.team_id || ''}"`,
      `"${s.team?.team_name || ''}"`,
      `"${s.track}"`,
      `"${s.project_name.replace(/"/g, '""')}"`,
      `"${(s.synopsis || '').replace(/"/g, '""')}"`,
      `"${s.repo_url || ''}"`,
      `"${s.demo_url || ''}"`,
      `"${s.hosted_url || ''}"`,
      `"${s.status}"`,
      `"${s.submitted_at || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agentcraft_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || !isAdmin) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="font-pixel text-xs text-amber-400 animate-pulse">
          VERIFYING ADMIN PRIVILEGES...
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar isIntro={false} />
      <main className="relative z-20 min-h-screen pt-28 sm:pt-36 pb-24 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/"
            className="font-pixel text-[9px] sm:text-[10px] text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
          >
            ← BACK TO MAIN ARENA
          </Link>
          <h1 className="font-pixel text-base sm:text-2xl text-amber-300 font-bold uppercase tracking-wider mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-2">
            <span>🛡</span>
            <span>ORGANIZER COMMAND DESK</span>
          </h1>
        </div>

        <button
          type="button"
          onClick={logout}
          className="border-2 border-[#7f1d1d] bg-[#991b1b] hover:bg-[#b91c1c] text-red-100 px-3.5 py-1.5 font-pixel text-[9px] uppercase tracking-wider"
        >
          LOGOUT
        </button>
      </div>

      {/* Minecraft GUI Tabs Navigation */}
      <div className="flex border-b-2 border-[#3d2e20] mb-6 gap-1">
        <button
          type="button"
          onClick={() => {
            playMinecraftClick();
            setActiveTab('teams');
          }}
          className={`px-4 py-2.5 font-pixel text-[10px] sm:text-[11px] uppercase tracking-wider transition-all border-t-2 border-x-2 ${
            activeTab === 'teams'
              ? 'bg-[#1a140f] border-[#5a3d24] text-amber-300 -mb-[2px] font-bold'
              : 'bg-black/40 border-[#2e2116] text-neutral-400 hover:text-neutral-200'
          }`}
        >
          ⚔ TEAMS & ACCOUNTS ({teams.length})
        </button>

        <button
          type="button"
          onClick={() => {
            playMinecraftClick();
            setActiveTab('submissions');
          }}
          className={`px-4 py-2.5 font-pixel text-[10px] sm:text-[11px] uppercase tracking-wider transition-all border-t-2 border-x-2 ${
            activeTab === 'submissions'
              ? 'bg-[#1a140f] border-[#5a3d24] text-amber-300 -mb-[2px] font-bold'
              : 'bg-black/40 border-[#2e2116] text-neutral-400 hover:text-neutral-200'
          }`}
        >
          📑 SUBMISSIONS DOSSIER ({subStats.submitted}/{subStats.total})
        </button>

        <button
          type="button"
          onClick={() => {
            playMinecraftClick();
            setActiveTab('import');
          }}
          className={`px-4 py-2.5 font-pixel text-[10px] sm:text-[11px] uppercase tracking-wider transition-all border-t-2 border-x-2 ${
            activeTab === 'import'
              ? 'bg-[#1a140f] border-[#5a3d24] text-amber-300 -mb-[2px] font-bold'
              : 'bg-black/40 border-[#2e2116] text-neutral-400 hover:text-neutral-200'
          }`}
        >
          📥 CSV IMPORT (UNSTOP)
        </button>
      </div>

      {/* TAB 1: TEAMS MANAGEMENT */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 bg-[#1a140f] border-4 border-[#3d2e20] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <input
                type="text"
                placeholder="Search Team ID, Team Name, Email, College..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="px-3 py-2 bg-[#0f0c09] border border-[#3d2e20] text-neutral-200 font-sans text-xs w-full sm:w-72 outline-none focus:border-amber-400"
              />

              <select
                value={teamStatusFilter}
                onChange={(e) => setTeamStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#0f0c09] border border-[#3d2e20] text-neutral-300 font-sans text-xs outline-none"
              >
                <option value="">All Account Statuses</option>
                <option value="provisioned">Provisioned (Active Login)</option>
                <option value="unprovisioned">Pending Provisioning</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={provisioning}
                onClick={handleBulkProvision}
                className="border-2 border-[#065f46] bg-[#047857] hover:bg-[#059669] text-emerald-100 px-3.5 py-2 font-pixel text-[9px] font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {provisioning ? 'PROVISIONING...' : '⚡ BULK PROVISION ACCOUNTS'}
              </button>

              {provisionCredentials.length > 0 && (
                <button
                  type="button"
                  onClick={exportCredentialsCsv}
                  className="border-2 border-[#78350f] bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1a1206] px-3.5 py-2 font-pixel text-[9px] font-bold uppercase tracking-wider"
                >
                  ⇩ EXPORT PASSWORDS CSV
                </button>
              )}
            </div>
          </div>

          {/* Teams Table */}
          <div className="border-4 border-[#3d2e20] bg-[#1a140f] overflow-x-auto shadow-[0_16px_48px_rgba(0,0,0,0.9)]">
            <table className="w-full text-left text-xs text-neutral-300 divide-y divide-[#2e2116]">
              <thead className="bg-[#120e0a] font-pixel text-[8px] text-amber-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">TEAM ID</th>
                  <th className="px-4 py-3">TEAM & LEADER</th>
                  <th className="px-4 py-3">TRACK</th>
                  <th className="px-4 py-3">COLLEGE</th>
                  <th className="px-4 py-3">AUTH STATUS</th>
                  <th className="px-4 py-3">SUBMISSION</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2116]">
                {loadingTeams ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center font-pixel text-xs text-neutral-500">
                      QUERYING DATABASE...
                    </td>
                  </tr>
                ) : teams.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center font-sans text-xs text-neutral-500">
                      No teams match the specified filters. Try importing from Unstop CSV.
                    </td>
                  </tr>
                ) : (
                  teams.map((t) => {
                    const hasAuth = !!t.auth_user_id;
                    const sub = t.submissions?.[0];
                    return (
                      <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 font-pixel text-[10px] text-emerald-400 font-bold whitespace-nowrap">
                          {t.team_id}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-neutral-100 block">{t.team_name}</span>
                          <span className="text-[11px] text-neutral-400">
                            {t.leader_name} • {t.leader_email}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-amber-200">{t.track}</td>
                        <td className="px-4 py-3 text-[11px] text-neutral-400">{t.college || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {hasAuth ? (
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-pixel">
                              PROVISIONED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-neutral-900 text-neutral-400 border border-neutral-700 text-[10px] font-pixel">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {sub?.status === 'submitted' ? (
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-pixel">
                              SUBMITTED
                            </span>
                          ) : sub?.status === 'draft' ? (
                            <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-pixel">
                              DRAFT
                            </span>
                          ) : (
                            <span className="text-neutral-500 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleTeamActive(t.id, t.is_active)}
                            className={`font-pixel text-[8px] px-2 py-1 border ${
                              t.is_active
                                ? 'border-red-900 text-red-400 hover:bg-red-950'
                                : 'border-emerald-900 text-emerald-400 hover:bg-emerald-950'
                            }`}
                          >
                            {t.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUBMISSIONS REVIEW */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#1a140f] border-4 border-[#3d2e20]">
              <span className="font-pixel text-[8px] text-neutral-400 block uppercase">TOTAL TEAMS WITH DOSSIER</span>
              <span className="font-pixel text-xl sm:text-2xl text-amber-400 font-bold">{subStats.total}</span>
            </div>
            <div className="p-4 bg-[#1a140f] border-4 border-[#3d2e20]">
              <span className="font-pixel text-[8px] text-emerald-400 block uppercase">FINAL LOCKED SUBMISSIONS</span>
              <span className="font-pixel text-xl sm:text-2xl text-emerald-400 font-bold">{subStats.submitted}</span>
            </div>
            <div className="p-4 bg-[#1a140f] border-4 border-[#3d2e20]">
              <span className="font-pixel text-[8px] text-amber-400 block uppercase">IN-PROGRESS DRAFTS</span>
              <span className="font-pixel text-xl sm:text-2xl text-amber-300 font-bold">{subStats.draft}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={exportSubmissionsCsv}
              className="border-2 border-[#78350f] bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1a1206] px-4 py-2 font-pixel text-[9px] font-bold uppercase tracking-wider"
            >
              ⇩ EXPORT ALL SUBMISSIONS CSV
            </button>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {loadingSubs ? (
              <div className="p-8 text-center font-pixel text-xs text-neutral-500 bg-[#1a140f] border-4 border-[#3d2e20]">
                RETRIEVING SUBMISSIONS DOSSIERS...
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center font-sans text-xs text-neutral-500 bg-[#1a140f] border-4 border-[#3d2e20]">
                No submissions received yet.
              </div>
            ) : (
              submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 bg-[#1a140f] border-4 border-[#3d2e20] shadow-[0_8px_24px_rgba(0,0,0,0.8)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#2e2116]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-pixel text-[9px] text-emerald-400 font-bold">
                          {sub.team?.team_id || 'AC-TEAM'}
                        </span>
                        <span className="font-sans text-xs text-neutral-400">• {sub.team?.team_name}</span>
                        <span className="px-2 py-0.5 font-pixel text-[8px] bg-black border border-[#3b2716] text-amber-300">
                          {sub.track}
                        </span>
                      </div>
                      <h3 className="font-pixel text-xs sm:text-sm text-neutral-100 font-bold">
                        {sub.project_name}
                      </h3>
                    </div>

                    <div className="text-right">
                      {sub.status === 'submitted' ? (
                        <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-600 text-emerald-300 font-pixel text-[8px] uppercase">
                          ✓ FINALIZED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-950 border border-amber-600 text-amber-300 font-pixel text-[8px] uppercase">
                          ⏳ DRAFT
                        </span>
                      )}
                      {sub.submitted_at && (
                        <span className="block font-sans text-[10px] text-neutral-500 mt-1">
                          {new Date(sub.submitted_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Synopsis */}
                  <div className="mt-3">
                    <p className="font-sans text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                      {sub.synopsis || 'No synopsis provided.'}
                    </p>
                  </div>

                  {/* Links & Attachments */}
                  <div className="mt-4 pt-3 border-t border-[#2e2116] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {sub.repo_url && (
                        <a
                          href={sub.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-black/60 border border-[#3b2716] text-amber-400 hover:text-amber-300 font-pixel text-[8px] uppercase inline-flex items-center gap-1"
                        >
                          <span>GITHUB ↗</span>
                        </a>
                      )}
                      {sub.demo_url && (
                        <a
                          href={sub.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-black/60 border border-[#3b2716] text-red-400 hover:text-red-300 font-pixel text-[8px] uppercase inline-flex items-center gap-1"
                        >
                          <span>DEMO VIDEO ↗</span>
                        </a>
                      )}
                      {sub.hosted_url && (
                        <a
                          href={sub.hosted_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-black/60 border border-[#3b2716] text-blue-400 hover:text-blue-300 font-pixel text-[8px] uppercase inline-flex items-center gap-1"
                        >
                          <span>LIVE DEMO ↗</span>
                        </a>
                      )}
                    </div>

                    {/* Files */}
                    {sub.files && sub.files.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {sub.files.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={async () => {
                              const res = await fetch(`/api/uploads/download?fileId=${f.id}`);
                              const data = await res.json();
                              if (data.downloadUrl) window.open(data.downloadUrl, '_blank');
                            }}
                            className="px-2.5 py-1 bg-[#065f46] hover:bg-[#047857] text-emerald-100 font-pixel text-[8px] uppercase inline-flex items-center gap-1"
                          >
                            <span>⇩ {f.file_type.replace('_', ' ')}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CSV IMPORT */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#1a140f] border-4 border-[#3d2e20] shadow-[0_16px_48px_rgba(0,0,0,0.9)]">
            <h2 className="font-pixel text-sm text-amber-300 uppercase font-bold tracking-wider mb-2">
              IMPORT UNSTOP REGISTRATION CSV
            </h2>
            <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-6">
              Export the registered participants report from the Unstop organizer dashboard as a CSV file.
              The importer detects team names, leader email addresses, contact numbers, track preferences, and member rosters.
              Valid teams are assigned official sequential IDs in the <code className="text-amber-400">AC-2026-XXXX</code> format.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="p-6 border-2 border-dashed border-[#54381e] bg-black/40 text-center">
                <input
                  type="file"
                  id="csv-file-input"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer block">
                  <span className="font-pixel text-xs text-amber-400 block mb-2">
                    {selectedFile ? `SELECTED: ${selectedFile.name}` : '📁 CLICK OR DRAG TO SELECT UNSTOP CSV FILE'}
                  </span>
                  <span className="font-sans text-[11px] text-neutral-500">
                    Supports comma-delimited CSV with Team Name, Leader Name, Leader Email, Track, and Member columns
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!selectedFile || importing}
                className="w-full py-3 bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-[#78350f] font-pixel text-xs text-[#1a1206] font-bold uppercase tracking-wider shadow-[0_4px_0_#451a03] disabled:opacity-50"
              >
                {importing ? 'PARSING & IMPORTING TEAMS...' : '⚡ IMPORT & GENERATE TEAM IDS'}
              </button>
            </form>
          </div>

          {/* Import Results Box */}
          {importResult && (
            <div className="p-6 bg-[#1a140f] border-4 border-[#3d2e20]">
              <h3 className="font-pixel text-xs text-amber-300 font-bold uppercase mb-4">
                IMPORT EXECUTION SUMMARY
              </h3>

              <div className="grid grid-cols-4 gap-3 text-center mb-6">
                <div className="p-3 bg-black/60 border border-[#3b2716]">
                  <span className="font-pixel text-base text-neutral-200 block">{importResult.summary?.totalRows}</span>
                  <span className="font-pixel text-[7px] text-neutral-500 uppercase">TOTAL ROWS</span>
                </div>
                <div className="p-3 bg-black/60 border border-[#3b2716]">
                  <span className="font-pixel text-base text-emerald-400 block">{importResult.summary?.imported}</span>
                  <span className="font-pixel text-[7px] text-neutral-500 uppercase">IMPORTED TEAMS</span>
                </div>
                <div className="p-3 bg-black/60 border border-[#3b2716]">
                  <span className="font-pixel text-base text-amber-400 block">{importResult.summary?.duplicateCount}</span>
                  <span className="font-pixel text-[7px] text-neutral-500 uppercase">DUPLICATES SKIPPED</span>
                </div>
                <div className="p-3 bg-black/60 border border-[#3b2716]">
                  <span className="font-pixel text-base text-red-400 block">{importResult.summary?.errorCount}</span>
                  <span className="font-pixel text-[7px] text-neutral-500 uppercase">ERRORS</span>
                </div>
              </div>

              {/* Newly Created Teams List */}
              {importResult.createdTeams && importResult.createdTeams.length > 0 && (
                <div>
                  <h4 className="font-pixel text-[9px] text-emerald-400 uppercase tracking-widest mb-2">
                    SUCCESSFULLY CREATED TEAMS:
                  </h4>
                  <div className="max-h-60 overflow-y-auto border border-[#3b2716] divide-y divide-[#2e2116] bg-black/40 p-2 font-mono text-xs">
                    {importResult.createdTeams.map((ct) => (
                      <div key={ct.team_id} className="p-1.5 flex justify-between">
                        <span className="text-emerald-400 font-bold">{ct.team_id}</span>
                        <span className="text-neutral-300">{ct.team_name}</span>
                        <span className="text-neutral-500">{ct.leader_email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
    </>
  );
}
