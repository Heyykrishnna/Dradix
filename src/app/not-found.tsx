"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Noise from "@/components/Noise";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function NotFound() {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-zinc-950 text-white font-sans selection:bg-zinc-800">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/assets/images/NOT-FOUND.png"
          alt="404 Page Not Found Background"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.4)_60%,transparent_100%)]" />
      </div>

      <Noise patternAlpha={8} />

      <main className="relative z-20 w-full max-w-[1600px] mx-auto px-6 sm:px-12 md:px-16 pb-12 sm:pb-16 md:pb-20 pt-20 flex-1 flex flex-col justify-end items-start">
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-cabinet-grotesk font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] mb-5"
            >
              Lost in the{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-100 via-zinc-400 to-zinc-600">
                Digital Void.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-zinc-400 font-sans text-sm sm:text-md font-normal leading-relaxed max-w-lg mb-8"
            >
              The path you requested could not be located in our developer
              space. It may have been moved, renamed, or never existed in the
              repository.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <button
                onClick={() => router.back()}
                className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/90 hover:border-zinc-700 text-white font-sans text-xs font-medium uppercase tracking-wider px-6 py-3.5 rounded-full transition-all backdrop-blur-md shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-3 h-3" />
                <span>Go Back</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500 font-mono"
            >
              <Link
                href="/dashboard"
                className="hover:text-zinc-300 transition-colors"
              >
                /dashboard
              </Link>
              <span className="text-zinc-700">•</span>
              <Link
                href="/privacy"
                className="hover:text-zinc-300 transition-colors"
              >
                /privacy
              </Link>
              <span className="text-zinc-700">•</span>
              <Link
                href="/terms"
                className="hover:text-zinc-300 transition-colors"
              >
                /terms
              </Link>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
