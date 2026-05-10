import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("site defaults to light mode and does not follow system dark mode by default", async () => {
  const layoutSource = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(layoutSource, /defaultTheme="light"/);
  assert.doesNotMatch(layoutSource, /defaultTheme="system"/);
  assert.doesNotMatch(layoutSource, /enableSystem(?!={false})/);
  assert.match(layoutSource, /kk-theme-boot/);
});

test("language provider hydrates from the boot language to avoid saved-language flash", async () => {
  const [languageSource, layoutSource] = await Promise.all([
    readFile(new URL("../components/LanguageContext.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(languageSource, /readInitialLanguage/);
  assert.match(languageSource, /initialLanguage\?: Language/);
  assert.match(languageSource, /useState<Language>\(\(\) => readInitialLanguage\(initialLanguage\)\)/);
  assert.match(languageSource, /document\.cookie = `\$\{STORAGE_KEY\}=\$\{language\}/);
  assert.match(languageSource, /document\.documentElement\.dataset\.language/);
  assert.match(languageSource, /localStorage\.setItem\(STORAGE_KEY, language\)/);
  assert.doesNotMatch(languageSource, /useState<Language>\(DEFAULT_LANGUAGE\)/);
  assert.doesNotMatch(languageSource, /setLanguage\(saved\)/);

  assert.match(layoutSource, /cookies\(\)/);
  assert.match(layoutSource, /normalizeLanguage\(cookieStore\.get\(LANGUAGE_COOKIE_NAME\)\?\.value\)/);
  assert.match(layoutSource, /<html lang=\{initialLanguage\} data-language=\{initialLanguage\}/);
  assert.match(layoutSource, /<LanguageProvider initialLanguage=\{initialLanguage\}>/);
  assert.match(layoutSource, /kk_language_cookie_migrated/);
  assert.match(layoutSource, /window\.location\.replace\(window\.location\.href\)/);
});

test("categories keep a baseline catalog while merging live owner listing categories", async () => {
  const [categorySource, categoriesPageSource, rentPageSource] = await Promise.all([
    readFile(new URL("../lib/equipment-categories.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/categories/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/rent-equipment/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(categorySource, /BASE_EQUIPMENT_CATEGORIES/);
  for (const slug of ["tractors", "harvesters", "implements", "ploughs", "sprayers", "rotavators", "seeders", "threshers", "pumps", "balers", "trolleys"]) {
    assert.match(categorySource, new RegExp(`slug:\\s*"${slug}"`));
  }
  assert.match(categorySource, /getMergedCategorySummariesFromEquipment/);
  assert.match(categoriesPageSource, /getMergedCategorySummariesFromEquipment/);
  assert.match(rentPageSource, /getMergedCategorySummariesFromEquipment/);
  assert.doesNotMatch(categoriesPageSource, /No live categories yet/);
});

test("support page renders one selected language without inline bilingual slash labels", async () => {
  const supportSource = await readFile(new URL("../app/support/page.tsx", import.meta.url), "utf8");

  assert.match(supportSource, /useLanguage/);
  assert.match(supportSource, /langText/);
  assert.match(supportSource, /langText\("Message", "संदेश"\)/);
  assert.match(supportSource, /langText\("We usually respond within 24 hours\.", "आम्ही साधारणपणे २४ तासांत प्रतिसाद देतो\."\)/);
  assert.doesNotMatch(supportSource, /Message \/ संदेश|We usually respond within 24 hours\. \/ आम्ही/);
  assert.doesNotMatch(supportSource, /Full Name\s*\/|Phone\s*\/|Email\s*\/|Category\s*\/|What happened\?\s*\/|Mobile Number\s*\/|District\s*\/|Description\s*\//);
});

test("owner benefits removes the two requested hero templates", async () => {
  const ownerBenefitsSource = await readFile(new URL("../app/owner-benefits/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(ownerBenefitsSource, /owner-benefits\.steady_income/);
  assert.doesNotMatch(ownerBenefitsSource, /owner-benefits\.verified_renters/);
});

test("phone-only auth disables Google registration and login flows", async () => {
  const [loginSource, registerSource, googleResolveSource, googleRegisterSource, docsSource] = await Promise.all([
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/google/resolve/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/google/register/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../docs/DEVELOPMENT.md", import.meta.url), "utf8"),
  ]);

  for (const source of [loginSource, registerSource]) {
    assert.doesNotMatch(source, /GoogleAuthButton|Continue with Google|Create account with Google/);
  }
  for (const source of [googleResolveSource, googleRegisterSource]) {
    assert.match(source, /Google sign-in is disabled/);
    assert.match(source, /status:\s*410/);
  }
  assert.match(docsSource, /phone-only/i);
  assert.doesNotMatch(docsSource, /Existing Google accounts|New Google accounts/);
});

test("email and phone uniqueness use identifier lock documents", async () => {
  const firebaseDataSource = await readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8");

  assert.match(firebaseDataSource, /AUTH_IDENTIFIERS_COLLECTION/);
  assert.match(firebaseDataSource, /claimAuthIdentifier/);
  assert.match(firebaseDataSource, /releaseAuthIdentifier/);
  assert.match(firebaseDataSource, /runTransaction/);
});

test("sessions persist beyond the old five-day window and profile photos are part of the session contract", async () => {
  const [localAuthSource, typesSource, profileMenuSource] = await Promise.all([
    readFile(new URL("../lib/server/local-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/local-data/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/ProfileDropdownMenu.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(localAuthSource, /SESSION_MAX_AGE_DAYS\s*=\s*14/);
  assert.match(typesSource, /photoUrl\?: string/);
  assert.match(profileMenuSource, /photoUrl/);
  assert.doesNotMatch(profileMenuSource, /aida-public\/AB6AXuAPynK0ZgVc0Xzw8MYvvIJVEOBk4/);
});

test("auth state and Google map type stay synchronized across browser tabs", async () => {
  const [authContextSource, authSyncSource, loginSource, logoutSource, mapSource] = await Promise.all([
    readFile(new URL("../components/AuthContext.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/client/auth-sync.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/logout/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/MapComponent.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(authSyncSource, /BroadcastChannel/);
  assert.match(authSyncSource, /kk_auth_sync_event/);
  assert.match(authContextSource, /subscribeToAuthSyncEvents/);
  assert.match(authContextSource, /visibilitychange/);
  assert.match(authContextSource, /pageshow/);
  assert.match(authContextSource, /router\.refresh/);
  assert.match(loginSource, /emitAuthSyncEvent\("login"\)/);
  assert.match(logoutSource, /emitAuthSyncEvent\("logout"\)/);

  assert.match(mapSource, /GOOGLE_MAP_TYPE_STORAGE_KEY/);
  assert.match(mapSource, /onMapTypeIdChanged/);
  assert.match(mapSource, /localStorage\.setItem\(GOOGLE_MAP_TYPE_STORAGE_KEY/);
  assert.doesNotMatch(mapSource, /mapTypeId:\s*"terrain"/);
});

test("public listings require real owner media and no verified mock defaults", async () => {
  const [firebaseDataSource, actionSource, editorSource, ownerRegistrationSource] = await Promise.all([
    readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/actions/local-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/owner-profile/ListEquipmentEditorPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-registration/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(firebaseDataSource, /isPublicListingReady/);
  assert.match(firebaseDataSource, /listing\.imagePaths\.length > 0/);
  assert.match(firebaseDataSource, /!listing\.coverImage\.includes\("\/assets\/generated\/"\)/);
  assert.match(actionSource, /Upload at least one real equipment photo before publishing a listing/);
  assert.match(actionSource, /ownerVerified: false/);
  assert.doesNotMatch(actionSource, /\/assets\/generated\/hero_tractor\.png/);
  assert.doesNotMatch(actionSource, /\["Verified"\]/);
  assert.match(editorSource, /BASE_EQUIPMENT_CATEGORIES/);
  assert.match(ownerRegistrationSource, /redirect\("\/list-equipment"\)/);
});

test("report API compatibility, rate limits, and booking conflicts have backend contracts", async () => {
  const [
    reportRouteSource,
    validationSource,
    typeSource,
    rateLimitSource,
    loginRouteSource,
    registerPreflightRouteSource,
    passwordResetRouteSource,
    supportRouteSource,
    bugReportRouteSource,
    firebaseDataSource,
    sheetsMirrorSource,
    operationalDataSource,
  ] = await Promise.all([
    readFile(new URL("../app/api/forms/report/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/validation/forms.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/local-data/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/rate-limit.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/login/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/register/preflight/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/password-reset/request/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/forms/support-request/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/bug-reports/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/sheets-mirror.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/lib/operational-data.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(reportRouteSource, /reportSubmissionSchema/);
  assert.match(reportRouteSource, /type:\s*"report"/);
  assert.match(validationSource, /reportSubmissionSchema/);
  assert.match(typeSource, /\|\s*"report"/);
  assert.match(sheetsMirrorSource, /submission\.type === "report"/);
  assert.match(operationalDataSource, /"report"/);

  assert.match(rateLimitSource, /RATE_LIMITS_COLLECTION = "rate-limits"/);
  assert.match(rateLimitSource, /HttpError\(429/);
  for (const source of [loginRouteSource, registerPreflightRouteSource, passwordResetRouteSource, supportRouteSource, bugReportRouteSource]) {
    assert.match(source, /assertRateLimit/);
  }

  assert.match(firebaseDataSource, /availabilityBlockingBookingStatuses/);
  assert.match(firebaseDataSource, /dateRangeOverlaps/);
  assert.match(firebaseDataSource, /duplicateBooking/);
  assert.match(firebaseDataSource, /This equipment already has a booking request for the selected dates/);
});

test("client bug reporting is throttled before hitting the backend rate limit", async () => {
  const [clientBugReportingSource, performanceMonitorSource] = await Promise.all([
    readFile(new URL("../lib/client/bug-reporting.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/PerformanceMonitor.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(clientBugReportingSource, /CLIENT_REPORT_MAX_PER_MINUTE/);
  assert.match(clientBugReportingSource, /CLIENT_REPORT_MAX_PER_MINUTE\s*=\s*2/);
  assert.match(clientBugReportingSource, /CLIENT_REPORT_WINDOW_STORAGE_KEY/);
  assert.match(clientBugReportingSource, /clientReportWindow/);
  assert.match(clientBugReportingSource, /readStoredReportWindow/);
  assert.match(clientBugReportingSource, /writeStoredReportWindow/);
  assert.match(clientBugReportingSource, /localStorage\.getItem\(CLIENT_REPORT_WINDOW_STORAGE_KEY\)/);
  assert.match(clientBugReportingSource, /localStorage\.setItem\(\s*CLIENT_REPORT_WINDOW_STORAGE_KEY/);
  assert.match(clientBugReportingSource, /shouldDispatchClientReport/);
  assert.match(clientBugReportingSource, /return false/);
  assert.match(clientBugReportingSource, /dispatchEnvelope\(baseEnvelope\(input\)\)/);
  assert.match(performanceMonitorSource, /metric\.rating !== "poor"/);
  assert.doesNotMatch(performanceMonitorSource, /metric\.rating === "good"/);
});

test("root layout keeps icon fonts and public session bootstrap lean", async () => {
  const layoutSource = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(layoutSource, /materialSymbolsIconNames/);
  assert.match(layoutSource, /icon_names=\$\{materialSymbolsIconNames\}/);
  assert.match(layoutSource, /materialSymbolsStylesheetHref/);
  assert.match(layoutSource, /kk-material-symbols-loader/);
  assert.match(layoutSource, /strategy="afterInteractive"/);
  assert.doesNotMatch(layoutSource, /rel="stylesheet"[\s\S]*Material\+Symbols\+Outlined/);
  assert.match(layoutSource, /display=swap/);
  assert.doesNotMatch(layoutSource, /opsz,wght,FILL,GRAD@20\.\.48,100\.\.700,0\.\.1,-50\.\.200/);
  assert.doesNotMatch(layoutSource, /import \{ getCurrentSession \} from "@\/lib\/server\/local-auth"/);
  assert.match(layoutSource, /SESSION_COOKIE_NAME/);
  assert.match(layoutSource, /await import\("@\/lib\/server\/local-auth"\)/);
  assert.match(layoutSource, /cookieStore\.get\(SESSION_COOKIE_NAME\)\?\.value/);
});

test("homepage initial render avoids below-the-fold map and inactive hero image payload", async () => {
  const [homeSource, layoutSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(homeSource, /currentHeroSlide/);
  assert.doesNotMatch(homeSource, /heroSlides\.map\(\(slide, index\) => \(/);
  assert.match(homeSource, /loading="eager"/);
  assert.match(homeSource, /priority/);
  assert.match(homeSource, /fetchPriority="high"/);
  assert.match(homeSource, /window\.setTimeout/);
  assert.match(homeSource, /12000/);
  assert.match(homeSource, /window\.setInterval/);
  assert.doesNotMatch(homeSource, /setInterval\(\(\) => \{\s*setCurrentSlide[\s\S]*\}, 5000\)/);
  assert.match(homeSource, /deferUntilVisible=\{true\}/);
  assert.doesNotMatch(homeSource, /deferUntilVisible=\{false\}/);
  assert.match(layoutSource, /preload:\s*false/);
  assert.match(layoutSource, /weight:\s*\["400", "500", "600", "700", "800"\]/);
});

test("public marketing pages expose runtime Marathi copy in their main content", async () => {
  const [categoriesSource, comingSoonSource, partnerSource] = await Promise.all([
    readFile(new URL("../app/categories/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/coming-soon/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/partner/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(categoriesSource, /LocalizedText/);
  assert.match(categoriesSource, /उपकरण श्रेणी/);
  assert.match(comingSoonSource, /useLanguage/);
  assert.match(comingSoonSource, /महाराष्ट्रातील १४ जिल्ह्यांमध्ये/);
  assert.match(partnerSource, /useLanguage/);
  assert.match(partnerSource, /महाराष्ट्रात कृषी उपकरणांची उपलब्धता वाढवा/);
});
