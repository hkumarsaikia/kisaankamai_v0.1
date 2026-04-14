"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { NAVIGATION_TIMEOUT_MS } from "@/lib/client/navigationTransition";

type NavigationTransitionContextValue = {
  isNavigating: boolean;
  pendingPath: string | null;
  beginNavigation: (targetPath: string) => void;
  finishNavigation: (delayMs?: number) => void;
};

const NavigationTransitionContext = createContext<NavigationTransitionContextValue | null>(null);

export function NavigationTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPathRef = useRef(pathname);

  const clearTimers = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  }, []);

  const finishNavigation = useCallback(
    (delayMs = 0) => {
      clearTimers();

      const finalize = () => {
        setIsNavigating(false);
        setPendingPath(null);
      };

      if (delayMs > 0) {
        finishTimerRef.current = setTimeout(finalize, delayMs);
        return;
      }

      finalize();
    },
    [clearTimers]
  );

  const beginNavigation = useCallback(
    (targetPath: string) => {
      clearTimers();
      setPendingPath(targetPath);
      setIsNavigating(true);
      fallbackTimerRef.current = setTimeout(() => finishNavigation(), NAVIGATION_TIMEOUT_MS);
    },
    [clearTimers, finishNavigation]
  );

  useEffect(() => {
    if (pathname !== previousPathRef.current) {
      previousPathRef.current = pathname;

      if (isNavigating) {
        finishNavigation();
      }
    }
  }, [finishNavigation, isNavigating, pathname]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const value = useMemo(
    () => ({
      isNavigating,
      pendingPath,
      beginNavigation,
      finishNavigation,
    }),
    [beginNavigation, finishNavigation, isNavigating, pendingPath]
  );

  return (
    <NavigationTransitionContext.Provider value={value}>{children}</NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition() {
  const context = useContext(NavigationTransitionContext);

  if (!context) {
    throw new Error("useNavigationTransition must be used within NavigationTransitionProvider");
  }

  return context;
}
