"use client";

interface TimelineEvent {
  date: string;
  title: string;
  desc: string;
  color: string;
  done: boolean;
}

const createEvent = (
  date: string,
  title: string,
  desc: string,
  color: string,
  done = true,
): TimelineEvent => ({ date, title, desc, color, done });

const events: TimelineEvent[] = [
  createEvent("Jan 2024", "Joined Dradix", "Started tracking developer journey", "#005c58"),
  createEvent("Feb 2024", "Connected GitHub", "Synced 52 repositories", "#3b82f6"),
  createEvent("Mar 2024", "Completed First Project", "Launched dradix beta publicly", "#f59e0b"),
  createEvent("Apr 2024", "Solved 100 Problems", "Hit the milestone on LeetCode", "#005c58"),
  createEvent("Jun 2024", "Reached 500 Commits", "Consistent coding all year", "#3b82f6"),
  createEvent("Oct 2024", "Won Hackathon", "DevFest — Runner-up", "#f59e0b"),
  createEvent("Dec 2024", "Published Blog", "First dev article on hashnode", "#f43f5e"),
  createEvent("Mar 2025", "Won HackIndia", "1st place among 3000+ teams", "#f59e0b"),
  createEvent("Upcoming", "Open Source Milestone", "Aiming for 500 GitHub stars", "#3b82f6", false),
];

export default function Timeline() {
  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-6">
        <div>
          <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">
            Developer Timeline
          </p>
          <p className="text-[11px] text-[#555] mt-0.5">
            {events.filter((e) => e.done).length} milestones reached
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4.75 top-2 bottom-2 w-0.5 bg-[#222]" />
        <div className="space-y-4">
          {events.map((e, i) => (
            <div
              key={i}
              className={`flex gap-4 items-start group ${!e.done ? "opacity-40" : ""}`}
            >
              <div
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                style={{
                  backgroundColor: e.done ? e.color + "20" : "#1c1c1c",
                  color: e.done ? e.color : "#444",
                }}
              >
                {i + 1}
              </div>
              <div className="flex-1 bg-[#1c1c1c] rounded-xl px-4 py-3 hover:bg-[#222] transition-colors cursor-default">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-white">{e.title}</p>
                  <span className="text-[10px] text-[#444] shrink-0">
                    {e.date}
                  </span>
                </div>
                <p className="text-[12px] text-[#666] mt-0.5">{e.desc}</p>
                {e.done && (
                  <div
                    className="w-full h-0.5 mt-2 rounded-full"
                    style={{ backgroundColor: e.color, opacity: 0.3 }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
