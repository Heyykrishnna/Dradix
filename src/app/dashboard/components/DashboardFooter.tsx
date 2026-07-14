"use client";

import { UpdateIcon } from "@radix-ui/react-icons";

export default function DashboardFooter() {
  return (
    <footer className="mt-6 border-t border-zinc-800/60 pt-4 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
            API Status: Active
          </span>
          <span>Last Sync: 2 min ago</span>
          <span>v0.1.0-beta</span>
          <span>Storage: 2.4 MB / 100 MB</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Support</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Feedback</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Docs</a>
          <div className="flex items-center gap-1.5 text-zinc-700">
            <UpdateIcon className="w-3 h-3" /> Auto-syncing
          </div>
        </div>
      </div>
    </footer>
  );
}
