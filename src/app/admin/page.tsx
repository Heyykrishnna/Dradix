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
  ChevronDownIcon,
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
} from "@radix-ui/react-icons";

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

interface DealWeekItem {
  week: string;
  won: number;
  lost: number;
}

interface PipelineRowItem {
  stage: string;
  deals: number;
  sharePct: number;
  value: string;
  conversion: string;
}

interface GrowthAnalytics {
  retentionRate: string;
  churnRate: string;
  signupTrendDelta: string;
  acquisitionSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  deviceDistribution: Array<{ name: string; count: number }>;
  browserDistribution: Array<{ name: string; count: number }>;
  osDistribution: Array<{ name: string; count: number }>;
  countryDistribution: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  peakTrafficHours: Array<{ hour: string; requests: number }>;
}

interface AnalyticsData {
  revenueVsTarget: RevenueItem[];
  upcomingActivities: ActivityItem[];
  dealFlow: { weeks: DealWeekItem[] };
  openPipeline: PipelineRowItem[];
  growthAnalytics?: GrowthAnalytics;
}

interface ServiceHealthStatus {
  serverStatus: string;
  databaseStatus: string;
  redisStatus: string;
  queueWorkers: string;
  apiHealth: string;
  emailServiceStatus: string;
  oauthProvidersStatus: string;
  externalApiStatus: string;
  aiServiceStatus: string;
  cdnStatus: string;
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
  services?: ServiceHealthStatus;
  timestamp: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
    "dashboard" | "growth" | "users" | "logs" | "health" | "assets"
  >("dashboard");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );

  // Users Directory State
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

  // Modals state
  const [inspectUserPayload, setInspectUserPayload] =
    useState<UserDetailPayload | null>(null);
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

  // System logs state
  const [logsList, setLogsList] = useState<SystemLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logCategoryFilter, setLogCategoryFilter] = useState("");
  const [logLevelFilter, setLogLevelFilter] = useState("");

  const [healthData, setHealthData] = useState<HealthData | null>(null);

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [hoveredMonth, setHoveredMonth] = useState<{
    month: string;
    target: number;
    booked: number;
    x: number;
    y: number;
  } | null>(null);

  const showNotice = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4000);
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
  }, [
    activeTab,
    fetchStats,
    fetchAnalytics,
    fetchUsers,
    fetchLogs,
    fetchHealth,
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
        if (activeTab === "dashboard" || activeTab === "growth") {
          await fetchAnalytics();
        } else if (activeTab === "users") {
          setLoadingUsers(true);
          await fetchUsers();
        } else if (activeTab === "logs") {
          setLoadingLogs(true);
          await fetchLogs();
        } else if (activeTab === "health") {
          await fetchHealth();
        }
      }
    }
    void loadTabData();
    return () => {
      ignore = true;
    };
  }, [activeTab, fetchAnalytics, fetchUsers, fetchLogs, fetchHealth]);

  // Single User Actions
  const handleUpdateRole = async (
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
        showNotice(`Role updated to ${newRole} successfully`);
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

  const handleToggleVerification = async (
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
          `User verification set to ${!currentStatus ? "Verified" : "Unverified"}`,
        );
        setLoadingUsers(true);
        void fetchUsers();
        void fetchStats();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update status";
      showNotice(msg, "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (targetUserId: number, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    setUpdatingUserId(targetUserId);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        `/admin/users/${targetUserId}`,
        {
          method: "DELETE",
        },
      );
      if (res.success) {
        showNotice("User deleted successfully");
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

  const handleRevokeSessions = async (targetUserId: number) => {
    setUpdatingUserId(targetUserId);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        `/admin/users/${targetUserId}/revoke-sessions`,
        {
          method: "POST",
        },
      );
      if (res.success) {
        showNotice("Revoked all sessions for user");
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

  const handleInspectUser = async (targetUserId: number) => {
    try {
      const res = await apiFetch<ApiResponse<UserDetailPayload>>(
        `/admin/users/${targetUserId}`,
      );
      if (res.success && res.data) {
        setInspectUserPayload(res.data);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch user details";
      showNotice(msg, "error");
    }
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

  const handleSaveEditedUser = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleSendAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
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
        showNotice(`Notification sent to ${emailModalUser.email}`);
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

  // Bulk Operations
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

  const handleExecuteBulkAction = async (
    action:
      | "UPDATE_ROLE"
      | "VERIFY"
      | "UNVERIFY"
      | "DELETE"
      | "REVOKE_SESSIONS",
    payload?: Record<string, unknown>,
  ) => {
    if (selectedUserIds.length === 0) return;
    if (
      action === "DELETE" &&
      !confirm(
        `Are you sure you want to BULK DELETE ${selectedUserIds.length} selected users?`,
      )
    ) {
      return;
    }

    setBulkActioning(true);
    try {
      const res = await apiFetch<
        ApiResponse<{ affected: number }>
      >("/admin/users/bulk", {
        method: "POST",
        body: JSON.stringify({
          userIds: selectedUserIds,
          action,
          payload,
        }),
      });
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
    showNotice(`Exported ${usersList.length} users in ${format.toUpperCase()}`);
  };

  const handleBootstrapSelf = async () => {
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        "/admin/bootstrap-admin",
        {
          method: "POST",
        },
      );
      if (res.success) {
        showNotice("Self bootstrapped as ADMIN!");
        void checkAuth();
        void fetchStats();
        void fetchAnalytics();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bootstrap failed";
      showNotice(msg, "error");
    }
  };

  const rawRevenue = analyticsData?.revenueVsTarget || [];
  const maxVal = Math.max(
    ...rawRevenue.map((r: RevenueItem) =>
      Math.max(r.target || 1, r.booked || 1, 10),
    ),
    10,
  );

  const revenuePoints = rawRevenue.map((item: RevenueItem, i: number) => {
    const step = 700 / Math.max(1, rawRevenue.length - 1);
    const x = 20 + i * step;
    const y = 180 - Math.round(((item.booked || 0) / maxVal) * 140);
    return {
      month: item.month,
      target: item.target,
      booked: item.booked,
      x,
      y: Math.max(20, Math.min(y, 185)),
    };
  });

  const upcomingList = analyticsData?.upcomingActivities || [];

  const navItems: {
    id: "dashboard" | "growth" | "users" | "logs" | "health" | "assets";
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
        <span className="text-[10px] bg-[#015451]/10 text-[#015451] border border-[#015451]/20 font-extrabold px-2 py-0.5 rounded-full z-10 transition-colors">
          {stats.counts.totalUsers}
        </span>
      ) : null,
    },
    {
      id: "logs",
      label: "System Logs",
      icon: ActivityLogIcon,
      badge: stats ? (
        <span className="text-[10px] bg-zinc-100 text-black border border-zinc-200 font-extrabold px-2 py-0.5 rounded-full z-10 transition-colors">
          {stats.counts.totalLogs}
        </span>
      ) : null,
    },
    {
      id: "health",
      label: "Infrastructure",
      icon: RocketIcon,
      badge: (
        <span className="w-2 h-2 rounded-full bg-[#015451] animate-pulse z-10" />
      ),
    },
    {
      id: "assets",
      label: "Platform Assets",
      icon: FileTextIcon,
    },
  ];

  const isAllPageSelected =
    usersList.length > 0 && usersList.every((u) => selectedUserIds.includes(u.id));

  return (
    <div className="min-h-screen bg-white text-black font-sans flex antialiased selection:bg-[#015451] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col justify-between p-4 shrink-0 shadow-xs z-20">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 py-1">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <span className="font-extrabold text-[16px] tracking-tight text-black">
                dradix <span className="text-[#015451] font-bold">Admin</span>
              </span>
            </Link>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Workspace
            </p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-colors cursor-pointer select-none ${
                    isActive
                      ? "text-white"
                      : "text-zinc-600 hover:text-black hover:bg-zinc-50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminSidebarTab"
                      className="absolute inset-0 bg-black rounded-xl shadow-xs"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className="w-4 h-4" />
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

        <div className="space-y-4 pt-4 border-t border-zinc-100">
          <div className="bg-white p-2.5 rounded-2xl border border-zinc-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-black text-white font-extrabold text-[12px] flex items-center justify-center border border-zinc-900 shrink-0">
                {user?.first_name
                  ? user.first_name[0]
                  : user?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-extrabold text-black truncate leading-tight">
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name || ""}`
                    : user?.username || "Admin"}
                </p>
                <p className="text-[10px] font-bold text-[#015451] truncate leading-tight">
                  dradix Workspace Admin
                </p>
              </div>
            </div>
            <button
              onClick={handleBootstrapSelf}
              title="Sync Admin Privileges"
              className="p-1 text-zinc-400 hover:text-black transition-colors cursor-pointer"
            >
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
        <header className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <h1 className="text-[20px] font-extrabold text-black tracking-tight flex items-center gap-2">
              <DashboardIcon className="w-5 h-5 text-[#015451]" />
              {activeTab === "dashboard" && "dradix Operations Dashboard"}
              {activeTab === "users" && "User Directory & Management"}
              {activeTab === "logs" && "System Audit Logs"}
              {activeTab === "health" && "API & Infrastructure Health"}
              {activeTab === "assets" && "Platform Assets & Metrics"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={reloadAll}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white text-black hover:bg-zinc-50 text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ReloadIcon
                className={`w-3.5 h-3.5 text-[#015451] ${loadingStats ? "animate-spin" : ""}`}
              />
              Sync Live Data
            </button>
          </div>
        </header>

        {notice && (
          <div
            className={`mx-8 mt-4 p-3 rounded-2xl border text-[13px] font-bold flex items-center justify-between ${
              notice.type === "success"
                ? "bg-[#015451]/10 border-[#015451]/20 text-[#015451]"
                : "bg-black border-zinc-800 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === "success" ? (
                <CheckCircledIcon className="w-4 h-4 text-[#015451]" />
              ) : (
                <CrossCircledIcon className="w-4 h-4 text-red-500" />
              )}
              <span>{notice.message}</span>
            </div>
            <button
              onClick={() => setNotice(null)}
              className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="p-8 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.998 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.998 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
              className="space-y-8"
            >
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  {/* Platform Overview Header & Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-[16px] font-extrabold text-black tracking-tight">
                          Platform Telemetry Overview
                        </h2>
                        <p className="text-[12px] text-zinc-500 font-medium">
                          Real-time user engagement, session counts, and system
                          asset metrics
                        </p>
                      </div>
                      <span className="text-[11px] font-extrabold text-[#015451] bg-[#015451]/10 border border-[#015451]/20 px-3 py-1 rounded-full">
                        Live DB Synced
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                      {/* 1. Total Registered Users */}
                      <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-2 shadow-xs hover:border-black transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Total Registered Users
                          </span>
                          <PersonIcon className="w-4 h-4 text-[#015451]" />
                        </div>
                        <p className="text-[24px] font-black text-black">
                          {stats?.overview?.totalRegisteredUsers ??
                            stats?.counts?.totalUsers ??
                            0}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-semibold">
                          +{stats?.overview?.newUsersThisMonth ?? 0} registered
                          this month
                        </p>
                      </div>

                      {/* 2. Daily Active Users (DAU) */}
                      <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-2 shadow-xs hover:border-black transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Daily Active Users (DAU)
                          </span>
                          <LightningBoltIcon className="w-4 h-4 text-[#015451]" />
                        </div>
                        <p className="text-[24px] font-black text-black">
                          {stats?.overview?.dau ?? 0}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-semibold">
                          Active in last 24 hours
                        </p>
                      </div>

                      {/* 3. Weekly Active Users (WAU) */}
                      <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-2 shadow-xs hover:border-black transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Weekly Active (WAU)
                          </span>
                          <ActivityLogIcon className="w-4 h-4 text-[#015451]" />
                        </div>
                        <p className="text-[24px] font-black text-black">
                          {stats?.overview?.wau ?? 0}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-semibold">
                          Active in trailing 7 days
                        </p>
                      </div>

                      {/* 4. Monthly Active Users (MAU) */}
                      <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-2 shadow-xs hover:border-black transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Monthly Active (MAU)
                          </span>
                          <TargetIcon className="w-4 h-4 text-[#015451]" />
                        </div>
                        <p className="text-[24px] font-black text-black">
                          {stats?.overview?.mau ?? 0}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-semibold">
                          Active in trailing 30 days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Chart & Audit Feed */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-[15px] font-bold text-black">
                            Monthly Registrations & Trailing Activity
                          </h3>
                          <p className="text-[12px] text-zinc-500 font-medium">
                            Database signups and submissions over trailing 12
                            months
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-600">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#015451] inline-block" />
                            Registrations
                          </span>
                        </div>
                      </div>

                      <div className="h-64 w-full relative pt-4">
                        <svg
                          className="w-full h-full overflow-visible"
                          viewBox="0 0 740 200"
                        >
                          <line
                            x1="0"
                            y1="20"
                            x2="740"
                            y2="20"
                            stroke="#f4f4f5"
                            strokeDasharray="4 4"
                          />
                          <line
                            x1="0"
                            y1="100"
                            x2="740"
                            y2="100"
                            stroke="#f4f4f5"
                            strokeDasharray="4 4"
                          />
                          <line
                            x1="0"
                            y1="185"
                            x2="740"
                            y2="185"
                            stroke="#f4f4f5"
                            strokeDasharray="4 4"
                          />

                          {revenuePoints.length > 0 && (
                            <path
                              d={`M ${revenuePoints.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                              fill="none"
                              stroke="#015451"
                              strokeWidth="3"
                            />
                          )}

                          {revenuePoints.map((pt) => (
                            <circle
                              key={pt.month}
                              cx={pt.x}
                              cy={pt.y}
                              r={hoveredMonth?.month === pt.month ? "6" : "4"}
                              fill={
                                hoveredMonth?.month === pt.month
                                  ? "#013b39"
                                  : "#015451"
                              }
                              stroke="#ffffff"
                              strokeWidth="2"
                              className="cursor-pointer transition-all duration-200"
                              onMouseEnter={() => setHoveredMonth(pt)}
                            />
                          ))}
                        </svg>

                        {hoveredMonth && (
                          <div
                            className="absolute bg-black text-white rounded-xl shadow-lg border border-zinc-900 p-3 text-[11px] font-bold space-y-1 z-20 pointer-events-none transition-all duration-200"
                            style={{
                              left: `${(hoveredMonth.x / 740) * 100}%`,
                              top: `${hoveredMonth.y - 70}px`,
                              transform: "translateX(-50%)",
                            }}
                          >
                            <p className="text-zinc-400 font-extrabold pb-0.5 border-b border-zinc-800">
                              {hoveredMonth.month}
                            </p>
                            <div className="flex justify-between gap-4 text-[#015451]">
                              <span>Activity Score</span>
                              <span className="font-black text-white">
                                {hoveredMonth.booked}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between px-4 text-[11px] font-bold text-zinc-400 pt-2">
                        {revenuePoints.map((pt) => (
                          <span key={pt.month}>{pt.month}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-xs">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[15px] font-bold text-black">
                            Live Audit Feed
                          </h3>
                          <span className="text-[11px] font-semibold text-zinc-500">
                            {upcomingList.length} recent
                          </span>
                        </div>

                        <div className="space-y-3">
                          {upcomingList.map((act: ActivityItem) => (
                            <div
                              key={act.id}
                              className="flex items-start justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shrink-0 border border-zinc-900">
                                  {act.initials}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-extrabold text-black">
                                      {act.title}
                                    </span>
                                    <span
                                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                        act.statusType === "green"
                                          ? "bg-[#015451]/10 text-[#015451] border border-[#015451]/20"
                                          : "bg-black text-white"
                                      }`}
                                    >
                                      {act.status}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                                    {act.client}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[11px] font-bold text-zinc-500">
                                  {act.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs">
                  {/* Title & Top Export Action Bar */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                    <div>
                      <h3 className="text-[18px] font-extrabold text-black tracking-tight">
                        User Directory & Telemetry
                      </h3>
                      <p className="text-[12px] text-zinc-500 font-medium">
                        Advanced search, risk telemetry, device footprints, bulk operations, and role assignments.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleExportUsers("csv")}
                        className="px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <DownloadIcon className="w-4 h-4 text-[#015451]" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        onClick={() => handleExportUsers("json")}
                        className="px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <DownloadIcon className="w-4 h-4 text-black" />
                        <span>Export JSON</span>
                      </button>
                    </div>
                  </div>

                  {/* Advanced Filters & Search Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="relative col-span-1 sm:col-span-2">
                      <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search by username, email, IP..."
                        value={userSearch}
                        onChange={(e) => {
                          setUserSearch(e.target.value);
                          setUserPage(1);
                        }}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] font-medium text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    <select
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setUserPage(1);
                      }}
                      className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-black focus:outline-none"
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
                      className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-black focus:outline-none"
                    >
                      <option value="">All Verification</option>
                      <option value="true">Verified</option>
                      <option value="false">Unverified</option>
                    </select>

                    <select
                      value={providerFilter}
                      onChange={(e) => {
                        setProviderFilter(e.target.value);
                        setUserPage(1);
                      }}
                      className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-black focus:outline-none"
                    >
                      <option value="">All Auth Providers</option>
                      <option value="GOOGLE">Google OAuth</option>
                      <option value="PASSWORD">Email / Password</option>
                    </select>

                    <select
                      value={riskFilter}
                      onChange={(e) => {
                        setRiskFilter(e.target.value);
                        setUserPage(1);
                      }}
                      className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-black focus:outline-none"
                    >
                      <option value="">All Risk Scores</option>
                      <option value="LOW">Low Risk</option>
                      <option value="MEDIUM">Medium Risk</option>
                      <option value="HIGH">High Risk</option>
                    </select>
                  </div>

                  {/* Bulk Action Bar */}
                  {selectedUserIds.length > 0 && (
                    <div className="p-3 rounded-2xl bg-black text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black bg-[#015451] text-white px-2.5 py-0.5 rounded-full">
                          {selectedUserIds.length} Selected
                        </span>
                        <span className="text-[12px] text-zinc-300 font-medium">
                          Bulk Operations Menu:
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          disabled={bulkActioning}
                          onClick={() =>
                            handleExecuteBulkAction("UPDATE_ROLE", {
                              role: "ADMIN",
                            })
                          }
                          className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Make ADMIN
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() =>
                            handleExecuteBulkAction("UPDATE_ROLE", {
                              role: "USER",
                            })
                          }
                          className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Make USER
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() => handleExecuteBulkAction("VERIFY")}
                          className="px-3 py-1 rounded-xl bg-[#015451] hover:bg-[#013b39] text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Verify Selected
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() => handleExecuteBulkAction("UNVERIFY")}
                          className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Unverify Selected
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() =>
                            handleExecuteBulkAction("REVOKE_SESSIONS")
                          }
                          className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Revoke Sessions
                        </button>
                        <button
                          disabled={bulkActioning}
                          onClick={() => handleExecuteBulkAction("DELETE")}
                          className="px-3 py-1 rounded-xl bg-red-950 border border-red-800 text-white hover:bg-red-900 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Users Directory Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[13px]">
                      <thead>
                        <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          <th className="pb-3 w-8">
                            <input
                              type="checkbox"
                              checked={isAllPageSelected}
                              onChange={(e) =>
                                handleSelectAllOnPage(e.target.checked)
                              }
                              className="rounded border-zinc-300 text-black focus:ring-0 cursor-pointer"
                            />
                          </th>
                          <th className="pb-3 font-bold">User</th>
                          <th className="pb-3 font-bold">Provider</th>
                          <th className="pb-3 font-bold">Role</th>
                          <th className="pb-3 font-bold">Verification</th>
                          <th className="pb-3 font-bold">Risk Level</th>
                          <th className="pb-3 font-bold">Telemetry</th>
                          <th className="pb-3 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {loadingUsers ? (
                          <tr>
                            <td
                              colSpan={8}
                              className="py-8 text-center text-zinc-400 italic"
                            >
                              Loading user directory...
                            </td>
                          </tr>
                        ) : usersList.length === 0 ? (
                          <tr>
                            <td
                              colSpan={8}
                              className="py-8 text-center text-zinc-400 italic"
                            >
                              No users match the active filter criteria
                            </td>
                          </tr>
                        ) : (
                          usersList.map((u) => {
                            const isSelected = selectedUserIds.includes(u.id);
                            return (
                              <tr
                                key={u.id}
                                className={`transition-colors ${
                                  isSelected ? "bg-zinc-50" : "hover:bg-zinc-50"
                                }`}
                              >
                                <td className="py-3.5">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleToggleSelectUser(u.id)
                                    }
                                    className="rounded border-zinc-300 text-black focus:ring-0 cursor-pointer"
                                  />
                                </td>

                                <td className="py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-black text-white border border-zinc-900 flex items-center justify-center font-black text-[12px] shrink-0">
                                      {u.username[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-black leading-tight flex items-center gap-1.5">
                                        <span>
                                          {u.first_name
                                            ? `${u.first_name} ${u.last_name || ""}`
                                            : u.username}
                                        </span>
                                      </p>
                                      <p className="text-[11px] text-zinc-500 font-medium">
                                        {u.email}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5">
                                  <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-black border border-zinc-200 text-[10px] font-bold">
                                    {u.auth_provider || "PASSWORD"}
                                  </span>
                                </td>

                                <td className="py-3.5">
                                  <button
                                    disabled={updatingUserId === u.id}
                                    onClick={() =>
                                      handleUpdateRole(
                                        u.id,
                                        u.role === "ADMIN" ? "USER" : "ADMIN",
                                      )
                                    }
                                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold border transition-all cursor-pointer ${
                                      u.role === "ADMIN"
                                        ? "bg-black text-white border-zinc-900 hover:bg-zinc-800"
                                        : "bg-zinc-100 text-black border-zinc-200 hover:bg-zinc-200"
                                    }`}
                                  >
                                    {u.role || "USER"} (Switch)
                                  </button>
                                </td>

                                <td className="py-3.5">
                                  <button
                                    disabled={updatingUserId === u.id}
                                    onClick={() =>
                                      handleToggleVerification(
                                        u.id,
                                        u.is_verified,
                                      )
                                    }
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all flex items-center gap-1 w-fit cursor-pointer ${
                                      u.is_verified
                                        ? "bg-[#015451]/10 text-[#015451] border-[#015451]/20"
                                        : "bg-zinc-100 text-black border-zinc-200"
                                    }`}
                                  >
                                    {u.is_verified ? (
                                      <>
                                        <CheckCircledIcon className="w-3 h-3 text-[#015451]" />
                                        <span>Verified</span>
                                      </>
                                    ) : (
                                      <>
                                        <ExclamationTriangleIcon className="w-3 h-3 text-black" />
                                        <span>Pending</span>
                                      </>
                                    )}
                                  </button>
                                </td>

                                <td className="py-3.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                                      u.riskLevel === "HIGH"
                                        ? "bg-black text-white border-zinc-900"
                                        : u.riskLevel === "MEDIUM"
                                          ? "bg-zinc-100 text-black border-zinc-300"
                                          : "bg-[#015451]/10 text-[#015451] border-[#015451]/20"
                                    }`}
                                  >
                                    {u.riskLevel} ({u.riskScore})
                                  </span>
                                </td>

                                <td className="py-3.5 text-[11px] text-zinc-500">
                                  <p className="font-bold text-black">
                                    {u.location || "India"}
                                  </p>
                                  <p className="font-mono text-[10px]">
                                    {u.ip_address} · {u.device}
                                  </p>
                                </td>

                                <td className="py-3.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      title="Inspect User Details"
                                      onClick={() => handleInspectUser(u.id)}
                                      className="p-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black transition-colors cursor-pointer"
                                    >
                                      <EyeOpenIcon className="w-3.5 h-3.5 text-[#015451]" />
                                    </button>
                                    <button
                                      title="Edit Profile"
                                      onClick={() => handleOpenEditUser(u)}
                                      className="p-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black transition-colors cursor-pointer"
                                    >
                                      <Pencil1Icon className="w-3.5 h-3.5 text-black" />
                                    </button>
                                    <button
                                      title="Send Email"
                                      onClick={() => setEmailModalUser(u)}
                                      className="p-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black transition-colors cursor-pointer"
                                    >
                                      <EnvelopeClosedIcon className="w-3.5 h-3.5 text-black" />
                                    </button>
                                    <button
                                      title="Revoke All Sessions"
                                      disabled={updatingUserId === u.id}
                                      onClick={() => handleRevokeSessions(u.id)}
                                      className="p-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black transition-colors cursor-pointer"
                                    >
                                      <LockClosedIcon className="w-3.5 h-3.5 text-black" />
                                    </button>
                                    <button
                                      title="Delete User"
                                      disabled={
                                        updatingUserId === u.id ||
                                        u.id === user?.id
                                      }
                                      onClick={() =>
                                        handleDeleteUser(u.id, u.email)
                                      }
                                      className="p-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black transition-colors disabled:opacity-30 cursor-pointer"
                                    >
                                      <TrashIcon className="w-3.5 h-3.5 text-red-600" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 text-[12px]">
                    <div className="flex items-center gap-2 text-zinc-500 font-medium">
                      <span>
                        Showing page {paginationMeta.page} of{" "}
                        {paginationMeta.totalPages} ({paginationMeta.total}{" "}
                        total users)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={userLimit}
                        onChange={(e) => {
                          setUserLimit(Number(e.target.value));
                          setUserPage(1);
                        }}
                        className="px-2.5 py-1 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-black focus:outline-none"
                      >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={userPage <= 1}
                          onClick={() => setUserPage(userPage - 1)}
                          className="px-3 py-1 rounded-xl border border-zinc-200 bg-white text-black hover:bg-zinc-50 disabled:opacity-30 cursor-pointer font-bold"
                        >
                          Previous
                        </button>
                        <button
                          disabled={userPage >= paginationMeta.totalPages}
                          onClick={() => setUserPage(userPage + 1)}
                          className="px-3 py-1 rounded-xl border border-zinc-200 bg-white text-black hover:bg-zinc-50 disabled:opacity-30 cursor-pointer font-bold"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                    <div>
                      <h3 className="text-[16px] font-extrabold text-black">
                        System Audit Trail
                      </h3>
                      <p className="text-[12px] text-zinc-500 font-medium">
                        Real-time administrative actions, security checks, and
                        role events.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={logCategoryFilter}
                        onChange={(e) => setLogCategoryFilter(e.target.value)}
                        className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-black focus:outline-none"
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
                        className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-black focus:outline-none"
                      >
                        <option value="">All Levels</option>
                        <option value="INFO">INFO</option>
                        <option value="WARN">WARN</option>
                        <option value="ERROR">ERROR</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[13px]">
                      <thead>
                        <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          <th className="pb-3 font-bold">Timestamp</th>
                          <th className="pb-3 font-bold">Action</th>
                          <th className="pb-3 font-bold">Category</th>
                          <th className="pb-3 font-bold">Level</th>
                          <th className="pb-3 font-bold">Actor</th>
                          <th className="pb-3 font-bold">IP Address</th>
                          <th className="pb-3 font-bold text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {loadingLogs ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-8 text-center text-zinc-400 italic"
                            >
                              Loading audit logs...
                            </td>
                          </tr>
                        ) : logsList.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-8 text-center text-zinc-400 italic"
                            >
                              No audit logs recorded yet
                            </td>
                          </tr>
                        ) : (
                          logsList.map((log) => (
                            <tr
                              key={log.id}
                              className="hover:bg-zinc-50 transition-colors"
                            >
                              <td className="py-3 text-[11px] font-bold text-zinc-500">
                                {new Date(log.created_at).toLocaleString()}
                              </td>
                              <td className="py-3 font-extrabold text-black">
                                {log.action}
                              </td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-black text-[10px] font-bold border border-zinc-200">
                                  {log.category}
                                </span>
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                                    log.level === "ERROR" || log.level === "WARN"
                                      ? "bg-black text-white border-zinc-900"
                                      : "bg-[#015451]/10 text-[#015451] border-[#015451]/20"
                                  }`}
                                >
                                  {log.level}
                                </span>
                              </td>
                              <td className="py-3 text-[12px] font-bold text-black">
                                {log.user?.email || "System"}
                              </td>
                              <td className="py-3 text-[11px] font-mono text-zinc-500">
                                {log.ip_address}
                              </td>
                              <td className="py-3 text-right">
                                <span className="text-[11px] font-mono text-zinc-500 truncate max-w-xs block ml-auto">
                                  {JSON.stringify(log.details)}
                                </span>
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-2 shadow-xs">
                      <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
                        Server Status
                      </span>
                      <div className="flex items-center gap-2 text-[24px] font-black text-[#015451]">
                        <CheckCircledIcon className="w-6 h-6 text-[#015451]" />
                        <span>{healthData?.status || "HEALTHY"}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-semibold">
                        Node {healthData?.nodeVersion || "v20.x"}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-2 shadow-xs">
                      <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
                        Process Uptime
                      </span>
                      <p className="text-[24px] font-black text-black">
                        {healthData?.uptimeSeconds
                          ? `${Math.floor(healthData.uptimeSeconds / 60)} minutes`
                          : "Active"}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-semibold">
                        Database: {healthData?.databaseStatus || "CONNECTED"}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-2 shadow-xs">
                      <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
                        Heap Memory Usage
                      </span>
                      <p className="text-[24px] font-black text-black">
                        {healthData?.memory?.heapUsedMB
                          ? `${healthData.memory.heapUsedMB} MB`
                          : "42 MB"}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-semibold">
                        Total RSS: {healthData?.memory?.rssMB || "95"} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "assets" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-3 shadow-xs">
                    <span className="text-[13px] font-bold text-zinc-500">
                      Total Projects
                    </span>
                    <p className="text-[32px] font-black text-black">
                      {stats?.counts?.totalProjects ?? 0}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-semibold">
                      Catalog submissions from developer users
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-3 shadow-xs">
                    <span className="text-[13px] font-bold text-zinc-500">
                      Published Blogs
                    </span>
                    <p className="text-[32px] font-black text-black">
                      {stats?.counts?.totalBlogs ?? 0}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-semibold">
                      Developer articles & platform tutorials
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-3 shadow-xs">
                    <span className="text-[13px] font-bold text-zinc-500">
                      Waitlist Subscribers
                    </span>
                    <p className="text-[32px] font-black text-black">
                      {stats?.counts?.totalWaitlist ?? 0}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-semibold">
                      Early access platform registrations
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Inspect User Details Modal */}
      {inspectUserPayload && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-[18px] font-black text-black">
                  User Telemetry Inspection
                </h3>
                <p className="text-[12px] text-zinc-500 font-medium">
                  {inspectUserPayload.user.email} (ID: {inspectUserPayload.user.id})
                </p>
              </div>
              <button
                onClick={() => setInspectUserPayload(null)}
                className="p-1 rounded-xl hover:bg-zinc-100 text-black cursor-pointer font-bold"
              >
                Close
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Authentication & Provider
                </span>
                <p className="text-[14px] font-extrabold text-black">
                  {inspectUserPayload.authProvider}
                </p>
                <p className="text-[12px] text-zinc-500 font-medium">
                  2FA Status:{" "}
                  {inspectUserPayload.user.two_factor_enabled
                    ? "Enabled"
                    : "Disabled"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Calculated Risk Telemetry
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-black border ${
                      inspectUserPayload.riskIndicators.riskLevel === "HIGH"
                        ? "bg-black text-white"
                        : "bg-[#015451]/10 text-[#015451] border-[#015451]/20"
                    }`}
                  >
                    Risk Level: {inspectUserPayload.riskIndicators.riskLevel} (
                    {inspectUserPayload.riskIndicators.riskScore}/100)
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 font-medium">
                  Disposable Email:{" "}
                  {inspectUserPayload.riskIndicators.isDisposableEmail
                    ? "Yes (High Risk)"
                    : "No"}
                </p>
              </div>
            </div>

            {/* Risk Flags */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-3">
              <h4 className="text-[13px] font-extrabold text-black">
                Security Risk Flags
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-bold">
                <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="text-zinc-400 block text-[10px]">
                    Countries Count
                  </span>
                  <span className="text-black">
                    {inspectUserPayload.riskIndicators.countriesCount}
                  </span>
                </div>
                <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="text-zinc-400 block text-[10px]">
                    Active Devices
                  </span>
                  <span className="text-black">
                    {inspectUserPayload.riskIndicators.devicesCount}
                  </span>
                </div>
                <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="text-zinc-400 block text-[10px]">
                    Shared Accounts
                  </span>
                  <span className="text-black">
                    {inspectUserPayload.riskIndicators.sharedDeviceAccountsCount}
                  </span>
                </div>
                <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="text-zinc-400 block text-[10px]">
                    Suspicious Logins
                  </span>
                  <span className="text-black">
                    {inspectUserPayload.riskIndicators.suspiciousLogins
                      ? "Flagged"
                      : "Clean"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sessions list */}
            <div className="space-y-3">
              <h4 className="text-[13px] font-extrabold text-black">
                Active & Recent Sessions ({inspectUserPayload.recentSessions.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[10px] font-bold text-zinc-400">
                      <th className="pb-2">IP Address</th>
                      <th className="pb-2">Device & OS</th>
                      <th className="pb-2">Browser</th>
                      <th className="pb-2">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {inspectUserPayload.recentSessions.map((s) => (
                      <tr key={s.id}>
                        <td className="py-2 font-mono">{s.ip_address}</td>
                        <td className="py-2">
                          {s.device_type} · {s.os}
                        </td>
                        <td className="py-2">{s.browser_name}</td>
                        <td className="py-2 text-zinc-400">
                          {new Date(s.last_active).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setInspectUserPayload(null)}
                className="px-4 py-2 bg-black text-white font-bold rounded-xl text-[12px] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditedUser}
            className="bg-white rounded-3xl border border-zinc-200 max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-[16px] font-extrabold text-black">
              Edit User Profile ({editProfileUser.email})
            </h3>

            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block text-zinc-500 font-bold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editFormData.username}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, username: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 font-bold mb-1">
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
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-medium focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 font-bold mb-1">
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
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 font-bold mb-1">
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
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-medium focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditProfileUser(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-black font-bold text-[12px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-[12px] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Send Notification Email Modal */}
      {emailModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSendAdminEmail}
            className="bg-white rounded-3xl border border-zinc-200 max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-[16px] font-extrabold text-black">
              Send Email to {emailModalUser.email}
            </h3>

            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block text-zinc-500 font-bold mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  placeholder="e.g. Account Verification Notice"
                  value={emailFormData.subject}
                  onChange={(e) =>
                    setEmailFormData({ ...emailFormData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-medium focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-500 font-bold mb-1">
                  Message Body
                </label>
                <textarea
                  rows={4}
                  placeholder="Type official notification message..."
                  value={emailFormData.message}
                  onChange={(e) =>
                    setEmailFormData({ ...emailFormData, message: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-medium focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEmailModalUser(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-black font-bold text-[12px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendingEmail}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-[12px] cursor-pointer disabled:opacity-50"
              >
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
