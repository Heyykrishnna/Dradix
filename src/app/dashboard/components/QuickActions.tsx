"use client";

import { PlusIcon, UploadIcon, Link2Icon, CodeIcon, StarIcon, Pencil1Icon, RocketIcon, DownloadIcon, Share2Icon, LightningBoltIcon } from "@radix-ui/react-icons";

const actions = [
  { icon: PlusIcon, label: "Add Project", color: "text-zinc-300", bg: "hover:bg-zinc-800" },
  { icon: UploadIcon, label: "Upload Resume", color: "text-zinc-300", bg: "hover:bg-zinc-800" },
  { icon: Link2Icon, label: "Connect GitHub", color: "text-zinc-300", bg: "hover:bg-zinc-800" },
  { icon: CodeIcon, label: "Connect LeetCode", color: "text-zinc-300", bg: "hover:bg-zinc-800" },
  { icon: StarIcon, label: "Add Achievement", color: "text-zinc-300", bg: "hover:bg-zinc-800" },
  { icon: Pencil1Icon, label: "Write Blog", color: "text-zinc-300", bg: "hover:bg-zinc-800" },
  { icon: RocketIcon, label: "Analyze Resume", color: "text-zinc-200", bg: "hover:bg-zinc-800" },
  { icon: Share2Icon, label: "Share Portfolio", color: "text-zinc-300", bg: "hover:bg-zinc-800" },
  { icon: DownloadIcon, label: "Download Resume", color: "text-zinc-300", bg: "hover:bg-zinc-800" },
  { icon: LightningBoltIcon, label: "Sync All Accounts", color: "text-zinc-200", bg: "hover:bg-zinc-800" },
];

export default function QuickActions() {
  return (
    <div className="bg-[#161616] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/80 transition-all">
      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">Quick Actions</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {actions.map(({ icon: Icon, label, color, bg }) => (
          <button
            key={label}
            className={`flex flex-col items-center gap-2 p-4 bg-zinc-900/60 ${bg} border border-zinc-800/60 hover:border-zinc-700 rounded-xl transition-all group text-center cursor-pointer`}
          >
            <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
            <p className="text-[11px] text-zinc-500 group-hover:text-zinc-300 transition-colors leading-tight">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
