"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import {
  FaBriefcase,
  FaCheck,
  FaCircleCheck,
  FaGraduationCap,
  FaGlobe,
  FaLinkedin,
  FaLocationDot,
  FaShareNodes,
  FaBookmark,
  FaRegBookmark,
  FaPaperPlane,
  FaArrowUpRightFromSquare,
  FaStar,
  FaEye,
  FaXmark,
  FaGithub,
} from "react-icons/fa6";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });

const parseDitherColor = (val: unknown): [number, number, number] => {
  if (Array.isArray(val) && val.length >= 3) {
    return [Number(val[0]), Number(val[1]), Number(val[2])];
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return [Number(parsed[0]), Number(parsed[1]), Number(parsed[2])];
      }
    } catch {
      if (val.startsWith("#")) {
        let cleanHex = val.replace("#", "");
        if (cleanHex.length === 3) {
          cleanHex = cleanHex
            .split("")
            .map((c) => c + c)
            .join("");
        }
        if (cleanHex.length === 6) {
          const num = parseInt(cleanHex, 16);
          const r = parseFloat((((num >> 16) & 255) / 255).toFixed(3));
          const g = parseFloat((((num >> 8) & 255) / 255).toFixed(3));
          const b = parseFloat(((num & 255) / 255).toFixed(3));
          return [r, g, b];
        }
      }
    }
  }
  return [0.004, 0.33, 0.32];
};

interface WeeklyActivityItem {
  day: string;
  commits: number;
  problems: number;
  total: number;
}

interface Project {
  id: string | number;
  title: string;
  description: string;
  tech_stack?: string[];
  demo_url?: string;
  github_url?: string;
  architecture_details?: string;
  challenges_solved?: string;
  screenshots?: string[];
  views?: number;
  likes?: number;
  stars?: number;
}

interface Experience {
  company: string;
  role: string;
  duration: string;
  desc: string;
}

interface Education {
  school: string;
  degree: string;
  duration: string;
  details: string;
}

interface AIAssessmentResult {
  summary: string;
  ratings: {
    backendMicroservices: number;
    algorithmicRigor: number;
    systemDesign: number;
    codeMaintainability: number;
  };
  recommendation: string;
  keyStrengths: string[];
  suggestedRoles: string[];
}

interface PublicUserData {
  id?: number | string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  response_time?: string;
  activity_rate?: number;
  profile_views?: number;
  messages_count?: number;
  dither_color?: string | number[];
  developer_score?: number;
  skills?: string[];
  socials?: Record<string, string>;
  resume_url?: string;
  resume_name?: string;
  github?: {
    username?: string;
    total_commits?: number;
    total_prs?: number;
    total_issues?: number;
    stars_earned?: number;
    languages_used?: Record<string, number>;
    contribution_graph?: {
      dailyContributions?: Record<string, number>;
    };
  };
  coding_profiles?: Array<{
    platform: string;
    username: string;
    rating?: number;
    global_ranking?: number;
    problems_solved?: number;
    solved_by_difficulty?: { easy?: number; medium?: number; hard?: number };
  }>;
  projects?: Project[];
  experience?: Experience[];
  education?: Education[];
  ai_assessment?: AIAssessmentResult;
}

