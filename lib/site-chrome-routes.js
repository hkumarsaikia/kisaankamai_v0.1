export const PROFILE_ROUTE_SOURCE_FILES = {
  "/owner-profile": "owner profile.html",
  "/renter-profile": "Renter profile.html",
};

const SITE_CHROME_HIDDEN_PATHS = new Set(Object.keys(PROFILE_ROUTE_SOURCE_FILES));
const AUTH_STANDALONE_PREFIXES = ["/login", "/register", "/forgot-password"];

function isOwnerProfileWorkspacePath(pathname = "") {
  return pathname === "/owner-profile" || pathname.startsWith("/owner-profile/");
}

function isRenterProfileWorkspacePath(pathname = "") {
  return pathname === "/renter-profile" || pathname.startsWith("/renter-profile/");
}

function isAuthStandalonePath(pathname = "") {
  return AUTH_STANDALONE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function shouldHideSiteChrome(pathname = "") {
  return (
    isAuthStandalonePath(pathname) ||
    pathname === "/list-equipment" ||
    SITE_CHROME_HIDDEN_PATHS.has(pathname) ||
    isOwnerProfileWorkspacePath(pathname) ||
    isRenterProfileWorkspacePath(pathname)
  );
}

export function shouldBypassRouteShell(pathname = "") {
  return (
    isAuthStandalonePath(pathname) ||
    pathname === "/list-equipment" ||
    SITE_CHROME_HIDDEN_PATHS.has(pathname) ||
    isOwnerProfileWorkspacePath(pathname) ||
    isRenterProfileWorkspacePath(pathname)
  );
}
