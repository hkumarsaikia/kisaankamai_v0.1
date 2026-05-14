import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

test("owner-profile workspace shell exposes owner-style navigation with earnings and add listing", async () => {
  const source = await readFile(
    new URL("../components/owner-profile/OwnerProfileWorkspaceShell.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /portalLabel: localizedText\("Owner Profile", "मालक प्रोफाइल"\)/);
  assert.match(source, /href: "\/owner-profile\/earnings", label: localizedText\("Earnings", "कमाई"\), icon: "payments"/);
  assert.match(source, /href: "\/owner-profile\/browse", label: localizedText\("My Equipment", "माझी उपकरणे"\), icon: "agriculture"/);
  assert.match(source, /href: "\/owner-profile\/bookings", label: localizedText\("Bookings", "बुकिंग"\), icon: "event_note"/);
  assert.match(source, /supportHref: "\/owner-profile\/support"/);
  assert.match(source, /addListingHref: "\/list-equipment"/);
  assert.match(source, /footerMode: "text-left"/);
  assert.doesNotMatch(source, /href: "\/owner-profile\/saved", label: "Saved Equipment"/);
});

test("owner-profile routes use the new owner dashboard, equipment browser, earnings views, and owner-only redirects", async () => {
  const [root, activity, browse, earnings, saved] = await Promise.all([
    readFile(new URL("../app/owner-profile/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/profile/OwnerRecentBookingActivity.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-profile/browse/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-profile/earnings/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-profile/saved/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(root, /title=\{localizedText\("Owner Profile", "मालक प्रोफाइल"\)\}/);
  assert.match(root, /getOwnerBookings/);
  assert.match(root, /OwnerRecentBookingActivity/);
  assert.match(activity, /Recent Booking Activity/);
  assert.match(activity, /md:grid-cols-2 xl:grid-cols-3/);
  assert.doesNotMatch(root, /owner-dashboard-booking-card/);
  assert.doesNotMatch(root, /formatDashboardDateRange/);
  assert.doesNotMatch(root, /min-h-\[24\.5rem\]/);
  assert.doesNotMatch(root, /aspect-\[0\.95\]/);
  assert.doesNotMatch(root, /sm:grid-cols-\[4\.5rem_minmax\(0,1fr\)_auto\]/);
  assert.doesNotMatch(root, /h-20 w-20|h-32 w-full/);
  assert.doesNotMatch(root, /getOwnerListings|getOwnerPayments|Active Listings|Open Bookings|Paid Earnings|Fleet Snapshot/);
  assert.match(browse, /OwnerEquipmentBrowser/);
  assert.match(browse, /title=\{localizedText\("My Equipment", "माझी उपकरणे"\)\}/);
  assert.match(earnings, /localizedText\("Pricing & Earnings", "किंमत आणि कमाई"\)/);
  assert.match(earnings, /getOwnerBookings/);
  assert.doesNotMatch(earnings, /getOwnerPayments/);
  assert.doesNotMatch(earnings, /Kisan Kamai does not collect or process payments/);
  assert.doesNotMatch(earnings, /<LocalizedText en="Direct Settlement"/);
  assert.match(earnings, /activeTab="earnings"/);
  assert.match(saved, /redirect\("\/owner-profile\/browse"\)/);
  await assert.rejects(access(new URL("../app/owner-profile/feedback/success/page.tsx", import.meta.url)));
});

test("owner dashboard recent booking activity can decline pending requests and reflect cancelled state", async () => {
  const [root, activity] = await Promise.all([
    readFile(new URL("../app/owner-profile/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/profile/OwnerRecentBookingActivity.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(root, /<OwnerRecentBookingActivity bookings=\{recentBookings\}/);
  assert.match(activity, /"use client"/);
  assert.match(activity, /updateBookingStatusAction/);
  assert.match(activity, /setLocalBookings/);
  assert.match(activity, /nextStatus: "confirmed" \| "cancelled"/);
  assert.match(activity, /owner-dashboard-decline-button/);
  assert.match(activity, /owner-dashboard-approve-button/);
  assert.match(activity, /booking\.status === "pending"/);
  assert.match(activity, /status: nextStatus/);
  assert.match(activity, /router\.refresh/);
});

test("owner earnings content uses the revenue panel and owner-family links", async () => {
  const [viewsSource, panelSource] = await Promise.all([
    readFile(new URL("../components/renter-profile/RenterProfileViews.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/workspace/OwnerRevenuePanel.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(viewsSource, /OwnerRevenuePanel/);
  assert.doesNotMatch(viewsSource, /RenterPaymentsPanel/);
  assert.match(viewsSource, /href: "\/owner-profile\/bookings"/);
  assert.match(viewsSource, /successHref="\/owner-profile\/feedback"/);
  assert.match(viewsSource, /<Link href="\/owner-profile"/);
  assert.match(panelSource, /langText\("Booking Value", "बुकिंग मूल्य"\)/);
  assert.match(panelSource, /booking-linked estimates/);
});
