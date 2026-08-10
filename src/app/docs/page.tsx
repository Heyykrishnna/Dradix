"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Noise from "@/components/Noise";
import { motion, AnimatePresence } from "framer-motion";
import SubmitFeedbackModal from "@/components/SubmitFeedbackModal";
import {
  FileTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ChatBubbleIcon,
  RocketIcon,
  CodeIcon,
  CheckIcon,
  InfoCircledIcon,
  LightningBoltIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

interface Section {
  id: string;
  title: string;
  badge: string;
  content: React.ReactNode;
}

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("section-1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("Documentation");
  const [sectionHelpfulStatus, setSectionHelpfulStatus] = useState<Record<string, "yes" | "no" | null>>({});

  const observerRef = useRef<IntersectionObserver | null>(null);
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTocClick = (secId: string) => {
    setActiveSection(secId);
    isClickScrollingRef.current = true;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    document.getElementById(secId)?.scrollIntoView({ behavior: "smooth" });

    const resetClickScroll = () => {
      isClickScrollingRef.current = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("scrollend", resetClickScroll);
      }
    };

    if (typeof window !== "undefined" && "onscrollend" in window) {
      window.addEventListener("scrollend", resetClickScroll, { once: true });
    }

    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("scrollend", resetClickScroll);
      }
    }, 1000);
  };

  const handleHelpfulVote = (sectionId: string, vote: "yes" | "no") => {
    setSectionHelpfulStatus((prev) => ({ ...prev, [sectionId]: vote }));
    if (vote === "no") {
      setFeedbackCategory("Documentation");
      setIsFeedbackModalOpen(true);
    }
  };

  const sections: Section[] = useMemo(
    () => [
      {
        id: "section-1",
        title: "1. Platform Overview & Core Features",
        badge: "OVERVIEW",
        content: (
          <div className="space-y-5">
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Welcome to the official <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Dradix Documentation Hub</strong>. Dradix is an advanced developer portfolio engine, resume ATS scanner, and telemetry analyzer designed to aggregate software engineering achievements into a verified digital showcase.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#015451]/5 dark:bg-[#015451]/10 border border-[#015451]/20 rounded-2xl p-5 text-[#003c3a] dark:text-[#38bdf8] space-y-2 backdrop-blur-md">
                <div className="flex items-center gap-2 font-bold text-sm text-[#015451] dark:text-[#38bdf8]">
                  <LightningBoltIcon className="w-4 h-4" /> Live Metric Telemetry
                </div>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Real-time synchronization of commits, pull requests, ratings, and stats from GitHub, LeetCode, and competitive coding platforms.
                </p>
              </div>

              <div className="bg-[#015451]/5 dark:bg-[#015451]/10 border border-[#015451]/20 rounded-2xl p-5 text-[#003c3a] dark:text-[#38bdf8] space-y-2 backdrop-blur-md">
                <div className="flex items-center gap-2 font-bold text-sm text-[#015451] dark:text-[#38bdf8]">
                  <CodeIcon className="w-4 h-4" /> AI Resume ATS Engine
                </div>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Instant ATS compatibility parsing, keyword gap identification, structural formatting analysis, and recruiter alignment recommendations.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "section-2",
        title: "2. Quickstart & Account Setup",
        badge: "GETTING STARTED",
        content: (
          <div className="space-y-6">
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Get fully set up on Dradix in three simple steps:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-md flex items-start gap-3">
                <span className="w-6 h-6 rounded-xl bg-[#015451] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Account Authentication</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Register through Google OAuth or email and password authentication.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-md flex items-start gap-3">
                <span className="w-6 h-6 rounded-xl bg-[#015451] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Sync Developer Profiles</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Connect your GitHub Personal Access Token or username to sync activity.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-md flex items-start gap-3">
                <span className="w-6 h-6 rounded-xl bg-[#015451] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Analyze & Showcase</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Upload your resume for ATS scoring and publish your verified developer portfolio.</p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "section-3",
        title: "3. REST API Architecture",
        badge: "API SPECIFICATION",
        content: (
          <div className="space-y-6">
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Dradix exposes a high-performance REST API rooted at <code className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[#015451] dark:text-[#38bdf8] font-mono text-xs">/api/v1</code>.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 border border-zinc-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">POST</span>
                    <span className="font-bold">/api/v1/feedback</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Public / Optional JWT</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Submits feedback, category, star rating, subject, message, and page URL telemetry directly to backend database.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 border border-zinc-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-bold text-[10px]">GET</span>
                    <span className="font-bold">/api/v1/admin/feedback</span>
                  </div>
                  <span className="text-[10px] text-purple-400 font-bold">Admin Only</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Retrieves aggregated feedback records with user details, status badges, priority filtering, and search options.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "section-4",
        title: "4. Frequently Asked Questions",
        badge: "FAQ & SUPPORT",
        content: (
          <div className="space-y-3">
            {[
              {
                q: "How does the feedback synchronization system work?",
                a: "Submissions from the Documentation page or global modal are written to PostgreSQL database and instantly reflected in real time on the Admin Dashboard.",
              },
              {
                q: "Is my raw repository source code stored or copied?",
                a: "No. Dradix only inspects public or authorized commit metadata, line count summaries, and language distribution metrics.",
              },
              {
                q: "How do I update or delete my submitted feedback?",
                a: "Platform administrators manage status states (Pending, In Review, Resolved, Archived) and can purge entries upon request.",
              },
            ].map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-semibold text-xs text-zinc-900 dark:text-zinc-100 hover:text-[#015451] dark:hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDownIcon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#015451] dark:text-[#38bdf8]" : "text-zinc-400"}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ),
      },
    ],
    [openFaq]
  );

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (isClickScrollingRef.current) return;

      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
      if (intersectingEntries.length > 0) {
        const topEntry = intersectingEntries.reduce((prev, curr) => {
          return Math.abs(curr.boundingClientRect.top) < Math.abs(prev.boundingClientRect.top)
            ? curr
            : prev;
        }, intersectingEntries[0]);
        setActiveSection(topEntry.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [sections]);

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (sec) =>
          sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sec.badge.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-900 font-sans antialiased selection:bg-[#015451] selection:text-white">
      <header className="relative z-0 w-full overflow-hidden border-b border-zinc-800 text-white min-h-125 sm:min-h-150 flex flex-col justify-between">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/assets/images/PRIV-BG.png"
            alt="Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-50"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        </div>

        <Noise patternAlpha={18} />

        <nav className="w-full max-w-7xl mx-auto px-6 h-24 flex items-center justify-between z-20 relative">
          <Link href="/" className="flex items-center group">
            <span className="font-heading font-bold text-xl text-white tracking-tight hover:text-[#38d39f] transition-colors">
              Dradix
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              href="/"
              className="text-zinc-200 hover:text-white font-normal text-xs sm:text-sm transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="border border-white/25 hover:border-white/50 bg-white/10 hover:bg-white/20 text-white font-normal text-xs sm:text-sm px-4 py-2 rounded-full transition-all backdrop-blur-md shadow-lg"
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                setFeedbackCategory("Documentation");
                setIsFeedbackModalOpen(true);
              }}
              className="bg-[#015451] hover:bg-[#01403e] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <ChatBubbleIcon className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </nav>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center flex-1 flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading text-white tracking-tight mb-4">
            Documentation Hub
          </h1>

          <p className="text-zinc-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal mb-8">
            Complete technical documentation, API specifications, user onboarding guides, and platform feedback integration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-300">
            <span className="bg-black/50 border border-white/15 px-4 py-2 rounded-xl backdrop-blur-md">
              API Status: <strong className="text-emerald-400 font-semibold">Active (v1)</strong>
            </span>
            <span className="bg-black/50 border border-white/15 px-4 py-2 rounded-xl backdrop-blur-md">
              Sync Mode: <strong className="text-white">Real-Time</strong>
            </span>
          </div>
        </div>
      </header>

      <div className="bg-zinc-100 dark:bg-zinc-950 min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-xs border border-zinc-200/80 dark:border-zinc-800 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation topics (e.g. API, Feedback, Quickstart)..."
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-medium">
                {filteredSections.length} Sections Found
              </span>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                <ChatBubbleIcon className="w-3.5 h-3.5 text-[#015451] dark:text-[#38bdf8]" />
                <span>Feedback Form</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-8 z-10 space-y-4">
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Table of Contents
                  </h3>
                  <FileTextIcon className="w-4 h-4 text-[#015451] dark:text-[#38bdf8]" />
                </div>

                <nav className="space-y-1">
                  {filteredSections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleTocClick(sec.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                          isActive
                            ? "bg-[#015451]/10 text-[#015451] dark:text-[#38bdf8] font-bold dark:bg-[#015451]/20 border border-[#015451]/30"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                        }`}
                      >
                        <span className="truncate">{sec.title}</span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 text-[#015451] dark:text-[#38bdf8] shrink-0" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="bg-gradient-to-br from-[#015451]/10 to-emerald-500/5 dark:from-[#015451]/20 dark:to-emerald-950/20 border border-[#015451]/20 rounded-2xl p-4 text-xs space-y-2 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-[#015451] dark:text-[#38bdf8] font-bold">
                  <InfoCircledIcon className="w-4 h-4" /> Need Custom Help?
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Have a suggestion or found an issue in documentation? Send feedback directly to platform administrators.
                </p>
                <button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="mt-1 text-[#015451] dark:text-[#38bdf8] font-bold text-xs hover:underline cursor-pointer flex items-center gap-1"
                >
                  Open Feedback Form →
                </button>
              </div>
            </aside>

            <main className="flex-1 min-w-0 space-y-8 w-full">
              {filteredSections.map((sec) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-5 scroll-mt-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      {sec.title}
                    </h2>
                    <span className="px-2.5 py-1 rounded-lg bg-[#015451]/10 text-[#015451] dark:text-[#38bdf8] text-[10px] font-bold tracking-wider uppercase border border-[#015451]/20">
                      {sec.badge}
                    </span>
                  </div>

                  <div>{sec.content}</div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      Was this documentation section helpful?
                    </span>

                    {sectionHelpfulStatus[sec.id] ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckIcon className="w-4 h-4" /> Thank you for your feedback
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleHelpfulVote(sec.id, "yes")}
                          className="px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleHelpfulVote(sec.id, "no")}
                          className="px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium hover:border-red-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </main>
          </div>
        </div>
      </div>

      <SubmitFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        defaultCategory={feedbackCategory}
      />
    </div>
  );
}
