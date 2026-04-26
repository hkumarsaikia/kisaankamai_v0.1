import { NextResponse } from "next/server.js";

const SESSION_COOKIE_NAME = "kisan_kamai_session";

function hasSessionCookie(request) {
  const value = request.cookies.get(SESSION_COOKIE_NAME)?.value?.trim();
  return Boolean(value && value !== "undefined" && value !== "null");
}

export function proxy(request) {
  if (!hasSessionCookie(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/list-equipment"],
};
