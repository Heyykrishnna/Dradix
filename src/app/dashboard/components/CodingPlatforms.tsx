"use client";

import { UpdateIcon } from "@radix-ui/react-icons";

const platforms = [
  {
    name: "LeetCode",
    handle: "@yatharth",
    logo: "LC",
    color: "#f59e0b",
    solved: 847,
    rank: "Guardian",
    rating: 2156,
    globalRank: "#4,821",
    streak: 42,
    easy: 320,
    medium: 398,
    hard: 129,
    recentContests: [1, 2, 1, 3, 2],
    connected: true,
  },
  {
    name: "Codeforces",
    handle: "@yatharth_k",
    logo: "CF",
    color: "#3b82f6",
    solved: 312,
    rank: "Specialist",
    rating: 1742,
    globalRank: "#22,481",
    streak: 18,
    easy: 142,
    medium: 120,
    hard: 50,
    recentContests: [2, 3, 1, 2, 1],
    connected: true,
  },
  {
    name: "CodeChef",
    handle: "@yatharth_c",
    logo: "CC",
    color: "#f43f5e",
    solved: 91,
    rank: "4 Star",
    rating: 1920,
    globalRank: "#8,901",
    streak: 7,
    easy: 40,
    medium: 35,
    hard: 16,
    recentContests: [1, 1, 2, 1, 2],
    connected: false,
  },
];

function DifficultyBar({
  easy,
  medium,
  hard,
  color,
}: {
  easy: number;
  medium: number;
  hard: number;
  color: string;
}) {
  const total = easy + medium + hard;
  return (
    <div className="space-y-2">
      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
        <div
          style={{
            width: `${(easy / total) * 100}%`,
            backgroundColor: color,
            opacity: 0.4,
          }}
        />
        <div
          style={{
            width: `${(medium / total) * 100}%`,
            backgroundColor: color,
            opacity: 0.65,
          }}
        />
        <div
          style={{
            width: `${(hard / total) * 100}%`,
            backgroundColor: color,
            opacity: 0.95,
          }}
        />
      </div>
      <div className="flex gap-3 text-[10px] text-[#555]">
        <span>
          <span className="font-bold" style={{ color }}>
            {easy}
          </span>{" "}
          Easy
        </span>
        <span>
          <span className="font-bold" style={{ color }}>
            {medium}
          </span>{" "}
          Med
        </span>
        <span>
          <span className="font-bold" style={{ color }}>
            {hard}
          </span>{" "}
          Hard
        </span>
      </div>
    </div>
  );
}

function ContestMini({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.5 + (i / data.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

export default function CodingPlatforms() {
  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">
          Coding Platforms
        </p>
        <span className="ml-auto text-[13px] font-bold text-white">
          1,250{" "}
          <span className="text-[11px] font-normal text-[#555]">
            problems solved across all platforms
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((p) => (
          <div
            key={p.name}
            className="bg-[#1c1c1c] rounded-xl p-4 hover:bg-[#222] transition-colors group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0"
                style={{ backgroundColor: p.color + "20", color: p.color }}
              >
                {p.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-white">{p.name}</p>
                <p className="text-[10px] text-[#555]">{p.handle}</p>
              </div>
              {p.connected ? (
                <span className="text-[9px] font-bold text-[#00c9a7] bg-[#00c9a7]/10 rounded-md px-2 py-0.5">
                  Live
                </span>
              ) : (
                <button className="text-[9px] font-bold text-[#888] bg-[#2a2a2a] rounded-md px-2 py-0.5 hover:bg-[#333]">
                  Connect
                </button>
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <p className="text-3xl font-black text-white">{p.solved}</p>
              <p className="text-[11px] text-[#555]">problems solved</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { l: "Rating", v: p.rating },
                { l: "Rank", v: p.rank },
                { l: "Global", v: p.globalRank },
                { l: "Streak", v: `${p.streak}d` },
              ].map((s) => (
                <div key={s.l} className="bg-[#141414] rounded-lg p-2.5">
                  <p className="text-[10px] text-[#555]">{s.l}</p>
                  <p className="text-[12px] font-bold text-white mt-0.5">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>

            <DifficultyBar
              easy={p.easy}
              medium={p.medium}
              hard={p.hard}
              color={p.color}
            />

            <div className="mt-3">
              <p className="text-[10px] text-[#444] mb-1.5">Contest History</p>
              <ContestMini data={p.recentContests} color={p.color} />
            </div>

            <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 bg-[#141414] hover:bg-[#1c1c1c] rounded-lg text-[11px] font-semibold text-[#888] hover:text-white transition-all">
              <UpdateIcon className="w-3 h-3" /> Sync Account
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
