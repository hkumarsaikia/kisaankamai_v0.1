export const PROFILE_ROUTE_SOURCE_FILES = {
  "/owner-profile": "owner profile.html",
  "/renter-profile": "Renter profile.html",
};

const SITE_CHROME_HIDDEN_PATHS = new Set(Object.keys(PROFILE_ROUTE_SOURCE_FILES));

function isOwnerProfileWorkspacePath(pathname = "") {
  return pathname === "/owner-profile" || pathname.startsWith("/owner-profile/");
}

function isRenterProfileWorkspacePath(pathname = "") {
  return pathname === "/renter-profile" || pathname.startsWith("/renter-profile/");
}

export function shouldHideSiteChrome(pathname = "") {
  return (
    pathname === "/list-equipment" ||
    SITE_CHROME_HIDDEN_PATHS.has(pathname) ||
    isOwnerProfileWorkspacePath(pathname) ||
    isRenterProfileWorkspacePath(pathname)
  );
}

export function shouldBypassRouteShell(pathname = "") {
  return (
    pathname === "/list-equipment" ||
    SITE_CHROME_HIDDEN_PATHS.has(pathname) ||
    isOwnerProfileWorkspacePath(pathname) ||
    isRenterProfileWorkspacePath(pathname)
  );
}
