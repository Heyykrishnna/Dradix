"use client";

import Link from "next/link";
import Image from "next/image";
import CandyButton from "@/components/ui/candy-button";
import Noise from "@/components/Noise";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between text-white overflow-x-hidden font-sans">
      <div className="absolute inset-0 -z-10 select-none pointer-events-none">
        <Image
          src="/assets/images/HERO-BG.png"
          alt="Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-90 contrast-80"
        />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>
      <Noise patternAlpha={20} />

      <header className="w-full max-w-7xl mx-auto px-6 h-24 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center group">
          <span className="font-heading font-bold text-xl text-[#015451]">
            Dradix
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/auth"
            className="text-[#015451] font-semibold text-sm hover:text-[#003c3a] transition-colors"
          >
            Login
          </Link>
          <Link href="/dashboard">
            <CandyButton className="text-xs px-5 py-2 font-semibold">
              Get Started
            </CandyButton>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center py-16 md:pb-40 text-center z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center gap-3 md:gap-8">
          <h1 className="text-white text-4xl sm:text-6xl md:text-8xl font-bold max-w-4xl mx-auto">
            <span className="font-serif italic font-normal block sm:inline">
              Showcase git Activity
            </span>{" "}
            <br className="hidden md:inline" />
            <span className="font-serif italic font-normal block sm:inline">
              With Smart AI.
            </span>
          </h1>

          <p className="text-[#003c3a]/80 font-sans text-sm sm:text-base md:text-md max-w-xl sm:max-w-xl mx-auto leading-relaxed font-medium">
            AI unifies your coding activity, highlights key achievements, and
            guides your career so you spend less time building portfolios.
          </p>

          <div className="mt-2 flex justify-center">
            <Link href="/dashboard">
              <CandyButton>Try Now For Free</CandyButton>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#015451]/80 z-10">
        <p>&copy; {new Date().getFullYear()} Dradix. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="hover:text-[#015451] underline font-medium transition-colors"
          >
            Privacy Policy
          </Link>
          <a
            href="mailto:support@dradix.dev"
            className="hover:text-[#015451] underline font-medium transition-colors"
          >
            support@dradix.dev
          </a>
        </div>
      </footer>
    </div>
  );
}
