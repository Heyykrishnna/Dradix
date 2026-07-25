"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  BellIcon,
  TargetIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

interface AdminUserItem {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: "USER" | "ADMIN" | string;
  is_verified: boolean;
  developer_score: number;
  created_at: string;
  _count?: {
    projects: number;
    userSessions: number;
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
  systemHealth: string;
}

interface RevenueItem {
  month: string;
  target: number;
  booked: number;
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

interface AnalyticsData {
  revenueVsTarget: RevenueItem[];
  upcomingActivities: ActivityItem[];
  dealFlow: { weeks: DealWeekItem[] };
  openPipeline: PipelineRowItem[];
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

  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

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
      if (userSearch) query.append("search", userSearch);
      if (roleFilter) query.append("role", roleFilter);

      const res = await apiFetch<
        ApiResponse<{ users: AdminUserItem[]; pagination: PaginationMeta }>
      >(`/admin/users?${query.toString()}`);
      if (res.success && res.data) {
        setUsersList(res.data.users);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, roleFilter]);

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
        }
      }
    }
    void loadTabData();
    return () => {
      ignore = true;
    };
  }, [activeTab, fetchAnalytics, fetchUsers, fetchLogs, fetchHealth]);

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
        void fetchAnalytics();
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
        void fetchAnalytics();
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
        void fetchAnalytics();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete user";
      showNotice(msg, "error");
    } finally {
      setUpdatingUserId(null);
    }
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
  const dealWeeks = analyticsData?.dealFlow?.weeks || [];
  const pipelineRows = analyticsData?.openPipeline || [];

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
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === "dashboard"
                  ? "bg-black text-white shadow-xs"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-50"
              }`}
            >
              <DashboardIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === "users"
                  ? "bg-black text-white shadow-xs"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <PersonIcon className="w-4 h-4" />
                <span>Users & Roles</span>
              </div>
              {stats && (
                <span className="text-[10px] bg-[#015451]/10 text-[#015451] border border-[#015451]/20 font-extrabold px-2 py-0.5 rounded-full">
                  {stats.counts.totalUsers}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === "logs"
                  ? "bg-black text-white shadow-xs"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <ActivityLogIcon className="w-4 h-4" />
                <span>System Logs</span>
              </div>
              {stats && (
                <span className="text-[10px] bg-zinc-100 text-black border border-zinc-200 font-extrabold px-2 py-0.5 rounded-full">
                  {stats.counts.totalLogs}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("health")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === "health"
                  ? "bg-black text-white shadow-xs"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <RocketIcon className="w-4 h-4" />
                <span>Infrastructure</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#015451] animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab("assets")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === "assets"
                  ? "bg-black text-white shadow-xs"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-50"
              }`}
            >
              <FileTextIcon className="w-4 h-4" />
              <span>Platform Assets</span>
            </button>
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
              className="p-1 text-zinc-400 hover:text-black transition-colors"
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
              {activeTab === "users" && "User & Role Directory"}
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
          {activeTab === "dashboard" && (
            <>
              {/* Top Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 shadow-xs hover:border-black transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
                      Platform Activity
                    </span>
                    <LightningBoltIcon className="w-5 h-5 text-[#015451]" />
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[24px] font-black tracking-tight text-black truncate">
                      {stats?.pipelineValue?.value || "0 PTS"}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#015451] bg-[#015451]/10 border border-[#015451]/20 px-2 py-0.5 rounded-full">
                      {stats?.pipelineValue?.changePercent || "+0"}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-semibold truncate">
                    {stats?.pipelineValue?.comparison || "Real platform score"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 shadow-xs hover:border-black transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
                      Total Accounts
                    </span>
                    <PersonIcon className="w-5 h-5 text-[#015451]" />
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[26px] font-black tracking-tight text-black">
                      {stats?.openDeals?.value ?? 0}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#015451] bg-[#015451]/10 border border-[#015451]/20 px-2 py-0.5 rounded-full">
                      {stats?.openDeals?.badgeText || "0 new"}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-semibold">
                    {stats?.openDeals?.subtext || "registered users"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 shadow-xs hover:border-black transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
                      Active Admins
                    </span>
                    <RocketIcon className="w-5 h-5 text-[#015451]" />
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[26px] font-black tracking-tight text-black">
                      {stats?.wonThisMonth?.value || "0"}
                    </span>
                    <span className="text-[11px] font-extrabold text-black bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full">
                      {stats?.wonThisMonth?.changePercent || "Admin Role"}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-semibold">
                    {stats?.wonThisMonth?.subtext || "operator privileges"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 shadow-xs hover:border-black transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
                      Pending Follow-up
                    </span>
                    <BellIcon className="w-5 h-5 text-[#015451]" />
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[26px] font-black tracking-tight text-black">
                      {stats?.activitiesDue?.value ?? 0}
                    </span>
                    <span className="text-[11px] font-extrabold text-black bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full">
                      {stats?.activitiesDue?.overdueCount ?? 0} pending
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-semibold">
                    {stats?.activitiesDue?.subtext || "unverified accounts"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 shadow-xs hover:border-black transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
                      Verified Rate
                    </span>
                    <TargetIcon className="w-5 h-5 text-[#015451]" />
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[26px] font-black tracking-tight text-black">
                      {stats?.conversionRate?.value || "100%"}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#015451] bg-[#015451]/10 border border-[#015451]/20 px-2 py-0.5 rounded-full">
                      {stats?.conversionRate?.changePercent || "100% Verified"}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-semibold">
                    {stats?.conversionRate?.subtext || "user verification rate"}
                  </p>
                </div>
              </div>

              {/* Dynamic Chart & Audit Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[15px] font-bold text-black">
                        Monthly Activity & Registration Growth
                      </h3>
                      <p className="text-[12px] text-zinc-500 font-medium">
                        Real database signups and platform submissions over
                        trailing 12 months
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
                        Audit Feed
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[15px] font-bold text-black">
                        8-Week Stream
                      </h3>
                      <p className="text-[12px] text-zinc-500 font-medium">
                        Platform registrations & system logs
                      </p>
                    </div>

                    <span className="text-[11px] font-extrabold text-[#015451] bg-[#015451]/10 px-2.5 py-1 rounded-full border border-[#015451]/20">
                      Synced DB
                    </span>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="h-44 flex items-end justify-between gap-3">
                      {dealWeeks.map((item: DealWeekItem, i: number) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                        >
                          <div className="w-full flex flex-col items-center justify-end h-36">
                            <div
                              style={{
                                height: `${Math.min(item.won * 10, 100)}px`,
                              }}
                              className="w-full max-w-7 bg-[#015451] rounded-t-md transition-all group-hover:bg-[#013b39]"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500">
                            {item.week}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[15px] font-bold text-black">
                        Platform Stage Breakdown
                      </h3>
                      <p className="text-[12px] text-zinc-500 font-medium">
                        Live DB table allocations & authorization share
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-black bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#015451] animate-pulse" />
                      Live Sync
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[13px]">
                      <thead>
                        <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          <th className="pb-3 font-bold">Stage</th>
                          <th className="pb-3 font-bold text-center">Count</th>
                          <th className="pb-3 font-bold">Share</th>
                          <th className="pb-3 font-bold text-right">Value</th>
                          <th className="pb-3 font-bold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {pipelineRows.map(
                          (row: PipelineRowItem, idx: number) => (
                            <tr
                              key={idx}
                              className="hover:bg-zinc-50 transition-colors"
                            >
                              <td className="py-3.5 font-extrabold text-black">
                                {row.stage}
                              </td>
                              <td className="py-3.5 text-center font-bold text-zinc-600">
                                {row.deals}
                              </td>
                              <td className="py-3.5">
                                <div className="flex items-center gap-3 w-48">
                                  <div className="flex-1 bg-zinc-100 h-2 rounded-full overflow-hidden">
                                    <div
                                      style={{
                                        width: `${Math.min(row.sharePct, 100)}%`,
                                      }}
                                      className="bg-[#015451] h-full rounded-full"
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-zinc-500 w-8">
                                    {row.sharePct}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 text-right font-black text-black">
                                {row.value}
                              </td>
                              <td className="py-3.5 text-right font-semibold text-zinc-500">
                                {row.conversion}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                <div>
                  <h3 className="text-[16px] font-extrabold text-black">
                    User & Role Directory
                  </h3>
                  <p className="text-[12px] text-zinc-500 font-medium">
                    Manage accounts, assign roles (USER & ADMIN), verify users,
                    and handle account operations.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] font-medium text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-black focus:outline-none focus:border-black"
                  >
                    <option value="">All Roles</option>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      <th className="pb-3 font-bold">User</th>
                      <th className="pb-3 font-bold">Role</th>
                      <th className="pb-3 font-bold">Verification</th>
                      <th className="pb-3 font-bold text-center">Score</th>
                      <th className="pb-3 font-bold text-center">Joined</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {loadingUsers ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-zinc-400 italic"
                        >
                          Loading users list...
                        </td>
                      </tr>
                    ) : usersList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-zinc-400 italic"
                        >
                          No users found matching filter
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-zinc-50 transition-colors"
                        >
                          <td className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-black text-white border border-zinc-900 flex items-center justify-center font-black text-[12px] shrink-0">
                                {u.username[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-extrabold text-black leading-tight">
                                  {u.first_name
                                    ? `${u.first_name} ${u.last_name || ""}`
                                    : u.username}
                                </p>
                                <p className="text-[11px] text-zinc-500 font-medium">
                                  {u.email}
                                </p>
                              </div>
                            </div>
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
                                handleToggleVerification(u.id, u.is_verified)
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

                          <td className="py-3.5 text-center font-black text-black">
                            {u.developer_score || 0}
                          </td>

                          <td className="py-3.5 text-center text-[11px] text-zinc-500 font-medium">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>

                          <td className="py-3.5 text-right">
                            <button
                              disabled={
                                updatingUserId === u.id || u.id === user?.id
                              }
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="px-2.5 py-1 rounded-xl bg-black text-white hover:bg-zinc-800 text-[11px] font-bold border border-zinc-900 transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <TrashIcon className="w-3 h-3 text-[#015451]" />
                              <span>Delete</span>
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

          {activeTab === "logs" && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                <div>
                  <h3 className="text-[16px] font-extrabold text-black">
                    System Audit Trail
                  </h3>
                  <p className="text-[12px] text-zinc-500 font-medium">
                    Real-time administrative actions, security checks, and role
                    events.
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
        </div>
      </main>
    </div>
  );
}
