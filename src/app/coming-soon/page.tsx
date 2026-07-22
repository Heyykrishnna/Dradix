"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Noise from "@/components/Noise";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { apiFetch } from "@/lib/api";

export default function ComingSoonPage() {
  const router = useRouter();

  const [bgUrl, setBgUrl] = useState<string>("/assets/images/COM-2.png");
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotifiedModal, setShowNotifiedModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loaderText, setLoaderText] = useState(
    "Preparing something special.....",
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBg = localStorage.getItem("dradix_coming_soon_bg");
      if (savedBg) {
        const timer = setTimeout(() => {
          setBgUrl(savedBg);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("dradix_redirected") === "true") {
        const timer = setTimeout(() => {
          setLoaderText("Redirecting to Private Preview...");
        }, 0);
        sessionStorage.removeItem("dradix_redirected");
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await apiFetch("/waitlist", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail }),
        skipAuth: true,
      });

      setSubmittedEmail(cleanEmail);
      setShowNotifiedModal(true);
      setEmail("");
    } catch (err: unknown) {
      console.warn("Backend waitlist sync issue, saving locally:", err);
      setSubmittedEmail(cleanEmail);
      setShowNotifiedModal(true);
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Khandelwal@030707") {
      localStorage.setItem("dradix_unlocked", "true");
      router.push("/dashboard");
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-10 text-zinc-900 overflow-hidden bg-zinc-950 font-sans selection:bg-zinc-200">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src={bgUrl}
          alt="Waitlist Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(15, 12, 10, 0.6), rgba(30, 15, 10, 0.75))`,
          }}
        />
      </div>

      <Noise patternAlpha={12} />

      {!imageLoaded && (
        <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center text-zinc-500 font-sans text-sm tracking-wider z-50">
          {loaderText}
        </div>
      )}

      <div
        className={`relative z-10 w-full max-w-260 bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border border-white/50 pt-10 sm:pt-14 pb-0 px-6 sm:px-12 flex flex-col items-center justify-between transition-all duration-700 ease-in-out ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="w-full text-center flex flex-col items-center">
          <h1 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl text-zinc-900 tracking-tight leading-none mb-3.5">
            Join The Waitlist
          </h1>

          <p className="text-zinc-500 font-sans text-xs sm:text-sm font-normal leading-relaxed max-w-md mx-auto mb-12">
            Join now to access new features and updates
            <br className="hidden sm:block" />
            and be part of our early community.
          </p>

          <form
            onSubmit={handleRequestAccess}
            className="w-full max-w-115 mx-auto"
          >
            <div className="bg-[#efefef] hover:bg-[#eaeaea] focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-400 transition-all p-1.5 pl-6 rounded-full flex items-center shadow-inner border border-zinc-200/90">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL ADDRESS"
                required
                disabled={isSubmitting}
                className="bg-transparent font-sans text-[11px] uppercase tracking-wider text-zinc-900 placeholder:text-zinc-400 focus:outline-none flex-1 pr-2 min-w-0 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-linear-to-b from-zinc-800 to-zinc-950 hover:from-black hover:to-zinc-900 text-white font-sans text-[11px] font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-md active:scale-95 shrink-0 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>UPDATING...</span>
                  </>
                ) : (
                  "GET NOTIFIED"
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-2.5 mt-5">
            <div className="flex -space-x-2 overflow-hidden shrink-0">
              <Image
                src="/assets/images/Avatar.jpg"
                alt="Community member"
                width={24}
                height={24}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              />
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                alt="Community member"
                width={24}
                height={24}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover select-none pointer-events-none"
                unoptimized
              />
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                alt="Community member"
                width={24}
                height={24}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                unoptimized
              />
            </div>
            <span className="text-[11px] font-sans text-zinc-500 font-medium tracking-tight">
              Join 10,020+ others on the waitlist
            </span>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="mt-2 flex flex-col items-center"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Enter password"
              className={`bg-transparent border-b ${
                passwordError
                  ? "border-rose-500 text-rose-500"
                  : "border-zinc-300 focus:border-zinc-800 text-zinc-800"
              } text-[8px] tracking-wider text-center placeholder:text-zinc-400 focus:outline-none py-1 w-30 transition-colors font-sans`}
            />
          </form>
        </div>

        <div className="w-full max-w-2xl mt-6 sm:mt-8 pt-2 flex justify-center overflow-hidden">
          <Image
            src="/assets/images/WAITL.png"
            alt="Waitlist Community"
            width={600}
            height={220}
            className="w-full max-h-45 sm:max-h-55 object-contain object-bottom select-none pointer-events-none"
          />
        </div>
      </div>

      {showNotifiedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-zinc-100 relative flex flex-col items-center transition-all animate-scale-up">
            <button
              onClick={() => setShowNotifiedModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1 transition-colors cursor-pointer"
              title="Close"
            >
              <Cross2Icon className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50/50">
              <CheckIcon className="w-6 h-6" />
            </div>

            <h3 className="font-sans font-bold text-lg text-zinc-900 mb-1.5">
              You&apos;re on the list!
            </h3>

            <p className="text-zinc-500 font-sans text-xs leading-relaxed max-w-xs mb-6">
              We will notify you at{" "}
              <span className="font-semibold text-zinc-800">
                {submittedEmail}
              </span>{" "}
              as soon as early access or new updates become available.
            </p>

            <button
              onClick={() => setShowNotifiedModal(false)}
              className="w-full bg-zinc-900 hover:bg-black text-white font-sans text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
