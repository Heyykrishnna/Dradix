"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  CalendarIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  UpdateIcon,
  PlusIcon,
  TrashIcon,
  Pencil2Icon,
  Cross2Icon,
  ExternalLinkIcon,
  EyeOpenIcon,
  HeartIcon,
  StarIcon,
  GridIcon,
  ListBulletIcon,
  GitHubLogoIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useSkills, MASTER_SKILLS_LIST, Skill } from "@/context/SkillsContext";
import SegmentedSlider from "./components/SegmentedSlider";
import { apiFetch } from "@/lib/api";
import Loader from "@/components/Loader";
import VideoLoaderBackground from "@/components/VideoLoaderBackground";

const ErrorQuestionTooltip = ({ message }: { message: string }) => {
  return (
    <div className="relative group inline-flex items-center ml-1.5 z-40">
      <span
        className="w-4 h-4 rounded-full bg-red-500/10 text-red-600 border border-red-500/30 flex items-center justify-center text-[10px] font-black cursor-pointer hover:bg-red-600 hover:text-white transition-all shadow-xs"
        title="View Error"
      >
        ?
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col w-52 p-2 bg-zinc-900 text-white text-[11px] rounded-xl shadow-2xl border border-zinc-800 z-50 pointer-events-none text-center">
        <span className="font-bold text-red-400 mb-0.5">Sync / Load Error</span>
        <span className="text-zinc-300 text-[10px] leading-tight">
          {message}
        </span>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-900" />
      </div>
    </div>
  );
};

