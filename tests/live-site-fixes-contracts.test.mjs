import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const readSource = (filePath) => readFile(new URL(filePath, import.meta.url), "utf8");

async function readAppSources() {
  const root = new URL("../app/", import.meta.url);
  const files = [];

  async function walk(directoryUrl) {
    for (const entry of await readdir(directoryUrl, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") {
        continue;
      }

      const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directoryUrl);
      if (entry.isDirectory()) {
        await walk(entryUrl);
        continue;
      }

      if (/\.(tsx|ts|js|mjs)$/.test(entry.name)) {
        files.push([path.relative(root.pathname, entryUrl.pathname), await readFile(entryUrl, "utf8")]);
      }
    }
  }

  await walk(root);
  return files;
}

test("header keeps logged-in profile controls mounted during auth refreshes", async () => {
  const [header, authContext] = await Promise.all([
    readSource("../components/Header.tsx"),
    readSource("../components/AuthContext.tsx"),
  ]);

  assert.doesNotMatch(header, /!\s*loading\s*&&\s*user\s*&&\s*\(/);
  assert.match(header, /\{user\s*\?\s*\(/);
  assert.doesNotMatch(header, /!\s*loading\s*&&\s*!\s*user/);
  assert.match(authContext, /refreshing/);
  assert.doesNotMatch(authContext, /const \[loading, setLoading\] = useState\(false\)/);
});

test("Google Maps apply persisted map type without controlling mapTypeId on every render", async () => {
  const mapSource = await readSource("../components/MapComponent.tsx");

  assert.match(mapSource, /readStoredGoogleMapType/);
  assert.match(mapSource, /applyGoogleMapType/);
  assert.match(mapSource, /storage/);
  assert.match(mapSource, /mapInstance\.setMapTypeId\(readStoredGoogleMapType\(\)\)/);
  assert.doesNotMatch(mapSource, /options=\{\{[\s\S]*mapTypeId,/);
});

test("support page uses the provided contact form shape and removes owner support priority", async () => {
  const support = await readSource("../app/support/page.tsx");

  assert.match(support, /supportHtmlCategories/);
  assert.match(support, /bg-white\/80 backdrop-blur-xl border border-white shadow-xl/);
  assert.match(support, /Need urgent help\?/);
  assert.match(support, /Submit Request/);
  assert.match(support, /How can we help you today\?/);
  assert.match(support, /Need urgent help\?/);
  assert.match(support, /supportContact\.primaryContactName/);
  assert.doesNotMatch(support, /placeholder=\{langText\("Search|Search support topics/);
  assert.doesNotMatch(support, /Search for answers/);
  assert.doesNotMatch(support, /1800-123-4567|Pune, Maharashtra/);
  assert.match(support, /Send us a message/);
  assert.match(support, /We usually respond within 24 hours\. \/ आम्ही साधारणपणे २४ तासांत प्रतिसाद देतो\./);
  assert.match(support, /inquiryType/);
  assert.match(support, /Select a category/);
  assert.match(support, /Send Message/);
  assert.match(support, /Message \/ संदेश/);
  assert.doesNotMatch(support, /langText\("Submit Request"/);
  assert.match(support, /object-\[center_18%\]|object-\[center_35%\]|object-\[center_30%\]/);
  assert.match(support, /scrollTo\(\{\s*top:\s*0/);
  assert.match(support, /<section className="mx-auto mb-24 grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12">/);
  assert.match(support, /lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-surface-container-high/);
  assert.match(support, /space-y-6 lg:col-span-5/);
  assert.match(support, /w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors/);
  assert.doesNotMatch(support, /lg:order-2|lg:order-1|order-2|order-1/);
  assert.doesNotMatch(support, /Contact Us/);
  assert.doesNotMatch(support, /District or Taluka|Optional email/);
  assert.doesNotMatch(support, /Owner Support Priority/);
});

test("forgot password uses the supplied reset layout while preserving the reset API flow", async () => {
  const forgot = await readSource("../app/forgot-password/page.tsx");

  assert.match(forgot, /Rooted in Trust/);
  assert.match(forgot, /विश्वासावर आधारित/);
  assert.match(forgot, /bg-white\/70 backdrop-blur-md/);
  assert.match(forgot, /Contact Support/);
  assert.match(forgot, /Reset your password/);
  assert.match(forgot, /Back to Sign In/);
  assert.match(forgot, /Send Reset Code/);
  assert.match(forgot, /\/api\/auth\/password-reset\/request/);
  assert.match(forgot, /router\.push\("\/forgot-password\/verify-otp"\)/);
  assert.match(forgot, /fieldImage/);
  assert.match(forgot, /blur-sm/);
  assert.doesNotMatch(forgot, /Secure Access/);
  assert.doesNotMatch(forgot, /Continue", "पुढे जा"/);
});

test("feature request role and select controls include Other with one custom arrow", async () => {
  const [featureRequest, validation] = await Promise.all([
    readSource("../app/feature-request/page.tsx"),
    readSource("../lib/validation/forms.ts"),
  ]);

  assert.match(featureRequest, /option value="other"/);
  assert.doesNotMatch(featureRequest, /option value="visitor"/);
  assert.match(featureRequest, /kk-select-control/);
  assert.match(featureRequest, /kk-select-arrow/);
  assert.match(validation, /\["farmer", "owner", "partner", "other"\]/);
});

test("owner benefits uses compact selectors, all Maharashtra districts, and no removed tiles", async () => {
  const [ownerBenefits, districtSource, globals, tailwind] = await Promise.all([
    readSource("../app/owner-benefits/page.tsx"),
    readSource("../lib/auth/india-districts.ts"),
    readSource("../app/globals.css"),
    readSource("../tailwind.config.mjs"),
  ]);

  assert.match(ownerBenefits, /glass-card/);
  assert.match(ownerBenefits, /bg-gradient-brand/);
  assert.match(globals, /\.glass-card[\s\S]*backdrop-filter:\s*blur\(12px\)/);
  assert.match(globals, /\.bg-gradient-brand[\s\S]*linear-gradient\(135deg,\s*#143b2e 0%,\s*#265f4d 100%\)/);
  assert.match(tailwind, /brand:\s*\{[\s\S]*DEFAULT:\s*"#143B2E"/);
  assert.match(ownerBenefits, /Last Month's Earnings/);
  assert.match(ownerBenefits, /How Much Could You Earn\?/);
  assert.match(ownerBenefits, /Average Daily Rate/);
  assert.match(ownerBenefits, /<section className="py-24 bg-white relative">/);
  assert.match(ownerBenefits, /glass-card rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-xl max-w-5xl mx-auto/);
  assert.match(ownerBenefits, /block w-full pl-4 pr-10 py-3 text-base border-gray-200 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm rounded-xl bg-gray-50 appearance-none font-medium/);
  assert.match(ownerBenefits, /bg-gradient-brand rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center/);
  assert.match(ownerBenefits, /text-brand-100 font-medium mb-2 uppercase tracking-wide text-sm/);
  assert.doesNotMatch(ownerBenefits, /kk-form-section glass-card mx-auto max-w-5xl/);
  assert.match(ownerBenefits, /Your Equipment, Your Growth\./);
  assert.match(ownerBenefits, /href="\/login"[\s\S]*Start Now/);
  assert.match(ownerBenefits, /earningsEstimateRef/);
  assert.match(ownerBenefits, /scrollIntoView\(\{\s*behavior:\s*"smooth"/);
  assert.doesNotMatch(ownerBenefits, /More locations coming soon\.\.\./);
  assert.match(ownerBenefits, /visibleDistrict/);
  assert.match(ownerBenefits, /BASE_EQUIPMENT_CATEGORIES/);
  assert.match(ownerBenefits, /<select[\s\S]*selectedCategory\.label/);
  assert.doesNotMatch(ownerBenefits, /ownerEarningCategories\.map\(\(category\) => \(\s*<button/);
  assert.match(ownerBenefits, /MAHARASHTRA_DISTRICTS/);
  assert.match(ownerBenefits, /max-h-64/);
  assert.match(ownerBenefits, /text-\[clamp\(2rem,5vw,4rem\)\]/);
  assert.doesNotMatch(ownerBenefits, /platform_fee|safe_handoff_protocol|your_machine_is_our_priority/);

  for (const district of [
    "Mumbai City",
    "Mumbai Suburban",
    "Palghar",
    "Nashik",
    "Dhule",
    "Nandurbar",
    "Jalgaon",
    "Ahilyanagar",
    "Pune",
    "Satara",
    "Sangli",
    "Kolhapur",
    "Solapur",
    "Chhatrapati Sambhajinagar",
    "Jalna",
    "Beed",
    "Dharashiv",
    "Nanded",
    "Latur",
    "Parbhani",
    "Hingoli",
    "Akola",
    "Amravati",
    "Buldhana",
    "Yavatmal",
    "Washim",
    "Nagpur",
    "Wardha",
    "Bhandara",
    "Gondia",
    "Chandrapur",
    "Gadchiroli",
    "Raigad",
    "Ratnagiri",
    "Sindhudurg",
    "Thane",
  ]) {
    assert.match(districtSource, new RegExp(`"${district}"`));
  }
});

test("partner page removes the Next Steps template but keeps enquiry submission", async () => {
  const partner = await readSource("../app/partner/page.tsx");

  assert.doesNotMatch(partner, /const nextSteps/);
  assert.doesNotMatch(partner, /Next Steps/);
  assert.match(partner, /\/api\/forms\/partner-inquiry/);
  assert.match(partner, /Submit Enquiry/);
});

test("forms and Sheets include email automation metadata and Apps Script source", async () => {
  const [sheetsMirror, googleSheets, workbookManifest, docs] = await Promise.all([
    readSource("../lib/server/sheets-mirror.ts"),
    readSource("../lib/server/google-sheets.ts"),
    readSource("../data/operational-sheets-workbook.json"),
    readSource("../docs/OPERATIONS_GOOGLE_SHEETS.md"),
  ]);
  const appsScript = await readFile(
    new URL("../scripts/google-sheets-apps-script/Code.gs", import.meta.url),
    "utf8"
  );

  for (const source of [sheetsMirror, workbookManifest]) {
    assert.match(source, /notification_email_to/);
    assert.match(source, /notification_email_status/);
    assert.doesNotMatch(source, /email_config_missing/);
  }
  assert.match(googleSheets, /banding|BANDING|bandedRange/i);
  assert.match(appsScript, /MailApp\.sendEmail/);
  assert.doesNotMatch(appsScript, /KK_SMTP/);
  assert.match(appsScript, /hkumarsaikia@gmail\.com/);
  assert.match(appsScript, /notification_email_sent_at/);
  assert.match(docs, /Apps Script/);
  assert.match(docs, /hkumarsaikia@gmail\.com/);
});

test("newsletter submissions use the shared backend, Sheets, and loading success UI", async () => {
  const [
    footer,
    route,
    validation,
    types,
    sheetsMirror,
    workbookManifest,
    operationalData,
  ] = await Promise.all([
    readSource("../components/Footer.tsx"),
    readSource("../app/api/forms/newsletter-subscription/route.ts"),
    readSource("../lib/validation/forms.ts"),
    readSource("../lib/local-data/types.ts"),
    readSource("../lib/server/sheets-mirror.ts"),
    readSource("../data/operational-sheets-workbook.json"),
    readSource("../scripts/lib/operational-data.mjs"),
  ]);
  const appsScript = await readFile(
    new URL("../scripts/google-sheets-apps-script/Code.gs", import.meta.url),
    "utf8"
  );

  assert.match(footer, /postJson<\{ ok: boolean; id: string \}>\("\/api\/forms\/newsletter-subscription"/);
  assert.match(footer, /kk-flow-spinner/);
  assert.match(footer, /task_alt/);
  assert.match(footer, /data-loading/);
  assert.match(route, /newsletterSubscriptionSchema/);
  assert.match(route, /type:\s*"newsletter-subscription"/);
  assert.match(validation, /newsletterSubscriptionSchema/);
  assert.match(types, /\|\s*"newsletter-subscription"/);
  assert.match(sheetsMirror, /submission\.type === "newsletter-subscription"/);
  assert.match(sheetsMirror, /sheet:\s*"newsletter_subscriptions"/);
  assert.match(workbookManifest, /"newsletter_subscriptions"/);
  assert.match(workbookManifest, /"notification_email_status"/);
  assert.match(operationalData, /newsletter_subscriptions/);
  assert.match(appsScript, /newsletter_subscriptions/);
});

test("public form rate limits account for authenticated users and do not block every form by reused phone", async () => {
  const [rateLimit, supportRoute, featureRoute, feedbackRoute, partnerRoute] = await Promise.all([
    readSource("../lib/server/rate-limit.ts"),
    readSource("../app/api/forms/support-request/route.ts"),
    readSource("../app/api/forms/feature-request/route.ts"),
    readSource("../app/api/forms/feedback/route.ts"),
    readSource("../app/api/forms/partner-inquiry/route.ts"),
  ]);

  assert.match(rateLimit, /authenticatedUserId/);
  assert.match(rateLimit, /forms-authenticated-user/);
  assert.match(rateLimit, /limit:\s*30/);
  assert.doesNotMatch(rateLimit, /limit:\s*5,\s*\n\s*windowMs:\s*TEN_MINUTES_MS/);

  for (const source of [supportRoute, featureRoute, feedbackRoute, partnerRoute]) {
    assert.match(source, /getCurrentSession\(\)/);
    assert.match(source, /authenticatedUserId:\s*session\?\.user\.id/);
  }
});

test("category tiles keep fixed baseline images while live listings only update counts and links", async () => {
  const categorySource = await readSource("../lib/equipment-categories.ts");

  assert.match(categorySource, /preserveBaseCoverImage/);
  assert.doesNotMatch(categorySource, /coverImage:\s*liveCategory\.coverImage\s*\|\|/);
  assert.match(categorySource, /coverImage:\s*existing\.coverImage/);
});

test("owner listing photos are limited to three and mirrored as explicit URLs and storage paths", async () => {
  const [actions, wizard, editor, sheetsMirror, workbookManifest, operationalData] = await Promise.all([
    readSource("../lib/actions/local-data.ts"),
    readSource("../components/forms/OwnerListingWizard.tsx"),
    readSource("../components/owner-profile/ListEquipmentEditorPage.tsx"),
    readSource("../lib/server/sheets-mirror.ts"),
    readSource("../data/operational-sheets-workbook.json"),
    readSource("../scripts/lib/operational-data.mjs"),
  ]);

  assert.match(actions, /MAX_LISTING_IMAGES\s*=\s*3/);
  assert.match(actions, /Upload up to 3 listing images/);
  assert.match(wizard, /slice\(0,\s*MAX_LISTING_IMAGES\)/);
  assert.match(editor, /slice\(0,\s*MAX_LISTING_IMAGES\)/);
  for (const source of [sheetsMirror, workbookManifest, operationalData]) {
    assert.match(source, /gallery_image_1_url/);
    assert.match(source, /gallery_image_2_url/);
    assert.match(source, /gallery_image_3_url/);
    assert.match(source, /gallery_image_1_path/);
    assert.match(source, /gallery_image_2_path/);
    assert.match(source, /gallery_image_3_path/);
  }
});

test("rent equipment pages expose base search, query sort, and compact no-equipment spacing", async () => {
  const [viewSource, pageSource] = await Promise.all([
    readSource("../app/rent-equipment/RentEquipmentView.tsx"),
    readSource("../app/rent-equipment/page.tsx"),
  ]);

  assert.match(viewSource, /available-search-panel/);
  assert.match(viewSource, /aria-label=\{langText\("Sort results", "निकाल क्रम लावा"\)\}/);
  assert.match(viewSource, /pb-3 md:pb-4/);
  assert.match(viewSource, /pt-32 md:pt-36/);
  assert.doesNotMatch(viewSource, /pt-24 pb-16/);
  assert.match(pageSource, /balers:\s*\["baler"\]/);
  assert.match(pageSource, /pumps:\s*\["pump"\]/);
  assert.match(pageSource, /threshers:\s*\["thresher"\]/);
});

test("equipment detail has category breadcrumbs, public three-photo gallery, dark surfaces, sticky scroll, and own-listing toast", async () => {
  const [detailSource, layoutSource, actionSource] = await Promise.all([
    readSource("../app/equipment/[id]/EquipmentDetailClient.tsx"),
    readSource("../lib/equipment-detail-layout.js"),
    readSource("../lib/actions/local-data.ts"),
  ]);

  assert.match(detailSource, /href="\/categories"/);
  assert.match(detailSource, /rent-equipment\?query=\$\{categorySlug\}/);
  assert.match(detailSource, /galleryImages\.slice\(0,\s*3\)/);
  assert.match(detailSource, /ownListingToast/);
  assert.match(detailSource, /You cannot book your own listings/);
  assert.match(detailSource, /OWN_LISTING/);
  assert.match(detailSource, /kk-depth-tile/);
  assert.match(layoutSource, /bg-surface-container-lowest/);
  assert.match(layoutSource, /lg:max-h-none/);
  assert.doesNotMatch(layoutSource, /overflow-y-auto/);
  assert.match(actionSource, /code:\s*"OWN_LISTING"/);
});

test("profile menu is compact and the trigger has a soft 3D visual boundary", async () => {
  const profileMenu = await readSource("../components/ProfileDropdownMenu.tsx");

  assert.match(profileMenu, /kk-profile-trigger/);
  assert.match(profileMenu, /kk-depth-tile/);
  assert.match(profileMenu, /w-\[18rem\]/);
  assert.match(profileMenu, /py-2/);
  assert.doesNotMatch(profileMenu, /w-\[20rem\]/);
  assert.doesNotMatch(profileMenu, /py-5/);
});

test("global depth tiles use pointer-driven smooth 3D variables with reduced motion guard", async () => {
  const [globals, depthMotion, layout] = await Promise.all([
    readSource("../app/globals.css"),
    readSource("../components/DepthMotion.tsx"),
    readSource("../app/layout.tsx"),
  ]);

  assert.match(globals, /--kk-depth-rotate-x/);
  assert.match(globals, /--kk-depth-rotate-y/);
  assert.match(globals, /--kk-depth-glare-x/);
  assert.match(depthMotion, /pointermove/);
  assert.match(depthMotion, /prefers-reduced-motion/);
  assert.match(layout, /<DepthMotion\s*\/>/);
});

test("app source does not keep visible inline English Marathi slash labels", async () => {
  const offenders = [];
  const pattern =
    /(Full Name|Phone|Email|Category|Role|Feature Category|Submit|Contact|Support|Owner|Renter)\s*\/\s*[\u0900-\u097F]/;

  for (const [file, source] of await readAppSources()) {
    if (pattern.test(source)) {
      offenders.push(file);
    }
  }

  assert.deepEqual(offenders, []);
});
