"use client";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const EXTERNAL_HREF_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const PAGE_ENTER_DURATION_SECONDS = 0.24;
export const VEIL_IN_DURATION_SECONDS = 0.12;
export const VEIL_OUT_DURATION_SECONDS = 0.16;
export const REDUCED_DURATION_SECONDS = 0.1;
export const NAVIGATION_TIMEOUT_MS = 3000;
export const PREMIUM_EASE = EASE_OUT;

function ensureLeadingSlash(value: string): string {
  if (!value) {
    return "/";
  }

  return value.startsWith("/") ? value : `/${value}`;
}

export function stripBasePath(pathname: string): string {
  if (!BASE_PATH || !pathname.startsWith(BASE_PATH)) {
    return pathname || "/";
  }

  const stripped = pathname.slice(BASE_PATH.length);
  return stripped || "/";
}

export function normalizePathname(pathname?: string | null): string {
  const strippedPath = stripBasePath(ensureLeadingSlash(pathname ?? "/"));

  if (strippedPath.length > 1 && strippedPath.endsWith("/")) {
    return strippedPath.slice(0, -1);
  }

  return strippedPath || "/";
}

export function isExternalHref(href: string): boolean {
  if (!href) {
    return false;
  }

  return (
    EXTERNAL_HREF_PATTERN.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("data:") ||
    href.startsWith("javascript:")
  );
}

export function hrefToPathname(href: string, currentPathname?: string | null): string | null {
  if (!href || href.startsWith("#") || isExternalHref(href)) {
    return null;
  }

  try {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `https://example.invalid${normalizePathname(currentPathname)}`;
    const url = new URL(href, baseUrl);
    return normalizePathname(url.pathname);
  } catch {
    return null;
  }
}

export function getTransitionTarget(href: string, currentPathname?: string | null): string | null {
  const targetPathname = hrefToPathname(href, currentPathname);
  if (!targetPathname) {
    return null;
  }

  return targetPathname === normalizePathname(currentPathname) ? null : targetPathname;
}

export function isModifiedNavigationEvent(
  event: Pick<MouseEvent, "button" | "metaKey" | "altKey" | "ctrlKey" | "shiftKey">
): boolean {
  return event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}
