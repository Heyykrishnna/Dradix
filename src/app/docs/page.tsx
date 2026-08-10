"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SubmitFeedbackModal from "@/components/SubmitFeedbackModal";
import {
  FileTextIcon,
  MagnifyingGlassIcon,
  ChatBubbleIcon,
  RocketIcon,
  CodeIcon,
  GearIcon,
  QuestionMarkCircledIcon,
  CheckIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  StarFilledIcon,
  InfoCircledIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";

interface DocSection {
  id: string;
  category: string;
  title: string;
  icon: any;
  summary: string;
  content: React.ReactNode;
}

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("Documentation");
  const [sectionHelpfulStatus, setSectionHelpfulStatus] = useState<Record<string, "yes" | "no" | null>>({});

  const handleHelpfulVote = (sectionId: string, vote: "yes" | "no") => {
    setSectionHelpfulStatus((prev) => ({ ...prev, [sectionId]: vote }));
    if (vote === "no") {
      setFeedbackCategory("Documentation");
      setIsFeedbackModalOpen(true);
    }
  };

  const docSections: DocSection[] = [
    {
      id: "overview",
      category: "Getting Started",
      title: "Platform Overview",
      icon: RocketIcon,
      summary: "High-level overview of Dradix features, architecture, and core capabilities.",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Welcome to the official <strong>Dradix Documentation</strong>. Dradix is an advanced developer portfolio analytics platform, resume ATS analyzer, and interactive coding telemetry engine designed to elevate your software engineering career.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 font-bold text-sm text-[#015451] dark:text-[#38bdf8] mb-1">
                <LightningBoltIcon className="w-4 h-4" /> Live Syncing Engine
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Automatically aggregate commits, pull requests, ratings, and stats from GitHub, LeetCode, and Codeforces in real time.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 font-bold text-sm text-[#015451] dark:text-[#38bdf8] mb-1">
                <CodeIcon className="w-4 h-4" /> AI Resume & Portfolio Diagnostics
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Receive instant ATS scoring, keyword breakdown, formatting feedback, and recruiter optimization recommendations.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "quickstart",
      category: "Getting Started",
      title: "Quickstart Guide",
      icon: CheckIcon,
      summary: "Set up your Dradix account, sync GitHub, and create your public developer profile.",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Follow these simple steps to get fully onboarded with Dradix in under 3 minutes:
          </p>

          <ol className="space-y-4 list-decimal list-inside text-xs text-zinc-600 dark:text-zinc-300">
            <li className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-zinc-100">Create an Account:</strong> Register via Google OAuth or standard email/password authentication.
            </li>
            <li className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-zinc-100">Connect GitHub:</strong> Authorize GitHub integration or provide your Personal Access Token (PAT) for automated commit sync.
            </li>
            <li className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-zinc-100">Upload Resume:</strong> Navigate to Resume Analyzer to extract developer score and formatting tips.
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: "api-reference",
      category: "API & Infrastructure",
      title: "REST API Reference",
      icon: CodeIcon,
      summary: "Endpoints for authentication, user telemetry, feedback, and system logs.",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Dradix provides a high-throughput REST API hosted at <code className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[#015451] font-mono text-xs">/api/v1</code>.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-zinc-900 text-zinc-100 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">POST</span>
                <span>/api/v1/feedback</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">Submit user feedback, documentation reviews, or bug reports.</p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 text-zinc-100 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">GET</span>
                <span>/api/v1/admin/feedback</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">Admin-only endpoint to retrieve synced user feedbacks with filters and metrics.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "faq",
      category: "Support",
      title: "Frequently Asked Questions",
      icon: QuestionMarkCircledIcon,
      summary: "Common questions regarding security, public sharing, and account management.",
      content: (
        <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-300">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">How does feedback syncing work?</h4>
            <p className="text-zinc-500 dark:text-zinc-400">All submitted feedback is stored in PostgreSQL database with real-time timestamps, user metadata, and status badges, instantly reflecting on the Admin Dashboard.</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Is my data secure?</h4>
            <p className="text-zinc-500 dark:text-zinc-400">Yes! We employ strict JWT authentication, bcrypt password hashing, session revocation, and role-based access control.</p>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = docSections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSection = docSections.find((s) => s.id === activeSection) || docSections[0];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#015451] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                Dr
              </div>
              <span className="font-bold text-sm tracking-tight">
                Dradix <span className="text-[#015451] dark:text-[#38bdf8]">Docs</span>
              </span>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-[#015451] focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition-all"
              />
            </div>

            <button
              onClick={() => {
                setFeedbackCategory("Documentation");
                setIsFeedbackModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#015451] hover:bg-[#01403e] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <ChatBubbleIcon className="w-3.5 h-3.5" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Documentation Hub
            </p>
            {filteredSections.map((sec) => {
              const isActive = sec.id === activeSection;
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-[#015451]/10 text-[#015451] dark:text-[#38bdf8] font-bold dark:bg-[#015451]/20 border border-[#015451]/30"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#015451] dark:text-[#38bdf8]" : "text-zinc-400"}`} />
                    <span>{sec.title}</span>
                  </div>
                  {isActive && <ChevronRightIcon className="w-3.5 h-3.5 text-[#015451] dark:text-[#38bdf8]" />}
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
              <InfoCircledIcon className="w-4 h-4" /> Need Custom Help?
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
              Have a feature request or noticed a typo? Submit feedback directly to our administrative team.
            </p>
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="mt-1 text-emerald-700 dark:text-emerald-400 font-semibold underline hover:text-emerald-800 cursor-pointer"
            >
              Open Feedback Form →
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#015451] dark:text-[#38bdf8] mb-1">
              <span>{currentSection.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {currentSection.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {currentSection.summary}
            </p>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* Render Active Section Content */}
          <div>{currentSection.content}</div>

          {/* Micro Feedback Widget */}
          <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-2xl">
            <div className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
              Was this documentation page helpful?
            </div>

            {sectionHelpfulStatus[currentSection.id] ? (
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4" /> Thank you for your feedback!
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleHelpfulVote(currentSection.id, "yes")}
                  className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => handleHelpfulVote(currentSection.id, "no")}
                  className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium hover:border-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  👎 No
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Global Feedback Modal */}
      <SubmitFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        defaultCategory={feedbackCategory}
      />
    </div>
  );
}
