"use client";

import React from "react";
import { notFound } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import VideoLoaderBackground from "@/components/VideoLoaderBackground";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <VideoLoaderBackground className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <Loader />
      </VideoLoaderBackground>
    );
  }

  if (!user || user.role !== "ADMIN") {
    notFound();
  }

  return <>{children}</>;
}

