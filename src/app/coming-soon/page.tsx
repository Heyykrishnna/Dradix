"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Noise from "@/components/Noise";

export default function ComingSoonPage() {
  const router = useRouter();

  const [bgUrl, setBgUrl] = useState<string>("/assets/images/COM-2.png");
  const [email, setEmail] = useState("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "success">("idle");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loaderText, setLoaderText] = useState("Preparing something special.....");

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

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setRequestStatus("success");
      setTimeout(() => setRequestStatus("idle"), 5000);
      setEmail("");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Khandelwal@030707") {
      localStorage.setItem("dradix_unlocked", "true");
      router.push("/");
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between text-white overflow-hidden bg-zinc-950 font-sans">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src={bgUrl}
          alt="Coming Soon Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
        />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(15, 12, 10, 0.75), rgba(15, 12, 10, 0.9))`
          }}
        />
      </div>

      <Noise patternAlpha={15} />

      {!imageLoaded && (
        <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center text-zinc-500 font-sans text-sm tracking-wider z-50">
          {loaderText}
        </div>
      )}

      <div className={`flex-1 flex flex-col justify-between w-full h-full transition-opacity duration-700 ease-in-out z-10 ${imageLoaded ? "opacity-100" : "opacity-0"}`}>
        <header className="w-full max-w-7xl mx-auto px-6 pt-8 flex flex-col items-center">
          <h1 className="font-sans font-black text-md tracking-[0.25em] text-zinc-100">
            DRADIX
          </h1>
        </header>

        <main className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-6">
          <h1 className="text-white text-4xl sm:text-6xl md:text-9xl font-light max-w-4xl mx-auto font-serif italic leading-tight">
            Coming Soon
          </h1>

          <p className="mt-8 text-[9px] tracking-[0.35em] text-zinc-400 font-sans font-light">
            PRIVATE PREVIEW · BY INVITATION
          </p>

          <form
            onSubmit={handleRequestAccess}
            className="mt-3 flex items-center bg-black/40 border border-zinc-800 rounded-full p-1.5 w-full max-w-[420px] focus-within:border-zinc-700 transition-colors backdrop-blur-md"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-transparent px-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-sans font-bold text-[10px] tracking-wider uppercase px-6 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              Request Access
            </button>
          </form>

          {requestStatus === "success" && (
            <p className="text-emerald-500 text-[11px] font-semibold mt-3 animate-fade-in">
              ✓ Access request submitted successfully!
            </p>
          )}

          <form onSubmit={handlePasswordSubmit} className="mt-4 flex flex-col items-center gap-1.5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`bg-transparent border-b ${
                passwordError ? "border-rose-500 text-rose-400" : "border-zinc-800 focus:border-zinc-600"
              } text-[10px] tracking-widest text-center text-zinc-500 placeholder-zinc-600 focus:outline-none py-1 w-44 transition-colors`}
            />
          </form>
        </main>
      </div>
    </div>
  );
}
