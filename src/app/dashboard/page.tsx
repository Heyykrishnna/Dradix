"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
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
  BarChartIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import {
  BarChart as ReChartsBarChart,
  Bar,
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
import { useSkills } from "@/context/SkillsContext";
import SegmentedSlider from "./components/SegmentedSlider";
import { apiFetch } from "@/lib/api";
import Loader from "@/components/Loader";

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

const learningCourses = [
  {
    title: "Full Stack Open",
    provider: "University of Helsinki",
    pct: 78,
    color: "#005c58",
  },
  {
    title: "Advanced Rust Programming",
    provider: "Udemy",
    pct: 45,
    color: "#f43f5e",
  },
  {
    title: "System Design Masterclass",
    provider: "Educative",
    pct: 92,
    color: "#3b82f6",
  },
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

  return (
    <div id="skills" className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-black tracking-tight">
          Tech Stack &amp; Skills
        </h3>
      </div>

      <div className="flex items-stretch gap-3 overflow-x-auto py-3 px-5 -mx-5 scrollbar-thin">
        {userSkills.map((skill) => {
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
              className={`relative shrink-0 flex flex-col items-center gap-2 rounded-2xl px-4 py-4 w-27.5 transition-all duration-300 ${
                isHovered ? "bg-zinc-100 shadow-sm" : "bg-white"
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

              {/* Level badge */}
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
}: {
  activeSkill: string | null;
  projectsList: Project[];
}) {
  const { userSkills } = useSkills();
  if (!activeSkill) return null;
  const skill = userSkills.find((s) => s.name === activeSkill);
  if (!skill) return null;
  const projects = projectsList.filter((p) =>
    skill.relatedProjects.includes(p.name),
  );
  const cfg = levelConfig[skill.level] ?? levelConfig.Beginner;

  return (
    <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${skill.color}20` }}
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
          <p className="text-[14px] font-black text-black leading-none">
            {skill.name}
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
            Projects using {skill.name}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between bg-[#f4f4f5] rounded-xl p-3 hover:bg-zinc-100 hover:shadow-sm transition-all duration-200"
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-black truncate">
                    {proj.name}
                  </p>
                  <p className="text-[9px] text-zinc-400 truncate mt-0.5">
                    {proj.stack} &middot; {proj.platform}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className="text-[8px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${proj.statusColor}18`,
                      color: proj.statusColor,
                    }}
                  >
                    {proj.status}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-semibold">
                    ★ {proj.stars}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-zinc-400 italic">
          No listed projects yet for {skill.name}.
        </p>
      )}
    </div>
  );
}

