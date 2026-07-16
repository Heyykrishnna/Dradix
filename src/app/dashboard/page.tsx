"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  CalendarIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  UpdateIcon,
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

import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";

const initialDevStats = {
  score: 92,
  contributions: 1487,
  problemsSolved: 1250,
  streak: 42,
  projects: 19,
  liveProjects: 4,
  repositories: 52,
  publicRepos: 12,
  followers: 624,
  stars: 382,
  pullRequests: 145,
  issuesClosed: 81,
  hackathons: 8,
  wins: 2,
  certificates: 12,
};

const codingPlatforms = [
  {
    name: "LeetCode",
    rating: 2156,
    rank: "Guardian",
    solved: 847,
    color: "#f59e0b",
    streak: 42,
    history: [1, 2, 1, 3, 2],
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/leetcode.svg",
  },
  {
    name: "Codeforces",
    rating: 1742,
    rank: "Specialist",
    solved: 312,
    color: "#3b82f6",
    streak: 18,
    history: [2, 3, 1, 2, 1],
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codeforces.svg",
  },
  {
    name: "CodeChef",
    rating: 1920,
    rank: "4 Star",
    solved: 91,
    color: "#f43f5e",
    streak: 7,
    history: [1, 1, 2, 1, 2],
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codechef.svg",
  },
  {
    name: "AtCoder",
    rating: 1420,
    rank: "2 Star",
    solved: 55,
    color: "#005c58",
    streak: 0,
    history: [1, 0, 1, 2, 0],
    logo: "https://user-images.githubusercontent.com/63050133/151978980-3e677a92-60b0-4ae7-b1ce-2bd00ab3fe85.svg",
  },
  {
    name: "HackerRank",
    rating: 2100,
    rank: "5 Star",
    solved: 180,
    color: "#34d399",
    streak: 12,
    history: [2, 1, 2, 1, 1],
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hackerrank.svg",
  },
  {
    name: "GeeksforGeeks",
    rating: 1850,
    rank: "Expert",
    solved: 120,
    color: "#10b981",
    streak: 5,
    history: [1, 2, 1, 1, 2],
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/geeksforgeeks.svg",
  },
];

const initialProjectsList = [
  {
    id: "#875412903",
    name: "dradix",
    creator: "Yatharth K.",
    stack: "Next.js, TS",
    platform: "GitHub",
    date: "05 Oct, 2025",
    status: "Live",
    statusColor: "#005c58",
    views: 4821,
    likes: 89,
    stars: 127,
  },
  {
    id: "#458729654",
    name: "algo-vault",
    creator: "Yatharth K.",
    stack: "Python, React",
    platform: "Vercel",
    date: "05 Oct, 2025",
    status: "In Progress",
    statusColor: "#f59e0b",
    views: 2100,
    likes: 62,
    stars: 89,
  },
  {
    id: "#913562478",
    name: "rustify",
    creator: "Yatharth K.",
    stack: "Rust, Wasm",
    platform: "GitHub",
    date: "05 Oct, 2025",
    status: "Archived",
    statusColor: "#ef4444",
    views: 890,
    likes: 41,
    stars: 54,
  },
  {
    id: "#324561327",
    name: "dradix-cli",
    creator: "Yatharth K.",
    stack: "Go, Cobra",
    platform: "npm",
    date: "15 Sep, 2025",
    status: "Live",
    statusColor: "#005c58",
    views: 1200,
    likes: 32,
    stars: 15,
  },
];

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

