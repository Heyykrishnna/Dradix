"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { BellIcon, HomeIcon, LayersIcon, CodeIcon, RocketIcon, GearIcon, ChevronDownIcon } from "@radix-ui/react-icons";

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
      { label: "Overview", href: "/dashboard", desc: "Main metrics, score & AI insights" },
      { label: "Weekly Activity", href: "/dashboard#activity", desc: "Coding hours & productivity" },
      { label: "AI Career Coach", href: "/dashboard#ai-coach", desc: "Interactive resume & roadmap guidance" },
    ]
  },
  {
    label: "Projects",
    icon: LayersIcon,
    href: "/dashboard#projects",
    subItems: [
      { label: "Project Catalog", href: "/dashboard#projects", desc: "Manage projects & repositories" },
      { label: "Skills Inventory", href: "/dashboard#skills", desc: "Track language proficiency & tech stack" },
      { label: "GitHub Analytics", href: "/dashboard#github-analytics", desc: "Detailed contribution calendar" },
    ]
  },
  {
    label: "Platforms",
    icon: CodeIcon,
    href: "/dashboard#platforms",
    subItems: [
      { label: "Competitive Profiles", href: "/dashboard#platforms", desc: "LeetCode, Codeforces & CodeChef stats" },
      { label: "Leaderboards", href: "/dashboard#leaderboard", desc: "Compare rank & XP with friends" },
      { label: "Achievements", href: "/dashboard#achievements", desc: "Unlocked badges & hackathon wins" },
    ]
  },
  {
    label: "Career",
    icon: RocketIcon,
    href: "/dashboard#career",
    subItems: [
      { label: "Recruiter Readiness", href: "/dashboard#recruiter", desc: "Checklist to optimize your profile" },
      { label: "Career Progress", href: "/dashboard#career-progress", desc: "Resume, portfolio & readiness scores" },
      { label: "Developer Timeline", href: "/dashboard#timeline", desc: "Milestones & upcoming events" },
    ]
  }
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const tabEl = tabRefs.current[hoveredIndex];
      if (tabEl) {
        const center = tabEl.offsetLeft + tabEl.offsetWidth / 2;
        setDropdownLeft(center);
      }
    }
  }, [hoveredIndex]);

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
      
      {/* Top Header Navigation */}
      <header 
        className="w-full bg-[#fdfdfd] border-b border-[#f4f4f5] px-6 py-4 flex flex-col sticky top-0 z-50 transition-all duration-300"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center">
              <span className="text-[11px] font-black text-white tracking-tighter">DR</span>
            </div>
            <span className="text-black font-extrabold text-[18px] tracking-tight">dradix</span>
          </Link>

          {/* Navigation Pill (Center with Hover Dropdown) */}
          <div className="relative">
            <nav className="flex bg-[#f4f4f5] rounded-xl p-1 gap-1 relative">
              {navigationConfig.map((cat, index) => {
                const isActive = pathname === cat.href || (cat.href !== "/dashboard" && pathname.startsWith(cat.href));
                const isHovered = activeHover === cat.label;
                return (
                  <div
                    key={cat.label}
                    ref={(el) => { tabRefs.current[index] = el; }}
                    onMouseEnter={() => handleMouseEnter(cat.label, index)}
                    className="relative"
                  >
                    <Link
                      href={cat.href}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                        isActive || isHovered
                          ? "bg-black text-white"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span>{cat.label}</span>
                      <ChevronDownIcon className={`w-3.5 h-3.5 opacity-60 transition-transform ${isHovered ? "rotate-180" : ""}`} />
                    </Link>
                  </div>
                );
              })}
              
              <Link
                href="/dashboard/settings"
                onMouseEnter={handleMouseLeave}
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  pathname === "/dashboard/settings" ? "bg-black text-white" : "text-zinc-500 hover:text-zinc-900"
                }`}
                title="Settings"
              >
                <GearIcon className="w-4 h-4" />
              </Link>
            </nav>

            {/* Hover Expand Dropdown Panel */}
            <div 
              className={`absolute top-full mt-2 w-[280px] bg-white rounded-2xl shadow-xl border border-zinc-100 p-0 py-4 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top z-50 overflow-hidden ${
                activeHover 
                  ? "opacity-100 scale-100 pointer-events-auto" 
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
              style={{
                left: `${dropdownLeft}px`,
                transform: `translateX(-50%) ${activeHover ? "scale(1)" : "scale(0.95)"}`
              }}
            >
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{
                  width: `${navigationConfig.length * 280}px`,
                  transform: `translateX(-${(hoveredIndex ?? 0) * 280}px)`
                }}
              >
                {navigationConfig.map((cat) => (
                  <div key={cat.label} className="w-[280px] px-4 space-y-2 shrink-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 mb-1">{cat.label} Submenu</p>
                    <div className="grid grid-cols-1 gap-1">
                      {cat.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={handleMouseLeave}
                          className="flex flex-col p-2.5 rounded-xl hover:bg-zinc-50 transition-colors text-left"
                        >
                          <span className="text-[13px] font-bold text-zinc-900">{sub.label}</span>
                          <span className="text-[11px] text-zinc-400 mt-0.5">{sub.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center hover:bg-[#eef2f6] transition-colors">
              <BellIcon className="w-4 h-4 text-zinc-600" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#f43f5e] rounded-full" />
            </button>

            <Link href="/profile" className="flex items-center gap-2.5 pl-3 border-l border-zinc-200 hover:opacity-85 transition-opacity cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-[#e2e8f0] flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-black/10">
                <span className="text-[11px] font-black text-zinc-700">YK</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-bold text-black leading-none">Yatharth K.</p>
                <p className="text-[10px] text-zinc-400 leading-none mt-1">Developer</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Content Body (Full screen coverage) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
