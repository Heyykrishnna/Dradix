"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  GitHubLogoIcon,
  BarChartIcon,
  CodeIcon,
  LayersIcon,
  StarIcon,
  RocketIcon,
  PersonIcon,
  BellIcon,
  GearIcon,
  ExitIcon,
  ChevronDownIcon,
  ActivityLogIcon,
  MixerHorizontalIcon,
  ReaderIcon,
  BackpackIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  children?: { icon: React.ComponentType<{ className?: string }>; label: string; href: string }[];
  badge?: string;
  accent?: string;
};

const navSections: NavItem[] = [
  {
    icon: HomeIcon,
    label: "Overview",
    href: "/dashboard",
    accent: "#00c9a7",
  },
  {
    icon: ActivityLogIcon,
    label: "Analytics",
    accent: "#3b82f6",
    children: [
      { icon: GitHubLogoIcon, label: "GitHub", href: "/dashboard/github" },
      { icon: BarChartIcon, label: "Weekly Activity", href: "/dashboard/activity" },
      { icon: MixerHorizontalIcon, label: "Career Progress", href: "/dashboard/career" },
    ],
  },
  {
    icon: CodeIcon,
    label: "Platforms",
    accent: "#f59e0b",
    children: [
      { icon: CodeIcon, label: "LeetCode", href: "/dashboard/leetcode" },
      { icon: ReaderIcon, label: "Codeforces", href: "/dashboard/codeforces" },
      { icon: ReaderIcon, label: "CodeChef", href: "/dashboard/codechef" },
    ],
  },
  {
    icon: LayersIcon,
    label: "Portfolio",
    accent: "#f43f5e",
    children: [
      { icon: LayersIcon, label: "Projects", href: "/dashboard/projects" },
      { icon: StarIcon, label: "Skills", href: "/dashboard/skills" },
      { icon: BackpackIcon, label: "Achievements", href: "/dashboard/achievements" },
    ],
  },
  {
    icon: RocketIcon,
    label: "Career",
    accent: "#a855f7",
    children: [
      { icon: ReaderIcon, label: "Timeline", href: "/dashboard/timeline" },
      { icon: LightningBoltIcon, label: "Recruiter Ready", href: "/dashboard/recruiter" },
      { icon: PersonIcon, label: "Public Profile", href: "/dashboard/profile" },
    ],
  },
];

function NavSection({ item, pathname }: { item: NavItem; pathname: string }) {
  const isChildActive = item.children?.some(c => pathname === c.href);
  const [open, setOpen] = useState(isChildActive ?? false);
  const isActive = item.href ? pathname === item.href : isChildActive;

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-[13px] font-medium ${
          isActive ? "bg-[#1a1a1a] text-white" : "text-[#888] hover:text-white hover:bg-[#161616]"
        }`}
      >
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
          style={{ backgroundColor: isActive ? item.accent + "22" : "transparent", color: isActive ? item.accent : undefined }}
        >
          <item.icon className="w-3.5 h-3.5" />
        </span>
        {item.label}
        {isActive && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.accent }} />
        )}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-[13px] font-medium ${
          isChildActive ? "text-white" : "text-[#888] hover:text-white hover:bg-[#161616]"
        }`}
      >
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: isChildActive ? item.accent + "22" : "#1c1c1c", color: isChildActive ? item.accent : "#666" }}
        >
          <item.icon className="w-3.5 h-3.5" />
        </span>
        {item.label}
        <ChevronDownIcon
          className="ml-auto w-3.5 h-3.5 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${(item.children?.length ?? 0) * 44}px` : "0px" }}
      >
        <div className="pl-4 pt-0.5 pb-1 space-y-0.5">
          {item.children?.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 text-[12px] ${
                  childActive ? "text-white bg-[#1a1a1a]" : "text-[#666] hover:text-[#ccc] hover:bg-[#161616]"
                }`}
              >
                <div
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ backgroundColor: childActive ? item.accent : "#444" }}
                />
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[230px] bg-[#0c0c0c] flex flex-col z-40">
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00c9a7] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black text-black tracking-tighter">DR</span>
          </div>
          <span className="text-white font-bold text-[16px] tracking-tight">dradix</span>
          <span className="ml-auto text-[9px] font-semibold text-[#00c9a7] bg-[#00c9a7]/10 rounded-md px-2 py-0.5">BETA</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-none">
        <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest px-3 mb-2 mt-1">Menu</p>
        {navSections.map((item) => (
          <NavSection key={item.label} item={item} pathname={pathname} />
        ))}

        <div className="pt-4">
          <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest px-3 mb-2">Other</p>
          <Link
            href="/dashboard/notifications"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#888] hover:text-white hover:bg-[#161616] transition-all text-[13px] font-medium"
          >
            <span className="w-7 h-7 rounded-lg bg-[#1c1c1c] flex items-center justify-center shrink-0">
              <BellIcon className="w-3.5 h-3.5 text-[#666]" />
            </span>
            Notifications
            <span className="ml-auto text-[9px] font-bold bg-[#f43f5e] text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0">3</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#888] hover:text-white hover:bg-[#161616] transition-all text-[13px] font-medium"
          >
            <span className="w-7 h-7 rounded-lg bg-[#1c1c1c] flex items-center justify-center shrink-0">
              <GearIcon className="w-3.5 h-3.5 text-[#666]" />
            </span>
            Settings
          </Link>
        </div>
      </nav>

      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#161616] cursor-pointer hover:bg-[#1c1c1c] transition-all group">
          <div className="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black text-black">YK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate">Yatharth K.</p>
            <p className="text-[10px] text-[#555] truncate">Dev Score: 92</p>
          </div>
          <ExitIcon className="w-3.5 h-3.5 text-[#444] group-hover:text-[#888] transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
}
