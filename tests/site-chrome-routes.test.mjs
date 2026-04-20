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
  assert.equal(shouldHideSiteChrome("/profile-selection"), false);
  assert.equal(shouldHideSiteChrome("/equipment/2"), false);
});

test("bare route shell is bypassed across both profile route families", () => {
  assert.equal(shouldBypassRouteShell("/owner-profile"), true);
  assert.equal(shouldBypassRouteShell("/owner-profile/bookings"), true);
  assert.equal(shouldBypassRouteShell("/owner-profile/browse"), true);
  assert.equal(shouldBypassRouteShell("/owner-profile/saved"), true);
  assert.equal(shouldBypassRouteShell("/owner-profile/settings"), true);
  assert.equal(shouldBypassRouteShell("/owner-profile/support"), true);
  assert.equal(shouldBypassRouteShell("/owner-profile/feedback"), true);
  assert.equal(shouldBypassRouteShell("/renter-profile"), true);
  assert.equal(shouldBypassRouteShell("/renter-profile/bookings"), true);
  assert.equal(shouldBypassRouteShell("/renter-profile/browse"), true);
  assert.equal(shouldBypassRouteShell("/renter-profile/settings"), true);
  assert.equal(shouldBypassRouteShell("/renter-profile/support"), true);
  assert.equal(shouldBypassRouteShell("/renter-profile/feedback"), true);
  assert.equal(shouldBypassRouteShell("/owner-registration"), false);
  assert.equal(shouldBypassRouteShell("/support"), false);
});

test("profile routes stay aligned with their corrected local html source mapping", () => {
  assert.deepEqual(PROFILE_ROUTE_SOURCE_FILES, {
    "/owner-profile": "owner profile.html",
    "/renter-profile": "Renter profile.html",
  });
});
