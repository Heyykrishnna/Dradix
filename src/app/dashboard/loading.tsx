"use client";

import Loader from "@/components/Loader";
import VideoLoaderBackground from "@/components/VideoLoaderBackground";

export default function DashboardLoading() {
  return (
    <VideoLoaderBackground className="min-h-screen">
      <Loader />
      <p className="mt-6 text-sm font-medium text-zinc-700 animate-pulse tracking-wide font-sans">
        Loading Dradix Dashboard...
      </p>
    </VideoLoaderBackground>
  );
}
