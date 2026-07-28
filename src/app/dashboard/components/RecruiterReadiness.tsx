"use client";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";

const checklist = [
  { label: "Resume Uploaded", done: false },
  { label: "GitHub Active", done: true },
  { label: "Projects Added", done: true },
  { label: "LinkedIn Connected", done: true },
  { label: "Portfolio Published", done: false },
  { label: "Certificates Added", done: true },
  { label: "Open Source Contributions", done: true },
  { label: "Bio Written", done: true },
];

const missing = ["No Resume", "No Portfolio Banner"];

export default function RecruiterReadiness() {
  const score = Math.round(
    (checklist.filter((c) => c.done).length / checklist.length) * 100,
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative bg-[#161616] border border-zinc-800/60 rounded-2xl p-5 overflow-hidden hover:border-zinc-700/80 transition-all flex-1">
        <div className="flex items-center gap-2 mb-5">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Recruiter Readiness
          </p>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg width={96} height={96} className="-rotate-90">
              <circle
                cx={48}
                cy={48}
                r={38}
                stroke="#27272a"
                strokeWidth={7}
                fill="none"
              />
              <circle
                cx={48}
                cy={48}
                r={38}
                stroke={
                  score >= 80 ? "#a1a1aa" : score >= 60 ? "#71717a" : "#52525b"
                }
                strokeWidth={7}
                fill="none"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={2 * Math.PI * 38 * (1 - score / 100)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-black text-white">{score}%</p>
              <p className="text-[9px] text-zinc-500">Ready</p>
            </div>
          </div>

          <div>
            <p className="text-lg font-bold text-zinc-200 mb-1">
              {score >= 80
                ? "Looking Great!"
                : score >= 60
                  ? "Almost There"
                  : "Needs Work"}
            </p>
            <p className="text-[12px] text-zinc-500">
              Complete the missing items to stand out to recruiters.
            </p>
            {missing.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {missing.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {checklist.map((c) => (
            <div key={c.label} className="flex items-center gap-2">
              {c.done ? (
                <CheckCircledIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              ) : (
                <CrossCircledIcon className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
              )}
              <p
                className={`text-[12px] ${c.done ? "text-zinc-400" : "text-zinc-600"}`}
              >
                {c.label}
              </p>
            </div>
          ))}
        </div>

        <button className="btn-candy w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-linear-to-b from-zinc-800 via-zinc-900 to-zinc-950 border border-zinc-700/80 rounded-xl text-[13px] text-zinc-100 font-medium cursor-pointer">
          Improve Profile <ArrowRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-[#161616] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/80 transition-all">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Public Profile
        </p>
        <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-4 py-3 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
          <p className="text-[12px] text-zinc-300 font-mono">
            dradix.dev/yatharth
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["Open", "Share", "Copy Link", "Download CV"].map((action) => (
            <button
              key={action}
              className="py-2 text-[11px] text-zinc-400 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
