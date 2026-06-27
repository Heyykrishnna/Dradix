import Link from "next/link";
import Noise from "@/components/Noise";

export default function Home() {
  return (
    <div
      className="relative min-h-screen flex flex-col justify-between text-white overflow-x-hidden font-sans"
      style={{
        backgroundImage: `url('https://ik.imagekit.io/yatharth/DRADIX-2.png'), linear-gradient(to bottom, #0c55cf 0%, #2563eb 30%, #60a5fa 60%, #ffffff 75%, #22c55e 88%, #15803d 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Noise />
      <header className="w-full max-w-7xl mx-auto px-6 h-24 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center group">
          <img
            src="https://ik.imagekit.io/yatharth/DRADIX-LOGO.png"
            alt="Dradix Logo"
            className="w-18 h-18 rounded-lg object-contain -mr-2.5"
          />
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

      <main className="flex-1 flex flex-col justify-center items-center py-16 md:py-24 text-center z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center gap-3 md:gap-8">
          <h1 className="text-white text-4xl sm:text-6xl md:text-8xl font-bold max-w-4xl mx-auto">
            <span className="font-serif italic font-normal block sm:inline">Showcase</span>{" "}
            <span className="font-heading font-black block sm:inline">git Activity</span>{" "}
            <br className="hidden md:inline" />
            <span className="font-serif italic font-normal block sm:inline">With Smart AI.</span>
          </h1>

          <p className="text-[#003c3a]/80 font-sans text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl mx-auto leading-relaxed font-light">
            AI unifies your coding activity, highlights key achievements, and guides your career so you spend less time building portfolios.
          </p>

          <div className="mt-2 flex justify-center">
            <button className="bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium text-sm sm:text-base py-3.5 px-8 rounded-xl sm:rounded-2xl shadow-[0_4px_24px_rgba(255,107,0,0.4)] transition-all duration-200 hover:scale-105 active:scale-95">
              Try Now For Free
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full pb-10 md:pb-14 pt-4 flex flex-col items-center justify-center gap-4 z-10">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 px-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-200 text-white text-sm font-medium tracking-wide">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
            </svg>
            <span>GitHub</span>
          </div>

          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-200 text-white text-sm font-medium tracking-wide">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M16.102 17.93l-2.69 2.607c-.466.451-1.211.451-1.677 0l-4.51-4.37c-.467-.453-.467-1.188 0-1.64l8.88-8.6c.466-.453 1.212-.453 1.678 0l2.69 2.608c.467.452.467 1.187 0 1.64l-4.37 4.232v.003L16.1 17.93zm-3.6-13.626l-1.677 1.62c-.466.452-1.212.452-1.678 0L7.46 4.304c-.467-.452-.467-1.187 0-1.64l1.678-1.623c.466-.452 1.212-.452 1.677 0l1.69 1.637c.466.452.466 1.187 0 1.626zm-7.66 4.544l2.69-2.608c.467-.452 1.212-.452 1.678 0l1.678 1.622c.466.453.466 1.188 0 1.64l-2.69 2.608c-.466.452-1.212.452-1.678 0L4.84 10.49c-.467-.453-.467-1.188 0-1.64z" />
            </svg>
            <span>LeetCode</span>
          </div>

          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-200 text-white text-sm font-medium tracking-wide">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </div>

          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-200 text-white text-sm font-medium tracking-wide">
            <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="12" width="4" height="8" rx="1"></rect>
              <rect x="10" y="7" width="4" height="13" rx="1"></rect>
              <rect x="17" y="10" width="4" height="10" rx="1"></rect>
            </svg>
            <span>Codeforces</span>
          </div>

          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-200 text-white text-sm font-medium tracking-wide">
            <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>HackerRank</span>
          </div>
        </div>
      </footer>

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
