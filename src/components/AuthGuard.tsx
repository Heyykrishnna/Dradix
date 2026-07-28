"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import VideoLoaderBackground from "@/components/VideoLoaderBackground";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <VideoLoaderBackground className="fixed inset-0 min-h-screen z-50">
        <Loader />
      </VideoLoaderBackground>
    );
  }

  return <>{children}</>;
}
