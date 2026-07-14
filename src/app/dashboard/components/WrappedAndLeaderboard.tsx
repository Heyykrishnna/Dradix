"use client";

import { ArrowRightIcon } from "@radix-ui/react-icons";

const leaderboard = [
  { rank: 1, name: "Arjun Mehta", score: 98, xp: "12.4k", avatar: "AM" },
  { rank: 2, name: "Priya Singh", score: 95, xp: "11.8k", avatar: "PS" },
  { rank: 3, name: "Yatharth K.", score: 92, xp: "10.9k", avatar: "YK", isYou: true },
  { rank: 4, name: "Rohan Gupta", score: 89, xp: "9.7k", avatar: "RG" },
  { rank: 5, name: "Neha Sharma", score: 87, xp: "8.9k", avatar: "NS" },
];

const wrappedStats = [
  { label: "Coding Hours", value: "1,248" },
  { label: "Most Used Language", value: "TypeScript" },
  { label: "Top Repository", value: "dradix" },
  { label: "Longest Streak", value: "47 days" },
  { label: "Favorite Tech", value: "Next.js" },
];

export default function WrappedAndLeaderboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/60 hover:border-zinc-700/80 transition-all group">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-[#0a0a0a]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
        <div className="absolute top-0 right-0 w-40 h-40 bg-zinc-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-zinc-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative p-5 z-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">🎁</span>
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Developer Wrapped</p>
              <p className="text-[10px] text-zinc-600">2026 in review</p>
            </div>
            <button className="ml-auto flex items-center gap-1.5 text-[12px] text-zinc-300 bg-zinc-700/60 hover:bg-zinc-600/60 border border-zinc-600/60 rounded-lg px-3 py-1.5 transition-all">
              Generate <ArrowRightIcon className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {wrappedStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-zinc-800/40 last:border-0">
                <p className="text-[12px] text-zinc-500">{s.label}</p>
                <p className="text-[13px] font-semibold text-zinc-200">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#161616] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/80 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Leaderboard</p>
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 ml-auto gap-0.5">
            {["Friends", "College", "Global"].map((t, i) => (
              <button key={t} className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${i === 2 ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {leaderboard.map((u) => (
            <div
              key={u.rank}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                u.isYou
                  ? "bg-zinc-800/60 border-zinc-700"
                  : "bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700"
              }`}
            >
              <span className={`text-[12px] font-bold w-5 text-center ${u.rank <= 3 ? "text-zinc-300" : "text-zinc-600"}`}>
                {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-white">{u.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-semibold ${u.isYou ? "text-white" : "text-zinc-300"}`}>
                  {u.name} {u.isYou && <span className="text-[10px] text-zinc-500">(you)</span>}
                </p>
                <p className="text-[10px] text-zinc-600">{u.xp} XP</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold text-zinc-200">{u.score}</p>
                <p className="text-[10px] text-zinc-600">score</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
