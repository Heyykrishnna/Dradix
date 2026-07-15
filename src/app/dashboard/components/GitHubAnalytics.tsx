"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { GitHubLogoIcon, StarIcon, ArrowRightIcon } from "@radix-ui/react-icons";

const languages = [
  { name: "TypeScript", value: 42, color: "#3b82f6" },
  { name: "Python", value: 28, color: "#f59e0b" },
  { name: "Rust", value: 14, color: "#f43f5e" },
  { name: "Go", value: 10, color: "#005c58" },
  { name: "Other", value: 6, color: "#444" },
];

const commitData = [
  { month: "Jan", commits: 62 }, { month: "Feb", commits: 78 },
  { month: "Mar", commits: 55 }, { month: "Apr", commits: 92 },
  { month: "May", commits: 88 }, { month: "Jun", commits: 110 },
  { month: "Jul", commits: 97 },
];

const topRepos = [
  { name: "dradix", stars: 127, forks: 34, prs: 12, lang: "TypeScript", updated: "2h ago", color: "#3b82f6" },
  { name: "algo-vault", stars: 89, forks: 21, prs: 5, lang: "Python", updated: "1d ago", color: "#f59e0b" },
  { name: "rustify", stars: 54, forks: 8, prs: 3, lang: "Rust", updated: "3d ago", color: "#f43f5e" },
];

const recentFeed = [
  { action: "Committed to", target: "dradix", time: "2h ago", color: "#005c58" },
  { action: "Merged PR #47 in", target: "algo-vault", time: "5h ago", color: "#3b82f6" },
  { action: "Opened Issue in", target: "rustify", time: "1d ago", color: "#f59e0b" },
  { action: "Created repo", target: "ml-playground", time: "2d ago", color: "#f43f5e" },
  { action: "Released v1.2 of", target: "dradix", time: "3d ago", color: "#005c58" },
];

const ContribHeatmap = () => {
  const weeks = Array.from({ length: 26 }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => {
      const val = (wi * 3 + di * 5) % 5;
      return val;
    })
  );
  const opacities = [0.05, 0.2, 0.4, 0.65, 0.9];
  return (
    <div>
      <div className="flex gap-0.5 overflow-hidden">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((level, di) => (
              <div key={di} className="w-3 h-3 rounded-[2px]"
                style={{ backgroundColor: "#005c58", opacity: opacities[level] }} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[10px] text-[#444]">Less</span>
        {opacities.map((o, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: "#005c58", opacity: o }} />
        ))}
        <span className="text-[10px] text-[#444]">More</span>
      </div>
    </div>
  );
};

export default function GitHubAnalytics() {
  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-lg bg-[#1c1c1c] flex items-center justify-center">
          <GitHubLogoIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">GitHub Analytics</p>
          <p className="text-[11px] text-[#555]">@yatharth · 1,487 contributions</p>
        </div>
        <div className="ml-auto flex items-center gap-4 text-center">
          {[{ v: "382", l: "Stars" }, { v: "47d", l: "Streak" }, { v: "52", l: "Repos" }].map(s => (
            <div key={s.l}>
              <p className="text-[15px] font-black text-white">{s.v}</p>
              <p className="text-[10px] text-[#444]">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div>
            <p className="text-[11px] font-semibold text-[#555] mb-2">Contribution Calendar</p>
            <ContribHeatmap />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-[#555] mb-2">Commit History</p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commitData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#1c1c1c", border: "none", borderRadius: "12px", fontSize: 12 }} labelStyle={{ color: "#888" }} />
                  <Bar dataKey="commits" fill="#005c58" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-[#555] mb-2">Top Repositories</p>
            <div className="space-y-2">
              {topRepos.map((r) => (
                <div key={r.name} className="flex items-center gap-3 bg-[#1c1c1c] rounded-xl px-4 py-3 hover:bg-[#222] transition-colors cursor-pointer group">
                  <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-white group-hover:text-white">{r.name}</p>
                    <p className="text-[10px] text-[#555]">{r.lang} · Updated {r.updated}</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#555]">
                    <span className="flex items-center gap-1"><StarIcon className="w-3 h-3" />{r.stars}</span>
                    <span>{r.forks} forks</span>
                    <span>{r.prs} PRs</span>
                  </div>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-[#333] group-hover:text-[#888] transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[11px] font-semibold text-[#555] mb-2">Languages</p>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={languages} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={3}>
                    {languages.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1c1c1c", border: "none", borderRadius: "12px", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {languages.map((l) => (
                <div key={l.name} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                  <p className="text-[11px] text-[#888] flex-1">{l.name}</p>
                  <div className="w-16 h-1 bg-[#222] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${l.value}%`, backgroundColor: l.color }} />
                  </div>
                  <p className="text-[11px] text-[#555] w-7 text-right">{l.value}%</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-[#555] mb-2">Recent Activity</p>
            <div className="space-y-3">
              {recentFeed.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: f.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#888]">{f.action} <span className="text-white font-semibold">{f.target}</span></p>
                    <p className="text-[10px] text-[#444]">{f.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
