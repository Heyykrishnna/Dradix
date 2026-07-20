"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SafeUser, ApiResponse } from "../types/auth";
import { apiFetch, setAccessToken, setRefreshToken } from "../lib/api";

interface AuthContextType {
  user: SafeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ require2FA?: boolean; twoFactorToken?: string } | void>;
  verify2FA: (twoFactorToken: string, otp?: string, recoveryCode?: string) => Promise<void>;
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
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const res = await apiFetch<ApiResponse<SafeUser>>("/auth/me");
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      try {
        const res = await apiFetch<ApiResponse<SafeUser>>("/auth/me");
        if (active) {
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    initAuth();
    return () => {
      active = false;
    };
  }, []);

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
    if (loading) return;

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
      } else if (pathname === "/auth") {
        router.replace("/onboarding");
      }
    }
  }, [user, pathname, loading, router]);

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
        setUser(res.data.user);
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
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("isOnboarded");
        localStorage.removeItem("userProfile");
      }
      setLoading(false);
      router.push("/auth");
    }
  };
  const verify2FA = async (twoFactorToken: string, otp?: string, recoveryCode?: string) => {
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
        setUser(res.data.user);
      }
      router.push("/dashboard");
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center text-zinc-500 font-sans text-sm tracking-wider">
        Loading
      </div>
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
