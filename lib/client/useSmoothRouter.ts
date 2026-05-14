"use client";

import { addTransitionType, startTransition, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useNavigationTransition } from "@/components/NavigationTransitionProvider";
import { getNavigationTransitionType, getTransitionTarget } from "@/lib/client/navigationTransition";

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
      const transitionType = getNavigationTransitionType(href, pathname);
      if (targetPath) {
        beginNavigation(targetPath);
      }

      let navigationError: unknown;

      startTransition(() => {
        try {
          if (transitionType) {
            addTransitionType(transitionType);
          }
          router.push(href, options);
        } catch (error) {
          if (targetPath) {
            finishNavigation();
          }
          navigationError = error;
        }
      });

      if (navigationError) {
        throw navigationError;
      }
    },
    [beginNavigation, finishNavigation, pathname, router]
  );

  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      const targetPath = getTransitionTarget(href, pathname);
      const transitionType = getNavigationTransitionType(href, pathname);
      if (targetPath) {
        beginNavigation(targetPath);
      }

      let navigationError: unknown;

      startTransition(() => {
        try {
          if (transitionType) {
            addTransitionType(transitionType);
          }
          router.replace(href, options);
        } catch (error) {
          if (targetPath) {
            finishNavigation();
          }
          navigationError = error;
        }
      });

      if (navigationError) {
        throw navigationError;
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
