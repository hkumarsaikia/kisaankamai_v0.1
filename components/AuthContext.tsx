"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getOptionalFirebaseAuthClient } from "@/components/auth/firebase-auth-client";
import { emitAuthSyncEvent, subscribeToAuthSyncEvents } from "@/lib/client/auth-sync";
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
  const router = useRouter();
  const [session, setSessionState] = useState<LocalSession | null>(initialSession);
  const [loading, setLoading] = useState(false);
  const refreshInFlight = useRef<Promise<void> | null>(null);
  const mounted = useRef(false);

  const setSession = useCallback((nextSession: LocalSession | null) => {
    setSessionState(nextSession);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (refreshInFlight.current) {
      return refreshInFlight.current;
    }

    const refresh = (async () => {
      setLoading(true);
      try {
        const nextSession = await fetchCurrentSession();
        if (mounted.current) {
          setSessionState(nextSession);
          router.refresh();
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
        refreshInFlight.current = null;
      }
    })();

    refreshInFlight.current = refresh;
    return refresh;
  }, [router]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      await getOptionalFirebaseAuthClient()?.signOut().catch(() => undefined);
      setSessionState(null);
      emitAuthSyncEvent("logout");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    mounted.current = true;

    const unsubscribe = subscribeToAuthSyncEvents(() => {
      void refreshProfile();
    });

    const refreshWhenVisible = () => {
      if (document.visibilityState !== "hidden") {
        void refreshProfile();
      }
    };

    const refreshOnPageShow = () => {
      void refreshProfile();
    };

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("pageshow", refreshOnPageShow);

    return () => {
      mounted.current = false;
      unsubscribe();
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("pageshow", refreshOnPageShow);
    };
  }, [refreshProfile]);

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
    [loading, logout, refreshProfile, session, setSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
