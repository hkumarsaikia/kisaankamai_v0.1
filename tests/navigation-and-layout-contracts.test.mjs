import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("header primary nav matches the approved order and routes", async () => {
  const navigation = await import("../lib/site-navigation.js");

  assert.deepEqual(
    navigation.HEADER_PRIMARY_LINKS.map(({ href, labelKey, dropdown }) => ({
      href,
      labelKey,
      hasDropdown: Boolean(dropdown),
    })),
    [
      { href: "/rent-equipment", labelKey: "header.nav.rent_equipment", hasDropdown: false },
      { href: "/categories", labelKey: "header.nav.categories", hasDropdown: false },
      { href: "/feature-request", labelKey: "header.nav.feature_request", hasDropdown: false },
      { href: "/support", labelKey: "header.nav.support", hasDropdown: false },
    ]
  );
});

test("home and categories use square equipment cards, northern maharashtra copy, and merged categories", async () => {
  const [homeSource, categoriesSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/categories/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(homeSource, /Now Serving Northern Maharashtra/);
  assert.match(homeSource, /aspect-square/);
  assert.doesNotMatch(homeSource, /h-\[350px\]/);

  assert.match(categoriesSource, /aspect-square/);
  assert.match(categoriesSource, /getEquipmentList/);
  assert.match(categoriesSource, /getMergedCategorySummariesFromEquipment/);
  assert.doesNotMatch(categoriesSource, /const categories = \[/);
  assert.doesNotMatch(categoriesSource, /hero_tractor|harvester_action|implement_4k|plough_4k|sprayer\.png/);
  assert.doesNotMatch(categoriesSource, /h-\[400px\]/);
});

test("footer sections include only the approved marketplace and trust routes", async () => {
  const navigation = await import("../lib/site-navigation.js");

  assert.deepEqual(
    navigation.FOOTER_MARKETPLACE_LINKS.map(({ href }) => href),
    ["/owner-benefits", "/how-it-works", "/coming-soon"]
  );

  assert.deepEqual(
    navigation.FOOTER_TRUST_LINKS.map(({ href }) => href),
    ["/about", "/terms", "/partner", "/report"]
  );
});

test("support page no longer contains the instant callback CTA", async () => {
  const source = await readFile(new URL("../app/support/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /Instant Callback/);
  assert.doesNotMatch(source, /Search help topics|Search support topics/);
  assert.match(source, /bg-\[#25D366\]|bg-emerald-600|bg-\[#1f9d57\]/);
  assert.match(source, /WhatsApp/);
});

test("partner page uses the imported partnership body and requested CTA behavior", async () => {
  const source = await readFile(new URL("../app/partner/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /Strategic Partnerships/);
  assert.match(source, /Apply for Partnership/);
  assert.match(source, /Explore Ecosystem/);
  assert.match(source, /\/how-it-works/);
});

test("coming soon and equipment detail use the approved interaction and layout contracts", async () => {
  const comingSoon = await import("../lib/coming-soon-config.js");
  const detailLayout = await import("../lib/equipment-detail-layout.js");

  assert.equal(comingSoon.COMING_SOON_NOTIFY_MODE, "single-contact-reveal");
  assert.equal(detailLayout.DETAIL_TEMPLATE_VARIANT, "rent-eqs-html");
});

test("header source does not keep hardcoded nav leftovers outside the shared config", async () => {
  const source = await readFile(new URL("../components/Header.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /href="\/how-it-works"/);
  assert.doesNotMatch(source, /href="\/feature-request"/);
});

test("coming soon source removes partner labels and resets back to notify me after submit", async () => {
  const source = await readFile(new URL("../app/coming-soon/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /MAHINDRA AGRI|NABARD|TATA TRUSTS|ICAR/);
  assert.match(source, /setTimeout/);
  assert.match(source, /Notify Me/);
  assert.match(source, /Submitted/);
  assert.match(source, /LazyMap/);
  assert.match(source, /NORTHERN_MAHARASHTRA_SERVICE_AREAS/);
});

test("feature request source removes the requested sections from the imported page", async () => {
  const source = await readFile(new URL("../app/feature-request/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /Recent Ideas from the Community/);
  assert.doesNotMatch(source, /Explore Current Features/);
  assert.doesNotMatch(source, /Built for Maharashtra Farmers/);
  assert.doesNotMatch(source, /Bilingual Support/);
  assert.doesNotMatch(source, /Human Review/);
  assert.doesNotMatch(source, /Submit a Request/);
  assert.match(source, /Share Your Idea/);
});

test("feature request page submits to Firestore-backed form API and avoids duplicate CTA copy", async () => {
  const [pageSource, apiSource, validationSource, typesSource, mirrorSource, backfillSource, workbookManifest] = await Promise.all([
    readFile(new URL("../app/feature-request/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/forms/feature-request/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/validation/forms.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/local-data/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/sheets-mirror.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/lib/operational-data.mjs", import.meta.url), "utf8"),
    readFile(new URL("../data/operational-sheets-workbook.json", import.meta.url), "utf8"),
  ]);

  assert.match(pageSource, /handleSubmit/);
  assert.match(pageSource, /\/api\/forms\/feature-request/);
  assert.match(pageSource, /Submitted/);
  assert.match(apiSource, /featureRequestSchema/);
  assert.match(apiSource, /type:\s*"feature-request"/);
  assert.match(validationSource, /featureRequestSchema/);
  assert.match(typesSource, /"feature-request"/);
  assert.match(mirrorSource, /submission\.type === "feature-request"/);
  assert.match(backfillSource, /"feature-request"/);
  assert.match(workbookManifest, /"key": "subject"/);
  assert.match(workbookManifest, /"key": "urgency"/);
  assert.equal((pageSource.match(/Help us shape the future of farm equipment access\./g) || []).length, 1);
  assert.equal((pageSource.match(/Help us build the future of farm equipment access\./g) || []).length, 0);
});

test("shared dropdown and translation-cleanup pages avoid inline bilingual slash labels", async () => {
  const [dropdownSource, forgotSource, verifySource, newPasswordSource, detailSource, featureRequestSource, feedbackSource] =
    await Promise.all([
      readFile(new URL("../components/ProfileDropdownMenu.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/forgot-password/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/forgot-password/verify-otp/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/forgot-password/new-password/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/equipment/[id]/EquipmentDetailClient.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/feature-request/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/feedback/page.tsx", import.meta.url), "utf8"),
    ]);

  assert.doesNotMatch(dropdownSource, /Owner Profile <span|Renter Profile <span|Settings <span|Help &amp; Support <span|Sign Out <span/);
  assert.doesNotMatch(forgotSource, /Send Code \/|Sign In \/|Forgot Password\s*<span/);
  assert.doesNotMatch(verifySource, /Verify and Continue \/|Resend OTP \/|<p className="mb-4 text-xl font-medium text-primary\/70">/);
  assert.doesNotMatch(newPasswordSource, /Update Password <span|Secure reset <span/);
  assert.doesNotMatch(detailSource, /Available Today \/|Specifications \/|Features &amp; Inclusions \/|Owner Detail \/|Service Area \/|Frequently Asked Questions \/|Book Now \/ /);
  assert.doesNotMatch(featureRequestSource, /Why Request a Feature \/|Share Your Idea \/|It's okay to contact me to discuss this idea further \/ /);
  assert.doesNotMatch(feedbackSource, /Why Request a Feature \/|Share Your Idea \/ /);
});

test("report source removes the requested support and guidance copy only", async () => {
  const source = await readFile(new URL("../app/report/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /Support Center/);
  assert.doesNotMatch(source, /Safety matters/);
  assert.doesNotMatch(source, /Bilingual support/);
  assert.doesNotMatch(source, /24h Response Goal/);
  assert.doesNotMatch(source, /How to make your report useful/);
  assert.doesNotMatch(source, /\/api\/forms\/support-request/);
  assert.match(source, /\/api\/forms\/report/);
  assert.match(source, /Direct Support/);
  assert.match(source, /Submitted/);
});

test("list equipment page keeps the owner workspace shell and sticky live preview layout", async () => {
  const [pageSource, editorSource] = await Promise.all([
    readFile(new URL("../app/list-equipment/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/owner-profile/ListEquipmentEditorPage.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(pageSource, /family="owner-profile"/);
  assert.match(pageSource, /activeTab="add-listing"/);
  assert.match(pageSource, /redirect\("\/login"\)/);
  assert.match(editorSource, /sticky top-28/);
  assert.match(editorSource, /Live Preview/);
  assert.match(editorSource, /Available from specific date/);
  assert.match(editorSource, /type="date"/);
  assert.doesNotMatch(pageSource, /activeWorkspace === "renter" \? "owner-profile" : "renter-profile"/);
});

test("list equipment redirects unauthenticated requests before the streaming fallback renders", async () => {
  const proxySource = await readFile(new URL("../proxy.js", import.meta.url), "utf8").catch(() => "");

  assert.notEqual(proxySource, "", "Expected a root proxy.js guard for protected owner entry routes");
  assert.match(proxySource, /export function proxy/);
  assert.match(proxySource, /kisan_kamai_session/);
  assert.match(proxySource, /\/list-equipment/);
  assert.match(proxySource, /NextResponse\.redirect/);

  const { proxy, config } = await import("../proxy.js");
  const { NextRequest } = await import("next/server.js");
  const guestResponse = proxy(new NextRequest("https://www.kisankamai.com/list-equipment"));
  const authenticatedResponse = proxy(
    new NextRequest("https://www.kisankamai.com/list-equipment", {
      headers: {
        cookie: "kisan_kamai_session=test-session",
      },
    })
  );

  assert.equal(guestResponse.status, 307);
  assert.equal(guestResponse.headers.get("location"), "https://www.kisankamai.com/login");
  assert.equal(authenticatedResponse.headers.get("x-middleware-next"), "1");
  assert.deepEqual(config.matcher, ["/list-equipment"]);
});

test("base rent-equipment source keeps the avail-eq style controls and pagination", async () => {
  const source = await readFile(new URL("../app/rent-equipment/RentEquipmentView.tsx", import.meta.url), "utf8");

  assert.match(source, /Filters/);
  assert.match(source, /Sort/);
  assert.match(source, /chevron_left/);
  assert.match(source, /chevron_right/);
});

test("no-results rent-equipment templates no longer contain the trust and safety section", async () => {
  const [viewSource, resultsSource] = await Promise.all([
    readFile(new URL("../app/rent-equipment/RentEquipmentView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/rent-equipment/RentEquipmentResults.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(viewSource, /Trust &amp; Safety|Trust & Safety/);
  assert.doesNotMatch(resultsSource, /Trust &amp; Safety|Trust & Safety/);
  assert.match(viewSource, /href="\/support"|router\.push\("\/support"\)/);
});

test("about and terms pages remove only the requested heading blocks", async () => {
  const [aboutSource, termsSource] = await Promise.all([
    readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/terms/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(aboutSource, /About Kisan Kamai/);
  assert.doesNotMatch(termsSource, /Guidelines & Trust/);
  assert.doesNotMatch(termsSource, /Report an Issue/);
  assert.doesNotMatch(termsSource, /Need Help\?/);
});

test("public equipment module no longer exports mock equipment records", async () => {
  const equipmentSource = await readFile(new URL("../lib/equipment.ts", import.meta.url), "utf8");

  assert.doesNotMatch(equipmentSource, /MOCK_EQUIPMENT|getMockEquipmentList|getMockEquipmentById/);
  assert.doesNotMatch(equipmentSource, /Mahindra Novo|John Deere|Swaraj|Shaktiman/);
});

test("shared equipment description sanitizer removes the deprecated copy", async () => {
  const { sanitizeEquipmentDescription } = await import("../lib/equipment.ts");
  const oldDescription =
    "A premium tractor listing with verified operator support, strong PTO output, and regional owner coverage.";

  assert.notEqual(sanitizeEquipmentDescription(oldDescription), oldDescription);
});

test("workspace routing resolves portal-aware profile, settings, and support destinations", async () => {
  const routing = await import("../lib/workspace-routing.js");

  assert.equal(routing.resolvePortalHref("owner"), "/owner-profile");
  assert.equal(routing.resolvePortalHref("renter"), "/renter-profile");
  assert.equal(
    routing.resolveWorkspaceSettingsHref({ pathname: "/support", activeWorkspace: "owner" }),
    "/owner-profile/settings"
  );
  assert.equal(
    routing.resolveWorkspaceSettingsHref({ pathname: "/categories", activeWorkspace: "renter" }),
    "/renter-profile/settings"
  );
  assert.equal(
    routing.resolveWorkspaceSupportHref({ pathname: "/feature-request", activeWorkspace: "owner" }),
    "/owner-profile/support"
  );
  assert.equal(
    routing.resolveWorkspaceSupportHref({ pathname: "/coming-soon", activeWorkspace: "renter" }),
    "/renter-profile/support"
  );
});

test("homepage and coming soon share the same northern maharashtra service-area data", async () => {
  const serviceAreas = await import("../lib/service-areas.js");
  const [homeSource, comingSoonSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/coming-soon/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.deepEqual(
    serviceAreas.NORTHERN_MAHARASHTRA_SERVICE_AREAS.map(({ name }) => name),
    ["Kalwan", "Mukhed"]
  );
  assert.match(homeSource, /NORTHERN_MAHARASHTRA_SERVICE_AREAS/);
  assert.match(comingSoonSource, /NORTHERN_MAHARASHTRA_SERVICE_AREAS/);
});
