"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeftIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { FcGoogle } from "react-icons/fc";
import { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";

function AuthFormContent() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const searchParams = useSearchParams();
  const { login, register } = useAuth();

  const errorParam = searchParams.get("error");
  const initialError =
    errorParam === "google_failed"
      ? "Google authentication failed. Please try again."
      : errorParam === "no_token"
        ? "Failed to authenticate session."
        : "";

  const [errorMsg, setErrorMsg] = useState(initialError);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        // Auto-generate username from email
        const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
        const randomNum = Math.floor(100 + Math.random() * 900);
        const username = `${baseUsername}${randomNum}`;

        await register({
          email,
          password,
          username,
          first_name: firstName,
          last_name: lastName,
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please check details.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "http://localhost:5001";
    window.location.href = `${backendUrl}/api/v1/auth/google`;
  };

  return (
    <div className="relative min-h-screen w-full bg-[#101010] text-white font-sans overflow-hidden selection:bg-zinc-800">
      <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full flex flex-col z-10 bg-[#101010] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-8 left-8 sm:left-12 lg:left-16 z-20">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-[#161616] hover:bg-zinc-800 transition-all duration-200 group"
          >
            <ChevronLeftIcon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </Link>
        </div>

        <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-y-auto py-16">
          <div className="relative max-w-[420px] w-full mx-auto px-8 sm:px-0">
            {errorMsg && (
              <div className="mb-6 px-4 py-3 bg-red-950/40 border border-red-900/60 text-red-200 rounded-lg text-sm flex justify-between items-center">
                <span>{errorMsg}</span>
                <button
                  onClick={() => setErrorMsg("")}
                  className="text-red-400 hover:text-red-200"
                >
                  <Cross1Icon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ─── Sign Up Form ─── */}
            <div
              className={`transition-all duration-500 ${
                isLogin
                  ? "opacity-0 pointer-events-none absolute translate-y-8 scale-95"
                  : "opacity-100 scale-100"
              }`}
            >
              <div className="text-center mb-8">
                <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                  <span className="font-serif italic font-normal block sm:inline">
                    Sign up Account.
                  </span>
                </h1>
                <p className="text-zinc-400 text-sm">
                  Enter your personal data to create your account
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="flex items-center justify-center gap-3 w-full py-3 bg-[#181818] hover:bg-[#202020] rounded-lg transition-colors border border-zinc-800 mb-6"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-sm font-medium text-zinc-200">
                  Google
                </span>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-zinc-800/80"></div>
                <span className="text-zinc-500 text-xs">Or</span>
                <div className="flex-1 h-px bg-zinc-800/80"></div>
              </div>

              <form className="space-y-4" onSubmit={handleEmailAuth}>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[13px] font-medium text-zinc-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Yatharth"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 transition-colors"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[13px] font-medium text-zinc-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Khandelwal"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-zinc-300">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="yatharthkhandelwal@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-zinc-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 pr-12 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOpenIcon className="w-[18px] h-[18px]" />
                      ) : (
                        <EyeClosedIcon className="w-[18px] h-[18px]" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-500 pt-0.5">
                    Must be at least 8 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-zinc-200 hover:bg-white text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-lg font-semibold text-[14px] transition-colors mt-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>

              <p className="text-center text-[13px] text-zinc-400 mt-6">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setErrorMsg("");
                  }}
                  className="text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-400 transition-all"
                >
                  Login
                </button>
              </p>
            </div>

            {/* ─── Sign In Form ─── */}
            <div
              className={`transition-all duration-500 ${
                isLogin
                  ? "opacity-100 scale-100"
                  : "opacity-0 pointer-events-none absolute -translate-y-8 scale-95"
              }`}
            >
              <div className="text-center mb-8">
                <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                  <span className="font-serif italic font-normal block sm:inline">
                    Welcome Back.
                  </span>
                </h1>
                <p className="text-zinc-400 text-sm">
                  Enter your credentials to access your account
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="flex items-center justify-center gap-3 w-full py-3 bg-[#181818] hover:bg-[#202020] rounded-lg transition-colors border border-zinc-800 mb-6"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-sm font-medium text-zinc-200">
                  Google
                </span>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-zinc-800/80"></div>
                <span className="text-zinc-500 text-xs">Or</span>
                <div className="flex-1 h-px bg-zinc-800/80"></div>
              </div>

              <form className="space-y-4" onSubmit={handleEmailAuth}>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-zinc-300">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="yatharthkhandelwal@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[13px] font-medium text-zinc-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[12px] text-zinc-400 hover:text-white transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 pr-12 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOpenIcon className="w-[18px] h-[18px]" />
                      ) : (
                        <EyeClosedIcon className="w-[18px] h-[18px]" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-zinc-200 hover:bg-white text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-lg font-semibold text-[14px] transition-colors mt-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="text-center text-[13px] text-zinc-400 mt-6">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setErrorMsg("");
                  }}
                  className="text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-400 transition-all"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute top-0 left-1/2 w-1/2 h-full z-0 bg-[#181818]">
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#101010]/70 to-transparent z-10" />
          <Image
            src="/assets/images/AUTH-IMG.png"
            alt="Auth background"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForgotModal(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-[#101010] border border-zinc-800/80 rounded-2xl shadow-2xl p-8 transform transition-all">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
            >
              <Cross1Icon className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-serif mb-2 tracking-tight">
              Reset Password
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setShowForgotModal(false);
              }}
            >
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-zinc-200 hover:bg-white text-black rounded-lg font-semibold text-[14px] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-sans text-sm tracking-wider">
          Loading Auth Page...
        </div>
      }
    >
      <AuthFormContent />
    </Suspense>
  );
}
