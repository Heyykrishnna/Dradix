"use client";

import { MagicWandIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const suggestions = [
  "How can I improve my resume?",
  "What project should I build next?",
  "Prepare me for Google.",
  "Review my GitHub activity.",
];

const todayGoals = [
  { label: "Complete 2 Problems", done: true },
  { label: "Push 3 Commits", done: true },
  { label: "Study Docker", done: false },
  { label: "Finish Resume", done: false },
];

const upcoming = [
  { title: "LeetCode Weekly Contest", time: "Tomorrow, 8 AM", type: "contest" },
  { title: "HackIndia Registration", time: "3 days left", type: "hackathon" },
  { title: "System Design Course", time: "Module 4 due Fri", type: "course" },
];

export default function BottomWidgets() {
  const [query, setQuery] = useState("");
  const done = todayGoals.filter((g) => g.done).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-[#161616] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/80 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <MagicWandIcon className="w-4 h-4 text-zinc-400" />
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            AI Career Coach
          </p>
        </div>

        <div className="space-y-2 mb-4">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="w-full text-left px-3 py-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-800/60 hover:border-zinc-700 text-[12px] text-zinc-400 hover:text-zinc-300 transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-[12px] text-zinc-300 placeholder:text-zinc-600 outline-none"
          />
          <button className="w-6 h-6 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors">
            <ArrowRightIcon className="w-3 h-3 text-zinc-200" />
          </button>
        </div>
      </div>

      <div className="bg-[#161616] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/80 transition-all">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Today&apos;s Goals · {done}/{todayGoals.length}
        </p>
        <div className="space-y-3 mb-4">
          {todayGoals.map((g) => (
            <div key={g.label} className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${g.done ? "bg-zinc-400 border-zinc-400" : "border-zinc-700"}`}
              >
                {g.done && (
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                )}
              </div>
              <p
                className={`text-[13px] ${g.done ? "line-through text-zinc-600" : "text-zinc-300"}`}
              >
                {g.label}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-zinc-600">
            <span>Daily progress</span>
            <span>{Math.round((done / todayGoals.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-400 rounded-full transition-all duration-700"
              style={{ width: `${(done / todayGoals.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#161616] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/80 transition-all">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Upcoming Events
        </p>
        <div className="space-y-3">
          {upcoming.map((e) => (
            <div
              key={e.title}
              className="flex items-start gap-3 p-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl hover:border-zinc-700 transition-all"
            >
              <div
                className={`w-2 h-2 rounded-full mt-1 shrink-0 ${e.type === "contest" ? "bg-zinc-400" : e.type === "hackathon" ? "bg-zinc-500" : "bg-zinc-600"}`}
              />
              <div>
                <p className="text-[12px] font-medium text-zinc-300">
                  {e.title}
                </p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
