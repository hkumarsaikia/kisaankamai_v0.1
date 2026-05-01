import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readSource(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("coming soon notify submissions use backend, Sheets, and flow-button states without SMTP deployment blockers", async () => {
  const [
    page,
    route,
    validation,
    types,
    sheetsMirror,
    sheetsServer,
    firebaseData,
    workbookManifest,
    apphosting,
    packageJson,
  ] = await Promise.all([
    readSource("../app/coming-soon/page.tsx"),
    readSource("../app/api/forms/coming-soon-notify/route.ts").catch(() => ""),
    readSource("../lib/validation/forms.ts"),
    readSource("../lib/local-data/types.ts"),
    readSource("../lib/server/sheets-mirror.ts"),
    readSource("../lib/server/google-sheets.ts"),
    readSource("../lib/server/firebase-data.ts"),
    readSource("../data/operational-sheets-workbook.json"),
    readSource("../apphosting.yaml"),
    readSource("../package.json"),
  ]);

  assert.match(page, /postJson<\{ ok: boolean; id: string \}>\("\/api\/forms\/coming-soon-notify"/);
  assert.match(page, /kk-flow-button/);
  assert.match(page, /kk-flow-spinner/);
  assert.match(page, /submitState === "pending"/);
  assert.match(page, /submitState === "success"/);

  assert.match(route, /comingSoonNotifySchema/);
  assert.match(route, /type:\s*"coming-soon-notify"/);
  assert.match(validation, /comingSoonNotifySchema/);
  assert.match(types, /\|\s*"coming-soon-notify"/);
  assert.match(sheetsMirror, /submission\.type === "coming-soon-notify"/);
  assert.match(sheetsMirror, /sheet:\s*"coming_soon_notifications"/);
  assert.match(workbookManifest, /"coming_soon_notifications"/);

  assert.match(sheetsServer, /updatedRange/);
  assert.doesNotMatch(firebaseData, /notifyFormSubmission/);
  assert.doesNotMatch(sheetsServer, /email_config_missing/);
  assert.doesNotMatch(packageJson, /"nodemailer"/);
  assert.doesNotMatch(apphosting, /KK_SMTP_/);
});

test("profile support and feedback workspaces have Other category, localized copy, and shared flow buttons", async () => {
  const [support, feedback, shell] = await Promise.all([
    readSource("../components/profile/ProfileSupportWorkspace.tsx"),
    readSource("../components/profile/ProfileFeedbackForm.tsx"),
    readSource("../components/owner-profile/OwnerProfileWorkspaceShell.tsx"),
  ]);

  assert.match(support, /useLanguage/);
  assert.match(support, /localizedText|langText/);
  assert.match(support, /"Other"/);
  assert.doesNotMatch(support, /Fastest Path/);
  assert.match(support, /kk-flow-button/);
  assert.match(support, /kk-flow-spinner/);

  assert.match(feedback, /useLanguage/);
  assert.match(feedback, /localizedText|langText/);
  assert.match(feedback, /"Other"/);
  assert.match(feedback, /kk-flow-button/);
  assert.match(feedback, /kk-flow-spinner/);

  assert.doesNotMatch(shell, /Back to Home/);
  assert.match(shell, /href="\/"[\s\S]*Kisan Kamai/);
});

test("profile settings use supplied structures, uploads, readonly phone, district dropdown, and optional verification", async () => {
  const [settings, route, storage, profileRoute, validation, types, workbook] = await Promise.all([
    readSource("../components/profile/ProfileSettingsForm.tsx"),
    readSource("../app/api/profile/assets/route.ts").catch(() => ""),
    readSource("../lib/server/firebase-storage.ts"),
    readSource("../app/api/profile/complete/route.ts"),
    readSource("../lib/validation/forms.ts"),
    readSource("../lib/local-data/types.ts"),
    readSource("../data/operational-sheets-workbook.json"),
  ]);

  assert.match(settings, /Change Profile Picture/);
  assert.match(settings, /profilePhotoInputRef/);
  assert.match(settings, /useAuth/);
  assert.match(settings, /setSession/);
  assert.match(settings, /payload\.session/);
  assert.match(settings, /setSession\(payload\.session\)/);
  assert.match(settings, /emitAuthSyncEvent\("session-refresh"\)/);
  assert.match(settings, /refreshProfile\(\)/);
  assert.doesNotMatch(settings, /aria-label="Upload or change profile picture"/);
  assert.match(settings, /readOnly[\s\S]*Phone/);
  assert.match(settings, /MAHARASHTRA_DISTRICTS/);
  assert.match(settings, /<select[\s\S]*extraProfileState\.district/);
  assert.match(settings, /Identity Verification \(Optional\)/);
  assert.match(settings, /frontDocument/);
  assert.match(settings, /backDocument/);
  assert.match(settings, /verificationStatus:\s*"submitted"/);
  assert.match(settings, /\/api\/profile\/assets/);

  assert.match(route, /assetType/);
  assert.match(route, /profile-photo/);
  assert.match(route, /getLocalSessionByUserId/);
  assert.match(route, /session:\s*updatedSession/);
  assert.match(route, /identity-documents/);
  assert.match(storage, /uploadProfileAsset/);
  assert.match(profileRoute, /farmingTypes/);
  assert.match(validation, /farmingTypes/);
  assert.match(types, /farmingTypes\?: string/);
  assert.match(workbook, /"farming_types"/);
});

test("listing editor uses three photo slots, Other equipment type, no description or tags, and gallery arrows", async () => {
  const [editor, actions] = await Promise.all([
    readSource("../components/owner-profile/ListEquipmentEditorPage.tsx"),
    readSource("../lib/actions/local-data.ts"),
  ]);

  assert.match(editor, /MAX_LISTING_IMAGES = 3/);
  assert.match(editor, /Photo 1/);
  assert.match(editor, /Photo 2/);
  assert.match(editor, /Photo 3/);
  assert.match(editor, /customCategory/);
  assert.match(editor, /value="other"/);
  assert.match(editor, /previewImageIndex/);
  assert.match(editor, /chevron_left/);
  assert.match(editor, /chevron_right/);
  assert.doesNotMatch(editor, /Trust Policy/);
  assert.doesNotMatch(editor, /Description &amp; Photos/);
  assert.doesNotMatch(editor, /Listing Description \*/);
  assert.doesNotMatch(editor, /formState\.tags/);
  assert.doesNotMatch(editor, /<span[^>]*>Tags<\/span>/);

  assert.doesNotMatch(actions, /description\) \{/);
  assert.match(actions, /formData\.get\("description"\)\s*\|\|\s*""/);
});

test("equipment detail supports workspace chrome, sticky booking panel, and unauthenticated toast", async () => {
  const [detail, layout, ownerPage, renterPage, ownerBrowser, renterBrowser, ownerBookings, renterBookings] =
    await Promise.all([
      readSource("../app/equipment/[id]/EquipmentDetailClient.tsx"),
      readSource("../lib/equipment-detail-layout.js"),
      readSource("../app/owner-profile/equipment/[id]/page.tsx").catch(() => ""),
      readSource("../app/renter-profile/equipment/[id]/page.tsx").catch(() => ""),
      readSource("../components/owner-profile/OwnerEquipmentBrowser.tsx"),
      readSource("../components/renter-profile/RenterEquipmentBrowser.tsx"),
      readSource("../components/profile/OwnerBookingsBoard.tsx"),
      readSource("../components/renter-profile/RenterBookingsBoard.tsx"),
    ]);

  assert.match(detail, /showBreadcrumbs/);
  assert.match(detail, /please login or register/i);
  assert.doesNotMatch(detail, /router\.push\("\/login"\)/);
  assert.match(layout, /lg:sticky/);
  assert.match(layout, /lg:max-h-none/);
  assert.match(ownerPage, /OwnerProfileWorkspaceShell/);
  assert.match(ownerPage, /showBreadcrumbs=\{false\}/);
  assert.match(renterPage, /OwnerProfileWorkspaceShell/);
  assert.match(renterPage, /showBreadcrumbs=\{false\}/);
  assert.match(ownerBrowser, /\/owner-profile\/equipment\/\$\{listing\.id\}/);
  assert.match(renterBrowser, /\/renter-profile\/equipment\/\$\{item\.id\}/);
  assert.match(ownerBookings, /\/owner-profile\/equipment\/\$\{listing\?\.id \|\| booking\.listingId\}/);
  assert.match(renterBookings, /\/renter-profile\/equipment\/\$\{listing\?\.id \|\| booking\.listingId\}/);
});

test("profile workspace route shells use localized titles and subtitles", async () => {
  const workspacePages = [
    "../app/owner-profile/page.tsx",
    "../app/owner-profile/browse/page.tsx",
    "../app/owner-profile/bookings/page.tsx",
    "../app/owner-profile/earnings/page.tsx",
    "../app/owner-profile/settings/page.tsx",
    "../app/owner-profile/feedback/page.tsx",
    "../app/owner-profile/support/page.tsx",
    "../app/renter-profile/page.tsx",
    "../app/renter-profile/browse/page.tsx",
    "../app/renter-profile/bookings/page.tsx",
    "../app/renter-profile/saved/page.tsx",
    "../app/renter-profile/settings/page.tsx",
    "../app/renter-profile/feedback/page.tsx",
    "../app/renter-profile/support/page.tsx",
  ];

  for (const filePath of workspacePages) {
    const source = await readSource(filePath);
    assert.match(source, /localizedText/);
    assert.match(source, /title=\{localizedText\(/);
    assert.match(source, /subtitle=\{localizedText\(/);
    assert.doesNotMatch(source, /title="[^"]+"/);
    assert.doesNotMatch(source, /subtitle="[^"]+"/);
    assert.doesNotMatch(source, /\/\s*[\u0900-\u097F]/);
  }
});

test("profile workspace main content uses runtime language hooks instead of static bilingual copy", async () => {
  const workspaceComponentFiles = [
    "../components/owner-profile/OwnerEquipmentBrowser.tsx",
    "../components/profile/OwnerBookingsBoard.tsx",
    "../components/renter-profile/RenterBookingsBoard.tsx",
    "../components/renter-profile/RenterEquipmentBrowser.tsx",
    "../components/profile/SavedListingsBoard.tsx",
    "../components/profile/ProfileSettingsForm.tsx",
    "../components/profile/ProfileSupportWorkspace.tsx",
    "../components/profile/ProfileFeedbackForm.tsx",
    "../components/profile/ProfileFeedbackSuccessCard.tsx",
    "../components/owner-profile/ListEquipmentEditorPage.tsx",
    "../app/owner-profile/earnings/page.tsx",
    "../app/renter-profile/earnings/page.tsx",
  ];

  for (const filePath of workspaceComponentFiles) {
    const source = await readSource(filePath);
    assert.match(source, /useLanguage|localizedText|LocalizedText|langText|text\(/, `${filePath} must use workspace localization`);
    assert.doesNotMatch(source, />[^<>{}]*\/\s*[\u0900-\u097F][^<>{}]*</, `${filePath} must not render inline English/Marathi slash copy`);
  }
});

test("dark-mode overlays and depth tiles avoid the requested vignette and white glare", async () => {
  const [globals, dropdown, register, forgot, verifyOtp, profileSelection, support, ownerBenefits] =
    await Promise.all([
      readSource("../app/globals.css"),
      readSource("../components/ProfileDropdownMenu.tsx"),
      readSource("../app/register/page.tsx"),
      readSource("../app/forgot-password/page.tsx"),
      readSource("../app/forgot-password/verify-otp/page.tsx"),
      readSource("../app/profile-selection/page.tsx"),
      readSource("../app/support/page.tsx"),
      readSource("../app/owner-benefits/page.tsx"),
    ]);

  assert.doesNotMatch(globals, /radial-gradient\(circle at var\(--kk-depth-glare/);
  assert.doesNotMatch(globals, /\.dark \.kk-banner-image-overlay[\s\S]*?radial-gradient/);
  assert.doesNotMatch(globals, /\.dark \.kk-dark-image-overlay[\s\S]*?0\.94/);
  assert.match(globals, /--kk-depth-sheen-opacity/);
  assert.match(dropdown, /kk-profile-trigger/);
  assert.doesNotMatch(dropdown, /shadow-\[0_16px_38px_-22px_rgba\(0,0,0,0\.85\)\]/);
  assert.match(register, /dark:text-primary/);
  assert.doesNotMatch(forgot, /shadow-2xl/);
  assert.doesNotMatch(verifyOtp, /kk-dark-image-overlay/);
  assert.match(profileSelection, /dark:bg-slate-900/);
  assert.match(support, /object-\[center_18%\]/);
  assert.match(ownerBenefits, /glass-card rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-xl max-w-5xl mx-auto/);
});
