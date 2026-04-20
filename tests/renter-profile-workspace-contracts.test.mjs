import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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

test("renter-profile routes are wired to the renter-style view family and keep compatibility redirects", async () => {
  const [root, bookings, browse, saved, settings, support, feedback, success, earnings] = await Promise.all([
    readFile(new URL("../app/renter-profile/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/bookings/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/browse/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/saved/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/settings/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/support/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/feedback/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/feedback/success/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renter-profile/earnings/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(root, /OwnerProfileDashboardContent/);
  assert.match(root, /title="Renter Profile"/);
  assert.match(bookings, /OwnerProfileBookingsContent/);
  assert.match(browse, /OwnerProfileBrowseContent/);
  assert.match(saved, /OwnerProfileSavedContent/);
  assert.match(saved, /activeTab="saved"/);
  assert.match(settings, /OwnerProfileSettingsContent/);
  assert.match(support, /OwnerProfileSupportContent/);
  assert.match(feedback, /OwnerProfileFeedbackContent/);
  assert.match(success, /OwnerProfileFeedbackSuccessContent/);
  assert.match(earnings, /redirect\("\/owner-profile\/earnings"\)/);
});

test("renter-style views keep renter-family links and saved equipment flows", async () => {
  const source = await readFile(
    new URL("../components/owner-profile/OwnerProfileViews.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /href="\/renter-profile\/bookings"/);
  assert.match(source, /href="\/renter-profile\/browse"/);
  assert.match(source, /successHref="\/renter-profile\/feedback\/success"/);
  assert.match(source, /<Link href="\/renter-profile"/);
  assert.match(source, /Clear Saved/);
  assert.match(source, /Manage your renter profile, preferences, and account controls\./);
});