const DevScoreTooltip = () => {
  return (
    <div className="relative group inline-flex items-center z-40">
      <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-600 border border-red-500/30 flex items-center justify-center text-[10px] font-black cursor-pointer hover:bg-red-600 hover:text-white transition-all shadow-xs">
        ?
      </span>
      <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-56 p-3 bg-zinc-900 text-white text-[11px] rounded-2xl shadow-2xl border border-zinc-800 z-50 pointer-events-none">
        <div className="absolute left-2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-zinc-900" />
        <span className="font-extrabold text-white mb-2 text-center text-xs">
          How Dev Score is Calculated
        </span>
        <div className="space-y-1.5">
          {(
            [
              { label: "GitHub Commits", weight: "30%" },
              { label: "Problems Solved", weight: "25%" },
              { label: "Coding Streak", weight: "20%" },
              { label: "Platform Ratings", weight: "15%" },
              { label: "Projects & Links", weight: "10%" },
            ] as { label: string; weight: string }[]
          ).map(({ label, weight }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-2"
            >
              <span className="text-zinc-400 text-[10px]">{label}</span>
              <span className="text-emerald-400 font-bold text-[10px]">
                {weight}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-zinc-700/60 text-[10px] text-zinc-400 text-center">
          Score refreshes every 30 min
        </div>
      </div>
    </div>
  );
};

import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";

interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  updated_at: string;
}

interface BackendProject {
  id?: number | string;
  title?: string;
  name?: string;
  description?: string;
  tech_stack?: string[];
  demo_url?: string;
  github_url?: string;
  architecture_details?: string;
  challenges_solved?: string;
  screenshots?: string[];
  status?: string;
  platform?: string;
  views?: number;
  likes?: number;
  stars?: number;
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  creator: string;
  stack: string;
  platform: string;
  date: string;
  status: string;
  statusColor: string;
  views: number;
  likes: number;
  stars: number;
  description?: string;
  demoUrl?: string;
  githubUrl?: string;
  architectureDetails?: string;
  challengesSolved?: string;
  screenshots?: string[];
}

export interface MonthlyStats {
  month: string;
  views: number;
  likes: number;
  stars: number;
}

const initialDevStats = {
  score: 0,
  contributions: 0,
  problemsSolved: 0,
  streak: 0,
  projects: 0,
  liveProjects: 0,
  repositories: 0,
  publicRepos: 0,
  followers: 0,
  stars: 0,
  pullRequests: 0,
  issuesClosed: 0,
  hackathons: 0,
  wins: 0,
  certificates: 0,
};

export interface CodingPlatformItem {
  name: string;
  rating: number;
  rank: string;
  solved: number;
  color: string;
  streak: number;
  history: number[];
  logo: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  desc: string;
  color?: string;
}

export interface CareerRingItem {
  label: string;
  value: number;
  color: string;
}

const fulfillmentData = [
  { month: "Feb", commits: 45 },
  { month: "Mar", commits: 60 },
  { month: "Apr", commits: 55 },
  { month: "May", commits: 87 },
  { month: "Jun", commits: 70 },
  { month: "Jul", commits: 65 },
  { month: "Aug", commits: 78 },
  { month: "Sep", commits: 80 },
  { month: "Oct", commits: 82 },
  { month: "Nov", commits: 90 },
];

const languageData = [
  { name: "TypeScript", value: 42, color: "#3b82f6" },
  { name: "Python", value: 27, color: "#f59e0b" },
  { name: "Rust", value: 22, color: "#f43f5e" },
  { name: "Go", value: 9, color: "#005c58" },
];

// skillsList has been moved to SkillsContext

const dailyActivityData = [
  { day: "6am", hours: 0.8, commits: 2, problems: 1 },
  { day: "9am", hours: 1.5, commits: 4, problems: 2 },
  { day: "12pm", hours: 2.2, commits: 6, problems: 3 },
  { day: "3pm", hours: 1.8, commits: 5, problems: 2 },
  { day: "6pm", hours: 2.6, commits: 9, problems: 4 },
  { day: "9pm", hours: 1.1, commits: 3, problems: 1 },
];

const weeklyActivityData = [
  { day: "Mon", hours: 4.5, commits: 12, problems: 6 },
  { day: "Tue", hours: 6.2, commits: 18, problems: 8 },
  { day: "Wed", hours: 3.8, commits: 8, problems: 5 },
  { day: "Thu", hours: 7.1, commits: 22, problems: 10 },
  { day: "Fri", hours: 5.5, commits: 14, problems: 7 },
  { day: "Sat", hours: 4.0, commits: 7, problems: 4 },
  { day: "Sun", hours: 2.9, commits: 6, problems: 2 },
];

const monthlyActivityData = [
  { day: "Week 1", hours: 28, commits: 68, problems: 35 },
  { day: "Week 2", hours: 34, commits: 87, problems: 42 },
  { day: "Week 3", hours: 31, commits: 72, problems: 38 },
  { day: "Week 4", hours: 40, commits: 98, problems: 51 },
];

const yearlyActivityData = [
  { day: "Q1", hours: 310, commits: 720, problems: 340 },
  { day: "Q2", hours: 360, commits: 840, problems: 410 },
  { day: "Q3", hours: 420, commits: 960, problems: 490 },
  { day: "Q4", hours: 380, commits: 910, problems: 450 },
];

const achievementBadges = [
  { label: "100 Commits", icon: "C", unlocked: true, color: "#005c58" },
  { label: "500 Problems", icon: "P", unlocked: true, color: "#f59e0b" },
  { label: "1000 Problems", icon: "1K", unlocked: true, color: "#f59e0b" },
  { label: "First OSS PR", icon: "O", unlocked: true, color: "#3b82f6" },
  { label: "100 Stars", icon: "S", unlocked: true, color: "#f59e0b" },
  { label: "100 Followers", icon: "F", unlocked: true, color: "#005c58" },
  { label: "Top 5%", icon: "T", unlocked: false, color: "#f43f5e" },
];

const initialRecruiterChecklist = [
  { label: "Resume Uploaded", done: false },
  { label: "GitHub Active", done: true },
  { label: "Projects Added", done: true },
  { label: "LinkedIn Connected", done: true },
  { label: "Portfolio Published", done: false },
  { label: "Certificates Added", done: true },
  { label: "Open Source Contributions", done: true },
];

type NotificationItem = { text: string; time: string; type: string };

const initialNotifications: NotificationItem[] = [
  { text: "GitHub synced successfully", time: "2 min ago", type: "sync" },
  { text: "Resume analyzed by AI coach", time: "1h ago", type: "analyze" },
  { text: "New badge unlocked: 42-day streak", time: "4h ago", type: "badge" },
  { text: "Weekly activity report is ready", time: "1d ago", type: "report" },
];

const leaderboardRankings = [
  { rank: 1, name: "Arjun Mehta", score: 98, xp: "12.4k" },
  { rank: 2, name: "Priya Singh", score: 95, xp: "11.8k" },
  { rank: 3, name: "Yatharth K.", score: 92, xp: "10.9k", isYou: true },
  { rank: 4, name: "Rohan Gupta", score: 89, xp: "9.7k" },
];

const recentActivityFeed = [
  { text: "Committed to Dradix main", time: "2h ago", color: "#3b82f6" },
  { text: "Added nextjs-portfolio project", time: "5h ago", color: "#00c9a7" },
  { text: "Connected LeetCode account", time: "1d ago", color: "#f59e0b" },
  { text: "Earned 500 Problems badge", time: "2d ago", color: "#f43f5e" },
];

const upcomingEvents = [
  { title: "LeetCode Weekly Contest", time: "Tomorrow, 8 AM", type: "contest" },
  { title: "HackIndia Registration", time: "3 days left", type: "hackathon" },
  { title: "System Design Module 4 Due", time: "Friday", type: "course" },
];

const levelConfig: Record<string, { label: string; bg: string; text: string }> =
  {
    Advanced: {
      label: "Advanced",
      bg: "bg-[#005c58]/10",
      text: "text-[#005c58]",
    },
    Intermediate: {
      label: "Intermediate",
      bg: "bg-[#f59e0b]/10",
      text: "text-[#f59e0b]",
    },
    Beginner: {
      label: "Beginner",
      bg: "bg-[#f43f5e]/10",
      text: "text-[#f43f5e]",
    },
  };

function SkillsSection({ projectsList }: { projectsList: Project[] }) {
  const { userSkills } = useSkills();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const activeSkill = hoveredSkill;
  const [renderedSkill, setRenderedSkill] = useState<string | null>(null);

  const displaySkills = useMemo(() => {
    const existingNames = new Set(userSkills.map((s) => s.name.toLowerCase()));
    const extraSkills: Skill[] = [];

    projectsList.forEach((proj) => {
      if (!proj.stack) return;
      const tags = proj.stack
        .split(/[,\s/]+/)
        .map((t) => t.trim())
        .filter(Boolean);
      tags.forEach((tag) => {
        const tagClean = tag.toLowerCase().replace(/[\.\s-]/g, "");
        if (tagClean.length < 2) return;

        const masterMatch = MASTER_SKILLS_LIST.find((m) => {
          const mClean = m.name.toLowerCase().replace(/[\.\s-]/g, "");
          return (
            mClean === tagClean ||
            mClean.includes(tagClean) ||
            tagClean.includes(mClean)
          );
        });

        if (masterMatch) {
          const mNameLower = masterMatch.name.toLowerCase();
          if (
            !existingNames.has(mNameLower) &&
            !extraSkills.some((e) => e.name.toLowerCase() === mNameLower)
          ) {
            extraSkills.push({
              ...masterMatch,
              relatedProjects: [proj.name],
            });
          }
        }
      });
    });

    return [...userSkills, ...extraSkills];
  }, [userSkills, projectsList]);

  return (
    <div id="skills" className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-black tracking-tight font-heading">
          Tech Stack &amp; Skills
        </h3>
        <span className="text-[11px] font-extrabold text-zinc-600 bg-white rounded-full px-2.5 py-0.5 border border-zinc-200/80">
          {displaySkills.length} Active
        </span>
      </div>

      <div className="flex items-stretch gap-3 overflow-x-auto py-3 px-5 -mx-5 scrollbar-thin">
        {displaySkills.map((skill) => {
          const isHovered = hoveredSkill === skill.name;
          const cfg = levelConfig[skill.level] ?? levelConfig.Beginner;
          const circumference = 2 * Math.PI * 18;
          const offset = circumference * (1 - skill.pct / 100);

          return (
            <button
              key={skill.name}
              type="button"
              onMouseEnter={() => {
                setHoveredSkill(skill.name);
                setRenderedSkill(skill.name);
              }}
              onMouseLeave={() => setHoveredSkill(null)}
              className={`relative shrink-0 flex flex-col items-center gap-2 rounded-2xl px-4 py-4 w-27.5 transition-all duration-300 cursor-pointer ${
                isHovered
                  ? "bg-zinc-100 shadow-sm border border-zinc-200/80 scale-[1.02]"
                  : "bg-white border border-transparent"
              }`}
            >
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="18"
                    fill="none"
                    stroke="#f4f4f5"
                    strokeWidth="3"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="18"
                    fill="none"
                    stroke={skill.color}
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: `${skill.color}15` }}
                >
                  <Image
                    src={skill.logo}
                    alt={skill.name}
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                </div>
              </div>

              <span className="text-[11px] font-bold text-zinc-800 leading-none">
                {skill.name}
              </span>

              <span
                className={`text-[8px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
              >
                {skill.level}
              </span>

              <span
                className="text-[10px] font-black"
                style={{ color: skill.color }}
              >
                {skill.pct}%
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          activeSkill
            ? "grid-rows-[1fr] opacity-100 mt-2"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`transition-all duration-500 transform ${
              activeSkill
                ? "translate-y-0 scale-100"
                : "-translate-y-2 scale-95"
            }`}
          >
            <SkillProjectPanel
              activeSkill={renderedSkill}
              projectsList={projectsList}
              allSkills={displaySkills}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillProjectPanel({
  activeSkill,
  projectsList,
  allSkills,
}: {
  activeSkill: string | null;
  projectsList: Project[];
  allSkills: Skill[];
}) {
  if (!activeSkill) return null;
  const skill = allSkills.find((s) => s.name === activeSkill);
  if (!skill) return null;

  const skillClean = skill.name.toLowerCase().replace(/[\.\s-]/g, "");

  const projects = projectsList.filter((p) => {
    if (
      skill.relatedProjects &&
      skill.relatedProjects.some(
        (rp) => rp.toLowerCase() === p.name.toLowerCase(),
      )
    ) {
      return true;
    }
    if (p.stack) {
      const stackTags = p.stack
        .split(/[,\s/]+/)
        .map((t) =>
          t
            .trim()
            .toLowerCase()
            .replace(/[\.\s-]/g, ""),
        )
        .filter(Boolean);
      if (
        stackTags.some(
          (tag) =>
            tag === skillClean ||
            tag.includes(skillClean) ||
            skillClean.includes(tag),
        )
      ) {
        return true;
      }
    }
    if (
      p.name.toLowerCase().includes(skill.name.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(skill.name.toLowerCase()))
    ) {
      return true;
    }
    return false;
  });

  const cfg = levelConfig[skill.level] ?? levelConfig.Beginner;

  return (
    <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm border border-zinc-200/60">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100"
          style={{ backgroundColor: `${skill.color}15` }}
        >
          <Image
            src={skill.logo}
            alt={skill.name}
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
          />
        </div>
        <div>
          <p className="text-[14px] font-black text-black leading-none flex items-center gap-2">
            <span>{skill.name}</span>
            <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200/80">
              {projects.length} {projects.length === 1 ? "Project" : "Projects"}{" "}
              Linked
            </span>
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">
            {skill.pct}% proficiency &middot;{" "}
            <span className={`font-bold ${cfg.text}`}>{skill.level}</span>
          </p>
        </div>
        <div className="ml-auto w-full max-w-40 h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${skill.pct}%`, backgroundColor: skill.color }}
          />
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
            Projects Built With {skill.name}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between bg-[#f4f4f5] rounded-xl p-3.5 hover:bg-zinc-100 hover:shadow-sm border border-zinc-200/60 transition-all duration-200"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-extrabold text-black truncate">
                      {proj.name}
                    </p>
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-[#005c58] transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLinkIcon className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-[9px] text-zinc-500 font-medium truncate">
                    {proj.stack} &middot; {proj.platform || "Web"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className="text-[8px] font-black px-2 py-0.5 rounded-full border border-current/20"
                    style={{
                      backgroundColor: `${proj.statusColor || "#003c3a"}18`,
                      color: proj.statusColor || "#003c3a",
                    }}
                  >
                    {proj.status}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-semibold flex items-center gap-0.5">
                    <StarIcon className="w-3 h-3 text-amber-400" />{" "}
                    {proj.stars || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
          <p className="text-[11px] text-zinc-500 font-medium">
            No projects explicitly tagged with{" "}
            <strong className="text-zinc-900">{skill.name}</strong> yet.
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Add or edit a project and include &quot;{skill.name}&quot; in its
            Tech Stack to link it automatically!
          </p>
        </div>
      )}
    </div>
  );
}

interface DashboardResponseData {
  profile?: {
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    ats_score?: number;
    ats_report?: unknown;
  };
  developer_score?: number;
  github?: {
    username?: string;
    total_commits?: number;
    stars_earned?: number;
    total_prs?: number;
    total_issues?: number;
    contribution_graph?: {
      activeDays?: number;
      dailyContributions?: Record<string, number>;
      monthlyCommits?: Array<{ month: string; commits: number }>;
    };
    monthly_commits?: Array<{ month: string; commits: number }>;
    languages_used?: Record<string, number>;
  };
  coding_profiles?: Array<{
    platform: string;
    rating?: number;
    global_ranking?: number;
    problems_solved?: number;
  }>;
  projects?: Array<{
    id: number | string;
    name?: string;
    title?: string;
    description?: string;
    tech_stack?: string[];
    demo_url?: string;
    github_url?: string;
    architecture_details?: string;
    challenges_solved?: string;
    screenshots?: string[];
    platform?: string;
    status?: string;
    views?: number;
    likes?: number;
    stars?: number;
    created_at?: string | Date;
  }>;
  achievements?: Array<{
    id: number;
    title: string;
  }>;
  recruiterChecklist?: Array<{
    label: string;
    done: boolean;
  }>;
  timeline?: Array<{
    date: string;
    title: string;
    desc: string;
    color: string;
  }>;
  notifications?: NotificationItem[];
  careerRings?: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

const REPO_FILTER_OPTIONS: Array<"all" | "public" | "private"> = [
  "all",
  "public",
  "private",
];

function RepoVisibilitySlider({
  filter,
  setFilter,
  repos,
}: {
  filter: "all" | "public" | "private";
  setFilter: (f: "all" | "public" | "private") => void;
  repos: GitHubRepoItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const index = REPO_FILTER_OPTIONS.indexOf(filter);
    const buttons =
      containerRef.current.querySelectorAll<HTMLButtonElement>("button");
    const targetButton = buttons[index];

    if (targetButton) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const targetRect = targetButton.getBoundingClientRect();

      setSliderStyle({
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
      });
    }
  }, [filter]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center p-1 bg-zinc-100 border border-zinc-200/80 rounded-xl select-none"
    >
      {sliderStyle.width > 0 && (
        <div
          className="absolute top-1 bottom-1 bg-zinc-900 rounded-lg shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            left: `${sliderStyle.left}px`,
            width: `${sliderStyle.width}px`,
          }}
        />
      )}

      {REPO_FILTER_OPTIONS.map((opt) => {
        const isActive = opt === filter;
        const count =
          opt === "all"
            ? repos.length
            : opt === "public"
              ? repos.filter((r) => !r.private).length
              : repos.filter((r) => r.private).length;

        return (
          <button
            key={opt}
            type="button"
            onClick={() => setFilter(opt)}
            className={`relative z-10 px-3 py-1 text-[11px] font-bold tracking-tight capitalize transition-colors duration-200 cursor-pointer whitespace-nowrap ${
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {opt} ({count})
          </button>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("dradix_dashboard_data");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.projectsList) return parsed.projectsList;
        } catch {}
      }
    }
    return [];
  });
  const [devStats, setDevStats] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("dradix_dashboard_data");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.devStats) return parsed.devStats;
        } catch {}
      }
    }
    return initialDevStats;
  });
  const [atsScore, setAtsScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("dradix_ats_score");
      if (val) return parseInt(val, 10) || 84;
    }
    return 84;
  });

  React.useEffect(() => {
    const syncAts = () => {
      if (typeof window !== "undefined") {
        const val = localStorage.getItem("dradix_ats_score");
        if (val) setAtsScore(parseInt(val, 10) || 84);
      }
    };
    window.addEventListener("storage", syncAts);
    syncAts();
    return () => window.removeEventListener("storage", syncAts);
  }, []);
  const [platformsList, setPlatformsList] = useState<CodingPlatformItem[]>(
    () => {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("dradix_dashboard_data");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.platformsList) return parsed.platformsList;
          } catch {}
        }
      }
      return [];
    },
  );
  const [timeline, setTimeline] = useState<TimelineItem[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("dradix_dashboard_data");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.timeline) return parsed.timeline;
        } catch {}
      }
    }
    return [];
  });
  const [rings, setRings] = useState<CareerRingItem[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("dradix_dashboard_data");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.rings) return parsed.rings;
        } catch {}
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const [selectedVelocityMonth, setSelectedVelocityMonth] =
    useState<string>("May");
  const [velocityData, setVelocityData] =
    useState<Array<{ month: string; commits: number }>>(fulfillmentData);
  const [isAvgHovered, setIsAvgHovered] = useState<boolean>(false);
  const [languagesList, setLanguagesList] =
    useState<Array<{ name: string; value: number; color: string }>>(
      languageData,
    );
  const [hoveredLanguage, setHoveredLanguage] = useState<{
    name: string;
    value: number;
  } | null>(null);

  const [projectViewMode, setProjectViewMode] = useState<"grid" | "table">(
    "grid",
  );

  const [projectModalType, setProjectModalType] = useState<
    "add" | "edit" | "delete" | null
  >(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFormState, setProjectFormState] = useState({
    name: "",
    stack: "",
    platform: "GitHub",
    status: "Live",
    views: 0,
    likes: 0,
    stars: 0,
    description: "",
    demoUrl: "",
    githubUrl: "",
    architectureDetails: "",
    challengesSolved: "",
    screenshot1: "",
    screenshot2: "",
  });

  useEffect(() => {
    if (projectModalType) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [projectModalType]);

  const [isGitHubConnected, setIsGitHubConnected] = useState<boolean>(false);
  const [connectedGitHubUsername, setConnectedGitHubUsername] =
    useState<string>("");
  const [isConnectingToken, setIsConnectingToken] = useState<boolean>(false);
  const [repoVisibilityFilter, setRepoVisibilityFilter] = useState<
    "all" | "public" | "private"
  >("all");

  const [githubRepos, setGithubRepos] = useState<GitHubRepoItem[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState<boolean>(false);
  const [repoFetchError, setRepoFetchError] = useState<string | null>(null);
  const [selectedRepoName, setSelectedRepoName] = useState<string | null>(null);
  const [addProjectStep, setAddProjectStep] = useState<
    "github_select" | "form"
  >("github_select");

  const fetchAuthenticatedGitHubRepos = async () => {
    setIsFetchingRepos(true);
    setRepoFetchError(null);
    try {
      const res = await apiFetch<{
        data: {
          connected: boolean;
          username?: string;
          repos: GitHubRepoItem[];
          error?: string;
        };
      }>("/projects/github/repos");

      if (res && res.data) {
        setIsGitHubConnected(res.data.connected);
        if (res.data.username) {
          setConnectedGitHubUsername(res.data.username);
        }
        setGithubRepos(res.data.repos || []);
        if (res.data.error) setRepoFetchError(res.data.error);
      }
    } catch (err: unknown) {
      console.error("Error loading GitHub repos:", err);
      setRepoFetchError(
        err instanceof Error
          ? err.message
          : "Failed to load GitHub repositories.",
      );
    } finally {
      setIsFetchingRepos(false);
    }
  };

  useEffect(() => {
    const initGitHubRepos = async () => {
      await fetchAuthenticatedGitHubRepos();
    };
    void initGitHubRepos();

    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "GITHUB_OAUTH_SUCCESS") {
        void fetchAuthenticatedGitHubRepos();
      }
    };
    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, []);

  const handleStartGitHubOAuth = async () => {
    setIsConnectingToken(true);
    setRepoFetchError(null);
    try {
      const res = await apiFetch<{
        data: {
          authUrl: string;
          configured: boolean;
        };
      }>("/projects/github/auth");

      if (res && res.data && res.data.authUrl) {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
          res.data.authUrl,
          "GitHubOAuth",
          `width=${width},height=${height},top=${top},left=${left}`,
        );

        if (!popup) {
          window.location.href = res.data.authUrl;
        }
      }
    } catch (err: unknown) {
      setRepoFetchError(
        err instanceof Error
          ? err.message
          : "Failed to initiate GitHub OAuth Sign-In.",
      );
    } finally {
      setIsConnectingToken(false);
    }
  };

  const handleDisconnectGitHub = async () => {
    try {
      await apiFetch("/projects/github/disconnect", { method: "POST" });
      setIsGitHubConnected(false);
      setConnectedGitHubUsername("");
      setGithubRepos([]);
    } catch (err) {
      console.error("Failed to disconnect GitHub:", err);
    }
  };

  const handleSelectGitHubRepo = (repo: GitHubRepoItem) => {
    setSelectedRepoName(repo.name);
    const techStack =
      repo.topics && repo.topics.length > 0
        ? repo.topics.join(", ")
        : repo.language || "";

    setProjectFormState((prev) => ({
      ...prev,
      name: repo.name || prev.name,
      description: repo.description || prev.description,
      githubUrl: repo.html_url || prev.githubUrl,
      demoUrl: repo.homepage || prev.demoUrl,
      stack: techStack || prev.stack,
      stars:
        repo.stargazers_count !== undefined
          ? repo.stargazers_count
          : prev.stars,
      platform: "GitHub",
      status: "Live",
    }));

    setAddProjectStep("form");
  };

  const handleOpenAddModal = () => {
    setProjectFormState({
      name: "",
      stack: "",
      platform: "GitHub",
      status: "Live",
      views: 0,
      likes: 0,
      stars: 0,
      description: "",
      demoUrl: "",
      githubUrl: "",
      architectureDetails: "",
      challengesSolved: "",
      screenshot1: "",
      screenshot2: "",
    });
    setSelectedRepoName(null);
    setRepoFetchError(null);
    setAddProjectStep("github_select");
    setProjectModalType("add");

    fetchAuthenticatedGitHubRepos();
  };

  const handleOpenEditModal = (proj: Project) => {
    setEditingProjectId(proj.id);
    setSelectedProject(proj);
    setProjectFormState({
      name: proj.name,
      stack: proj.stack,
      platform: proj.platform || "GitHub",
      status: proj.status || "Live",
      views: proj.views || 0,
      likes: proj.likes || 0,
      stars: proj.stars || 0,
      description: proj.description || "",
      demoUrl: proj.demoUrl || "",
      githubUrl: proj.githubUrl || "",
      architectureDetails: proj.architectureDetails || "",
      challengesSolved: proj.challengesSolved || "",
      screenshot1: proj.screenshots?.[0] || "",
      screenshot2: proj.screenshots?.[1] || "",
    });
    setAddProjectStep("form");
    setProjectModalType("edit");
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormState.name.trim()) return;

    const statusColorsMap: Record<string, string> = {
      Live: "#005c58",
      "In Progress": "#f59e0b",
      Archived: "#ef4444",
    };

    const screenshots = [
      projectFormState.screenshot1,
      projectFormState.screenshot2,
    ]
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 2);

    if (projectModalType === "add") {
      try {
        const res = await apiFetch<{ data: BackendProject }>("/projects", {
          method: "POST",
          body: JSON.stringify({
            title: projectFormState.name,
            stack: projectFormState.stack,
            platform: projectFormState.platform || "GitHub",
            status: projectFormState.status,
            views: Number(projectFormState.views) || 0,
            likes: Number(projectFormState.likes) || 0,
            stars: Number(projectFormState.stars) || 0,
            description: projectFormState.description,
            demoUrl: projectFormState.demoUrl,
            githubUrl: projectFormState.githubUrl,
            architectureDetails: projectFormState.architectureDetails,
            challengesSolved: projectFormState.challengesSolved,
            screenshots,
          }),
        });

        const pData = res.data;
        const newProj: Project = {
          id: pData.id ? pData.id.toString() : `#${Date.now()}`,
          name: pData.title || projectFormState.name,
          creator: "Developer",
          stack: Array.isArray(pData.tech_stack)
            ? pData.tech_stack.join(", ")
            : projectFormState.stack || "",
          platform: pData.platform || projectFormState.platform || "GitHub",
          date: pData.created_at
            ? new Date(pData.created_at).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : new Date().toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
          status:
            (pData.status as "Live" | "In Progress" | "Archived") ||
            projectFormState.status ||
            "Live",
          statusColor:
            statusColorsMap[pData.status || projectFormState.status] ||
            "#005c58",
          views: Number(pData.views) || 0,
          likes: Number(pData.likes) || 0,
          stars: Number(pData.stars) || 0,
          description: pData.description || projectFormState.description,
          demoUrl: pData.demo_url || projectFormState.demoUrl,
          githubUrl: pData.github_url || projectFormState.githubUrl,
          architectureDetails:
            pData.architecture_details || projectFormState.architectureDetails,
          challengesSolved:
            pData.challenges_solved || projectFormState.challengesSolved,
          screenshots: pData.screenshots || screenshots,
        };

        setProjectsList([newProj, ...projectsList]);
        setDevStats((prev: typeof initialDevStats) => ({
          ...prev,
          projects: prev.projects + 1,
          liveProjects:
            (pData.status || projectFormState.status) === "Live"
              ? prev.liveProjects + 1
              : prev.liveProjects,
        }));
      } catch (err: unknown) {
        console.error("Failed to create project:", err);
      }
    } else if (projectModalType === "edit" && editingProjectId) {
      try {
        const res = await apiFetch<{ data: BackendProject }>(
          `/projects/${editingProjectId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              title: projectFormState.name,
              stack: projectFormState.stack,
              platform: projectFormState.platform,
              status: projectFormState.status,
              views: Number(projectFormState.views),
              likes: Number(projectFormState.likes),
              stars: Number(projectFormState.stars),
              description: projectFormState.description,
              demoUrl: projectFormState.demoUrl,
              githubUrl: projectFormState.githubUrl,
              architectureDetails: projectFormState.architectureDetails,
              challengesSolved: projectFormState.challengesSolved,
              screenshots,
            }),
          },
        );

        const pData = res.data;
        setProjectsList(
          projectsList.map((p) =>
            p.id === editingProjectId
              ? {
                  ...p,
                  name: pData?.title || projectFormState.name,
                  stack: Array.isArray(pData?.tech_stack)
                    ? pData.tech_stack.join(", ")
                    : projectFormState.stack,
                  platform: pData?.platform || projectFormState.platform,
                  status: pData?.status || projectFormState.status,
                  statusColor:
                    statusColorsMap[pData?.status || projectFormState.status] ||
                    p.statusColor,
                  views: Number(pData?.views ?? projectFormState.views),
                  likes: Number(pData?.likes ?? projectFormState.likes),
                  stars: Number(pData?.stars ?? projectFormState.stars),
                  description:
                    pData?.description ?? projectFormState.description,
                  demoUrl: pData?.demo_url ?? projectFormState.demoUrl,
                  githubUrl: pData?.github_url ?? projectFormState.githubUrl,
                  architectureDetails:
                    pData?.architecture_details ??
                    projectFormState.architectureDetails,
                  challengesSolved:
                    pData?.challenges_solved ??
                    projectFormState.challengesSolved,
                  screenshots: pData?.screenshots ?? screenshots,
                }
              : p,
          ),
        );
      } catch (err: unknown) {
        console.error("Failed to update project:", err);
      }
    }
    setProjectModalType(null);
    setEditingProjectId(null);
    setSelectedProject(null);
  };

  const handleInlineSave = async () => {
    if (!projectFormState.name.trim() || !editingProjectId) return;

    const statusColorsMap: Record<string, string> = {
      Live: "#005c58",
      "In Progress": "#f59e0b",
      Archived: "#ef4444",
    };

    try {
      const res = await apiFetch<{ data: BackendProject }>(
        `/projects/${editingProjectId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: projectFormState.name,
            stack: projectFormState.stack,
            platform: projectFormState.platform,
            status: projectFormState.status,
            views: Number(projectFormState.views),
            likes: Number(projectFormState.likes),
            stars: Number(projectFormState.stars),
          }),
        },
      );

      const pData = res.data;
      setProjectsList(
        projectsList.map((p) =>
          p.id === editingProjectId
            ? {
                ...p,
                name: pData?.title || projectFormState.name,
                stack: Array.isArray(pData?.tech_stack)
                  ? pData.tech_stack.join(", ")
                  : projectFormState.stack,
                platform: pData?.platform || projectFormState.platform,
                status: pData?.status || projectFormState.status,
                statusColor:
                  statusColorsMap[pData?.status || projectFormState.status] ||
                  p.statusColor,
                views: Number(pData?.views ?? projectFormState.views),
                likes: Number(pData?.likes ?? projectFormState.likes),
                stars: Number(pData?.stars ?? projectFormState.stars),
              }
            : p,
        ),
      );
    } catch (err: unknown) {
      console.error("Failed to update project:", err);
    } finally {
      setEditingProjectId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProject) {
      try {
        await apiFetch(`/projects/${selectedProject.id}`, {
          method: "DELETE",
        });

        setProjectsList(
          projectsList.filter((p) => p.id !== selectedProject.id),
        );
        setDevStats((prev: typeof initialDevStats) => ({
          ...prev,
          projects: Math.max(0, prev.projects - 1),
          liveProjects:
            selectedProject.status === "Live"
              ? Math.max(0, prev.liveProjects - 1)
              : prev.liveProjects,
        }));
      } catch (err: unknown) {
        console.error("Failed to delete project:", err);
      }
    }
    setProjectModalType(null);
    setSelectedProject(null);
  };

  const [activeTab, setActiveTab] = useState("All");
  const [hoveredBar, setHoveredBar] = useState<{
    month: string;
    commits: number;
  } | null>(null);
  const [activeActivityToggle, setActiveActivityToggle] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Weekly");
  const [showHours, setShowHours] = useState(true);
  const [showCommits, setShowCommits] = useState(true);
  const [dailyActivityList, setDailyActivityList] = useState(dailyActivityData);
  const [weeklyActivityList, setWeeklyActivityList] =
    useState(weeklyActivityData);
  const [monthlyActivityList, setMonthlyActivityList] =
    useState(monthlyActivityData);
  const [yearlyActivityList, setYearlyActivityList] =
    useState(yearlyActivityData);
  const [activityTotals, setActivityTotals] = useState({
    totalHours: 34,
    totalCommits: 87,
    totalProblems: 42,
    newRepos: 2,
  });

  const [sortField, setSortField] = useState<
    "name" | "views" | "likes" | "stars" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [todayGoals, setTodayGoals] = useState([
    { l: "Complete 2 Problems", done: true },
    { l: "Push 3 Commits", done: true },
    { l: "Study Docker", done: false },
    { l: "Finish Resume Update", done: false },
  ]);

  const [checklist, setChecklist] = useState(initialRecruiterChecklist);

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "coach"; text: string }>
  >([
    {
      sender: "coach",
      text: "Welcome Yatharth. Ask me anything about your resume, portfolio matching, or target companies like Google!",
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dradix_notifications");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return initialNotifications;
  });

  useEffect(() => {
    if (!localStorage.getItem("dradix_notifications")) {
      localStorage.setItem(
        "dradix_notifications",
        JSON.stringify(initialNotifications),
      );
    }

    const handleStorageChange = () => {
      const savedNotifs = localStorage.getItem("dradix_notifications");
      if (savedNotifs) {
        try {
          setNotifications(JSON.parse(savedNotifs));
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setDashboardError(null);
      try {
        let response;
        try {
          response = await apiFetch<{ data: DashboardResponseData }>(
            "/dashboard",
          );
        } catch (err: unknown) {
          const msg = (err as Error)?.message || "";
          if (msg.includes("Not Found") || msg.includes("404")) {
            response = await apiFetch<{ data: DashboardResponseData }>(
              "/users/dashboard",
            );
          } else {
            throw err;
          }
        }
        if (response && response.data) {
          const data = response.data;

          if (data.profile) {
            setDevStats({
              score: data.developer_score || 0,
              contributions: data.github?.total_commits || 0,
              problemsSolved:
                data.coding_profiles?.reduce(
                  (acc, curr) => acc + (curr.problems_solved || 0),
                  0,
                ) || 0,
              streak: 42,
              projects: data.projects?.length || 0,
              liveProjects: data.projects?.length || 0,
              repositories: 52,
              publicRepos: 12,
              followers: 624,
              stars: data.github?.stars_earned || 0,
              pullRequests: data.github?.total_prs || 0,
              issuesClosed: data.github?.total_issues || 0,
              hackathons: 8,
              wins: 2,
              certificates: data.achievements?.length || 0,
            });

            const rawData = data as Record<string, unknown>;
            const fetchedAtsScore =
              typeof data.profile.ats_score === "number"
                ? data.profile.ats_score
                : typeof rawData.ats_score === "number"
                  ? (rawData.ats_score as number)
                  : null;

            if (fetchedAtsScore !== null && !isNaN(fetchedAtsScore)) {
              setAtsScore(fetchedAtsScore);
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "dradix_ats_score",
                  String(fetchedAtsScore),
                );
              }
            }

            if (data.profile.ats_report) {
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "dradix_ats_report",
                  typeof data.profile.ats_report === "string"
                    ? data.profile.ats_report
                    : JSON.stringify(data.profile.ats_report),
                );
              }
            }
          }

          if (data.github) {
            const monthlyList =
              data.github.monthly_commits ||
              data.github.contribution_graph?.monthlyCommits;

            if (Array.isArray(monthlyList) && monthlyList.length > 0) {
              setVelocityData(monthlyList);
              const currM = new Date().toLocaleDateString("en-US", {
                month: "short",
              });
              if (monthlyList.some((m) => m.month === currM)) {
                setSelectedVelocityMonth(currM);
              }
            } else if (data.github.contribution_graph?.dailyContributions) {
              const daily = data.github.contribution_graph.dailyContributions;
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              const sums: Record<string, number> = {};
              Object.entries(daily).forEach(([dStr, count]) => {
                const d = new Date(dStr);
                if (!isNaN(d.getTime())) {
                  const m = monthNames[d.getMonth()];
                  sums[m] = (sums[m] || 0) + Number(count);
                }
              });
              const built = monthNames.map((m) => ({
                month: m,
                commits: sums[m] || 0,
              }));
              setVelocityData(built);
            }

            if (data.github.contribution_graph?.dailyContributions) {
              const daily = data.github.contribution_graph.dailyContributions;
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              const dayNames = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ];

              const today = new Date();
              const builtDailyList = [];
              for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dateStr = d.toISOString().split("T")[0];
                const dayLabel = dayNames[d.getDay()];
                const commits = Number(daily[dateStr] || 0);
                const hours =
                  commits > 0 ? Number((commits * 0.45 + 0.5).toFixed(1)) : 0;
                const problems = Math.round(commits * 0.35);

                builtDailyList.push({
                  day: dayLabel,
                  commits,
                  hours,
                  problems,
                });
              }
              setDailyActivityList(builtDailyList);

              const builtWeeklyList = [
                { day: "Week 1", commits: 0, hours: 0, problems: 0 },
                { day: "Week 2", commits: 0, hours: 0, problems: 0 },
                { day: "Week 3", commits: 0, hours: 0, problems: 0 },
                { day: "Week 4", commits: 0, hours: 0, problems: 0 },
              ];
              for (let i = 0; i < 28; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() - (27 - i));
                const dateStr = d.toISOString().split("T")[0];
                const commits = Number(daily[dateStr] || 0);
                const weekIdx = Math.floor(i / 7);
                if (builtWeeklyList[weekIdx]) {
                  builtWeeklyList[weekIdx].commits += commits;
                }
              }
              builtWeeklyList.forEach((w) => {
                w.hours =
                  w.commits > 0
                    ? Number(
                        (w.commits * 0.42 + (w.commits > 8 ? 2 : 0.5)).toFixed(
                          1,
                        ),
                      )
                    : 0;
                w.problems = Math.round(w.commits * 0.35);
              });
              setWeeklyActivityList(builtWeeklyList);

              const monthSums: Record<string, number> = {};
              Object.entries(daily).forEach(([dStr, count]) => {
                const d = new Date(dStr);
                if (!isNaN(d.getTime())) {
                  const m = monthNames[d.getMonth()];
                  monthSums[m] = (monthSums[m] || 0) + Number(count);
                }
              });

              const builtMonthlyList = monthNames.map((m) => {
                const commits = monthSums[m] || 0;
                const hours =
                  commits > 0 ? Number((commits * 0.45).toFixed(1)) : 0;
                const problems = Math.round(commits * 0.35);
                return { day: m, commits, hours, problems };
              });
              setMonthlyActivityList(builtMonthlyList);

              const quarterDefs = [
                { day: "Q1", months: ["Jan", "Feb", "Mar"] },
                { day: "Q2", months: ["Apr", "May", "Jun"] },
                { day: "Q3", months: ["Jul", "Aug", "Sep"] },
                { day: "Q4", months: ["Oct", "Nov", "Dec"] },
              ];
              const builtYearlyList = quarterDefs.map((q) => {
                let commits = 0;
                q.months.forEach((m) => {
                  commits += monthSums[m] || 0;
                });
                const hours =
                  commits > 0 ? Number((commits * 0.45).toFixed(1)) : 0;
                const problems = Math.round(commits * 0.35);
                return { day: q.day, commits, hours, problems };
              });
              setYearlyActivityList(builtYearlyList);

              const totalCommitsSum =
                data.github.total_commits ||
                Object.values(daily).reduce((a, b) => a + Number(b), 0);
              const totalHoursSum = Math.round(totalCommitsSum * 0.45) || 34;
              const totalProblemsSum =
                data.coding_profiles?.reduce(
                  (acc, p) => acc + (p.problems_solved || 0),
                  0,
                ) || 42;

              setActivityTotals({
                totalHours: totalHoursSum,
                totalCommits: totalCommitsSum,
                totalProblems: totalProblemsSum,
                newRepos: data.projects?.length || 2,
              });
            }

            const DEFAULT_LANG_COLORS: Record<string, string> = {
              TypeScript: "#3b82f6",
              JavaScript: "#f7df1e",
              Python: "#f59e0b",
              Rust: "#f43f5e",
              Go: "#005c58",
              Java: "#b07219",
              "C++": "#f34b7d",
              C: "#555555",
              HTML: "#e34c26",
              CSS: "#563d7c",
              PHP: "#4f5d95",
              Ruby: "#701516",
              Swift: "#ffac45",
              Kotlin: "#A97BFF",
              Shell: "#89e051",
            };
            const FALLBACK_COLORS = [
              "#3b82f6",
              "#f59e0b",
              "#f43f5e",
              "#005c58",
              "#a855f7",
              "#ec4899",
              "#14b8a6",
            ];

            const counts: Record<string, number> = {};
            if (
              data.github?.languages_used &&
              Object.keys(data.github.languages_used).length > 0
            ) {
              Object.entries(data.github.languages_used).forEach(
                ([lang, count]) => {
                  if (lang && typeof count === "number" && count > 0) {
                    counts[lang] = (counts[lang] || 0) + count;
                  }
                },
              );
            }

            if (
              Object.keys(counts).length === 0 &&
              data.projects &&
              data.projects.length > 0
            ) {
              data.projects.forEach((p) => {
                let stackList: string[] = [];
                if (Array.isArray(p.tech_stack)) {
                  stackList = p.tech_stack;
                } else if (typeof p.tech_stack === "string") {
                  stackList = (p.tech_stack as string)
                    .split(",")
                    .map((s: string) => s.trim());
                }
                stackList.forEach((s: string) => {
                  if (s) counts[s] = (counts[s] || 0) + 1;
                });
              });
            }

            const langEntries = Object.entries(counts);
            if (langEntries.length > 0) {
              const total = langEntries.reduce((acc, [, c]) => acc + c, 0);
              const sorted = langEntries
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4);
              const builtLangs = sorted.map(([name, count], idx) => ({
                name,
                value: Math.round((count / total) * 100),
                color:
                  DEFAULT_LANG_COLORS[name] ||
                  FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
              }));
              setLanguagesList(builtLangs);
            }
          }

          if (data.projects && data.projects.length > 0) {
            const statusColorsMap: Record<string, string> = {
              Live: "#005c58",
              "In Progress": "#f59e0b",
              Archived: "#ef4444",
            };
            const mappedProjects = data.projects.map((proj) => ({
              id: proj.id.toString(),
              name: proj.name || proj.title || "",
              creator:
                `${data.profile?.first_name || ""} ${data.profile?.last_name || ""}`.trim() ||
                data.profile?.username ||
                "",
              stack: Array.isArray(proj.tech_stack)
                ? proj.tech_stack.join(", ")
                : proj.tech_stack || "",
              platform: proj.platform || "GitHub",
              date: proj.created_at
                ? new Date(proj.created_at).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "",
              status:
                (proj.status as "Live" | "In Progress" | "Archived") || "Live",
              statusColor: statusColorsMap[proj.status || "Live"] || "#005c58",
              views: Number(proj.views) || 0,
              likes: Number(proj.likes) || 0,
              stars: Number(proj.stars) || 0,
              description: proj.description || "",
              demoUrl: proj.demo_url || "",
              githubUrl: proj.github_url || "",
              architectureDetails: proj.architecture_details || "",
              challengesSolved: proj.challenges_solved || "",
              screenshots: proj.screenshots || [],
            }));
            setProjectsList(mappedProjects);
          }

          if (data.coding_profiles && data.coding_profiles.length > 0) {
            const mappedPlatforms = data.coding_profiles.map((cp) => {
              const platformName =
                cp.platform.charAt(0).toUpperCase() + cp.platform.slice(1);
              let color = "#3b82f6";
              let logo =
                "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/leetcode.svg";
              const lower = cp.platform.toLowerCase();
              if (lower === "leetcode") {
                color = "#f59e0b";
                logo =
                  "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/leetcode.svg";
              } else if (lower === "codeforces") {
                color = "#3b82f6";
                logo =
                  "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codeforces.svg";
              } else if (lower === "hackerrank") {
                color = "#2ec4b6";
                logo =
                  "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hackerrank.svg";
              } else if (lower === "codechef") {
                color = "#5b4638";
                logo =
                  "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codechef.svg";
              } else if (lower === "geeksforgeeks") {
                color = "#2f9d58";
                logo =
                  "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/geeksforgeeks.svg";
              }
              const effectiveRating =
                cp.rating && cp.rating > 0 ? cp.rating : cp.global_ranking || 0;
              const formattedRank = cp.global_ranking
                ? `#${Number(cp.global_ranking).toLocaleString()}`
                : "Member";
              return {
                name: platformName,
                rating: effectiveRating,
                rank: formattedRank,
                solved: cp.problems_solved || 0,
                color,
                streak: 10,
                history: [1, 2, 1, 3, 2],
                logo,
              };
            });
            setPlatformsList(mappedPlatforms);
          }

          if (data.recruiterChecklist) {
            setChecklist(data.recruiterChecklist);
          }

          if (data.timeline && data.timeline.length > 0) {
            setTimeline(data.timeline);
          }

          if (data.notifications && data.notifications.length > 0) {
            setNotifications(data.notifications);
          }

          if (data.careerRings) {
            setRings(data.careerRings);
          }

          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                "dradix_dashboard_data",
                JSON.stringify({
                  timeline: data.timeline || [],
                  rings: data.careerRings || [],
                  projectsList: data.projects || [],
                }),
              );
            } catch {}
          }
        }
      } catch (err) {
        console.error("Failed to load aggregated dashboard data:", err);
        setDashboardError(
          (err as Error)?.message || "Failed to load dashboard data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSort = (field: "name" | "views" | "likes" | "stars") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleGoal = (index: number) => {
    setTodayGoals((prev) =>
      prev.map((g, idx) => (idx === index ? { ...g, done: !g.done } : g)),
    );
  };

  const toggleChecklistItem = (index: number) => {
    setChecklist((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, done: !c.done } : c)),
    );
  };

  const handleAskCoach = (query: string) => {
    if (!query.trim()) return;
    const userMessage = { sender: "user" as const, text: query };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    setTimeout(() => {
      let reply = "";
      if (query.toLowerCase().includes("resume")) {
        reply =
          "Based on my analysis of your GitHub profile, you should highlight Next.js and TypeScript on your resume. Your resume score is currently 82%. Adding System Design details will help hit 90%.";
      } else if (query.toLowerCase().includes("project")) {
        reply =
          "I recommend building a backend caching utility in Rust or Go (e.g., a Redis-like storage client) to strengthen your full-stack balance.";
      } else {
        reply =
          "To prepare for Google, focus on Graph algorithms on LeetCode and practice scaling system architectures (sharding & caching pipelines).";
      }
      setMessages((prev) => [...prev, { sender: "coach", text: reply }]);
    }, 600);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await apiFetch("/coding-profiles/sync", { method: "POST" });
      let res;
      try {
        res = await apiFetch<{ data: DashboardResponseData }>("/dashboard");
      } catch {
        res = await apiFetch<{ data: DashboardResponseData }>(
          "/users/dashboard",
        );
      }
      if (res && res.data) {
        const data = res.data;
        if (data.github) {
          setDevStats((prev: typeof initialDevStats) => ({
            ...prev,
            contributions: data.github?.total_commits || prev.contributions,
            stars: data.github?.stars_earned || prev.stars,
            pullRequests: data.github?.total_prs || prev.pullRequests,
            issuesClosed: data.github?.total_issues || prev.issuesClosed,
          }));
          const monthlyList =
            data.github.monthly_commits ||
            data.github.contribution_graph?.monthlyCommits;
          if (Array.isArray(monthlyList) && monthlyList.length > 0) {
            setVelocityData(monthlyList);
          }
        }
        if (data.coding_profiles && data.coding_profiles.length > 0) {
          const mappedPlatforms = data.coding_profiles.map((cp) => {
            const platformName =
              cp.platform.charAt(0).toUpperCase() + cp.platform.slice(1);
            let color = "#3b82f6";
            let logo =
              "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/leetcode.svg";
            const lower = cp.platform.toLowerCase();
            if (lower === "leetcode") {
              color = "#f59e0b";
              logo =
                "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/leetcode.svg";
            } else if (lower === "codeforces") {
              color = "#3b82f6";
              logo =
                "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codeforces.svg";
            } else if (lower === "hackerrank") {
              color = "#2ec4b6";
              logo =
                "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hackerrank.svg";
            } else if (lower === "codechef") {
              color = "#5b4638";
              logo =
                "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codechef.svg";
            } else if (lower === "geeksforgeeks") {
              color = "#2f9d58";
              logo =
                "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/geeksforgeeks.svg";
            }
            const effectiveRating =
              cp.rating && cp.rating > 0 ? cp.rating : cp.global_ranking || 0;
            const formattedRank = cp.global_ranking
              ? `#${Number(cp.global_ranking).toLocaleString()}`
              : "Member";
            return {
              name: platformName,
              rating: effectiveRating,
              rank: formattedRank,
              solved: cp.problems_solved || 0,
              color,
              streak: 10,
              history: [1, 2, 1, 3, 2],
              logo,
            };
          });
          setPlatformsList(mappedPlatforms);
        }
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    localStorage.setItem("dradix_notifications", JSON.stringify([]));
    window.dispatchEvent(new Event("storage"));
  };

  const goalsDone = todayGoals.filter((g) => g.done).length;
  const goalsPct = Math.round((goalsDone / todayGoals.length) * 100);

  const recruiterDone = checklist.filter((c) => c.done).length;
  const recruiterPct = Math.round((recruiterDone / checklist.length) * 100);
  const missingItems = checklist
    .filter((c) => !c.done)
    .map((c) => `No ${c.label.split(" ")[0]}`);

  const sortedProjects = [...projectsList]
    .filter((p) => activeTab === "All" || p.status === activeTab)
    .sort((a, b) => {
      if (!sortField) return 0;
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      return sortDirection === "asc"
        ? (fieldA as number) - (fieldB as number)
        : (fieldB as number) - (a[sortField] as number);
    });

  if (isLoading) {
    return (
      <VideoLoaderBackground className="min-h-[calc(100vh-140px)] rounded-3xl py-20 my-auto">
        <Loader />
      </VideoLoaderBackground>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
          <div
            id="overview"
            className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-black tracking-tight">
                Performance Overview
              </h2>
              {dashboardError && (
                <ErrorQuestionTooltip message={dashboardError} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                    Dev Score
                  </p>
                  <DevScoreTooltip />
                </div>
                <p className="text-[18px] font-black text-black mt-1">
                  {devStats.score}
                </p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                    ATS Score
                  </p>
                </div>
                <p className="text-[18px] font-black text-black mt-1">
                  {atsScore}%
                </p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                  Contributions
                </p>
                <p className="text-[18px] font-black text-black mt-1">
                  {devStats.contributions}
                </p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                  Problems
                </p>
                <p className="text-[18px] font-black text-black mt-1">
                  {devStats.problemsSolved}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-zinc-600">
                    YK
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-bold text-black">
                    Yatharth K.
                  </p>
                  <p className="text-[10px] text-zinc-400">Top Developer</p>
                </div>
              </div>
              <div className="bg-[#003c3a]/15 text-[#005c58] text-[10px] font-black px-2 py-1 rounded-md">
                9.2 Rating
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full bg-white rounded-xl p-3 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
                <span className="text-[12px] font-semibold text-zinc-700">
                  {devStats.projects} Projects ({devStats.liveProjects} Live)
                </span>
                <ChevronRightIcon className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="w-full bg-white rounded-xl p-3 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
                <span className="text-[12px] font-semibold text-zinc-700">
                  {devStats.repositories} Repos ({devStats.publicRepos} Public)
                </span>
                <ChevronRightIcon className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>

          <div
            id="recruiter"
            className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4"
          >
            <h2 className="text-[16px] font-bold text-black tracking-tight">
              Recruiter Readiness
            </h2>
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => toggleChecklistItem(idx)}
                  className="w-full text-left bg-white rounded-xl p-3 flex items-center gap-2.5 cursor-pointer hover:bg-zinc-50 transition-colors"
                >
                  {item.done ? (
                    <CheckCircledIcon className="w-4 h-4 text-[#005c58]" />
                  ) : (
                    <CrossCircledIcon className="w-4 h-4 text-[#ef4444]" />
                  )}
                  <span
                    className={`text-[12px] font-semibold ${item.done ? "text-zinc-700" : "text-zinc-400"}`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl p-3.5 space-y-2 text-left">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">
                Missing Items
              </p>
              <div className="flex flex-wrap gap-1.5">
                {missingItems.length > 0 ? (
                  missingItems.map((m, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-bold text-zinc-600 bg-zinc-100 rounded px-2 py-0.5"
                    >
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] font-bold text-[#005c58]">
                    All Green! Ready to Hire
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">
                  Completion
                </span>
                <span className="text-[12px] font-black text-[#005c58]">
                  {recruiterPct}% Ready
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="btn-candy flex-1 py-2 bg-zinc-900 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer">
                  Improve Profile
                </button>
              </div>
            </div>
          </div>

          <div
            id="ai-coach"
            className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4"
          >
            <h2 className="text-[16px] font-bold text-black tracking-tight">
              AI Career Coach
            </h2>

            <MessageScrollerProvider
              autoScroll={true}
              defaultScrollPosition="end"
            >
              <MessageScroller className="bg-white rounded-xl p-3 h-48 text-[11px] relative">
                <MessageScrollerViewport className="scrollbar-thin">
                  <MessageScrollerContent className="gap-2.5">
                    {messages.map((m, idx) => (
                      <MessageScrollerItem
                        key={idx}
                        messageId={`msg-${idx}`}
                        scrollAnchor={idx === messages.length - 1}
                        className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <span className="text-[9px] text-zinc-400 font-bold mb-0.5">
                          {m.sender === "user" ? "You" : "Coach"}
                        </span>
                        <p
                          className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${m.sender === "user" ? "bg-black text-white rounded-tr-none" : "bg-zinc-100 text-zinc-800 rounded-tl-none"}`}
                        >
                          {m.text}
                        </p>
                      </MessageScrollerItem>
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>

            <div className="space-y-1.5">
              <button
                onClick={() => handleAskCoach("How can I improve my resume?")}
                className="w-full text-left bg-white rounded-lg p-2 text-[10px] text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                How can I improve my resume?
              </button>
              <button
                onClick={() =>
                  handleAskCoach("What project should I build next?")
                }
                className="w-full text-left bg-white rounded-lg p-2 text-[10px] text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                What project should I build next?
              </button>
            </div>

            <div className="bg-white rounded-xl p-3 flex items-center justify-between border border-zinc-100">
              <input
                type="text"
                placeholder="Ask anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAskCoach(chatInput)
                }
                className="bg-transparent text-[12px] text-zinc-800 placeholder:text-zinc-400 outline-none w-full pr-2"
              />
              <button
                onClick={() => handleAskCoach(chatInput)}
                className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center hover:bg-zinc-800 shrink-0"
              >
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-[#e6edde] rounded-[24px] p-5 space-y-4 flex flex-col items-center text-center">
            <div className="w-full max-w-40 aspect-square relative flex items-center justify-center bg-white/40 rounded-2xl p-4">
              <svg
                viewBox="0 0 24 24"
                className="w-16 h-16 text-[#4d6a34]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v1.5H3v-1.5M9 7.5h6M9 10.5h3"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] font-black text-[#2e421e] leading-tight">
                Developer on the run
              </h3>
              <p className="text-[12px] text-[#4d6a34] mt-2 leading-relaxed font-semibold">
                Expedite your development workflow with AI-powered analytics.
              </p>
            </div>
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="btn-candy w-full py-3 bg-linear-to-b from-zinc-900 via-zinc-950 to-black text-white border border-zinc-800 rounded-xl text-[12px] font-bold disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSyncing && <UpdateIcon className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {isSyncing ? "Syncing Workspace..." : "Sync all accounts"}
              </span>
            </button>
          </div>

          <div className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-3.5">
            <h2 className="text-[16px] font-bold text-black tracking-tight">
              Public Profile
            </h2>
            <div className="bg-white rounded-xl p-3 font-mono text-[11px] text-zinc-500 truncate">
              dradix.dev/yatharth
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-bold text-zinc-700">
              <button className="btn-candy bg-white rounded-lg py-2 border border-zinc-200 text-zinc-800 font-bold shadow-2xs cursor-pointer">
                Open Profile
              </button>
              <button className="btn-candy bg-white rounded-lg py-2 border border-zinc-200 text-zinc-800 font-bold shadow-2xs cursor-pointer">
                Share Link
              </button>
              <button className="btn-candy bg-white rounded-lg py-2 border border-zinc-200 text-zinc-800 font-bold shadow-2xs cursor-pointer">
                Copy Link
              </button>
              <button className="btn-candy bg-white rounded-lg py-2 border border-zinc-200 text-zinc-800 font-bold shadow-2xs cursor-pointer">
                Download CV
              </button>
            </div>
            <button className="btn-candy w-full bg-white rounded-lg py-2 border border-zinc-200 text-[11px] font-bold text-zinc-800 shadow-2xs cursor-pointer">
              Generate Profile QR Code
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-6">
            <div className="bg-[#18181b] text-white rounded-[28px] p-6 lg:p-8 grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-2">
                      Coding Velocity
                    </h3>
                    <motion.p
                      key={selectedVelocityMonth}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] text-zinc-400 mt-0.5 font-medium"
                    >
                      <span className="text-white font-extrabold">
                        {velocityData.find(
                          (d) => d.month === selectedVelocityMonth,
                        )?.commits || 0}{" "}
                        commits
                      </span>{" "}
                      in {selectedVelocityMonth}
                    </motion.p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSyncAll}
                      disabled={isSyncing}
                      className="btn-candy flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-b from-[#27272a] to-[#18181b] border border-zinc-700/60 text-[10px] font-semibold text-zinc-100 cursor-pointer"
                      title="Sync Velocity & Profiles"
                    >
                      <UpdateIcon
                        className={`w-2.5 h-2.5 ${isSyncing ? "animate-spin text-emerald-400" : "text-zinc-300"}`}
                      />
                      <span>{isSyncing ? "Syncing..." : "Sync Velocity"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-1.5 text-[11px] overflow-x-auto pb-1.5 pt-1 scrollbar-none relative">
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((m) => {
                    const isSelected = selectedVelocityMonth === m;
                    const monthCommits =
                      velocityData.find((d) => d.month === m)?.commits || 0;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedVelocityMonth(m)}
                        className={`relative px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0 transition-colors ${
                          isSelected
                            ? "text-white font-extrabold"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                        }`}
                        title={`${m}: ${monthCommits} commits`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeVelocityMonthPill"
                            className="absolute inset-0 bg-[#005c58] rounded-lg shadow-md z-0"
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 32,
                            }}
                          />
                        )}
                        <span className="relative z-10">{m}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="h-44 relative mt-3 flex flex-col justify-between pt-6 pb-1">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                    <div className="border-b border-zinc-700 w-full" />
                    <div className="border-b border-zinc-700 w-full" />
                    <div className="border-b border-zinc-700 w-full" />
                  </div>

                  {(() => {
                    const totalCommits = velocityData.reduce(
                      (acc, curr) => acc + curr.commits,
                      0,
                    );
                    const avgCommits =
                      velocityData.length > 0
                        ? Math.round(totalCommits / velocityData.length)
                        : 0;
                    const maxCommits = Math.max(
                      ...velocityData.map((d) => d.commits),
                      1,
                    );
                    const avgPercent = Math.min(
                      90,
                      Math.max(15, Math.round((avgCommits / maxCommits) * 100)),
                    );

                    return (
                      <div
                        onMouseEnter={() => setIsAvgHovered(true)}
                        onMouseLeave={() => setIsAvgHovered(false)}
                        style={{ bottom: `${avgPercent}%` }}
                        className="absolute left-0 right-0 z-20 group cursor-pointer flex items-center"
                      >
                        <div className="absolute -top-3 -bottom-3 inset-x-0 z-10" />

                        <div className="w-full border-b-2 border-dashed border-[#003c3a] opacity-90" />

                        <AnimatePresence>
                          {isAvgHovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 3, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 3, scale: 0.96 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-1/2 -translate-x-1/2 -top-8 z-40 bg-[#18181b] border border-zinc-800 text-white px-2 py-0.5 rounded-md shadow-md text-[9px] font-medium whitespace-nowrap pointer-events-none flex items-center gap-1.5"
                            >
                              <span className="text-zinc-400">
                                Avg Monthly Commits:
                              </span>
                              <span className="text-emerald-400 font-bold">
                                {avgCommits}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })()}

                  <div className="relative w-full h-36 flex items-end justify-between px-1 z-10 gap-1.5">
                    {(() => {
                      const maxCommits = Math.max(
                        ...velocityData.map((d) => d.commits),
                        1,
                      );
                      return velocityData.map((entry) => {
                        const isSelected =
                          selectedVelocityMonth === entry.month;
                        const isHovered = hoveredBar?.month === entry.month;
                        const isActiveBar =
                          isHovered || (isSelected && !hoveredBar);
                        const heightPercent = Math.max(
                          12,
                          Math.round((entry.commits / maxCommits) * 100),
                        );

                        return (
                          <div
                            key={entry.month}
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              setSelectedVelocityMonth(entry.month)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedVelocityMonth(entry.month);
                              }
                            }}
                            onMouseEnter={() => setHoveredBar(entry)}
                            onMouseLeave={() => setHoveredBar(null)}
                            className="flex-1 h-full flex flex-col items-center justify-end relative cursor-pointer group focus:outline-none"
                          >
                            {isActiveBar && (
                              <motion.div
                                layoutId="floatingVelocityBadge"
                                className="absolute -top-7 z-30 bg-[#18181b] border border-emerald-500/40 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xl whitespace-nowrap pointer-events-none"
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 26,
                                }}
                              >
                                <span className="text-emerald-400 font-bold">
                                  {entry.commits}
                                </span>{" "}
                                commits
                              </motion.div>
                            )}

                            {isActiveBar && (
                              <motion.div
                                layoutId="glowingVelocityBeam"
                                className="absolute inset-x-0 bottom-0 top-0 bg-emerald-500/15 rounded-t-lg z-0 pointer-events-none"
                                transition={{
                                  type: "spring",
                                  stiffness: 350,
                                  damping: 26,
                                }}
                              />
                            )}

                            <motion.div
                              className="w-full rounded-t-md relative z-10 overflow-hidden"
                              initial={false}
                              animate={{
                                height: `${heightPercent}%`,
                                scaleY: isSelected || isHovered ? 1.04 : 1,
                                boxShadow:
                                  isSelected || isHovered
                                    ? "0px 0px 18px rgba(0, 229, 191, 0.35)"
                                    : "0px 0px 0px rgba(0, 0, 0, 0)",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 25,
                              }}
                            >
                              {/* Inactive Base Gradient Layer */}
                              <motion.div
                                className="absolute inset-0 bg-linear-to-t from-[#18181b] to-[#27272a]"
                                initial={false}
                                animate={{
                                  opacity: isSelected || isHovered ? 0 : 1,
                                }}
                                transition={{
                                  duration: 0.35,
                                  ease: [0.4, 0, 0.2, 1],
                                }}
                              />

                              {/* Active Vibrant Gradient Layer */}
                              <motion.div
                                className="absolute inset-0 bg-linear-to-t from-[#005c58] to-[#00e5bf]"
                                initial={false}
                                animate={{
                                  opacity: isSelected || isHovered ? 1 : 0,
                                }}
                                transition={{
                                  duration: 0.35,
                                  ease: [0.4, 0, 0.2, 1],
                                }}
                              />

                              {/* Diagonal Masked Lines Overlay Layer */}
                              <motion.div
                                className="absolute inset-0 pointer-events-none"
                                initial={false}
                                animate={{
                                  opacity: isSelected || isHovered ? 0 : 0.85,
                                }}
                                transition={{
                                  duration: 0.35,
                                  ease: [0.4, 0, 0.2, 1],
                                }}
                                style={{
                                  backgroundImage: `repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.4) 0px, rgba(255, 255, 255, 0.4) 1.5px, transparent 1.5px, transparent 7px)`,
                                  maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)`,
                                  WebkitMaskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)`,
                                }}
                              />
                            </motion.div>

                            <span
                              className={`text-[10px] mt-1.5 transition-colors font-medium ${
                                isSelected
                                  ? "text-emerald-400 font-bold"
                                  : "text-zinc-500 group-hover:text-zinc-300"
                              }`}
                            >
                              {entry.month}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4 border-t md:border-t-0 md:border-l border-[#27272a] pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-white tracking-tight">
                    Profile Traffic
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button className="w-8 h-8 rounded-lg bg-[#27272a] flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-zinc-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-[#27272a] flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-zinc-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-white">716,084</p>
                  <span className="text-[10px] text-[#005c58] bg-[#003c3a]/15 rounded-md px-1.5 py-0.5">
                    32.2% ↑ Views
                  </span>
                </div>

                <div className="h-32 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={languagesList}
                        cx="50%"
                        cy="85%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={50}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {languagesList.map((entry, index) => {
                          const isSelected =
                            hoveredLanguage?.name === entry.name;
                          const isAnyHovered = !!hoveredLanguage;
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              className="cursor-pointer outline-none"
                              style={{
                                opacity: isAnyHovered
                                  ? isSelected
                                    ? 1
                                    : 0.35
                                  : 1,
                                transform: isSelected
                                  ? "scale(1.05)"
                                  : "scale(1)",
                                transformOrigin: "center center",
                                transition:
                                  "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                              }}
                              onMouseEnter={() => setHoveredLanguage(entry)}
                              onMouseLeave={() => setHoveredLanguage(null)}
                            />
                          );
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {(() => {
                    const activeLang = hoveredLanguage ||
                      languagesList[0] || { name: "TypeScript", value: 42 };
                    return (
                      <div className="absolute bottom-2 flex flex-col items-center pointer-events-none h-10 justify-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeLang.name}
                            initial={{ opacity: 0, y: 5, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.94 }}
                            transition={{
                              duration: 0.22,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="flex flex-col items-center"
                          >
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold">
                              {activeLang.name}
                            </p>
                            <p className="text-[20px] font-black text-white leading-none mt-0.5 tracking-tight">
                              {activeLang.value}%
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 pt-1">
                  {languagesList.map((lang) => {
                    const isHovered = hoveredLanguage?.name === lang.name;
                    return (
                      <div
                        key={lang.name}
                        onMouseEnter={() => setHoveredLanguage(lang)}
                        onMouseLeave={() => setHoveredLanguage(null)}
                        className={`flex items-center gap-1.5 p-1 rounded-md transition-all cursor-pointer ${
                          isHovered
                            ? "bg-zinc-800/80 text-white"
                            : "hover:text-zinc-200"
                        }`}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="truncate font-medium">
                          {lang.name}
                        </span>
                        <span className="ml-auto font-black text-white">
                          {lang.value}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              id="activity"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2 bg-[#f4f4f5] rounded-[24px] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-black tracking-tight font-heading">
                      {activeActivityToggle} Activity
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Hours coded & commits pushed
                    </p>
                  </div>
                  <SegmentedSlider
                    options={["Daily", "Weekly", "Monthly", "Yearly"] as const}
                    value={activeActivityToggle}
                    onChange={setActiveActivityToggle}
                    theme="light"
                  />
                </div>

                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={
                        activeActivityToggle === "Daily"
                          ? dailyActivityList
                          : activeActivityToggle === "Weekly"
                            ? weeklyActivityList
                            : activeActivityToggle === "Monthly"
                              ? monthlyActivityList
                              : yearlyActivityList
                      }
                      margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({
                          active,
                          payload,
                        }: {
                          active?: boolean;
                          payload?: readonly {
                            value?:
                              | string
                              | number
                              | readonly (string | number)[];
                            payload?: { day: string };
                          }[];
                        }) => {
                          if (
                            active &&
                            payload &&
                            payload.length &&
                            payload[0].payload
                          ) {
                            return (
                              <div className="bg-white text-zinc-950 p-2.5 rounded-xl shadow-md border border-zinc-100 text-[11px] font-bold">
                                <p className="text-zinc-500 mb-1">
                                  {payload[0].payload.day}
                                </p>
                                {showHours && (
                                  <p className="text-[#005c58]">
                                    {payload[0].value} Coding Hours
                                  </p>
                                )}
                                {showCommits && payload[1] && (
                                  <p className="text-[#3b82f6]">
                                    {payload[1].value} Commits
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      {showHours && (
                        <Line
                          type="monotone"
                          dataKey="hours"
                          stroke="#005c58"
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{
                            r: 5,
                            stroke: "#ffffff",
                            strokeWidth: 1.5,
                          }}
                        />
                      )}
                      {showCommits && (
                        <Line
                          type="monotone"
                          dataKey="commits"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{
                            r: 5,
                            stroke: "#ffffff",
                            strokeWidth: 1.5,
                          }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200 text-center">
                  <button
                    onClick={() => setShowHours(!showHours)}
                    className={`flex-1 flex flex-col items-center py-1 rounded-xl transition-all ${showHours ? "bg-[#003c3a]/15" : "opacity-40"}`}
                  >
                    <p className="text-[15px] font-black text-[#003c3a]">
                      {activityTotals.totalHours}
                    </p>
                    <p className="text-[9px] text-[#003c3a] uppercase font-bold">
                      Hours
                    </p>
                  </button>
                  <button
                    onClick={() => setShowCommits(!showCommits)}
                    className={`flex-1 flex flex-col items-center py-1 rounded-xl transition-all ${showCommits ? "bg-[#3b82f6]/10" : "opacity-40"}`}
                  >
                    <p className="text-[15px] font-black text-[#1d4ed8]">
                      {activityTotals.totalCommits}
                    </p>
                    <p className="text-[9px] text-[#1d4ed8] uppercase font-bold">
                      Commits
                    </p>
                  </button>
                  <div className="flex-1 flex flex-col items-center py-1">
                    <p className="text-[15px] font-black text-black">
                      {activityTotals.totalProblems}
                    </p>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold">
                      Problems
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col items-center py-1">
                    <p className="text-[15px] font-black text-black">
                      {activityTotals.newRepos}
                    </p>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold">
                      New Repos
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 bg-[#f4f4f5] rounded-[24px] p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-black tracking-tight">
                    Today&apos;s Goals
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Click tasks to update daily goals
                  </p>
                </div>
                <div className="space-y-2 mt-3">
                  {todayGoals.map((goal, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => toggleGoal(index)}
                      className="w-full text-left bg-white rounded-lg p-2.5 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${goal.done ? "bg-[#003c3a] border-[#003c3a]" : "border-zinc-300"}`}
                      >
                        {goal.done && (
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-semibold truncate ${goal.done ? "line-through text-zinc-400" : "text-zinc-800"}`}
                      >
                        {goal.l}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 pt-2">
                  <div className="flex justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                    <span>Goals Completed</span>
                    <span>{goalsPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#003c3a] rounded-full transition-all duration-500"
                      style={{ width: `${goalsPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              id="projects"
              className="space-y-5 w-full max-w-full overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3.5 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] sm:text-[16px] font-extrabold text-black tracking-tight font-heading">
                      Projects & Code Repositories
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="btn-candy flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800 text-white rounded-xl text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="relative grid grid-cols-3 bg-zinc-100/90 border border-zinc-200/80 rounded-2xl p-1 gap-1 h-9 sm:h-10 w-64 sm:w-76 select-none shrink-0 items-center">
                    <div
                      className="absolute top-1 bottom-1 bg-white rounded-xl transition-all duration-300 ease-out shadow-xs border border-zinc-200/60"
                      style={{
                        width: "calc(33.333% - 4px)",
                        left: `calc(${["All", "Live", "In Progress"].indexOf(activeTab) * 33.333}% + ${4 - ["All", "Live", "In Progress"].indexOf(activeTab)}px)`,
                      }}
                    />
                    {["All", "Live", "In Progress"].map((tab) => {
                      const isActive = activeTab === tab;
                      const count =
                        tab === "All"
                          ? projectsList.length
                          : projectsList.filter((p) => p.status === tab).length;

                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`relative z-10 flex items-center justify-center gap-1.5 h-7 sm:h-8 rounded-xl text-[10px] sm:text-[11px] font-bold transition-colors duration-300 cursor-pointer ${
                            isActive
                              ? "text-zinc-950 font-extrabold"
                              : "text-zinc-500 hover:text-zinc-900"
                          }`}
                        >
                          <span>{tab}</span>
                          <span
                            className={`px-1.5 py-0.5 text-[8px] rounded-md transition-all duration-300 leading-none flex items-center justify-center ${
                              isActive
                                ? "bg-zinc-900 text-white font-bold"
                                : "bg-zinc-200/70 text-zinc-650"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative flex items-center bg-zinc-100/90 border border-zinc-200/80 rounded-2xl p-1 gap-1 h-9 sm:h-10 select-none shrink-0">
                    <div
                      className="absolute top-1 bottom-1 bg-white rounded-xl transition-all duration-300 ease-out shadow-xs border border-zinc-200/60"
                      style={{
                        width: "calc(50% - 6px)",
                        left:
                          projectViewMode === "grid"
                            ? "4px"
                            : "calc(50% + 2px)",
                      }}
                    />
                    <button
                      type="button"
                      title="Grid Card View"
                      onClick={() => setProjectViewMode("grid")}
                      className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-[11px] font-bold transition-colors duration-300 cursor-pointer ${
                        projectViewMode === "grid"
                          ? "text-zinc-950 font-extrabold"
                          : "text-zinc-400 hover:text-zinc-700"
                      }`}
                    >
                      <GridIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      type="button"
                      title="Table View"
                      onClick={() => setProjectViewMode("table")}
                      className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-[11px] font-bold transition-colors duration-300 cursor-pointer ${
                        projectViewMode === "table"
                          ? "text-zinc-950 font-extrabold"
                          : "text-zinc-400 hover:text-zinc-700"
                      }`}
                    >
                      <ListBulletIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {sortedProjects.length === 0 ? (
                <div className="my-4 p-10 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-center gap-3 bg-white/70">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                    <GlobeIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[14px] font-bold text-zinc-900">
                      No projects found
                    </p>
                    <p className="text-[12px] text-zinc-500 max-w-sm font-medium">
                      {activeTab === "All"
                        ? "You haven't added any projects yet. Click '+ Add Project' to create your first project."
                        : `No projects currently found in '${activeTab}' status.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="btn-candy mt-1 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    + Add Project Now
                  </button>
                </div>
              ) : projectViewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sortedProjects.map((proj) => {
                    const techList = proj.stack
                      ? proj.stack
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [];

                    return (
                      <div
                        key={proj.id}
                        className="group relative bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between hover:border-zinc-300"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-zinc-100 to-zinc-200/80 border border-zinc-200 flex items-center justify-center text-[13px] font-extrabold text-zinc-800 shrink-0 shadow-2xs">
                                {proj.name ? proj.name[0].toUpperCase() : "P"}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-zinc-950 text-[14px] leading-snug tracking-tight group-hover:text-[#005c58] transition-colors">
                                  {proj.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium mt-0.5">
                                  <GlobeIcon className="w-3 h-3 text-zinc-400" />
                                  <span>{proj.platform || "Web"}</span>
                                </div>
                              </div>
                            </div>

                            {proj.status === "Live" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live
                              </span>
                            ) : proj.status === "In Progress" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                In Progress
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-zinc-100 text-zinc-600 border border-zinc-200 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                Archived
                              </span>
                            )}
                          </div>

                          <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-2 min-h-9 font-normal">
                            {proj.description || "No description provided."}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {techList.slice(0, 4).map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100/90 text-zinc-700 rounded-md border border-zinc-200/60"
                              >
                                {tech}
                              </span>
                            ))}
                            {techList.length > 4 && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-zinc-100 text-zinc-500 rounded-md border border-zinc-200">
                                +{techList.length - 4}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-500">
                            <span
                              className="flex items-center gap-1"
                              title="Views"
                            >
                              <EyeOpenIcon className="w-3.5 h-3.5 text-zinc-400" />
                              {proj.views || 0}
                            </span>
                            <span
                              className="flex items-center gap-1"
                              title="Likes"
                            >
                              <HeartIcon className="w-3.5 h-3.5 text-rose-400" />
                              {proj.likes || 0}
                            </span>
                            <span
                              className="flex items-center gap-1"
                              title="Stars"
                            >
                              <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                              {proj.stars || 0}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {proj.demoUrl && (
                              <a
                                href={proj.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Live Demo"
                                className="p-1.5 text-zinc-500 hover:text-[#005c58] hover:bg-[#005c58]/10 rounded-lg transition-all"
                              >
                                <ExternalLinkIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="GitHub Repository"
                                className="p-1.5 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-all"
                              >
                                <GitHubLogoIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(proj)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                              title="Edit Project"
                            >
                              <Pencil2Icon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProject(proj);
                                setProjectModalType("delete");
                              }}
                              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Delete Project"
                            >
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 shadow-2xs bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] font-bold text-zinc-500 uppercase tracking-wider select-none">
                        <th
                          onClick={() => handleSort("name")}
                          className="py-3 px-4 hover:text-black transition-colors cursor-pointer"
                        >
                          Project Details{" "}
                          {sortField === "name" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Tech Stack</th>
                        <th className="py-3 px-3">Platform & Links</th>
                        <th
                          onClick={() => handleSort("views")}
                          className="py-3 px-3 hover:text-black transition-colors cursor-pointer"
                        >
                          Metrics{" "}
                          {sortField === "views" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-[13px]">
                      {sortedProjects.map((proj) => {
                        const isEditing = editingProjectId === proj.id;
                        const hasChanges =
                          isEditing &&
                          (projectFormState.name !== proj.name ||
                            projectFormState.stack !== proj.stack ||
                            projectFormState.platform !== proj.platform ||
                            projectFormState.status !== proj.status ||
                            Number(projectFormState.views) !== proj.views ||
                            Number(projectFormState.likes) !== proj.likes ||
                            Number(projectFormState.stars) !== proj.stars);

                        const techList = proj.stack
                          ? proj.stack
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          : [];

                        return (
                          <tr
                            key={proj.id}
                            className={`transition-colors ${isEditing ? "bg-zinc-50/80" : "hover:bg-zinc-50/60"}`}
                          >
                            <td className="py-3.5 px-4">
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={projectFormState.name}
                                    onChange={(e) =>
                                      setProjectFormState({
                                        ...projectFormState,
                                        name: e.target.value,
                                      })
                                    }
                                    className="rounded-lg border border-zinc-200 px-2.5 py-1 text-[12px] font-bold text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 w-36"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-[11px] font-extrabold text-zinc-800 shrink-0 mt-0.5">
                                    {proj.name
                                      ? proj.name[0].toUpperCase()
                                      : "P"}
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="font-extrabold text-zinc-950 text-[13px] block">
                                      {proj.name}
                                    </span>
                                    {proj.description && (
                                      <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">
                                        {proj.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              {isEditing ? (
                                <select
                                  value={projectFormState.status}
                                  onChange={(e) =>
                                    setProjectFormState({
                                      ...projectFormState,
                                      status: e.target.value,
                                    })
                                  }
                                  className="rounded-lg border border-zinc-200 px-2 py-1 text-[11px] font-bold text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
                                >
                                  <option value="Live">Live</option>
                                  <option value="In Progress">
                                    In Progress
                                  </option>
                                  <option value="Archived">Archived</option>
                                </select>
                              ) : proj.status === "Live" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Live
                                </span>
                              ) : proj.status === "In Progress" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  In Progress
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-zinc-100 text-zinc-600 border border-zinc-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                  Archived
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={projectFormState.stack}
                                  onChange={(e) =>
                                    setProjectFormState({
                                      ...projectFormState,
                                      stack: e.target.value,
                                    })
                                  }
                                  className="rounded-lg border border-zinc-200 px-2 py-1 text-[12px] text-zinc-600 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 w-32"
                                />
                              ) : (
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {techList.map((t, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 text-zinc-700 rounded-md border border-zinc-200/60"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={projectFormState.platform}
                                  onChange={(e) =>
                                    setProjectFormState({
                                      ...projectFormState,
                                      platform: e.target.value,
                                    })
                                  }
                                  className="rounded-lg border border-zinc-200 px-2 py-1 text-[12px] text-zinc-650 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-black/10 w-24"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-[12px] text-zinc-700">
                                    {proj.platform || "Web"}
                                  </span>
                                  {(proj.demoUrl || proj.githubUrl) && (
                                    <div className="flex items-center gap-1 border-l border-zinc-200 pl-2">
                                      {proj.demoUrl && (
                                        <a
                                          href={proj.demoUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          title="Live Demo"
                                          className="text-zinc-400 hover:text-[#005c58] transition-colors"
                                        >
                                          <ExternalLinkIcon className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                      {proj.githubUrl && (
                                        <a
                                          href={proj.githubUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          title="GitHub Repository"
                                          className="text-zinc-400 hover:text-zinc-950 transition-colors"
                                        >
                                          <GitHubLogoIcon className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    value={projectFormState.views}
                                    onChange={(e) =>
                                      setProjectFormState({
                                        ...projectFormState,
                                        views: parseInt(e.target.value) || 0,
                                      })
                                    }
                                    className="rounded border border-zinc-200 px-1 py-0.5 text-[11px] text-zinc-600 bg-white focus:outline-none w-12 text-center font-semibold"
                                    title="Views"
                                  />
                                  <span className="text-zinc-300">/</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={projectFormState.likes}
                                    onChange={(e) =>
                                      setProjectFormState({
                                        ...projectFormState,
                                        likes: parseInt(e.target.value) || 0,
                                      })
                                    }
                                    className="rounded border border-zinc-200 px-1 py-0.5 text-[11px] text-zinc-600 bg-white focus:outline-none w-12 text-center font-semibold"
                                    title="Likes"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-2.5 text-[11px] font-semibold text-zinc-600">
                                  <span
                                    className="flex items-center gap-1"
                                    title="Views"
                                  >
                                    <EyeOpenIcon className="w-3 h-3 text-zinc-400" />
                                    {proj.views || 0}
                                  </span>
                                  <span
                                    className="flex items-center gap-1"
                                    title="Likes"
                                  >
                                    <HeartIcon className="w-3 h-3 text-rose-400" />
                                    {proj.likes || 0}
                                  </span>
                                  <span
                                    className="flex items-center gap-1"
                                    title="Stars"
                                  >
                                    <StarIcon className="w-3 h-3 text-amber-400" />
                                    {proj.stars || 0}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={handleInlineSave}
                                    disabled={!hasChanges}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-[#005c58] hover:bg-[#003c3a] text-[10px] font-bold text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                                  >
                                    <CheckCircledIcon className="w-3.5 h-3.5" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex items-center gap-1 px-2 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-[10px] font-bold text-zinc-600 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <CrossCircledIcon className="w-3.5 h-3.5" />
                                    <span>Cancel</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(proj)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-[10px] font-bold text-zinc-700 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Pencil2Icon className="w-3.5 h-3.5 text-zinc-500" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedProject(proj);
                                      setProjectModalType("delete");
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-[10px] font-bold text-red-600 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <TrashIcon className="w-3.5 h-3.5 text-red-500" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div
            id="platforms"
            className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-black tracking-tight font-heading">
                  Coding Platforms
                </h3>
                {dashboardError && (
                  <ErrorQuestionTooltip message={dashboardError} />
                )}
              </div>
              <span className="text-[11px] font-bold text-zinc-400 bg-white rounded-full px-2.5 py-0.5">
                {platformsList.length} Connected
              </span>
            </div>

            {platformsList.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-zinc-500 text-xs font-medium">
                No coding platforms connected yet. Add your account handles in
                Profile to sync live data.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {platformsList.map((plat) => (
                  <div
                    key={plat.name}
                    className="bg-white rounded-xl p-4 border border-transparent hover:border-zinc-200 hover:bg-zinc-50 hover:shadow-md transition-all duration-300 text-left flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: plat.color + "15" }}
                        >
                          {plat.logo ? (
                            <div
                              className="w-4 h-4"
                              style={{
                                backgroundColor: plat.color,
                                maskImage: `url(${plat.logo})`,
                                WebkitMaskImage: `url(${plat.logo})`,
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                              }}
                              aria-label={plat.name}
                            />
                          ) : (
                            <span
                              className="text-[11px] font-black"
                              style={{ color: plat.color }}
                            >
                              {plat.name[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-black">
                            {plat.name}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            {plat.rank}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] pb-4 font-bold text-black">
                        Streak: {plat.streak}d
                      </span>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[18px] font-black text-black">
                          {typeof plat.rating === "number" && plat.rating > 0
                            ? plat.rating.toLocaleString()
                            : plat.rating || 0}
                        </p>
                        <p className="text-[9px] text-zinc-400">
                          {plat.name.toLowerCase() === "leetcode"
                            ? plat.rating > 5000
                              ? "Global Rank"
                              : "Rating / Rank"
                            : "Rating"}
                        </p>
                      </div>
                      <div className="flex gap-0.5 items-end h-6">
                        {(plat.history || []).map((h: number, i: number) => (
                          <div
                            key={i}
                            className="w-1 bg-zinc-200 rounded-t-sm"
                            style={{
                              height: `${h * 6}px`,
                              backgroundColor: plat.color,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSyncAll}
                      disabled={isSyncing}
                      className="btn-candy w-full py-1.5 bg-linear-to-b from-zinc-100 to-zinc-200 border border-zinc-300 text-[10px] font-bold text-zinc-800 rounded-lg flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <UpdateIcon
                        className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`}
                      />
                      <span>Sync Platform</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <SkillsSection projectsList={projectsList} />

          <div
            id="career-progress"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4">
              <h3 className="text-[15px] font-bold text-black tracking-tight">
                Career Progress
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {rings.map((r) => (
                  <div
                    key={r.label}
                    className="bg-white rounded-xl p-3 flex flex-col items-center justify-between gap-2"
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          fill="none"
                          stroke="#f4f4f5"
                          strokeWidth="3"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          fill="none"
                          stroke={r.color}
                          strokeWidth="3"
                          strokeDasharray={2 * Math.PI * 18}
                          strokeDashoffset={
                            2 * Math.PI * 18 * (1 - r.value / 100)
                          }
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black text-zinc-800">
                        {r.value}%
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold text-zinc-500 leading-tight">
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f4f4f5] rounded-[24px] p-5 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-bold text-black tracking-tight">
                  Developer Wrapped
                </h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  2026 year in review summary
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 space-y-2 text-[11px] font-semibold text-zinc-600">
                <div className="flex justify-between">
                  <span>Coding Hours:</span>
                  <span className="text-black font-bold">1,248</span>
                </div>
                <div className="flex justify-between">
                  <span>Most Used Language:</span>
                  <span className="text-[#3b82f6] font-bold">TypeScript</span>
                </div>
                <div className="flex justify-between">
                  <span>Top Repository:</span>
                  <span className="text-[#005c58] font-bold">dradix</span>
                </div>
                <div className="flex justify-between">
                  <span>Longest Streak:</span>
                  <span className="text-black font-bold">47 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Favorite Tech:</span>
                  <span className="text-[#f43f5e] font-bold">Next.js</span>
                </div>
              </div>

              <button className="btn-candy w-full py-2.5 bg-linear-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800 text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                <span>Generate Developer Wrapped</span>
              </button>
            </div>
          </div>

          <div
            id="achievements"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4">
              <h3 className="text-[15px] font-bold text-black tracking-tight">
                Achievement Center
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {achievementBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className={`bg-white rounded-xl p-2.5 flex flex-col items-center justify-center gap-1.5 border border-zinc-100 min-w-0 ${badge.unlocked ? "" : "opacity-40 grayscale"}`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
                      style={{
                        backgroundColor: badge.color + "15",
                        color: badge.color,
                      }}
                    >
                      {badge.icon}
                    </div>
                    <span className="text-[9px] font-bold text-zinc-600 text-center leading-tight truncate max-w-full px-0.5">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-3 flex items-center justify-between text-[11px] font-bold text-zinc-600">
                <span>Hackathons: 8</span>
                <span>Wins: 2</span>
                <span>Certificates: 12</span>
              </div>
            </div>

            <div
              id="leaderboard"
              className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4"
            >
              <h3 className="text-[15px] font-bold text-black tracking-tight">
                Leaderboard Rankings
              </h3>
              <div className="space-y-2">
                {leaderboardRankings.map((user) => (
                  <div
                    key={user.rank}
                    className={`bg-white rounded-xl p-2.5 px-3 flex items-center justify-between gap-2 border ${user.isYou ? "border-[#003c3a] ring-1 ring-[#003c3a]/20" : "border-transparent"}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-black text-zinc-400 shrink-0">
                        #{user.rank}
                      </span>
                      <span className="text-[12px] font-bold text-zinc-900 truncate">
                        {user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-right shrink-0">
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                        {user.xp} XP
                      </span>
                      <span className="text-[11px] font-extrabold text-zinc-950">
                        {user.score}{" "}
                        <span className="text-[9px] text-zinc-400 font-normal">
                          Score
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="timeline" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4">
              <h3 className="text-[15px] font-bold text-black tracking-tight">
                Developer Timeline
              </h3>
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-1.75 top-2 bottom-2 w-0.5 bg-zinc-200" />
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div
                      className="absolute -left-5.75 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2"
                      style={{ borderColor: item.color }}
                    />
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-black">{item.title}</span>
                      <span className="text-zinc-400">{item.date}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="group/notif-card bg-[#f4f4f5] rounded-[24px] p-5 border border-transparent hover:border-zinc-200 hover:bg-white hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col h-75 hover:h-130 overflow-hidden relative">
              <div className="flex justify-between items-center shrink-0 mb-4">
                <h3 className="text-[15px] font-bold text-black tracking-tight">
                  Activity & Notifications
                </h3>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-none group-hover/notif-card:scrollbar-thin pr-1 space-y-4 pb-8 transition-all duration-500">
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mb-2">
                    Live Feed
                  </p>
                  <div className="space-y-2">
                    {recentActivityFeed.map((act, idx) => (
                      <div
                        key={idx}
                        className="bg-white group-hover/notif-card:bg-zinc-50 transition-all duration-200 rounded-xl p-3 flex justify-between items-center text-[12px] border-transparent"
                        style={{ borderLeftColor: act.color }}
                      >
                        <span className="font-semibold text-zinc-700 pl-1">
                          {act.text}
                        </span>
                        <span className="text-[10px] text-zinc-400 shrink-0 ml-3">
                          {act.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-200">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mb-2">
                    Notifications
                  </p>
                  <div className="space-y-2">
                    {notifications.length > 0 ? (
                      notifications.map((notif, idx) => {
                        const notifColors: Record<string, string> = {
                          sync: "#3b82f6",
                          analyze: "#8b5cf6",
                          badge: "#f59e0b",
                          report: "#10b981",
                        };
                        return (
                          <div
                            key={idx}
                            className="bg-white group-hover/notif-card:bg-zinc-50 transition-all duration-200 rounded-xl p-3 flex justify-between items-center text-[12px] border-transparent"
                            style={{
                              borderLeftColor:
                                notifColors[notif.type] || "#9ca3af",
                            }}
                          >
                            <span className="font-semibold text-zinc-700 pl-1">
                              {notif.text}
                            </span>
                            <span className="text-[10px] text-zinc-400 shrink-0 ml-3">
                              {notif.time}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[11px] text-zinc-400 italic py-2">
                        No new notifications
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#f4f4f5] to-transparent pointer-events-none transition-all duration-500 ease-in-out group-hover/notif-card:opacity-0 group-hover/notif-card:pointer-events-none" />
            </div>
          </div>

          <div className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4">
            <h3 className="text-[15px] font-bold text-black tracking-tight">
              Upcoming Events
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {upcomingEvents.map((evt, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-bold text-black">
                      {evt.title}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">
                      {evt.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold">
                    <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{evt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 pt-4 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-400 font-semibold w-full">
        <div className="flex flex-wrap items-center gap-4">
          <span>Storage Used: 2.4 MB / 100 MB</span>
          <span>Last Sync: 2 min ago</span>
          <span>v0.1.3-beta</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="hover:text-zinc-600 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-zinc-600 transition-colors">
            Support Portal
          </a>
          <a href="#" className="hover:text-zinc-600 transition-colors">
            Submit Feedback
          </a>
          <a href="#" className="hover:text-zinc-600 transition-colors">
            Documentation
          </a>
        </div>
      </footer>

      {projectModalType === "add" && addProjectStep === "github_select" && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300 ease-in-out text-left animate-fade-in">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-scale-in text-left max-h-[90vh]">
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 tracking-tight font-heading">
                    GitHub Authentication & Repository Sync
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Authenticate to manage both your Public and Private
                    repositories securely.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProjectModalType(null)}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"
              >
                <Cross2Icon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              {isFetchingRepos ? (
                <div className="py-12 space-y-4 text-center bg-zinc-50 border border-zinc-200/80 rounded-2xl p-8 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
                    <UpdateIcon className="w-6 h-6 animate-spin text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-extrabold text-zinc-900 tracking-tight font-heading">
                      Fetching your GitHub repositories...
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto font-medium leading-relaxed">
                      Connecting to GitHub and loading all your public & private
                      repositories for you.
                    </p>
                  </div>
                </div>
              ) : !isGitHubConnected ? (
                <div className="py-6 space-y-4 text-center bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto shadow-xs">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900">
                      Connect Your GitHub Account
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                      Sign in with GitHub to automatically list and manage your{" "}
                      <strong>Public and Private</strong> repositories. Zero
                      manual token entry required.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleStartGitHubOAuth}
                      disabled={isConnectingToken}
                      className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white font-extrabold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-md disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                      <span>
                        {isConnectingToken
                          ? "Connecting..."
                          : "Sign in with GitHub"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-zinc-900 text-white flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div>
                        <span className="text-xs font-extrabold text-white block">
                          Connected as @{connectedGitHubUsername}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnectGitHub}
                      className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-zinc-300 transition-colors cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <RepoVisibilitySlider
                      filter={repoVisibilityFilter}
                      setFilter={setRepoVisibilityFilter}
                      repos={githubRepos}
                    />

                    <button
                      type="button"
                      onClick={fetchAuthenticatedGitHubRepos}
                      disabled={isFetchingRepos}
                      className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                    >
                      {isFetchingRepos ? "Syncing..." : "↻ Refresh List"}
                    </button>
                  </div>
                </div>
              )}

              {repoFetchError && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {repoFetchError}
                </div>
              )}

              {isGitHubConnected && githubRepos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[42vh] overflow-y-auto pr-1">
                  {githubRepos
                    .filter((repo) => {
                      if (repoVisibilityFilter === "public")
                        return !repo.private;
                      if (repoVisibilityFilter === "private")
                        return repo.private;
                      return true;
                    })
                    .map((repo) => {
                      const isSelected = selectedRepoName === repo.name;
                      return (
                        <button
                          key={repo.id}
                          type="button"
                          onClick={() => handleSelectGitHubRepo(repo)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSelectGitHubRepo(repo);
                            }
                          }}
                          className={`w-full p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 ${
                            isSelected
                              ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
                              : "bg-zinc-50/70 border-zinc-200 hover:border-zinc-400 hover:bg-white hover:shadow-xs"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-extrabold text-xs truncate flex items-center gap-1.5">
                                {repo.name}
                                {repo.private && (
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                      isSelected
                                        ? "bg-zinc-800 text-amber-300 border border-zinc-700"
                                        : "bg-amber-100 text-amber-800 border border-amber-200"
                                    }`}
                                  >
                                    Private
                                  </span>
                                )}
                              </span>
                              <span
                                className={`text-[10px] font-bold shrink-0 ${
                                  isSelected
                                    ? "text-amber-300"
                                    : "text-amber-600"
                                }`}
                              >
                                ★ {repo.stargazers_count}
                              </span>
                            </div>
                            {repo.description && (
                              <p
                                className={`text-[11px] line-clamp-2 mt-1 ${
                                  isSelected ? "text-zinc-300" : "text-zinc-500"
                                }`}
                              >
                                {repo.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            {repo.language ? (
                              <span
                                className={`px-2 py-0.5 rounded-lg font-semibold ${
                                  isSelected
                                    ? "bg-zinc-800 text-zinc-300"
                                    : "bg-zinc-200/80 text-zinc-700"
                                }`}
                              >
                                {repo.language}
                              </span>
                            ) : (
                              <span />
                            )}
                            <span
                              className={`font-bold ${
                                isSelected ? "text-white" : "text-zinc-900"
                              }`}
                            >
                              Select & Auto-fill →
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              ) : (
                isGitHubConnected &&
                !isFetchingRepos && (
                  <div className="py-10 text-center space-y-2 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                    <p className="text-xs font-bold text-zinc-600">
                      No repositories found under this filter
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Try selecting &quot;All&quot; or click refresh to sync
                      your latest GitHub repositories.
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAddProjectStep("form")}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200/70 border border-zinc-200 transition-all cursor-pointer"
              >
                Skip / Create Manually →
              </button>
              <button
                type="button"
                onClick={() => setProjectModalType(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {((projectModalType === "add" && addProjectStep === "form") ||
        projectModalType === "edit") && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300 ease-in-out text-left animate-fade-in">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-2xl sm:max-w-3xl overflow-hidden flex flex-col animate-scale-in text-left max-h-[90vh]">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
              <div>
                <h3 className="text-[17px] font-extrabold text-zinc-900 tracking-tight font-heading">
                  {projectModalType === "add"
                    ? "Add New Project"
                    : "Edit Project"}
                </h3>
                <p className="text-[11px] text-zinc-400 font-medium">
                  {projectModalType === "add"
                    ? "Review and complete project details below."
                    : "Update project metadata, links, and system architecture."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProjectModalType(null);
                  setSelectedProject(null);
                  setEditingProjectId(null);
                }}
                className="p-1.5 text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 rounded-xl transition-all duration-300 ease-in-out hover:scale-110 active:scale-90 cursor-pointer"
              >
                <Cross2Icon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProject}
              className="p-6 sm:p-8 space-y-5 overflow-y-auto"
            >
              {selectedRepoName && projectModalType === "add" && (
                <div className="p-3 rounded-2xl bg-zinc-900 text-white flex items-center justify-between text-xs font-medium shadow-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Auto-filled from GitHub repo:{" "}
                    <strong className="font-bold text-white">
                      {selectedRepoName}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAddProjectStep("github_select")}
                    className="text-[11px] font-bold text-zinc-300 hover:text-white underline cursor-pointer"
                  >
                    Change Repo
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dradix Portfolio"
                    value={projectFormState.name}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 font-bold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Tech Stack *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, TypeScript, PostgreSQL"
                    value={projectFormState.stack}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        stack: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 font-semibold transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive project overview and key features..."
                  value={projectFormState.description}
                  onChange={(e) =>
                    setProjectFormState({
                      ...projectFormState,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 font-normal transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={projectFormState.demoUrl}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        demoUrl: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 font-normal transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={projectFormState.githubUrl}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        githubUrl: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 font-normal transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Architecture Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="System design, cloud infrastructure, DB schemas..."
                    value={projectFormState.architectureDetails}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        architectureDetails: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 font-normal transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Challenges Solved
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Technical hurdles, performance optimizations..."
                    value={projectFormState.challengesSolved}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        challengesSolved: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 font-normal transition-all resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Screenshots (Max 2 URLs)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="Screenshot 1 URL"
                    value={projectFormState.screenshot1}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        screenshot1: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                  <input
                    type="url"
                    placeholder="Screenshot 2 URL"
                    value={projectFormState.screenshot2}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        screenshot2: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Platform
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GitHub"
                    value={projectFormState.platform}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        platform: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 font-semibold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={projectFormState.status}
                    onChange={(e) =>
                      setProjectFormState({
                        ...projectFormState,
                        status: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 font-bold transition-all"
                  >
                    <option value="Live">Live</option>
                    <option value="In Progress">Progress</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                {projectModalType === "add" ? (
                  <button
                    type="button"
                    onClick={() => setAddProjectStep("github_select")}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-all cursor-pointer"
                  >
                    ← Select GitHub Repo
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setProjectModalType(null);
                      setSelectedProject(null);
                      setEditingProjectId(null);
                    }}
                    className="px-4 py-2.5 rounded-xl text-[12px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors bg-transparent border border-zinc-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-black text-white hover:bg-zinc-800 rounded-xl text-[12px] font-bold shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    {projectModalType === "add"
                      ? "Create Project"
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {projectModalType === "delete" && selectedProject && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out text-left animate-fade-in">
          <div className="bg-white rounded-3xl border border-dashed border-zinc-200 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-scale-in text-left">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto text-red-500">
                <TrashIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-extrabold text-black font-heading">
                  Delete Project
                </h3>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-zinc-900">
                    &quot;{selectedProject?.name}&quot;
                  </span>
                  ? This action is permanent and cannot be undone.
                </p>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProjectModalType(null);
                    setSelectedProject(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[12px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors bg-transparent border border-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[12px] font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
