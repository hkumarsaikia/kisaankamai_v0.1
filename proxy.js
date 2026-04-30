import { NextResponse } from "next/server.js";

const SESSION_COOKIE_NAME = "kisan_kamai_session";
const WORKSPACE_COOKIE_NAME = "kisan_kamai_workspace";
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PROTECTED_ROUTES = ["/list-equipment"];

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

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const hasSession = hasSessionCookie(request);

  if (matchesRoutePrefix(pathname, AUTH_ROUTES) && hasSession) {
    return NextResponse.redirect(new URL(resolveWorkspaceDashboard(request), request.url));
  }

  if (matchesRoutePrefix(pathname, PROTECTED_ROUTES) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/list-equipment", "/login", "/register", "/register/:path*", "/forgot-password/:path*"],
};
