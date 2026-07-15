"use client";

import { useEffect, useState } from "react";

function Ring({ value, size = 80, stroke = 7, color, label }: { value: number; size?: number; stroke?: number; color: string; label: string }) {
  const [anim, setAnim] = useState(0);
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (anim / 100) * circ;
  useEffect(() => { const t = setTimeout(() => setAnim(value), 500); return () => clearTimeout(t); }, [value]);
  return (
    <div className="flex flex-col items-center gap-2 cursor-default">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#222" strokeWidth={stroke} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(.34,1.56,.64,1)" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-black text-white">{value}%</span>
      </div>
      <p className="text-[10px] font-semibold text-[#555] text-center leading-tight max-w-[68px]">{label}</p>
    </div>
  );
}

const rings = [
  { label: "Resume Score", value: 82, color: "#00c9a7" },
  { label: "Portfolio Score", value: 75, color: "#3b82f6" },
  { label: "Dev Score", value: 92, color: "#f59e0b" },
  { label: "Interview Ready", value: 68, color: "#f43f5e" },
  { label: "Placement Ready", value: 72, color: "#00c9a7" },
  { label: "System Design", value: 58, color: "#3b82f6" },
];

const domains = [
  { label: "Frontend", value: 88, color: "#3b82f6" },
  { label: "Backend", value: 74, color: "#00c9a7" },
  { label: "AI / ML", value: 52, color: "#f59e0b" },
  { label: "DevOps", value: 60, color: "#f43f5e" },
];

export default function CareerProgress() {
  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">Career Progress</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <p className="text-[11px] font-semibold text-[#555] mb-4">Progress Rings</p>
          <div className="flex flex-wrap gap-5">
            {rings.map((r) => (
              <Ring key={r.label} label={r.label} value={r.value} color={r.color} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold text-[#555] mb-3">Domain Strength</p>
            <div className="space-y-3">
              {domains.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span className="font-semibold text-[#aaa]">{s.label}</span>
                    <span className="font-black" style={{ color: s.color }}>{s.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#1c1c1c] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Overall Dev Score", value: "92", color: "#00c9a7" }, { label: "Placement Readiness", value: "72%", color: "#3b82f6" }].map(s => (
              <div key={s.label} className="bg-[#1c1c1c] rounded-xl p-4 text-center hover:bg-[#222] transition-colors">
                <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-[#555] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
