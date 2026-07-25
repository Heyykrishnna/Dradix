"use client";

import { MagicWandIcon } from "@radix-ui/react-icons";

const weeklyGoals = [
  {
    label: "Solve 15 LeetCode problems",
    done: 12,
    total: 15,
    color: "#f59e0b",
  },
  { label: "Push code daily (7 days)", done: 6, total: 7, color: "#003c3a" },
  { label: "Complete 2 course modules", done: 1, total: 2, color: "#3b82f6" },
  { label: "Read 1 tech article", done: 1, total: 1, color: "#f43f5e" },
];

const upcoming = [
  { text: "Learn Redis", color: "#f59e0b" },
  { text: "Complete Docker Deep Dive", color: "#3b82f6" },
  { text: "Revise DSA — Graphs", color: "#003c3a" },
  { text: "Deploy personal site", color: "#f43f5e" },
];

export default function LearningTracker() {
  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">
          Learning Tracker
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div>
            <p className="text-[11px] font-semibold text-[#555] mb-3">
              Weekly Goals
            </p>
            <div className="space-y-2.5">
              {weeklyGoals.map((g) => {
                const complete = g.done >= g.total;
                const pct = (g.done / g.total) * 100;
                return (
                  <div
                    key={g.label}
                    className="bg-[#1c1c1c] rounded-xl p-3 hover:bg-[#222] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0`}
                        style={{
                          backgroundColor: complete ? g.color : "#2a2a2a",
                        }}
                      >
                        {complete && (
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </div>
                      <p
                        className={`text-[12px] font-medium flex-1 ${complete ? "line-through text-[#555]" : "text-[#ccc]"}`}
                      >
                        {g.label}
                      </p>
                      <span className="text-[11px] font-bold text-[#555]">
                        {g.done}/{g.total}
                      </span>
                    </div>
                    <div className="ml-7 h-1 bg-[#141414] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: g.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1c1c1c] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-[#003c3a]/20 flex items-center justify-center">
                <MagicWandIcon className="w-3.5 h-3.5 text-[#006e6a]" />
              </div>
              <p className="text-[11px] font-bold text-[#888]">
                AI Recommendations
              </p>
            </div>
            <div className="space-y-2">
              {upcoming.map((u, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: u.color }}
                  />
                  <p className="text-[12px] text-[#888]">{u.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1c1c1c] rounded-xl p-4 text-center">
            <p className="text-4xl font-black text-white">12</p>
            <p className="text-[11px] font-semibold text-[#006e6a] mt-1">
              Certificates Earned
            </p>
            <p className="text-[10px] text-[#444] mt-0.5">All verified</p>
          </div>
        </div>
      </div>
    </div>
  );
}
