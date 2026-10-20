'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { playMinecraftClick, playMinecraftPop, playMinecraftBlockBreak } from '@/components/ui/MinecraftAudioManager';
import {
  INITIAL_SUBMISSION_DATA,
  INITIAL_TEAM_DATA,
  OFFICIAL_RESOURCES,
  SubmissionData,
} from '@/data/dashboardMock';
import { saveSubmissionToSupabase, getSubmissionData, isSupabaseConfigured } from '@/lib/supabase';

const SDG_CATEGORIES = [
  'SDG 11: Sustainable Cities & Communities',
  'SDG 7: Affordable & Clean Energy',
  'SDG 13: Climate Action',
  'SDG 12: Responsible Consumption & Production',
  'SDG 9: Industry, Innovation & Infrastructure',
  'SDG 3: Good Health & Well-Being',
  'Open Innovation / Cross-SDG Synthesis',
];

export default function SubmissionsPage() {
  const [formData, setFormData] = useState<SubmissionData>(INITIAL_SUBMISSION_DATA);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved draft from localStorage or Supabase
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agentcraft_team_submission');
      if (saved) {
        setFormData(JSON.parse(saved));
      } else {
        getSubmissionData().then((data) => {
          if (data && (data.projectTitle || data.githubUrl)) {
            setFormData(data);
          }
        }).catch(() => {});
      }
    } catch {
      getSubmissionData().then((data) => {
        if (data && (data.projectTitle || data.githubUrl)) {
          setFormData(data);
        }
      }).catch(() => {});
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateInputs = (): string[] => {
    const errors: string[] = [];

    if (!formData.projectTitle.trim()) errors.push('Project Title is required.');
    if (!formData.problemStatement.trim()) errors.push('Problem Statement is required.');
    if (!formData.abstract.trim()) errors.push('Project Abstract is required.');

    const urlPattern = /^https?:\/\/.+/i;

    if (!formData.githubUrl.trim() || !urlPattern.test(formData.githubUrl)) {
      errors.push('Valid GitHub Repository URL (https://...) is mandatory.');
    }
    if (!formData.pptUrl.trim() || !urlPattern.test(formData.pptUrl)) {
      errors.push('Valid PPT Presentation URL (https://...) is mandatory.');
    }
    if (!formData.docUrl.trim() || !urlPattern.test(formData.docUrl)) {
      errors.push('Valid Project Documentation URL (https://...) is mandatory.');
    }
    if (!formData.demoVideoUrl.trim() || !urlPattern.test(formData.demoVideoUrl)) {
      errors.push('Valid Demo Video URL (https://...) is mandatory.');
    }

    if (!formData.declarationConfirmed) {
      errors.push('You must confirm the Working Project Declaration checkbox.');
    }

    return errors;
  };

  const handleSaveDraft = async () => {
    playMinecraftClick();
    const updated = {
      ...formData,
      lastUpdated: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString(),
    };
    setFormData(updated);
    try {
      localStorage.setItem('agentcraft_team_submission', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured) {
      await saveSubmissionToSupabase(INITIAL_TEAM_DATA.teamId, updated);
      setSaveToast('✓ Draft saved to local cache & Supabase!');
    } else {
      setSaveToast('✓ Draft saved to local cache!');
    }
    playMinecraftPop(1.2);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleValidateOnly = () => {
    playMinecraftClick();
    const errors = validateInputs();
    setValidationErrors(errors);
    if (errors.length === 0) {
      setSaveToast('✓ All required fields & URLs passed syntax validation!');
      playMinecraftPop(1.4);
      setTimeout(() => setSaveToast(null), 3500);
    } else {
      setSaveToast(null);
    }
  };

  const handleOpenReview = () => {
    playMinecraftClick();
    const errors = validateInputs();
    setValidationErrors(errors);
    if (errors.length === 0) {
      setShowReviewModal(true);
    } else {
      // Scroll to errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    playMinecraftClick();

    const receipt = `AGENTCRAFT-SUB-${Math.floor(10000 + Math.random() * 90000)}-R1`;
    const updated: SubmissionData = {
      ...formData,
      status: 'submitted',
      receiptId: receipt,
      version: formData.version + 1,
      lastUpdated: new Date().toLocaleString(),
    };
    setFormData(updated);
    try {
      localStorage.setItem('agentcraft_team_submission', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured) {
      await saveSubmissionToSupabase(INITIAL_TEAM_DATA.teamId, updated);
    }

    setIsSubmitting(false);
    setShowReviewModal(false);
    playMinecraftBlockBreak();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Submission Receipt */}
      <div className="p-6 border-3 border-[#4a2e16] bg-[#1a0f07] shadow-[inset_2px_2px_0_#754822,0_16px_36px_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-wider font-bold">
              ROUND 1 ONLINE SCREENING
            </span>
            <span
              className={`font-pixel text-[8px] px-2 py-0.5 border font-bold uppercase ${
                formData.status === 'submitted'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-amber-950 text-amber-300 border-amber-500'
              }`}
            >
              STATUS: {formData.status.toUpperCase()}
            </span>
          </div>
          <h1 className="font-pixel text-xl sm:text-2xl text-white uppercase font-bold tracking-wide">
            LINK-BASED PROJECT SUBMISSION SYSTEM
          </h1>
          <p className="text-xs text-neutral-300 font-sans mt-0.5 max-w-2xl leading-relaxed">
            All primary deliverables must be submitted as valid, publicly shareable URLs. No direct file uploads are accepted on the portal.
          </p>
        </div>

        {formData.receiptId && (
          <div className="p-3 border border-emerald-500/70 bg-[#0c1f14] text-right shrink-0">
            <span className="font-pixel text-[8px] text-emerald-400 uppercase block font-bold">
              SUBMISSION RECEIPT ID
            </span>
            <span className="font-mono text-xs sm:text-sm text-emerald-200 font-bold block mt-0.5">
              {formData.receiptId}
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">
              Version {formData.version} • {formData.lastUpdated}
            </span>
          </div>
        )}
      </div>

      {/* Official PPT Template Callout Card */}
      <div className="p-4 border-2 border-amber-600/80 bg-[#241305] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs text-amber-300 uppercase font-bold">
                MANDATORY PRESENTATION TEMPLATE
              </span>
              <span className="font-pixel text-[8px] px-1.5 py-0.5 bg-amber-400 text-black font-bold uppercase">
                REQUIRED
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-sans mt-0.5">
              Download the official AGENTCRAFT 16:9 Google Slides / PPT template before submitting your slides.
            </p>
          </div>
        </div>

        <a
          href={OFFICIAL_RESOURCES[0].url}
          target="_blank"
          rel="noreferrer"
          onClick={() => playMinecraftClick()}
          className="shrink-0 px-4 py-2 border-2 border-[#7a4f05] bg-[#fbbf24] hover:bg-[#f59e0b] font-pixel text-[10px] text-black font-bold uppercase tracking-wider shadow-[inset_1px_1px_0_#fff,0_3px_0_#382403] text-center"
        >
          GET PPT TEMPLATE ↗
        </a>
      </div>

      {/* Validation Feedback Banner */}
      {validationErrors.length > 0 && (
        <div className="p-4 border-2 border-red-600 bg-red-950/90 text-red-100 text-xs space-y-1">
          <div className="font-pixel text-xs text-red-300 uppercase font-bold flex items-center gap-2">
            <span>⚠</span>
            <span>PLEASE RESOLVE THE FOLLOWING ISSUES:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-2 font-sans">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {saveToast && (
        <div className="p-3 border-2 border-emerald-500 bg-emerald-950/90 text-emerald-200 font-pixel text-xs flex items-center gap-2">
          <span>✓</span>
          <span>{saveToast}</span>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Section 1: Project Metadata */}
        <div className="p-5 border-2 border-[#3d240e] bg-[#140b04] space-y-4">
          <h2 className="font-pixel text-sm text-amber-400 uppercase font-bold tracking-wider pb-2 border-b border-[#2d1b0d]">
            1. PROJECT METADATA
          </h2>

          <div>
            <label className="block font-pixel text-[9px] text-amber-300 uppercase tracking-widest mb-1">
              PROJECT TITLE *
            </label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              placeholder="e.g. CityPulse: Autonomous Agentic Traffic Optimizer"
              className="w-full px-3.5 py-2.5 bg-[#0a0603] border-2 border-[#3a220e] text-neutral-100 placeholder-neutral-600 font-sans text-sm focus:border-amber-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-[9px] text-amber-300 uppercase tracking-widest mb-1">
                ASSIGNED TRACK (LOCKED)
              </label>
              <input
                type="text"
                disabled
                value={INITIAL_TEAM_DATA.track}
                className="w-full px-3.5 py-2 bg-[#120a04] border border-[#2b1709] text-neutral-400 font-sans text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-pixel text-[9px] text-amber-300 uppercase tracking-widest mb-1">
                PRIMARY SDG CATEGORY *
              </label>
              <select
                name="sdgCategory"
                value={formData.sdgCategory}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-[#0a0603] border-2 border-[#3a220e] text-neutral-100 font-sans text-xs focus:border-amber-400 outline-none"
              >
                {SDG_CATEGORIES.map((sdg) => (
                  <option key={sdg} value={sdg} className="bg-[#120a04]">
                    {sdg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-pixel text-[9px] text-amber-300 uppercase tracking-widest mb-1">
              PROBLEM STATEMENT *
            </label>
            <textarea
              rows={3}
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              placeholder="Describe the real-world challenge and target SDG domain..."
              className="w-full px-3.5 py-2 bg-[#0a0603] border-2 border-[#3a220e] text-neutral-100 placeholder-neutral-600 font-sans text-sm focus:border-amber-400 outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-pixel text-[9px] text-amber-300 uppercase tracking-widest mb-1">
              PROJECT ABSTRACT & AGENT ARCHITECTURE *
            </label>
            <textarea
              rows={4}
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              placeholder="Outline your multi-agent architecture, decision loops, tool integrations, and outcomes..."
              className="w-full px-3.5 py-2 bg-[#0a0603] border-2 border-[#3a220e] text-neutral-100 placeholder-neutral-600 font-sans text-sm focus:border-amber-400 outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Mandatory Deliverable URLs */}
        <div className="p-5 border-2 border-[#3d240e] bg-[#140b04] space-y-4">
          <div className="pb-2 border-b border-[#2d1b0d] flex items-center justify-between">
            <h2 className="font-pixel text-sm text-amber-400 uppercase font-bold tracking-wider">
              2. MANDATORY RESOURCE DELIVERABLE LINKS
            </h2>
            <span className="font-pixel text-[8px] text-neutral-400 uppercase">
              All 4 URLs Required
            </span>
          </div>

          {/* GitHub Repo */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-pixel text-[9px] text-amber-300 uppercase tracking-widest">
                GITHUB REPOSITORY URL *
              </label>
              {formData.githubUrl && (
                <a
                  href={formData.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-pixel text-[8px] text-sky-400 hover:underline"
                >
                  Test Link ↗
                </a>
              )}
            </div>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/organization/project-name"
              className="w-full px-3.5 py-2 bg-[#0a0603] border-2 border-[#3a220e] text-neutral-100 font-mono text-xs focus:border-amber-400 outline-none"
            />
            <p className="text-[10px] text-neutral-400 font-sans">
              Must include full agentic code, `README.md` setup instructions, and architecture diagrams.
            </p>
          </div>

          {/* PPT Presentation */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-pixel text-[9px] text-amber-300 uppercase tracking-widest">
                PPT / SLIDES PRESENTATION URL *
              </label>
              {formData.pptUrl && (
                <a
                  href={formData.pptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-pixel text-[8px] text-sky-400 hover:underline"
                >
                  Test Link ↗
                </a>
              )}
            </div>
            <input
              type="url"
              name="pptUrl"
              value={formData.pptUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
              className="w-full px-3.5 py-2 bg-[#0a0603] border-2 border-[#3a220e] text-neutral-100 font-mono text-xs focus:border-amber-400 outline-none"
            />
            <p className="text-[10px] text-amber-300/80 font-sans">
              ⚠ Permission Notice: Set sharing permissions to &quot;Anyone with the link can view&quot; so evaluators can inspect.
            </p>
          </div>

          {/* Project Documentation */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-pixel text-[9px] text-amber-300 uppercase tracking-widest">
                PROJECT DOCUMENTATION / REPORT URL *
              </label>
              {formData.docUrl && (
                <a
                  href={formData.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-pixel text-[8px] text-sky-400 hover:underline"
                >
                  Test Link ↗
                </a>
              )}
            </div>
            <input
              type="url"
              name="docUrl"
              value={formData.docUrl}
              onChange={handleChange}
              placeholder="https://docs.google.com/document/d/.../view?usp=sharing"
              className="w-full px-3.5 py-2 bg-[#0a0603] border-2 border-[#3a220e] text-neutral-100 font-mono text-xs focus:border-amber-400 outline-none"
            />
            <p className="text-[10px] text-neutral-400 font-sans">
              Google Doc / Notion / PDF link outlining agent heuristics, prompt flows, and evaluation benchmarks.
            </p>
          </div>

          {/* Demo Video URL */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-pixel text-[9px] text-amber-300 uppercase tracking-widest">
                DEMO VIDEO URL (MIN 5-6 MINUTES) *
              </label>
              {formData.demoVideoUrl && (
                <a
                  href={formData.demoVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-pixel text-[8px] text-sky-400 hover:underline"
                >
                  Test Link ↗
                </a>
              )}
            </div>
            <input
              type="url"
              name="demoVideoUrl"
              value={formData.demoVideoUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=... or Loom / Drive"
              className="w-full px-3.5 py-2 bg-[#0a0603] border-2 border-[#3a220e] text-neutral-100 font-mono text-xs focus:border-amber-400 outline-none"
            />
            <p className="text-[10px] text-neutral-400 font-sans">
              Unlisted YouTube / Loom video (minimum 5-6 minutes) demonstrating agents in action and autonomous tool execution.
            </p>
          </div>
        </div>

        {/* Section 3: Optional Extended Deliverables */}
        <div className="p-5 border-2 border-[#3d240e] bg-[#140b04] space-y-4">
          <h2 className="font-pixel text-sm text-amber-400 uppercase font-bold tracking-wider pb-2 border-b border-[#2d1b0d]">
            3. OPTIONAL PROTOTYPE & ADDITIONAL ASSETS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-[9px] text-neutral-400 uppercase tracking-widest mb-1">
                LIVE DEPLOYED DEMO / WEB APP (OPTIONAL)
              </label>
              <input
                type="url"
                name="liveDemoUrl"
                value={formData.liveDemoUrl}
                onChange={handleChange}
                placeholder="https://your-project.vercel.app"
                className="w-full px-3.5 py-2 bg-[#0a0603] border border-[#3a220e] text-neutral-100 font-mono text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block font-pixel text-[9px] text-neutral-400 uppercase tracking-widest mb-1">
                ADDITIONAL RESOURCE LINK (OPTIONAL)
              </label>
              <input
                type="url"
                name="additionalResources"
                value={formData.additionalResources}
                onChange={handleChange}
                placeholder="Architecture diagram, Postman collection, or paper link"
                className="w-full px-3.5 py-2 bg-[#0a0603] border border-[#3a220e] text-neutral-100 font-mono text-xs focus:border-amber-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Working Project Declaration Checkbox */}
        <div className="p-4 border-2 border-[#54381e] bg-[#1a0e05] space-y-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="declarationConfirmed"
              checked={formData.declarationConfirmed}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 accent-amber-500 rounded-none cursor-pointer"
            />
            <span className="text-xs text-neutral-200 font-sans leading-relaxed">
              <strong className="text-amber-300 font-pixel text-[10px] uppercase block mb-0.5">
                WORKING PROJECT & HONOR CODE DECLARATION *
              </strong>
              I hereby declare that this project is operational, developed ethically in compliance with the AGENTCRAFT guidelines, and all submitted URLs have been verified to be accessible to the evaluation panel.
            </span>
          </label>
        </div>

        {/* Action Bar (Save Draft, Validate, Submit) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-2 border-[#3d240e] bg-[#120a04]">
          <div className="text-xs text-neutral-400 font-mono">
            Last saved: {formData.lastUpdated || 'Not saved yet'}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2.5 border-2 border-[#543b22] bg-[#2a1708] hover:bg-[#3d220b] font-pixel text-[10px] text-amber-200 uppercase tracking-wider shadow-sm transition-transform hover:-translate-y-0.5"
            >
              💾 SAVE DRAFT
            </button>

            <button
              type="button"
              onClick={handleValidateOnly}
              className="px-4 py-2.5 border-2 border-sky-700 bg-sky-950 hover:bg-sky-900 font-pixel text-[10px] text-sky-200 uppercase tracking-wider shadow-sm transition-transform hover:-translate-y-0.5"
            >
              🔍 VALIDATE LINKS
            </button>

            <button
              type="button"
              onClick={handleOpenReview}
              className="px-6 py-2.5 border-2 border-[#7a4f05] bg-[#fbbf24] hover:bg-[#f59e0b] font-pixel text-xs text-black font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_#fff,0_4px_0_#382403] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              REVIEW & SUBMIT PROJECT ➔
            </button>
          </div>
        </div>
      </form>

      {/* Review-Before-Submit Modal */}
      {showReviewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-[#180f07] border-4 border-[#4a2e16] shadow-[inset_2px_2px_0_#754822,0_24px_64px_rgba(0,0,0,0.95)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#3b240f]">
              <div>
                <span className="font-pixel text-[8px] text-amber-400 uppercase font-bold">
                  FINAL VERIFICATION
                </span>
                <h3 className="font-pixel text-base text-white uppercase font-bold">
                  REVIEW SUBMISSION BEFORE CONFIRMING
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-7 h-7 border border-[#5a381b] bg-[#221307] text-neutral-400 hover:text-white font-pixel text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 border border-[#3b220e] bg-[#110a04]">
                <span className="font-pixel text-[9px] text-neutral-400 uppercase block font-bold">
                  Project Title
                </span>
                <p className="font-pixel text-xs text-amber-300 font-bold mt-0.5">
                  {formData.projectTitle}
                </p>
              </div>

              {/* Resource Verification Table */}
              <div className="border border-[#3b220e] bg-[#110a04] p-3 space-y-2">
                <span className="font-pixel text-[9px] text-amber-400 uppercase block font-bold mb-1">
                  Deliverable Resource URLs
                </span>

                <div className="flex items-center justify-between py-1 border-b border-[#2b1708]">
                  <span className="font-pixel text-[9px] text-neutral-300">GitHub Repo:</span>
                  <a
                    href={formData.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-sky-400 hover:underline truncate max-w-[320px]"
                  >
                    {formData.githubUrl} ↗
                  </a>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#2b1708]">
                  <span className="font-pixel text-[9px] text-neutral-300">PPT Slides:</span>
                  <a
                    href={formData.pptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-sky-400 hover:underline truncate max-w-[320px]"
                  >
                    {formData.pptUrl} ↗
                  </a>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#2b1708]">
                  <span className="font-pixel text-[9px] text-neutral-300">Documentation:</span>
                  <a
                    href={formData.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-sky-400 hover:underline truncate max-w-[320px]"
                  >
                    {formData.docUrl} ↗
                  </a>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-pixel text-[9px] text-neutral-300">Demo Video:</span>
                  <a
                    href={formData.demoVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-sky-400 hover:underline truncate max-w-[320px]"
                  >
                    {formData.demoVideoUrl} ↗
                  </a>
                </div>
              </div>

              <div className="p-3 border border-amber-600/70 bg-[#261506] text-amber-200 text-xs">
                ⚠ Notice: Once submitted, your submission will be stamped with the official receipt time and locked for Round 1 Evaluation. Revisions require organizer authorization.
              </div>
            </div>

            <div className="pt-3 border-t border-[#3b240f] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-[#4a2e16] bg-[#1a0f06] font-pixel text-[10px] text-neutral-300 uppercase tracking-wider"
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="px-6 py-2 border-2 border-emerald-600 bg-emerald-500 hover:bg-emerald-400 font-pixel text-xs text-black font-bold uppercase tracking-wider shadow-[0_3px_0_#064e3b] disabled:opacity-50"
              >
                {isSubmitting ? 'PERSISTING RECEIPT...' : 'CONFIRM & SUBMIT PROJECT ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
