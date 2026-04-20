import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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
  const [root, browse, earnings, saved, feedbackSuccess] = await Promise.all([
    readFile(new URL("../app/owner-profile/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-profile/browse/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-profile/earnings/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-profile/saved/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-profile/feedback/success/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(root, /title="Owner Profile"/);
  assert.match(root, /getOwnerListings/);
  assert.match(root, /getOwnerBookings/);
  assert.match(root, /getOwnerPayments/);
  assert.match(browse, /OwnerEquipmentBrowser/);
  assert.match(browse, /title="My Equipment"/);
  assert.match(earnings, /Pricing & Earnings/);
  assert.match(earnings, /getOwnerPayments/);
  assert.match(earnings, /activeTab="earnings"/);
  assert.match(saved, /redirect\("\/owner-profile\/browse"\)/);
  assert.match(feedbackSuccess, /primaryHref="\/owner-profile"/);
  assert.match(feedbackSuccess, /secondaryHref="\/owner-profile\/browse"/);
  assert.doesNotMatch(feedbackSuccess, /RenterProfileViews/);
});

test("owner earnings content uses the revenue panel and owner-family links", async () => {
  const [viewsSource, panelSource] = await Promise.all([
    readFile(new URL("../components/renter-profile/RenterProfileViews.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/workspace/OwnerRevenuePanel.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(viewsSource, /OwnerRevenuePanel/);
  assert.doesNotMatch(viewsSource, /RenterPaymentsPanel/);
  assert.match(viewsSource, /href: "\/owner-profile\/bookings"/);
  assert.match(viewsSource, /successHref="\/owner-profile\/feedback\/success"/);
  assert.match(viewsSource, /<Link href="\/owner-profile"/);
  assert.match(panelSource, /langText\("Earnings", "कमाई"\)/);
  assert.match(panelSource, /booking-linked earnings/);
});
