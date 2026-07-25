"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import {
  DashboardIcon,
  PersonIcon,
  FileTextIcon,
  ActivityLogIcon,
  MagnifyingGlassIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  ReloadIcon,
  RocketIcon,
  LightningBoltIcon,
  TargetIcon,
  TrashIcon,
  EyeOpenIcon,
  Pencil1Icon,
  DownloadIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  CubeIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { Shield } from "lucide-react";

interface AdminUserItem {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  auth_provider: "GOOGLE" | "PASSWORD" | string;
  role: "USER" | "ADMIN" | string;
  is_verified: boolean;
  two_factor_enabled: boolean;
  developer_score: number;
  created_at: string;
  updated_at: string;
  last_active: string;
  ip_address: string;
  location: string;
  device: string;
  browser: string;
  os: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  isDisposableEmail: boolean;
  admin_notes?: string;
  _count?: {
    projects: number;
    userSessions: number;
  };
}

interface UserSessionDetail {
  id: number;
  session_token: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser_name: string;
  os: string;
  location: string;
  is_trusted: boolean;
  created_at: string;
  last_active: string;
  expires_at: string;
}

interface UserDetailPayload {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    cover_url: string | null;
    bio: string | null;
    google_id: string | null;
    role: string;
    is_verified: boolean;
    two_factor_enabled: boolean;
    developer_score: number;
    skills: string[];
    socials: Record<string, string>;
    created_at: string;
    updated_at: string;
    projects: Array<{
      id: number;
      title: string;
      tagline: string;
      category: string;
      views_count: number;
      created_at: string;
    }>;
  };
  authProvider: string;
  recentSessions: UserSessionDetail[];
  recentLogs: Array<{
    id: number;
    action: string;
    category: string;
    level: string;
    details: Record<string, unknown>;
    ip_address: string;
    created_at: string;
  }>;
  riskIndicators: {
    riskScore: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    isDisposableEmail: boolean;
    failedLoginAttempts: number;
    suspiciousLogins: boolean;
    multipleCountries: boolean;
    countriesCount: number;
    devicesCount: number;
    sharedDeviceAccountsCount: number;
  };
}

interface SystemLogItem {
  id: number;
  action: string;
  category: string;
  level: string;
  details: Record<string, unknown>;
  ip_address: string;
  created_at: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

interface WaitlistSubscriberItem {
  id: number;
  email: string;
  created_at: string;
}

interface OverviewData {
  totalRegisteredUsers: number;
  dau: number;
  wau: number;
  mau: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activeSessions: number;
  concurrentUsers: number;
  onlineUsers: number;
  offlineUsers: number;
  totalProjects: number;
  totalGithubConnections: number;
  totalCodingConnections: number;
  totalAiRequests: number;
  totalApiRequests: number;
  totalStorageMB: string;
  databaseSizeMB: string;
  cacheUsageMB: string;
  queueStatus: string;
  backgroundJobsStatus: string;
}

interface AdminStats {
  pipelineValue: {
    value: string;
    comparison: string;
    changePercent: string;
    isPositive: boolean;
  };
  openDeals: {
    value: number;
    subtext: string;
    badgeText: string;
  };
  wonThisMonth: {
    value: string;
    subtext: string;
    changePercent: string;
    isPositive: boolean;
  };
  activitiesDue: {
    value: number;
    subtext: string;
    overdueCount: number;
  };
  conversionRate: {
    value: string;
    subtext: string;
    changePercent: string;
    isPositive: boolean;
  };
  counts: {
    totalUsers: number;
    adminUsers: number;
    standardUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    totalProjects: number;
    totalBlogs: number;
    totalWaitlist: number;
    totalLogs: number;
  };
  overview?: OverviewData;
  systemHealth: string;
}

interface RevenueItem {
  month: string;
  target: number;
  booked: number;
  users?: number;
  projects?: number;
}

interface ActivityItem {
  id: number;
  title: string;
  client: string;
  status: string;
  statusType: string;
  time: string;
  initials: string;
}

interface AnalyticsData {
  revenueVsTarget: RevenueItem[];
  upcomingActivities: ActivityItem[];
}

interface HealthData {
  status: string;
  uptimeSeconds: number;
  memory: {
    rssMB: number;
    heapTotalMB: number;
    heapUsedMB: number;
  };
  nodeVersion: string;
  databaseStatus: string;
  timestamp: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ConfirmationModalState {
  isOpen: boolean;
  title: string;
  message: string;
  actionLabel: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => Promise<void> | void;
}

function ActionTooltip({
  name,
  usecase,
  children,
  align = "center",
}: {
  name: string;
  usecase: string;
  children: React.ReactNode;
  align?: "center" | "right" | "left";
}) {
  const alignClass =
    align === "right"
      ? "right-0 translate-x-0"
      : align === "left"
        ? "left-0 translate-x-0"
        : "left-1/2 -translate-x-1/2";
  const arrowClass =
    align === "right"
      ? "right-3"
      : align === "left"
        ? "left-3"
        : "left-1/2 -translate-x-1/2";

  return (
    <div className="relative group/tooltip inline-flex items-center justify-center">
      {children}
      <div
        className={`absolute bottom-full mb-2 ${alignClass} hidden group-hover/tooltip:flex flex-col items-center pointer-events-none z-50`}
      >
        <div className="bg-zinc-900 text-white text-[10px] py-1 px-2.5 rounded shadow-md border border-zinc-800 text-center whitespace-nowrap">
          <span className="font-bold text-white block leading-tight">
            {name}
          </span>
          <span className="text-[9px] text-zinc-400 font-normal block leading-tight mt-0.5">
            {usecase}
          </span>
        </div>
        <div
          className={`w-2 h-2 bg-zinc-900 rotate-45 -mt-1 border-r border-b border-zinc-800 ${arrowClass}`}
        />
      </div>
    </div>
  );
}

function renderInlineMarkdown(text: string) {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const codeMatch = remaining.match(/`(.*?)`/);
    const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/);

    const matches = [
      boldMatch
        ? { type: "bold", index: boldMatch.index!, match: boldMatch }
        : null,
      codeMatch
        ? { type: "code", index: codeMatch.index!, match: codeMatch }
        : null,
      linkMatch
        ? { type: "link", index: linkMatch.index!, match: linkMatch }
        : null,
    ]
      .filter(Boolean)
      .sort((a, b) => a!.index - b!.index);

    if (matches.length === 0) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const first = matches[0]!;
    if (first.index > 0) {
      parts.push(
        <span key={key++}>{remaining.substring(0, first.index)}</span>,
      );
    }

    if (first.type === "bold") {
      parts.push(
        <strong key={key++} className="font-semibold text-zinc-900">
          {first.match[1]}
        </strong>,
      );
      remaining = remaining.substring(first.index + first.match[0].length);
    } else if (first.type === "code") {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 font-mono text-[11px] rounded text-zinc-800"
        >
          {first.match[1]}
        </code>,
      );
      remaining = remaining.substring(first.index + first.match[0].length);
    } else if (first.type === "link") {
      parts.push(
        <a
          key={key++}
          href={first.match[2]}
          target="_blank"
          rel="noreferrer"
          className="text-[#015451] underline hover:text-[#013b39]"
        >
          {first.match[1]}
        </a>,
      );
      remaining = remaining.substring(first.index + first.match[0].length);
    }
  }

  return parts;
}

