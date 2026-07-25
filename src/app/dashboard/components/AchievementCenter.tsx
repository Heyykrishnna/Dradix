"use client";

interface Achievement {
  label: string;
  icon: string;
  unlocked: boolean;
  color: string;
  category: string;
}

interface Hackathon {
  name: string;
  result: string;
  date: string;
  color: string;
}

const makeBadge = (
  label: string,
  icon: string,
  unlocked: boolean,
  color: string,
  category: string,
): Achievement => ({ label, icon, unlocked, color, category });

const makeHackathon = (
  name: string,
  result: string,
  date: string,
  color: string,
): Hackathon => ({ name, result, date, color });

const achievements: Achievement[] = [
  makeBadge("100 Commits", "C", true, "#00c9a7", "GitHub"),
  makeBadge("500 Problems", "P", true, "#f59e0b", "Coding"),
  makeBadge("1000 Problems", "1K", true, "#f59e0b", "Coding"),
  makeBadge("First OSS PR", "O", true, "#3b82f6", "Open Source"),
  makeBadge("100 Stars", "S", true, "#f59e0b", "GitHub"),
  makeBadge("100 Followers", "F", true, "#00c9a7", "GitHub"),
  makeBadge("Top 5%", "T", false, "#f43f5e", "Global"),
  makeBadge("2000 Problems", "2K", false, "#f59e0b", "Coding"),
  makeBadge("500 Stars", "5S", false, "#f59e0b", "GitHub"),
  makeBadge("OSS Maintainer", "M", false, "#3b82f6", "OSS"),
  makeBadge("10 Projects", "10", true, "#f43f5e", "Projects"),
  makeBadge("Hackathon Win", "W", true, "#f43f5e", "Hackathon"),
];

const hackathons: Hackathon[] = [
  makeHackathon("HackIndia 2025", "Winner", "Mar 2025", "#f59e0b"),
  makeHackathon("DevFest Hackathon", "Runner-up", "Nov 2024", "#3b82f6"),
  makeHackathon("NASA SpaceApps", "Finalist", "Oct 2024", "#00c9a7"),
];

export default function AchievementCenter() {
  const unlocked = achievements.filter((a) => a.unlocked).length;
  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div>
          <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">
            Achievement Center
          </p>
          <p className="text-[11px] text-[#555] mt-0.5">
            {unlocked}/{achievements.length} unlocked
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-1.5 w-32 bg-[#222] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00c9a7] rounded-full"
              style={{ width: `${(unlocked / achievements.length) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-[#00c9a7]">
            {Math.round((unlocked / achievements.length) * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <p className="text-[11px] font-semibold text-[#555] mb-3">Badges</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all cursor-default ${a.unlocked ? "bg-[#1c1c1c] hover:bg-[#222]" : "bg-[#161616] opacity-35"}`}
                title={`${a.label} · ${a.category}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black"
                  style={{
                    backgroundColor: a.unlocked ? a.color + "20" : "#222",
                    color: a.unlocked ? a.color : "#444",
                  }}
                >
                  {a.icon}
                </div>
                <p className="text-[9px] text-[#555] text-center leading-tight">
                  {a.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold text-[#555] mb-3">
              Hackathons
            </p>
            <div className="space-y-2">
              {hackathons.map((h) => (
                <div
                  key={h.name}
                  className="bg-[#1c1c1c] rounded-xl p-3 hover:bg-[#222] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: h.color }}
                    />
                    <p className="text-[12px] font-bold text-white">{h.name}</p>
                  </div>
                  <div className="flex items-center justify-between pl-4">
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: h.color }}
                    >
                      {h.result}
                    </span>
                    <span className="text-[10px] text-[#444]">{h.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1c1c1c] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              {[
                { v: "8", l: "Hackathons", c: "#f59e0b" },
                { v: "2", l: "Wins", c: "#f43f5e" },
                { v: "12", l: "Certificates", c: "#00c9a7" },
                { v: "382", l: "Stars", c: "#3b82f6" },
              ].map((s) => (
                <div key={s.l} className="bg-[#141414] rounded-lg p-2.5">
                  <p className="text-xl font-black" style={{ color: s.c }}>
                    {s.v}
                  </p>
                  <p className="text-[10px] text-[#444] mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
