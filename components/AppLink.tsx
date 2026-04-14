"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useNavigationTransition } from "@/components/NavigationTransitionProvider";
import {
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
  { children, href, onClick, target, download, transition = "auto", ...props },
  ref
) {
  const pathname = usePathname();
  const { beginNavigation } = useNavigationTransition();

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

    beginNavigation(targetPath);
  };

  return (
    <Link ref={ref} href={href} onClick={handleClick} target={target} download={download} {...props}>
      {children}
    </Link>
  );
});
