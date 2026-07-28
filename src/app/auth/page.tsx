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
import { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, cleanUrl } from "@/lib/api";
import { ApiResponse } from "@/types/auth";

function AuthFormContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3 | 4>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotResetToken, setForgotResetToken] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const getForgotPwdStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: "Enter password", color: "bg-zinc-800" };
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
    let metCount = 0;
    if (requirements.length) metCount++;
    if (requirements.uppercase) metCount++;
    if (requirements.lowercase) metCount++;
    if (requirements.number) metCount++;
    if (requirements.special) metCount++;

    let text = "Weak";
    let color = "bg-red-500";
    if (metCount <= 2) {
      text = "Weak";
      color = "bg-red-500";
    } else if (metCount <= 4) {
      text = "Fair";
      color = "bg-amber-500";
    } else {
      text = "Strong";
      color = "bg-emerald-500";
    }
    return { score: metCount, text, color, req: requirements };
  };

  const forgotStrength = getForgotPwdStrength(forgotNewPassword);
  const isForgotPwdValid = !!(
    forgotStrength.req?.length &&
    forgotStrength.req?.uppercase &&
    forgotStrength.req?.lowercase &&
    forgotStrength.req?.number &&
    forgotStrength.req?.special &&
    forgotNewPassword === forgotConfirmPassword
  );

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccessMsg("");
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSuccessMsg(
        "If an account exists with this email, password reset instructions have been sent.",
      );
      setCooldown(60);
      setForgotStep(2);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotResend = async () => {
    if (cooldown > 0) return;
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccessMsg("");
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSuccessMsg("A new verification code has been sent.");
      setCooldown(60);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Resend failed");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await apiFetch<ApiResponse<{ resetToken: string }>>(
        "/auth/verify-reset-otp",
        {
          method: "POST",
          body: JSON.stringify({ email: forgotEmail, otp: forgotOtp }),
        },
      );
      if (res.data?.resetToken) {
        setForgotResetToken(res.data.resetToken);
        setForgotStep(3);
      } else {
        throw new Error("Failed to verify code");
      }
    } catch (err) {
      setForgotError(
        err instanceof Error ? err.message : "Verification failed",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isForgotPwdValid) return;
    setForgotLoading(true);
    setForgotError("");
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          resetToken: forgotResetToken,
          newPassword: forgotNewPassword,
        }),
      });
      setForgotStep(4);
    } catch (err) {
      setForgotError(
        err instanceof Error ? err.message : "Password reset failed",
      );
    } finally {
      setForgotLoading(false);
    }
  };
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);

  const searchParams = useSearchParams();
  const { login, register, verify2FA } = useAuth();

  const errorParam = searchParams.get("error");
  const initialError =
    errorParam === "google_failed"
      ? "Google authentication failed. Please try again."
      : errorParam === "no_token"
        ? "Failed to authenticate session."
        : "";

  const [errorMsg, setErrorMsg] = useState(initialError);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res && res.require2FA) {
          setTwoFactorToken(res.twoFactorToken || "");
          setShow2FA(true);
        }
      } else {
        const nameSource = `${firstName}${lastName}`.trim() || firstName.trim() || email.split("@")[0];
        const baseUsername = nameSource.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const randomNum = 100 + (array[0] % 900);
        const username = baseUsername ? `${baseUsername}${randomNum}` : `user${randomNum}`;

        await register({
          email,
          password,
          username,
          first_name: firstName,
          last_name: lastName,
        });

        setRegisteredEmail(email);
        setShowVerifyNotice(true);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFAError("");
    setTwoFALoading(true);
    try {
      await verify2FA(
        twoFactorToken,
        useRecoveryCode ? undefined : otpCode,
        useRecoveryCode ? recoveryCode : undefined,
      );
    } catch (err: unknown) {
      setTwoFAError(
        err instanceof Error ? err.message : "2FA Verification failed",
      );
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleResend = async () => {
    setResendStatus("sending");
    try {
      await apiFetch("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: registeredEmail }),
      });
      setResendStatus("success");
    } catch {
      setResendStatus("error");
    }
  };

  const handleGoogleAuth = () => {
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
    const cleanedApiUrl = cleanUrl(rawApiUrl);
    const backendUrl = cleanedApiUrl.replace(/\/api\/v1\/?$/, "");
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
          <div className="relative max-w-105 w-full mx-auto px-8 sm:px-0">
            {errorMsg && !showVerifyNotice && (
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

            <AnimatePresence mode="wait">
              {show2FA ? (
                <motion.div
                  key="2fa"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <div className="text-center mb-8">
                    <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                      <span className="font-serif italic font-normal block sm:inline">
                        Two-Factor Authentication.
                      </span>
                    </h1>
                    <p className="text-zinc-400 text-sm">
                      {useRecoveryCode
                        ? "Enter one of your 10-character backup recovery codes"
                        : "Verify your identity by entering the 6-digit dynamic passcode generated by your authenticator app."}
                    </p>
                  </div>

                  {twoFAError && (
                    <div className="mb-6 px-4 py-3 bg-red-950/40 border border-red-900/60 text-red-200 rounded-lg text-sm flex justify-between items-center">
                      <span>{twoFAError}</span>
                      <button
                        onClick={() => setTwoFAError("")}
                        className="text-red-400 hover:text-red-200"
                      >
                        <Cross1Icon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <form className="space-y-4" onSubmit={handle2FAVerify}>
                    {useRecoveryCode ? (
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-zinc-300">
                          Backup Recovery Code
                        </label>
                        <input
                          type="text"
                          placeholder="XXXXX-XXXXX"
                          required
                          value={recoveryCode}
                          onChange={(e) => setRecoveryCode(e.target.value)}
                          className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 transition-colors uppercase"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-zinc-300">
                          6-Digit Verification Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          pattern="\d{6}"
                          placeholder="000000"
                          required
                          value={otpCode}
                          onChange={(e) =>
                            setOtpCode(e.target.value.replace(/\D/g, ""))
                          }
                          className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 text-center tracking-[0.5em] text-lg font-mono transition-colors"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={twoFALoading}
                      className="btn-candy w-full py-3 bg-linear-to-b from-zinc-100 to-zinc-300 text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-xl font-semibold text-[14px] cursor-pointer mt-6 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                    >
                      {twoFALoading ? "Verifying..." : "Verify Code"}
                    </button>
                  </form>

                  <div className="flex flex-col items-center gap-3 mt-6 text-xs text-zinc-400">
                    <button
                      type="button"
                      onClick={() => {
                        setUseRecoveryCode(!useRecoveryCode);
                        setTwoFAError("");
                        setOtpCode("");
                        setRecoveryCode("");
                      }}
                      className="text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-400 transition-all"
                    >
                      {useRecoveryCode
                        ? "Use Authenticator App OTP"
                        : "Lost access? Use a backup recovery code"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShow2FA(false);
                        setTwoFAError("");
                        setOtpCode("");
                        setRecoveryCode("");
                        setTwoFactorToken("");
                      }}
                      className="btn-candy w-full py-3 bg-linear-to-b from-[#181818] to-[#121212] border border-zinc-800 rounded-xl text-sm font-medium text-zinc-300 cursor-pointer mt-2"
                    >
                      Back to sign in
                    </button>
                  </div>
                </motion.div>
              ) : showVerifyNotice ? (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-6 text-zinc-400 text-lg font-semibold">
                    !
                  </div>
                  <h1 className="text-3xl font-serif mb-4 tracking-tight">
                    Confirm your email
                  </h1>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    We sent a verification link to{" "}
                    <span className="text-zinc-200 font-semibold">
                      {registeredEmail}
                    </span>
                    . Please click the link to confirm your address.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleResend}
                      disabled={resendStatus === "sending"}
                      className="btn-candy w-full py-3 bg-linear-to-b from-zinc-100 to-zinc-300 text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-xl font-semibold text-[14px] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                    >
                      {resendStatus === "sending"
                        ? "Sending..."
                        : "Resend verification link"}
                    </button>

                    <button
                      onClick={() => {
                        setShowVerifyNotice(false);
                        setIsLogin(true);
                        setResendStatus("idle");
                      }}
                      className="btn-candy w-full py-3 bg-linear-to-b from-[#181818] to-[#121212] border border-zinc-800 rounded-xl text-sm font-medium text-zinc-300 cursor-pointer"
                    >
                      Back to sign in
                    </button>
                  </div>

                  {resendStatus === "success" && (
                    <p className="text-emerald-400 text-xs mt-4">
                      A new link was sent successfully.
                    </p>
                  )}
                  {resendStatus === "error" && (
                    <p className="text-red-400 text-xs mt-4">
                      Failed to send new link.
                    </p>
                  )}
                </motion.div>
              ) : isLogin ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
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
                    className="btn-candy flex items-center justify-center gap-3 w-full py-3 bg-linear-to-b from-[#181818] to-[#121212] rounded-xl border border-zinc-800 mb-6 text-sm font-medium text-zinc-200 cursor-pointer"
                  >
                    <FcGoogle className="w-5 h-5" />
                    <span>Google</span>
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
                        placeholder="name@example.com"
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
                            <EyeOpenIcon className="w-4.5 h-4.5" />
                          ) : (
                            <EyeClosedIcon className="w-4.5 h-4.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-candy w-full py-3 bg-linear-to-b from-zinc-100 to-zinc-300 text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-xl font-semibold text-[14px] cursor-pointer mt-6 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
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
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
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
                    className="btn-candy flex items-center justify-center gap-3 w-full py-3 bg-linear-to-b from-[#181818] to-[#121212] rounded-xl border border-zinc-800 mb-6 text-sm font-medium text-zinc-200 cursor-pointer"
                  >
                    <FcGoogle className="w-5 h-5" />
                    <span>Google</span>
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
                          placeholder="Gauri"
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
                          placeholder="Dangra"
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
                        placeholder="name@example.com"
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
                            <EyeOpenIcon className="w-4.5 h-4.5" />
                          ) : (
                            <EyeClosedIcon className="w-4.5 h-4.5" />
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
                      className="btn-candy w-full py-3 bg-linear-to-b from-zinc-100 to-zinc-300 text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-xl font-semibold text-[14px] cursor-pointer mt-4 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
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
                </motion.div>
              )}
            </AnimatePresence>
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
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full border-none outline-hidden cursor-default"
            onClick={() => {
              setShowForgotModal(false);
              setForgotStep(1);
              setForgotEmail("");
              setForgotOtp("");
              setForgotNewPassword("");
              setForgotConfirmPassword("");
              setForgotError("");
              setForgotSuccessMsg("");
            }}
          />
          <div className="relative w-full max-w-md bg-[#101010] border border-zinc-800/80 rounded-2xl shadow-2xl p-8 transform transition-all text-white animate-fadeIn">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotStep(1);
                setForgotEmail("");
                setForgotOtp("");
                setForgotNewPassword("");
                setForgotConfirmPassword("");
                setForgotError("");
                setForgotSuccessMsg("");
              }}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
            >
              <Cross1Icon className="w-5 h-5" />
            </button>

            {forgotStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif mb-2 tracking-tight">
                    Reset Password
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Enter your email address and we will send you a verification
                    code to reset your password.
                  </p>
                </div>

                {forgotError && (
                  <p className="text-red-400 text-xs bg-red-950/40 p-3 border border-red-900/60 rounded-lg">
                    {forgotError}
                  </p>
                )}

                <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-zinc-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 transition-colors text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-candy w-full py-3 bg-linear-to-b from-zinc-100 to-zinc-300 text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-xl font-semibold text-[14px] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                  >
                    {forgotLoading ? "Sending..." : "Send Verification Code"}
                  </button>
                </form>
              </div>
            )}

            {forgotStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif mb-2 tracking-tight">
                    Enter Verification Code
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    {forgotSuccessMsg ||
                      "We have sent a 6-digit code to your email."}
                  </p>
                </div>

                {forgotError && (
                  <p className="text-red-400 text-xs bg-red-950/40 p-3 border border-red-900/60 rounded-lg">
                    {forgotError}
                  </p>
                )}

                <form onSubmit={handleForgotOtpSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-zinc-300">
                      Verification Code (OTP)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      required
                      value={forgotOtp}
                      onChange={(e) =>
                        setForgotOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] text-center font-mono tracking-widest placeholder:text-zinc-600 transition-colors text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-candy w-full py-3 bg-linear-to-b from-zinc-100 to-zinc-300 text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-xl font-semibold text-[14px] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                  >
                    {forgotLoading ? "Verifying..." : "Verify Code"}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      disabled={cooldown > 0 || forgotLoading}
                      onClick={handleForgotResend}
                      className="btn-candy w-full py-2.5 bg-linear-to-b from-[#181818] to-[#121212] border border-zinc-800 rounded-xl text-xs text-zinc-300 disabled:text-zinc-600 font-medium cursor-pointer"
                    >
                      {cooldown > 0
                        ? `Resend code in ${cooldown}s`
                        : "Resend Code"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {forgotStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif mb-2 tracking-tight">
                    Create New Password
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Please choose a strong password that you haven&apos;t used
                    recently.
                  </p>
                </div>

                {forgotError && (
                  <p className="text-red-400 text-xs bg-red-950/40 p-3 border border-red-900/60 rounded-lg">
                    {forgotError}
                  </p>
                )}

                <form
                  onSubmit={handleForgotPasswordReset}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-zinc-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 transition-colors text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-zinc-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181818] border border-zinc-800/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-[14px] placeholder:text-zinc-600 transition-colors text-white"
                    />
                  </div>

                  {forgotNewPassword && (
                    <div className="p-3.5 border border-zinc-800/80 rounded-xl bg-zinc-900/50 space-y-2.5 animate-fadeIn">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-400">
                          Password Strength:
                        </span>
                        <span className="font-bold text-zinc-200">
                          {forgotStrength.text}
                        </span>
                      </div>

                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-full flex-1 transition-all duration-300 ${
                              forgotStrength.score >= level
                                ? forgotStrength.color
                                : "bg-zinc-800"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1 h-1 rounded-full ${forgotStrength.req?.length ? "bg-emerald-500" : "bg-zinc-600"}`}
                          />
                          <span
                            className={
                              forgotStrength.req?.length
                                ? "text-emerald-400"
                                : "text-zinc-500"
                            }
                          >
                            8+ chars
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1 h-1 rounded-full ${forgotStrength.req?.uppercase ? "bg-emerald-500" : "bg-zinc-600"}`}
                          />
                          <span
                            className={
                              forgotStrength.req?.uppercase
                                ? "text-emerald-400"
                                : "text-zinc-500"
                            }
                          >
                            Uppercase
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1 h-1 rounded-full ${forgotStrength.req?.lowercase ? "bg-emerald-500" : "bg-zinc-600"}`}
                          />
                          <span
                            className={
                              forgotStrength.req?.lowercase
                                ? "text-emerald-400"
                                : "text-zinc-500"
                            }
                          >
                            Lowercase
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1 h-1 rounded-full ${forgotStrength.req?.number ? "bg-emerald-500" : "bg-zinc-600"}`}
                          />
                          <span
                            className={
                              forgotStrength.req?.number
                                ? "text-emerald-400"
                                : "text-zinc-500"
                            }
                          >
                            Number
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1 h-1 rounded-full ${forgotStrength.req?.special ? "bg-emerald-500" : "bg-zinc-600"}`}
                          />
                          <span
                            className={
                              forgotStrength.req?.special
                                ? "text-emerald-400"
                                : "text-zinc-500"
                            }
                          >
                            Special char
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1 h-1 rounded-full ${forgotNewPassword === forgotConfirmPassword && forgotConfirmPassword ? "bg-emerald-500" : "bg-zinc-600"}`}
                          />
                          <span
                            className={
                              forgotNewPassword === forgotConfirmPassword &&
                              forgotConfirmPassword
                                ? "text-emerald-400"
                                : "text-zinc-500"
                            }
                          >
                            Match
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading || !isForgotPwdValid}
                    className="btn-candy w-full py-3 bg-linear-to-b from-zinc-100 to-zinc-300 text-black disabled:bg-zinc-600 disabled:text-zinc-400 rounded-xl font-semibold text-[14px] cursor-pointer disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                  >
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </div>
            )}

            {forgotStep === 4 && (
              <div className="space-y-6 text-center">
                <div className="w-12 h-12 bg-emerald-950/40 border border-emerald-900/60 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-2 tracking-tight">
                    Password Reset Complete
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Your password has been successfully reset. You have been
                    logged out of all other devices for security.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotStep(1);
                    setForgotEmail("");
                    setForgotOtp("");
                    setForgotNewPassword("");
                    setForgotConfirmPassword("");
                    setForgotError("");
                    setForgotSuccessMsg("");
                  }}
                  className="btn-candy w-full py-3 bg-linear-to-b from-zinc-100 to-zinc-300 text-black rounded-xl font-semibold text-[14px] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                >
                  Return to Sign In
                </button>
              </div>
            )}
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
          Loading Auth Page
        </div>
      }
    >
      <AuthFormContent />
    </Suspense>
  );
}
