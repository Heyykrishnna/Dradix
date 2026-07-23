"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SegmentedSlider from "./SegmentedSlider";

const dailyData = [
  { day: "6am", hours: 0.8, commits: 2, problems: 1 },
  { day: "9am", hours: 1.5, commits: 4, problems: 2 },
  { day: "12pm", hours: 2.2, commits: 6, problems: 3 },
  { day: "3pm", hours: 1.8, commits: 5, problems: 2 },
  { day: "6pm", hours: 2.6, commits: 9, problems: 4 },
  { day: "9pm", hours: 1.1, commits: 3, problems: 1 },
];

const weeklyData = [
  { day: "Mon", hours: 4.5, commits: 12, problems: 6 },
  { day: "Tue", hours: 6.2, commits: 18, problems: 8 },
  { day: "Wed", hours: 3.8, commits: 8, problems: 5 },
  { day: "Thu", hours: 7.1, commits: 22, problems: 10 },
  { day: "Fri", hours: 5.5, commits: 14, problems: 7 },
  { day: "Sat", hours: 4.0, commits: 7, problems: 4 },
  { day: "Sun", hours: 2.9, commits: 6, problems: 2 },
];

const monthlyData = [
  { day: "Week 1", hours: 28, commits: 68, problems: 35 },
  { day: "Week 2", hours: 34, commits: 87, problems: 42 },
  { day: "Week 3", hours: 31, commits: 72, problems: 38 },
  { day: "Week 4", hours: 40, commits: 98, problems: 51 },
];

const yearlyData = [
  { day: "Q1", hours: 310, commits: 720, problems: 340 },
  { day: "Q2", hours: 360, commits: 840, problems: 410 },
  { day: "Q3", hours: 420, commits: 960, problems: 490 },
  { day: "Q4", hours: 380, commits: 910, problems: 450 },
];

type Toggle = "Daily" | "Weekly" | "Monthly" | "Yearly";
const toggles: Toggle[] = ["Daily", "Weekly", "Monthly", "Yearly"];

const summary = [
  { label: "Coding Hours", value: "34", unit: "hrs", color: "#00c9a7" },
  { label: "Commits", value: "87", color: "#3b82f6" },
  { label: "Problems", value: "42", color: "#f59e0b" },
  { label: "Repos Created", value: "2", color: "#f43f5e" },
];

export default function WeeklyActivity() {
  const [activeToggle, setActiveToggle] = useState<Toggle>("Weekly");

  const data =
    activeToggle === "Daily"
      ? dailyData
      : activeToggle === "Weekly"
        ? weeklyData
        : activeToggle === "Monthly"
          ? monthlyData
          : yearlyData;

  return (
    <div className="bg-[#161616] rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider">
            Activity
          </p>
          <p className="text-[17px] font-black text-white mt-0.5">
            Coding Overview
          </p>
        </div>
        <SegmentedSlider
          options={toggles}
          value={activeToggle}
          onChange={setActiveToggle}
          theme="dark"
        />
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c9a7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00c9a7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="problemsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="commitsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e1e1e"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "#444", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#444", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1c1c",
                border: "none",
                borderRadius: "12px",
                fontSize: 12,
              }}
              labelStyle={{ color: "#888" }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#00c9a7"
              strokeWidth={2.5}
              fill="url(#hoursGrad)"
              name="Hours"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#commitsGrad)"
              name="Commits"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="problems"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#problemsGrad)"
              name="Problems"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4">
        <div className="grid grid-cols-4 gap-3">
          {summary.map((s) => (
            <div
              key={s.label}
              className="bg-[#1c1c1c] rounded-xl p-3 text-center"
            >
              <p className="text-xl font-black text-white">
                {s.value}
                <span
                  className="text-[11px] font-medium ml-0.5"
                  style={{ color: s.color }}
                >
                  {s.unit}
                </span>
              </p>
              <p className="text-[10px] text-[#444] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
