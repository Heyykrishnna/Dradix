"use client";

import { StarIcon, ArrowRightIcon, PlusIcon } from "@radix-ui/react-icons";

const projects = [
  { name: "dradix", desc: "Developer portfolio & analytics platform. Track your coding journey across all platforms in one place.", stack: ["Next.js", "TypeScript", "Tailwind", "Supabase"], stars: 127, views: 4821, likes: 89, status: "Live", color: "#00c9a7", langColor: "#3b82f6", updated: "2h ago" },
  { name: "algo-vault", desc: "Curated collection of algorithms and data structures with step-by-step visualizations.", stack: ["Python", "React", "D3.js"], stars: 89, views: 2100, likes: 62, status: "In Progress", color: "#f59e0b", langColor: "#f59e0b", updated: "1d ago" },
  { name: "rustify", desc: "Rust learning platform with interactive challenges and progress tracking for beginners.", stack: ["Rust", "WebAssembly", "React"], stars: 54, views: 890, likes: 41, status: "Archived", color: "#f43f5e", langColor: "#f43f5e", updated: "3d ago" },
];

export default function ProjectsSection() {
  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-5">
        <div>
          <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">Projects</p>
          <p className="text-[11px] text-[#555] mt-0.5">19 total · 4 Live</p>
        </div>
        <button className="ml-auto flex items-center gap-1.5 text-[12px] font-bold text-black bg-[#00c9a7] hover:bg-[#00b89a] rounded-xl px-3 py-2 transition-colors">
          <PlusIcon className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.name} className="bg-[#1c1c1c] rounded-xl overflow-hidden hover:bg-[#222] transition-colors group cursor-pointer">
            <div className="h-28 relative flex items-center justify-center" style={{ backgroundColor: p.color + "12" }}>
              <p className="text-7xl font-black select-none" style={{ color: p.color, opacity: 0.15 }}>{p.name[0].toUpperCase()}</p>
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold rounded-lg px-2.5 py-1" style={{ backgroundColor: p.color + "20", color: p.color }}>
                  {p.status}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] text-[#888]">
                <StarIcon className="w-3 h-3" style={{ color: p.color }} /> {p.stars}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-[15px] font-black text-white group-hover:text-white">{p.name}</p>
                <ArrowRightIcon className="w-4 h-4 text-[#333] group-hover:text-[#888] transition-all shrink-0" />
              </div>
              <p className="text-[12px] text-[#666] leading-relaxed mb-3">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.stack.map((tech) => (
                  <span key={tech} className="text-[10px] font-semibold text-[#888] bg-[#141414] rounded-md px-2 py-0.5">{tech}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#555] pt-3">
                <div className="flex items-center gap-3">
                  <span>{p.views.toLocaleString()} views</span>
                  <span>{p.likes} likes</span>
                </div>
                <span>{p.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
