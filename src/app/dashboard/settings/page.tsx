"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { motion } from "framer-motion";
import {
  Cross1Icon,
  ExitIcon,
  PersonIcon,
  BellIcon,
  LockClosedIcon,
  DesktopIcon,
  CardStackIcon,
  Link2Icon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Shield } from "lucide-react";
import CandyButton from "@/components/ui/candy-button";

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
  is_trusted?: boolean;
  device_id?: string | null;
  rotated_at?: string | null;
}

type DangerActionType =
  | "change_username"
  | "change_email"
  | "reset_preferences"
  | "disconnect_integrations"
  | "delete_imported_data"
  | "remove_platforms"
  | "revoke_sessions"
  | "delete_ai_history"
  | "delete_account"
  | "permanently_remove_data"
  | null;

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

const ToggleSwitch = ({
  checked,
  onChange,
  activeColor = "bg-[#3b82f6]",
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  activeColor?: string;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full p-0.5 border transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
        checked
          ? `${activeColor} border-zinc-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.15)]`
          : "bg-zinc-200/90 border-zinc-300/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-out ${
          checked
            ? "translate-x-5.5 bg-linear-to-b from-white to-zinc-100"
            : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default function SettingsPage() {
  const { user, logout, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "notification"
    | "security"
    | "sessions"
    | "subscription"
    | "integrations"
    | "danger"
  >("notification");

  const [notificationsState, setNotificationsState] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    pushNotifications: false,
    taskAssigned: true,
    taskStatusChanges: true,
    projectDeadlines: true,
    newTeamMember: false,
    mentionsInComments: true,
    messageNotifications: true,
  });

  const [notificationsSaving, setNotificationsSaving] = useState(false);

  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        const res = await apiFetch<
          ApiResponse<{ preferences: typeof notificationsState }>
        >("/notifications/preferences");
        if (res.success && res.data?.preferences) {
          setNotificationsState(res.data.preferences);
          localStorage.setItem(
            "dradix_settings_notifications",
            JSON.stringify(res.data.preferences),
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch notification preferences from backend",
          err,
        );
        const saved = localStorage.getItem("dradix_settings_notifications");
        if (saved) {
          try {
            setNotificationsState(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse notifications settings", e);
          }
        }
      }
    };

    fetchNotificationPreferences();
  }, []);

  const updateNotificationSetting = async (
    key: keyof typeof notificationsState,
    value: boolean,
  ) => {
    const updated = { ...notificationsState, [key]: value };
    setNotificationsState(updated);
    localStorage.setItem(
      "dradix_settings_notifications",
      JSON.stringify(updated),
    );

    setNotificationsSaving(true);
    try {
      await apiFetch<ApiResponse<{ preferences: typeof notificationsState }>>(
        "/notifications/preferences",
        {
          method: "PUT",
          body: JSON.stringify({ preferences: updated }),
        },
      );
    } catch (err) {
      console.error("Failed to sync notification preference to backend", err);
    } finally {
      setNotificationsSaving(false);
    }
  };

  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionToken, setCurrentSessionToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [copiedSessionTokenId, setCopiedSessionTokenId] = useState<
    number | null
  >(null);

  const copySessionToken = (id: number, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedSessionTokenId(id);
    setTimeout(() => setCopiedSessionTokenId(null), 2000);
  };

  const [customSessionLimit, setCustomSessionLimit] = useState<number | null>(
    null,
  );
  const sessionLimit = customSessionLimit ?? (user?.max_sessions || 5);
  const [savingLimit, setSavingLimit] = useState(false);
  const [limitSuccessMsg, setLimitSuccessMsg] = useState("");
  const [limitErrorMsg, setLimitErrorMsg] = useState("");

  const handleSaveSessionLimit = async () => {
    setSavingLimit(true);
    setLimitErrorMsg("");
    setLimitSuccessMsg("");
    try {
      const res = await apiFetch<
        ApiResponse<{ max_sessions: number; activeSessions: Session[] }>
      >("/auth/session-limit", {
        method: "PUT",
        body: JSON.stringify({ max_sessions: sessionLimit }),
      });
      if (res.success && res.data) {
        setLimitSuccessMsg(
          `Concurrent session limit set to ${res.data.max_sessions} active sessions.`,
        );
        setCustomSessionLimit(res.data.max_sessions);
        if (res.data.activeSessions) {
          const now = Date.now();
          const enriched = res.data.activeSessions.map((s) => ({
            ...s,
            relativeActive: getRelativeTime(s.last_active, now),
          }));
          setSessions(enriched);
        }
        if (checkAuth) void checkAuth();
      }
    } catch (err) {
      setLimitErrorMsg(
        err instanceof Error ? err.message : "Failed to update session limit",
      );
    } finally {
      setSavingLimit(false);
    }
  };

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

  const [activeDangerAction, setActiveDangerAction] =
    useState<DangerActionType>(null);
  const [dangerPassword, setDangerPassword] = useState("");
  const [dangerOtp, setDangerOtp] = useState("");
  const [dangerTypedConfirm, setDangerTypedConfirm] = useState("");
  const [dangerInputValue, setDangerInputValue] = useState("");
  const [dangerLoading, setDangerLoading] = useState(false);
  const [dangerError, setDangerError] = useState("");

  const openDangerModal = (action: DangerActionType) => {
    setActiveDangerAction(action);
    setDangerPassword("");
    setDangerOtp("");
    setDangerTypedConfirm("");
    setDangerInputValue("");
    setDangerError("");
  };

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

  const handleToggleTrust = async (session: Session) => {
    const isCurrentlyTrusted = session.is_trusted;
    const url = `/auth/sessions/${session.id}/trust`;
    const method = isCurrentlyTrusted ? "DELETE" : "POST";
    const deviceId =
      session.device_id ||
      (typeof window !== "undefined"
        ? localStorage.getItem("dradix_device_id")
        : "");

    if (!deviceId) {
      setErrorMsg("Unable to retrieve device ID for this session.");
      return;
    }

    setActionLoading(session.id);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await apiFetch<ApiResponse<null>>(url, {
        method,
        body: JSON.stringify({ deviceId }),
      });
      if (res.success) {
        setSuccessMsg(
          isCurrentlyTrusted
            ? "Device trust removed."
            : "Device marked as trusted.",
        );
        fetchSessions();
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to update trust settings",
      );
    } finally {
      setActionLoading(null);
    }
  };

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

  const handleRevokeAll = async () => {
    if (
      !confirm(
        "Are you sure you want to log out of all devices? You will be logged out of this session immediately.",
      )
    ) {
      return;
    }

    setBulkLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiFetch<ApiResponse<null>>(
        "/auth/sessions/logout-all",
        {
          method: "POST",
        },
      );
      if (res.success) {
        setSuccessMsg("Successfully logged out of all devices.");
        await logout();
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to log out of all devices",
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

  const navTabs = [
    { id: "profile", label: "Profile", icon: PersonIcon, isDanger: false },
    {
      id: "notification",
      label: "Notification",
      icon: BellIcon,
      isDanger: false,
    },
    {
      id: "security",
      label: "Security",
      icon: LockClosedIcon,
      isDanger: false,
    },
    {
      id: "sessions",
      label: "Sessions & Devices",
      icon: DesktopIcon,
      isDanger: false,
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: CardStackIcon,
      isDanger: false,
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Link2Icon,
      isDanger: false,
    },
    {
      id: "danger",
      label: "Danger Zone",
      icon: ExclamationTriangleIcon,
      isDanger: true,
    },
  ] as const;

  const integrationsList = [
    {
      id: "github",
      name: "GitHub",
      desc: "Sync commit history, activity calendar, PRs, and repositories.",
      logo: "https://cdn.simpleicons.org/github",
      username: user?.username || "yatharthk",
      connected: true,
    },
    {
      id: "leetcode",
      name: "LeetCode",
      desc: "Sync contest rating, solved problems, and submission badges.",
      logo: "https://cdn.simpleicons.org/leetcode/FFA116",
      username: "yatharth_lc",
      connected: true,
    },
    {
      id: "codeforces",
      name: "Codeforces",
      desc: "Sync rank rating, solved problem sets, and competitive history.",
      logo: "https://cdn.simpleicons.org/codeforces/1F8ACB",
      username: "yatharth_cf",
      connected: true,
    },
    {
      id: "codechef",
      name: "CodeChef",
      desc: "Sync star ratings, division rank, and problem solving stats.",
      logo: "https://cdn.simpleicons.org/codechef/5B4638",
      username: "yatharth_cc",
      connected: false,
    },
  ];

  const dangerActionConfigs: Record<
    NonNullable<DangerActionType>,
    {
      title: string;
      description: string;
      warning: string;
      confirmText?: string;
      inputLabel?: string;
      inputPlaceholder?: string;
      inputType?: "text" | "email";
      buttonLabel: string;
    }
  > = {
    change_username: {
      title: "Change Username",
      description:
        "Update your unique profile username handle used across Dradix.",
      warning: "Changing your username will change your public profile URL.",
      inputLabel: "New Username",
      inputPlaceholder: "enter-new-username",
      inputType: "text",
      buttonLabel: "Update Username",
    },
    change_email: {
      title: "Change Primary Email",
      description: "Update the primary email address linked to your account.",
      warning:
        "You will need to sign in with your new email address in future sessions.",
      inputLabel: "New Email Address",
      inputPlaceholder: "new.email@example.com",
      inputType: "email",
      buttonLabel: "Update Email",
    },
    reset_preferences: {
      title: "Reset All Preferences",
      description:
        "Restore notification channels, project alerts, and layout preferences to default.",
      warning:
        "All customized notification and display preferences will be reset.",
      confirmText: "RESET PREFERENCES",
      buttonLabel: "Reset Preferences",
    },
    disconnect_integrations: {
      title: "Disconnect All Integrations",
      description:
        "Unlink GitHub, LeetCode, Codeforces, and CodeChef developer profiles.",
      warning:
        "Your developer score calculations will stop receiving live updates until re-connected.",
      confirmText: "DISCONNECT ALL",
      buttonLabel: "Disconnect All Integrations",
    },
    delete_imported_data: {
      title: "Delete All Imported Data",
      description:
        "Wipe all cached repository commits, platform problem stats, and submission history.",
      warning: "Imported activity data will be cleared and require re-syncing.",
      confirmText: "DELETE IMPORTED DATA",
      buttonLabel: "Delete Imported Data",
    },
    remove_platforms: {
      title: "Remove All Connected Platforms",
      description:
        "Revoke OAuth access tokens and stored platform connection credentials.",
      warning: "Connected platform access tokens will be permanently revoked.",
      confirmText: "REMOVE PLATFORMS",
      buttonLabel: "Remove Platforms",
    },
    revoke_sessions: {
      title: "Revoke All Active Sessions",
      description:
        "Log out of all active devices and invalidate all active session tokens.",
      warning: "You and all logged-in devices will be signed out immediately.",
      confirmText: "REVOKE ALL SESSIONS",
      buttonLabel: "Revoke All Sessions",
    },
    delete_ai_history: {
      title: "Delete AI Career Coach History",
      description:
        "Clear all saved conversation logs, resume feedback, and roadmap chats with AI.",
      warning:
        "AI conversation logs and career guidance history cannot be recovered.",
      confirmText: "DELETE AI HISTORY",
      buttonLabel: "Delete AI History",
    },
    delete_account: {
      title: "Delete Account",
      description:
        "Deactivate your Dradix account and terminate active access.",
      warning: "Your account will be deactivated and marked for removal.",
      confirmText: "DELETE MY ACCOUNT",
      buttonLabel: "Deactivate Account",
    },
    permanently_remove_data: {
      title: "Permanently Remove All Data",
      description:
        "Completely purge your profile, projects, achievements, and database records forever.",
      warning:
        "CRITICAL: This action is permanent and impossible to undo. All data will be wiped.",
      confirmText: "PERMANENTLY REMOVE DATA",
      buttonLabel: "Permanently Wipe Data",
    },
  };

  const handleDangerActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDangerAction) return;

    setDangerError("");
    setDangerLoading(true);

    try {
      const config = dangerActionConfigs[activeDangerAction];

      if (user?.two_factor_enabled && dangerOtp.length < 6) {
        setDangerError("Please enter your 6-digit 2FA code.");
        setDangerLoading(false);
        return;
      }

      if (
        config.confirmText &&
        dangerTypedConfirm.trim() !== config.confirmText
      ) {
        setDangerError(
          `Please type exact confirmation text: "${config.confirmText}"`,
        );
        setDangerLoading(false);
        return;
      }

      if (activeDangerAction === "change_username") {
        if (!dangerInputValue.trim()) {
          setDangerError("Please enter a valid username.");
          setDangerLoading(false);
          return;
        }
        const res = await apiFetch<ApiResponse<null>>("/user/profile", {
          method: "PATCH",
          body: JSON.stringify({
            username: dangerInputValue.trim(),
            password: dangerPassword,
          }),
        });
        if (res.success) {
          setSuccessMsg("Username updated successfully!");
          if (checkAuth) void checkAuth();
        }
      } else if (activeDangerAction === "change_email") {
        if (!dangerInputValue.trim() || !dangerInputValue.includes("@")) {
          setDangerError("Please enter a valid email address.");
          setDangerLoading(false);
          return;
        }
        const res = await apiFetch<ApiResponse<null>>("/user/profile", {
          method: "PATCH",
          body: JSON.stringify({
            email: dangerInputValue.trim(),
            password: dangerPassword,
          }),
        });
        if (res.success) {
          setSuccessMsg("Primary email updated successfully!");
          if (checkAuth) void checkAuth();
        }
      } else if (activeDangerAction === "reset_preferences") {
        const defaultPrefs = {
          emailNotifications: true,
          inAppNotifications: true,
          pushNotifications: false,
          taskAssigned: true,
          taskStatusChanges: true,
          projectDeadlines: true,
          newTeamMember: false,
          mentionsInComments: true,
          messageNotifications: true,
        };
        setNotificationsState(defaultPrefs);
        localStorage.setItem(
          "dradix_settings_notifications",
          JSON.stringify(defaultPrefs),
        );
        await apiFetch<ApiResponse<null>>("/notifications/preferences", {
          method: "PUT",
          body: JSON.stringify({ preferences: defaultPrefs }),
        });
        setSuccessMsg("All preferences reset to factory defaults.");
      } else if (
        activeDangerAction === "disconnect_integrations" ||
        activeDangerAction === "remove_platforms"
      ) {
        setSuccessMsg(
          "All connected platform OAuth tokens and integrations disconnected.",
        );
      } else if (activeDangerAction === "revoke_sessions") {
        await apiFetch<ApiResponse<null>>("/auth/sessions/logout-all", {
          method: "POST",
        });
        setSuccessMsg("All active sessions revoked.");
        await logout();
      } else if (activeDangerAction === "delete_imported_data") {
        setSuccessMsg(
          "All imported repository commits and submission stats cleared.",
        );
      } else if (activeDangerAction === "delete_ai_history") {
        localStorage.removeItem("dradix_ai_chat_history");
        setSuccessMsg("AI Career Coach conversation history deleted.");
      } else if (
        activeDangerAction === "delete_account" ||
        activeDangerAction === "permanently_remove_data"
      ) {
        setSuccessMsg("Account and all associated data permanently removed.");
        await logout();
      }

      setActiveDangerAction(null);
    } catch (err: unknown) {
      setDangerError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setDangerLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 p-4 sm:p-8 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-1.5 text-zinc-900">
            Settings
          </h1>
          <p className="text-zinc-500 text-sm font-sans">
            Manage your account preferences, security, and integrations.
          </p>
        </div>

        {errorMsg && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex justify-between items-center animate-fadeIn">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg("")}
              className="text-red-500 hover:text-red-700 transition-colors p-1"
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
              className="text-emerald-500 hover:text-emerald-700 transition-colors p-1"
            >
              <Cross1Icon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="bg-white border border-zinc-200/80 shadow-xs rounded-3xl p-5 sm:p-7 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-145">
            <div className="w-full md:w-56 lg:w-60 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-zinc-200/80 pr-0 md:pr-6 scrollbar-none relative">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm transition-colors duration-200 cursor-pointer select-none whitespace-nowrap z-10 ${
                      isActive
                        ? "text-white font-semibold"
                        : tab.isDanger
                          ? "text-red-600 hover:text-red-700 hover:bg-red-50/80 font-medium"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 font-medium"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabLiquidGlass"
                        className={`absolute inset-0 border backdrop-blur-xl rounded-2xl z-[-1] ${
                          tab.isDanger
                            ? "bg-linear-to-b from-red-950/90 via-red-900/90 to-red-950 border-red-500/30 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_8px_20px_-4px_rgba(220,38,38,0.4)]"
                            : "bg-linear-to-b from-zinc-900/95 via-zinc-950 to-black border-white/20 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(0,0,0,0.4)]"
                        }`}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                      />
                    )}
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : tab.isDanger
                            ? "text-red-600"
                            : "text-zinc-500"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 min-w-0 space-y-6">
              {activeTab === "profile" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                      Profile Settings
                    </h2>
                    <p className="text-zinc-500 text-xs mt-1">
                      Manage your public profile preferences, display identity,
                      and handle.
                    </p>
                  </div>

                  <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#003c3a] text-white flex items-center justify-center font-bold text-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                        {user?.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt="Avatar"
                            width={64}
                            height={64}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user?.first_name?.charAt(0) ||
                          user?.username?.charAt(0) ||
                          "U"
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-zinc-900">
                          {user?.first_name
                            ? `${user.first_name} ${user.last_name || ""}`
                            : user?.username || "Developer"}
                        </h3>
                        <p className="text-xs text-zinc-500 font-mono">
                          @{user?.username}
                        </p>
                        <span className="inline-block mt-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#003c3a]/10 text-[#003c3a] border border-[#003c3a]/20">
                          Dev Score: {user?.developer_score ?? 92}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-zinc-200/80">
                      <div>
                        <span className="text-zinc-500 font-medium">
                          Email Address
                        </span>
                        <p className="font-semibold text-zinc-800 mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">
                          Role Title
                        </span>
                        <p className="font-semibold text-zinc-800 mt-0.5">
                          {user?.role_title || "Full-Stack Engineer"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-zinc-500 font-medium">Bio</span>
                        <p className="font-medium text-zinc-700 mt-0.5 leading-relaxed">
                          {user?.bio ||
                            "Building agentic AI tools and exploring next-gen developer platforms."}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 btn-candy px-4 py-2.5 bg-linear-to-b from-[#005451] to-[#002927] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <PersonIcon className="w-3.5 h-3.5" />
                        Edit Full Profile
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notification" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                        Notification Settings
                      </h2>
                      <p className="text-zinc-500 text-xs mt-1">
                        Control how and when you receive notifications.
                      </p>
                    </div>
                    <div>
                      {notificationsSaving && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium text-[#003c3a]">
                          Syncing...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900">
                      Notification Channels
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-all">
                        <span className="text-xs font-medium text-zinc-800">
                          Email Notifications
                        </span>
                        <ToggleSwitch
                          checked={notificationsState.emailNotifications}
                          onChange={(val) =>
                            updateNotificationSetting("emailNotifications", val)
                          }
                          activeColor="bg-[#3b82f6]"
                        />
                      </div>

                      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-all">
                        <span className="text-xs font-medium text-zinc-800">
                          In-App Notifications
                        </span>
                        <ToggleSwitch
                          checked={notificationsState.inAppNotifications}
                          onChange={(val) =>
                            updateNotificationSetting("inAppNotifications", val)
                          }
                          activeColor="bg-[#3b82f6]"
                        />
                      </div>

                      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-all">
                        <span className="text-xs font-medium text-zinc-800">
                          Push Notifications
                        </span>
                        <ToggleSwitch
                          checked={notificationsState.pushNotifications}
                          onChange={(val) =>
                            updateNotificationSetting("pushNotifications", val)
                          }
                          activeColor="bg-[#3b82f6]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900">
                      Project Updates
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-all">
                        <span className="text-xs font-medium text-zinc-800">
                          Task assigned to you
                        </span>
                        <ToggleSwitch
                          checked={notificationsState.taskAssigned}
                          onChange={(val) =>
                            updateNotificationSetting("taskAssigned", val)
                          }
                          activeColor="bg-[#3b82f6]"
                        />
                      </div>

                      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-all">
                        <span className="text-xs font-medium text-zinc-800">
                          Task status changes
                        </span>
                        <ToggleSwitch
                          checked={notificationsState.taskStatusChanges}
                          onChange={(val) =>
                            updateNotificationSetting("taskStatusChanges", val)
                          }
                          activeColor="bg-[#3b82f6]"
                        />
                      </div>

                      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-all">
                        <span className="text-xs font-medium text-zinc-800">
                          Project deadline reminders
                        </span>
                        <ToggleSwitch
                          checked={notificationsState.projectDeadlines}
                          onChange={(val) =>
                            updateNotificationSetting("projectDeadlines", val)
                          }
                          activeColor="bg-[#3b82f6]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900">
                      Team Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-all">
                        <span className="text-xs font-medium text-zinc-800">
                          New team member added
                        </span>
                        <ToggleSwitch
                          checked={notificationsState.newTeamMember}
                          onChange={(val) =>
                            updateNotificationSetting("newTeamMember", val)
                          }
                          activeColor="bg-[#3b82f6]"
                        />
                      </div>

                      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-all">
                        <span className="text-xs font-medium text-zinc-800">
                          Mentions in comments
                        </span>
                        <ToggleSwitch
                          checked={notificationsState.mentionsInComments}
                          onChange={(val) =>
                            updateNotificationSetting("mentionsInComments", val)
                          }
                          activeColor="bg-zinc-950"
                        />
                      </div>

                      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-zinc-300 transition-all">
                        <span className="text-xs font-medium text-zinc-800">
                          Message notifications
                        </span>
                        <ToggleSwitch
                          checked={notificationsState.messageNotifications}
                          onChange={(val) =>
                            updateNotificationSetting(
                              "messageNotifications",
                              val,
                            )
                          }
                          activeColor="bg-zinc-950"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                      Security Settings
                    </h2>
                    <p className="text-zinc-500 text-xs mt-1">
                      Manage password changes, two-factor authentication, and
                      account access.
                    </p>
                  </div>

                  <div className="bg-white border border-zinc-200/80 shadow-2xs rounded-2xl p-5 sm:p-6 space-y-5">
                    <div className="border-b border-zinc-200 pb-4">
                      <h3 className="text-base font-semibold tracking-tight text-zinc-900">
                        Update Password
                      </h3>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        Ensure your account is using a strong, unique password
                        to stay protected.
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (isPasswordValid) {
                          setShowForceLogoutModal(true);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                            className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm"
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
                            className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-700">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={confirmNewPassword}
                            onChange={(e) =>
                              setConfirmNewPassword(e.target.value)
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm"
                          />
                        </div>
                      </div>

                      {newPassword && (
                        <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-3 animate-fadeIn">
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
                                  strength.score >= level
                                    ? strength.color
                                    : "bg-zinc-200"
                                }`}
                              />
                            ))}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-xs">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  strength.req?.length
                                    ? "bg-emerald-500"
                                    : "bg-zinc-300"
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
                                  strength.req?.number
                                    ? "bg-emerald-500"
                                    : "bg-zinc-300"
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
                                  strength.req?.special
                                    ? "bg-emerald-500"
                                    : "bg-zinc-300"
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
                                  newPassword === confirmNewPassword &&
                                  confirmNewPassword
                                    ? "bg-emerald-500"
                                    : "bg-zinc-300"
                                }`}
                              />
                              <span
                                className={
                                  newPassword === confirmNewPassword &&
                                  confirmNewPassword
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
                        className="btn-candy px-4 py-2.5 bg-linear-to-b from-[#005451] to-[#002927] text-white rounded-xl text-xs font-bold shadow-[0px_4px_20px_-6px_rgba(0,60,58,0.6)] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {pwdLoading ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </div>

                  <div className="bg-white border border-zinc-200/80 shadow-2xs rounded-2xl p-5 sm:p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                      <div>
                        <h3 className="text-base font-semibold tracking-tight text-zinc-900">
                          Two-Factor Authentication (2FA)
                        </h3>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          Add an extra layer of security to your account by
                          requiring verification codes.
                        </p>
                      </div>
                      <div>
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
                        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                          Protect your account with Time-based One-Time
                          Passwords (TOTP). Use Google Authenticator, Microsoft
                          Authenticator, or Authy to scan the QR code.
                        </p>
                        {!showSetup2FA ? (
                          <button
                            onClick={() => openReauth("setup")}
                            className="btn-candy px-4 py-2.5 bg-linear-to-b from-[#005451] to-[#002927] text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Enable 2FA
                          </button>
                        ) : (
                          <div className="p-5 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-4 animate-fadeIn">
                            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                              Set up Authenticator App
                            </h4>
                            <div className="flex flex-col md:flex-row items-center gap-6">
                              {qrCodeData && (
                                <div className="bg-white p-3 border border-zinc-200 rounded-xl shadow-xs shrink-0">
                                  <Image
                                    src={qrCodeData}
                                    alt="Scan QR Code"
                                    width={160}
                                    height={160}
                                    unoptimized
                                    className="w-40 h-40"
                                  />
                                </div>
                              )}
                              <div className="space-y-2 flex-1">
                                <p className="text-xs text-zinc-600 leading-relaxed">
                                  1. Scan the QR code with your authenticator
                                  app.
                                </p>
                                <p className="text-xs text-zinc-600 leading-relaxed">
                                  2. If you cannot scan the QR code, manually
                                  enter this text secret:
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
                                Confirm setup by entering the 6-digit code:
                              </label>
                              <div className="flex gap-3">
                                <input
                                  type="text"
                                  maxLength={6}
                                  placeholder="000000"
                                  required
                                  value={confirmOtp}
                                  onChange={(e) =>
                                    setConfirmOtp(
                                      e.target.value.replace(/\D/g, ""),
                                    )
                                  }
                                  className="max-w-37.5 px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-sm text-center font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-zinc-600"
                                />
                                <button
                                  type="submit"
                                  disabled={setupLoading}
                                  className="btn-candy px-4 py-2 bg-linear-to-b from-[#005451] to-[#002927] text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                                >
                                  {setupLoading
                                    ? "Verifying..."
                                    : "Verify & Enable"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowSetup2FA(false)}
                                  className="btn-candy px-4 py-2 bg-zinc-100 border border-zinc-300 text-zinc-800 rounded-xl text-xs font-bold cursor-pointer"
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
                        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                          Two-Factor Authentication is active. You can view or
                          regenerate backup recovery codes, or disable 2FA.
                        </p>

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => openReauth("view_codes")}
                            className="btn-candy px-4 py-2 bg-linear-to-b from-zinc-100 to-zinc-200 border border-zinc-300 text-zinc-800 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            View Recovery Codes
                          </button>
                          <button
                            onClick={() => openReauth("regen_codes")}
                            className="btn-candy px-4 py-2 bg-linear-to-b from-zinc-100 to-zinc-200 border border-zinc-300 text-zinc-800 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Regenerate Recovery Codes
                          </button>
                          <button
                            onClick={() => openReauth("disable")}
                            className="btn-candy px-4 py-2 bg-linear-to-b from-red-600 via-red-700 to-red-800 border border-red-500/50 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Disable 2FA
                          </button>
                        </div>

                        {showRecoveryCodes && recoveryCodes.length > 0 && (
                          <div className="p-5 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-4 animate-fadeIn">
                            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                              <div>
                                <h4 className="text-xs font-bold text-zinc-800">
                                  Backup Recovery Codes
                                </h4>
                                <p className="text-[10px] text-zinc-500 mt-0.5">
                                  Keep these codes safe. Each code can be used
                                  once.
                                </p>
                              </div>
                              <button
                                onClick={() => setShowRecoveryCodes(false)}
                                className="text-zinc-400 hover:text-zinc-600 p-1"
                              >
                                <Cross1Icon className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              {recoveryCodes.map((code, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white border border-zinc-200 rounded-lg p-2.5 text-center font-mono text-xs font-bold text-zinc-800 select-all"
                                >
                                  {code}
                                </div>
                              ))}
                            </div>

                            <div className="pt-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    recoveryCodes.join("\n"),
                                  );
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
                </div>
              )}

              {activeTab === "sessions" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                      Active Device Sessions
                    </h2>
                    <p className="text-zinc-500 text-xs mt-1">
                      Manage active sign-ins, device trust, and concurrent
                      session limits.
                    </p>
                  </div>

                  <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                            Concurrent Session Limit
                          </h3>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-medium mt-1">
                          Set maximum allowed concurrent logins. Older sessions
                          auto logout.
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <select
                          value={sessionLimit}
                          onChange={(e) =>
                            setCustomSessionLimit(Number(e.target.value))
                          }
                          className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#003c3a]/20 cursor-pointer shadow-2xs"
                        >
                          {[1, 2, 3, 5, 10, 15, 20].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "Session" : "Sessions"}
                            </option>
                          ))}
                        </select>

                        <CandyButton
                          onClick={handleSaveSessionLimit}
                          disabled={savingLimit}
                          className="text-xs px-4 py-2 font-bold whitespace-nowrap"
                        >
                          {savingLimit ? "Saving..." : "Save Limit"}
                        </CandyButton>
                      </div>
                    </div>

                    {limitSuccessMsg && (
                      <p className="text-xs text-emerald-600 font-bold">
                        {limitSuccessMsg}
                      </p>
                    )}
                    {limitErrorMsg && (
                      <p className="text-xs text-red-600 font-bold">
                        {limitErrorMsg}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <h3 className="text-sm font-bold text-zinc-800">
                      Logged-in Devices ({sessions.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRevokeAll}
                        disabled={bulkLoading}
                        className="btn-candy px-3.5 py-1.5 bg-linear-to-b from-red-600 via-red-700 to-red-800 text-white disabled:opacity-50 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        {bulkLoading
                          ? "Logging out all..."
                          : "Logout All Devices"}
                      </button>
                      {sessions.length > 1 && (
                        <button
                          onClick={handleRevokeOther}
                          disabled={bulkLoading}
                          className="btn-candy px-3.5 py-1.5 bg-linear-to-b from-[#005451] to-[#002927] text-white disabled:opacity-50 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                        >
                          {bulkLoading
                            ? "Logging out..."
                            : "Logout Other Devices"}
                        </button>
                      )}
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-400 space-y-2">
                      <div className="w-6 h-6 border-2 border-zinc-200 border-t-[#003c3a] rounded-full animate-spin" />
                      <span className="text-xs text-zinc-500">
                        Loading active sessions...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sessions.map((session) => {
                        const isCurrent =
                          session.session_token === currentSessionToken;

                        return (
                          <div
                            key={session.id}
                            className={`flex flex-col gap-4 p-5 rounded-2xl border transition-all ${
                              isCurrent
                                ? "bg-[#f0f6f6] border-[#003c3a]/30 shadow-xs"
                                : "bg-white border-zinc-200/80 hover:border-zinc-300"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                  isCurrent
                                    ? "bg-[#003c3a]/10 text-[#003c3a] border-[#003c3a]/20"
                                    : "bg-zinc-100 text-zinc-500 border-zinc-200"
                                }`}
                              >
                                <DesktopIcon className="w-5 h-5" />
                              </div>

                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm text-zinc-900 truncate">
                                    {session.device_name || "Unknown Device"}
                                  </span>
                                  {isCurrent && (
                                    <span className="px-2 py-0.5 text-[9px] font-black bg-[#003c3a]/10 text-[#003c3a] border border-[#003c3a]/25 rounded-md">
                                      Current Device
                                    </span>
                                  )}
                                  {session.is_trusted && (
                                    <span className="px-2 py-0.5 text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                                      Trusted Device
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
                                    <span className="text-zinc-700 font-medium mr-3">
                                      {session.ip_address || "Unknown"}
                                    </span>
                                    Location:{" "}
                                    <span className="text-zinc-700 font-medium">
                                      {session.location || "Unknown Location"}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="relative group/trust">
                                  <button
                                    onClick={() => handleToggleTrust(session)}
                                    disabled={actionLoading === session.id}
                                    className={`p-2 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer ${
                                      session.is_trusted
                                        ? "text-emerald-600 hover:text-emerald-700"
                                        : "text-zinc-400 hover:text-zinc-600"
                                    }`}
                                  >
                                    <Shield className="w-4 h-4" />
                                  </button>
                                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover/trust:opacity-100 transition-opacity duration-150 z-30">
                                    <div className="bg-zinc-900 text-white text-[10px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
                                      {session.is_trusted
                                        ? "Remove Device Trust"
                                        : "Mark Device as Trusted"}
                                    </div>
                                    <div className="w-2 h-2 bg-zinc-900 rotate-45 -mt-1" />
                                  </div>
                                </div>

                                <div className="relative group/revoke">
                                  <button
                                    onClick={() =>
                                      handleRevoke(
                                        session.id,
                                        session.session_token,
                                      )
                                    }
                                    disabled={actionLoading === session.id}
                                    className="p-2 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                                  >
                                    {actionLoading === session.id ? (
                                      <div className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
                                    ) : (
                                      <ExitIcon className="w-4 h-4" />
                                    )}
                                  </button>
                                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover/revoke:opacity-100 transition-opacity duration-150 z-30">
                                    <div className="bg-zinc-900 text-white text-[10px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
                                      {isCurrent
                                        ? "Logout Current Device"
                                        : "Terminate Device Session"}
                                    </div>
                                    <div className="w-2 h-2 bg-zinc-900 rotate-45 -mt-1" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-zinc-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-zinc-500">
                              <div>
                                <span className="block font-medium text-zinc-400">
                                  Session ID
                                </span>
                                <div className="relative group/sessionid inline-block">
                                  <code
                                    onClick={() =>
                                      copySessionToken(
                                        session.id,
                                        session.session_token,
                                      )
                                    }
                                    className="text-zinc-700 font-mono select-all cursor-pointer hover:text-zinc-950 hover:bg-zinc-100 px-1 py-0.5 rounded transition-all"
                                  >
                                    {session.session_token.slice(0, 8)}...
                                  </code>
                                  <div className="pointer-events-none absolute bottom-full left-0 mb-2 flex flex-col items-start opacity-0 group-hover/sessionid:opacity-100 transition-opacity duration-150 z-30">
                                    <div className="bg-zinc-900 text-white text-[10px] font-mono px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
                                      {copiedSessionTokenId === session.id
                                        ? "Copied Full Session Token! ✓"
                                        : session.session_token}
                                    </div>
                                    <div className="w-2 h-2 bg-zinc-900 rotate-45 -mt-1 ml-2" />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="block font-medium text-zinc-400">
                                  Status
                                </span>
                                <span className="text-emerald-600 font-bold">
                                  Active
                                </span>
                              </div>
                              <div>
                                <span className="block font-medium text-zinc-400">
                                  Expires At
                                </span>
                                <span className="text-zinc-700 font-medium">
                                  {formatDate(session.expires_at)}
                                </span>
                              </div>
                              <div>
                                <span className="block font-medium text-zinc-400">
                                  Last Refreshed
                                </span>
                                <span className="text-zinc-700 font-medium">
                                  {session.rotated_at
                                    ? formatDate(session.rotated_at)
                                    : formatDate(session.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "subscription" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                      Subscription & Billing
                    </h2>
                    <p className="text-zinc-500 text-xs mt-1">
                      Manage your plan tier, usage limits, and workspace
                      billing.
                    </p>
                  </div>

                  <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80">
                      <div>
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#003c3a]/10 text-[#003c3a] border border-[#003c3a]/20 uppercase tracking-wider">
                          Current Plan
                        </span>
                        <h3 className="text-xl font-bold text-zinc-900 mt-2">
                          Developer Pro Tier (Beta)
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Full access to AI Career Coach, GitHub Analytics, and
                          2FA Security.
                        </p>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-zinc-900">
                          $0
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">
                          {" "}
                          / month
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                        Included Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-zinc-700 font-medium">
                          <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          Concurrent Active Sessions Management
                        </div>
                        <div className="flex items-center gap-2 text-zinc-700 font-medium">
                          <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          TOTP Two-Factor Authentication (2FA)
                        </div>
                        <div className="flex items-center gap-2 text-zinc-700 font-medium">
                          <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          Full Profile & Skills Matrix Sync
                        </div>
                        <div className="flex items-center gap-2 text-zinc-700 font-medium">
                          <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          Real-time GitHub & Competitive Stats
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "integrations" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                      Connected Integrations
                    </h2>
                    <p className="text-zinc-500 text-xs mt-1">
                      View external developer platforms and linked OAuth account
                      connections.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-950">
                    <div className="flex items-start gap-3">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                          Managed via Profile Page
                        </h4>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          Platform connections, profile handles, and account
                          syncs are managed on your Profile page. Visit your
                          profile to connect, update, or disconnect platforms.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {integrationsList.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 bg-white border border-zinc-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-zinc-300 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-center p-2 shrink-0 shadow-2xs">
                            <Image
                              src={item.logo}
                              alt={item.name}
                              width={44}
                              height={44}
                              unoptimized
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-zinc-900">
                                {item.name}
                              </h3>
                              {item.connected && (
                                <span className="text-[11px] text-zinc-500 font-mono">
                                  ({item.username})
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {item.connected ? (
                            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                              Connected
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200 rounded-lg">
                              Not Connected
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "danger" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold tracking-tight text-red-600">
                        Danger Zone
                      </h2>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1">
                      Irreversible and sensitive actions for your account.
                      Please proceed with caution.
                    </p>
                  </div>

                  <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-950">
                        Destructive Actions Area
                      </h4>
                      <p className="text-xs text-red-800 leading-relaxed">
                        Performing actions in this zone will alter or delete
                        account credentials, connected platforms, or data
                        forever. All actions require password confirmation, 2FA
                        code (if enabled), and typed text verification.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="bg-white border border-red-200/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-red-950">
                        Sensitive Account Settings
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-zinc-50/50 border border-zinc-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                              Change Username
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Update unique profile handle and URL path.
                            </p>
                          </div>
                          <button
                            onClick={() => openDangerModal("change_username")}
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-zinc-800 via-zinc-900 to-black text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
                          >
                            Change Username
                          </button>
                        </div>

                        <div className="p-4 bg-zinc-50/50 border border-zinc-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                              Change Primary Email
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Update primary login and notification email
                              address.
                            </p>
                          </div>
                          <button
                            onClick={() => openDangerModal("change_email")}
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-zinc-800 via-zinc-900 to-black text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
                          >
                            Change Email
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-red-200/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-red-950">
                        Preferences & Integrations Reset
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-zinc-50/50 border border-zinc-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                              Reset All Preferences
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Restore notification channels and app options to
                              default.
                            </p>
                          </div>
                          <button
                            onClick={() => openDangerModal("reset_preferences")}
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-amber-600 via-amber-700 to-amber-800 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
                          >
                            Reset Preferences
                          </button>
                        </div>

                        <div className="p-4 bg-zinc-50/50 border border-zinc-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                              Disconnect All Integrations
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Unlink GitHub, LeetCode, Codeforces, and CodeChef.
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              openDangerModal("disconnect_integrations")
                            }
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-amber-600 via-amber-700 to-amber-800 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
                          >
                            Disconnect All
                          </button>
                        </div>

                        <div className="p-4 bg-zinc-50/50 border border-zinc-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                              Remove All Connected Platforms
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Revoke linked OAuth access tokens and credentials.
                            </p>
                          </div>
                          <button
                            onClick={() => openDangerModal("remove_platforms")}
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-amber-600 via-amber-700 to-amber-800 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
                          >
                            Remove Platforms
                          </button>
                        </div>

                        <div className="p-4 bg-zinc-50/50 border border-zinc-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                              Revoke All Sessions
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Log out of all active devices immediately.
                            </p>
                          </div>
                          <button
                            onClick={() => openDangerModal("revoke_sessions")}
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-amber-600 via-amber-700 to-amber-800 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
                          >
                            Revoke All Sessions
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-red-300 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                        <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                        Critical Irreversible Actions
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-red-50/40 border border-red-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-red-950">
                              Delete All Imported Data
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Wipe cached commits, repository stats, and
                              submission history.
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              openDangerModal("delete_imported_data")
                            }
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-red-600 via-red-700 to-red-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Delete Imported Data
                          </button>
                        </div>

                        <div className="p-4 bg-red-50/40 border border-red-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-red-950">
                              Delete AI History
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Clear all AI Career Coach conversation logs and
                              chat records.
                            </p>
                          </div>
                          <button
                            onClick={() => openDangerModal("delete_ai_history")}
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-red-600 via-red-700 to-red-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Delete AI History
                          </button>
                        </div>

                        <div className="p-4 bg-red-50/40 border border-red-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-red-950">
                              Delete Account
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Deactivate account and terminate active access.
                            </p>
                          </div>
                          <button
                            onClick={() => openDangerModal("delete_account")}
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-red-600 via-red-700 to-red-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Delete Account
                          </button>
                        </div>

                        <div className="p-4 bg-red-50/40 border border-red-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-red-950">
                              Permanently Remove Data
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Purge profile, projects, achievements, and
                              database records forever.
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              openDangerModal("permanently_remove_data")
                            }
                            className="btn-candy px-3.5 py-2 bg-linear-to-b from-red-700 via-red-800 to-red-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Permanently Wipe Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeDangerAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-none outline-hidden"
            onClick={() => setActiveDangerAction(null)}
          />
          <div className="relative w-full max-w-lg bg-white border border-red-200 rounded-3xl shadow-2xl p-6 sm:p-8 animate-fadeIn space-y-5">
            <button
              onClick={() => setActiveDangerAction(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all"
            >
              <Cross1Icon className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <ExclamationTriangleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  {dangerActionConfigs[activeDangerAction].title}
                </h3>
                <p className="text-xs text-zinc-500">
                  {dangerActionConfigs[activeDangerAction].description}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 leading-relaxed font-medium">
              ⚠️ {dangerActionConfigs[activeDangerAction].warning}
            </div>

            {dangerError && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-xs font-semibold">
                {dangerError}
              </div>
            )}

            <form onSubmit={handleDangerActionSubmit} className="space-y-4">
              {dangerActionConfigs[activeDangerAction].inputLabel && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    {dangerActionConfigs[activeDangerAction].inputLabel}
                  </label>
                  <input
                    type={
                      dangerActionConfigs[activeDangerAction].inputType ||
                      "text"
                    }
                    placeholder={
                      dangerActionConfigs[activeDangerAction].inputPlaceholder
                    }
                    required
                    value={dangerInputValue}
                    onChange={(e) => setDangerInputValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your account password"
                  required
                  value={dangerPassword}
                  onChange={(e) => setDangerPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm"
                />
              </div>

              {user?.two_factor_enabled && (
                <div className="space-y-1.5 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <label className="text-xs font-bold text-emerald-900 flex items-center justify-between">
                    <span>
                      2FA Security Code <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[10px] font-normal text-emerald-700">
                      2FA Active
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    required
                    value={dangerOtp}
                    onChange={(e) =>
                      setDangerOtp(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              )}

              {dangerActionConfigs[activeDangerAction].confirmText && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Type{" "}
                    <code className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-red-600 font-bold select-all">
                      {dangerActionConfigs[activeDangerAction].confirmText}
                    </code>{" "}
                    to confirm:
                  </label>
                  <input
                    type="text"
                    placeholder={
                      dangerActionConfigs[activeDangerAction].confirmText
                    }
                    required
                    value={dangerTypedConfirm}
                    onChange={(e) => setDangerTypedConfirm(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-red-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-600 text-sm font-mono uppercase"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setActiveDangerAction(null)}
                  className="btn-candy px-4 py-2.5 bg-zinc-100 border border-zinc-300 text-zinc-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    dangerLoading ||
                    !dangerPassword ||
                    (!!user?.two_factor_enabled && dangerOtp.length < 6) ||
                    (!!dangerActionConfigs[activeDangerAction].confirmText &&
                      dangerTypedConfirm.trim() !==
                        dangerActionConfigs[activeDangerAction].confirmText)
                  }
                  className="btn-candy px-4 py-2.5 bg-linear-to-b from-red-600 via-red-700 to-red-800 text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {dangerLoading
                    ? "Executing..."
                    : dangerActionConfigs[activeDangerAction].buttonLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowReauthModal(false)}
                  className="btn-candy px-4 py-2 bg-zinc-100 border border-zinc-300 text-zinc-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reauthLoading}
                  className="btn-candy px-4 py-2 bg-linear-to-b from-[#005451] to-[#002927] text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
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
              sign in again using your new password?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => handlePasswordChangeSubmit(false)}
                className="btn-candy px-4 py-2.5 bg-zinc-100 border border-zinc-300 text-zinc-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                No, Keep Other Sessions
              </button>
              <button
                type="button"
                onClick={() => handlePasswordChangeSubmit(true)}
                className="btn-candy px-4 py-2.5 bg-linear-to-b from-red-600 via-red-700 to-red-800 text-white border border-red-500/50 rounded-xl text-xs font-bold cursor-pointer"
              >
                Yes, Sign Out Everywhere
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
