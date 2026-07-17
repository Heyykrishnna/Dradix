"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dropdownLeft, setDropdownLeft] = useState(0);

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
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const tabEl = tabRefs.current[hoveredIndex];
      if (tabEl) {
        const center = tabEl.offsetLeft + tabEl.offsetWidth / 2;
        setDropdownLeft(center);
      }
    }
  }, [hoveredIndex]);

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
        className="w-full bg-[#fdfdfd] border-b border-[#f4f4f5] px-6 py-4 flex flex-col sticky top-0 z-50 transition-all duration-300"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="text-black font-extrabold text-[14px] tracking-tight">
              dradix
            </span>
          </Link>

          <div className="relative">
            <nav className="flex bg-[#f4f4f5] rounded-xl p-1 gap-1 relative">
              {navigationConfig.map((cat, index) => {
                const isActive =
                  pathname === cat.href ||
                  (cat.href !== "/dashboard" &&
                    cat.href !== "/explore" &&
                    pathname.startsWith(cat.href)) ||
                  (cat.href === "/explore" && pathname.startsWith("/explore"));
                const isHovered = activeHover === cat.label;
                return (
                  <div
                    key={cat.label}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    onMouseEnter={() => handleMouseEnter(cat.label, index)}
                    className="relative"
                  >
                    <Link
                      href={cat.href}
                      onClick={(e) => handleHashLinkClick(e, cat.href)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                        isActive || isHovered
                          ? "bg-black text-white"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span>{cat.label}</span>
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 opacity-60 transition-transform ${isHovered ? "rotate-180" : ""}`}
                      />
                    </Link>
                  </div>
                );
              })}

              {/* <Link
                href="/dashboard/settings"
                onMouseEnter={handleMouseLeave}
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  pathname === "/dashboard/settings"
                    ? "bg-black text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
                title="Settings"
              >
                <GearIcon className="w-4 h-4" />
              </Link> */}
            </nav>

            <div
              className={`absolute top-full mt-2 w-[280px] bg-white rounded-2xl shadow-xl border border-zinc-100 p-0 py-4 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top z-50 overflow-hidden ${
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
                className="flex transition-transform duration-300 ease-out"
                style={{
                  width: `${navigationConfig.length * 280}px`,
                  transform: `translateX(-${(hoveredIndex ?? 0) * 280}px)`,
                }}
              >
                {navigationConfig.map((cat) => (
                  <div
                    key={cat.label}
                    className="w-[280px] px-4 space-y-2 shrink-0"
                  >
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 mb-1">
                      {cat.label} Submenu
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {cat.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={(e) => {
                            handleMouseLeave();
                            handleHashLinkClick(e, sub.href);
                          }}
                          className="flex flex-col p-2.5 rounded-xl hover:bg-zinc-50 transition-colors text-left"
                        >
                          <span className="text-[13px] font-bold text-zinc-900">
                            {sub.label}
                          </span>
                          <span className="text-[11px] text-zinc-400 mt-0.5">
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
              <button className="relative w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center hover:bg-[#eef2f6] transition-colors">
                <BellIcon className="w-4 h-4 text-zinc-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#f43f5e] rounded-full" />
                )}
              </button>

              <div className="absolute right-0 top-full pt-2 w-80 transition-all duration-300 ease-out origin-top-right opacity-0 scale-95 pointer-events-none group-hover/bell:opacity-100 group-hover/bell:scale-100 group-hover/bell:pointer-events-auto z-60">
                <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-4 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
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
              className="flex items-center gap-2.5 pl-3 border-l border-zinc-200 hover:opacity-85 transition-opacity cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#e2e8f0] flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-[11px] font-black text-zinc-700">YK</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-bold text-black leading-none">
                  Yatharth K.
                </p>
                <p className="text-[10px] text-zinc-400 leading-none mt-1">
                  Developer
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