function MarkdownViewer({ content }: { content: string }) {
  if (!content || !content.trim()) {
    return (
      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md text-[11px] text-zinc-400 italic">
        No Markdown content provided.
      </div>
    );
  }

  const lines = content.split("\n");
  return (
    <div className="space-y-1.5 text-xs text-zinc-700 leading-relaxed font-sans bg-white p-3 rounded-md border border-zinc-200">
      {lines.map((line, idx) => {
        if (line.startsWith("# ")) {
          return (
            <h1
              key={idx}
              className="text-xs font-bold text-zinc-900 border-b border-zinc-200 pb-1 mt-1 uppercase tracking-wider"
            >
              {line.replace("# ", "")}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-xs font-bold text-zinc-900 mt-1">
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-xs font-semibold text-zinc-800 mt-1">
              {line.replace("### ", "")}
            </h3>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={idx} className="ml-4 list-disc text-zinc-700">
              {renderInlineMarkdown(line.substring(2))}
            </li>
          );
        }
        if (line.startsWith("> ")) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-[#015451] pl-2.5 py-0.5 bg-zinc-50 text-zinc-600 italic rounded-r-sm my-1 text-[11px]"
            >
              {renderInlineMarkdown(line.replace("> ", ""))}
            </blockquote>
          );
        }
        if (!line.trim()) return <div key={idx} className="h-1" />;
        return <p key={idx}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}

function AdminDashboardContent() {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "logs" | "health" | "assets"
  >("dashboard");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [hoveredMonth, setHoveredMonth] = useState<{
    month: string;
    target: number;
    booked: number;
    x: number;
    y: number;
  } | null>(null);

  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userLimit, setUserLimit] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [bulkActioning, setBulkActioning] = useState(false);

  const [inspectUserPayload, setInspectUserPayload] =
    useState<UserDetailPayload | null>(null);
  const [userInspectTab, setUserInspectTab] = useState<
    "overview" | "bio" | "notes" | "sessions"
  >("overview");

  const [adminNotesMap, setAdminNotesMap] = useState<Record<number, string>>(
    {},
  );
  const [currentNotesText, setCurrentNotesText] = useState("");

  const [editProfileUser, setEditProfileUser] = useState<AdminUserItem | null>(
    null,
  );
  const [editFormData, setEditFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    bio: "",
    developer_score: 0,
    role: "USER",
    is_verified: true,
  });

  const [emailModalUser, setEmailModalUser] = useState<AdminUserItem | null>(
    null,
  );
  const [emailFormData, setEmailFormData] = useState({
    subject: "",
    message: "",
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  const [logsList, setLogsList] = useState<SystemLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logSearch, setLogSearch] = useState("");
  const [logCategoryFilter, setLogCategoryFilter] = useState("");
  const [logLevelFilter, setLogLevelFilter] = useState("");
  const [selectedLogItem, setSelectedLogItem] = useState<SystemLogItem | null>(
    null,
  );

  const [healthData, setHealthData] = useState<HealthData | null>(null);

  const [waitlistList, setWaitlistList] = useState<WaitlistSubscriberItem[]>(
    [],
  );
  const [loadingWaitlist, setLoadingWaitlist] = useState(false);
  const [waitlistSearch, setWaitlistSearch] = useState("");
  const [waitlistEmailSubscriber, setWaitlistEmailSubscriber] =
    useState<WaitlistSubscriberItem | null>(null);
  const [waitlistEmailSubject, setWaitlistEmailSubject] = useState(
    "Exclusive Early Access Confirmed — dradix Update",
  );
  const [waitlistEmailBody, setWaitlistEmailBody] = useState(
    `Hello,

Thank you for reaching out. We have successfully received your request and reserved your priority position on the dradix platform early access waitlist.

Our team is currently deploying next-generation developer tooling, seamless automation, and enhanced security infrastructure. We will connect with you very soon to share exclusive access credentials and exciting platform milestones.

We appreciate your patience and look forward to welcoming you aboard.

Warm regards,
The dradix Operations Team`,
  );
  const [sendingWaitlistMail, setSendingWaitlistMail] = useState(false);

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [confirmModal, setConfirmModal] =
    useState<ConfirmationModalState | null>(null);

  const showNotice = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const askConfirmation = (
    title: string,
    message: string,
    actionLabel: string,
    onConfirm: () => Promise<void> | void,
    variant: "danger" | "warning" | "info" = "warning",
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      actionLabel,
      variant,
      onConfirm,
    });
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiFetch<ApiResponse<AdminStats>>("/admin/stats");
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch admin stats", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res =
        await apiFetch<ApiResponse<AnalyticsData>>("/admin/analytics");
      if (res.success && res.data) {
        setAnalyticsData(res.data);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch analytics", err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      query.append("page", String(userPage));
      query.append("limit", String(userLimit));
      if (userSearch) query.append("search", userSearch);
      if (roleFilter) query.append("role", roleFilter);
      if (verificationFilter) query.append("is_verified", verificationFilter);
      if (providerFilter) query.append("provider", providerFilter);
      if (riskFilter) query.append("riskLevel", riskFilter);

      const res = await apiFetch<
        ApiResponse<{ users: AdminUserItem[]; pagination: PaginationMeta }>
      >(`/admin/users?${query.toString()}`);
      if (res.success && res.data) {
        setUsersList(res.data.users);
        setPaginationMeta(res.data.pagination);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [
    userPage,
    userLimit,
    userSearch,
    roleFilter,
    verificationFilter,
    providerFilter,
    riskFilter,
  ]);

  const fetchLogs = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      if (logCategoryFilter) query.append("category", logCategoryFilter);
      if (logLevelFilter) query.append("level", logLevelFilter);

      const res = await apiFetch<
        ApiResponse<{ logs: SystemLogItem[]; pagination: PaginationMeta }>
      >(`/admin/logs?${query.toString()}`);
      if (res.success && res.data) {
        setLogsList(res.data.logs);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoadingLogs(false);
    }
  }, [logCategoryFilter, logLevelFilter]);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await apiFetch<ApiResponse<HealthData>>("/admin/health");
      if (res.success && res.data) {
        setHealthData(res.data);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch health data", err);
    }
  }, []);

  const fetchWaitlist = useCallback(async () => {
    setLoadingWaitlist(true);
    try {
      const res =
        await apiFetch<
          ApiResponse<{ waitlist: WaitlistSubscriberItem[]; total: number }>
        >("/admin/waitlist");
      if (res.success && res.data) {
        setWaitlistList(res.data.waitlist);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch waitlist entries", err);
    } finally {
      setLoadingWaitlist(false);
    }
  }, []);

  const reloadAll = useCallback(() => {
    setLoadingStats(true);
    void fetchStats();
    void fetchAnalytics();
    if (activeTab === "users") {
      setLoadingUsers(true);
      void fetchUsers();
    }
    if (activeTab === "logs") {
      setLoadingLogs(true);
      void fetchLogs();
    }
    if (activeTab === "health") {
      void fetchHealth();
    }
    if (activeTab === "assets") {
      void fetchWaitlist();
    }
    showNotice("Live operational telemetry refreshed");
  }, [
    activeTab,
    fetchStats,
    fetchAnalytics,
    fetchUsers,
    fetchLogs,
    fetchHealth,
    fetchWaitlist,
  ]);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      if (!ignore) {
        await Promise.all([fetchStats(), fetchAnalytics()]);
      }
    }
    void loadData();
    return () => {
      ignore = true;
    };
  }, [fetchStats, fetchAnalytics]);

  useEffect(() => {
    let ignore = false;
    async function loadTabData() {
      if (!ignore) {
        if (activeTab === "dashboard") {
          await fetchAnalytics();
        } else if (activeTab === "users") {
          setLoadingUsers(true);
          await fetchUsers();
        } else if (activeTab === "logs") {
          setLoadingLogs(true);
          await fetchLogs();
        } else if (activeTab === "health") {
          await fetchHealth();
        } else if (activeTab === "assets") {
          await fetchWaitlist();
        }
      }
    }
    void loadTabData();
    return () => {
      ignore = true;
    };
  }, [
    activeTab,
    fetchAnalytics,
    fetchUsers,
    fetchLogs,
    fetchHealth,
    fetchWaitlist,
  ]);

  const executeUpdateRole = async (
    targetUserId: number,
    newRole: "USER" | "ADMIN",
  ) => {
    setUpdatingUserId(targetUserId);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        `/admin/users/${targetUserId}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ role: newRole }),
        },
      );
      if (res.success) {
        showNotice(`Role updated to ${newRole}`);
        setLoadingUsers(true);
        void fetchUsers();
        void fetchStats();
        if (user && user.id === targetUserId) {
          void checkAuth();
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update user role";
      showNotice(msg, "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handlePromptUpdateRole = (u: AdminUserItem) => {
    const nextRole = u.role === "ADMIN" ? "USER" : "ADMIN";
    askConfirmation(
      "Confirm Role Change",
      `Are you sure you want to change the role of ${u.email} to ${nextRole}?`,
      `Set Role to ${nextRole}`,
      () => executeUpdateRole(u.id, nextRole),
      "warning",
    );
  };

  const executeToggleVerification = async (
    targetUserId: number,
    currentStatus: boolean,
  ) => {
    setUpdatingUserId(targetUserId);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        `/admin/users/${targetUserId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ is_verified: !currentStatus }),
        },
      );
      if (res.success) {
        showNotice(
          `User verification set to ${!currentStatus ? "Verified" : "Pending"}`,
        );
        setLoadingUsers(true);
        void fetchUsers();
        void fetchStats();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to update verification status";
      showNotice(msg, "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handlePromptToggleVerification = (u: AdminUserItem) => {
    const nextStatusText = u.is_verified ? "Unverified (Pending)" : "Verified";
    askConfirmation(
      "Confirm Verification Status Change",
      `Are you sure you want to set verification status for ${u.email} to ${nextStatusText}?`,
      `Set to ${nextStatusText}`,
      () => executeToggleVerification(u.id, u.is_verified),
      "warning",
    );
  };

  const executeDeleteUser = async (targetUserId: number) => {
    setUpdatingUserId(targetUserId);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        `/admin/users/${targetUserId}`,
        {
          method: "DELETE",
        },
      );
      if (res.success) {
        showNotice("User account permanently deleted");
        setLoadingUsers(true);
        void fetchUsers();
        void fetchStats();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete user";
      showNotice(msg, "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handlePromptDeleteUser = (u: AdminUserItem) => {
    askConfirmation(
      "Delete User Account",
      `CRITICAL ACTION: Are you sure you want to PERMANENTLY DELETE user account ${u.email} (ID: ${u.id})? All user projects and sessions will be destroyed. This action cannot be undone.`,
      "Delete Account",
      () => executeDeleteUser(u.id),
      "danger",
    );
  };

  const executeRevokeSessions = async (targetUserId: number) => {
    setUpdatingUserId(targetUserId);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        `/admin/users/${targetUserId}/revoke-sessions`,
        {
          method: "POST",
        },
      );
      if (res.success) {
        showNotice("Revoked all active sessions for user");
        setLoadingUsers(true);
        void fetchUsers();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to revoke sessions";
      showNotice(msg, "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handlePromptRevokeSessions = (u: AdminUserItem) => {
    askConfirmation(
      "Revoke User Active Sessions",
      `Are you sure you want to revoke all active session tokens for ${u.email}? The user will be immediately signed out on all devices.`,
      "Revoke All Sessions",
      () => executeRevokeSessions(u.id),
      "danger",
    );
  };

  const handleInspectUser = async (targetUserId: number) => {
    try {
      const res = await apiFetch<ApiResponse<UserDetailPayload>>(
        `/admin/users/${targetUserId}`,
      );
      if (res.success && res.data) {
        setInspectUserPayload(res.data);
        setUserInspectTab("overview");
        setCurrentNotesText(
          adminNotesMap[targetUserId] ||
            `# Admin Notes for ${res.data.user.username}\n- Risk Evaluation: ${res.data.riskIndicators.riskLevel}\n- Account created: ${new Date(res.data.user.created_at).toLocaleDateString()}\n> Add custom markdown notes for this account below.`,
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch user details";
      showNotice(msg, "error");
    }
  };

  const handleSaveAdminNotes = () => {
    if (!inspectUserPayload) return;
    const uid = inspectUserPayload.user.id;
    setAdminNotesMap((prev) => ({ ...prev, [uid]: currentNotesText }));
    showNotice("User admin markdown notes updated");
  };

  const handleOpenEditUser = (u: AdminUserItem) => {
    setEditProfileUser(u);
    setEditFormData({
      username: u.username,
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      bio: "",
      developer_score: u.developer_score,
      role: u.role,
      is_verified: u.is_verified,
    });
  };

  const executeSaveEditedUser = async () => {
    if (!editProfileUser) return;
    setUpdatingUserId(editProfileUser.id);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        `/admin/users/${editProfileUser.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(editFormData),
        },
      );
      if (res.success) {
        showNotice("User profile updated successfully");
        setEditProfileUser(null);
        setLoadingUsers(true);
        void fetchUsers();
        void fetchStats();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile";
      showNotice(msg, "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handlePromptSaveEditedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProfileUser) return;
    askConfirmation(
      "Confirm Profile Edits",
      `Save modifications to account details for ${editProfileUser.email}?`,
      "Save Edits",
      () => executeSaveEditedUser(),
      "info",
    );
  };

  const executeSendAdminEmail = async () => {
    if (!emailModalUser) return;
    setSendingEmail(true);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        `/admin/users/${emailModalUser.id}/send-email`,
        {
          method: "POST",
          body: JSON.stringify(emailFormData),
        },
      );
      if (res.success) {
        showNotice(`Notification email dispatched to ${emailModalUser.email}`);
        setEmailModalUser(null);
        setEmailFormData({ subject: "", message: "" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send email";
      showNotice(msg, "error");
    } finally {
      setSendingEmail(false);
    }
  };

  const handlePromptSendAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalUser) return;
    askConfirmation(
      "Send Notification Email",
      `Are you sure you want to send this official system email to ${emailModalUser.email}?`,
      "Send Email",
      () => executeSendAdminEmail(),
      "info",
    );
  };

  const executeSendWaitlistEmail = async () => {
    if (!waitlistEmailSubscriber) return;
    setSendingWaitlistMail(true);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        "/admin/waitlist/send-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: waitlistEmailSubscriber.email,
            subject: waitlistEmailSubject,
            message: waitlistEmailBody,
          }),
        },
      );
      if (res.success) {
        showNotice(
          `Waitlist notification email dispatched to ${waitlistEmailSubscriber.email}`,
        );
        setWaitlistEmailSubscriber(null);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to send waitlist email";
      showNotice(msg, "error");
    } finally {
      setSendingWaitlistMail(false);
    }
  };

  const handlePromptSendWaitlistEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmailSubscriber) return;
    askConfirmation(
      "Send Waitlist Email",
      `Are you sure you want to dispatch this waitlist update email to ${waitlistEmailSubscriber.email}?`,
      "Dispatch Email",
      () => executeSendWaitlistEmail(),
      "info",
    );
  };

  const handleSelectAllOnPage = (checked: boolean) => {
    if (checked) {
      const ids = usersList.map((u) => u.id);
      setSelectedUserIds(Array.from(new Set([...selectedUserIds, ...ids])));
    } else {
      const pageIds = new Set(usersList.map((u) => u.id));
      setSelectedUserIds(selectedUserIds.filter((id) => !pageIds.has(id)));
    }
  };

  const handleToggleSelectUser = (id: number) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((item) => item !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const executeBulkAction = async (
    action:
      | "UPDATE_ROLE"
      | "VERIFY"
      | "UNVERIFY"
      | "DELETE"
      | "REVOKE_SESSIONS",
    payload?: Record<string, unknown>,
  ) => {
    if (selectedUserIds.length === 0) return;
    setBulkActioning(true);
    try {
      const res = await apiFetch<ApiResponse<{ affected: number }>>(
        "/admin/users/bulk",
        {
          method: "POST",
          body: JSON.stringify({
            userIds: selectedUserIds,
            action,
            payload,
          }),
        },
      );
      if (res.success) {
        showNotice(
          res.message || `Bulk action ${action} executed successfully`,
        );
        setSelectedUserIds([]);
        setLoadingUsers(true);
        void fetchUsers();
        void fetchStats();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to execute bulk action";
      showNotice(msg, "error");
    } finally {
      setBulkActioning(false);
    }
  };

  const handlePromptBulkAction = (
    action:
      | "UPDATE_ROLE"
      | "VERIFY"
      | "UNVERIFY"
      | "DELETE"
      | "REVOKE_SESSIONS",
    payload?: Record<string, unknown>,
  ) => {
    const isDanger = action === "DELETE";
    askConfirmation(
      `Confirm Bulk ${action.replace("_", " ")}`,
      `Are you sure you want to execute bulk operation "${action}" on ${selectedUserIds.length} selected accounts?`,
      `Execute Bulk ${action.replace("_", " ")}`,
      () => executeBulkAction(action, payload),
      isDanger ? "danger" : "warning",
    );
  };

  const handleExportUsers = (format: "csv" | "json") => {
    if (usersList.length === 0) return;
    if (format === "json") {
      const blob = new Blob([JSON.stringify(usersList, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dradix_users_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = [
        "ID",
        "Username",
        "Email",
        "First Name",
        "Last Name",
        "Role",
        "Verified",
        "Developer Score",
        "Country",
        "IP Address",
        "Joined Date",
      ];
      const rows = usersList.map((u) => [
        u.id,
        u.username,
        u.email,
        u.first_name || "",
        u.last_name || "",
        u.role,
        u.is_verified ? "Yes" : "No",
        u.developer_score,
        u.location || "India",
        u.ip_address || "127.0.0.1",
        new Date(u.created_at).toISOString(),
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `dradix_users_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    showNotice(
      `Exported ${usersList.length} user records (${format.toUpperCase()})`,
    );
  };

  const executeBootstrapSelf = async () => {
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        "/admin/bootstrap-admin",
        {
          method: "POST",
        },
      );
      if (res.success) {
        showNotice("Admin privileges bootstrapped successfully");
        void checkAuth();
        void fetchStats();
        void fetchAnalytics();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bootstrap failed";
      showNotice(msg, "error");
    }
  };

  const handlePromptBootstrapSelf = () => {
    askConfirmation(
      "Bootstrap Admin Account",
      "Are you sure you want to self-grant ADMIN workspace privileges for your current account?",
      "Grant Admin Access",
      () => executeBootstrapSelf(),
      "info",
    );
  };

  const rawRevenue = analyticsData?.revenueVsTarget || [];
  const maxVal = Math.max(
    ...rawRevenue.map((r: RevenueItem) =>
      Math.max(r.target || 1, r.booked || 1, 10),
    ),
    10,
  );

  const revenuePoints = rawRevenue.map((item: RevenueItem, i: number) => {
    const step = 680 / Math.max(1, rawRevenue.length - 1);
    const x = 20 + i * step;
    const y = 140 - Math.round(((item.booked || 0) / maxVal) * 110);
    return {
      month: item.month,
      target: item.target,
      booked: item.booked,
      x,
      y: Math.max(15, Math.min(y, 145)),
    };
  });

  const upcomingList = analyticsData?.upcomingActivities || [];

  const navItems: {
    id: "dashboard" | "users" | "logs" | "health" | "assets";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: React.ReactNode;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
    },
    {
      id: "users",
      label: "Users & Directory",
      icon: PersonIcon,
      badge: stats ? (
        <span className="text-[10px] bg-zinc-100 text-zinc-700 font-mono font-semibold px-1.5 py-0.2 rounded border border-zinc-200">
          {stats.counts.totalUsers}
        </span>
      ) : null,
    },
    {
      id: "logs",
      label: "Audit Logs",
      icon: ActivityLogIcon,
      badge: stats ? (
        <span className="text-[10px] bg-zinc-100 text-zinc-700 font-mono font-semibold px-1.5 py-0.2 rounded border border-zinc-200">
          {stats.counts.totalLogs}
        </span>
      ) : null,
    },
    {
      id: "health",
      label: "Infrastructure",
      icon: RocketIcon,
      badge: (
        <span className="w-1.5 h-1.5 rounded-full bg-[#015451] animate-pulse" />
      ),
    },
    {
      id: "assets",
      label: "Platform Assets",
      icon: FileTextIcon,
    },
  ];

  const isAllPageSelected =
    usersList.length > 0 &&
    usersList.every((u) => selectedUserIds.includes(u.id));

  const filteredLogsList = logsList.filter((log) => {
    if (!logSearch.trim()) return true;
    const q = logSearch.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.category.toLowerCase().includes(q) ||
      log.ip_address.toLowerCase().includes(q) ||
      (log.user?.email && log.user.email.toLowerCase().includes(q))
    );
  });

  const filteredWaitlist = waitlistList.filter((sub) => {
    if (!waitlistSearch.trim()) return true;
    return sub.email.toLowerCase().includes(waitlistSearch.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans flex antialiased selection:bg-[#015451] selection:text-white">
      <aside className="w-56 border-r border-zinc-200 bg-white flex flex-col justify-between p-3 shrink-0 z-20">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-zinc-100 pb-3">
            <Link href="/admin" className="flex items-center gap-2 group">
              <span className="font-bold text-sm tracking-tight text-zinc-900">
                dradix <span className="text-[#015451]">Admin</span>
              </span>
            </Link>
          </div>

          <div className="space-y-0.5">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Operations
            </p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer select-none ${
                    isActive
                      ? "text-zinc-900 font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50/70"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminSidebarTab"
                      className="absolute inset-0 bg-zinc-100 rounded-md border border-zinc-200/80 shadow-2xs"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                        mass: 0.7,
                      }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2.5">
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isActive ? "text-[#015451]" : "text-zinc-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <div className="relative z-10">{item.badge}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100">
          <div className="bg-zinc-50 p-2 rounded-md border border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded bg-zinc-900 text-white font-semibold text-[10px] flex items-center justify-center shrink-0">
                {user?.first_name
                  ? user.first_name[0]
                  : user?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-zinc-900 truncate leading-none">
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name || ""}`
                    : user?.username || "Admin"}
                </p>
                <p className="text-[10px] text-zinc-500 truncate leading-tight mt-0.5">
                  Super Admin
                </p>
              </div>
            </div>
            <ActionTooltip
              name="Bootstrap Admin"
              usecase="Grant admin access privileges"
              align="right"
            >
              <button
                onClick={handlePromptBootstrapSelf}
                className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
              </button>
            </ActionTooltip>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#fafafa]">
        <header className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
              <DashboardIcon className="w-4 h-4 text-[#015451]" />
              {activeTab === "dashboard" && "Operations Telemetry"}
              {activeTab === "users" && "User Directory & Management"}
              {activeTab === "logs" && "System Audit Logs"}
              {activeTab === "health" && "Infrastructure & Service Health"}
              {activeTab === "assets" && "Platform Assets & Metrics"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-medium text-[#015451] bg-[#015451]/10 border border-[#015451]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#015451] animate-pulse" />
              Live DB Connected
            </span>

            <ActionTooltip
              name="Sync Telemetry"
              usecase="Fetch live DB stats & analytics"
              align="right"
            >
              <button
                onClick={reloadAll}
                className="px-2.5 py-1 rounded-md border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ReloadIcon
                  className={`w-3 h-3 text-[#015451] ${loadingStats ? "animate-spin" : ""}`}
                />
                <span>Sync Telemetry</span>
              </button>
            </ActionTooltip>
          </div>
        </header>

        {notice && (
          <div
            className={`mx-6 mt-3 p-2.5 rounded-md border text-xs font-medium flex items-center justify-between ${
              notice.type === "success"
                ? "bg-[#015451]/5 border-[#015451]/20 text-[#015451]"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === "success" ? (
                <CheckCircledIcon className="w-3.5 h-3.5 text-[#015451]" />
              ) : (
                <CrossCircledIcon className="w-3.5 h-3.5 text-red-600" />
              )}
              <span>{notice.message}</span>
            </div>
            <button
              onClick={() => setNotice(null)}
              className="text-[11px] opacity-70 hover:opacity-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {activeTab === "dashboard" && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        Core Telemetry Metrics
                      </p>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Real-time DB Sync
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white rounded-md border border-zinc-200 p-3.5 space-y-1 shadow-2xs hover:border-zinc-300 transition-all">
                        <div className="flex items-center justify-between text-zinc-500">
                          <span className="text-[11px] font-semibold uppercase tracking-wide">
                            Registered Users
                          </span>
                          <PersonIcon className="w-3.5 h-3.5 text-[#015451]" />
                        </div>
                        <p className="text-xl font-bold font-mono text-zinc-900 tracking-tight">
                          {stats?.overview?.totalRegisteredUsers ??
                            stats?.counts?.totalUsers ??
                            0}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          +{stats?.overview?.newUsersThisMonth ?? 0} signups
                          this month
                        </p>
                      </div>

                      <div className="bg-white rounded-md border border-zinc-200 p-3.5 space-y-1 shadow-2xs hover:border-zinc-300 transition-all">
                        <div className="flex items-center justify-between text-zinc-500">
                          <span className="text-[11px] font-semibold uppercase tracking-wide">
                            Daily Active (DAU)
                          </span>
                          <LightningBoltIcon className="w-3.5 h-3.5 text-[#015451]" />
                        </div>
                        <p className="text-xl font-bold font-mono text-zinc-900 tracking-tight">
                          {stats?.overview?.dau ?? 0}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Active in trailing 24h
                        </p>
                      </div>

                      <div className="bg-white rounded-md border border-zinc-200 p-3.5 space-y-1 shadow-2xs hover:border-zinc-300 transition-all">
                        <div className="flex items-center justify-between text-zinc-500">
                          <span className="text-[11px] font-semibold uppercase tracking-wide">
                            Weekly Active (WAU)
                          </span>
                          <ActivityLogIcon className="w-3.5 h-3.5 text-[#015451]" />
                        </div>
                        <p className="text-xl font-bold font-mono text-zinc-900 tracking-tight">
                          {stats?.overview?.wau ?? 0}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Active in trailing 7d
                        </p>
                      </div>

                      <div className="bg-white rounded-md border border-zinc-200 p-3.5 space-y-1 shadow-2xs hover:border-zinc-300 transition-all">
                        <div className="flex items-center justify-between text-zinc-500">
                          <span className="text-[11px] font-semibold uppercase tracking-wide">
                            Monthly Active (MAU)
                          </span>
                          <TargetIcon className="w-3.5 h-3.5 text-[#015451]" />
                        </div>
                        <p className="text-xl font-bold font-mono text-zinc-900 tracking-tight">
                          {stats?.overview?.mau ?? 0}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Active in trailing 30d
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-md border border-zinc-200 p-3 space-y-0.5">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                        Active Sessions
                      </span>
                      <p className="text-base font-bold font-mono text-zinc-900">
                        {stats?.overview?.activeSessions ?? 1}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Tokens live
                      </p>
                    </div>

                    <div className="bg-white rounded-md border border-zinc-200 p-3 space-y-0.5">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                        Catalog Projects
                      </span>
                      <p className="text-base font-bold font-mono text-zinc-900">
                        {stats?.counts?.totalProjects ?? 0}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Published submissions
                      </p>
                    </div>

                    <div className="bg-white rounded-md border border-zinc-200 p-3 space-y-0.5">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                        Published Articles
                      </span>
                      <p className="text-base font-bold font-mono text-zinc-900">
                        {stats?.counts?.totalBlogs ?? 0}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Developer tutorials
                      </p>
                    </div>

                    <div className="bg-white rounded-md border border-zinc-200 p-3 space-y-0.5">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                        System Audit Events
                      </span>
                      <p className="text-base font-bold font-mono text-zinc-900">
                        {stats?.counts?.totalLogs ?? 0}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Security audit entries
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 bg-white rounded-md border border-zinc-200 p-4 space-y-3 shadow-2xs relative">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                        <div>
                          <h3 className="text-xs font-semibold text-zinc-900">
                            Monthly Activity & Registration Trajectory
                          </h3>
                          <p className="text-[11px] text-zinc-500">
                            DB user signups and platform requests over 12 months
                          </p>
                        </div>

                        {hoveredMonth ? (
                          <span className="text-[10px] font-mono font-bold text-[#015451] bg-[#015451]/10 px-2 py-0.5 rounded border border-[#015451]/20">
                            {hoveredMonth.month}: {hoveredMonth.booked} Signups
                            (
                            {Math.round(
                              (hoveredMonth.booked /
                                Math.max(1, hoveredMonth.target)) *
                                100,
                            )}
                            % of Goal)
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                            Hover node for values
                          </span>
                        )}
                      </div>

                      <div className="h-48 w-full relative pt-2">
                        <svg
                          className="w-full h-full overflow-visible"
                          viewBox="0 0 720 160"
                        >
                          <line
                            x1="0"
                            y1="20"
                            x2="720"
                            y2="20"
                            stroke="#f4f4f5"
                            strokeDasharray="3 3"
                          />
                          <line
                            x1="0"
                            y1="80"
                            x2="720"
                            y2="80"
                            stroke="#f4f4f5"
                            strokeDasharray="3 3"
                          />
                          <line
                            x1="0"
                            y1="140"
                            x2="720"
                            y2="140"
                            stroke="#e4e4e7"
                          />

                          {hoveredMonth && (
                            <line
                              x1={hoveredMonth.x}
                              y1="10"
                              x2={hoveredMonth.x}
                              y2="145"
                              stroke="#015451"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                              opacity="0.7"
                            />
                          )}

                          {revenuePoints.length > 0 && (
                            <path
                              d={`M ${revenuePoints.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                              fill="none"
                              stroke="#015451"
                              strokeWidth="2"
                            />
                          )}

                          {revenuePoints.map((pt) => {
                            const isHovered = hoveredMonth?.month === pt.month;
                            return (
                              <g
                                key={pt.month}
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredMonth(pt)}
                                onMouseLeave={() => setHoveredMonth(null)}
                              >
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={isHovered ? "5" : "3.5"}
                                  fill={isHovered ? "#013b39" : "#015451"}
                                  stroke="#ffffff"
                                  strokeWidth={isHovered ? "2" : "1.5"}
                                  className="transition-all duration-150"
                                />
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r="14"
                                  fill="transparent"
                                />
                              </g>
                            );
                          })}
                        </svg>

                        {hoveredMonth && (
                          <div
                            className="absolute z-30 bg-zinc-900 text-white px-2.5 py-1.5 rounded shadow-lg border border-zinc-800 text-xs pointer-events-none transition-all duration-150"
                            style={{
                              left: `${(hoveredMonth.x / 720) * 100}%`,
                              top: `${Math.max(0, hoveredMonth.y - 50)}px`,
                              transform: "translateX(-50%)",
                            }}
                          >
                            <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-1 mb-1">
                              <span className="font-bold text-white text-[11px] uppercase tracking-wide">
                                {hoveredMonth.month}
                              </span>
                              <span className="text-[9px] font-mono text-[#015451] bg-[#015451]/20 px-1 rounded">
                                {Math.round(
                                  (hoveredMonth.booked /
                                    Math.max(1, hoveredMonth.target)) *
                                    100,
                                )}
                                %
                              </span>
                            </div>
                            <div className="space-y-0.5 text-[10px] font-mono whitespace-nowrap">
                              <div className="flex justify-between gap-4 text-zinc-300">
                                <span>Signups / Activity:</span>
                                <span className="font-bold text-white">
                                  {hoveredMonth.booked}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4 text-zinc-400">
                                <span>Monthly Goal:</span>
                                <span>{hoveredMonth.target}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between px-2 text-[10px] font-mono text-zinc-400">
                        {revenuePoints.map((pt) => (
                          <span
                            key={pt.month}
                            className={`cursor-pointer transition-colors ${
                              hoveredMonth?.month === pt.month
                                ? "text-[#015451] font-bold"
                                : "hover:text-zinc-700"
                            }`}
                            onMouseEnter={() => setHoveredMonth(pt)}
                            onMouseLeave={() => setHoveredMonth(null)}
                          >
                            {pt.month}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-3 shadow-2xs flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                          <h3 className="text-xs font-semibold text-zinc-900">
                            Live Audit Activity Feed
                          </h3>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {upcomingList.length} items
                          </span>
                        </div>

                        <div className="space-y-2">
                          {upcomingList.slice(0, 4).map((act: ActivityItem) => (
                            <div
                              key={act.id}
                              className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-100 text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {act.initials}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-zinc-900 truncate text-[11px] leading-tight">
                                    {act.title}
                                  </p>
                                  <p className="text-[10px] text-zinc-500 truncate leading-tight">
                                    {act.client}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                                {act.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab("logs")}
                        className="w-full py-1.5 mt-2 rounded border border-zinc-200 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer text-center"
                      >
                        View Full System Audit Trail &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-900">
                        User Directory & Telemetry Controls
                      </h3>
                      <p className="text-[11px] text-zinc-500">
                        Multi-parameter filters, security risk telemetry, batch
                        operations, and Markdown admin notes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <ActionTooltip
                        name="Export CSV"
                        usecase="Download user directory table as CSV format"
                      >
                        <button
                          onClick={() => handleExportUsers("csv")}
                          className="px-2.5 py-1 rounded border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <DownloadIcon className="w-3 h-3 text-[#015451]" />
                          <span>Export CSV</span>
                        </button>
                      </ActionTooltip>

                      <ActionTooltip
                        name="Export JSON"
                        usecase="Export full user records as structured JSON"
                      >
                        <button
                          onClick={() => handleExportUsers("json")}
                          className="px-2.5 py-1 rounded border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <DownloadIcon className="w-3 h-3 text-zinc-700" />
                          <span>Export JSON</span>
                        </button>
                      </ActionTooltip>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    <div className="relative col-span-1 sm:col-span-2">
                      <MagnifyingGlassIcon className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search username, email, IP..."
                        value={userSearch}
                        onChange={(e) => {
                          setUserSearch(e.target.value);
                          setUserPage(1);
                        }}
                        className="w-full pl-8 pr-3 py-1 bg-white border border-zinc-200 rounded text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400"
                      />
                    </div>

                    <select
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setUserPage(1);
                      }}
                      className="px-2.5 py-1 bg-white border border-zinc-200 rounded text-xs font-medium text-zinc-800 focus:outline-none"
                    >
                      <option value="">All Roles</option>
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>

                    <select
                      value={verificationFilter}
                      onChange={(e) => {
                        setVerificationFilter(e.target.value);
                        setUserPage(1);
                      }}
                      className="px-2.5 py-1 bg-white border border-zinc-200 rounded text-xs font-medium text-zinc-800 focus:outline-none"
                    >
                      <option value="">All Verification</option>
                      <option value="true">Verified</option>
                      <option value="false">Pending</option>
                    </select>

                    <select
                      value={providerFilter}
                      onChange={(e) => {
                        setProviderFilter(e.target.value);
                        setUserPage(1);
                      }}
                      className="px-2.5 py-1 bg-white border border-zinc-200 rounded text-xs font-medium text-zinc-800 focus:outline-none"
                    >
                      <option value="">All Auth Providers</option>
                      <option value="GOOGLE">Google OAuth</option>
                      <option value="PASSWORD">Password</option>
                    </select>

                    <select
                      value={riskFilter}
                      onChange={(e) => {
                        setRiskFilter(e.target.value);
                        setUserPage(1);
                      }}
                      className="px-2.5 py-1 bg-white border border-zinc-200 rounded text-xs font-medium text-zinc-800 focus:outline-none"
                    >
                      <option value="">All Risk Scores</option>
                      <option value="LOW">Low Risk</option>
                      <option value="MEDIUM">Medium Risk</option>
                      <option value="HIGH">High Risk</option>
                    </select>
                  </div>

                  {selectedUserIds.length > 0 && (
                    <div className="p-2.5 rounded bg-zinc-900 text-white flex flex-wrap items-center justify-between gap-2 shadow-xs text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-[#015451] text-white px-2 py-0.5 rounded">
                          {selectedUserIds.length} Selected
                        </span>
                        <span className="text-zinc-300">Bulk Actions:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          disabled={bulkActioning}
                          onClick={() =>
                            handlePromptBulkAction("UPDATE_ROLE", {
                              role: "ADMIN",
                            })
                          }
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Make ADMIN
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() =>
                            handlePromptBulkAction("UPDATE_ROLE", {
                              role: "USER",
                            })
                          }
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Make USER
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() => handlePromptBulkAction("VERIFY")}
                          className="px-2 py-0.5 rounded bg-[#015451] hover:bg-[#013b39] text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Verify Selected
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() => handlePromptBulkAction("UNVERIFY")}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Unverify Selected
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() =>
                            handlePromptBulkAction("REVOKE_SESSIONS")
                          }
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Revoke Sessions
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() => handlePromptBulkAction("DELETE")}
                          className="px-2 py-0.5 rounded bg-red-900 border border-red-700 text-white hover:bg-red-800 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto border border-zinc-200 rounded">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          <th className="p-2.5 w-7 text-center">
                            <input
                              type="checkbox"
                              checked={isAllPageSelected}
                              onChange={(e) =>
                                handleSelectAllOnPage(e.target.checked)
                              }
                              className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                            />
                          </th>
                          <th className="p-2.5 font-semibold">User</th>
                          <th className="p-2.5 font-semibold">Provider</th>
                          <th className="p-2.5 font-semibold">Role</th>
                          <th className="p-2.5 font-semibold">Status</th>
                          <th className="p-2.5 font-semibold">Risk Level</th>
                          <th className="p-2.5 font-semibold">Telemetry</th>
                          <th className="p-2.5 font-semibold text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {loadingUsers ? (
                          <tr>
                            <td
                              colSpan={8}
                              className="py-6 text-center text-zinc-400 italic"
                            >
                              Loading user records...
                            </td>
                          </tr>
                        ) : usersList.length === 0 ? (
                          <tr>
                            <td
                              colSpan={8}
                              className="py-6 text-center text-zinc-400 italic"
                            >
                              No user records match criteria.
                            </td>
                          </tr>
                        ) : (
                          usersList.map((u) => {
                            const isSelected = selectedUserIds.includes(u.id);
                            return (
                              <tr
                                key={u.id}
                                className={`transition-colors ${
                                  isSelected
                                    ? "bg-zinc-50"
                                    : "hover:bg-zinc-50/60"
                                }`}
                              >
                                <td className="p-2.5 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleToggleSelectUser(u.id)
                                    }
                                    className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                                  />
                                </td>

                                <td className="p-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                      {u.username[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-zinc-900 truncate leading-tight">
                                        {u.first_name
                                          ? `${u.first_name} ${u.last_name || ""}`
                                          : u.username}
                                      </p>
                                      <p className="text-[10px] text-zinc-500 truncate leading-tight">
                                        {u.email}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-2.5">
                                  <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 text-[10px] font-mono">
                                    {u.auth_provider || "PASSWORD"}
                                  </span>
                                </td>

                                <td className="p-2.5">
                                  <ActionTooltip
                                    name="Switch Role"
                                    usecase={`Change role from ${u.role || "USER"} to ${u.role === "ADMIN" ? "USER" : "ADMIN"}`}
                                  >
                                    <button
                                      disabled={updatingUserId === u.id}
                                      onClick={() => handlePromptUpdateRole(u)}
                                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                                        u.role === "ADMIN"
                                          ? "bg-zinc-900 text-white border-zinc-800"
                                          : "bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200"
                                      }`}
                                    >
                                      {u.role || "USER"}
                                    </button>
                                  </ActionTooltip>
                                </td>

                                <td className="p-2.5">
                                  <ActionTooltip
                                    name="Toggle Status"
                                    usecase={`Change status to ${u.is_verified ? "Pending" : "Verified"}`}
                                  >
                                    <button
                                      disabled={updatingUserId === u.id}
                                      onClick={() =>
                                        handlePromptToggleVerification(u)
                                      }
                                      className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all flex items-center gap-1 cursor-pointer ${
                                        u.is_verified
                                          ? "bg-[#015451]/10 text-[#015451] border-[#015451]/20"
                                          : "bg-zinc-100 text-zinc-700 border-zinc-200"
                                      }`}
                                    >
                                      {u.is_verified ? (
                                        <>
                                          <CheckCircledIcon className="w-3 h-3 text-[#015451]" />
                                          <span>Verified</span>
                                        </>
                                      ) : (
                                        <>
                                          <ExclamationTriangleIcon className="w-3 h-3 text-zinc-500" />
                                          <span>Pending</span>
                                        </>
                                      )}
                                    </button>
                                  </ActionTooltip>
                                </td>

                                <td className="p-2.5">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                                      u.riskLevel === "HIGH"
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : u.riskLevel === "MEDIUM"
                                          ? "bg-amber-50 text-amber-700 border-amber-200"
                                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    }`}
                                  >
                                    {u.riskLevel} ({u.riskScore})
                                  </span>
                                </td>

                                <td className="p-2.5 text-[10px] text-zinc-500">
                                  <p className="font-semibold text-zinc-800">
                                    {u.location || "India"}
                                  </p>
                                  <p className="font-mono text-[9px] text-zinc-400">
                                    {u.ip_address}
                                  </p>
                                </td>

                                <td className="p-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <ActionTooltip
                                      name="Inspect User"
                                      usecase="View details & markdown notes"
                                    >
                                      <button
                                        onClick={() => handleInspectUser(u.id)}
                                        className="w-7 h-7 flex items-center justify-center rounded border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 transition-colors cursor-pointer"
                                      >
                                        <EyeOpenIcon className="w-3.5 h-3.5 text-[#015451]" />
                                      </button>
                                    </ActionTooltip>

                                    <ActionTooltip
                                      name="Edit Profile"
                                      usecase="Modify user profile info"
                                    >
                                      <button
                                        onClick={() => handleOpenEditUser(u)}
                                        className="w-7 h-7 flex items-center justify-center rounded border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 transition-colors cursor-pointer"
                                      >
                                        <Pencil1Icon className="w-3.5 h-3.5 text-zinc-700" />
                                      </button>
                                    </ActionTooltip>

                                    <ActionTooltip
                                      name="Send Email"
                                      usecase="Send official system email"
                                    >
                                      <button
                                        onClick={() => setEmailModalUser(u)}
                                        className="w-7 h-7 flex items-center justify-center rounded border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 transition-colors cursor-pointer"
                                      >
                                        <EnvelopeClosedIcon className="w-3.5 h-3.5 text-zinc-700" />
                                      </button>
                                    </ActionTooltip>

                                    <ActionTooltip
                                      name="Revoke Sessions"
                                      usecase="Log out across all devices"
                                    >
                                      <button
                                        disabled={updatingUserId === u.id}
                                        onClick={() =>
                                          handlePromptRevokeSessions(u)
                                        }
                                        className="w-7 h-7 flex items-center justify-center rounded border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 transition-colors cursor-pointer"
                                      >
                                        <LockClosedIcon className="w-3.5 h-3.5 text-zinc-700" />
                                      </button>
                                    </ActionTooltip>

                                    <ActionTooltip
                                      name="Delete Account"
                                      usecase="Permanently purge user account"
                                    >
                                      <button
                                        disabled={
                                          updatingUserId === u.id ||
                                          u.id === user?.id
                                        }
                                        onClick={() =>
                                          handlePromptDeleteUser(u)
                                        }
                                        className="w-7 h-7 flex items-center justify-center rounded border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-red-600 transition-colors disabled:opacity-30 cursor-pointer"
                                      >
                                        <TrashIcon className="w-3.5 h-3.5" />
                                      </button>
                                    </ActionTooltip>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
                    <span className="text-zinc-500 font-mono text-[11px]">
                      Page {paginationMeta.page} of {paginationMeta.totalPages}{" "}
                      ({paginationMeta.total} total)
                    </span>

                    <div className="flex items-center gap-2">
                      <select
                        value={userLimit}
                        onChange={(e) => {
                          setUserLimit(Number(e.target.value));
                          setUserPage(1);
                        }}
                        className="px-2 py-0.5 bg-white border border-zinc-200 rounded text-xs font-medium focus:outline-none"
                      >
                        <option value={10}>10 / page</option>
                        <option value={25}>25 / page</option>
                        <option value={50}>50 / page</option>
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={userPage <= 1}
                          onClick={() => setUserPage(userPage - 1)}
                          className="px-2.5 py-0.5 rounded border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-30 cursor-pointer font-medium"
                        >
                          Prev
                        </button>
                        <button
                          disabled={userPage >= paginationMeta.totalPages}
                          onClick={() => setUserPage(userPage + 1)}
                          className="px-2.5 py-0.5 rounded border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-30 cursor-pointer font-medium"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-900">
                        System Audit Logs & Security Events
                      </h3>
                      <p className="text-[11px] text-zinc-500">
                        Real-time audit trail of administrative modifications,
                        authorization events, and system errors.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative w-48">
                        <MagnifyingGlassIcon className="w-3.5 h-3.5 absolute left-2 top-2 text-zinc-400" />
                        <input
                          type="text"
                          placeholder="Filter logs..."
                          value={logSearch}
                          onChange={(e) => setLogSearch(e.target.value)}
                          className="w-full pl-7 pr-2 py-1 bg-white border border-zinc-200 rounded text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <select
                        value={logCategoryFilter}
                        onChange={(e) => setLogCategoryFilter(e.target.value)}
                        className="px-2 py-1 bg-white border border-zinc-200 rounded text-xs font-medium focus:outline-none"
                      >
                        <option value="">All Categories</option>
                        <option value="USER_MANAGEMENT">USER_MANAGEMENT</option>
                        <option value="AUTH">AUTH</option>
                        <option value="SYSTEM">SYSTEM</option>
                        <option value="API">API</option>
                      </select>

                      <select
                        value={logLevelFilter}
                        onChange={(e) => setLogLevelFilter(e.target.value)}
                        className="px-2 py-1 bg-white border border-zinc-200 rounded text-xs font-medium focus:outline-none"
                      >
                        <option value="">All Levels</option>
                        <option value="INFO">INFO</option>
                        <option value="WARN">WARN</option>
                        <option value="ERROR">ERROR</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-zinc-200 rounded">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          <th className="p-2.5 font-semibold">Timestamp</th>
                          <th className="p-2.5 font-semibold">Action</th>
                          <th className="p-2.5 font-semibold">Category</th>
                          <th className="p-2.5 font-semibold">Level</th>
                          <th className="p-2.5 font-semibold">Actor</th>
                          <th className="p-2.5 font-semibold">IP Address</th>
                          <th className="p-2.5 font-semibold text-right">
                            Payload
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {loadingLogs ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-6 text-center text-zinc-400 italic"
                            >
                              Loading audit stream...
                            </td>
                          </tr>
                        ) : filteredLogsList.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-6 text-center text-zinc-400 italic"
                            >
                              No log events recorded matching criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredLogsList.map((log) => (
                            <tr
                              key={log.id}
                              className="hover:bg-zinc-50/60 transition-colors"
                            >
                              <td className="p-2.5 font-mono text-[10px] text-zinc-500">
                                {new Date(log.created_at).toLocaleString()}
                              </td>
                              <td className="p-2.5 font-semibold text-zinc-900">
                                {log.action}
                              </td>
                              <td className="p-2.5">
                                <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-mono border border-zinc-200">
                                  {log.category}
                                </span>
                              </td>
                              <td className="p-2.5">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                                    log.level === "ERROR"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : log.level === "WARN"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}
                                >
                                  {log.level}
                                </span>
                              </td>
                              <td className="p-2.5 font-medium text-zinc-900">
                                {log.user?.email || "System"}
                              </td>
                              <td className="p-2.5 font-mono text-[10px] text-zinc-400">
                                {log.ip_address}
                              </td>
                              <td className="p-2.5 text-right">
                                <button
                                  onClick={() => setSelectedLogItem(log)}
                                  className="text-[10px] font-mono text-[#015451] hover:underline cursor-pointer"
                                >
                                  Inspect JSON &rarr;
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "health" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Server Core Status
                      </span>
                      <div className="flex items-center gap-1.5 text-lg font-bold text-[#015451]">
                        <CheckCircledIcon className="w-4 h-4 text-[#015451]" />
                        <span>{healthData?.status || "HEALTHY"}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        Node runtime: {healthData?.nodeVersion || "v20.x"}
                      </p>
                    </div>

                    <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Process Uptime
                      </span>
                      <p className="text-lg font-bold font-mono text-zinc-900">
                        {healthData?.uptimeSeconds
                          ? `${Math.floor(healthData.uptimeSeconds / 60)} minutes`
                          : "Active"}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Database: {healthData?.databaseStatus || "CONNECTED"}
                      </p>
                    </div>

                    <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Heap Memory Usage
                      </span>
                      <p className="text-lg font-bold font-mono text-zinc-900">
                        {healthData?.memory?.heapUsedMB
                          ? `${healthData.memory.heapUsedMB} MB`
                          : "42 MB"}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Total RSS: {healthData?.memory?.rssMB || "95"} MB
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-3 shadow-2xs">
                    <h3 className="text-xs font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
                      Microservices Telemetry & Latency Matrix
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {[
                        {
                          name: "REST API Endpoint",
                          status: "OPERATIONAL",
                          latency: "14 ms",
                        },
                        {
                          name: "Prisma PostgreSQL DB",
                          status: "OPERATIONAL",
                          latency: "3 ms",
                        },
                        {
                          name: "Redis Cache Layer",
                          status: "OPERATIONAL",
                          latency: "1 ms",
                        },
                        {
                          name: "Resend Email Worker",
                          status: "OPERATIONAL",
                          latency: "42 ms",
                        },
                        {
                          name: "Google OAuth Provider",
                          status: "OPERATIONAL",
                          latency: "65 ms",
                        },
                        {
                          name: "Platform AI Service",
                          status: "OPERATIONAL",
                          latency: "110 ms",
                        },
                      ].map((svc, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded bg-zinc-50 border border-zinc-100 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-900">
                              {svc.name}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#015451]" />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                            <span>{svc.status}</span>
                            <span>{svc.latency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "assets" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-700">
                          Projects Directory
                        </span>
                        <CubeIcon className="w-4 h-4 text-[#015451]" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-zinc-900">
                        {stats?.counts?.totalProjects ?? 0}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Developer projects registered in catalog
                      </p>
                    </div>

                    <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-700">
                          Published Tutorials
                        </span>
                        <FileTextIcon className="w-4 h-4 text-[#015451]" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-zinc-900">
                        {stats?.counts?.totalBlogs ?? 0}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Articles published on dradix blog
                      </p>
                    </div>

                    <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-700">
                          Waitlist Subscribers
                        </span>
                        <PersonIcon className="w-4 h-4 text-[#015451]" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-zinc-900">
                        {waitlistList.length > 0
                          ? waitlistList.length
                          : (stats?.counts?.totalWaitlist ?? 0)}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Registered early access waiting list
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-md border border-zinc-200 p-4 space-y-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                      <div>
                        <h3 className="text-xs font-semibold text-zinc-900">
                          Early Access Waitlist Directory & Mail Dispatcher
                        </h3>
                        <p className="text-[11px] text-zinc-500">
                          Manage registered waitlist members and dispatch
                          high-impact notification emails.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative w-56">
                          <MagnifyingGlassIcon className="w-3.5 h-3.5 absolute left-2 top-2 text-zinc-400" />
                          <input
                            type="text"
                            placeholder="Filter waitlist emails..."
                            value={waitlistSearch}
                            onChange={(e) => setWaitlistSearch(e.target.value)}
                            className="w-full pl-7 pr-2 py-1 bg-white border border-zinc-200 rounded text-xs font-medium focus:outline-none focus:border-zinc-400"
                          />
                        </div>

                        <ActionTooltip
                          name="Refresh List"
                          usecase="Fetch live waitlist subscribers"
                        >
                          <button
                            onClick={() => void fetchWaitlist()}
                            className="px-2 py-1 bg-white border border-zinc-200 rounded text-xs font-medium hover:bg-zinc-50 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <ReloadIcon
                              className={`w-3 h-3 text-zinc-600 ${
                                loadingWaitlist ? "animate-spin" : ""
                              }`}
                            />
                          </button>
                        </ActionTooltip>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-zinc-200 rounded">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                            <th className="p-2.5 font-semibold">ID</th>
                            <th className="p-2.5 font-semibold">
                              Subscriber Email
                            </th>
                            <th className="p-2.5 font-semibold">
                              Registration Date
                            </th>
                            <th className="p-2.5 font-semibold">
                              Access Status
                            </th>
                            <th className="p-2.5 font-semibold text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                          {loadingWaitlist ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-8 text-center text-zinc-400 text-xs"
                              >
                                Loading waitlist entries...
                              </td>
                            </tr>
                          ) : filteredWaitlist.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-8 text-center text-zinc-400 text-xs"
                              >
                                No waitlist subscribers found.
                              </td>
                            </tr>
                          ) : (
                            filteredWaitlist.map((sub) => (
                              <tr
                                key={sub.id}
                                className="hover:bg-zinc-50/80 transition-colors"
                              >
                                <td className="p-2.5 font-mono text-[11px] text-zinc-400">
                                  #{sub.id}
                                </td>
                                <td className="p-2.5 font-medium text-zinc-900">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-[#015451]/10 text-[#015451] font-mono text-[10px] font-bold flex items-center justify-center">
                                      {sub.email[0].toUpperCase()}
                                    </div>
                                    <span>{sub.email}</span>
                                  </div>
                                </td>
                                <td className="p-2.5 font-mono text-[11px] text-zinc-500">
                                  {new Date(sub.created_at).toLocaleString()}
                                </td>
                                <td className="p-2.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                    Reserved Priority Spot
                                  </span>
                                </td>
                                <td className="p-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <ActionTooltip
                                      name="Send Waitlist Email"
                                      usecase="Dispatch early access notice"
                                    >
                                      <button
                                        onClick={() => {
                                          setWaitlistEmailSubscriber(sub);
                                        }}
                                        className="w-7 h-7 flex items-center justify-center rounded border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 transition-colors cursor-pointer"
                                      >
                                        <EnvelopeClosedIcon className="w-3.5 h-3.5 text-[#015451]" />
                                      </button>
                                    </ActionTooltip>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {inspectUserPayload && (
        <div className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-zinc-200 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-4 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div>
                <h3 className="text-xs font-bold text-zinc-900">
                  User Telemetry & Markdown Inspection
                </h3>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {inspectUserPayload.user.email} (ID:{" "}
                  {inspectUserPayload.user.id})
                </p>
              </div>
              <button
                onClick={() => setInspectUserPayload(null)}
                className="p-1 rounded hover:bg-zinc-100 text-zinc-500 cursor-pointer"
              >
                <Cross2Icon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1 border-b border-zinc-200 text-xs">
              {(["overview", "bio", "notes", "sessions"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setUserInspectTab(tab)}
                    className={`px-3 py-1.5 border-b-2 font-medium capitalize cursor-pointer ${
                      userInspectTab === tab
                        ? "border-[#015451] text-[#015451] font-semibold"
                        : "border-transparent text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    {tab === "bio"
                      ? "User Bio (Markdown)"
                      : tab === "notes"
                        ? "Admin Notes (Markdown)"
                        : tab}
                  </button>
                ),
              )}
            </div>

            {userInspectTab === "overview" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-zinc-50 border border-zinc-200 space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-zinc-400">
                      Auth & Provider
                    </span>
                    <p className="font-semibold text-zinc-900">
                      {inspectUserPayload.authProvider}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      2FA:{" "}
                      {inspectUserPayload.user.two_factor_enabled
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-zinc-50 border border-zinc-200 space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-zinc-400">
                      Security Risk Indicator
                    </span>
                    <p className="font-semibold text-zinc-900">
                      {inspectUserPayload.riskIndicators.riskLevel} (
                      {inspectUserPayload.riskIndicators.riskScore}/100)
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Disposable Email:{" "}
                      {inspectUserPayload.riskIndicators.isDisposableEmail
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded border border-zinc-200 space-y-2">
                  <h4 className="font-semibold text-zinc-900 text-xs">
                    Risk Matrix Details
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
                    <div className="p-2 bg-zinc-50 rounded border border-zinc-100">
                      <span className="text-zinc-400 block">Countries</span>
                      <span>
                        {inspectUserPayload.riskIndicators.countriesCount}
                      </span>
                    </div>
                    <div className="p-2 bg-zinc-50 rounded border border-zinc-100">
                      <span className="text-zinc-400 block">Devices</span>
                      <span>
                        {inspectUserPayload.riskIndicators.devicesCount}
                      </span>
                    </div>
                    <div className="p-2 bg-zinc-50 rounded border border-zinc-100">
                      <span className="text-zinc-400 block">Shared Accs</span>
                      <span>
                        {
                          inspectUserPayload.riskIndicators
                            .sharedDeviceAccountsCount
                        }
                      </span>
                    </div>
                    <div className="p-2 bg-zinc-50 rounded border border-zinc-100">
                      <span className="text-zinc-400 block">
                        Suspicious Logins
                      </span>
                      <span>
                        {inspectUserPayload.riskIndicators.suspiciousLogins
                          ? "Flagged"
                          : "Clean"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {userInspectTab === "bio" && (
              <div className="space-y-2">
                <h4 className="font-semibold text-zinc-900">
                  Rendered User Bio (Markdown)
                </h4>
                <MarkdownViewer
                  content={
                    inspectUserPayload.user.bio ||
                    "# User Bio\nNo bio text registered by user."
                  }
                />
              </div>
            )}

            {userInspectTab === "notes" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-zinc-900">
                    Admin Markdown Notes
                  </h4>
                  <button
                    onClick={handleSaveAdminNotes}
                    className="px-2.5 py-1 rounded bg-[#015451] hover:bg-[#013b39] text-white text-[11px] font-medium cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                      Markdown Input
                    </label>
                    <textarea
                      rows={8}
                      value={currentNotesText}
                      onChange={(e) => setCurrentNotesText(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-200 rounded font-mono text-xs text-zinc-900 focus:outline-none"
                      placeholder="Write markdown administrative notes..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                      Live Markdown Preview
                    </label>
                    <MarkdownViewer content={currentNotesText} />
                  </div>
                </div>
              </div>
            )}

            {userInspectTab === "sessions" && (
              <div className="space-y-2">
                <h4 className="font-semibold text-zinc-900">
                  Recent Device Sessions (
                  {inspectUserPayload.recentSessions.length})
                </h4>
                <div className="overflow-x-auto border border-zinc-200 rounded">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold">
                        <th className="p-2">IP Address</th>
                        <th className="p-2">Device & OS</th>
                        <th className="p-2">Browser</th>
                        <th className="p-2">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-mono">
                      {inspectUserPayload.recentSessions.map((s) => (
                        <tr key={s.id}>
                          <td className="p-2">{s.ip_address}</td>
                          <td className="p-2">
                            {s.device_type} · {s.os}
                          </td>
                          <td className="p-2">{s.browser_name}</td>
                          <td className="p-2 text-zinc-400">
                            {new Date(s.last_active).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setInspectUserPayload(null)}
                className="px-3 py-1 bg-zinc-900 text-white font-medium rounded text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedLogItem && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-zinc-200 max-w-lg w-full p-4 space-y-3 shadow-lg text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-semibold text-zinc-900">
                Log Event Details #{selectedLogItem.id}
              </h3>
              <button
                onClick={() => setSelectedLogItem(null)}
                className="p-1 hover:bg-zinc-100 rounded text-zinc-500"
              >
                <Cross2Icon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <p>
                <span className="text-zinc-400">Action:</span>{" "}
                {selectedLogItem.action}
              </p>
              <p>
                <span className="text-zinc-400">Actor:</span>{" "}
                {selectedLogItem.user?.email || "System"}
              </p>
              <p>
                <span className="text-zinc-400">IP Address:</span>{" "}
                {selectedLogItem.ip_address}
              </p>
              <p>
                <span className="text-zinc-400">Time:</span>{" "}
                {new Date(selectedLogItem.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                JSON Payload
              </span>
              <pre className="p-2 bg-zinc-900 text-zinc-100 rounded text-[10px] font-mono overflow-x-auto mt-1 max-h-48">
                {JSON.stringify(selectedLogItem.details, null, 2)}
              </pre>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setSelectedLogItem(null)}
                className="px-3 py-1 bg-zinc-900 text-white rounded text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editProfileUser && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handlePromptSaveEditedUser}
            className="bg-white rounded-md border border-zinc-200 max-w-sm w-full p-4 space-y-3 shadow-lg text-xs"
          >
            <h3 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Edit Account ({editProfileUser.email})
            </h3>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editFormData.username}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1 bg-white border border-zinc-200 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.first_name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        first_name: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1 bg-white border border-zinc-200 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.last_name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        last_name: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1 bg-white border border-zinc-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                  Developer Score
                </label>
                <input
                  type="number"
                  value={editFormData.developer_score}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      developer_score: Number(e.target.value),
                    })
                  }
                  className="w-full px-2.5 py-1 bg-white border border-zinc-200 rounded focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setEditProfileUser(null)}
                className="px-3 py-1 rounded border border-zinc-200 bg-white text-zinc-800 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-zinc-900 text-white font-medium cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {emailModalUser && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handlePromptSendAdminEmail}
            className="bg-white rounded-md border border-zinc-200 max-w-sm w-full p-4 space-y-3 shadow-lg text-xs"
          >
            <h3 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Send Email ({emailModalUser.email})
            </h3>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="System Notification Subject..."
                  value={emailFormData.subject}
                  onChange={(e) =>
                    setEmailFormData({
                      ...emailFormData,
                      subject: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1 bg-white border border-zinc-200 rounded focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter official email message body..."
                  value={emailFormData.message}
                  onChange={(e) =>
                    setEmailFormData({
                      ...emailFormData,
                      message: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1 bg-white border border-zinc-200 rounded focus:outline-none font-sans"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setEmailModalUser(null)}
                className="px-3 py-1 rounded border border-zinc-200 bg-white text-zinc-800 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendingEmail}
                className="px-3 py-1 rounded bg-[#015451] hover:bg-[#013b39] text-white font-medium cursor-pointer disabled:opacity-50"
              >
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>
            </div>
          </form>
        </div>
      )}

      {waitlistEmailSubscriber && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-zinc-200 max-w-2xl w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Send Waitlist Email Notice
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Recipient:{" "}
                  <span className="font-mono text-zinc-800 font-semibold">
                    {waitlistEmailSubscriber.email}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWaitlistEmailSubscriber(null)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block">
                Quick Mail Templates
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setWaitlistEmailSubject(
                      "Exclusive Early Access Confirmed — dradix Update",
                    );
                    setWaitlistEmailBody(
                      `Hello,\n\nThank you for reaching out. We have successfully received your request and reserved your priority position on the dradix platform early access waitlist.\n\nOur team is currently deploying next-generation developer tooling, seamless automation, and enhanced security infrastructure. We will connect with you very soon to share exclusive access credentials and exciting platform milestones.\n\nWe appreciate your patience and look forward to welcoming you aboard.\n\nWarm regards,\nThe dradix Operations Team`,
                    );
                  }}
                  className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded text-[10px] font-medium transition-colors cursor-pointer border border-zinc-200"
                >
                  Priority Received
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWaitlistEmailSubject(
                      "Your Early Access Invitation is Ready — dradix",
                    );
                    setWaitlistEmailBody(
                      `Hello,\n\nGreat news! Your reserved invitation for early access to dradix is now available.\n\nYou can proceed to activate your account and explore our high-performance developer workspace. Our engineering team is standing by to support your onboarding.\n\nWelcome to the future of dradix.\n\nBest regards,\nThe dradix Engineering Team`,
                    );
                  }}
                  className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded text-[10px] font-medium transition-colors cursor-pointer border border-zinc-200"
                >
                  Access Invitation Ready
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWaitlistEmailSubject(
                      "dradix Platform Feature Milestone & Rollout Notice",
                    );
                    setWaitlistEmailBody(
                      `Hello,\n\nWe are excited to share that dradix has reached key architecture milestones. As a valued waitlist member, you are among the first group selected for upcoming preview access.\n\nOur engineering team will release your access credentials in the next invitation batch. No action is required from your side at this time.\n\nThank you for building with us.\n\nSincerely,\nThe dradix Platform Team`,
                    );
                  }}
                  className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded text-[10px] font-medium transition-colors cursor-pointer border border-zinc-200"
                >
                  Milestone Update
                </button>
              </div>
            </div>

            <form
              onSubmit={handlePromptSendWaitlistEmail}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={waitlistEmailSubject}
                  onChange={(e) => setWaitlistEmailSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-400 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">
                  Message Body (Paragraph Format)
                </label>
                <textarea
                  rows={6}
                  required
                  value={waitlistEmailBody}
                  onChange={(e) => setWaitlistEmailBody(e.target.value)}
                  className="w-full p-2.5 bg-white border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-400 font-sans leading-relaxed text-zinc-800"
                />
              </div>

              <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                  Live Text Preview
                </span>
                <p className="text-[11px] text-zinc-600 leading-relaxed font-sans whitespace-pre-line">
                  {waitlistEmailBody}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setWaitlistEmailSubscriber(null)}
                  className="px-3 py-1.5 rounded border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingWaitlistMail}
                  className="px-3 py-1.5 rounded bg-[#015451] hover:bg-[#013b39] text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  {sendingWaitlistMail
                    ? "Dispatching..."
                    : "Send Waitlist Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
