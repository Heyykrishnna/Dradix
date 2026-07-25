"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import Loader from "@/components/Loader";
import VideoLoaderBackground from "@/components/VideoLoaderBackground";
import { LockClosedIcon, RocketIcon, ReloadIcon } from "@radix-ui/react-icons";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();
  const [bootstrapping, setBootstrapping] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  const handleElevateToAdmin = async () => {
    setBootstrapping(true);
    setErrorMsg("");
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>("/admin/bootstrap-admin", {
        method: "POST",
      });
      if (res.success) {
        await checkAuth();
      } else {
        setErrorMsg(res.message || "Failed to elevate role");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to grant admin role";
      setErrorMsg(msg);
    } finally {
      setBootstrapping(false);
    }
  };

  if (loading) {
    return (
      <VideoLoaderBackground className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <Loader />
      </VideoLoaderBackground>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "ADMIN") {
    return (
      <VideoLoaderBackground className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-black/75 backdrop-blur-lg p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zinc-200 text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center text-2xl shadow-sm">
            <LockClosedIcon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-[20px] font-black text-zinc-900 tracking-tight">
              Administrator Privileges Required
            </h2>
            <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">
              Your account{" "}
              <span className="font-extrabold text-zinc-800">
                ({user.email})
              </span>{" "}
              is currently registered with the{" "}
              <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                USER
              </span>{" "}
              role.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-[12px] font-bold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleElevateToAdmin}
              disabled={bootstrapping}
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-black text-white text-[13px] font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {bootstrapping ? (
                <>
                  <ReloadIcon className="w-4 h-4 animate-spin" />
                  <span>Granting Admin Access...</span>
                </>
              ) : (
                <>
                  <RocketIcon className="w-4 h-4 text-emerald-400" />
                  <span>Elevate Account to ADMIN</span>
                </>
              )}
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[12px] font-bold rounded-2xl transition-colors cursor-pointer"
            >
              Return to User Dashboard
            </button>
          </div>
        </div>
      </VideoLoaderBackground>
    );
  }

  return <>{children}</>;
}
