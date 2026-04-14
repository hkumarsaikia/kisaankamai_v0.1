"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useNavigationTransition } from "@/components/NavigationTransitionProvider";
import { getTransitionTarget } from "@/lib/client/navigationTransition";

type NavigateOptions = {
  scroll?: boolean;
};

export function useSmoothRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const { beginNavigation, finishNavigation } = useNavigationTransition();

  const push = useCallback(
    (href: string, options?: NavigateOptions) => {
      const targetPath = getTransitionTarget(href, pathname);
      if (targetPath) {
        beginNavigation(targetPath);
      }

      try {
        router.push(href, options);
      } catch (error) {
        if (targetPath) {
          finishNavigation();
        }
        throw error;
      }
    },
    [beginNavigation, finishNavigation, pathname, router]
  );

  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      const targetPath = getTransitionTarget(href, pathname);
      if (targetPath) {
        beginNavigation(targetPath);
      }

      try {
        router.replace(href, options);
      } catch (error) {
        if (targetPath) {
          finishNavigation();
        }
        throw error;
      }
    },
    [beginNavigation, finishNavigation, pathname, router]
  );

  return {
    back: router.back,
    forward: router.forward,
    prefetch: router.prefetch,
    refresh: router.refresh,
    push,
    replace,
  };
}
