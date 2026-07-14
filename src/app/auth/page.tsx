"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, EyeClosedIcon, EyeOpenIcon, Cross1Icon } from "@radix-ui/react-icons";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#101010] text-white font-sans overflow-hidden selection:bg-zinc-800">
      <div
        className={`absolute top-0 left-0 w-full lg:w-1/2 h-full flex flex-col transition-transform duration-700 ease-in-out z-10 bg-[#101010] shadow-[0_0_50px_rgba(0,0,0,0.5)] ${
          isLogin ? "lg:translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="absolute top-8 left-8 sm:left-12 lg:left-16 z-20">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-[#161616] hover:bg-zinc-800 transition-all duration-200 group"
          >
            <ChevronLeftIcon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </Link>
        </div>

        <div className="relative flex-1 w-full h-full flex items-center justify-center">
          <div
            className={`absolute inset-0 flex flex-col justify-center max-w-[420px] w-full mx-auto px-8 sm:px-0 transition-all duration-700 ${
              isLogin 
                ? "opacity-0 invisible translate-y-8 lg:translate-y-0 lg:-translate-x-12 scale-95" 
                : "opacity-100 visible translate-y-0 translate-x-0 scale-100 delay-150"
            }`}
          >
            <div className="text-center mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                <span className="font-serif italic font-normal block sm:inline">Sign up Account.</span>
              </h1>
              <p className="text-zinc-400 text-[15px]">Enter your personal data to create your account</p>
            </div>

            <button className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#181818] hover:bg-[#202020] rounded-lg transition-colors border border-zinc-800 mb-8">
              <FcGoogle className="w-5 h-5" />
              <span className="text-[15px] font-medium text-zinc-200">Google</span>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-zinc-800/80"></div>
              <span className="text-zinc-500 text-sm">Or</span>
              <div className="flex-1 h-px bg-zinc-800/80"></div>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex gap-5">
                <div className="flex-1 space-y-2">
                  <label className="text-[14px] font-medium text-zinc-200">First Name</label>
                  <input
                    type="text"
                    placeholder="Yatharth"
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[14px] font-medium text-zinc-200">Last Name</label>
                  <input
                    type="text"
                    placeholder="Khandelwal"
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-medium text-zinc-200">Email</label>
                <input
                  type="email"
                  placeholder="yatharthkhandelwal@gmail.com"
                  className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-medium text-zinc-200">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOpenIcon className="w-[18px] h-[18px]" /> : <EyeClosedIcon className="w-[18px] h-[18px]" />}
                  </button>
                </div>
                <p className="text-[13px] text-zinc-500 pt-1">Must be atleast 8 characters</p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-zinc-200 hover:bg-white text-black rounded-lg font-semibold text-[15px] transition-colors mt-4 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
              >
                Register
              </button>
            </form>

            <p className="text-center text-[14px] text-zinc-400 mt-8">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-400 transition-all"
              >
                Login
              </button>
            </p>
          </div>

          <div
            className={`absolute inset-0 flex flex-col justify-center max-w-[420px] w-full mx-auto px-8 sm:px-0 transition-all duration-700 ${
              isLogin 
                ? "opacity-100 visible translate-y-0 translate-x-0 scale-100 delay-150" 
                : "opacity-0 invisible -translate-y-8 lg:translate-y-0 lg:translate-x-12 scale-95"
            }`}
          >
            <div className="text-center mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                <span className="font-serif italic font-normal block sm:inline">Welcome Back.</span>
              </h1>
              <p className="text-zinc-400 text-[15px]">Enter your credentials to access your account</p>
            </div>

            <button className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#181818] hover:bg-[#202020] rounded-lg transition-colors border border-zinc-800 mb-8">
              <FcGoogle className="w-5 h-5" />
              <span className="text-[15px] font-medium text-zinc-200">Google</span>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-zinc-800/80"></div>
              <span className="text-zinc-500 text-sm">Or</span>
              <div className="flex-1 h-px bg-zinc-800/80"></div>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-zinc-200">Email</label>
                <input
                  type="email"
                  placeholder="yatharthkhandelwal@gmail.com"
                  className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[14px] font-medium text-zinc-200">Password</label>
                  <button type="button" onClick={() => setShowForgotModal(true)} className="text-[13px] text-zinc-400 hover:text-white transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOpenIcon className="w-[18px] h-[18px]" /> : <EyeClosedIcon className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-zinc-200 hover:bg-white text-black rounded-lg font-semibold text-[15px] transition-colors mt-8 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-[14px] text-zinc-400 mt-8">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-400 transition-all"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      <div
        className={`hidden lg:block absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-700 ease-in-out z-0 bg-[#181818] ${
          isLogin ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="relative w-full h-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#101010]/70 to-transparent z-10 transition-opacity duration-700 ease-in-out ${
                isLogin ? 'opacity-0' : 'opacity-100'
              }`} 
            />
            
            <div 
              className={`absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#101010]/70 to-transparent z-10 transition-opacity duration-700 ease-in-out ${
                isLogin ? 'opacity-100' : 'opacity-0'
              }`} 
            />

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

            <h2 className="text-2xl font-serif mb-2 tracking-tight">Reset Password</h2>
            <p className="text-zinc-400 text-[14px] mb-8">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowForgotModal(false); }}>
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-zinc-200">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3.5 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[15px] placeholder:text-zinc-600 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-zinc-200 hover:bg-white text-black rounded-lg font-semibold text-[15px] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
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
