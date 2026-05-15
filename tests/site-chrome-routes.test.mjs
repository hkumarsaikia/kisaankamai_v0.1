import test from "node:test";
import assert from "node:assert/strict";
import {
  PROFILE_ROUTE_SOURCE_FILES,
  shouldBypassRouteShell,
  shouldHideSiteChrome,
} from "../lib/site-chrome-routes.js";

test("shared site chrome is hidden across both profile route families", () => {
  assert.equal(shouldHideSiteChrome("/owner-profile"), true);
  assert.equal(shouldHideSiteChrome("/owner-profile/bookings"), true);
  assert.equal(shouldHideSiteChrome("/owner-profile/browse"), true);
  assert.equal(shouldHideSiteChrome("/owner-profile/saved"), true);
  assert.equal(shouldHideSiteChrome("/owner-profile/settings"), true);
  assert.equal(shouldHideSiteChrome("/owner-profile/support"), true);
  assert.equal(shouldHideSiteChrome("/owner-profile/feedback"), true);
  assert.equal(shouldHideSiteChrome("/renter-profile"), true);
  assert.equal(shouldHideSiteChrome("/renter-profile/bookings"), true);
  assert.equal(shouldHideSiteChrome("/renter-profile/browse"), true);
  assert.equal(shouldHideSiteChrome("/renter-profile/settings"), true);
  assert.equal(shouldHideSiteChrome("/renter-profile/support"), true);
  assert.equal(shouldHideSiteChrome("/renter-profile/feedback"), true);
  assert.equal(shouldHideSiteChrome("/login"), false);
  assert.equal(shouldHideSiteChrome("/register"), false);
  assert.equal(shouldHideSiteChrome("/forgot-password"), false);
  assert.equal(shouldHideSiteChrome("/forgot-password/verify-otp"), false);
  assert.equal(shouldHideSiteChrome("/profile-selection"), false);
  assert.equal(shouldHideSiteChrome("/equipment/2"), false);
});

test("profile route families keep the global route shell for the same page loading animation", () => {
  assert.equal(shouldBypassRouteShell("/owner-profile"), false);
  assert.equal(shouldBypassRouteShell("/owner-profile/bookings"), false);
  assert.equal(shouldBypassRouteShell("/owner-profile/browse"), false);
  assert.equal(shouldBypassRouteShell("/owner-profile/saved"), false);
  assert.equal(shouldBypassRouteShell("/owner-profile/settings"), false);
  assert.equal(shouldBypassRouteShell("/owner-profile/support"), false);
  assert.equal(shouldBypassRouteShell("/owner-profile/feedback"), false);
  assert.equal(shouldBypassRouteShell("/renter-profile"), false);
  assert.equal(shouldBypassRouteShell("/renter-profile/bookings"), false);
  assert.equal(shouldBypassRouteShell("/renter-profile/browse"), false);
  assert.equal(shouldBypassRouteShell("/renter-profile/settings"), false);
  assert.equal(shouldBypassRouteShell("/renter-profile/support"), false);
  assert.equal(shouldBypassRouteShell("/renter-profile/feedback"), false);
  assert.equal(shouldBypassRouteShell("/login"), false);
  assert.equal(shouldBypassRouteShell("/register"), false);
  assert.equal(shouldBypassRouteShell("/forgot-password"), false);
  assert.equal(shouldBypassRouteShell("/owner-registration"), false);
  assert.equal(shouldBypassRouteShell("/support"), false);
});

test("profile routes stay aligned with their corrected local html source mapping", () => {
  assert.deepEqual(PROFILE_ROUTE_SOURCE_FILES, {
    "/owner-profile": "owner profile.html",
    "/renter-profile": "Renter profile.html",
  });
});
