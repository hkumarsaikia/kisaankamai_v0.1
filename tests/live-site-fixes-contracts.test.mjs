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

  assert.match(support, /Contact Us/);
  assert.match(support, /district/);
  assert.match(support, /inquiryType/);
  assert.match(support, /Renting Equipment/);
  assert.match(support, /Listing Equipment/);
  assert.match(support, /Support Issue/);
  assert.match(support, /Send Message/);
  assert.match(support, /object-\[center_35%\]|object-\[center_30%\]/);
  assert.match(support, /scrollTo\(\{\s*top:\s*0/);
  assert.doesNotMatch(support, /Send us a message/);
  assert.doesNotMatch(support, /Owner Support Priority/);
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
  const ownerBenefits = await readSource("../app/owner-benefits/page.tsx");
  const districtSource = await readSource("../lib/auth/india-districts.ts");

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
  }
  assert.match(googleSheets, /banding|BANDING|bandedRange/i);
  assert.match(appsScript, /MailApp\.sendEmail/);
  assert.match(appsScript, /hkumarsaikia@gmail\.com/);
  assert.match(appsScript, /notification_email_sent_at/);
  assert.match(docs, /Apps Script/);
  assert.match(docs, /hkumarsaikia@gmail\.com/);
});

test("app source does not keep visible inline English Marathi slash labels", async () => {
  const offenders = [];
  const pattern =
    /(Full Name|Phone|Email|Category|Message|Role|Feature Category|Submit|Contact|Support|Owner|Renter)\s*\/\s*[\u0900-\u097F]/;

  for (const [file, source] of await readAppSources()) {
    if (pattern.test(source)) {
      offenders.push(file);
    }
  }

  assert.deepEqual(offenders, []);
});
