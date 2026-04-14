"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { clearDemoSession, readDemoLocalSession } from "@/lib/demoAuth";
import type { LocalSession, ProfileRecord } from "@/lib/local-data/types";

interface AuthContextType {
  user: LocalSession["user"] | null;
  profile: ProfileRecord | null;
  activeWorkspace: LocalSession["activeWorkspace"] | null;
  loading: boolean;
  isProfileComplete: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setSession: (session: LocalSession | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  activeWorkspace: null,
  loading: false,
  isProfileComplete: false,
  logout: async () => {},
  refreshProfile: async () => {},
  setSession: () => {},
});

export const useAuth = () => useContext(AuthContext);

const isPagesDemoBuild =
  process.env.NEXT_PUBLIC_BUILD_TARGET === "pages" &&
  process.env.NEXT_PUBLIC_DEMO_AUTH_MODE === "true";

async function fetchCurrentSession() {
  const response = await fetch("/api/auth/session", {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load session.");
  }

  const payload = (await response.json()) as { session: LocalSession | null };
  return payload.session;
}

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: LocalSession | null;
}) {
  const [session, setSessionState] = useState<LocalSession | null>(() =>
    initialSession || (isPagesDemoBuild ? readDemoLocalSession() : null)
  );
  const [loading, setLoading] = useState(false);

  const setSession = (nextSession: LocalSession | null) => {
    setSessionState(nextSession);
  };

  const refreshProfile = async () => {
    setLoading(true);
    try {
      if (isPagesDemoBuild) {
        setSessionState(readDemoLocalSession());
        return;
      }

      setSessionState(await fetchCurrentSession());
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isPagesDemoBuild) {
        clearDemoSession();
        setSessionState(null);
        return;
      }

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setSessionState(null);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user: session?.user || null,
      profile: session?.profile || null,
      activeWorkspace: session?.activeWorkspace || null,
      loading,
      isProfileComplete: Boolean(session?.profile?.phone && session.profile?.pincode),
      logout,
      refreshProfile,
      setSession,
    }),
    [loading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
