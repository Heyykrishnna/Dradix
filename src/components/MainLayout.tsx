"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { GlassChatbot } from "@/components/GlassChatbot";
import {
  BellIcon,
  HomeIcon,
  LayersIcon,
  CodeIcon,
  RocketIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";

type SubItem = { label: string; href: string; desc: string };
type NavCategory = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  subItems: SubItem[];
};

const navigationConfig: NavCategory[] = [
  {
    label: "Dashboard",
    icon: HomeIcon,
    href: "/dashboard",
    subItems: [
      {
        label: "Overview",
        href: "/dashboard",
        desc: "Main metrics, score & AI insights",
      },
      {
        label: "Weekly Activity",
        href: "/dashboard#activity",
        desc: "Coding hours & productivity",
      },
      {
        label: "AI Career Coach",
        href: "/dashboard#ai-coach",
        desc: "Interactive resume & roadmap guidance",
      },
    ],
  },
  {
    label: "Projects",
    icon: LayersIcon,
    href: "/dashboard#projects",
    subItems: [
      {
        label: "Project Catalog",
        href: "/dashboard#projects",
        desc: "Manage projects & repositories",
      },
      {
        label: "Skills Inventory",
        href: "/dashboard#skills",
        desc: "Track language proficiency & tech stack",
      },
      {
        label: "GitHub Analytics",
        href: "/dashboard#github-analytics",
        desc: "Detailed contribution calendar",
      },
    ],
  },
  {
    label: "Platforms",
    icon: CodeIcon,
    href: "/dashboard#platforms",
    subItems: [
      {
        label: "Competitive Profiles",
        href: "/dashboard#platforms",
        desc: "LeetCode, Codeforces & CodeChef stats",
      },
      {
        label: "Leaderboards",
        href: "/dashboard#leaderboard",
        desc: "Compare rank & XP with friends",
      },
      {
        label: "Achievements",
        href: "/dashboard#achievements",
        desc: "Unlocked badges & hackathon wins",
      },
    ],
  },
  {
    label: "Career",
    icon: RocketIcon,
    href: "/dashboard#career",
    subItems: [
      {
        label: "ATS Resume Analyzer",
        href: "/resume-analyzer",
        desc: "AI-powered ATS scoring, pros & cons breakdown",
      },
      {
        label: "Recruiter Readiness",
        href: "/dashboard#recruiter",
        desc: "Checklist to optimize your profile",
      },
      {
        label: "Career Progress",
        href: "/dashboard#career-progress",
        desc: "Resume, portfolio & readiness scores",
      },
      {
        label: "Developer Timeline",
        href: "/dashboard#timeline",
        desc: "Milestones & upcoming events",
      },
      {
        label: "Skills Discovery",
        href: "/explore?tab=skills",
        desc: "Browse trending skills & learning resources",
      },
    ],
  },
  // {
  //   label: "Explore",
  //   icon: MagnifyingGlassIcon,
  //   href: "/explore",
  //   subItems: [
  //     {
  //       label: "Feed",
  //       href: "/coming-soon",
  //       desc: "Discover posts from the developer community",
  //     },
  //     {
  //       label: "Jobs",
  //       href: "/coming-soon",
  //       desc: "Browse developer job openings",
  //     },
  //   ],
  // },
];

type NotificationItem = { text: string; time: string; type: string };

