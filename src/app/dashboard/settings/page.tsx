"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { Cross1Icon, ExitIcon } from "@radix-ui/react-icons";

interface Session {
  id: number;
  session_token: string;
  device_name: string | null;
  browser_name: string | null;
  browser_version: string | null;
  os: string | null;
  device_type: string | null;
  ip_address: string | null;
  location: string | null;
  created_at: string;
  last_active: string;
  expires_at: string;
  relativeActive?: string;
}

const getRelativeTime = (dateStr: string, now: number): string => {
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

export default function SettingsPage() {
  const { user, logout, checkAuth } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionToken, setCurrentSessionToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [secretData, setSecretData] = useState("");
  const [confirmOtp, setConfirmOtp] = useState("");
  const [setupLoading, setSetupLoading] = useState(false);

  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthAction, setReauthAction] = useState<
    "setup" | "disable" | "view_codes" | "regen_codes" | null
  >(null);
  const [reauthLoading, setReauthLoading] = useState(false);
  const [reauthError, setReauthError] = useState("");

  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showForceLogoutModal, setShowForceLogoutModal] = useState(false);

  const getPasswordRequirements = (pwd: string) => {
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: "Enter password", color: "bg-zinc-200" };
    const req = getPasswordRequirements(pwd);
    let metCount = 0;
    if (req.length) metCount++;
    if (req.uppercase) metCount++;
    if (req.lowercase) metCount++;
    if (req.number) metCount++;
    if (req.special) metCount++;

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
    return { score: metCount, text, color, req };
  };

  const strength = getPasswordStrength(newPassword);
  const isPasswordValid = !!(
    strength.req?.length &&
    strength.req?.uppercase &&
    strength.req?.lowercase &&
    strength.req?.number &&
    strength.req?.special &&
    newPassword === confirmNewPassword
  );

  const handlePasswordChangeSubmit = async (logoutAll: boolean) => {
    setShowForceLogoutModal(false);
    setPwdLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await apiFetch<ApiResponse<{ loggedOut: boolean }>>(
        "/auth/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            currentPassword,
            newPassword,
            logoutAllDevices: logoutAll,
          }),
        },
      );

      setSuccessMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      if (logoutAll) {
        logout();
      } else {
        checkAuth();
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setPwdLoading(false);
    }
  };

  const openReauth = (
    action: "setup" | "disable" | "view_codes" | "regen_codes",
  ) => {
    setReauthAction(action);
    setReauthPassword("");
    setReauthError("");
    setShowReauthModal(true);
  };

  const handleReauthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReauthError("");
    setReauthLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (reauthAction === "setup") {
        const res = await apiFetch<
          ApiResponse<{ secret: string; qrCode: string }>
        >("/auth/2fa/setup", {
          method: "POST",
          body: JSON.stringify({ password: reauthPassword }),
        });
        if (res.success && res.data) {
          setSecretData(res.data.secret);
          setQrCodeData(res.data.qrCode);
          setShowSetup2FA(true);
          setShowReauthModal(false);
        }
      } else if (reauthAction === "disable") {
        const res = await apiFetch<ApiResponse<null>>("/auth/2fa/disable", {
          method: "POST",
          body: JSON.stringify({ password: reauthPassword }),
        });
        if (res.success) {
          await checkAuth();
          setSuccessMsg(
            "Two-Factor Authentication (2FA) has been successfully disabled.",
          );
          setShowReauthModal(false);
          setShowRecoveryCodes(false);
        }
      } else if (reauthAction === "view_codes") {
        const res = await apiFetch<ApiResponse<{ recoveryCodes: string[] }>>(
          "/auth/2fa/recovery-codes",
          {
            method: "POST",
            body: JSON.stringify({ password: reauthPassword }),
          },
        );
        if (res.success && res.data) {
          setRecoveryCodes(res.data.recoveryCodes);
          setShowRecoveryCodes(true);
          setShowReauthModal(false);
        }
      } else if (reauthAction === "regen_codes") {
        const res = await apiFetch<ApiResponse<{ recoveryCodes: string[] }>>(
          "/auth/2fa/regenerate-recovery-codes",
          {
            method: "POST",
            body: JSON.stringify({ password: reauthPassword }),
          },
        );
        if (res.success && res.data) {
          setRecoveryCodes(res.data.recoveryCodes);
          setShowRecoveryCodes(true);
          setShowReauthModal(false);
          setSuccessMsg("Backup recovery codes regenerated successfully.");
        }
      }
    } catch (err: unknown) {
      setReauthError(
        err instanceof Error ? err.message : "Authentication failed",
      );
    } finally {
      setReauthLoading(false);
    }
  };

  const handleSetupConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await apiFetch<ApiResponse<{ recoveryCodes: string[] }>>(
        "/auth/2fa/enable",
        {
          method: "POST",
          body: JSON.stringify({ otp: confirmOtp }),
        },
      );
      if (res.success && res.data) {
        await checkAuth();
        setRecoveryCodes(res.data.recoveryCodes);
        setShowRecoveryCodes(true);
        setShowSetup2FA(false);
        setSuccessMsg("Two-Factor Authentication (2FA) enabled successfully!");
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to confirm 2FA code",
      );
    } finally {
      setSetupLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const res =
        await apiFetch<
          ApiResponse<{ sessions: Session[]; currentSessionToken: string }>
        >("/auth/sessions");
      if (res.success && res.data) {
        const now = Date.now();
        const enriched = res.data.sessions.map((s) => ({
          ...s,
          relativeActive: getRelativeTime(s.last_active, now),
        }));
        setSessions(enriched);
        setCurrentSessionToken(res.data.currentSessionToken);
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to load active sessions",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSessions();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleRevoke = async (id: number, sessionToken: string) => {
    if (sessionToken === currentSessionToken) {
      if (confirm("This will log you out of your current session. Continue?")) {
        await logout();
      }
      return;
    }

    if (
      !confirm(
        "Are you sure you want to terminate this session? The device will be logged out immediately.",
      )
    ) {
      return;
    }

    setActionLoading(id);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiFetch<ApiResponse<null>>(`/auth/sessions/${id}`, {
        method: "DELETE",
      });
      if (res.success) {
        setSuccessMsg("Session terminated successfully.");
        setSessions(sessions.filter((s) => s.id !== id));
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to terminate session",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeOther = async () => {
    if (
      !confirm(
        "Are you sure you want to log out of all other devices? This action cannot be undone.",
      )
    ) {
      return;
    }

    setBulkLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiFetch<ApiResponse<null>>(
        "/auth/sessions/logout-other",
        {
          method: "POST",
        },
      );
      if (res.success) {
        setSuccessMsg("Logged out of all other devices successfully.");
        setSessions(
          sessions.filter((s) => s.session_token === currentSessionToken),
        );
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to terminate other sessions",
      );
    } finally {
      setBulkLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 p-6 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 text-zinc-900">
            Account Settings
          </h1>
          <p className="text-zinc-500 text-sm">
            Manage your account security, active login sessions, and connected
            devices.
          </p>
        </div>

        {errorMsg && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex justify-between items-center animate-fadeIn">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg("")}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Cross1Icon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex justify-between items-center animate-fadeIn">
            <span>{successMsg}</span>
            <button
              onClick={() => setSuccessMsg("")}
              className="text-emerald-500 hover:text-emerald-700 transition-colors"
            >
              <Cross1Icon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="bg-white border border-zinc-200/80 shadow-xs rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-200 pb-6">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              Update Password
            </h2>
            <p className="text-zinc-500 text-xs mt-1">
              Ensure your account is using a strong, unique password to stay
              protected.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isPasswordValid) {
                setShowForceLogoutModal(true);
              }
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-sm"
                />
              </div>
            </div>

            {newPassword && (
              <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-3.5 animate-fadeIn">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-600">
                    Password Strength:
                  </span>
                  <span className="font-bold text-zinc-900">
                    {strength.text}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-full flex-1 transition-all duration-300 ${
                        strength.score >= level ? strength.color : "bg-zinc-200"
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        strength.req?.length ? "bg-emerald-500" : "bg-zinc-300"
                      }`}
                    />
                    <span
                      className={
                        strength.req?.length
                          ? "text-emerald-700 font-medium"
                          : "text-zinc-500"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        strength.req?.uppercase
                          ? "bg-emerald-500"
                          : "bg-zinc-300"
                      }`}
                    />
                    <span
                      className={
                        strength.req?.uppercase
                          ? "text-emerald-700 font-medium"
                          : "text-zinc-500"
                      }
                    >
                      At least one uppercase (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        strength.req?.lowercase
                          ? "bg-emerald-500"
                          : "bg-zinc-300"
                      }`}
                    />
                    <span
                      className={
                        strength.req?.lowercase
                          ? "text-emerald-700 font-medium"
                          : "text-zinc-500"
                      }
                    >
                      At least one lowercase (a-z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        strength.req?.number ? "bg-emerald-500" : "bg-zinc-300"
                      }`}
                    />
                    <span
                      className={
                        strength.req?.number
                          ? "text-emerald-700 font-medium"
                          : "text-zinc-500"
                      }
                    >
                      At least one number (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        strength.req?.special ? "bg-emerald-500" : "bg-zinc-300"
                      }`}
                    />
                    <span
                      className={
                        strength.req?.special
                          ? "text-emerald-700 font-medium"
                          : "text-zinc-500"
                      }
                    >
                      At least one special character
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        newPassword === confirmNewPassword && confirmNewPassword
                          ? "bg-emerald-500"
                          : "bg-zinc-300"
                      }`}
                    />
                    <span
                      className={
                        newPassword === confirmNewPassword && confirmNewPassword
                          ? "text-emerald-700 font-medium"
                          : "text-zinc-500"
                      }
                    >
                      Passwords match
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={pwdLoading || !isPasswordValid}
              className="px-4 py-2.5 bg-[#003c3a] hover:bg-[#002d2b] disabled:bg-zinc-300 disabled:opacity-80 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {pwdLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-zinc-200/80 shadow-xs rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                Two-Factor Authentication (2FA)
              </h2>
              <p className="text-zinc-500 text-xs mt-1">
                Add an extra layer of security to your account by requiring a
                verification code when signing in.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user?.two_factor_enabled ? (
                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                  Enabled
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-semibold bg-zinc-50 text-zinc-600 border border-zinc-200 rounded-lg">
                  Disabled
                </span>
              )}
            </div>
          </div>

          {!user?.two_factor_enabled ? (
            <div className="space-y-4">
              <p className="text-zinc-600 text-sm leading-relaxed">
                Protect your account with Time-based One-Time Passwords (TOTP).
                You can use any standard authenticator app like Google
                Authenticator, Microsoft Authenticator, or Authy to scan the QR
                code and receive verification codes.
              </p>
              {!showSetup2FA ? (
                <button
                  onClick={() => openReauth("setup")}
                  className="px-4 py-2.5 bg-[#003c3a] hover:bg-[#002d2b] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Enable 2FA
                </button>
              ) : (
                <div className="p-5 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-5 animate-fadeIn">
                  <h3 className="text-sm font-bold text-zinc-800">
                    Set up Authenticator App
                  </h3>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {qrCodeData && (
                      <div className="bg-white p-3 border border-zinc-200 rounded-xl shadow-xs shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrCodeData}
                          alt="Scan QR Code"
                          className="w-40 h-40"
                        />
                      </div>
                    )}
                    <div className="space-y-3 flex-1">
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        1. Scan the QR code with your authenticator app.
                      </p>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        2. If you cannot scan the QR code, manually enter this
                        text secret into your app:
                      </p>
                      <code className="block p-2.5 bg-white border border-zinc-200 rounded-lg font-mono text-xs text-zinc-800 break-all select-all">
                        {secretData}
                      </code>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSetupConfirm}
                    className="space-y-3 pt-3 border-t border-zinc-200"
                  >
                    <label className="block text-xs font-semibold text-zinc-700">
                      Confirm setup by entering the 6-digit code generated by
                      your app:
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        required
                        value={confirmOtp}
                        onChange={(e) =>
                          setConfirmOtp(e.target.value.replace(/\D/g, ""))
                        }
                        className="max-w-[150px] px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-sm text-center font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600"
                      />
                      <button
                        type="submit"
                        disabled={setupLoading}
                        className="px-4 py-2 bg-[#003c3a] hover:bg-[#002d2b] disabled:bg-zinc-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        {setupLoading ? "Verifying..." : "Verify & Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSetup2FA(false)}
                        className="px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-600 text-sm leading-relaxed">
                Two-Factor Authentication is currently protecting your account.
                You can view or regenerate backup recovery codes, or disable 2FA
                if you choose.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openReauth("view_codes")}
                  className="px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-all"
                >
                  View Recovery Codes
                </button>
                <button
                  onClick={() => openReauth("regen_codes")}
                  className="px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-all"
                >
                  Regenerate Recovery Codes
                </button>
                <button
                  onClick={() => openReauth("disable")}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100/70 border border-red-200 text-red-700 rounded-xl text-xs font-bold transition-all"
                >
                  Disable 2FA
                </button>
              </div>

              {showRecoveryCodes && recoveryCodes.length > 0 && (
                <div className="p-5 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-800">
                        Backup Recovery Codes
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Keep these codes in a safe place. Each code can only be
                        used once.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRecoveryCodes(false)}
                      className="text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                    >
                      <Cross1Icon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                    {recoveryCodes.map((code, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-zinc-200 rounded-lg p-2.5 text-center font-mono text-xs font-bold text-zinc-800 break-all shadow-2xs select-all"
                      >
                        {code}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(recoveryCodes.join("\n"));
                        alert("Recovery codes copied to clipboard!");
                      }}
                      className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-[11px] font-bold transition-all"
                    >
                      Copy All Codes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-zinc-200/80 shadow-xs rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                Active Device Sessions
              </h2>
              <p className="text-zinc-500 text-xs mt-1">
                You are currently signed in to these devices. Terminate any
                sessions you don&apos;t recognize.
              </p>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleRevokeOther}
                disabled={bulkLoading}
                className="self-start sm:self-center px-4 py-2 bg-[#003c3a] hover:bg-[#002d2b] text-white disabled:opacity-50 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {bulkLoading
                  ? "Logging out others..."
                  : "Logout All Other Devices"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400 space-y-3">
              <div className="w-6 h-6 border-2 border-zinc-200 border-t-[#003c3a] rounded-full animate-spin" />
              <span className="text-xs text-zinc-500">Loading sessions...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const isCurrent = session.session_token === currentSessionToken;
                const isMobile = session.device_type === "Mobile";
                const isTablet = session.device_type === "Tablet";

                return (
                  <div
                    key={session.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-[#f0f6f6] border-[#003c3a]/30 shadow-xs"
                        : "bg-zinc-50/50 border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isCurrent
                          ? "bg-[#003c3a]/10 text-[#003c3a] border-[#003c3a]/20"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200"
                      }`}
                    >
                      {isMobile ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      ) : isTablet ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-zinc-900 truncate">
                          {session.device_name || "Unknown Device"}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[9px] font-black bg-[#003c3a]/10 text-[#003c3a] border border-[#003c3a]/25 rounded-md animate-pulse">
                            Current Device
                          </span>
                        )}
                      </div>

                      <div className="text-zinc-600 text-[12px] space-y-0.5">
                        <p className="font-medium text-zinc-700">
                          {session.browser_name || "Unknown Browser"}{" "}
                          {session.browser_version || ""} on{" "}
                          {session.os || "Unknown OS"}
                        </p>
                        <p className="text-zinc-500 text-[11px]">
                          IP:{" "}
                          <span className="text-zinc-700 font-medium">
                            {session.ip_address || "Unknown"}
                          </span>{" "}
                          • Location:{" "}
                          <span className="text-zinc-700 font-medium">
                            {session.location || "Unknown Location"}
                          </span>
                        </p>
                        <p className="text-zinc-400 text-[10px] pt-1">
                          Logged in: {formatDate(session.created_at)} • Last
                          active: {session.relativeActive || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleRevoke(session.id, session.session_token)
                      }
                      disabled={actionLoading === session.id}
                      className={`p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-red-600 shrink-0 cursor-pointer ${
                        isCurrent ? "hover:bg-red-50 hover:text-red-600" : ""
                      }`}
                      title={
                        isCurrent ? "Logout this device" : "Terminate session"
                      }
                    >
                      {actionLoading === session.id ? (
                        <div className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
                      ) : isCurrent ? (
                        <ExitIcon className="w-4 h-4" />
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showReauthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close modal"
              className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-default w-full h-full border-none outline-hidden"
              onClick={() => setShowReauthModal(false)}
            />
            <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 sm:p-8 animate-fadeIn">
              <button
                onClick={() => setShowReauthModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all"
              >
                <Cross1Icon className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                Security Confirmation
              </h3>
              <p className="text-zinc-500 text-xs mb-6">
                To perform this sensitive action, please enter your password to
                confirm your identity.
              </p>

              {reauthError && (
                <p className="text-red-600 text-xs mb-4 bg-red-50 p-2.5 border border-red-200 rounded-lg">
                  {reauthError}
                </p>
              )}

              <form onSubmit={handleReauthSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your account password"
                    required
                    value={reauthPassword}
                    onChange={(e) => setReauthPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-sm"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReauthModal(false)}
                    className="px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reauthLoading}
                    className="px-4 py-2 bg-[#003c3a] hover:bg-[#002d2b] disabled:bg-zinc-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    {reauthLoading ? "Confirming..." : "Confirm Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showForceLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close modal"
              className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-default w-full h-full border-none outline-hidden"
              onClick={() => setShowForceLogoutModal(false)}
            />
            <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 sm:p-8 animate-fadeIn">
              <button
                onClick={() => setShowForceLogoutModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all"
              >
                <Cross1Icon className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                Sign out of other devices?
              </h3>
              <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
                Would you like to terminate all other active device sessions and
                sign in again using your new password? This secures your account
                if your previous password was compromised.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => handlePasswordChangeSubmit(false)}
                  className="px-4 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-all"
                >
                  No, Keep Other Sessions
                </button>
                <button
                  type="button"
                  onClick={() => handlePasswordChangeSubmit(true)}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Yes, Sign Out Everywhere
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
