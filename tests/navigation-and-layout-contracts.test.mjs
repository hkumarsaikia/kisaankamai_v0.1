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
    ["/about", "/terms", "/partner"]
  );
});

test("brand logo, favicon, profile shell, and footer marker follow the approved brand treatment", async () => {
  const [headerSource, footerSource, faviconRoute, manifestSource, logoSource, profileShell, layoutSource, loginSource] = await Promise.all([
    readFile(new URL("../components/Header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/Footer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/favicon.ico/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/manifest.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/BrandLogo.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/owner-profile/OwnerProfileWorkspaceShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(headerSource, /<BrandLogo/);
  assert.match(profileShell, /<BrandLogo/);
  assert.doesNotMatch(footerSource, /<BrandLogo/);
  assert.match(footerSource, /FooterWordmark/);
  assert.match(footerSource, /kkFooterEmeraldGradient/);
  assert.match(footerSource, /stroke="url\(#kkFooterEmeraldGradient\)"/);
  assert.match(footerSource, /viewBox="90 118 620 145"/);
  assert.match(footerSource, /className="h-\[4\.75rem\] w-\[20rem\] max-w-full"/);
  assert.match(footerSource, /x="400"/);
  assert.match(footerSource, /y="220"/);
  assert.doesNotMatch(footerSource, /viewBox="0 0 800 400"/);
  assert.doesNotMatch(footerSource, /<rect width="100%" height="100%" fill="#002a1b"/);
  assert.match(footerSource, /🇮🇳/);
  assert.match(headerSource, /markClassName="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14"/);
  assert.match(headerSource, /showSubtitle=\{false\}/);
  assert.match(logoSource, /gap-\[10px\]/);
  assert.match(logoSource, /whitespace-nowrap/);
  assert.match(profileShell, /showSubtitle=\{false\}/);
  assert.match(profileShell, /aria-label="Kisan Kamai"/);
  assert.match(profileShell, /text\(config\.portalLabel\)/);
  assert.match(profileShell, /kk-workspace-portal-label/);
  assert.match(profileShell, /kk-workspace-portal-label mt-2 pl-1\.5/);
  assert.match(profileShell, /lg:h-svh lg:overflow-hidden/);
  assert.match(profileShell, /lg:h-svh lg:min-h-0 lg:overflow-y-auto/);
  assert.match(faviconRoute, /kisan-kamai-tractor-48\.png/);
  assert.match(faviconRoute, /image\/png/);
  assert.match(layoutSource, /shortcut:\s*"\/favicon\.ico"/);
  assert.match(manifestSource, /\/favicon\.ico/);
  assert.match(manifestSource, /\/brand\/kisan-kamai-tractor-192\.png/);
  assert.match(layoutSource, /\/brand\/kisan-kamai-tractor\.svg/);
  assert.match(layoutSource, /\/brand\/kisan-kamai-tractor-48\.png/);
  assert.match(logoSource, /showSubtitle = false/);
  assert.match(logoSource, /useLanguage/);
  assert.match(logoSource, /t\("common\.brand"\)/);
  assert.match(logoSource, /brandParts/);
  assert.match(loginSource, /LogoMark/);
  assert.doesNotMatch(loginSource, /text-5xl text-primary[\s\S]*agriculture/);
  assert.doesNotMatch(headerSource, /Smart Equipment Rental/);
  assert.doesNotMatch(logoSource, /Kamai<span className="text-secondary/);
  assert.doesNotMatch(logoSource, /shadow-\[inset/);
  assert.match(footerSource, /max-w-\[100rem\]/);
  assert.match(footerSource, /md:grid-cols-\[minmax\(17rem,1\.18fr\)_minmax\(10rem,0\.62fr\)_minmax\(10rem,0\.62fr\)_minmax\(16rem,0\.86fr\)\]/);
  assert.match(footerSource, /max-w-\[18\.5rem\]/);
  assert.match(footerSource, /md:max-w-\[17rem\]/);
  assert.match(footerSource, /className="mb-6 block w-fit/);
  assert.match(footerSource, /md:justify-self-start/);
  assert.match(footerSource, /md:justify-self-center/);
  assert.match(footerSource, /md:justify-self-end/);
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
  assert.doesNotMatch(source, /Premium Partnership Enquiry/);
  assert.match(source, /Partnership Enquiry/);
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
  const { access } = await import("node:fs/promises");

  await assert.rejects(
    access(new URL("../app/report/page.tsx", import.meta.url)),
    /ENOENT/
  );

  const [navigationSource, sitemapSource] = await Promise.all([
    readFile(new URL("../lib/site-navigation.js", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(navigationSource, /href:\s*"\/report"/);
  assert.doesNotMatch(sitemapSource, /\/report/);
});

test("owner profile list equipment route keeps the owner workspace shell and the legacy route redirects", async () => {
  const [legacyPageSource, pageSource, editorSource] = await Promise.all([
    readFile(new URL("../app/list-equipment/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-profile/list-equipment/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/owner-profile/ListEquipmentEditorPage.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(legacyPageSource, /redirect\(`\/owner-profile\/list-equipment\$\{query\}`\)/);
  assert.match(pageSource, /family="owner-profile"/);
  assert.match(pageSource, /activeTab="add-listing"/);
  assert.match(pageSource, /redirect\("\/login"\)/);
  assert.doesNotMatch(editorSource, /sticky top-28/);
  assert.doesNotMatch(editorSource, /Live Preview|live preview|लाइव्ह पूर्वावलोकन/);
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
    new NextRequest("https://www.kisankamai.com/list-equipment?listingId=test-listing", {
      headers: {
        cookie: "kisan_kamai_session=test-session",
      },
    })
  );

  assert.equal(guestResponse.status, 307);
  assert.equal(guestResponse.headers.get("location"), "https://www.kisankamai.com/login");
  assert.equal(authenticatedResponse.status, 307);
  assert.equal(
    authenticatedResponse.headers.get("location"),
    "https://www.kisankamai.com/owner-profile/list-equipment?listingId=test-listing"
  );

  const loggedInLoginResponse = proxy(
    new NextRequest("https://www.kisankamai.com/login", {
      headers: {
        cookie: "kisan_kamai_session=test-session; kisan_kamai_workspace=owner",
      },
    })
  );
  const loggedInRegisterResponse = proxy(
    new NextRequest("https://www.kisankamai.com/register", {
      headers: {
        cookie: "kisan_kamai_session=test-session; kisan_kamai_workspace=renter",
      },
    })
  );

  assert.equal(loggedInLoginResponse.status, 307);
  assert.equal(loggedInLoginResponse.headers.get("location"), "https://www.kisankamai.com/owner-profile");
  assert.equal(loggedInRegisterResponse.status, 307);
  assert.equal(loggedInRegisterResponse.headers.get("location"), "https://www.kisankamai.com/renter-profile");
  const crawlerResponse = proxy(
    new NextRequest("https://www.kisankamai.com/", {
      headers: {
        "user-agent": "Googlebot/2.1",
      },
    })
  );

  assert.equal(crawlerResponse.headers.get("x-middleware-request-x-kisan-kamai-crawler"), "1");
  assert.deepEqual(config.matcher, [
    "/((?!_next/static|_next/image|assets|brand|fonts|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|api).*)",
  ]);
});

test("base rent-equipment source keeps the avail-eq style controls and pagination", async () => {
  const source = await readFile(new URL("../app/rent-equipment/RentEquipmentView.tsx", import.meta.url), "utf8");

  assert.match(source, /kk-rent-available-shell/);
  assert.match(source, /kk-rent-query-shell/);
  assert.match(source, /kk-rent-empty-shell/);
  assert.match(source, /pt-\[6\.25rem\]/);
  assert.doesNotMatch(source, /pt-20 md:pt-20/);
  assert.match(source, /Filters/);
  assert.match(source, /Sort/);
  assert.match(source, /chevron_left/);
  assert.match(source, /chevron_right/);
  assert.match(source, /flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-4/);
});

test("no-results rent-equipment templates no longer contain the trust and safety section", async () => {
  const [viewSource, resultsSource] = await Promise.all([
    readFile(new URL("../app/rent-equipment/RentEquipmentView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/rent-equipment/RentEquipmentResults.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(viewSource, /Trust &amp; Safety|Trust & Safety/);
  assert.doesNotMatch(resultsSource, /Trust &amp; Safety|Trust & Safety/);
  assert.match(viewSource, /href="\/support"|router\.push\("\/support"\)/);
  assert.match(viewSource, /No equipment available right now/);
  assert.match(viewSource, /Call Our Expert Support/);
  assert.match(viewSource, /support_agent/);
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

test("mobile workspace chrome prevents justified header text and bottom nav overlap", async () => {
  const [globalsSource, shellSource] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../components/owner-profile/OwnerProfileWorkspaceShell.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(shellSource, /kk-workspace-shell/);
  assert.match(shellSource, /kk-workspace-header/);
  assert.match(shellSource, /kk-workspace-main/);
  assert.match(shellSource, /kk-workspace-local-footer/);
  assert.match(shellSource, /kk-workspace-mobile-nav/);
  assert.match(shellSource, /env\(safe-area-inset-bottom\)/);
  assert.match(globalsSource, /kk-workspace-header[\s\S]*text-align: start/);
  assert.match(globalsSource, /kk-workspace-local-footer[\s\S]*text-align: start/);
  assert.match(globalsSource, /@media \(max-width: 767px\)[\s\S]*kk-workspace-header[\s\S]*text-align: start/);
  assert.match(globalsSource, /kk-workspace-main[\s\S]*padding-bottom: calc\(7rem \+ env\(safe-area-inset-bottom\)\)/);
});
