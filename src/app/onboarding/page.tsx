"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    github: "",
    leetcode: "",
    codeforces: "",
    linkedin: "",
    portfolio: "",
    bio: "",
  });

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(formData));
    localStorage.setItem("isOnboarded", "true");
    router.push("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#101010] text-white font-sans overflow-hidden selection:bg-zinc-800 flex">
      <div className="hidden lg:block relative w-1/2 h-screen z-0 bg-[#181818]">
        <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#101010] to-transparent z-10" />
        <Image 
          src="/assets/images/ONB-IM.png" 
          alt="Onboarding background" 
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 h-screen flex flex-col z-10 relative overflow-hidden">
        <div className="w-full px-8 sm:px-16 lg:px-24 pt-12 pb-4 shrink-0">
          <div className="max-w-[420px] w-full mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-400 text-sm font-medium">Step {step} of {totalSteps}</span>
              <span className="text-zinc-500 text-sm">{Math.round((step / totalSteps) * 100)}% Completed</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-200 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative flex-1 w-full flex items-center justify-center px-8 sm:px-16 lg:px-24">
          <div
            className={`absolute inset-0 flex flex-col justify-center max-w-[420px] w-full mx-auto transition-all duration-700 ease-in-out ${
              step === 1 
                ? "opacity-100 visible translate-x-0 scale-100 delay-150" 
                : step > 1 
                  ? "opacity-0 invisible -translate-x-12 scale-95"
                  : "opacity-0 invisible translate-x-12 scale-95"
            }`}
          >
            <div className="mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                <span className="font-serif italic font-normal block">Coding Profiles.</span>
              </h1>
              <p className="text-zinc-400 text-[15px]">Link your competitive programming and development profiles to help us understand your coding journey and tailor your experience.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-zinc-200">GitHub Username *</label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    required
                    placeholder="e.g. octocat"
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-zinc-200">LeetCode Username *</label>
                  <input
                    type="text"
                    name="leetcode"
                    value={formData.leetcode}
                    onChange={handleChange}
                    required
                    placeholder="e.g. leetcode_user"
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-zinc-200">Codeforces Username (Optional)</label>
                  <input
                    type="text"
                    name="codeforces"
                    value={formData.codeforces}
                    onChange={handleChange}
                    placeholder="e.g. tourist"
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-200 hover:bg-white text-black rounded-lg font-semibold text-[15px] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                >
                  Continue <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          <div
            className={`absolute inset-0 flex flex-col justify-center max-w-[420px] w-full mx-auto transition-all duration-700 ease-in-out ${
              step === 2 
                ? "opacity-100 visible translate-x-0 scale-100 delay-150" 
                : step > 2 
                  ? "opacity-0 invisible -translate-x-12 scale-95"
                  : "opacity-0 invisible translate-x-12 scale-95"
            }`}
          >
            <div className="mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                <span className="font-serif italic font-normal block">Professional Links.</span>
              </h1>
              <p className="text-zinc-400 text-[15px]">Add your professional networks and portfolio so others can discover your work and connect with you.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-zinc-200">LinkedIn URL *</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    required
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-zinc-200">Portfolio URL *</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    required
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-3.5 bg-[#181818] hover:bg-[#202020] border border-zinc-800 rounded-lg text-zinc-300 transition-colors flex items-center justify-center"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-200 hover:bg-white text-black rounded-lg font-semibold text-[15px] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                >
                  Continue <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          <div
            className={`absolute inset-0 flex flex-col justify-center max-w-[420px] w-full mx-auto transition-all duration-700 ease-in-out ${
              step === 3 
                ? "opacity-100 visible translate-x-0 scale-100 delay-150" 
                : step > 3 
                  ? "opacity-0 invisible -translate-x-12 scale-95"
                  : "opacity-0 invisible translate-x-12 scale-95"
            }`}
          >
            <div className="mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                <span className="font-serif italic font-normal block">About You.</span>
              </h1>
              <p className="text-zinc-400 text-[15px]">Tell us a bit about yourself. Share your interests, goals, and what you&apos;re currently working on.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[14px] font-medium text-zinc-200">Short Bio *</label>
                    <span className="text-[12px] text-zinc-500">Minimum 30 characters</span>
                  </div>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    minLength={30}
                    rows={4}
                    placeholder="I am a passionate software engineer..."
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-3.5 bg-[#181818] hover:bg-[#202020] border border-zinc-800 rounded-lg text-zinc-300 transition-colors flex items-center justify-center"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-200 hover:bg-white text-black rounded-lg font-semibold text-[15px] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                >
                  Complete Setup
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
