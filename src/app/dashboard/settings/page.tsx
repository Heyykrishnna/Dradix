"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import {
  ApiResponse,
  SecurityOverview,
  SecurityEvent,
  AuditLogEntry,
  NotificationPrefs,
} from "@/types/auth";
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
  is_trusted?: boolean;
  device_id?: string | null;
  rotated_at?: string | null;
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

  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "settings" | "audit"
  >("overview");
  const [securityOverview, setSecurityOverview] =
    useState<SecurityOverview | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPrefs | null>(null);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [loadingSecurity, setLoadingSecurity] = useState(true);

  const [auditSearch, setAuditSearch] = useState("");
  const [auditEventType, setAuditEventType] = useState("all");
  const [auditDevice, setAuditDevice] = useState("all");
  const [auditStatus, setAuditStatus] = useState("all");
  const [auditStartDate, setAuditStartDate] = useState("");
  const [auditEndDate, setAuditEndDate] = useState("");
  const auditLimit = 10;

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

  const fetchSecurityOverview = async () => {
    setLoadingSecurity(true);
    try {
      const res = await apiFetch<ApiResponse<SecurityOverview>>(
        "/auth/security/overview",
      );
      if (res.success && res.data) {
        setSecurityOverview(res.data);
      }
      const eventsRes = await apiFetch<ApiResponse<SecurityEvent[]>>(
        "/auth/security/events",
      );
      if (eventsRes.success && eventsRes.data) {
        setSecurityEvents(eventsRes.data);
      }
      const prefsRes = await apiFetch<ApiResponse<NotificationPrefs>>(
        "/auth/security/notifications",
      );
      if (prefsRes.success && prefsRes.data) {
        setNotificationPrefs(prefsRes.data);
      }
    } catch (err: unknown) {
      console.error("Failed to load security overview:", err);
    } finally {
      setLoadingSecurity(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: auditPage.toString(),
        limit: auditLimit.toString(),
        search: auditSearch,
        eventType: auditEventType,
        device: auditDevice,
        status: auditStatus,
        startDate: auditStartDate,
        endDate: auditEndDate,
      });

      const res = await apiFetch<
        ApiResponse<{
          logs: AuditLogEntry[];
          total: number;
          totalPages: number;
        }>
      >(`/auth/security/audit-log?${queryParams.toString()}`);
      if (res.success && res.data) {
        setAuditLogs(res.data.logs);
        setAuditTotal(res.data.total);
        setAuditTotalPages(res.data.totalPages);
      }
    } catch (err: unknown) {
      console.error("Failed to load audit logs:", err);
    }
  };

  const handleUpdatePrefs = async (
    key: keyof NotificationPrefs,
    value: boolean,
  ) => {
    if (!notificationPrefs) return;
    const updated = { ...notificationPrefs, [key]: value };
    setNotificationPrefs(updated);
    try {
      await apiFetch<ApiResponse<NotificationPrefs>>(
        "/auth/security/notifications",
        {
          method: "PUT",
          body: JSON.stringify(updated),
        },
      );
      setSuccessMsg("Security alert notification preference updated.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to update notification preferences",
      );
      setNotificationPrefs(notificationPrefs);
    }
  };

  const handleExportData = async (format: "json" | "csv") => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiFetch<ApiResponse<any>>("/auth/security/export");
      if (!res.success || !res.data) throw new Error("No data returned");

      const data = res.data;
      if (format === "json") {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `security_export_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === "csv") {
        let csvContent = "";

        // 1. User details
        csvContent += "USER DETAILS\n";
        csvContent +=
          "Username,Email,Is Verified,2FA Enabled,Created At,Last Login,Last Password Change\n";
        csvContent += `"${data.user.username}","${data.user.email}",${data.user.isVerified},${data.user.twoFactorEnabled},"${data.user.createdAt}","${data.user.lastLoginAt || ""}","${data.user.lastPasswordChangedAt || ""}"\n\n`;

        // 2. Active sessions
        csvContent += "ACTIVE SESSIONS\n";
        csvContent +=
          "Device,Browser,OS,Type,IP Address,Location,Is Trusted,Last Active,Expires At\n";
        data.activeSessions.forEach((s: any) => {
          csvContent += `"${s.device_name || ""}","${s.browser_name || ""}","${s.os || ""}","${s.device_type || ""}","${s.ip_address || ""}","${s.location || ""}",${s.is_trusted},"${s.last_active}","${s.expires_at}"\n`;
        });
        csvContent += "\n";

        // 3. Trusted devices
        csvContent += "TRUSTED DEVICES\n";
        csvContent += "Device ID,Device,Browser,OS,Last Active,Created At\n";
        data.trustedDevices.forEach((t: any) => {
          csvContent += `"${t.device_id}","${t.device_name || ""}","${t.browser_name || ""}","${t.os || ""}","${t.last_active}","${t.created_at}"\n`;
        });
        csvContent += "\n";

        // 4. Security logs
        csvContent += "SECURITY EVENTS HISTORY\n";
        csvContent +=
          "Event Type,Description,Status,IP Address,Device,Location,Timestamp\n";
        data.securityLogs.forEach((l: any) => {
          csvContent += `"${l.event_type}","${l.description.replace(/"/g, '""')}","${l.event_status}","${l.ip_address || ""}","${l.device_name || ""}","${l.location || ""}","${l.created_at}"\n`;
        });

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `security_export_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setSuccessMsg(
        `Security data exported successfully as ${format.toUpperCase()}.`,
      );
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to export data");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSessions();
      fetchSecurityOverview();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAuditLogs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    auditPage,
    auditSearch,
    auditEventType,
    auditDevice,
    auditStatus,
    auditStartDate,
    auditEndDate,
  ]);

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

  const getEventMeta = (
    eventType: string,
    status: string,
  ): { color: string; icon: React.ReactNode; label: string } => {
    const base = "text-white";
    const map: Record<
      string,
      { color: string; icon: React.ReactNode; label: string }
    > = {
      login_success: {
        color: `bg-emerald-500 ${base}`,
        icon: (
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
        label: "Login Success",
      },
      new_device_login: {
        color: `bg-blue-500 ${base}`,
        icon: (
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
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ),
        label: "New Device Login",
      },
      password_changed: {
        color: `bg-violet-500 ${base}`,
        icon: (
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
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        ),
        label: "Password Changed",
      },
      password_reset_completed: {
        color: `bg-violet-500 ${base}`,
        icon: (
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
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        ),
        label: "Password Reset",
      },
      "2fa_enabled": {
        color: `bg-emerald-500 ${base}`,
        icon: (
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
        label: "2FA Enabled",
      },
      "2fa_disabled": {
        color: `bg-amber-500 ${base}`,
        icon: (
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        ),
        label: "2FA Disabled",
      },
      "2fa_recovery_code_used": {
        color: `bg-amber-500 ${base}`,
        icon: (
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        ),
        label: "Recovery Code Used",
      },
      login_success_2fa: {
        color: `bg-emerald-500 ${base}`,
        icon: (
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
        label: "Login via 2FA",
      },
      refresh_token_reuse: {
        color: `bg-red-500 ${base}`,
        icon: (
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
        label: "Token Reuse Alert",
      },
      security_setting_changes: {
        color: `bg-zinc-500 ${base}`,
        icon: (
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
        label: "Settings Changed",
      },
    };

    if (status === "failed" || status === "warning") {
      return {
        color: `bg-red-500 ${base}`,
        icon: (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
        label: eventType
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    }

    return (
      map[eventType] || {
        color: `bg-zinc-500 ${base}`,
        icon: (
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        label: eventType
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      }
    );
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

        <div className="bg-white border border-zinc-200/80 shadow-xs rounded-2xl overflow-hidden">
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-0 border-b border-zinc-200">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                  Account Security
                </h2>
                <p className="text-zinc-500 text-xs mt-1">
                  Monitor security status, manage alerts, and review your full
                  activity history.
                </p>
              </div>
              {securityOverview && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 ${
                    securityOverview.score >= 80
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : securityOverview.score >= 50
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      securityOverview.score >= 80
                        ? "bg-emerald-500"
                        : securityOverview.score >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  />
                  Score: {securityOverview.score}/100
                </div>
              )}
            </div>
            <div className="flex gap-0">
              {(
                [
                  { id: "overview", label: "Overview" },
                  { id: "settings", label: "Notifications" },
                  { id: "audit", label: "Audit Log" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-px cursor-pointer ${
                    activeSubTab === tab.id
                      ? "border-[#003c3a] text-[#003c3a]"
                      : "border-transparent text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {loadingSecurity ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-zinc-200 border-t-[#003c3a] rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {activeSubTab === "overview" && (
                  <div className="space-y-8">
                    {securityOverview && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex items-center gap-5 p-5 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                          <div className="relative shrink-0">
                            <svg
                              viewBox="0 0 56 56"
                              className="w-20 h-20 -rotate-90"
                            >
                              <circle
                                cx="28"
                                cy="28"
                                r="24"
                                fill="none"
                                stroke="#e4e4e7"
                                strokeWidth="6"
                              />
                              <circle
                                cx="28"
                                cy="28"
                                r="24"
                                fill="none"
                                stroke={
                                  securityOverview.score >= 80
                                    ? "#10b981"
                                    : securityOverview.score >= 50
                                      ? "#f59e0b"
                                      : "#ef4444"
                                }
                                strokeWidth="6"
                                strokeDasharray={`${(securityOverview.score / 100) * 150.8} 150.8`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xl font-black text-zinc-900">
                                {securityOverview.score}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] text-zinc-400 mb-1">
                              Security Score
                            </p>
                            <p
                              className={`text-lg font-bold mb-1 ${
                                securityOverview.score >= 80
                                  ? "text-emerald-600"
                                  : securityOverview.score >= 50
                                    ? "text-amber-600"
                                    : "text-red-600"
                              }`}
                            >
                              {securityOverview.score >= 80
                                ? "Excellent"
                                : securityOverview.score >= 50
                                  ? "Fair"
                                  : "Needs Attention"}
                            </p>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                              {securityOverview.score >= 80
                                ? "Your account is well protected."
                                : securityOverview.score >= 50
                                  ? "Enable more features to improve security."
                                  : "Take action to secure your account."}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {[
                            {
                              label: "Email Verified",
                              active: securityOverview.features.emailVerified,
                              points: 20,
                            },
                            {
                              label: "Two-Factor Authentication",
                              active:
                                securityOverview.features.twoFactorEnabled,
                              points: 30,
                            },
                            {
                              label: "Password Set",
                              active: securityOverview.features.hasPassword,
                              points: 20,
                            },
                            {
                              label: "Trusted Device Registered",
                              active:
                                securityOverview.features.hasTrustedDevices,
                              points: 15,
                            },
                            {
                              label: "Healthy Session Count (≤3)",
                              active:
                                securityOverview.features.activeSessionCount <=
                                3,
                              points: 15,
                            },
                          ].map((feature) => (
                            <div
                              key={feature.label}
                              className="flex items-center justify-between px-3 py-2.5 border border-zinc-200 rounded-xl bg-white"
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                    feature.active
                                      ? "bg-emerald-100"
                                      : "bg-zinc-100"
                                  }`}
                                >
                                  {feature.active ? (
                                    <svg
                                      className="w-2.5 h-2.5 text-emerald-600"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-2.5 h-2.5 text-zinc-400"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span
                                  className={`text-xs font-medium ${
                                    feature.active
                                      ? "text-zinc-800"
                                      : "text-zinc-400"
                                  }`}
                                >
                                  {feature.label}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  feature.active
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-zinc-100 text-zinc-400"
                                }`}
                              >
                                +{feature.points}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {securityOverview && (
                      <div>
                        <h3 className="text-sm font-bold text-zinc-800 mb-4">
                          Account Information
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            {
                              label: "Account Created",
                              value: formatDate(
                                securityOverview.accountInfo.createdAt,
                              ),
                            },
                            {
                              label: "Last Login",
                              value: securityOverview.accountInfo.lastLoginAt
                                ? formatDate(
                                    securityOverview.accountInfo.lastLoginAt,
                                  )
                                : "Never",
                            },
                            {
                              label: "Last Password Change",
                              value: securityOverview.accountInfo
                                .lastPasswordChangedAt
                                ? formatDate(
                                    securityOverview.accountInfo
                                      .lastPasswordChangedAt,
                                  )
                                : "Never",
                            },
                            {
                              label: "Active Sessions",
                              value: `${securityOverview.accountInfo.activeSessionCount} session${securityOverview.accountInfo.activeSessionCount !== 1 ? "s" : ""}`,
                            },
                            {
                              label: "Trusted Devices",
                              value: `${securityOverview.accountInfo.trustedDeviceCount} device${securityOverview.accountInfo.trustedDeviceCount !== 1 ? "s" : ""}`,
                            },
                            {
                              label: "Session Expiry",
                              value: securityOverview.accountInfo
                                .currentSessionExpiresAt
                                ? formatDate(
                                    securityOverview.accountInfo
                                      .currentSessionExpiresAt,
                                  )
                                : "N/A",
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="p-3.5 border border-zinc-200 rounded-xl bg-white"
                            >
                              <p className="text-[10px] font-medium text-zinc-400 mb-1">
                                {item.label}
                              </p>
                              <p className="text-xs font-semibold text-zinc-800">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-bold text-zinc-800 mb-4">
                        Connected Accounts
                      </h3>
                      <div className="space-y-2.5">
                        {[
                          {
                            id: "google",
                            name: "Google",
                            linked: !!(user as any)?.google_id,
                            available: true,
                            desc: "Sign in with your Google account",
                            icon: (
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                            ),
                          },
                          {
                            id: "github",
                            name: "GitHub",
                            linked: false,
                            available: false,
                            desc: "Sign in with your GitHub account",
                            icon: (
                              <svg
                                className="w-5 h-5 text-zinc-800"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                              </svg>
                            ),
                          },
                          {
                            id: "microsoft",
                            name: "Microsoft",
                            linked: false,
                            available: false,
                            desc: "Sign in with your Microsoft account",
                            icon: (
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#F25022" d="M1 1h10v10H1z" />
                                <path fill="#7FBA00" d="M13 1h10v10H13z" />
                                <path fill="#00A4EF" d="M1 13h10v10H1z" />
                                <path fill="#FFB900" d="M13 13h10v10H13z" />
                              </svg>
                            ),
                          },
                          {
                            id: "apple",
                            name: "Apple",
                            linked: false,
                            available: false,
                            desc: "Sign in with your Apple ID",
                            icon: (
                              <svg
                                className="w-5 h-5 text-zinc-800"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                              </svg>
                            ),
                          },
                        ].map((provider) => (
                          <div
                            key={provider.id}
                            className="flex items-center justify-between px-4 py-3.5 border border-zinc-200 rounded-xl bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={
                                  !provider.available ? "opacity-40" : ""
                                }
                              >
                                {provider.icon}
                              </div>
                              <div>
                                <p
                                  className={`text-sm font-semibold ${
                                    !provider.available
                                      ? "text-zinc-400"
                                      : "text-zinc-800"
                                  }`}
                                >
                                  {provider.name}
                                  {!provider.available && (
                                    <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-400 rounded-md">
                                      Coming Soon
                                    </span>
                                  )}
                                </p>
                                <p className="text-[11px] text-zinc-500">
                                  {provider.linked
                                    ? "Connected"
                                    : provider.available
                                      ? "Not connected"
                                      : "Not available yet"}
                                </p>
                              </div>
                            </div>
                            {provider.available && (
                              <button
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                  provider.linked
                                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                    : "bg-[#003c3a]/10 text-[#003c3a] border border-[#003c3a]/20 hover:bg-[#003c3a]/15"
                                }`}
                              >
                                {provider.linked ? "Disconnect" : "Connect"}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {securityOverview &&
                      (() => {
                        const recs: {
                          icon: string;
                          label: string;
                          desc: string;
                          urgency: "high" | "medium" | "low";
                        }[] = [];
                        if (!securityOverview.features.emailVerified)
                          recs.push({
                            icon: "✉️",
                            label: "Verify your email address",
                            desc: "Confirm your email to recover your account and receive security alerts.",
                            urgency: "high",
                          });
                        if (!securityOverview.features.twoFactorEnabled)
                          recs.push({
                            icon: "🔐",
                            label: "Enable Two-Factor Authentication",
                            desc: "Add an extra layer of security to prevent unauthorized access.",
                            urgency: "high",
                          });
                        if (!securityOverview.features.hasTrustedDevices)
                          recs.push({
                            icon: "🛡️",
                            label: "Register a trusted device",
                            desc: "Skip 2FA prompts on devices you use regularly.",
                            urgency: "low",
                          });
                        if (securityOverview.features.activeSessionCount > 5)
                          recs.push({
                            icon: "📱",
                            label: "Review inactive sessions",
                            desc: `You have ${securityOverview.features.activeSessionCount} active sessions. Terminate unused ones to reduce risk.`,
                            urgency: "medium",
                          });
                        if (!securityOverview.features.hasGoogleLinked)
                          recs.push({
                            icon: "🔗",
                            label: "Link a backup sign-in method",
                            desc: "Connect Google to access your account if you forget your password.",
                            urgency: "low",
                          });

                        if (recs.length === 0)
                          return (
                            <div className="p-5 border border-emerald-200 rounded-2xl bg-emerald-50 flex items-center gap-4">
                              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                <svg
                                  className="w-5 h-5 text-emerald-600"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-emerald-800">
                                  Your account is fully secured
                                </p>
                                <p className="text-xs text-emerald-600 mt-0.5">
                                  No security recommendations at this time.
                                </p>
                              </div>
                            </div>
                          );

                        return (
                          <div>
                            <h3 className="text-sm font-bold text-zinc-800 mb-4">
                              Security Recommendations
                            </h3>
                            <div className="space-y-2.5">
                              {recs.map((rec) => (
                                <div
                                  key={rec.label}
                                  className={`flex items-start gap-3 p-4 border rounded-xl ${
                                    rec.urgency === "high"
                                      ? "border-red-200 bg-red-50"
                                      : rec.urgency === "medium"
                                        ? "border-amber-200 bg-amber-50"
                                        : "border-zinc-200 bg-zinc-50"
                                  }`}
                                >
                                  <div>
                                    <p
                                      className={`text-xs font-semibold ${
                                        rec.urgency === "high"
                                          ? "text-red-800"
                                          : rec.urgency === "medium"
                                            ? "text-amber-800"
                                            : "text-zinc-800"
                                      }`}
                                    >
                                      {rec.label}
                                    </p>
                                    <p
                                      className={`text-[11px] mt-0.5 ${
                                        rec.urgency === "high"
                                          ? "text-red-600"
                                          : rec.urgency === "medium"
                                            ? "text-amber-600"
                                            : "text-zinc-500"
                                      }`}
                                    >
                                      {rec.desc}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                    <div>
                      <h3 className="text-sm font-bold text-zinc-800 mb-4">
                        Recent Security Events
                      </h3>
                      {securityEvents.length === 0 ? (
                        <div className="py-10 text-center text-zinc-400 text-sm border border-zinc-200 rounded-2xl">
                          No security events recorded yet.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {securityEvents.map((event) => {
                            const { color, icon, label } = getEventMeta(
                              event.event_type,
                              event.event_status,
                            );
                            return (
                              <div
                                key={event.id}
                                className="flex items-start gap-3 p-3.5 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 transition-colors"
                              >
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}
                                >
                                  {icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-semibold text-zinc-800">
                                      {label}
                                    </p>
                                    <span className="text-[10px] text-zinc-400 shrink-0">
                                      {formatDate(event.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-zinc-500 mt-0.5">
                                    {event.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-400">
                                    {event.ip_address && (
                                      <span>IP: {event.ip_address}</span>
                                    )}
                                    {event.location && (
                                      <span>· {event.location}</span>
                                    )}
                                    {event.device_name && (
                                      <span>· {event.device_name}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="p-5 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-zinc-800">
                            Export Security Data
                          </h3>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Download a complete record of your sessions, trusted
                            devices, and security events.
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleExportData("json")}
                            className="px-3.5 py-2 text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-all cursor-pointer"
                          >
                            JSON
                          </button>
                          <button
                            onClick={() => handleExportData("csv")}
                            className="px-3.5 py-2 text-xs font-semibold bg-[#003c3a] text-white rounded-xl hover:bg-[#002d2b] transition-all shadow-sm cursor-pointer"
                          >
                            CSV
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubTab === "settings" && notificationPrefs && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-800 mb-1">
                        Security Alert Preferences
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Control which security events trigger notifications.
                        Changes take effect immediately.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {(
                        [
                          {
                            key: "new_device_login" as const,
                            label: "New Device Login",
                            desc: "Alert when a new device signs into your account",
                          },
                          {
                            key: "password_changes" as const,
                            label: "Password Changes",
                            desc: "Alert when your account password is modified",
                          },
                          {
                            key: "email_changes" as const,
                            label: "Email Address Changes",
                            desc: "Alert when your primary email address is updated",
                          },
                          {
                            key: "failed_login_attempts" as const,
                            label: "Failed Login Attempts",
                            desc: "Alert on repeated failed sign-in attempts",
                          },
                          {
                            key: "security_setting_changes" as const,
                            label: "Security Setting Changes",
                            desc: "Alert when 2FA or other security settings are modified",
                          },
                          {
                            key: "account_recovery" as const,
                            label: "Account Recovery Requests",
                            desc: "Alert when a password reset or recovery is initiated",
                          },
                        ] as const
                      ).map((pref) => (
                        <div
                          key={pref.key}
                          className="flex items-center justify-between gap-4 p-4 border border-zinc-200 rounded-xl bg-white"
                        >
                          <div>
                            <p className="text-xs font-semibold text-zinc-800">
                              {pref.label}
                            </p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">
                              {pref.desc}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleUpdatePrefs(
                                pref.key,
                                !notificationPrefs[pref.key],
                              )
                            }
                            className={`relative rounded-full transition-all duration-200 shrink-0 cursor-pointer ${
                              notificationPrefs[pref.key]
                                ? "bg-[#003c3a]"
                                : "bg-zinc-300"
                            }`}
                            style={{ width: 40, height: 22 }}
                          >
                            <span
                              className={`absolute top-[2px] left-[2px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                                notificationPrefs[pref.key]
                                  ? "translate-x-[18px]"
                                  : "translate-x-0"
                              }`}
                              style={{ width: 18, height: 18 }}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubTab === "audit" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-800">
                          Audit Log
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {auditTotal} total event
                          {auditTotal !== 1 ? "s" : ""} recorded
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <input
                        type="search"
                        placeholder="Search events…"
                        value={auditSearch}
                        onChange={(e) => {
                          setAuditSearch(e.target.value);
                          setAuditPage(1);
                        }}
                        className="px-3.5 py-2 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600 col-span-full sm:col-span-2 md:col-span-1"
                      />
                      <select
                        value={auditEventType}
                        onChange={(e) => {
                          setAuditEventType(e.target.value);
                          setAuditPage(1);
                        }}
                        className="px-3.5 py-2 border border-zinc-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      >
                        <option value="all">All Event Types</option>
                        <option value="login_success">Login Success</option>
                        <option value="new_device_login">
                          New Device Login
                        </option>
                        <option value="password_changed">
                          Password Changed
                        </option>
                        <option value="2fa_enabled">2FA Enabled</option>
                        <option value="2fa_disabled">2FA Disabled</option>
                        <option value="2fa_recovery_code_used">
                          Recovery Code Used
                        </option>
                        <option value="password_reset_completed">
                          Password Reset
                        </option>
                        <option value="refresh_token_reuse">
                          Token Reuse Alert
                        </option>
                        <option value="security_setting_changes">
                          Settings Changed
                        </option>
                      </select>
                      <select
                        value={auditStatus}
                        onChange={(e) => {
                          setAuditStatus(e.target.value);
                          setAuditPage(1);
                        }}
                        className="px-3.5 py-2 border border-zinc-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      >
                        <option value="all">All Statuses</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="failed">Failed</option>
                      </select>
                      <input
                        type="date"
                        value={auditStartDate}
                        onChange={(e) => {
                          setAuditStartDate(e.target.value);
                          setAuditPage(1);
                        }}
                        className="px-3.5 py-2 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      />
                      <input
                        type="date"
                        value={auditEndDate}
                        onChange={(e) => {
                          setAuditEndDate(e.target.value);
                          setAuditPage(1);
                        }}
                        className="px-3.5 py-2 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      />
                      <select
                        value={auditDevice}
                        onChange={(e) => {
                          setAuditDevice(e.target.value);
                          setAuditPage(1);
                        }}
                        className="px-3.5 py-2 border border-zinc-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      >
                        <option value="all">All Devices</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Tablet">Tablet</option>
                      </select>
                    </div>

                    {auditLogs.length === 0 ? (
                      <div className="py-12 text-center text-zinc-400 text-sm border border-zinc-200 rounded-2xl">
                        No audit log entries match your filters.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {auditLogs.map((entry) => {
                          const { color, icon, label } = getEventMeta(
                            entry.event_type,
                            entry.event_status,
                          );
                          return (
                            <div
                              key={entry.id}
                              className="flex items-start gap-3 p-3.5 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 transition-colors"
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}
                              >
                                {icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                  <p className="text-xs font-semibold text-zinc-800">
                                    {label}
                                  </p>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                        entry.event_status === "success"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : entry.event_status === "warning"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {entry.event_status.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] text-zinc-400">
                                      {formatDate(entry.created_at)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                  {entry.description}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-400 flex-wrap">
                                  {entry.ip_address && (
                                    <span>IP: {entry.ip_address}</span>
                                  )}
                                  {entry.location && (
                                    <span>· {entry.location}</span>
                                  )}
                                  {entry.browser && (
                                    <span>· {entry.browser}</span>
                                  )}
                                  {entry.os && <span>· {entry.os}</span>}
                                  {entry.device_type && (
                                    <span>· {entry.device_type}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {auditTotalPages > 1 && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-zinc-400">
                          Page {auditPage} of {auditTotalPages} · {auditTotal}{" "}
                          total
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setAuditPage((p) => Math.max(1, p - 1))
                            }
                            disabled={auditPage <= 1}
                            className="px-3 py-1.5 text-xs font-semibold border border-zinc-200 bg-white text-zinc-600 rounded-lg hover:bg-zinc-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() =>
                              setAuditPage((p) =>
                                Math.min(auditTotalPages, p + 1),
                              )
                            }
                            disabled={auditPage >= auditTotalPages}
                            className="px-3 py-1.5 text-xs font-semibold border border-zinc-200 bg-white text-zinc-600 rounded-lg hover:bg-zinc-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

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
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleRevokeAll}
                disabled={bulkLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {bulkLoading ? "Logging out all..." : "Logout All Devices"}
              </button>
              {sessions.length > 1 && (
                <button
                  onClick={handleRevokeOther}
                  disabled={bulkLoading}
                  className="px-4 py-2 bg-[#003c3a] hover:bg-[#002d2b] text-white disabled:opacity-50 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {bulkLoading
                    ? "Logging out others..."
                    : "Logout Other Devices"}
                </button>
              )}
            </div>
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
                    className={`flex flex-col gap-4 p-5 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-[#f0f6f6] border-[#003c3a]/30 shadow-xs"
                        : "bg-zinc-50/50 border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300"
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
                            className={`p-2 rounded-lg hover:bg-zinc-100 transition-colors shrink-0 cursor-pointer ${
                              session.is_trusted
                                ? "text-emerald-600 hover:text-emerald-700"
                                : "text-zinc-400 hover:text-zinc-600"
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill={
                                session.is_trusted ? "currentColor" : "none"
                              }
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </button>
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover/trust:opacity-100 transition-opacity duration-150 z-20">
                            <div className="bg-zinc-900 text-white text-[10px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
                              {session.is_trusted
                                ? "Remove Trust"
                                : "Mark as Trusted"}
                            </div>
                            <div className="w-2 h-2 bg-zinc-900 rotate-45 -mt-1" />
                          </div>
                        </div>
                        <div className="relative group/logout">
                          <button
                            onClick={() =>
                              handleRevoke(session.id, session.session_token)
                            }
                            disabled={actionLoading === session.id}
                            className={`p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-red-600 shrink-0 cursor-pointer ${
                              isCurrent
                                ? "hover:bg-red-50 hover:text-red-600"
                                : ""
                            }`}
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
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover/logout:opacity-100 transition-opacity duration-150 z-20">
                            <div className="bg-zinc-900 text-white text-[10px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
                              {isCurrent
                                ? "Logout this device"
                                : "Terminate session"}
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
                          <code className="text-zinc-700 font-mono select-all cursor-default">
                            {session.session_token.slice(0, 8)}...
                          </code>
                          <div className="pointer-events-none absolute bottom-full left-0 mb-2 flex flex-col items-start opacity-0 group-hover/sessionid:opacity-100 transition-opacity duration-150 z-20">
                            <div className="bg-zinc-900 text-white text-[10px] font-mono px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
                              {session.session_token}
                            </div>
                            <div className="w-2 h-2 bg-zinc-900 rotate-45 -mt-1 ml-2" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="block font-medium text-zinc-400">
                          Status
                        </span>
                        <span className="inline-flex text-zinc-700 items-center text-[10px]">
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
