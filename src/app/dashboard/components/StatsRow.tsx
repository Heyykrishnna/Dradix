"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@radix-ui/react-icons";

function CircularProgress({
  value,
  size = 52,
  stroke = 4,
  color,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color: string;
}) {
  const [anim, setAnim] = useState(0);
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (anim / 100) * circ;
  useEffect(() => {
    const t = setTimeout(() => setAnim(value), 300);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#222"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 1.4s cubic-bezier(.34,1.56,.64,1)",
        }}
      />
    </svg>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const norm = data.map((d) => ((d - min) / (max - min || 1)) * 26 + 4);
  const w = 64,
    step = w / (data.length - 1);
  const path = norm
    .map((y, i) => `${i === 0 ? "M" : "L"} ${i * step} ${34 - y}`)
    .join(" ");
  const area = `${path} L ${(data.length - 1) * step} 34 L 0 34 Z`;
  return (
    <svg width={w} height={34} className="overflow-visible">
      <defs>
        <linearGradient
          id={`grad-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color.replace("#", "")})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniHeatmap({ color }: { color: string }) {
  const weeks = Array.from({ length: 10 }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => ((wi * 2 + di * 3) % 10) / 10),
  );
  return (
    <div className="flex gap-0.5">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-0.5">
          {week.map((v, di) => (
            <div
              key={di}
              className="w-2.5 h-2.5 rounded-xs"
              style={{ backgroundColor: color, opacity: 0.1 + v * 0.85 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const cards = [
  {
    label: "Developer Score",
    value: "92",
    change: "+4 this week",
    sparkData: [72, 78, 74, 82, 85, 90, 92],
    type: "ring",
    ringValue: 92,
    color: "#005c58",
    bg: "#003c3a",
    sub: "Top 8% globally",
  },
  {
    label: "GitHub Contributions",
    value: "1,487",
    change: "+42 today",
    sparkData: [32, 45, 38, 60, 42, 55, 70],
    type: "heatmap",
    color: "#3b82f6",
    bg: "#3b82f6",
    sub: "This year",
  },
  {
    label: "Problems Solved",
    value: "1,250",
    change: "+12 today",
    sparkData: [800, 900, 1020, 1080, 1140, 1200, 1250],
    type: "spark",
    color: "#f59e0b",
    bg: "#f59e0b",
    sub: "All platforms",
  },
  {
    label: "Current Streak",
    value: "42",
    suffix: "days",
    change: "Personal best!",
    sparkData: [10, 18, 30, 35, 38, 40, 42],
    type: "ring",
    ringValue: 75,
    color: "#f43f5e",
    bg: "#f43f5e",
    sub: "On fire",
  },
];

const miniStats = [
  { label: "Projects", value: "19", sub: "4 Live", color: "#005c58" },
  { label: "Repositories", value: "52", sub: "12 Public", color: "#3b82f6" },
  { label: "Followers", value: "624", sub: "GitHub", color: "#f59e0b" },
  { label: "Stars Earned", value: "382", sub: "Total", color: "#f43f5e" },
  { label: "Pull Requests", value: "145", sub: "Merged", color: "#005c58" },
  { label: "Issues Closed", value: "81", sub: "Resolved", color: "#3b82f6" },
  { label: "Hackathons", value: "8", sub: "2 Wins", color: "#f59e0b" },
  { label: "Certificates", value: "12", sub: "Verified", color: "#f43f5e" },
];

export default function StatsRow() {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-[#161616] rounded-2xl p-5 hover:bg-[#1a1a1a] transition-colors cursor-default group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: c.color }}
                >
                  {c.label}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-white tracking-tight">
                    {c.value}
                  </span>
                  {c.suffix && (
                    <span className="text-sm text-[#555] mb-1 ml-0.5">
                      {c.suffix}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <ArrowUpIcon className="w-3 h-3" style={{ color: c.color }} />
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: c.color }}
                  >
                    {c.change}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                {c.type === "ring" && (
                  <div className="relative">
                    <CircularProgress
                      value={c.ringValue!}
                      size={52}
                      stroke={4}
                      color={c.color}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                      {c.ringValue}%
                    </span>
                  </div>
                )}
                {c.type === "heatmap" && <MiniHeatmap color={c.color} />}
                {c.type === "spark" && (
                  <Sparkline data={c.sparkData} color={c.color} />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-0.5 rounded-full bg-[#222]">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: c.color,
                    width: `${c.ringValue ?? 72}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#555]">{c.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {miniStats.map((ms) => (
          <div
            key={ms.label}
            className="bg-[#161616] rounded-xl p-3 text-center hover:bg-[#1a1a1a] transition-colors cursor-default group"
          >
            <p className="text-xl font-black text-white group-hover:scale-105 transition-transform inline-block">
              {ms.value}
            </p>
            <p
              className="text-[10px] font-semibold mt-0.5"
              style={{ color: ms.color }}
            >
              {ms.label}
            </p>
            <p className="text-[10px] text-[#444] mt-0.5">{ms.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
