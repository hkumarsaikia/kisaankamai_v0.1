import { NextResponse } from "next/server.js";

const SESSION_COOKIE_NAME = "kisan_kamai_session";
const WORKSPACE_COOKIE_NAME = "kisan_kamai_workspace";
const CRAWLER_HEADER_NAME = "x-kisan-kamai-crawler";
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PROTECTED_ROUTES = ["/list-equipment"];
const CRAWLER_USER_AGENT_PATTERN =
  /\b(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|facebot|twitterbot|linkedinbot|telegrambot|whatsapp|discordbot|slackbot|applebot|pinterestbot)\b/i;

function hasSessionCookie(request) {
  const value = request.cookies.get(SESSION_COOKIE_NAME)?.value?.trim();
  return Boolean(value && value !== "undefined" && value !== "null");
}

function resolveWorkspaceDashboard(request) {
  const workspace = request.cookies.get(WORKSPACE_COOKIE_NAME)?.value?.trim();
  return workspace === "owner" ? "/owner-profile" : "/renter-profile";
}

function matchesRoutePrefix(pathname, routes) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isCrawlerUserAgent(userAgent) {
  return CRAWLER_USER_AGENT_PATTERN.test(userAgent || "");
}

function nextWithCrawlerHeader(request) {
  const requestHeaders = new Headers(request.headers);
  if (isCrawlerUserAgent(request.headers.get("user-agent"))) {
    requestHeaders.set(CRAWLER_HEADER_NAME, "1");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const hasSession = hasSessionCookie(request);

  if (matchesRoutePrefix(pathname, AUTH_ROUTES) && hasSession) {
    return NextResponse.redirect(new URL(resolveWorkspaceDashboard(request), request.url));
  }

  if (matchesRoutePrefix(pathname, PROTECTED_ROUTES) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return nextWithCrawlerHeader(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|assets|brand|fonts|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|api).*)",
  ],
};
