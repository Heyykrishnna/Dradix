"use client";

const events = [
  { date: "Jan 2024", title: "Joined Dradix", desc: "Started tracking developer journey", color: "#005c58", done: true },
  { date: "Feb 2024", title: "Connected GitHub", desc: "Synced 52 repositories", color: "#3b82f6", done: true },
  { date: "Mar 2024", title: "Completed First Project", desc: "Launched dradix beta publicly", color: "#f59e0b", done: true },
  { date: "Apr 2024", title: "Solved 100 Problems", desc: "Hit the milestone on LeetCode", color: "#005c58", done: true },
  { date: "Jun 2024", title: "Reached 500 Commits", desc: "Consistent coding all year", color: "#3b82f6", done: true },
  { date: "Oct 2024", title: "Won Hackathon", desc: "DevFest — Runner-up", color: "#f59e0b", done: true },
  { date: "Dec 2024", title: "Published Blog", desc: "First dev article on hashnode", color: "#f43f5e", done: true },
  { date: "Mar 2025", title: "Won HackIndia", desc: "1st place among 3000+ teams", color: "#f59e0b", done: true },
  { date: "Upcoming", title: "Open Source Milestone", desc: "Aiming for 500 GitHub stars", color: "#3b82f6", done: false },
];

export default function Timeline() {
  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-6">
        <div>
          <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">Developer Timeline</p>
          <p className="text-[11px] text-[#555] mt-0.5">{events.filter(e => e.done).length} milestones reached</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-[#222]" />
        <div className="space-y-4">
          {events.map((e, i) => (
            <div key={i} className={`flex gap-4 items-start group ${!e.done ? "opacity-40" : ""}`}>
              <div
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                style={{ backgroundColor: e.done ? e.color + "20" : "#1c1c1c", color: e.done ? e.color : "#444" }}
              >
                {i + 1}
              </div>
              <div className="flex-1 bg-[#1c1c1c] rounded-xl px-4 py-3 hover:bg-[#222] transition-colors cursor-default">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-white">{e.title}</p>
                  <span className="text-[10px] text-[#444] shrink-0">{e.date}</span>
                </div>
                <p className="text-[12px] text-[#666] mt-0.5">{e.desc}</p>
                {e.done && <div className="w-full h-0.5 mt-2 rounded-full" style={{ backgroundColor: e.color, opacity: 0.3 }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