interface DashboardResponseData {
  profile?: {
    username: string;
    first_name?: string | null;
    last_name?: string | null;
  };
  developer_score?: number;
  github?: {
    username?: string;
    total_commits?: number;
    stars_earned?: number;
    total_prs?: number;
    total_issues?: number;
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

const REPO_FILTER_OPTIONS: Array<"all" | "public" | "private"> = ["all", "public", "private"];

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
  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const index = REPO_FILTER_OPTIONS.indexOf(filter);
    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>("button");
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
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [devStats, setDevStats] = useState(initialDevStats);
  const [platformsList, setPlatformsList] = useState<CodingPlatformItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [rings, setRings] = useState<CareerRingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const [projectModalType, setProjectModalType] = useState<
    "add" | "edit" | "delete" | "analytics" | null
  >(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [analyticsMetric, setAnalyticsMetric] = useState<
    "views" | "likes" | "stars"
  >("views");
  const [hoveredDataPoint, setHoveredDataPoint] = useState<MonthlyStats | null>(
    null,
  );
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
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "GITHUB_OAUTH_SUCCESS") {
        fetchAuthenticatedGitHubRepos();
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
        setDevStats((prev) => ({
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
        setDevStats((prev) => ({
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

  const getProjectMonthlyStats = (proj: Project | null) => {
    if (!proj) return [];
    const seed = proj.name.length;
    const months = [
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
    const baseViews = proj.views / 12;
    const baseLikes = proj.likes / 12;
    const baseStars = proj.stars / 12;

    return months.map((month, idx) => {
      const factor = 0.5 + Math.sin(idx + seed) * 0.3 + idx / 24;
      return {
        month,
        views: Math.round(baseViews * factor * 1.2),
        likes: Math.round(baseLikes * factor * 1.2),
        stars: Math.round(baseStars * factor * 1.2),
      };
    });
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
  const [trafficTooltipPos, setTrafficTooltipPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

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
        const response = await apiFetch<{ data: DashboardResponseData }>(
          "/dashboard",
        );
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
              return {
                name: platformName,
                rating: cp.rating || 0,
                rank: cp.global_ranking ? `#${cp.global_ranking}` : "Member",
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

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newNotif = {
        text: "Dynamic sync check completed: All systems normal",
        time: "Just now",
        type: "sync",
      };

      const saved = localStorage.getItem("dradix_notifications");
      let currentNotifs = [];
      if (saved) {
        try {
          currentNotifs = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
      const updated = [newNotif, ...currentNotifs];

      localStorage.setItem("dradix_notifications", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      setNotifications(updated);
    }, 1500);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4 py-30">
        <Loader />
      </div>
    );
  }

  return (
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
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                Dev Score
              </p>
              <p className="text-[18px] font-black text-black mt-1">
                {devStats.score}
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
            <div className="bg-white rounded-xl p-3">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                Streak
              </p>
              <p className="text-[18px] font-black text-black mt-1">
                {devStats.streak} Days
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-zinc-600">YK</span>
              </div>
              <div className="text-left">
                <p className="text-[12px] font-bold text-black">Yatharth K.</p>
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
            <button className="w-full mt-2 py-2 bg-black hover:bg-zinc-900 text-white rounded-lg text-[11px] font-bold transition-all">
              Improve Profile
            </button>
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
              onKeyDown={(e) => e.key === "Enter" && handleAskCoach(chatInput)}
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
            className="w-full py-3 bg-black hover:bg-zinc-900 text-white rounded-xl text-[12px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
            <button className="bg-white rounded-lg py-2 hover:bg-zinc-50 transition-all border border-zinc-100">
              Open Profile
            </button>
            <button className="bg-white rounded-lg py-2 hover:bg-zinc-50 transition-all border border-zinc-100">
              Share Link
            </button>
            <button className="bg-white rounded-lg py-2 hover:bg-zinc-50 transition-all border border-zinc-100">
              Copy Link
            </button>
            <button className="bg-white rounded-lg py-2 hover:bg-zinc-50 transition-all border border-zinc-100">
              Download CV
            </button>
          </div>
          <button className="w-full bg-white rounded-lg py-2 hover:bg-zinc-50 transition-all border border-zinc-100 text-[11px] font-bold text-zinc-700">
            Generate Profile QR Code
          </button>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-8">
        {/* Category 1: Development Velocity & Analytics */}
        <div className="space-y-6">
          <div className="bg-[#18181b] text-white rounded-[28px] p-6 lg:p-8 grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-white tracking-tight">
                  Coding Velocity
                </h3>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-[#27272a] flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-zinc-300" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-[#27272a] flex items-center justify-center">
                    <ArrowRightIcon className="w-4 h-4 text-zinc-300 -rotate-45" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 text-[10px] text-zinc-500 overflow-x-auto pb-1">
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
                ].map((m) => (
                  <span
                    key={m}
                    className={`px-2 py-0.5 rounded ${m === "May" ? "text-white font-bold" : ""}`}
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="h-44 relative mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsBarChart
                    data={fulfillmentData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    onMouseMove={(state: Record<string, unknown>) => {
                      const activePayload = state?.activePayload as
                        | Array<{ payload: { month: string; commits: number } }>
                        | undefined;
                      if (activePayload && activePayload[0]) {
                        setHoveredBar(activePayload[0].payload);
                      }
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#52525b", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#52525b", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                      content={({
                        active,
                        payload,
                      }: {
                        active?: boolean;
                        payload?: readonly {
                          payload?: { month: string; commits: number };
                        }[];
                      }) => {
                        if (
                          active &&
                          payload &&
                          payload.length &&
                          payload[0].payload
                        ) {
                          const cellData = payload[0].payload;
                          return (
                            <div className="bg-[#18181b] border border-zinc-800 text-white p-2.5 rounded-xl shadow-lg text-[11px] font-bold">
                              <p className="text-zinc-500">{cellData.month}</p>
                              <p className="text-white text-[13px] font-black">
                                {cellData.commits} commits
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="commits" fill="#3f3f46" radius={[4, 4, 0, 0]}>
                      {fulfillmentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.month === "May" ||
                            (hoveredBar && hoveredBar.month === entry.month)
                              ? "#005c58"
                              : "#27272a"
                          }
                        />
                      ))}
                    </Bar>
                  </ReChartsBarChart>
                </ResponsiveContainer>

                <div className="absolute top-2 left-[36%] pointer-events-none flex flex-col items-center">
                  <div className="bg-white text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                    87%
                  </div>
                  <div className="w-0.5 h-32 bg-white/40 border-dashed border-white mt-1" />
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
                  <PieChart
                    onMouseMove={(e: Record<string, unknown>) => {
                      const chartX = e?.chartX;
                      const chartY = e?.chartY;
                      if (
                        typeof chartX === "number" &&
                        typeof chartY === "number"
                      ) {
                        setTrafficTooltipPos({
                          x: chartX + 15,
                          y: chartY + 15,
                        });
                      }
                    }}
                    onMouseLeave={() => setTrafficTooltipPos(null)}
                  >
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="85%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={50}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      position={trafficTooltipPos || undefined}
                      content={({ active, payload }) => {
                        if (
                          active &&
                          payload &&
                          payload.length &&
                          payload[0].payload
                        ) {
                          const cellData = payload[0].payload;
                          return (
                            <div className="bg-[#18181b] border border-zinc-800 text-white p-2.5 rounded-xl shadow-lg text-[11px] font-bold">
                              <p className="text-white">
                                {cellData.name}: {cellData.value}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-2 flex flex-col items-center">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                    TypeScript
                  </p>
                  <p className="text-[18px] font-black text-white">42%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                {languageData.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="truncate">{lang.name}</span>
                    <span className="ml-auto font-bold text-white">
                      {lang.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="activity" className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        ? dailyActivityData
                        : activeActivityToggle === "Weekly"
                          ? weeklyActivityData
                          : activeActivityToggle === "Monthly"
                            ? monthlyActivityData
                            : yearlyActivityData
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
                  <p className="text-[15px] font-black text-[#003c3a]">34</p>
                  <p className="text-[9px] text-[#003c3a] uppercase font-bold">
                    Hours
                  </p>
                </button>
                <button
                  onClick={() => setShowCommits(!showCommits)}
                  className={`flex-1 flex flex-col items-center py-1 rounded-xl transition-all ${showCommits ? "bg-[#3b82f6]/10" : "opacity-40"}`}
                >
                  <p className="text-[15px] font-black text-[#1d4ed8]">87</p>
                  <p className="text-[9px] text-[#1d4ed8] uppercase font-bold">
                    Commits
                  </p>
                </button>
                <div className="flex-1 flex flex-col items-center py-1">
                  <p className="text-[15px] font-black text-black">42</p>
                  <p className="text-[9px] text-zinc-400 uppercase font-bold">
                    Problems
                  </p>
                </div>
                <div className="flex-1 flex flex-col items-center py-1">
                  <p className="text-[15px] font-black text-black">2</p>
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

        {/* Category 2: Projects & Tech Profiles */}
        <div className="space-y-6">
          <div id="projects" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-bold text-black tracking-tight font-heading">
                    Projects
                  </h2>
                  <span className="text-[11px] font-bold text-zinc-400 bg-zinc-100 rounded-full px-2 py-0.5">
                    {projectsList.length} Total
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="relative grid grid-cols-4 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl p-1 gap-1 w-full max-w-110 select-none shrink-0">
                <div
                  className="absolute top-1 bottom-1 bg-black rounded-lg transition-all duration-300 ease-out shadow-xs"
                  style={{
                    width: "calc(25% - 5px)",
                    left: `calc(${["All", "Live", "In Progress", "Archived"].indexOf(activeTab) * 25}% + ${4 - ["All", "Live", "In Progress", "Archived"].indexOf(activeTab)}px)`,
                  }}
                />
                {["All", "Live", "In Progress", "Archived"].map((tab) => {
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
                      className={`relative z-10 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-bold transition-colors duration-300 cursor-pointer ${
                        isActive
                          ? "text-white"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      <span>{tab}</span>
                      <span
                        className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] rounded-md transition-all duration-300 ${
                          isActive
                            ? "bg-zinc-800 text-white font-bold"
                            : "bg-zinc-200 text-zinc-650"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {sortedProjects.length === 0 ? (
              <div className="my-4 p-10 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-center gap-3 bg-white/70">
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
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#f4f4f5] text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none cursor-pointer">
                      <th
                        onClick={() => handleSort("name")}
                        className="py-3 px-2 hover:text-black transition-colors"
                      >
                        Project Name{" "}
                        {sortField === "name" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th className="py-3 px-2">Tech Stack</th>
                      <th className="py-3 px-2">Platform</th>
                      <th
                        onClick={() => handleSort("views")}
                        className="py-3 px-2 hover:text-black transition-colors"
                      >
                        Views / Likes{" "}
                        {sortField === "views" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSort("stars")}
                        className="py-3 px-2 hover:text-black transition-colors"
                      >
                        Stars{" "}
                        {sortField === "stars" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f4f5] text-[13px]">
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

                      return (
                        <tr
                          key={proj.id}
                          className={`transition-colors ${isEditing ? "bg-zinc-50/80" : "hover:bg-zinc-50/50"}`}
                        >
                          <td className="py-3.5 px-2">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-500 shrink-0">
                                  {projectFormState.name
                                    ? projectFormState.name[0]?.toUpperCase() ||
                                      "P"
                                    : "P"}
                                </div>
                                <input
                                  type="text"
                                  value={projectFormState.name}
                                  onChange={(e) =>
                                    setProjectFormState({
                                      ...projectFormState,
                                      name: e.target.value,
                                    })
                                  }
                                  className="rounded border border-zinc-200 px-2 py-0.5 text-[12px] font-bold text-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-zinc-300 w-28"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-500">
                                  {proj.name[0].toUpperCase()}
                                </div>
                                <span className="font-bold text-zinc-900">
                                  {proj.name}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-2 text-zinc-500">
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
                                className="rounded border border-zinc-200 px-2 py-0.5 text-[12px] text-zinc-600 bg-white focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-zinc-300 w-36"
                              />
                            ) : (
                              proj.stack
                            )}
                          </td>
                          <td className="py-3.5 px-2 text-zinc-650 font-semibold">
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
                                className="rounded border border-zinc-200 px-2 py-0.5 text-[12px] text-zinc-650 font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-zinc-300 w-24"
                              />
                            ) : (
                              proj.platform
                            )}
                          </td>
                          <td className="py-3.5 px-2 text-zinc-500">
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
                                  className="rounded border border-zinc-200 px-1 py-0.5 text-[12px] text-zinc-600 bg-white focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-zinc-300 w-16 text-center font-semibold"
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
                                  className="rounded border border-zinc-200 px-1 py-0.5 text-[12px] text-zinc-600 bg-white focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-zinc-300 w-14 text-center font-semibold"
                                  title="Likes"
                                />
                              </div>
                            ) : (
                              `${proj.views} / ${proj.likes}`
                            )}
                          </td>
                          <td className="py-3.5 px-2 text-zinc-500">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  value={projectFormState.stars}
                                  onChange={(e) =>
                                    setProjectFormState({
                                      ...projectFormState,
                                      stars: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="rounded border border-zinc-200 px-1.5 py-0.5 text-[12px] text-zinc-600 bg-white focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-zinc-300 w-14 text-center font-semibold"
                                />
                                <span className="text-zinc-400">★</span>
                              </div>
                            ) : (
                              `${proj.stars} ★`
                            )}
                          </td>
                          <td className="py-3.5 px-2">
                            {isEditing ? (
                              <select
                                value={projectFormState.status}
                                onChange={(e) =>
                                  setProjectFormState({
                                    ...projectFormState,
                                    status: e.target.value,
                                  })
                                }
                                className="rounded border border-zinc-200 px-1.5 py-0.5 text-[11px] font-bold text-zinc-800 bg-white focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-zinc-300 cursor-pointer"
                              >
                                <option value="Live">Live</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Archived">Archived</option>
                              </select>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: proj.statusColor }}
                                />
                                <span className="font-bold text-[12px] text-zinc-800">
                                  {proj.status}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-2 text-right">
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
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[#f4f4f5] hover:bg-zinc-200 text-[10px] font-bold text-zinc-700 rounded-lg transition-colors cursor-pointer"
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
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProject(proj);
                                    setProjectModalType("analytics");
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[#003c3a]/10 hover:bg-[#003c3a]/25 text-[10px] font-bold text-[#003c3a] rounded-lg transition-colors cursor-pointer"
                                >
                                  <BarChartIcon className="w-3.5 h-3.5 text-[#003c3a]" />
                                  <span>Analytics</span>
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
                          {plat.rating}
                        </p>
                        <p className="text-[9px] text-zinc-400">
                          Contest Rating
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
                      className="w-full py-1.5 bg-[#f4f4f5] hover:bg-[#eef2f6] text-[10px] font-bold text-zinc-600 rounded-lg flex items-center justify-center gap-1 transition-all disabled:opacity-50"
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
        </div>

        {/* Category 3: Skills & Academic Roadmap */}
        <div className="space-y-6">
          <SkillsSection projectsList={projectsList} />

          <div className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4">
            <h3 className="text-[15px] font-bold text-black tracking-tight">
              Active Courses
            </h3>
            <div className="space-y-3">
              {learningCourses.map((c) => (
                <div key={c.title} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[13px] font-bold text-black">
                        {c.title}
                      </p>
                      <p className="text-[10px] text-zinc-400">{c.provider}</p>
                    </div>
                    <span className="text-[13px] font-black text-black">
                      {c.pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

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

              <button className="w-full py-2.5 bg-black hover:bg-zinc-900 text-white rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5">
                <span>Generate Developer Wrapped</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category 4: Achievements & Timeline */}
        <div className="space-y-6">
          <div
            id="achievements"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4">
              <h3 className="text-[15px] font-bold text-black tracking-tight">
                Achievement Center
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {achievementBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className={`bg-white rounded-xl p-3 flex flex-col items-center justify-center gap-2 border border-zinc-100 ${badge.unlocked ? "" : "opacity-40 grayscale"}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black"
                      style={{
                        backgroundColor: badge.color + "15",
                        color: badge.color,
                      }}
                    >
                      {badge.icon}
                    </div>
                    <span className="text-[9px] font-bold text-zinc-500 text-center leading-tight">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-3 flex justify-between text-[11px] font-bold text-zinc-600">
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
                    className={`bg-white rounded-xl p-3 flex items-center justify-between border ${user.isYou ? "border-[#003c3a]" : "border-transparent"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-black text-zinc-400">
                        #{user.rank}
                      </span>
                      <span className="text-[12px] font-bold text-zinc-800">
                        {user.name}
                      </span>
                    </div>
                    <div className="flex gap-4 text-right text-[11px] font-bold text-zinc-500">
                      <span>{user.xp} XP</span>
                      <span className="text-black">{user.score} Score</span>
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

              {/* Smooth bottom fade-out overlay when not hovered */}
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

        <footer className="pt-4 border-t border-[#f4f4f5] flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-400 font-semibold">
          <div className="flex items-center gap-4">
            <span>Storage Used: 2.4 MB / 100 MB</span>
            <span>Last Sync: 2 min ago</span>
            <span>v0.1.3-beta</span>
          </div>
          <div className="flex items-center gap-4">
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
      </div>

      {/* Step 1: GitHub Repositories Selector Modal */}
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
              {!isGitHubConnected ? (
                /* Unauthenticated Direct GitHub OAuth Sign-In View */
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
                /* Connected Status & Repositories View */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-zinc-900 text-white flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <span className="text-xs font-extrabold text-white block">
                          Connected as @{connectedGitHubUsername}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          Public & Private Repositories Sync Active
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

                  {/* Filter Pills with Animated Sliding Indicator */}
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

              {/* Repos Grid */}
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
                        <div
                          key={repo.id}
                          onClick={() => handleSelectGitHubRepo(repo)}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 ${
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
                        </div>
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

      {/* Step 2: Main Project Form Modal */}
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
                    <option value="In Progress">In Progress</option>
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

      {/* Delete Confirmation Modal */}
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

      {/* Project Analytics Modal */}
      {projectModalType === "analytics" &&
        selectedProject &&
        (() => {
          const stats = getProjectMonthlyStats(selectedProject);
          const maxVal = Math.max(...stats.map((d) => d[analyticsMetric])) || 1;

          const points = stats.map((d, i) => ({
            x: (i / 11) * 500 + 40,
            y: 200 - (d[analyticsMetric] / maxVal) * 150 - 20,
            data: d,
          }));

          const pathD = points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ");
          const areaD = points.length
            ? `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`
            : "";

          const themeColor = selectedProject.statusColor || "#003c3a";

          return (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out text-left animate-fade-in">
              <div className="bg-white rounded-3xl border border-dashed border-zinc-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-scale-in text-left max-h-[90vh]">
                <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-[16px] font-extrabold text-black tracking-tight font-heading leading-tight">
                        {selectedProject.name} Analytics
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                        Performance Metrics & Traffic
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectModalType(null);
                      setSelectedProject(null);
                      setHoveredDataPoint(null);
                    }}
                    className="p-1.5 text-zinc-400 hover:text-zinc-650 hover:bg-zinc-50 rounded-xl transition-all duration-300 ease-in-out hover:scale-110 active:scale-90 cursor-pointer"
                  >
                    <Cross2Icon className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-4">
                    {(["views", "likes", "stars"] as const).map((metric) => {
                      const label =
                        metric === "views"
                          ? "Views"
                          : metric === "likes"
                            ? "Likes"
                            : "Stars";
                      const value = selectedProject[metric];
                      const isActive = analyticsMetric === metric;

                      return (
                        <button
                          key={metric}
                          type="button"
                          onClick={() => {
                            setAnalyticsMetric(metric);
                            setHoveredDataPoint(null);
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-950 border-transparent shadow-md"
                              : "bg-zinc-50 border-zinc-100 hover:border-zinc-200"
                          }`}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            {label}
                          </p>
                          <p
                            className={`text-xl font-extrabold mt-1 ${isActive ? "text-white" : "text-zinc-900"}`}
                          >
                            {value.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-emerald-500">
                            <span>↑ 12.4%</span>
                            <span
                              className={`${isActive ? "text-zinc-500" : "text-zinc-400"} font-normal`}
                            >
                              vs last mo.
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 relative">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[12px] font-bold text-zinc-700">
                        Monthly Trend ({analyticsMetric.toUpperCase()})
                      </p>
                      {hoveredDataPoint && (
                        <div className="text-[11px] font-bold text-zinc-900 bg-white border border-zinc-200 px-2 py-0.5 rounded-lg shadow-sm">
                          {hoveredDataPoint.month}:{" "}
                          <span
                            className="font-extrabold"
                            style={{ color: themeColor }}
                          >
                            {hoveredDataPoint[analyticsMetric].toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="w-full overflow-hidden select-none">
                      <svg
                        className="w-full h-60 overflow-visible"
                        viewBox="0 0 580 200"
                        onMouseLeave={() => setHoveredDataPoint(null)}
                      >
                        <defs>
                          <linearGradient
                            id="chartGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={themeColor}
                              stopOpacity="0.25"
                            />
                            <stop
                              offset="100%"
                              stopColor={themeColor}
                              stopOpacity="0.0"
                            />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        {[0, 1, 2, 3].map((g) => {
                          const y = 30 + g * 50;
                          return (
                            <line
                              key={g}
                              x1="40"
                              y1={y}
                              x2="540"
                              y2={y}
                              stroke="#e4e4e7"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                            />
                          );
                        })}

                        {/* Vertical Hover Guideline */}
                        {hoveredDataPoint &&
                          (() => {
                            const hp = points.find(
                              (p) => p.data.month === hoveredDataPoint.month,
                            );
                            if (!hp) return null;
                            return (
                              <line
                                x1={hp.x}
                                y1={20}
                                x2={hp.x}
                                y2={180}
                                stroke={themeColor}
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                                className="pointer-events-none transition-all duration-150"
                              />
                            );
                          })()}

                        {/* Area Fill */}
                        {areaD && (
                          <path
                            d={areaD}
                            fill="url(#chartGradient)"
                            className="transition-all duration-500 pointer-events-none"
                          />
                        )}

                        {/* Line Path */}
                        {pathD && (
                          <path
                            d={pathD}
                            fill="none"
                            stroke={themeColor}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-500 pointer-events-none"
                          />
                        )}

                        {/* Data Point Circles */}
                        {points.map((p, idx) => {
                          const isHovered =
                            hoveredDataPoint?.month === p.data.month;
                          return (
                            <circle
                              key={idx}
                              cx={p.x}
                              cy={p.y}
                              r={isHovered ? 6 : 4}
                              fill="white"
                              stroke={themeColor}
                              strokeWidth={isHovered ? "3.5" : "2.5"}
                              className="transition-all duration-150 pointer-events-none"
                            />
                          );
                        })}

                        {/* Tooltip Popup */}
                        {hoveredDataPoint &&
                          (() => {
                            const hp = points.find(
                              (p) => p.data.month === hoveredDataPoint.month,
                            );
                            if (!hp) return null;
                            const val =
                              hoveredDataPoint[
                                analyticsMetric
                              ].toLocaleString();
                            return (
                              <g className="pointer-events-none transition-all duration-200">
                                {/* Drop shadow indicator */}
                                <rect
                                  x={hp.x - 45}
                                  y={hp.y - 37}
                                  width="90"
                                  height="24"
                                  rx="6"
                                  fill="#18181b"
                                />
                                <text
                                  x={hp.x}
                                  y={hp.y - 22}
                                  textAnchor="middle"
                                  fill="white"
                                  fontSize="10"
                                  fontWeight="black"
                                >
                                  {val}
                                </text>
                                <polygon
                                  points={`${hp.x - 4},${hp.y - 13} ${hp.x + 4},${hp.y - 13} ${hp.x},${hp.y - 9}`}
                                  fill="#18181b"
                                />
                              </g>
                            );
                          })()}

                        {/* Invisible Hover overlay bars */}
                        {points.map((p, idx) => (
                          <rect
                            key={`hover-col-${idx}`}
                            x={p.x - 22.7}
                            y={15}
                            width={45.4}
                            height={170}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredDataPoint(p.data)}
                          />
                        ))}

                        {/* X Axis Labels */}
                        {points.map((p, idx) => (
                          <text
                            key={idx}
                            x={p.x}
                            y="195"
                            textAnchor="middle"
                            fill="#888"
                            fontSize="9"
                            fontWeight="bold"
                            className="pointer-events-none"
                          >
                            {p.data.month}
                          </text>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