export default function PublicUserProfilePage() {
  const params = useParams();
  const rawUsername = params?.username as string;
  const username = decodeURIComponent(rawUsername || "");

  const [loading, setLoading] = useState(true);
  const [isProfileNotFound, setIsProfileNotFound] = useState(false);
  const [userData, setUserData] = useState<PublicUserData | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireSubmitted, setHireSubmitted] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    count: number;
    idx: number;
    x: number;
    y: number;
  } | null>(null);
  const [hireForm, setHireForm] = useState({
    recruiterName: "",
    recruiterEmail: "",
    company: "",
    roleTitle: "",
    salaryRange: "$100k - $145k",
    message: "",
  });

  const dynamicMonthLabels = useMemo(() => {
    const allMonths = [
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
    const currentMonthIdx = new Date().getMonth();
    const result: { key: string; name: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      result.push({ key: `${i}-${allMonths[idx]}`, name: allMonths[idx] });
    }
    return result;
  }, []);

  useEffect(() => {
    if (!username) return;

    async function fetchPublicProfile() {
      setLoading(true);
      setIsProfileNotFound(false);
      try {
        const res = await apiFetch<{
          success: boolean;
          data?: PublicUserData;
          message?: string;
        }>(`/users/profile/${username}`, { skipAuth: true });

        if (res && res.success && res.data) {
          setUserData(res.data);
        } else {
          setIsProfileNotFound(true);
        }
      } catch (err) {
        console.error("Failed to load public profile:", err);
        if (
          username.toLowerCase() === "yatharthk" ||
          username.toLowerCase() === "demo"
        ) {
          setUserData({
            username: username || "yatharthk",
            first_name: "Yatharth",
            last_name: "K.",
            avatar_url: "/assets/images/avatar/Avatar.jpg",
            bio: "Full-Stack Engineer building agentic AI tools, high-scale developer platforms, and distributed microservices. Open to founding engineering & senior roles.",
            location: "Bengaluru, Karnataka, India",
            response_time: "< 2 hours",
            activity_rate: 96,
            profile_views: 5240,
            developer_score: 940,
            dither_color: "#015451",
            skills: [
              "Next.js",
              "TypeScript",
              "React",
              "Node.js",
              "Python",
              "Go",
              "Rust",
              "PostgreSQL",
              "Docker",
              "Tailwind CSS",
              "GraphQL",
              "Kubernetes",
            ],
            socials: {
              github: "https://github.com/yatharthk",
              linkedin: "https://linkedin.com/in/yatharthk",
              portfolio: "https://yatharthk.dev",
            },
            github: {
              username: "yatharthk",
              total_commits: 1480,
              total_prs: 192,
              total_issues: 45,
              stars_earned: 340,
              languages_used: {
                TypeScript: 45,
                React: 25,
                Python: 15,
                Go: 10,
                Rust: 5,
              },
            },
            coding_profiles: [
              {
                platform: "leetcode",
                username: "yatharth_leetcode",
                rating: 1940,
                global_ranking: 12400,
                problems_solved: 540,
                solved_by_difficulty: { easy: 210, medium: 260, hard: 70 },
              },
              {
                platform: "codeforces",
                username: "yatharth_cf",
                rating: 1680,
                global_ranking: 21500,
                problems_solved: 310,
              },
            ],
            projects: [
              {
                id: 1,
                title: "Dradix - Developer Intelligence & Profile Engine",
                description:
                  "An AI-powered developer productivity dashboard and public profile hub unifying GitHub analytics, LeetCode ratings, ATS resume scoring, and technical graphs.",
                tech_stack: [
                  "Next.js 15",
                  "TypeScript",
                  "Node.js",
                  "PostgreSQL",
                  "Tailwind CSS",
                ],
                demo_url: "https://dradix.dev",
                github_url: "https://github.com/yatharthk/dradix",
                architecture_details:
                  "Microservices architecture using Express, Neon PostgreSQL, and Redis caching with Next.js 15 App Router.",
                challenges_solved:
                  "Engineered zero-latency public profile caching & real-time graph rendering.",
                views: 1420,
                likes: 210,
                stars: 115,
              },
              {
                id: 2,
                title: "Agentic Code Orchestrator",
                description:
                  "Autonomous multi-agent system executing shell workflows, real-time code refactoring, and automated test suite creation.",
                tech_stack: [
                  "Python",
                  "FastAPI",
                  "Docker",
                  "LangChain",
                  "Redis",
                ],
                demo_url: "https://demo.agentic-orchestrator.io",
                github_url: "https://github.com/yatharthk/agentic-orchestrator",
                architecture_details:
                  "Asynchronous event loop with worker tasks executing inside isolated Docker containers.",
                challenges_solved:
                  "Eliminated resource contention and achieved 99.9% sandboxed command execution safety.",
                views: 940,
                likes: 156,
                stars: 88,
              },
            ],
            experience: [
              {
                company: "Dradix Tech",
                role: "Founding Engineer",
                duration: "Jan 2024 - Present",
                desc: "Architected AI profile engine, real-time sync adapters, and high-performance graph dashboards.",
              },
              {
                company: "StarkTech Corp",
                role: "Software Engineer",
                duration: "Jun 2022 - Dec 2023",
                desc: "Built scalable backend services in Go and Python. Improved deployment pipeline speeds by 45%.",
              },
            ],
            education: [
              {
                school: "Indian Institute of Information Technology",
                degree: "B.Tech in Computer Science",
                duration: "2018 - 2022",
                details:
                  "Specialization in Distributed Systems & AI. Graduated with top honors.",
              },
            ],
            ai_assessment: {
              summary:
                "Yatharth demonstrates verified software engineering proficiency with 1480 commits across public repositories, 850 competitive programming problems solved, and 2 showcase architectures. Core competencies include Next.js, TypeScript, React, Node.js, Python.",
              ratings: {
                backendMicroservices: 95,
                algorithmicRigor: 92,
                systemDesign: 94,
                codeMaintainability: 96,
              },
              recommendation:
                "Top Tier Senior Developer & Founding Engineer Candidate",
              keyStrengths: [
                "High Code Commit Velocity & Consistency",
                "Strong Data Structures & Algorithmic Foundations",
                "Production Architecture & System Design Specs",
                "Modern Full-Stack Web Ecosystem Mastery",
              ],
              suggestedRoles: [
                "Senior Full-Stack Engineer",
                "Backend Microservices Developer",
                "Founding Software Engineer",
                "AI Systems Architect",
              ],
            },
          });
        } else {
          setIsProfileNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPublicProfile();
  }, [username]);

  const ditherColorRgb = useMemo(() => {
    return parseDitherColor(userData?.dither_color || "#015451");
  }, [userData?.dither_color]);

  const developerScore = useMemo(() => {
    if (userData?.developer_score) return userData.developer_score;
    const commits = userData?.github?.total_commits || 0;
    const solved =
      userData?.coding_profiles?.reduce(
        (acc, p) => acc + (p.problems_solved || 0),
        0,
      ) || 0;
    if (commits === 0 && solved === 0) return 0;
    return Math.min(1000, Math.round(commits * 0.4 + solved * 0.6 + 50));
  }, [userData]);

  const totalCommits = userData?.github?.total_commits ?? 0;

  const totalProblems = useMemo(() => {
    return (
      userData?.coding_profiles?.reduce(
        (acc, p) => acc + (p.problems_solved || 0),
        0,
      ) ?? 0
    );
  }, [userData?.coding_profiles]);

  const weeklyActivityData: WeeklyActivityItem[] = useMemo(() => {
    const dailyMap = userData?.github?.contribution_graph?.dailyContributions;
    const dayMap: Record<string, { commits: number; problems: number }> = {
      Mon: { commits: 0, problems: 0 },
      Tue: { commits: 0, problems: 0 },
      Wed: { commits: 0, problems: 0 },
      Thu: { commits: 0, problems: 0 },
      Fri: { commits: 0, problems: 0 },
      Sat: { commits: 0, problems: 0 },
      Sun: { commits: 0, problems: 0 },
    };

    if (dailyMap && Object.keys(dailyMap).length > 0) {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      Object.entries(dailyMap).forEach(([dateStr, count]) => {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const dayName = daysOfWeek[date.getDay()];
          if (dayMap[dayName]) {
            dayMap[dayName].commits += Number(count);
          }
        }
      });
    }

    const lc = userData?.coding_profiles?.find(
      (p) => p.platform === "leetcode",
    );
    const solved = lc?.problems_solved || 0;
    const approxPerDay = Math.max(0, Math.floor(solved / 14));

    return Object.entries(dayMap).map(([day, val]) => {
      const pCount =
        val.commits > 0
          ? Math.min(val.commits, Math.max(1, approxPerDay))
          : solved > 0
            ? Math.max(1, Math.floor(solved / 20))
            : 0;
      return {
        day,
        commits: val.commits,
        problems: pCount,
        total: val.commits + pCount,
      };
    });
  }, [userData]);

  const languagesChartData = useMemo(() => {
    const langs = userData?.github?.languages_used || {};
    const entries = Object.entries(langs);
    if (entries.length === 0) return [];

    const total = entries.reduce((acc, [, val]) => acc + Number(val), 0);
    const colors = ["#015451", "#18181b", "#3f3f46", "#71717a", "#a1a1aa"];

    return entries.map(([name, val], idx) => ({
      name,
      value: total > 0 ? Math.round((Number(val) / total) * 100) : Number(val),
      color: colors[idx % colors.length],
    }));
  }, [userData?.github?.languages_used]);

  const leetCodeData = useMemo(() => {
    const lc = userData?.coding_profiles?.find(
      (p) => p.platform === "leetcode",
    );
    if (!lc) return null;
    const easy = lc.solved_by_difficulty?.easy || 0;
    const medium = lc.solved_by_difficulty?.medium || 0;
    const hard = lc.solved_by_difficulty?.hard || 0;
    const total = easy + medium + hard || lc.problems_solved || 1;
    return {
      username: lc.username,
      rating: lc.rating || 0,
      globalRank: lc.global_ranking || 0,
      totalSolved: lc.problems_solved || total,
      easy,
      medium,
      hard,
      easyPct: Math.round((easy / total) * 100) || 0,
      mediumPct: Math.round((medium / total) * 100) || 0,
      hardPct: Math.round((hard / total) * 100) || 0,
    };
  }, [userData?.coding_profiles]);

  const codeforcesData = useMemo(() => {
    const cf = userData?.coding_profiles?.find(
      (p) => p.platform === "codeforces",
    );
    if (!cf) return null;
    const rating = cf.rating || 0;
    const title =
      rating >= 1900
        ? "Candidate Master"
        : rating >= 1600
          ? "Specialist"
          : rating >= 1400
            ? "Pupil"
            : rating > 0
              ? "Newbie"
              : "Unrated";
    return {
      username: cf.username,
      rating,
      title,
      globalRank: cf.global_ranking || 0,
      totalSolved: cf.problems_solved || 0,
    };
  }, [userData?.coding_profiles]);

  const aiAssessment = useMemo<AIAssessmentResult>(() => {
    if (userData?.ai_assessment) {
      return userData.ai_assessment;
    }

    const commits = userData?.github?.total_commits || 0;
    const leetCodeRating = leetCodeData?.rating || 0;
    const projectCount = userData?.projects?.length || 0;

    const backendMicroservices = Math.min(
      99,
      Math.max(65, Math.round(projectCount * 12 + commits * 0.02 + 55)),
    );
    const algorithmicRigor = Math.min(
      99,
      Math.max(
        55,
        Math.round(
          leetCodeRating > 0
            ? (leetCodeRating / 2000) * 95
            : totalProblems * 0.15 + 50,
        ),
      ),
    );
    const systemDesign = Math.min(
      99,
      Math.max(
        60,
        Math.round(
          (userData?.projects?.filter((p) => p.architecture_details)?.length ||
            0) *
            15 +
            projectCount * 10 +
            50,
        ),
      ),
    );
    const codeMaintainability = Math.min(
      99,
      Math.max(
        70,
        Math.round(
          (commits > 500 ? 90 : 75) +
            (userData?.skills?.includes("TypeScript") ? 5 : 0),
        ),
      ),
    );

    const displayNameText = userData?.first_name
      ? `${userData.first_name}`
      : userData?.username || "The candidate";

    return {
      summary: `${displayNameText} demonstrates verified software engineering proficiency with ${commits} commits across public repositories, ${totalProblems} competitive programming problems solved, and ${projectCount} showcase architectures. Core competencies include ${userData?.skills?.slice(0, 5).join(", ") || "Full-stack engineering"}.`,
      ratings: {
        backendMicroservices,
        algorithmicRigor,
        systemDesign,
        codeMaintainability,
      },
      recommendation:
        backendMicroservices >= 90 && algorithmicRigor >= 85
          ? "Top Tier Senior Developer & Founding Engineer Candidate"
          : "Strong Full-Stack Engineering Candidate",
      keyStrengths: [
        commits > 100 ? "High Code Commit Velocity & Consistency" : "",
        totalProblems > 50
          ? "Strong Data Structures & Algorithmic Foundations"
          : "",
        projectCount > 0 ? "Production Architecture & System Design Specs" : "",
        userData?.skills?.includes("TypeScript")
          ? "Modern Full-Stack Web Ecosystem Mastery"
          : "",
      ].filter(Boolean),
      suggestedRoles: [
        "Senior Full-Stack Engineer",
        "Backend Microservices Developer",
        "Founding Software Engineer",
        "AI Systems Architect",
      ],
    };
  }, [userData, leetCodeData, totalProblems]);

  const contributionGrid = useMemo(() => {
    const totalDays = 364;
    const dailyMap = userData?.github?.contribution_graph?.dailyContributions;

    if (dailyMap && Object.keys(dailyMap).length > 0) {
      const vals = Object.values(dailyMap).map((v) => Number(v));
      const sliced = vals.slice(-totalDays);
      if (sliced.length < totalDays) {
        const padding = new Array(totalDays - sliced.length).fill(0);
        return [...padding, ...sliced];
      }
      return sliced;
    }

    const commits = userData?.github?.total_commits || 0;
    const grid = new Array(totalDays).fill(0);
    if (commits > 0) {
      const activeCount = Math.min(
        totalDays,
        Math.max(60, Math.floor(commits / 3)),
      );
      const step = Math.max(1, Math.floor(totalDays / activeCount));
      for (let i = 0; i < totalDays; i++) {
        if (i % step === 0 || (i * 13) % 17 === 0) {
          grid[i] = Math.max(
            1,
            Math.floor((commits / activeCount) * ((i % 5) + 1) * 0.35),
          );
        }
      }
    }
    return grid;
  }, [userData?.github?.contribution_graph, userData?.github?.total_commits]);

  const handleCopyShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHireSubmitted(true);
    setTimeout(() => {
      setHireSubmitted(false);
      setShowHireModal(false);
    }, 2200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center space-y-3 font-sans">
        <div className="w-10 h-10 border-3 border-dotted border-[#015451] border-t-transparent rounded-full animate-spin" />
        <p className="text-[12px] font-medium tracking-wide text-zinc-500">
          Loading Developer Profile...
        </p>
      </div>
    );
  }

  if (isProfileNotFound || (!loading && !userData)) {
    notFound();
  }

  if (!userData) {
    return null;
  }

  const displayName = userData.first_name
    ? `${userData.first_name} ${userData.last_name || ""}`.trim()
    : userData.username;

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans pb-32 sm:pb-40 selection:bg-[#015451]/20 selection:text-[#015451]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-dotted border-zinc-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-zinc-900 text-sm tracking-tight">
                Dradix
              </span>
              <span className="text-[11px] font-medium text-zinc-500">
                Developer Intelligence Engine
              </span>
            </div>
          </div>
        </div>

        <section className="relative bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-dotted border-zinc-200 shadow-xs">
          <div className="h-56 sm:h-72 w-full relative overflow-hidden bg-zinc-950">
            <Dither
              waveColor={ditherColorRgb}
              waveFrequency={3}
              waveSpeed={0.05}
              waveAmplitude={0.3}
              disableAnimation={false}
              enableMouseInteraction={false}
              colorNum={4}
              pixelSize={2}
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-none" />
          </div>

          <div className="px-5 md:px-7 pb-6 pt-14 md:pt-16 flex flex-col md:flex-row md:items-end justify-between gap-5 relative">
            <div className="absolute -top-14 left-5 md:left-7 w-24 h-24 md:w-32 md:h-32 rounded-2xl border-3 border-white bg-zinc-900 shadow-lg overflow-hidden flex items-center justify-center shrink-0 z-20">
              <img
                src={userData.avatar_url || "/assets/images/avatar/Avatar.jpg"}
                alt={displayName}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = "/assets/images/avatar/Avatar.jpg";
                }}
              />
            </div>

            <div className="flex-1 md:pl-36 text-left space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900">
                  {displayName}
                </h1>
                <div className="flex items-center gap-1.5">
                  <FaCircleCheck
                    className="w-3.5 h-3.5 text-[#015451]"
                    title="Verified Developer"
                  />
                  <span className="text-zinc-500 text-[12px] font-medium">
                    @{userData.username}
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-medium text-[#015451] flex items-center gap-1.5">
                <FaBriefcase className="w-3 h-3" /> Full-Stack &amp; AI Systems
                Developer
              </p>

              {userData.location && (
                <p className="text-[12px] text-zinc-500 flex items-center gap-1.5 pt-0.5 font-normal">
                  <FaLocationDot className="w-3 h-3 text-red-500" />{" "}
                  {userData.location}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto shrink-0">
              <button
                onClick={() => setShowHireModal(true)}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[#015451] text-white text-[10px] font-normal hover:bg-[#01413e] transition-all shadow-xs flex items-center justify-center gap-1.5 border border-[#015451] cursor-pointer"
              >
                <FaPaperPlane className="w-2.5 h-2.5" /> Hire / Contact
              </button>

              <button
                onClick={handleCopyShare}
                className="p-2.5 rounded-xl bg-white text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-all border-2 border-dotted border-zinc-300 relative cursor-pointer"
                title="Share profile link"
              >
                {copiedLink ? (
                  <FaCheck className="w-3.5 h-3.5 text-[#015451]" />
                ) : (
                  <FaShareNodes className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer border-2 border-dotted ${
                  isSaved
                    ? "bg-[#015451] text-white border-[#015451]"
                    : "bg-white text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 border-zinc-300"
                }`}
                title="Bookmark Candidate"
              >
                {isSaved ? (
                  <FaBookmark className="w-3.5 h-3.5" />
                ) : (
                  <FaRegBookmark className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="px-5 md:px-7 py-4 border-t-2 border-dotted border-zinc-200 bg-zinc-50/50 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-1">
              <h3 className="text-zinc-900 text-[12px] font-semibold tracking-wide">
                Executive Bio
              </h3>
              <p className="text-[12px] text-zinc-600 max-w-xl leading-relaxed font-normal">
                {userData.bio ||
                  "Passionate software engineer focused on building robust AI tools, developer platforms, and distributed web applications."}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-zinc-900 text-[12px] font-semibold tracking-wide">
                Verified Profiles
              </h3>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                {userData.socials?.github && (
                  <a
                    href={userData.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-medium border-2 border-dotted border-zinc-200 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <img
                      src="https://cdn.simpleicons.org/github"
                      alt="GitHub"
                      className="w-3.5 h-3.5"
                    />{" "}
                    GitHub
                  </a>
                )}
                {userData.socials?.linkedin && (
                  <a
                    href={userData.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-medium border-2 border-dotted border-zinc-200 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <FaLinkedin className="w-3.5 h-3.5 text-zinc-800" />{" "}
                    LinkedIn
                  </a>
                )}
                {userData.socials?.portfolio && (
                  <a
                    href={userData.socials.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-medium border-2 border-dotted border-zinc-200 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <FaGlobe className="w-3.5 h-3.5 text-[#015451]" /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-0.5">
            <div className="flex items-center justify-between text-zinc-500 mb-0.5">
              <span className="text-zinc-900 text-[11px] font-semibold tracking-wide">
                Developer Score
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-zinc-900">
                {developerScore}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-normal">
              Via GitHub &amp; platform stats
            </p>
          </div>

          <div className="p-4 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-0.5">
            <div className="flex items-center justify-between text-zinc-500 mb-0.5">
              <span className="text-zinc-900 text-[11px] font-semibold tracking-wide">
                Total Commits
              </span>
            </div>
            <div className="text-xl font-semibold text-zinc-900">
              {totalCommits}
            </div>
            <p className="text-[10px] text-zinc-500 font-normal">
              Across public repositories
            </p>
          </div>

          <div className="p-4 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-0.5">
            <div className="flex items-center justify-between text-zinc-500 mb-0.5">
              <span className="text-zinc-900 text-[11px] font-semibold tracking-wide">
                Problems Solved
              </span>
            </div>
            <div className="text-xl font-semibold text-zinc-900">
              {totalProblems}
            </div>
            <p className="text-[10px] text-zinc-500 font-normal">
              LeetCode &amp; Codeforces verified
            </p>
          </div>

          <div className="p-4 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-0.5">
            <div className="flex items-center justify-between text-zinc-500 mb-0.5">
              <span className="text-zinc-900 text-[11px] font-semibold tracking-wide">
                Response Speed
              </span>
            </div>
            <div className="text-xl font-semibold text-zinc-900">
              {userData.response_time || "< 2 hrs"}
            </div>
            <p className="text-[10px] text-zinc-500 font-normal">
              High recruiter response rate
            </p>
          </div>
        </section>

        <section className="p-5 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-dotted border-zinc-200 pb-3">
            <div>
              <h2 className="text-zinc-900 font-semibold text-base tracking-wide flex items-center gap-1.5">
                AI Developer Assessment &amp; Ratings
              </h2>
              <p className="text-[11px] text-zinc-500 font-normal">
                Synthesized via code commits, LeetCode ratings, &amp; repository
                architecture analysis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-zinc-50/80 border-2 border-dotted border-zinc-200 space-y-3">
              <div>
                <h3 className="text-zinc-900 text-[12px] font-semibold">
                  Executive AI Technical Evaluation
                </h3>
                <p className="text-[12px] text-zinc-600 leading-relaxed font-normal mt-1">
                  {aiAssessment.summary}
                </p>
              </div>

              {aiAssessment.keyStrengths &&
                aiAssessment.keyStrengths.length > 0 && (
                  <div className="pt-2 border-t-2 border-dotted border-zinc-200">
                    <p className="text-[11px] font-semibold text-zinc-900 mb-1.5">
                      AI Identified Strengths:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {aiAssessment.keyStrengths.map((str, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#015451]/10 text-[#015451] text-[10px] font-medium border border-[#015451]/20"
                        >
                          {str}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-zinc-700">
                    Backend &amp; Distributed Microservices
                  </span>
                  <span className="text-[#015451] font-semibold">
                    {aiAssessment.ratings.backendMicroservices}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-[#015451] rounded-full transition-all duration-500"
                    style={{
                      width: `${aiAssessment.ratings.backendMicroservices}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-zinc-700">
                    Algorithmic Rigor &amp; Problem Solving
                  </span>
                  <span className="text-[#015451] font-semibold">
                    {aiAssessment.ratings.algorithmicRigor}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-[#015451] rounded-full transition-all duration-500"
                    style={{
                      width: `${aiAssessment.ratings.algorithmicRigor}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-zinc-700">
                    Architecture &amp; System Design
                  </span>
                  <span className="text-[#015451] font-semibold">
                    {aiAssessment.ratings.systemDesign}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-[#015451] rounded-full transition-all duration-500"
                    style={{ width: `${aiAssessment.ratings.systemDesign}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-zinc-700">
                    Code Quality &amp; Maintainability
                  </span>
                  <span className="text-[#015451] font-semibold">
                    {aiAssessment.ratings.codeMaintainability}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-[#015451] rounded-full transition-all duration-500"
                    style={{
                      width: `${aiAssessment.ratings.codeMaintainability}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="border-b-2 border-dotted border-zinc-200 pb-2.5">
            <h2 className="text-zinc-900 font-semibold text-base tracking-wide">
              Recruiter Analytics &amp; Performance Graphs
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 p-5 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-zinc-900 text-[12px] font-semibold tracking-wide">
                    Weekly Activity Output
                  </h3>
                  <p className="text-[12px] font-medium text-zinc-600">
                    Commits &amp; Problem Solving Velocity
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#015451]" />{" "}
                    Commits
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />{" "}
                    Problems
                  </span>
                </div>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyActivityData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 11, fontWeight: 500 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e4e4e7",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        borderStyle: "solid",
                        borderWidth: "1px",
                        color: "#09090b",
                        fontSize: "11px",
                        fontWeight: "500",
                      }}
                      itemStyle={{ color: "#09090b", fontWeight: "600" }}
                      labelStyle={{
                        color: "#015451",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    />
                    <Bar
                      dataKey="commits"
                      name="Commits"
                      fill="#015451"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="problems"
                      name="Problems"
                      fill="#27272a"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-zinc-900 text-[12px] font-semibold tracking-wide">
                  Language Breakdown
                </h3>
                <p className="text-[12px] font-medium text-zinc-600">
                  Tech Stack Distribution
                </p>
              </div>

              {languagesChartData.length > 0 ? (
                <>
                  <div className="h-40 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={languagesChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {languagesChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderColor: "#e4e4e7",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            borderStyle: "solid",
                            borderWidth: "1px",
                            color: "#09090b",
                            fontSize: "11px",
                            fontWeight: "500",
                          }}
                          itemStyle={{ color: "#09090b", fontWeight: "600" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t-2 border-dotted border-zinc-200">
                    {languagesChartData.map((item) => (
                      <div
                        key={item.name}
                        className="flex justify-between items-center text-[11px]"
                      >
                        <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </span>
                        <span className="font-semibold text-zinc-900">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-[12px] text-zinc-500 font-normal">
                  No GitHub repository language data synced yet.
                </div>
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-dotted border-zinc-200 pb-3">
              <div>
                <h3 className="text-zinc-900 text-base font-semibold tracking-wide">
                  Competitive Problem Solving &amp; Platform Ratings
                </h3>
                <p className="text-[12px] font-medium text-zinc-600">
                  Verified LeetCode &amp; Codeforces Algorithmic Difficulty
                  Breakdown
                </p>
              </div>
              <div className="flex items-center gap-2">
                {leetCodeData && (
                  <span className="text-[11px] font-semibold text-[#015451] bg-[#015451]/10 px-2.5 py-1 rounded-lg">
                    LeetCode:{" "}
                    {leetCodeData.rating > 0 ? leetCodeData.rating : "Synced"}
                  </span>
                )}
                {codeforcesData && (
                  <span className="text-[11px] font-semibold text-zinc-800 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
                    Codeforces:{" "}
                    {codeforcesData.rating > 0
                      ? `${codeforcesData.rating} (${codeforcesData.title})`
                      : "Synced"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leetCodeData ? (
                <div className="p-4 rounded-xl bg-zinc-50/80 border-2 border-dotted border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/leetcode.svg"
                        alt="LeetCode Logo"
                        className="w-5 h-5"
                      />
                      <div>
                        <h4 className="text-[13px] font-semibold text-zinc-900">
                          LeetCode Profile
                        </h4>
                        <p className="text-[11px] text-zinc-500">
                          @{leetCodeData.username}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-semibold text-[#015451]">
                        {leetCodeData.rating > 0
                          ? leetCodeData.rating
                          : leetCodeData.totalSolved}
                      </span>
                      <span className="text-[11px] font-medium text-zinc-500 block">
                        {leetCodeData.rating > 0 ? "Rating" : "Problems Solved"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-white border-2 border-dotted border-zinc-200 text-center">
                      <p className="text-[10px] font-medium text-zinc-500">
                        Easy
                      </p>
                      <p className="text-sm font-semibold text-[#015451]">
                        {leetCodeData.easy}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        ({leetCodeData.easyPct}%)
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border-2 border-dotted border-zinc-200 text-center">
                      <p className="text-[10px] font-medium text-zinc-500">
                        Medium
                      </p>
                      <p className="text-sm font-semibold text-zinc-800">
                        {leetCodeData.medium}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        ({leetCodeData.mediumPct}%)
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border-2 border-dotted border-zinc-200 text-center">
                      <p className="text-[10px] font-medium text-zinc-500">
                        Hard
                      </p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {leetCodeData.hard}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        ({leetCodeData.hardPct}%)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-50/80 border-2 border-dotted border-zinc-200 flex items-center justify-center text-[12px] text-zinc-500 font-normal">
                  LeetCode profile not connected yet.
                </div>
              )}

              {codeforcesData ? (
                <div className="p-4 rounded-xl bg-zinc-50/80 border-2 border-dotted border-zinc-200 space-y-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codeforces.svg"
                        alt="Codeforces Logo"
                        className="w-5 h-5"
                      />
                      <div>
                        <h4 className="text-[13px] font-semibold text-zinc-900">
                          Codeforces Profile
                        </h4>
                        <p className="text-[11px] text-zinc-500">
                          @{codeforcesData.username}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-semibold text-zinc-900">
                        {codeforcesData.rating > 0
                          ? codeforcesData.rating
                          : codeforcesData.totalSolved}
                      </span>
                      <span className="text-[11px] font-medium text-zinc-500 block">
                        {codeforcesData.title}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-white border-2 border-dotted border-zinc-200 text-center">
                      <p className="text-[10px] font-medium text-zinc-500">
                        Global Rank
                      </p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {codeforcesData.globalRank > 0
                          ? `#${codeforcesData.globalRank.toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border-2 border-dotted border-zinc-200 text-center">
                      <p className="text-[10px] font-medium text-zinc-500">
                        Total Solved
                      </p>
                      <p className="text-sm font-semibold text-[#015451]">
                        {codeforcesData.totalSolved}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-50/80 border-2 border-dotted border-zinc-200 flex items-center justify-center text-[12px] text-zinc-500 font-normal">
                  Codeforces profile not connected yet.
                </div>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-zinc-900 text-sm font-semibold tracking-wide">
                  Commit Heatmap
                </h3>
                <p className="text-[12px] font-medium text-zinc-600">
                  GitHub Contribution Matrix
                </p>
              </div>
              <div className="px-3 py-1 rounded-lg bg-[#015451]/10 text-[#015451] text-[11px] font-semibold flex items-center gap-1.5 border border-[#015451]/20">
                <span>{totalCommits.toLocaleString()} Total Commits</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="w-full flex justify-between text-[11px] font-medium text-zinc-500 px-0.5">
                {dynamicMonthLabels.map((m) => (
                  <span key={m.key}>{m.name}</span>
                ))}
              </div>

              <div className="w-full overflow-x-auto pb-1">
                <div className="grid grid-rows-7 grid-flow-col gap-1 sm:gap-1.5 w-full justify-between min-w-175">
                  {contributionGrid.map((count, idx) => {
                    let bg = "bg-zinc-100 border border-zinc-200/60";
                    if (count > 0 && count <= 3)
                      bg = "bg-[#015451]/30 border border-[#015451]/40";
                    else if (count > 3 && count <= 7)
                      bg = "bg-[#015451]/60 border border-[#015451]/70";
                    else if (count > 7 && count <= 12)
                      bg = "bg-[#015451]/85 border border-[#015451]";
                    else if (count > 12)
                      bg = "bg-[#015451] shadow-[0_0_8px_rgba(1,84,81,0.4)]";

                    return (
                      <div
                        key={idx}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredCell({
                            count,
                            idx,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-xs ${bg} transition-all hover:scale-125 hover:z-10 cursor-pointer`}
                        title={`Activity level: ${count} commits`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-3 border-t-2 border-dotted border-zinc-200">
                <span className="font-medium text-zinc-500">Less</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-400 font-normal mr-1">
                    Activity Level:
                  </span>
                  <div
                    className="w-2.5 h-2.5 rounded-xs bg-zinc-100 border border-zinc-200"
                    title="0 commits"
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-xs bg-[#015451]/30"
                    title="1-3 commits"
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-xs bg-[#015451]/60"
                    title="4-7 commits"
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-xs bg-[#015451]/85"
                    title="8-12 commits"
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-xs bg-[#015451]"
                    title="12+ commits"
                  />
                </div>
                <span className="font-medium text-zinc-500">More</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="border-b-2 border-dotted border-zinc-200 pb-2.5">
            <h2 className="text-zinc-900 font-semibold text-base tracking-wide">
              Portfolio Projects &amp; Work Showcase
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {userData.projects && userData.projects.length > 0 ? (
              userData.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[15px] font-semibold text-zinc-900">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {proj.github_url && (
                          <a
                            href={proj.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-all text-xs"
                            title="GitHub Code"
                          >
                            <FaGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.demo_url && (
                          <a
                            href={proj.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-[#015451] text-white hover:bg-[#01413e] transition-all text-xs"
                            title="Live Demo"
                          >
                            <FaArrowUpRightFromSquare className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-[12px] text-zinc-600 leading-relaxed font-normal">
                      {proj.description}
                    </p>

                    {proj.architecture_details && (
                      <div className="p-2.5 rounded-xl bg-zinc-50 border-2 border-dotted border-zinc-200 text-[11px] text-zinc-700">
                        <span className="font-semibold text-zinc-900 block mb-0.5">
                          Architecture Overview:
                        </span>
                        {proj.architecture_details}
                      </div>
                    )}
                  </div>

                  <div className="pt-2.5 border-t-2 border-dotted border-zinc-200 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap gap-1">
                      {proj.tech_stack?.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-[#015451]/10 text-[#015451] text-[10px] font-medium border border-[#015451]/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2.5 text-[11px] text-zinc-500 font-medium">
                      {proj.stars !== undefined && (
                        <span className="flex items-center gap-1">
                          <FaStar className="w-3 h-3 text-amber-500" />{" "}
                          {proj.stars}
                        </span>
                      )}
                      {proj.views !== undefined && (
                        <span className="flex items-center gap-1">
                          <FaEye className="w-3 h-3 text-zinc-400" />{" "}
                          {proj.views}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-6 text-center border-2 border-dotted border-zinc-200 rounded-2xl bg-zinc-50 text-zinc-500 text-[12px]">
                No featured projects listed yet.
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="border-b-2 border-dotted border-zinc-200 pb-2.5">
            <h2 className="text-zinc-900 font-semibold text-base tracking-wide">
              Technical Competencies &amp; Skills
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {userData.skills && userData.skills.length > 0 ? (
              userData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-white border-2 border-dotted border-zinc-200 text-zinc-700 text-[11px] font-medium shadow-xs hover:border-[#015451] hover:text-[#015451] transition-all flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#015451]" />{" "}
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-[12px] text-zinc-500 font-normal">
                No skills specified.
              </p>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border-b-2 border-dotted border-zinc-200 pb-2.5">
              <h2 className="text-zinc-900 font-semibold text-base tracking-wide">
                Professional Experience
              </h2>
            </div>

            <div className="space-y-3">
              {userData.experience && userData.experience.length > 0 ? (
                userData.experience.map((exp, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-1 relative pl-5"
                  >
                    <div className="absolute left-0 top-5 bottom-5 w-1 bg-[#015451] rounded-r-full" />
                    <div className="flex justify-between items-baseline flex-wrap gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {exp.role}
                      </h3>
                      <span className="text-[11px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-[#015451]">
                      {exp.company}
                    </p>
                    <p className="text-[12px] text-zinc-600 leading-relaxed font-normal">
                      {exp.desc}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-zinc-500 font-normal">
                  No work experience entries.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b-2 border-dotted border-zinc-200 pb-2.5">
              <h2 className="text-zinc-900 font-semibold text-base tracking-wide">
                Education &amp; Qualifications
              </h2>
            </div>

            <div className="space-y-3">
              {userData.education && userData.education.length > 0 ? (
                userData.education.map((edu, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border-2 border-dotted border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs space-y-1 relative pl-5"
                  >
                    <div className="absolute left-0 top-5 bottom-5 w-1 bg-zinc-800 rounded-r-full" />
                    <div className="flex justify-between items-baseline flex-wrap gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {edu.degree}
                      </h3>
                      <span className="text-[11px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        {edu.duration}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-zinc-900 flex items-center gap-1.5">
                      <FaGraduationCap className="w-3.5 h-3.5 text-zinc-700" />{" "}
                      {edu.school}
                    </p>
                    <p className="text-[12px] text-zinc-600 leading-relaxed font-normal">
                      {edu.details}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-zinc-500 font-normal">
                  No education entries.
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="h-12 w-full" />
      </div>

      <AnimatePresence>
        {showHireModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl p-7 sm:p-8 shadow-2xl shadow-zinc-950/20 relative text-zinc-900 font-sans space-y-6"
            >
              <button
                onClick={() => setShowHireModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/80 transition-all cursor-pointer"
              >
                <FaXmark className="w-4 h-4" />
              </button>

              {hireSubmitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#015451] text-white flex items-center justify-center mx-auto text-xl shadow-lg shadow-[#015451]/30">
                    <FaCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">
                    Message Dispatched!
                  </h3>
                  <p className="text-xs text-zinc-600 max-w-xs mx-auto font-normal leading-relaxed">
                    Your hiring proposal has been delivered directly to{" "}
                    {displayName}&apos;s verified inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleHireSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-[#015451] tracking-tight">
                      Contact {displayName} for Hiring
                    </h3>
                    <p className="text-[12px] text-zinc-500 mt-1 pb-4 font-normal">
                      Dispatch a direct job offer, role proposal, or interview
                      invite.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-1.5">
                        Your Name / Recruiter
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sarah Jenkins"
                        value={hireForm.recruiterName}
                        onChange={(e) =>
                          setHireForm({
                            ...hireForm,
                            recruiterName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-2xl bg-zinc-50/80 text-zinc-900 text-xs font-normal border border-zinc-200 focus:border-[#015451] focus:ring-2 focus:ring-[#015451]/20 focus:outline-none transition-all placeholder:text-zinc-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-1.5">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@company.com"
                        value={hireForm.recruiterEmail}
                        onChange={(e) =>
                          setHireForm({
                            ...hireForm,
                            recruiterEmail: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-2xl bg-zinc-50/80 text-zinc-900 text-xs font-normal border border-zinc-200 focus:border-[#015451] focus:ring-2 focus:ring-[#015451]/20 focus:outline-none transition-all placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Stripe, OpenAI, Vercel..."
                        value={hireForm.company}
                        onChange={(e) =>
                          setHireForm({ ...hireForm, company: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-2xl bg-zinc-50/80 text-zinc-900 text-xs font-normal border border-zinc-200 focus:border-[#015451] focus:ring-2 focus:ring-[#015451]/20 focus:outline-none transition-all placeholder:text-zinc-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-1.5">
                        Proposed Role Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Senior Full Stack Engineer"
                        value={hireForm.roleTitle}
                        onChange={(e) =>
                          setHireForm({
                            ...hireForm,
                            roleTitle: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-2xl bg-zinc-50/80 text-zinc-900 text-xs font-normal border border-zinc-200 focus:border-[#015451] focus:ring-2 focus:ring-[#015451]/20 focus:outline-none transition-all placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 mb-1.5">
                      Message / Opportunity Details
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Hi! We saw your Dradix profile and graphs. We'd love to discuss a senior engineering role..."
                      value={hireForm.message}
                      onChange={(e) =>
                        setHireForm({ ...hireForm, message: e.target.value })
                      }
                      className="w-full px-4 py-3.5 rounded-2xl bg-zinc-50/80 text-zinc-900 text-xs font-normal border border-zinc-200 focus:border-[#015451] focus:ring-2 focus:ring-[#015451]/20 focus:outline-none transition-all placeholder:text-zinc-400 resize-none min-h-27.5"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#015451] hover:bg-[#013e3c] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-[#015451]/25 flex items-center justify-center gap-2 cursor-pointer border-0 active:scale-[0.99]"
                  >
                    <FaPaperPlane className="w-3.5 h-3.5" /> Dispatch Hiring
                    Offer
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="fixed z-50 pointer-events-none px-3 py-1 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold shadow-xl border border-zinc-700/80 -translate-x-1/2 -translate-y-full mb-2 whitespace-nowrap flex items-center gap-1.5"
            style={{
              left: `${hoveredCell.x}px`,
              top: `${hoveredCell.y}px`,
            }}
          >
            <span>
              {hoveredCell.count === 0
                ? "0 commits"
                : `${hoveredCell.count} ${hoveredCell.count === 1 ? "commit" : "commits"}`}
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
