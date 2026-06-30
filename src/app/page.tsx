"use client";

import Link from "next/link";
import CandyButton from "@/components/ui/candy-button";
import Noise from "@/components/Noise";
import { AsciiStrip } from "@/components/AsciiEffect";


export default function Home() {

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between text-white overflow-x-hidden font-sans"
      style={{
        backgroundImage: `url('https://ik.imagekit.io/yatharth/HLmPyeRaAAApl9_.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Noise />

      <header className="w-full max-w-7xl mx-auto px-6 h-24 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center group">
          {/* <Image
            src="https://ik.imagekit.io/yatharth/DRADIX-LOGO.png"
            alt="Dradix Logo"
            width={40}
            height={40}
            className="rounded-lg object-contain mr-2"
          /> */}
          <span className="font-heading font-bold text-xl text-white">Dradix</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-white/80 hover:text-white font-medium text-sm transition-colors">
            Login
          </Link>
          <Link href="/register" className="border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium text-sm px-5 py-2 rounded-full transition-all backdrop-blur-sm">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center py-16 md:pb-85 text-center z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center gap-3 md:gap-8">
          <h1 className="text-white text-4xl sm:text-6xl md:text-8xl font-bold max-w-4xl mx-auto">
            <span className="font-serif italic font-normal block sm:inline">Showcase git Activity</span>{" "}
            <br className="hidden md:inline" />
            <span className="font-serif italic font-normal block sm:inline">With Smart AI.</span>
          </h1>

          <p className="text-[#003c3a]/80 font-sans text-sm sm:text-base md:text-md max-w-xl sm:max-w-xl mx-auto leading-relaxed font-light">
            AI unifies your coding activity, highlights key achievements, and guides your career so you spend less time building portfolios.
          </p>

          <div className="mt-2 flex justify-center">
            <CandyButton>
              Try Now For Free
            </CandyButton>
          </div>
        </div>
      </main>

      <AsciiStrip />

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-1"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)",
        }}
      />
    </div>
  );
}
