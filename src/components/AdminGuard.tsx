"use client";

import React, { useEffect, useRef } from "react";
import { notFound, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import VideoLoaderBackground from "@/components/VideoLoaderBackground";
import { apiFetch } from "@/lib/api";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const lastReportedPath = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    const currentPath = pathname || "/admin";
    if (lastReportedPath.current === currentPath) return;
    lastReportedPath.current = currentPath;

    // Notify backend security service (logs to system_logs & sends email alerts to admins)
    apiFetch("/admin/security/access-attempt", {
      method: "POST",
      body: JSON.stringify({ path: currentPath }),
    }).catch((err) => {
      console.warn("Failed to report admin access attempt to security service:", err);
    });
  }, [user, loading, pathname]);

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


