"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface SegmentedSliderProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (val: T) => void;
  theme?: "light" | "dark";
  className?: string;
}

export function SegmentedSlider<T extends string>({
  options,
  value,
  onChange,
  theme = "light",
  className = "",
}: SegmentedSliderProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const index = options.indexOf(value);
    const buttons =
      containerRef.current.querySelectorAll<HTMLButtonElement>("button");
    const targetButton = buttons[index];

    if (targetButton) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const targetRect = targetButton.getBoundingClientRect();

      setSliderStyle({
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
      });
    }
  }, [options, value]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  const isDark = theme === "dark";

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center p-1 rounded-xl select-none ${
        isDark
          ? "bg-[#1c1c1e] border border-white/10 shadow-inner"
          : "bg-zinc-200/80 border border-zinc-300/60 shadow-inner"
      } ${className}`}
    >
      {/* Smooth Animated Sliding Pill */}
      {sliderStyle.width > 0 && (
        <div
          className={`absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDark
              ? "bg-[#00c9a7] text-black shadow-md shadow-[#00c9a7]/20"
              : "bg-black text-white shadow-md"
          }`}
          style={{
            left: `${sliderStyle.left}px`,
            width: `${sliderStyle.width}px`,
          }}
        />
      )}

      {/* Option Buttons */}
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`relative z-10 px-3 py-1.5 text-[11px] font-semibold tracking-tight transition-colors duration-200 cursor-pointer rounded-lg flex-1 text-center whitespace-nowrap ${
              isActive
                ? isDark
                  ? "text-black font-bold"
                  : "text-white font-bold"
                : isDark
                  ? "text-zinc-400 hover:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
export default SegmentedSlider;
