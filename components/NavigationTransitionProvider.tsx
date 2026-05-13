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
import { getTransitionTarget, NAVIGATION_TIMEOUT_MS } from "@/lib/client/navigationTransition";

type NavigationTransitionContextValue = {
  isNavigating: boolean;
  pendingPath: string | null;
  beginNavigation: (targetPath: string) => void;
  finishNavigation: (delayMs?: number) => void;
};

type PatchedHistoryMethod = typeof window.history.pushState & {
  __kkNavigationTransitionPatched?: true;
  __kkNavigationTransitionBase?: typeof window.history.pushState;
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

  useEffect(() => {
    const beginForHistoryUrl = (url?: string | URL | null) => {
      if (url === undefined || url === null) {
        return;
      }

      const targetPath = getTransitionTarget(String(url), window.location.pathname);
      if (targetPath) {
        beginNavigation(targetPath);
      }
    };

    const patchHistory = () => {
      const currentPushState = window.history.pushState as PatchedHistoryMethod;
      const currentReplaceState = window.history.replaceState as PatchedHistoryMethod;

      if (!currentPushState.__kkNavigationTransitionPatched) {
        const basePushState = currentPushState;
        const patchedPushState = function patchedPushState(
          this: History,
          ...args: Parameters<typeof window.history.pushState>
        ) {
          const [, , url] = args;
          beginForHistoryUrl(url);
          return basePushState.apply(this, args);
        } as PatchedHistoryMethod;
        patchedPushState.__kkNavigationTransitionPatched = true;
        patchedPushState.__kkNavigationTransitionBase = basePushState;
        window.history.pushState = patchedPushState;
      }

      if (!currentReplaceState.__kkNavigationTransitionPatched) {
        const baseReplaceState = currentReplaceState;
        const patchedReplaceState = function patchedReplaceState(
          this: History,
          ...args: Parameters<typeof window.history.replaceState>
        ) {
          const [, , url] = args;
          beginForHistoryUrl(url);
          return baseReplaceState.apply(this, args);
        } as PatchedHistoryMethod;
        patchedReplaceState.__kkNavigationTransitionPatched = true;
        patchedReplaceState.__kkNavigationTransitionBase = baseReplaceState;
        window.history.replaceState = patchedReplaceState;
      }
    };

    patchHistory();
    const animationFrame = window.requestAnimationFrame(patchHistory);
    const deferredPatchTimer = window.setTimeout(patchHistory, 250);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(deferredPatchTimer);

      const currentPushState = window.history.pushState as PatchedHistoryMethod;
      if (currentPushState.__kkNavigationTransitionPatched && currentPushState.__kkNavigationTransitionBase) {
        window.history.pushState = currentPushState.__kkNavigationTransitionBase;
      }

      const currentReplaceState = window.history.replaceState as PatchedHistoryMethod;
      if (currentReplaceState.__kkNavigationTransitionPatched && currentReplaceState.__kkNavigationTransitionBase) {
        window.history.replaceState = currentReplaceState.__kkNavigationTransitionBase;
      }
    };
  }, [beginNavigation]);

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
    <NavigationTransitionContext.Provider value={value}>
      {children}
      {isNavigating ? (
        <>
          <div aria-hidden="true" className="kk-route-transition-bar" />
          <div aria-hidden="true" className="kk-route-transition-veil" />
          <span className="sr-only" role="status" aria-live="polite">
            Loading next page
          </span>
        </>
      ) : null}
    </NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition() {
  const context = useContext(NavigationTransitionContext);

  if (!context) {
    throw new Error("useNavigationTransition must be used within NavigationTransitionProvider");
  }

  return context;
}
