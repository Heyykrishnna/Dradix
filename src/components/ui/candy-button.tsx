import React from "react";
import { cn } from "@/lib/utils";

export type CandyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function CandyButton({
  className,
  children = "Candy Button",
  ...props
}: CandyButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 text-white font-medium text-sm leading-5.5 tracking-[0.02em]",
        "px-7 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ease-out overflow-hidden select-none",
        "bg-[radial-gradient(95%_60%_at_50%_75%,#005451_0%,#002927_100%)]",
        "shadow-[0px_4px_24px_-6px_rgba(0,60,58,0.6),inset_0px_1px_4px_0px_rgba(255,255,255,0.4)]",
        "active:scale-[0.98]",
        "after:absolute after:top-0 after:left-[15%] after:right-[15%] after:h-px",
        "after:bg-linear-to-r after:from-transparent after:via-white/50 after:to-transparent after:pointer-events-none",
        "hover:brightness-110 hover:shadow-[0px_6px_28px_-4px_rgba(0,60,58,0.7),inset_0px_1px_4px_0px_rgba(255,255,255,0.5)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default CandyButton;
