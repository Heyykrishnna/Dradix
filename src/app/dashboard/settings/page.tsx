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
  const { logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionToken, setCurrentSessionToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchSessions = async () => {
    try {
      const res = await apiFetch<ApiResponse<{ sessions: Session[]; currentSessionToken: string }>>("/auth/sessions");
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
      setErrorMsg(err instanceof Error ? err.message : "Failed to load active sessions");
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

    if (!confirm("Are you sure you want to terminate this session? The device will be logged out immediately.")) {
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
      setErrorMsg(err instanceof Error ? err.message : "Failed to terminate session");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeOther = async () => {
    if (!confirm("Are you sure you want to log out of all other devices? This action cannot be undone.")) {
      return;
    }

    setBulkLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiFetch<ApiResponse<null>>("/auth/sessions/logout-other", {
        method: "POST",
      });
      if (res.success) {
        setSuccessMsg("Logged out of all other devices successfully.");
        setSessions(sessions.filter((s) => s.session_token === currentSessionToken));
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to terminate other sessions");
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
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 text-zinc-900">Account Settings</h1>
          <p className="text-zinc-500 text-sm">
            Manage your account security, active login sessions, and connected devices.
          </p>
        </div>

        {errorMsg && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex justify-between items-center animate-fadeIn">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="text-red-500 hover:text-red-700 transition-colors">
              <Cross1Icon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex justify-between items-center animate-fadeIn">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg("")} className="text-emerald-500 hover:text-emerald-700 transition-colors">
              <Cross1Icon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="bg-white border border-zinc-200/80 shadow-xs rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Active Device Sessions</h2>
              <p className="text-zinc-500 text-xs mt-1">
                You are currently signed in to these devices. Terminate any sessions you don&apos;t recognize.
              </p>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleRevokeOther}
                disabled={bulkLoading}
                className="self-start sm:self-center px-4 py-2 bg-[#003c3a] hover:bg-[#002d2b] text-white disabled:opacity-50 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {bulkLoading ? "Logging out others..." : "Logout All Other Devices"}
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
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ) : isTablet ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                          {session.browser_name || "Unknown Browser"} {session.browser_version || ""} on {session.os || "Unknown OS"}
                        </p>
                        <p className="text-zinc-500 text-[11px]">
                          IP: <span className="text-zinc-700 font-medium">{session.ip_address || "Unknown"}</span> • Location: <span className="text-zinc-700 font-medium">{session.location || "Unknown Location"}</span>
                        </p>
                        <p className="text-zinc-400 text-[10px] pt-1">
                          Logged in: {formatDate(session.created_at)} • Last active: {session.relativeActive || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRevoke(session.id, session.session_token)}
                      disabled={actionLoading === session.id}
                      className={`p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-red-600 shrink-0 cursor-pointer ${
                        isCurrent ? "hover:bg-red-50 hover:text-red-600" : ""
                      }`}
                      title={isCurrent ? "Logout this device" : "Terminate session"}
                    >
                      {actionLoading === session.id ? (
                        <div className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
                      ) : isCurrent ? (
                        <ExitIcon className="w-4 h-4" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
