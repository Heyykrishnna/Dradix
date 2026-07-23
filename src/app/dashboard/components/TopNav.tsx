"use client";

import { MagnifyingGlassIcon, BellIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function TopNav() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-14 bg-[#101010] flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="flex-1">
        <h1 className="text-[15px] font-bold text-white">Overview</h1>
        <p className="text-[11px] text-[#555]">
          Your developer journey at a glance
        </p>
      </div>

      <div
        className={`relative flex items-center gap-2 bg-[#161616] rounded-xl px-3 py-2 transition-all duration-200 ${searchFocused ? "w-56" : "w-40"}`}
      >
        <MagnifyingGlassIcon className="w-3.5 h-3.5 text-[#555] shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent text-[13px] text-white placeholder:text-[#444] outline-none w-full"
        />
        <kbd className="text-[9px] text-[#444] bg-[#222] rounded px-1 shrink-0">
          ⌘K
        </kbd>
      </div>

      <button className="relative w-9 h-9 rounded-xl bg-[#161616] flex items-center justify-center hover:bg-[#1c1c1c] transition-colors">
        <BellIcon className="w-4 h-4 text-[#777]" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f43f5e] rounded-full" />
      </button>

      <div className="flex items-center gap-2.5 pl-3">
        <div className="w-9 h-9 rounded-full bg-[#003c3a] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
          <span className="text-[11px] font-black text-white">YK</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-[12px] font-semibold text-white leading-none">
            Yatharth
          </p>
          <p className="text-[10px] text-[#555] leading-none mt-0.5">
            Developer
          </p>
        </div>
      </div>
    </header>
  );
}
