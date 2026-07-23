"use client";

import {
  ArrowRightIcon,
  MagicWandIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";

const focusAreas = [
  { label: "React", color: "#3b82f6" },
  { label: "System Design", color: "#f59e0b" },
  { label: "Docker", color: "#00c9a7" },
];

const recentActivity = [
  { time: "2h ago", text: "GitHub synced successfully", color: "#00c9a7" },
  { time: "5h ago", text: "New badge: 40-day streak", color: "#f59e0b" },
  { time: "1d ago", text: "Weekly report ready", color: "#3b82f6" },
  { time: "2d ago", text: "Resume analyzed by AI", color: "#f43f5e" },
];

export default function AIInsightsCard() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative overflow-hidden bg-[#161616] rounded-2xl p-5 flex-1">
        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-[#00c9a7]/15 flex items-center justify-center">
            <MagicWandIcon className="w-4 h-4 text-[#00c9a7]" />
          </div>
          <p className="text-[13px] font-bold text-white">AI Insights</p>
          <span className="ml-auto text-[9px] font-semibold text-[#00c9a7] bg-[#00c9a7]/10 rounded-md px-2 py-0.5">
            LIVE
          </span>
        </div>

        <div className="mb-5 p-4 bg-[#1c1c1c] rounded-xl">
          <p className="text-[18px] font-black text-white mb-1">Good Job!</p>
          <p className="text-[13px] text-[#888] leading-relaxed">
            Your GitHub activity increased by{" "}
            <span className="text-[#00c9a7] font-semibold">24%</span> this week.
            You are consistently pushing code and maintaining a strong streak.
          </p>
        </div>

        <div className="mb-5">
          <p className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-2.5">
            Focus On
          </p>
          <div className="flex flex-wrap gap-2">
            {focusAreas.map((f) => (
              <span
                key={f.label}
                className="text-[12px] font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1.5"
                style={{ backgroundColor: f.color + "15", color: f.color }}
              >
                <LightningBoltIcon className="w-3 h-3" />
                {f.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-5 p-3.5 bg-[#1c1c1c] rounded-xl">
          <p className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1">
            AI Recommendation
          </p>
          <p className="text-[13px] text-[#ccc]">
            Build one backend project this week to strengthen your full-stack
            presence.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#222] hover:bg-[#2a2a2a] rounded-xl text-[12px] font-semibold text-[#ccc] transition-colors">
            View Report <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#00c9a7] hover:bg-[#00b89a] text-black rounded-xl text-[12px] font-bold transition-colors">
            <MagicWandIcon className="w-3.5 h-3.5" />
            Generate Roadmap
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden bg-[#161616] rounded-2xl p-5">
        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-3">
          Recent Activity
        </p>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: a.color }}
              />
              <p className="text-[12px] text-[#aaa] flex-1">{a.text}</p>
              <p className="text-[10px] text-[#444] shrink-0">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
