"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, setAccessToken } from "@/lib/api";
import { ApiResponse, SafeUser } from "@/types/auth";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : "Verification token is missing",
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await apiFetch<
          ApiResponse<{ user: SafeUser; accessToken: string }>
        >(`/auth/verify-email?token=${token}`);
        if (res.success && res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          await checkAuth();
          setStatus("success");
          setTimeout(() => {
            router.replace("/onboarding");
          }, 3000);
        } else {
          setStatus("error");
          setMessage("Verification failed");
        }
      } catch (err: unknown) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed");
      }
    };

    verify();
  }, [searchParams, router, checkAuth, token]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-sans px-4">
      <div className="max-w-md w-full text-center bg-[#161616] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        {status === "verifying" && (
          <>
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">Verifying your email</h2>
            <p className="text-zinc-400 text-sm">
              Please wait while we confirm your email address
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6 text-zinc-100 font-bold">
              ✓
            </div>
            <h2 className="text-xl font-semibold mb-2">Email verified</h2>
            <p className="text-zinc-400 text-sm">
              Your email has been confirmed. Redirecting you to onboarding...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 rounded-full bg-zinc-900/60 flex items-center justify-center mx-auto mb-6 text-zinc-400 font-bold">
              !
            </div>
            <h2 className="text-xl font-semibold mb-2">Verification failed</h2>
            <p className="text-red-400 text-sm mb-6">{message}</p>
            <button
              onClick={() => router.replace("/auth")}
              className="px-6 py-2.5 bg-zinc-200 hover:bg-white text-black rounded-lg text-sm font-semibold transition-colors"
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 font-sans">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin mb-4" />
          <p className="text-sm tracking-wide">Loading verification...</p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