const skillsList = [
  {
    name: "TypeScript",
    level: "Advanced",
    pct: 90,
    color: "#3b82f6",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    relatedProjects: ["dradix", "dradix-cli"],
  },
  {
    name: "React",
    level: "Advanced",
    pct: 88,
    color: "#61dafb",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    relatedProjects: ["dradix", "algo-vault"],
  },
  {
    name: "Next.js",
    level: "Advanced",
    pct: 85,
    color: "#18181b",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    relatedProjects: ["dradix"],
  },
  {
    name: "Node.js",
    level: "Advanced",
    pct: 80,
    color: "#5fa04e",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    relatedProjects: ["dradix", "algo-vault"],
  },
  {
    name: "Python",
    level: "Intermediate",
    pct: 72,
    color: "#f59e0b",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    relatedProjects: ["algo-vault"],
  },
  {
    name: "Rust",
    level: "Intermediate",
    pct: 55,
    color: "#f43f5e",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
    relatedProjects: ["rustify"],
  },
  {
    name: "Go",
    level: "Beginner",
    pct: 40,
    color: "#00add8",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
    relatedProjects: ["dradix-cli"],
  },
  {
    name: "Docker",
    level: "Intermediate",
    pct: 65,
    color: "#2496ed",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    relatedProjects: ["dradix", "rustify"],
  },
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

const timelineMilestones = [
  {
    date: "Jan 2024",
    title: "Joined Dradix",
    desc: "Started tracking developer journey",
    color: "#005c58",
  },
  {
    date: "Feb 2024",
    title: "Connected GitHub",
    desc: "Synced 52 repositories",
    color: "#3b82f6",
  },
  {
    date: "Mar 2024",
    title: "Completed First Project",
    desc: "Launched dradix beta publicly",
    color: "#f59e0b",
  },
  {
    date: "Apr 2024",
    title: "Solved 100 Problems",
    desc: "Hit the milestone on LeetCode",
    color: "#005c58",
  },
];

const careerRings = [
  { label: "Resume Score", value: 82, color: "#005c58" },
  { label: "Portfolio Score", value: 75, color: "#3b82f6" },
  { label: "Dev Score", value: 92, color: "#f59e0b" },
  { label: "Placement Readiness", value: 72, color: "#f43f5e" },
  { label: "Interview Readiness", value: 68, color: "#3b82f6" },
  { label: "System Design Level", value: 58, color: "#005c58" },
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

function SkillsSection() {
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
        {skillsList.map((skill) => {
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
              className={`relative shrink-0 flex flex-col items-center gap-2 rounded-2xl px-4 py-4 w-[110px] transition-all duration-300 cursor-pointer ${
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
            <SkillProjectPanel activeSkill={renderedSkill} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillProjectPanel({ activeSkill }: { activeSkill: string | null }) {
  if (!activeSkill) return null;
  const skill = skillsList.find((s) => s.name === activeSkill);
  if (!skill) return null;
  const projects = initialProjectsList.filter((p) =>
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
        <div className="ml-auto w-full max-w-[160px] h-2 bg-zinc-100 rounded-full overflow-hidden">
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

export default function DashboardPage() {
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
      setNotifications((prev) => {
        const updated = [
          {
            text: "Dynamic sync check completed: All systems normal",
            time: "Just now",
            type: "sync",
          },
          ...prev,
        ];
        localStorage.setItem("dradix_notifications", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
        return updated;
      });
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

  const sortedProjects = [...initialProjectsList]
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      <div className="lg:col-span-1 space-y-6">
        <div
          id="overview"
          className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4"
        >
          <h2 className="text-[16px] font-bold text-black tracking-tight">
            Performance Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                Dev Score
              </p>
              <p className="text-[18px] font-black text-black mt-1">
                {initialDevStats.score}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                Contributions
              </p>
              <p className="text-[18px] font-black text-black mt-1">
                {initialDevStats.contributions}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                Problems
              </p>
              <p className="text-[18px] font-black text-black mt-1">
                {initialDevStats.problemsSolved}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">
                Streak
              </p>
              <p className="text-[18px] font-black text-black mt-1">
                {initialDevStats.streak} Days
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
                {initialDevStats.projects} Projects (
                {initialDevStats.liveProjects} Live)
              </span>
              <ChevronRightIcon className="w-4 h-4 text-zinc-400" />
            </button>
            <button className="w-full bg-white rounded-xl p-3 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
              <span className="text-[12px] font-semibold text-zinc-700">
                {initialDevStats.repositories} Repos (
                {initialDevStats.publicRepos} Public)
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
          <div className="w-full max-w-[160px] aspect-square relative flex items-center justify-center bg-white/40 rounded-2xl p-4">
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-black tracking-tight font-heading">
                    Weekly Activity
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Hours coded & commits pushed
                  </p>
                </div>
                <div className="flex bg-white rounded-lg p-0.5 gap-0.5 text-[9px] font-bold">
                  {["Daily", "Weekly", "Monthly", "Yearly"].map((t) => (
                    <button
                      key={t}
                      onClick={() =>
                        setActiveActivityToggle(
                          t as "Daily" | "Weekly" | "Monthly" | "Yearly",
                        )
                      }
                      className={`px-2 py-1 rounded ${activeActivityToggle === t ? "bg-black text-white" : "text-zinc-500 hover:text-zinc-800"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyActivityData}
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
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-black tracking-tight font-heading">
                  Projects
                </h2>
                <span className="text-[11px] font-bold text-zinc-400 bg-[#f4f4f5] rounded-full px-2 py-0.5">
                  19 Total
                </span>
              </div>

              <div className="flex items-center gap-1 bg-[#f4f4f5] rounded-xl p-1">
                {["All", "Live", "In Progress", "Archived"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                      activeTab === tab
                        ? "bg-black text-white"
                        : "text-zinc-500 hover:text-zinc-950"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

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
                  {sortedProjects.map((proj) => (
                    <tr
                      key={proj.id}
                      className="hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-500">
                            {proj.name[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-zinc-900">
                            {proj.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-zinc-500">
                        {proj.stack}
                      </td>
                      <td className="py-3.5 px-2 text-zinc-600 font-semibold">
                        {proj.platform}
                      </td>
                      <td className="py-3.5 px-2 text-zinc-500">
                        {proj.views} / {proj.likes}
                      </td>
                      <td className="py-3.5 px-2 text-zinc-500">
                        {proj.stars} ★
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: proj.statusColor }}
                          />
                          <span className="font-bold text-[12px] text-zinc-800">
                            {proj.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="px-2.5 py-1 bg-[#f4f4f5] hover:bg-[#eef2f6] text-[10px] font-bold text-zinc-700 rounded-lg transition-colors">
                            Edit
                          </button>
                          <button className="px-2.5 py-1 bg-[#f4f4f5] hover:bg-[#eef2f6] text-[10px] font-bold text-zinc-700 rounded-lg transition-colors">
                            Delete
                          </button>
                          <button className="px-2.5 py-1 bg-[#f4f4f5] hover:bg-[#eef2f6] text-[10px] font-bold text-zinc-700 rounded-lg transition-colors">
                            Analytics
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            id="platforms"
            className="bg-[#f4f4f5] rounded-[24px] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-black tracking-tight font-heading">
                Coding Platforms
              </h3>
              <span className="text-[11px] font-bold text-zinc-400 bg-white rounded-full px-2.5 py-0.5">
                6 Connected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {codingPlatforms.map((plat) => (
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
                        <p className="text-[10px] text-zinc-400">{plat.rank}</p>
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
                      <p className="text-[9px] text-zinc-400">Contest Rating</p>
                    </div>
                    <div className="flex gap-0.5 items-end h-6">
                      {plat.history.map((h, i) => (
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
          </div>
        </div>

        {/* Category 3: Skills & Academic Roadmap */}
        <div className="space-y-6">
          <SkillsSection />

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
                {careerRings.map((r) => (
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
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-zinc-200" />
                {timelineMilestones.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div
                      className="absolute left-[-23px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2"
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

            <div className="group/notif-card bg-[#f4f4f5] rounded-[24px] p-5 border border-transparent hover:border-zinc-200 hover:bg-white hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col h-[300px] hover:h-[520px] overflow-hidden relative">
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
    </div>
  );
}
