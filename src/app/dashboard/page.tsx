// ============================================================================
// AGENTCRAFT — Team Participant Portal & Project Submission Dashboard
// /dashboard
// ============================================================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { playMinecraftClick, playMinecraftPop } from '@/components/ui/MinecraftAudioManager';

interface SubmissionData {
  id?: string;
  project_name?: string;
  track?: string;
  synopsis?: string;
  repo_url?: string;
  demo_url?: string;
  hosted_url?: string;
  status: 'draft' | 'submitted';
  submitted_at?: string;
  files?: Array<{
    id: string;
    file_name: string;
    file_type: string;
    file_path: string;
    file_size_bytes: number;
    mime_type: string;
  }>;
}

const TRACK_OPTIONS = [
  'SDG 3: Good Health & Well-Being',
  'SDG 4: Quality Education',
  'SDG 7: Affordable & Clean Energy',
  'SDG 9: Industry, Innovation & Infrastructure',
  'SDG 11: Sustainable Cities & Communities',
  'SDG 13: Climate Action',
  'Open Agentic AI Innovation',
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, team, isAdmin, isLoading: authLoading, logout } = useAuth();

  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [deadlineStr, setDeadlineStr] = useState<string>('2026-10-31T23:59:59+05:30');
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  // Form fields
  const [projectName, setProjectName] = useState('');
  const [track, setTrack] = useState(TRACK_OPTIONS[0]);
  const [synopsis, setSynopsis] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [hostedUrl, setHostedUrl] = useState('');

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      id?: string;
      file_name: string;
      file_type: string;
      file_path: string;
      file_size_bytes: number;
      mime_type: string;
    }>
  >([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Submission saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<string | null>(null);

  const [teamInfo, setTeamInfo] = useState<any>(team);

  // Sync teamInfo with auth team
  useEffect(() => {
    if (team) setTeamInfo(team);
  }, [team]);

  // Redirect admins to /admin
  useEffect(() => {
    if (!authLoading && isAdmin) {
      router.push('/admin');
    }
  }, [authLoading, isAdmin, router]);

  // Load submission data
  const loadSubmission = useCallback(async () => {
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const data = await res.json();
        if (data.deadline) setDeadlineStr(data.deadline);
        if (data.isExpired) setIsExpired(true);
        if (data.team) setTeamInfo(data.team);

        if (data.submission) {
          const sub = data.submission;
          setSubmission(sub);
          setProjectName(sub.project_name || '');
          if (sub.track) setTrack(sub.track);
          setSynopsis(sub.synopsis || '');
          setRepoUrl(sub.repo_url || '');
          setDemoUrl(sub.demo_url || '');
          setHostedUrl(sub.hosted_url || '');
          if (sub.files) {
            setUploadedFiles(sub.files);
          }
        } else if (data.team?.track || team?.track) {
          setTrack(data.team?.track || team?.track);
        }
      }
    } catch (err) {
      console.error('Failed to load submission data:', err);
    }
  }, [team]);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  // Countdown timer calculation
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(deadlineStr).getTime();
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [deadlineStr]);

  // File Upload Handler via Cloudflare R2 Presigned URL
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'pitch_deck' | 'report') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (submission?.status === 'submitted') {
      alert('Your submission is finalized and cannot be modified.');
      return;
    }

    if (isExpired) {
      alert('The submission deadline has passed.');
      return;
    }

    setErrorMessage(null);
    setSaveMessage(null);
    setUploading(true);
    setUploadProgress(10);
    playMinecraftClick();

    try {
      // 1. Get presigned upload URL
      const presignRes = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || 'application/pdf',
          fileSize: file.size,
          fileType,
          submissionId: submission?.id,
        }),
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok) {
        throw new Error(presignData.error || 'Failed to initialize upload.');
      }

      setUploadProgress(40);

      // 2. Direct upload to R2 (or mock in development)
      if (!presignData.isMock) {
        const uploadRes = await fetch(presignData.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type || 'application/pdf',
          },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file to storage.');
        }
      }

      setUploadProgress(100);
      playMinecraftPop(1.4);

      // 3. Add to uploaded files list
      const newFileObj = {
        file_name: file.name,
        file_type: fileType,
        file_path: presignData.objectKey,
        file_size_bytes: file.size,
        mime_type: file.type || 'application/pdf',
      };

      setUploadedFiles((prev) => [...prev, newFileObj]);
      setSaveMessage(`Uploaded ${file.name} successfully! Remember to save your draft.`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'File upload failed.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  // Download uploaded file handler
  const handleDownloadFile = async (fileId?: string, filePath?: string, fileName?: string) => {
    if (!fileId) {
      alert('This file will be available for download once you save your draft.');
      return;
    }

    try {
      const res = await fetch(`/api/uploads/download?fileId=${fileId}`);
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to generate download URL');
        return;
      }
      window.open(data.downloadUrl, '_blank');
    } catch {
      alert('Download error occurred.');
    }
  };

  // Save Draft or Final Submit
  const handleSave = async (isFinal: boolean) => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveMessage(null);
    playMinecraftClick();

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: projectName,
          track,
          synopsis,
          repo_url: repoUrl,
          demo_url: demoUrl,
          hosted_url: hostedUrl,
          files: uploadedFiles,
          is_final: isFinal,
        }),
      });

      const data = await res.json();
      setIsSaving(false);

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to save submission.');
      } else {
        playMinecraftPop(1.6);
        setSaveMessage(data.message || (isFinal ? 'Submission locked and finalized!' : 'Draft saved.'));
        setShowConfirmModal(false);
        await loadSubmission();
      }
    } catch (err: unknown) {
      setIsSaving(false);
      setErrorMessage(err instanceof Error ? err.message : 'Network error while saving.');
    }
  };

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordChangeStatus('Password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordChangeStatus(data.error || 'Failed to update password.');
      } else {
        setPasswordChangeStatus('✓ Password updated successfully!');
        playMinecraftPop(1.5);
        setTimeout(() => setShowPasswordModal(false), 1200);
      }
    } catch {
      setPasswordChangeStatus('Failed to update password.');
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="font-pixel text-xs text-amber-400 animate-pulse">
          INITIALIZING ARENA PORTAL...
        </div>
      </main>
    );
  }

  const isSubmitted = submission?.status === 'submitted';
  const isReadOnly = isSubmitted || isExpired;

  return (
    <>
      <Navbar isIntro={false} />
      <main className="relative z-20 min-h-screen pt-28 sm:pt-36 pb-24 px-3 sm:px-6 max-w-6xl mx-auto">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/"
            className="font-pixel text-[9px] sm:text-[10px] text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
          >
            ← BACK TO MAIN ARENA
          </Link>
          <h1 className="font-pixel text-base sm:text-2xl text-amber-300 font-bold uppercase tracking-wider mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            TEAM COMMAND CENTER
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playMinecraftClick();
              setShowPasswordModal(true);
            }}
            className="border-2 border-[#54381e] bg-[#2b1f16] hover:bg-[#3d2e20] text-amber-200 px-3 py-1.5 font-pixel text-[9px] uppercase tracking-wider"
          >
            🔒 CHANGE PASSWORD
          </button>
          <button
            type="button"
            onClick={logout}
            className="border-2 border-[#7f1d1d] bg-[#991b1b] hover:bg-[#b91c1c] text-red-100 px-3 py-1.5 font-pixel text-[9px] uppercase tracking-wider"
          >
            EXIT
          </button>
        </div>
      </div>

      {/* Grid: Left Column (Team Info & Countdown) / Right Column (Submission Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Team Identity & Submission Status */}
        <div className="space-y-6">
          {/* Team Identity Card */}
          <div className="p-5 bg-[#1a140f] border-4 border-[#3d2e20] shadow-[inset_2px_2px_0_#5a3d24,inset_-2px_-2px_0_#0d0a08,0_12px_32px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3 pb-3 border-b border-[#3b2716]">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/assets/items/diamond.png"
                  alt="Diamond"
                  fill
                  className="object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div>
                <span className="font-pixel text-[9px] text-emerald-400 font-bold block">
                  {(teamInfo || team)?.team_id || 'AC-2026-0001'}
                </span>
                <h2 className="font-pixel text-xs sm:text-sm text-neutral-100 font-bold">
                  {(teamInfo || team)?.team_name || 'AgentCraft Team'}
                </h2>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 font-sans text-xs">
              <div>
                <span className="font-pixel text-[8px] text-amber-400 block uppercase">LEADER:</span>
                <span className="text-neutral-200 font-medium">
                  {(teamInfo || team)?.leader_name || 'Team Leader'} ({(teamInfo || team)?.leader_email || 'leader@agentcraft.ai'})
                </span>
              </div>

              {((teamInfo || team)?.college) && (
                <div>
                  <span className="font-pixel text-[8px] text-amber-400 block uppercase">COLLEGE / INSTITUTE:</span>
                  <span className="text-neutral-300">{(teamInfo || team).college}</span>
                </div>
              )}

              <div>
                <span className="font-pixel text-[8px] text-amber-400 block uppercase">TRACK:</span>
                <span className="text-amber-200 font-semibold">{(teamInfo || team)?.track || track}</span>
              </div>

              {(teamInfo || team)?.members && (teamInfo || team).members.length > 0 && (
                <div className="pt-2 border-t border-[#2e2116]">
                  <span className="font-pixel text-[8px] text-amber-400 block uppercase mb-1">
                    TEAM ROSTER ({(teamInfo || team).members.length}):
                  </span>
                  <ul className="space-y-1">
                    {(teamInfo || team).members.map((m: any, idx: number) => (
                      <li key={m.id || idx} className="text-neutral-300 text-[11px] flex items-center justify-between">
                        <span>• {m.name}</span>
                        <span className="text-neutral-500 font-pixel text-[7px] uppercase">{m.role || 'Member'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Submission Status & Deadline Timer Card */}
          <div className="p-5 bg-[#1a140f] border-4 border-[#3d2e20] shadow-[inset_2px_2px_0_#5a3d24,inset_-2px_-2px_0_#0d0a08,0_12px_32px_rgba(0,0,0,0.8)]">
            <h3 className="font-pixel text-[11px] text-amber-300 uppercase font-bold tracking-wider mb-3">
              ROUND 1 DEADLINE
            </h3>

            {/* Status Badge */}
            <div className="mb-4">
              {isSubmitted ? (
                <div className="p-2.5 bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 font-pixel text-[9px] uppercase tracking-wider text-center">
                  ✓ FINAL SUBMISSION LOCKED
                </div>
              ) : isExpired ? (
                <div className="p-2.5 bg-red-950/80 border-2 border-red-600 text-red-200 font-pixel text-[9px] uppercase tracking-wider text-center">
                  ✕ DEADLINE HAS PASSED
                </div>
              ) : (
                <div className="p-2.5 bg-amber-950/80 border-2 border-amber-500 text-amber-200 font-pixel text-[9px] uppercase tracking-wider text-center">
                  ⏳ SUBMISSION IN DRAFT
                </div>
              )}
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-black/60 border border-[#3b2716]">
                <span className="font-pixel text-base sm:text-lg text-amber-400 font-bold block">{timeLeft.days}</span>
                <span className="font-pixel text-[7px] text-neutral-400 uppercase">DAYS</span>
              </div>
              <div className="p-2 bg-black/60 border border-[#3b2716]">
                <span className="font-pixel text-base sm:text-lg text-amber-400 font-bold block">{timeLeft.hours}</span>
                <span className="font-pixel text-[7px] text-neutral-400 uppercase">HRS</span>
              </div>
              <div className="p-2 bg-black/60 border border-[#3b2716]">
                <span className="font-pixel text-base sm:text-lg text-amber-400 font-bold block">{timeLeft.minutes}</span>
                <span className="font-pixel text-[7px] text-neutral-400 uppercase">MIN</span>
              </div>
              <div className="p-2 bg-black/60 border border-[#3b2716]">
                <span className="font-pixel text-base sm:text-lg text-amber-400 font-bold block">{timeLeft.seconds}</span>
                <span className="font-pixel text-[7px] text-neutral-400 uppercase">SEC</span>
              </div>
            </div>

            {submission?.submitted_at && (
              <p className="mt-4 text-center font-pixel text-[8px] text-neutral-400">
                FINALIZED ON:{' '}
                <span className="text-emerald-400">
                  {new Date(submission.submitted_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Project Submission Form */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 bg-[#1a140f] border-4 border-[#3d2e20] shadow-[inset_2px_2px_0_#5a3d24,inset_-2px_-2px_0_#0d0a08,0_16px_48px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#3b2716]">
              <div>
                <h2 className="font-pixel text-sm sm:text-base text-amber-300 font-bold uppercase tracking-wider">
                  PROJECT SUBMISSION DOSSIER
                </h2>
                <p className="font-sans text-xs text-neutral-400 mt-1">
                  {isSubmitted
                    ? 'Your submission is locked for evaluation by the jury panel.'
                    : 'Fill in your project architecture, code repository, video demonstration, and slide deck.'}
                </p>
              </div>
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src="/assets/items/book_quill.png"
                  alt="Book and Quill"
                  fill
                  className="object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>

            {/* Notification Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3.5 bg-red-950/80 border-2 border-red-600 text-red-200 font-sans text-xs flex items-center gap-2">
                <span>⚠</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {saveMessage && (
              <div className="mb-4 p-3.5 bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 font-sans text-xs flex items-center gap-2">
                <span>✓</span>
                <span>{saveMessage}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowConfirmModal(true);
              }}
              className="space-y-5"
            >
              {/* Project Title */}
              <div>
                <label className="block font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-1.5">
                  PROJECT TITLE *
                </label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. EcoAgent — Autonomous Precision Agriculture Drone Fleet"
                  className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 placeholder-neutral-600 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner disabled:opacity-70"
                />
              </div>

              {/* Problem Statement Track */}
              <div>
                <label className="block font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-1.5">
                  PROBLEM TRACK *
                </label>
                <select
                  disabled={isReadOnly}
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner disabled:opacity-70"
                >
                  {TRACK_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#1a140f] text-neutral-200">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Abstract / Synopsis */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest">
                    PROJECT SYNOPSIS & ARCHITECTURE *
                  </label>
                  <span className="font-pixel text-[8px] text-neutral-500">
                    {synopsis.length} / 50 min chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  disabled={isReadOnly}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Explain your Agentic AI design, autonomous tool use, reasoning loops, models used, and the SDG impact achieved..."
                  className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 placeholder-neutral-600 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner disabled:opacity-70 leading-relaxed"
                />
              </div>

              {/* GitHub / GitLab Repository URL */}
              <div>
                <label className="block font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-1.5">
                  CODE REPOSITORY URL (GITHUB / GITLAB) *
                </label>
                <input
                  type="url"
                  required
                  disabled={isReadOnly}
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/your-team/agentcraft-project"
                  className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 placeholder-neutral-600 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner disabled:opacity-70"
                />
              </div>

              {/* Video Demo Link */}
              <div>
                <label className="block font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-1.5">
                  DEMO VIDEO URL (YOUTUBE / LOOM / DRIVE) *
                </label>
                <input
                  type="url"
                  required
                  disabled={isReadOnly}
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://youtu.be/... or https://www.loom.com/share/..."
                  className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 placeholder-neutral-600 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner disabled:opacity-70"
                />
              </div>

              {/* Live Deployment (Optional) */}
              <div>
                <label className="block font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-1.5">
                  LIVE DEPLOYMENT URL (OPTIONAL)
                </label>
                <input
                  type="url"
                  disabled={isReadOnly}
                  value={hostedUrl}
                  onChange={(e) => setHostedUrl(e.target.value)}
                  placeholder="https://your-agent-app.vercel.app"
                  className="w-full px-3.5 py-2.5 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 placeholder-neutral-600 font-sans text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner disabled:opacity-70"
                />
              </div>

              {/* Cloudflare R2 File Uploads */}
              <div className="pt-2 border-t border-[#3b2716]">
                <label className="block font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-2">
                  ATTACHMENTS: PITCH DECK & ARCHITECTURE REPORT (PDF, PPTX)
                </label>

                {!isReadOnly && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    <label className="cursor-pointer border-2 border-[#065f46] bg-[#047857] hover:bg-[#059669] text-emerald-100 px-3.5 py-2 font-pixel text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                      <span>📄 UPLOAD PITCH DECK (PDF / PPTX)</span>
                      <input
                        type="file"
                        accept=".pdf,.ppt,.pptx"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'pitch_deck')}
                        disabled={uploading}
                      />
                    </label>

                    <label className="cursor-pointer border-2 border-[#54381e] bg-[#2b1f16] hover:bg-[#3d2e20] text-amber-200 px-3.5 py-2 font-pixel text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                      <span>📑 UPLOAD REPORT / DOCS</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'report')}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                )}

                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="mb-3 p-3 bg-black/60 border border-emerald-600">
                    <div className="flex justify-between font-pixel text-[8px] text-emerald-400 mb-1">
                      <span>TRANSMITTING FILE TO R2 VAULT...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#1a140f] border border-[#3b2716]">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Uploaded Files Table */}
                {uploadedFiles.length > 0 ? (
                  <div className="border border-[#3b2716] bg-black/40 divide-y divide-[#2e2116]">
                    {uploadedFiles.map((f, i) => (
                      <div key={f.id || i} className="p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="font-pixel text-[8px] text-amber-400 uppercase shrink-0">
                            [{f.file_type.replace('_', ' ')}]
                          </span>
                          <span className="text-neutral-200 truncate">{f.file_name}</span>
                          <span className="text-neutral-500 text-[10px] shrink-0">
                            ({Math.round((f.file_size_bytes || 0) / 1024)} KB)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(f.id, f.file_path, f.file_name)}
                            className="font-pixel text-[8px] text-emerald-400 hover:underline px-2 py-1"
                          >
                            DOWNLOAD ⇩
                          </button>
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i));
                              }}
                              className="font-pixel text-[8px] text-red-400 hover:underline px-1 py-1"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-xs text-neutral-500 italic">No files uploaded yet.</p>
                )}
              </div>

              {/* Form Action Buttons */}
              {!isReadOnly ? (
                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSave(false)}
                    className="flex-1 py-3 bg-[#2b1f16] hover:bg-[#3d2e20] border-2 border-[#54381e] font-pixel text-xs text-amber-300 font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_rgba(255,255,255,0.1),inset_-2px_-2px_0_rgba(0,0,0,0.4)] disabled:opacity-50"
                  >
                    {isSaving ? 'SAVING...' : '💾 SAVE DRAFT'}
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-[#78350f] font-pixel text-xs text-[#1a1206] font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4),0_4px_0_#451a03] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-50"
                  >
                    🚀 FINAL SUBMISSION
                  </button>
                </div>
              ) : (
                <div className="pt-4 p-4 bg-black/60 border border-[#3b2716] text-center">
                  <p className="font-pixel text-xs text-emerald-400 font-bold uppercase">
                    DOSSIER LOCKED & RECORDED
                  </p>
                  <p className="font-sans text-xs text-neutral-400 mt-1">
                    Your project is in the screening queue. Announcements will follow on the schedule.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Final Submission */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 bg-[#1a140f] border-4 border-amber-600 shadow-[0_24px_64px_rgba(0,0,0,0.95)]">
            <h3 className="font-pixel text-sm text-amber-300 font-bold uppercase mb-2">
              LOCK FINAL SUBMISSION?
            </h3>
            <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-4">
              Are you sure you want to finalize? Once locked,{' '}
              <strong className="text-amber-400">no further edits or file uploads will be permitted</strong>. Ensure all
              repo links, demo videos, and slide decks are accurate.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-[#2b1f16] border-2 border-[#54381e] text-neutral-300 font-pixel text-xs uppercase"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSave(true)}
                className="flex-1 py-2.5 bg-[#059669] hover:bg-[#047857] border-2 border-[#064e3b] text-emerald-100 font-pixel text-xs uppercase font-bold"
              >
                {isSaving ? 'LOCKING...' : 'YES, LOCK & SUBMIT'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 bg-[#1a140f] border-4 border-[#3d2e20] shadow-[0_24px_64px_rgba(0,0,0,0.95)]">
            <h3 className="font-pixel text-xs sm:text-sm text-amber-300 font-bold uppercase mb-2">
              UPDATE ACCESS PASSWORD
            </h3>
            {passwordChangeStatus && (
              <p className="text-xs text-amber-200 font-sans mb-3">{passwordChangeStatus}</p>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block font-pixel text-[8px] text-amber-400 uppercase mb-1">
                  NEW PASSWORD (MIN 8 CHARACTERS)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#0f0c09] border-2 border-[#3d2e20] text-neutral-100 font-sans text-xs outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 bg-[#2b1f16] border border-[#54381e] text-neutral-300 font-pixel text-[9px] uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#fbbf24] border border-[#78350f] text-[#1a1206] font-pixel text-[9px] uppercase font-bold"
                >
                  SAVE PASSWORD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
    </>
  );
}
