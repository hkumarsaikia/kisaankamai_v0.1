import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

test("renter-profile workspace shell exposes renter-style navigation with saved equipment and no earnings tab", async () => {
  const source = await readFile(
    new URL("../components/owner-profile/OwnerProfileWorkspaceShell.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /portalLabel: localizedText\("Renter Profile", "भाडेकरू प्रोफाइल"\)/);
  assert.match(source, /href: "\/renter-profile\/browse", label: localizedText\("Browse Equipment", "उपकरणे शोधा"\), icon: "search"/);
  assert.match(source, /href: "\/renter-profile\/bookings", label: localizedText\("My Bookings", "माझी बुकिंग"\), icon: "calendar_today"/);
  assert.match(source, /href: "\/renter-profile\/saved", label: localizedText\("Saved Equipment", "जतन केलेली उपकरणे"\), icon: "bookmark"/);
  assert.match(source, /supportHref: "\/renter-profile\/support"/);
  assert.match(source, /footerMode: "text-left"/);
  assert.match(source, /"renter-profile":[\s\S]*addListingHref: null/);
  assert.doesNotMatch(source, /href: "\/renter-profile\/earnings", label: "Earnings"/);
});

test("renter-profile routes use the new renter booking board while preserving compatibility redirects", async () => {
  const [root, bookings, earnings] = await Promise.all([
    readFile(new URL("../app/renter-profile/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/bookings/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/earnings/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(root, /title=\{localizedText\("Renter Profile", "भाडेकरू प्रोफाइल"\)\}/);
  assert.match(root, /subtitle=\{localizedText\(/);
  assert.match(root, /Find, track, and manage equipment bookings from your renter workspace\./);
  assert.match(root, /RenterBookingsBoard/);
  assert.match(root, /variant="dashboard"/);
  assert.match(bookings, /RenterBookingsBoard/);
  assert.match(bookings, /variant="page"/);
  assert.doesNotMatch(earnings, /redirect\("\/owner-profile\/earnings"\)/);
  assert.match(earnings, /Renter Activity/);
  assert.match(earnings, /href="\/renter-profile\/bookings"/);
  await assert.rejects(access(new URL("../app/renter-profile/feedback/success/page.tsx", import.meta.url)));
});

test("renter workspace removes requested helper copy from pages and boards", async () => {
  const [
    supportPage,
    feedbackPage,
    settingsPage,
    savedBoard,
    bookingsPage,
    bookingsBoard,
    browsePage,
    browseBoard,
    rootPage,
  ] = await Promise.all([
    readFile(new URL("../app/renter-profile/support/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/feedback/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/settings/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/profile/SavedListingsBoard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/bookings/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/renter-profile/RenterBookingsBoard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/browse/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/renter-profile/RenterEquipmentBrowser.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/page.tsx", import.meta.url), "utf8"),
  ]);

  const combined = [
    supportPage,
    feedbackPage,
    settingsPage,
    savedBoard,
    bookingsPage,
    bookingsBoard,
    browsePage,
    browseBoard,
    rootPage,
  ].join("\n");

  [
    "Get booking help, owner support, and ticket updates in one place.",
    "Tell us what would improve your renter experience.",
    "Manage your account and preferences.",
    "Browse equipment and save machines you want to review later.",
    "Manage active, pending, completed, and cancelled rentals with inline tracking.",
    "My Bookings Manage your equipment rentals, schedules, and delivery tracking.",
    "Manage your equipment rentals, schedules, and delivery tracking.",
    "Explore nearby machines and sort the catalog by HP or distance before opening details.",
    "Browse by availability, price, or distance and open the exact equipment detail page from each tile.",
    "Manage your current equipment bookings.",
  ].forEach((copy) => {
    assert.doesNotMatch(combined, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  assert.match(bookingsPage, /title=\{localizedText\("My Bookings", "माझी बुकिंग"\)\}/);
  assert.doesNotMatch(bookingsBoard, /: langText\("My Bookings", "माझी बुकिंग"\)/);
  assert.match(bookingsBoard, /variant === "dashboard"[\s\S]*Booking Overview/);
  assert.match(savedBoard, /Clear Saved/);
  assert.doesNotMatch(savedBoard, /<h2[^>]*>[\s\S]*Saved Equipment/);
});

test("renter-style views keep renter-family links and saved equipment flows", async () => {
  const source = await readFile(
    new URL("../components/owner-profile/OwnerProfileViews.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /href="\/renter-profile\/bookings"/);
  assert.match(source, /href="\/renter-profile\/browse"/);
  assert.match(source, /successHref="\/renter-profile\/feedback"/);
  assert.match(source, /<Link href="\/renter-profile"/);
  assert.match(source, /Clear Saved/);
  assert.match(source, /Manage your renter profile, preferences, and account controls\./);
});
