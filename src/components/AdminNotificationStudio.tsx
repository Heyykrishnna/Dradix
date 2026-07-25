"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/types/auth";

export interface AdminUserItem {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  channels: string[];
  targetType: string;
  targetFilters: Record<string, unknown>;
  isScheduled: boolean;
  scheduledAt: string | null;
  status: string;
  recipientCount: number;
  created_at: string;
}

export type TargetType =
  | "ALL"
  | "SELECTED"
  | "COUNTRY"
  | "DEVICE"
  | "ROLE"
  | "ACTIVITY"
  | "INACTIVE";

interface Props {
  usersList: AdminUserItem[];
  showNotice: (msg: string) => void;
}

export default function AdminNotificationStudio({
  usersList,
  showNotice,
}: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string>("IN_APP");
  const [targetType, setTargetType] = useState<TargetType>("ALL");

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("Desktop");
  const [roleFilter, setRoleFilter] = useState<"USER" | "ADMIN">("USER");
  const [activeDays, setActiveDays] = useState<number>(7);
  const [inactiveDays, setInactiveDays] = useState<number>(30);

  const [scheduledDateTime, setScheduledDateTime] = useState<string>("");

  const [notificationsList, setNotificationsList] = useState<
    NotificationItem[]
  >([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [estimatedCount, setEstimatedCount] = useState<number | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const PRESET_TEMPLATES = [
    {
      title: "Platform Update v2.0",
      message:
        "We have released new features and performance enhancements across your developer dashboard.",
    },
    {
      title: "Scheduled Maintenance Alert",
      message:
        "System maintenance is scheduled for tonight at 02:00 UTC. Expected downtime is 15 minutes.",
    },
    {
      title: "Welcome to Dradix Developer OS",
      message:
        "Explore your dev score, project architecture breakdown, and sync your coding profiles today.",
    },
    {
      title: "Security Policy Refresh",
      message:
        "Please review your account security and trusted device settings to keep your account safe.",
    },
  ];

  const fetchNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const res = await apiFetch<
        ApiResponse<{ notifications: NotificationItem[] }>
      >("/admin/notifications");
      if (res.success && res.data) {
        setNotificationsList(res.data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const fetchEstimate = useCallback(async () => {
    setEstimating(true);
    try {
      const targetFilters: Record<string, unknown> = {};
      if (targetType === "SELECTED") targetFilters.userIds = selectedUserIds;
      if (targetType === "COUNTRY") targetFilters.country = countryFilter;
      if (targetType === "DEVICE") targetFilters.device = deviceFilter;
      if (targetType === "ROLE") targetFilters.role = roleFilter;
      if (targetType === "ACTIVITY") targetFilters.activeDays = activeDays;
      if (targetType === "INACTIVE") targetFilters.inactiveDays = inactiveDays;

      const res = await apiFetch<ApiResponse<{ estimatedCount: number }>>(
        "/admin/notifications/estimate",
        {
          method: "POST",
          body: JSON.stringify({ targetType, targetFilters }),
        },
      );
      if (res.success && res.data) {
        setEstimatedCount(res.data.estimatedCount);
      }
    } catch (err) {
      console.error("Failed to estimate audience:", err);
    } finally {
      setEstimating(false);
    }
  }, [
    targetType,
    selectedUserIds,
    countryFilter,
    deviceFilter,
    roleFilter,
    activeDays,
    inactiveDays,
  ]);

  useEffect(() => {
    let isMounted = true;
    async function loadNotificationsOnMount() {
      setLoadingNotifications(true);
      try {
        const res = await apiFetch<
          ApiResponse<{ notifications: NotificationItem[] }>
        >("/admin/notifications");
        if (isMounted && res.success && res.data) {
          setNotificationsList(res.data.notifications || []);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        if (isMounted) {
          setLoadingNotifications(false);
        }
      }
    }
    void loadNotificationsOnMount();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchEstimate();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchEstimate]);

  const handleSelectUser = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uId) => uId !== id) : [...prev, id],
    );
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotice("Please enter a notification title.");
      return;
    }
    if (!message.trim()) {
      showNotice("Please enter a notification message.");
      return;
    }

    const isScheduled = selectedChannel === "SCHEDULED";
    if (isScheduled && !scheduledDateTime) {
      showNotice("Please select a scheduled date and time.");
      return;
    }

    setDispatching(true);
    try {
      const targetFilters: Record<string, unknown> = {};
      if (targetType === "SELECTED") targetFilters.userIds = selectedUserIds;
      if (targetType === "COUNTRY") targetFilters.country = countryFilter;
      if (targetType === "DEVICE") targetFilters.device = deviceFilter;
      if (targetType === "ROLE") targetFilters.role = roleFilter;
      if (targetType === "ACTIVITY") targetFilters.activeDays = activeDays;
      if (targetType === "INACTIVE") targetFilters.inactiveDays = inactiveDays;

      const actualChannels = isScheduled ? ["IN_APP"] : [selectedChannel];

      const res = await apiFetch<
        ApiResponse<{ notification: NotificationItem; recipientCount: number }>
      >("/admin/notifications/send", {
        method: "POST",
        body: JSON.stringify({
          title,
          message,
          channels: actualChannels,
          targetType,
          targetFilters,
          isScheduled,
          scheduledAt: isScheduled
            ? new Date(scheduledDateTime).toISOString()
            : null,
        }),
      });

      if (res.success) {
        showNotice(res.message || "Notification sent successfully.");
        setTitle("");
        setMessage("");
        setScheduledDateTime("");
        void fetchNotifications();
      } else {
        showNotice(res.message || "Failed to send notification.");
      }
    } catch (err) {
      showNotice(`Error sending notification: ${(err as Error).message}`);
    } finally {
      setDispatching(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await apiFetch<ApiResponse<null>>(
        `/admin/notifications/${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.success) {
        showNotice("Notification deleted successfully.");
        void fetchNotifications();
      }
    } catch (err) {
      showNotice(`Failed to delete notification: ${(err as Error).message}`);
    }
  };

  const filteredUsersForSelect = usersList.filter((u) => {
    if (!userSearchTerm.trim()) return true;
    const q = userSearchTerm.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md border border-zinc-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">
            Notifications Center
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure delivery channel and audience target to send or schedule
            notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-md font-mono">
            Audience:{" "}
            {estimating
              ? "Calculating..."
              : `${estimatedCount ?? usersList.length} users`}
          </div>

          <button
            onClick={() => void fetchNotifications()}
            className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium rounded-md cursor-pointer transition-colors"
          >
            {loadingNotifications ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleDispatch}
            className="bg-white rounded-md border border-zinc-200 p-5 shadow-2xs space-y-4 text-xs"
          >
            <div>
              <label className="font-semibold text-zinc-700 block mb-1.5">
                Quick Templates
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitle(tmpl.title);
                      setMessage(tmpl.message);
                    }}
                    className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Notification Title
                </label>
                <input
                  type="text"
                  placeholder="Enter notification title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-xs focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Message Body
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter notification message content..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-xs focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 space-y-1.5">
              <label className="font-semibold text-zinc-900 block">
                1. Delivery Channel (Send)
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-xs font-medium focus:outline-none focus:border-zinc-400 cursor-pointer"
              >
                <option value="EMAIL">Email</option>
                <option value="PUSH">Push</option>
                <option value="IN_APP">In-App</option>
                <option value="BROADCAST">Broadcast</option>
                <option value="SCHEDULED">Scheduled Notifications</option>
              </select>

              {selectedChannel === "SCHEDULED" && (
                <div className="pt-2">
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-xs font-mono focus:outline-none focus:border-zinc-400"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-100 space-y-2">
              <label className="font-semibold text-zinc-900 block">
                2. Audience Target
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as TargetType)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-xs font-medium focus:outline-none focus:border-zinc-400 cursor-pointer"
              >
                <option value="ALL">All Users</option>
                <option value="SELECTED">Selected Users</option>
                <option value="COUNTRY">Country</option>
                <option value="DEVICE">Device</option>
                <option value="ROLE">Role</option>
                <option value="ACTIVITY">Activity</option>
                <option value="INACTIVE">Inactive Users</option>
              </select>

              <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3 space-y-2">
                {targetType === "ALL" && (
                  <p className="text-zinc-600">
                    Sends to all registered users on the platform.
                  </p>
                )}

                {targetType === "SELECTED" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-800">
                        Selected Users ({selectedUserIds.length})
                      </span>
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="px-2 py-1 bg-white border border-zinc-200 rounded text-xs"
                      />
                    </div>
                    <div className="max-h-36 overflow-y-auto border border-zinc-200 bg-white rounded p-1 space-y-1">
                      {filteredUsersForSelect.length === 0 ? (
                        <p className="text-zinc-400 p-2 text-center">
                          No users match.
                        </p>
                      ) : (
                        filteredUsersForSelect.map((u) => {
                          const isSel = selectedUserIds.includes(u.id);
                          return (
                            <div
                              key={u.id}
                              onClick={() => handleSelectUser(u.id)}
                              className={`flex items-center justify-between p-1.5 rounded cursor-pointer ${
                                isSel
                                  ? "bg-zinc-200 font-semibold text-zinc-900"
                                  : "hover:bg-zinc-50 text-zinc-700"
                              }`}
                            >
                              <span>
                                {u.username} ({u.email})
                              </span>
                              <span className="font-mono text-zinc-400">
                                #{u.id}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {targetType === "COUNTRY" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 block">
                      Country Name / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. United States, India, Germany, Canada"
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                )}

                {targetType === "DEVICE" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 block">
                      Device Type / Browser / OS
                    </label>
                    <select
                      value={deviceFilter}
                      onChange={(e) => setDeviceFilter(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-400"
                    >
                      <option value="Desktop">
                        Desktop (macOS / Windows / Linux)
                      </option>
                      <option value="Mobile">Mobile (iOS / Android)</option>
                      <option value="Chrome">Google Chrome</option>
                      <option value="Safari">Safari</option>
                      <option value="Firefox">Firefox</option>
                    </select>
                  </div>
                )}

                {targetType === "ROLE" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 block">
                      User Role
                    </label>
                    <select
                      value={roleFilter}
                      onChange={(e) =>
                        setRoleFilter(e.target.value as "USER" | "ADMIN")
                      }
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-400"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                )}

                {targetType === "ACTIVITY" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 block">
                      Active in Last (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={activeDays}
                      onChange={(e) => setActiveDays(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs font-mono"
                    />
                  </div>
                )}

                {targetType === "INACTIVE" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 block">
                      Inactive For More Than (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={inactiveDays}
                      onChange={(e) => setInactiveDays(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={dispatching}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {dispatching
                  ? "Processing..."
                  : selectedChannel === "SCHEDULED"
                    ? "Schedule Notification"
                    : "Send Notification"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-md border border-zinc-200 p-5 shadow-2xs space-y-3 text-xs">
          <h3 className="font-semibold text-zinc-900">Summary & Preview</h3>
          <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3 space-y-2">
            <p className="font-semibold text-zinc-900">
              {title || "Notification Title"}
            </p>
            <p className="text-zinc-600 leading-relaxed">
              {message || "Notification body message preview..."}
            </p>
            <div className="pt-2 border-t border-zinc-200 flex flex-col gap-1 text-[11px] text-zinc-500 font-mono">
              <div>Channel: {selectedChannel}</div>
              <div>Target: {targetType}</div>
              <div>Estimated Reach: {estimatedCount ?? 0} users</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border border-zinc-200 p-5 shadow-2xs space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <h3 className="font-semibold text-zinc-900">
            History & Scheduled Queue
          </h3>
          <span className="font-mono text-zinc-500">
            Count: {notificationsList.length}
          </span>
        </div>

        <div className="overflow-x-auto border border-zinc-200 rounded">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-semibold text-zinc-600">
                <th className="p-2.5">Title</th>
                <th className="p-2.5">Channel</th>
                <th className="p-2.5">Target</th>
                <th className="p-2.5">Recipients</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Date</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs">
              {loadingNotifications ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-zinc-400">
                    Loading history...
                  </td>
                </tr>
              ) : notificationsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-zinc-400">
                    No notifications recorded.
                  </td>
                </tr>
              ) : (
                notificationsList.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50">
                    <td className="p-2.5 font-medium text-zinc-900">
                      {item.title}
                    </td>
                    <td className="p-2.5 font-mono text-zinc-600">
                      {item.channels?.join(", ") || "IN_APP"}
                    </td>
                    <td className="p-2.5 font-mono text-zinc-600">
                      {item.targetType}
                    </td>
                    <td className="p-2.5 font-mono text-zinc-900">
                      {item.recipientCount}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          item.status === "SCHEDULED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-zinc-500">
                      {item.isScheduled && item.scheduledAt
                        ? `Scheduled: ${new Date(item.scheduledAt).toLocaleString()}`
                        : new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
