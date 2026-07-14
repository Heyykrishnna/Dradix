"use client";

const skills = [
  { name: "TypeScript", level: "Advanced", pct: 90, projects: 12, color: "#3b82f6" },
  { name: "React", level: "Advanced", pct: 88, projects: 10, color: "#00c9a7" },
  { name: "Next.js", level: "Advanced", pct: 85, projects: 8, color: "#f5f5f5" },
  { name: "Node.js", level: "Advanced", pct: 80, projects: 7, color: "#00c9a7" },
  { name: "Python", level: "Intermediate", pct: 72, projects: 5, color: "#f59e0b" },
  { name: "Rust", level: "Intermediate", pct: 55, projects: 2, color: "#f43f5e" },
  { name: "Docker", level: "Intermediate", pct: 60, projects: 4, color: "#3b82f6" },
  { name: "PostgreSQL", level: "Intermediate", pct: 65, projects: 5, color: "#00c9a7" },
  { name: "Tailwind", level: "Advanced", pct: 92, projects: 9, color: "#3b82f6" },
  { name: "Supabase", level: "Intermediate", pct: 68, projects: 3, color: "#00c9a7" },
  { name: "GraphQL", level: "Beginner", pct: 35, projects: 1, color: "#f59e0b" },
  { name: "Redis", level: "Beginner", pct: 28, projects: 1, color: "#f43f5e" },
];

const levelConfig: Record<string, { label: string; bg: string; text: string }> = {
  Advanced: { label: "Advanced", bg: "#00c9a7/15", text: "#00c9a7" },
  Intermediate: { label: "Intermediate", bg: "#f59e0b/15", text: "#f59e0b" },
  Beginner: { label: "Beginner", bg: "#f43f5e/15", text: "#f43f5e" },
};

export default function SkillsSection() {
  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">Skills</p>
        <p className="text-[11px] text-[#555] mt-0.5">{skills.length} skills tracked</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skills.map((s) => {
          const lc = levelConfig[s.level];
          return (
            <div key={s.name} className="bg-[#1c1c1c] rounded-xl p-3.5 hover:bg-[#222] transition-colors cursor-default group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <p className="text-[13px] font-bold text-white">{s.name}</p>
                </div>
                <span className="text-[9px] font-bold rounded-md px-2 py-0.5" style={{ backgroundColor: s.color + "20", color: s.color }}>
                  {lc.label}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-[#555] mb-1.5">
                <span>{s.pct}% proficiency</span>
                <span>{s.projects} projects</span>
              </div>
              <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
