import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readSource(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("profile dropdown uses a Firestore-backed notification inbox instead of sample notifications", async () => {
  const [
    dropdown,
    types,
    firebaseData,
    firebaseMessaging,
    listRoute,
    readAllRoute,
    readOneRoute,
  ] = await Promise.all([
    readSource("../components/ProfileDropdownMenu.tsx"),
    readSource("../lib/local-data/types.ts"),
    readSource("../lib/server/firebase-data.ts"),
    readSource("../lib/server/firebase-messaging.ts"),
    readSource("../app/api/notifications/route.ts"),
    readSource("../app/api/notifications/read-all/route.ts"),
    readSource("../app/api/notifications/[id]/read/route.ts"),
  ]);

  assert.match(types, /NotificationRecord/);
  assert.match(firebaseData, /NOTIFICATIONS_COLLECTION/);
  assert.match(firebaseData, /createUserNotifications/);
  assert.match(firebaseData, /getUnreadNotificationsForUser/);
  assert.match(firebaseData, /markAllNotificationsRead/);
  assert.match(firebaseData, /markNotificationRead/);
  assert.match(firebaseMessaging, /createUserNotifications/);
  assert.match(firebaseMessaging, /sendEachForMulticast/);

  assert.match(listRoute, /getCurrentSession/);
  assert.match(listRoute, /getUnreadNotificationInbox/);
  assert.match(listRoute, /unreadCount: inbox\.unreadCount/);
  assert.match(readAllRoute, /markAllNotificationsRead/);
  assert.match(readOneRoute, /markNotificationRead/);

  assert.match(dropdown, /\/api\/notifications/);
  assert.match(dropdown, /\/api\/notifications\/read-all/);
  assert.match(dropdown, /markNotificationRead/);
  assert.match(dropdown, /aria-live="polite"/);
  assert.doesNotMatch(dropdown, /notificationsCleared/);
  assert.doesNotMatch(dropdown, /setTimeout\(\(\) => setNotificationsLoading\(false\), 300\)/);
  assert.doesNotMatch(dropdown, /John Deere 5050D|Mahindra 575 DI|Namdev P|Booking Confirmed:/);
});

test("profile dropdown has smooth opaque panel states for desktop and mobile", async () => {
  const [dropdown, globals, header] = await Promise.all([
    readSource("../components/ProfileDropdownMenu.tsx"),
    readSource("../app/globals.css"),
    readSource("../components/Header.tsx"),
  ]);

  assert.match(dropdown, /kk-profile-dropdown-panel/);
  assert.match(dropdown, /kk-profile-notification-row/);
  assert.match(dropdown, /data-state=\{panelVisible \? "open" : "closed"\}/);
  assert.match(dropdown, /requestAnimationFrame/);
  assert.match(dropdown, /window\.setTimeout\(.*PROFILE_DROPDOWN_EXIT_MS/s);
  assert.match(dropdown, /data-opaque-profile-menu/);
  assert.match(header, /panelMode="inline" fullWidth/);

  assert.match(globals, /@keyframes kk-profile-dropdown-enter/);
  assert.match(globals, /@keyframes kk-profile-dropdown-exit/);
  assert.match(globals, /\.kk-profile-dropdown-panel\[data-state="open"\]/);
  assert.match(globals, /\.kk-profile-dropdown-panel\[data-state="closed"\]/);
  assert.match(globals, /\.kk-profile-notification-row/);
  assert.doesNotMatch(dropdown, /bg-white\/80|bg-white\/75|backdrop-blur-xl/);
});

test("profile dropdown popover gives real notifications a balanced readable layout", async () => {
  const dropdown = await readSource("../components/ProfileDropdownMenu.tsx");

  assert.match(dropdown, /w-\[min\(74vw,23\.5rem\)\]/);
  assert.match(dropdown, /sm:w-\[23rem\]/);
  assert.match(dropdown, /lg:w-\[23\.5rem\]/);
  assert.match(dropdown, /line-clamp-2 text-sm font-bold/);
  assert.match(dropdown, /line-clamp-3 text-xs/);
  assert.doesNotMatch(dropdown, /\bw-80\b/);
  assert.doesNotMatch(dropdown, /w-\[min\((7[56]|8[06]|9[02])vw,(25|26|28|30)rem\)\]/);
  assert.doesNotMatch(dropdown, /block truncate text-sm font-bold/);
});

test("profile dropdown falls back to initials when the stored photo URL fails", async () => {
  const dropdown = await readSource("../components/ProfileDropdownMenu.tsx");

  assert.match(dropdown, /avatarError/);
  assert.match(dropdown, /setAvatarError\(true\)/);
  assert.match(dropdown, /showPhoto/);
  assert.match(dropdown, /onError=\{\(\) => setAvatarError\(true\)\}/);
});

test("docs describe the dropdown notification inbox and keep SMS providers out of the flow", async () => {
  const [development, architecture] = await Promise.all([
    readSource("../docs/DEVELOPMENT.md"),
    readSource("../docs/ARCHITECTURE.md"),
  ]);

  assert.match(development, /Firestore notification inbox/);
  assert.match(development, /\/api\/notifications/);
  assert.match(architecture, /notification inbox/i);
  assert.doesNotMatch(`${development}\n${architecture}`, /MSG91|Twilio|SMS/);
});

test("root metadata declares a real icon so dropdown QA has no favicon 404", async () => {
  const [layout, faviconRoute] = await Promise.all([
    readSource("../app/layout.tsx"),
    readSource("../app/favicon.ico/route.ts"),
  ]);

  assert.match(layout, /icons:/);
  assert.match(layout, /\/assets\/generated\/hero_tractor\.png/);
  assert.match(faviconRoute, /image\/svg\+xml/);
  assert.match(faviconRoute, /Kisan Kamai/);
});
