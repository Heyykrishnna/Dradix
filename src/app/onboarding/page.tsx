"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { FileText, Upload, CheckCircle2, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/types/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    github: "",
    leetcode: "",
    codeforces: "",
    linkedin: "",
    portfolio: "",
    bio: "",
  });

  const [resumeFile, setResumeFile] = useState<{
    name: string;
    size: number;
    data: string;
    type: string;
  } | null>(null);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleResumeFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const fileObj = {
        name: file.name,
        size: file.size,
        data: base64Data,
        type: file.name.split(".").pop()?.toLowerCase() || "pdf",
      };

      setResumeFile(fileObj);
      setErrorMsg("");

      if (typeof window !== "undefined") {
        localStorage.setItem("dradix_profile_resume", file.name);
        localStorage.setItem("dradix_profile_resume_data", base64Data);
      }
    } catch (err) {
      console.error("Resume file reading error:", err);
      setErrorMsg("Failed to read resume file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setErrorMsg("Resume upload is compulsory to complete setup.");
      setStep(3);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await apiFetch<ApiResponse<null>>("/users/onboard", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (resumeFile) {
        await apiFetch("/users/resume", {
          method: "POST",
          body: JSON.stringify({
            resume_name: resumeFile.name,
            resume_file_size: resumeFile.size,
            file_type: resumeFile.type,
            resume_data: resumeFile.data,
          }),
        });
      }

      localStorage.setItem("userProfile", JSON.stringify(formData));
      localStorage.setItem("isOnboarded", "true");
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to save profiles",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
          <div className="max-w-105 w-full mx-auto">
            {errorMsg && (
              <div className="mb-6 px-4 py-3 bg-red-950/40 border border-red-900/60 text-red-200 rounded-lg text-sm flex justify-between items-center">
                <span>{errorMsg}</span>
                <button
                  onClick={() => setErrorMsg("")}
                  className="text-red-400 hover:text-red-200 cursor-pointer"
                >
                  <Cross1Icon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-400 text-sm font-medium">
                Step {step} of {totalSteps}
              </span>
              <span className="text-zinc-500 text-sm">
                {Math.round((step / totalSteps) * 100)}% Completed
              </span>
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
            className={`absolute inset-0 flex flex-col justify-center max-w-105 w-full mx-auto transition-all duration-700 ease-in-out ${
              step === 1
                ? "opacity-100 visible translate-x-0 scale-100 delay-150"
                : step > 1
                  ? "opacity-0 invisible -translate-x-12 scale-95"
                  : "opacity-0 invisible translate-x-12 scale-95"
            }`}
          >
            <div className="mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                <span className="font-serif italic font-normal block">
                  Coding Profiles.
                </span>
              </h1>
              <p className="text-zinc-400 text-[15px]">
                Link your competitive programming and development profiles to
                help us understand your coding journey and tailor your
                experience.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-6"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-zinc-200">
                    GitHub Username *
                  </label>
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
                  <label className="text-[14px] font-medium text-zinc-200">
                    LeetCode Username *
                  </label>
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
                  <label className="text-[14px] font-medium text-zinc-200">
                    Codeforces Username (Optional)
                  </label>
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
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-200 hover:bg-white text-black rounded-lg font-semibold text-[15px] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer"
                >
                  Continue <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          <div
            className={`absolute inset-0 flex flex-col justify-center max-w-105 w-full mx-auto transition-all duration-700 ease-in-out ${
              step === 2
                ? "opacity-100 visible translate-x-0 scale-100 delay-150"
                : step > 2
                  ? "opacity-0 invisible -translate-x-12 scale-95"
                  : "opacity-0 invisible translate-x-12 scale-95"
            }`}
          >
            <div className="mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                <span className="font-serif italic font-normal block">
                  Professional Links.
                </span>
              </h1>
              <p className="text-zinc-400 text-[15px]">
                Add your professional networks and portfolio so others can
                discover your work and connect with you.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-6"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-zinc-200">
                    LinkedIn URL *
                  </label>
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
                  <label className="text-[14px] font-medium text-zinc-200">
                    Portfolio URL *
                  </label>
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
                  className="btn-candy px-5 py-3.5 bg-linear-to-b from-[#181818] to-[#121212] border border-zinc-800 rounded-xl text-zinc-300 flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  className="btn-candy flex-1 flex items-center justify-center gap-2 py-3.5 bg-linear-to-b from-zinc-100 to-zinc-300 text-black rounded-xl font-semibold text-[15px] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                >
                  Continue <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          <div
            className={`absolute inset-0 flex flex-col justify-center max-w-105 w-full mx-auto transition-all duration-700 ease-in-out ${
              step === 3
                ? "opacity-100 visible translate-x-0 scale-100 delay-150"
                : step > 3
                  ? "opacity-0 invisible -translate-x-12 scale-95"
                  : "opacity-0 invisible translate-x-12 scale-95"
            }`}
          >
            <div className="mb-8">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                <span className="font-serif italic font-normal block">
                  Resume & Proof of Work.
                </span>
              </h1>
              <p className="text-zinc-400 text-[15px]">
                Upload your updated resume or proof of work document (.pdf,
                .docx). This is compulsory to complete setup.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!resumeFile) {
                  setErrorMsg("Resume upload is compulsory to continue setup.");
                  return;
                }
                setErrorMsg("");
                handleNext();
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="text-[14px] font-medium text-zinc-200 block">
                  Upload Resume Document *
                </label>

                {!resumeFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-[#181818] rounded-xl p-6 text-center cursor-pointer transition-colors group flex flex-col items-center justify-center min-h-40"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleResumeFileSelect}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5 text-zinc-300" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-200">
                      Click to upload{" "}
                      <span className="text-zinc-400 font-normal">
                        or select file
                      </span>
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      PDF or DOCX (Max 3.0MB)
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-zinc-200" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB •
                          Uploaded
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-candy px-5 py-3.5 bg-linear-to-b from-[#181818] to-[#121212] border border-zinc-800 rounded-xl text-zinc-300 flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  className="btn-candy flex-1 flex items-center justify-center gap-2 py-3.5 bg-linear-to-b from-zinc-100 to-zinc-300 text-black rounded-xl font-semibold text-[15px] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                >
                  Continue <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          <div
            className={`absolute inset-0 flex flex-col justify-center max-w-105 w-full mx-auto transition-all duration-700 ease-in-out ${
              step === 4
                ? "opacity-100 visible translate-x-0 scale-100 delay-150"
                : step > 4
                  ? "opacity-0 invisible -translate-x-12 scale-95"
                  : "opacity-0 invisible translate-x-12 scale-95"
            }`}
          >
            <div className="mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                <span className="font-serif italic font-normal block">
                  About You.
                </span>
              </h1>
              <p className="text-zinc-400 text-[15px]">
                Tell us a bit about yourself. Share your interests, goals, and
                what you&apos;re currently working on.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[14px] font-medium text-zinc-200">
                      Short Bio *
                    </label>
                    <span className="text-[12px] text-zinc-500">
                      Minimum 30 characters
                    </span>
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
                  disabled={loading}
                  className="btn-candy px-5 py-3.5 bg-linear-to-b from-[#181818] to-[#121212] border border-zinc-800 rounded-xl text-zinc-300 flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-candy flex-1 flex items-center justify-center gap-2 py-3.5 bg-linear-to-b from-zinc-100 to-zinc-300 text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-xl font-semibold text-[15px] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                >
                  {loading ? "Completing Setup..." : "Complete Setup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
