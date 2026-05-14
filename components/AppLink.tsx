"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  addTransitionType,
  forwardRef,
  startTransition,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useNavigationTransition } from "@/components/NavigationTransitionProvider";
import {
  getNavigationTransitionType,
  getTransitionTarget,
  isModifiedNavigationEvent,
} from "@/lib/client/navigationTransition";

type AnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export type AppLinkProps = LinkProps &
  AnchorProps & {
    children: ReactNode;
    transition?: "auto" | "off";
  };

export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { children, href, onClick, target, download, replace, scroll, transition = "auto", transitionTypes, ...props },
  ref
) {
  const router = useRouter();
  const pathname = usePathname();
  const { beginNavigation, finishNavigation } = useNavigationTransition();
  const inferredTransitionType =
    transition === "auto" && typeof href === "string" ? getNavigationTransitionType(href, pathname) : null;
  const resolvedTransitionTypes = transitionTypes || (inferredTransitionType ? [inferredTransitionType] : undefined);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || transition === "off") {
      return;
    }

    if (typeof href !== "string") {
      return;
    }

    if (download || (target && target !== "_self") || isModifiedNavigationEvent(event.nativeEvent)) {
      return;
    }

    const targetPath = getTransitionTarget(href, pathname);
    if (!targetPath) {
      return;
    }

    event.preventDefault();
    beginNavigation(targetPath);

    let navigationError: unknown;

    startTransition(() => {
      try {
        if (inferredTransitionType) {
          addTransitionType(inferredTransitionType);
        }

        if (replace) {
          router.replace(href, { scroll });
          return;
        }

        router.push(href, { scroll });
      } catch (error) {
        finishNavigation();
        navigationError = error;
      }
    });

    if (navigationError) {
      throw navigationError;
    }
  };

  return (
    <Link
      ref={ref}
      href={href}
      onClick={handleClick}
      target={target}
      download={download}
      replace={replace}
      scroll={scroll}
      transitionTypes={resolvedTransitionTypes}
      {...props}
    >
      {children}
    </Link>
  );
});
