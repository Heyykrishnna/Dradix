import React from "react";
import { cn } from "@/lib/utils";

export interface CandyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function CandyButton({ className, children = "Candy Button", ...props }: CandyButtonProps) {
  return (
    <button
      className={cn(
        "relative text-white font-light text-xs leading-[22px] tracking-[0.02em]",
        "px-9 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-out",
        "border border-[#b08c5c] bg-[radial-gradient(95%_60%_at_50%_75%,#005451_0%,#002927_100%)]",
        "shadow-[0px_4px_48px_-12px_rgba(0,60,58,0.6),inset_0px_1px_8px_-4px_rgba(255,255,255,0.4)]",
        "active:scale-95 active:rotate-1",
        "after:absolute after:top-px after:right-[10%] after:w-[60%] after:h-px",
        "after:bg-linear-to-r after:from-transparent after:via-white/50 after:to-transparent",
        "hover:brightness-110",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default CandyButton;