const initialNavbarNotifications: NotificationItem[] = [
  { text: "GitHub synced successfully", time: "2 min ago", type: "sync" },
  { text: "Resume analyzed by AI coach", time: "1h ago", type: "analyze" },
  { text: "New badge unlocked: 42-day streak", time: "4h ago", type: "badge" },
  { text: "Weekly activity report is ready", time: "1d ago", type: "report" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);

  const avatarUrl = user?.avatar_url || "/assets/images/avatar/Avatar.jpg";
  const displayName = user
    ? user.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : user.username
    : "Yatharth K.";

  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "YK";

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoryContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownHeight, setDropdownHeight] = useState<number | null>(null);

  useEffect(() => {
    if (hoveredIndex !== null && categoryContentRefs.current[hoveredIndex]) {
      const el = categoryContentRefs.current[hoveredIndex];
      if (el) {
        setDropdownHeight(el.scrollHeight + 32);
      }
    } else {
      setDropdownHeight(null);
    }
  }, [hoveredIndex]);

  const activeIndex = navigationConfig.findIndex((cat) => {
    if (cat.href === "/dashboard") return pathname === "/dashboard";
    if (cat.href === "/explore") return pathname.startsWith("/explore");
    return pathname.startsWith(cat.href);
  });

  const highlightedIndex =
    hoveredIndex !== null
      ? hoveredIndex
      : activeIndex !== -1
        ? activeIndex
        : null;

  const [pillStyle, setPillStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

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
    return initialNavbarNotifications;
  });

  useEffect(() => {
    if (!localStorage.getItem("dradix_notifications")) {
      localStorage.setItem(
        "dradix_notifications",
        JSON.stringify(initialNavbarNotifications),
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

    // Sync live in-app notifications from backend for logged in users
    async function syncUserNotifications() {
      try {
        const res = await apiFetch<
          ApiResponse<{
            notifications: Array<{
              id: number;
              title: string;
              message: string;
              created_at: string;
              is_read: boolean;
            }>;
          }>
        >("/notifications/my");
        if (res.success && res.data?.notifications) {
          const apiNotifs = res.data.notifications.map((n) => ({
            text: `${n.title} — ${n.message}`,
            time: new Date(n.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: "system",
          }));
          if (apiNotifs.length > 0) {
            setNotifications(apiNotifs);
          }
        }
      } catch {
        // guest or non-auth session fallback
      }
    }
    void syncUserNotifications();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const updatePositions = () => {
      const targetIdx =
        hoveredIndex !== null
          ? hoveredIndex
          : activeIndex !== -1
            ? activeIndex
            : null;

      if (targetIdx !== null && tabRefs.current[targetIdx]) {
        const el = tabRefs.current[targetIdx];
        if (el) {
          setPillStyle({
            left: el.offsetLeft,
            width: el.offsetWidth,
            opacity: 1,
          });
        }
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }

      if (hoveredIndex !== null && tabRefs.current[hoveredIndex]) {
        const tabEl = tabRefs.current[hoveredIndex];
        if (tabEl) {
          const center = tabEl.offsetLeft + tabEl.offsetWidth / 2;
          setDropdownLeft(center);
        }
      }
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, [hoveredIndex, activeIndex, pathname]);

  const handleHashLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.includes("#")) {
      const parts = href.split("#");
      const path = parts[0];
      const hash = parts[1];
      const currentPath = pathname;
      if (path === "" || path === currentPath) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${hash}`);
        }
      }
    }
  };

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };
    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, [pathname]);

  const handleMouseEnter = (label: string, index: number) => {
    setActiveHover(label);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveHover(null);
    setHoveredIndex(null);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col selection:bg-zinc-200">
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl backdrop-saturate-200 border-b border-white/80 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] py-3"
            : "bg-white/50 backdrop-blur-xl backdrop-saturate-180 border-b border-white/60 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] py-4"
        }`}
      >
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <span className="text-black font-extrabold text-[14px] tracking-tight">
              dradix
            </span>
          </Link>

          <div className="relative" onMouseLeave={handleMouseLeave}>
            <nav className="flex items-center bg-zinc-200/50 backdrop-blur-2xl backdrop-saturate-200 border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(0,0,0,0.05),0_8px_32px_-4px_rgba(0,0,0,0.06)] rounded-2xl p-1.5 gap-1.5 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-white/40 via-white/10 to-transparent pointer-events-none rounded-2xl" />

              <div
                className="absolute top-1.5 bottom-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none bg-linear-to-br from-zinc-900/95 via-zinc-950/95 to-black/95 backdrop-blur-md border border-white/30 shadow-[0_6px_20px_rgba(0,0,0,0.35),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(0,0,0,0.5),0_0_12px_rgba(255,255,255,0.1)] overflow-hidden"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/35 via-transparent to-white/5 pointer-events-none rounded-xl" />
              </div>

              {navigationConfig.map((cat, index) => {
                const isHighlighted = highlightedIndex === index;
                const isHovered = activeHover === cat.label;
                return (
                  <div
                    key={cat.label}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    onMouseEnter={() => handleMouseEnter(cat.label, index)}
                    className="relative z-10"
                  >
                    <Link
                      href={cat.href}
                      onClick={(e) => handleHashLinkClick(e, cat.href)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 ${
                        isHighlighted
                          ? "text-white drop-shadow-xs"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span>{cat.label}</span>
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                          isHovered ? "rotate-180" : ""
                        }`}
                      />
                    </Link>
                  </div>
                );
              })}
            </nav>

            <div
              className={`absolute top-full pt-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top z-50 ${
                activeHover
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
              style={{
                left: `${dropdownLeft}px`,
                transform: `translateX(-50%) ${activeHover ? "scale(1)" : "scale(0.95)"}`,
              }}
            >
              <div
                className="w-70 bg-white/92 backdrop-blur-3xl backdrop-saturate-200 border border-white/90 shadow-[inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.04),0_20px_50px_-10px_rgba(0,0,0,0.12)] rounded-2xl p-0 py-4 overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative"
                style={{
                  height: dropdownHeight ? `${dropdownHeight}px` : "auto",
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/40 via-white/5 to-transparent pointer-events-none rounded-2xl z-10" />

                <div
                  className="flex items-start transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-20"
                  style={{
                    width: `${navigationConfig.length * 280}px`,
                    transform: `translateX(-${(hoveredIndex ?? 0) * 280}px)`,
                  }}
                >
                  {navigationConfig.map((cat, idx) => (
                    <div
                      key={cat.label}
                      ref={(el) => {
                        categoryContentRefs.current[idx] = el;
                      }}
                      className="w-70 px-4 space-y-2 shrink-0 transition-opacity duration-200"
                      style={{
                        opacity: hoveredIndex === idx ? 1 : 0.3,
                      }}
                    >
                      <div className="grid grid-cols-1 gap-1">
                        {cat.subItems.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={(e) => {
                              handleMouseLeave();
                              handleHashLinkClick(e, sub.href);
                            }}
                            className="flex flex-col p-2.5 rounded-xl bg-transparent hover:bg-white hover:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] hover:border-zinc-200/80 transition-all duration-200 hover:translate-x-0.5 text-left border border-transparent group/item"
                          >
                            <span className="text-[13px] font-bold text-zinc-900 group-hover/item:text-black transition-colors">
                              {sub.label}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-medium mt-0.5 leading-snug group-hover/item:text-zinc-600 transition-colors">
                              {sub.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/*<div className="relative group/leaderboard">
              <Link
                href="/dashboard#leaderboard"
                onClick={(e) =>
                  handleHashLinkClick(e, "/dashboard#leaderboard")
                }
                className="relative w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center hover:bg-[#eef2f6] transition-colors"
                title="Leaderboard"
              >
                <Trophy className="w-4 h-4 text-zinc-600" />
              </Link>

              <div className="absolute right-0 top-full pt-2 w-80 transition-all duration-300 ease-out origin-top-right opacity-0 scale-95 pointer-events-none group-hover/leaderboard:opacity-100 group-hover/leaderboard:scale-100 group-hover/leaderboard:pointer-events-auto z-60">
                <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-4 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <h4 className="text-[12px] font-bold text-black uppercase tracking-wider">
                      Leaderboard
                    </h4>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
                    {leaderboardRankings.map((user) => (
                      <div
                        key={user.rank}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all duration-200 ${
                          user.isYou
                            ? "bg-zinc-50 border-zinc-200 shadow-sm"
                            : "bg-white border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50"
                        }`}
                      >
                        <span
                          className={`text-[11px] font-black w-5 text-center ${
                            user.rank <= 3 ? "text-zinc-800" : "text-zinc-400"
                          }`}
                        >
                          {user.rank}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-zinc-600">
                            {user.avatar}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-zinc-800 truncate">
                            {user.name}
                            {user.isYou && (
                              <span className="text-[9px] font-medium text-zinc-400 ml-1">
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-medium">
                            {user.xp} XP
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[12px] font-black text-zinc-800 leading-none">
                            {user.score}
                          </p>
                          <p className="text-[9px] text-zinc-400 font-semibold mt-0.5">
                            score
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div> */}

            <div className="relative group/bell">
              <button className="relative w-9 h-9 rounded-xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9),0_4px_12px_rgba(0,0,0,0.05)] hover:bg-white/85 hover:border-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer">
                <BellIcon className="w-4 h-4 text-zinc-700" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#f43f5e] rounded-full ring-2 ring-white" />
                )}
              </button>

              <div className="absolute right-0 top-full pt-3 w-80 transition-all duration-300 ease-out origin-top-right opacity-0 scale-95 pointer-events-none group-hover/bell:opacity-100 group-hover/bell:scale-100 group-hover/bell:pointer-events-auto z-60">
                <div className="bg-white/92 backdrop-blur-3xl backdrop-saturate-200 border border-white/90 shadow-[inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.04),0_20px_50px_-10px_rgba(0,0,0,0.12)] rounded-2xl p-4 space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-white/40 via-white/5 to-transparent pointer-events-none rounded-2xl z-10" />
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60 relative z-20">
                    <h4 className="text-[12px] font-bold text-black uppercase tracking-wider">
                      Notifications
                    </h4>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "dradix_notifications",
                            JSON.stringify([]),
                          );
                          window.dispatchEvent(new Event("storage"));
                        }}
                        className="text-[10px] font-bold text-zinc-400 hover:text-[#f43f5e] transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
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
                            className="bg-zinc-50 hover:bg-zinc-100/80 hover:shadow-sm transition-all duration-200 rounded-xl p-3 flex justify-between items-center text-[11px] text-left"
                            style={{
                              borderLeftColor:
                                notifColors[notif.type] || "#9ca3af",
                            }}
                          >
                            <span className="font-semibold text-zinc-700 leading-tight">
                              {notif.text}
                            </span>
                            <span className="text-[9px] text-zinc-400 shrink-0 ml-3 self-start mt-0.5">
                              {notif.time}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center space-y-2">
                        <BellIcon className="w-8 h-8 text-zinc-300 mx-auto" />
                        <p className="text-[11px] text-zinc-400 italic">
                          No new notifications
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-2.5 pl-3 border-l border-zinc-200 hover:opacity-85 transition-opacity cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#e2e8f0] border border-zinc-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                {avatarUrl && !imageError ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                ) : (
                  <span className="text-[11px] font-black text-zinc-700">
                    {initials}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-bold text-black leading-none group-hover:text-zinc-700 transition-colors">
                  {displayName}
                </p>
                <p className="text-[10px] text-zinc-400 font-semibold leading-none mt-1">
                  {user?.role === "ADMIN" ? "Workspace Admin" : "Developer"}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main
        className={`flex-1 w-full max-w-[1600px] mx-auto px-6 pb-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "pt-19.25" : "pt-21.25"
        }`}
      >
        {children}
      </main>

      <GlassChatbot />
    </div>
  );
}
