"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SafeUser, ApiResponse } from "../types/auth";
import { apiFetch, setAccessToken, setRefreshToken } from "../lib/api";
import Loader from "@/components/Loader";
import VideoLoaderBackground from "@/components/VideoLoaderBackground";

interface AuthContextType {
  user: SafeUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ require2FA?: boolean; twoFactorToken?: string } | void>;
  verify2FA: (
    twoFactorToken: string,
    otp?: string,
    recoveryCode?: string,
  ) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password?: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = [
  "/",
  "/auth",
  "/coming-soon",
  "/auth/callback",
  "/auth/verify",
  "/terms",
  "/privacy",
];

const RE_VALIDATE_INTERVAL_MS = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("dradix_auth_user");
      if (cached) {
        try { return JSON.parse(cached); } catch {}
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);
  const lastValidatedRef = useRef<number>(0);
  const router = useRouter();
  const pathname = usePathname();

  const clearAuthState = useCallback(() => {
    setUser(null);
    setVerified(true);
    setAccessToken(null);
    setRefreshToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("dradix_auth_user");
      localStorage.removeItem("isOnboarded");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("dradix_dashboard_data");
      localStorage.removeItem("dradix_profile_avatar");
      localStorage.removeItem("dradix_profile_banner");
      localStorage.removeItem("dradix_token");
      localStorage.removeItem("dradix_refresh_token");
    }
  }, []);

  const updateCachedUser = useCallback((userData: SafeUser | null) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      if (userData) {
        localStorage.setItem("dradix_auth_user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("dradix_auth_user");
      }
    }
  }, []);

  const validateWithServer = useCallback(async (): Promise<boolean> => {
    try {
      const res = await apiFetch<ApiResponse<SafeUser>>("/auth/me");
      if (res.success && res.data) {
        updateCachedUser(res.data);
        lastValidatedRef.current = Date.now();
        return true;
      } else {
        clearAuthState();
        return false;
      }
    } catch {
      clearAuthState();
      return false;
    }
  }, [updateCachedUser, clearAuthState]);

  const checkAuth = useCallback(async () => {
    await validateWithServer();
    setLoading(false);
    setVerified(true);
  }, [validateWithServer]);

  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      try {
        const res = await apiFetch<ApiResponse<SafeUser>>("/auth/me");
        if (active) {
          if (res.success && res.data) {
            updateCachedUser(res.data);
          } else {
            clearAuthState();
          }
        }
      } catch {
        if (active) clearAuthState();
      } finally {
        if (active) {
          setLoading(false);
          setVerified(true);
        }
      }
    };
    initAuth();
    return () => { active = false; };
  }, [clearAuthState, updateCachedUser]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      if (user && now - lastValidatedRef.current > RE_VALIDATE_INTERVAL_MS) {
        await validateWithServer();
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [user, validateWithServer]);

  useEffect(() => {
    const onVisibilityChange = async () => {
      if (document.visibilityState === "visible" && user) {
        const now = Date.now();
        if (now - lastValidatedRef.current > RE_VALIDATE_INTERVAL_MS) {
          await validateWithServer();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [user, validateWithServer]);

  useEffect(() => {
    if (user) {
      const hasSocials =
        user.socials &&
        typeof user.socials === "object" &&
        Object.keys(user.socials).length > 0;
      if (user.bio && hasSocials) {
        localStorage.setItem("isOnboarded", "true");
      }
    }
  }, [user]);

  useEffect(() => {
    if (!verified || loading) return;

    if (pathname.startsWith("/auth/callback")) return;

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      route === "/" ? pathname === "/" : pathname.startsWith(route),
    );

    const hasSocials =
      user?.socials &&
      typeof user.socials === "object" &&
      Object.keys(user.socials).length > 0;
    const isUserOnboarded = !!(user?.bio && hasSocials);
    const isOnboarded =
      (typeof window !== "undefined" &&
        localStorage.getItem("isOnboarded") === "true") ||
      isUserOnboarded;

    if (!user) {
      if (!isPublicRoute) {
        router.replace("/auth");
      }
    } else {
      if (!isOnboarded && pathname !== "/onboarding" && !isPublicRoute) {
        router.replace("/onboarding");
      } else if (
        isOnboarded &&
        (pathname === "/auth" || pathname === "/onboarding")
      ) {
        router.replace("/dashboard");
      } else if (!isOnboarded && pathname === "/auth") {
        router.replace("/onboarding");
      }
    }
  }, [user, pathname, loading, verified, router]);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiFetch<
        ApiResponse<{
          user: SafeUser;
          accessToken?: string;
          refreshToken?: string;
          require2FA?: boolean;
          twoFactorToken?: string;
        }>
      >("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.data?.require2FA) {
        return {
          require2FA: true,
          twoFactorToken: res.data.twoFactorToken,
        };
      }
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      }
      if (res.data?.refreshToken) {
        setRefreshToken(res.data.refreshToken);
      }
      if (res.data?.user) {
        updateCachedUser(res.data.user);
      }
      router.push("/dashboard");
    } catch (err) {
      throw err;
    }
  };

  const register = async (data: {
    email: string;
    username: string;
    password?: string;
    first_name?: string;
    last_name?: string;
  }) => {
    try {
      await apiFetch<ApiResponse<{ email: string }>>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiFetch<ApiResponse<null>>("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      clearAuthState();
      setLoading(false);
      router.push("/auth");
    }
  };
  const verify2FA = async (
    twoFactorToken: string,
    otp?: string,
    recoveryCode?: string,
  ) => {
    try {
      const res = await apiFetch<
        ApiResponse<{
          user: SafeUser;
          accessToken: string;
          refreshToken?: string;
        }>
      >("/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ twoFactorToken, otp, recoveryCode }),
      });
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      }
      if (res.data?.refreshToken) {
        setRefreshToken(res.data.refreshToken);
      }
      if (res.data?.user) {
        updateCachedUser(res.data.user);
      }
      router.push("/dashboard");
    } catch (err) {
      throw err;
    }
  };

  if (loading || !verified) {
    return (
      <VideoLoaderBackground className="fixed inset-0 min-h-screen z-50">
        <Loader />
      </VideoLoaderBackground>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, verify2FA, register, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
