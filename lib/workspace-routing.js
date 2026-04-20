/** @typedef {"owner" | "renter"} UserRole */

/**
 * @param {UserRole} portal
 */
export function resolvePortalHref(portal) {
  return portal === "owner" ? "/owner-profile" : "/renter-profile";
}

/**
 * @param {UserRole} portal
 */
export function resolvePortalSettingsHref(portal) {
  return `${resolvePortalHref(portal)}/settings`;
}

/**
 * @param {UserRole} portal
 */
export function resolvePortalSupportHref(portal) {
  return `${resolvePortalHref(portal)}/support`;
}

/**
 * @param {string} [pathname]
 * @returns {UserRole | null}
 */
export function resolvePortalFromPath(pathname = "") {
  if (pathname === "/owner-profile" || pathname.startsWith("/owner-profile/")) {
    return "owner";
  }

  if (pathname === "/renter-profile" || pathname.startsWith("/renter-profile/")) {
    return "renter";
  }

  return null;
}

/**
 * @param {{
 *   pathname?: string;
 *   activeWorkspace?: UserRole | null;
 *   settingsHref?: string;
 * }} [options]
 */
export function resolveWorkspaceSettingsHref({
  pathname = "",
  activeWorkspace = null,
  settingsHref,
} = {}) {
  if (settingsHref) {
    return settingsHref;
  }

  const portalFromPath = resolvePortalFromPath(pathname);
  if (portalFromPath) {
    return resolvePortalSettingsHref(portalFromPath);
  }

  if (activeWorkspace === "owner" || activeWorkspace === "renter") {
    return resolvePortalSettingsHref(activeWorkspace);
  }

  return resolvePortalSettingsHref("renter");
}

/**
 * @param {{
 *   pathname?: string;
 *   activeWorkspace?: UserRole | null;
 * }} [options]
 */
export function resolveWorkspaceSupportHref({
  pathname = "",
  activeWorkspace = null,
} = {}) {
  const portalFromPath = resolvePortalFromPath(pathname);
  if (portalFromPath) {
    return resolvePortalSupportHref(portalFromPath);
  }

  if (activeWorkspace === "owner" || activeWorkspace === "renter") {
    return resolvePortalSupportHref(activeWorkspace);
  }

  return resolvePortalSupportHref("renter");
}
