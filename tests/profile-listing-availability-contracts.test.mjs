import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readSource(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("profile selection and footer override global justified copy where centered or footer layout is required", async () => {
  const [profileSelection, footer, globals] = await Promise.all([
    readSource("../app/profile-selection/page.tsx"),
    readSource("../components/Footer.tsx"),
    readSource("../app/globals.css"),
  ]);

  assert.match(profileSelection, /kk-profile-selection-hero-copy/);
  assert.match(profileSelection, /text-balance/);
  assert.match(profileSelection, /max-w-5xl/);
  assert.match(footer, /kk-site-footer/);
  assert.match(globals, /\.kk-profile-selection-hero-copy/);
  assert.match(globals, /\.kk-site-footer/);
});

test("owner booking cards remove Details action and keep aligned pending actions", async () => {
  const source = await readSource("../components/profile/OwnerBookingsBoard.tsx");

  assert.match(source, /canActOnPending \? "sm:grid-cols-3" : "sm:grid-cols-2"/);
  assert.match(source, /min-h-11 items-center justify-center/);
  assert.match(source, /owner-bookings-approve-button/);
  assert.match(source, /owner-bookings-decline-button/);
  assert.doesNotMatch(source, /detailsHref/);
  assert.doesNotMatch(source, /langText\("Details", "तपशील"\)/);
  assert.doesNotMatch(source, /href=\{detailsHref\}/);
});

test("profile settings removes preferred workspace editing from the settings form", async () => {
  const source = await readSource("../components/profile/ProfileSettingsForm.tsx");

  assert.doesNotMatch(source, /Preferred Workspace|पसंतीचा वर्कस्पेस/);
  assert.doesNotMatch(source, /workspaceOptions/);
});

test("list equipment has removable photo slots and owner-controlled availability", async () => {
  const [page, editor, actions] = await Promise.all([
    readSource("../app/list-equipment/page.tsx"),
    readSource("../components/owner-profile/ListEquipmentEditorPage.tsx"),
    readSource("../lib/actions/local-data.ts"),
  ]);

  assert.doesNotMatch(page, /Use the guided listing flow to publish equipment details, pricing, service area, and photos\./);
  assert.match(editor, /removePhotoSlot/);
  assert.match(editor, /aria-label=\{langText\(`Remove \$\{slotLabel\}`/);
  assert.match(editor, /URL\.createObjectURL/);
  assert.match(editor, /Temporarily unavailable/);
  assert.match(editor, /formData\.set\("availabilityMode"/);
  assert.match(actions, /resolveListingAvailability/);
  assert.match(actions, /availabilityMode/);
});

test("public and workspace equipment tiles use real listing availability for sort order and status dots", async () => {
  const [equipmentSource, rentView, renterBrowser, ownerBrowser, savedBoard, firebaseData, sortMenu] = await Promise.all([
    readSource("../lib/equipment.ts"),
    readSource("../app/rent-equipment/RentEquipmentView.tsx"),
    readSource("../components/renter-profile/RenterEquipmentBrowser.tsx"),
    readSource("../components/owner-profile/OwnerEquipmentBrowser.tsx"),
    readSource("../components/profile/SavedListingsBoard.tsx"),
    readSource("../lib/server/firebase-data.ts"),
    readSource("../components/equipment/EquipmentSortMenu.tsx"),
  ]);

  assert.match(equipmentSource, /getEquipmentAvailability/);
  assert.match(equipmentSource, /sortEquipmentByAvailabilityPriceDistance/);
  assert.match(rentView, /SortControl/);
  assert.match(rentView, /EquipmentSortMenu/);
  assert.match(rentView, /equipment-availability-dot/);
  assert.match(renterBrowser, /sortEquipmentByAvailabilityPriceDistance/);
  assert.match(renterBrowser, /EquipmentSortMenu/);
  assert.match(renterBrowser, /equipment-availability-dot/);
  assert.match(ownerBrowser, /equipment-availability-dot/);
  assert.match(savedBoard, /equipment-availability-dot/);
  assert.match(sortMenu, /Available equipment first/);
  assert.match(sortMenu, /Lowest price first/);
  assert.match(sortMenu, /Nearest equipment first/);
  assert.match(sortMenu, /transition-\[opacity,transform\]/);
  assert.match(sortMenu, /aria-expanded=\{open\}/);
  assert.match(firebaseData, /status:\s*listing\.status/);
  assert.match(firebaseData, /availableFrom:\s*listing\.availableFrom/);
  assert.doesNotMatch(firebaseData, /listing\.status === "active" &&/);
  assert.doesNotMatch(rentView, /<select/);
  assert.doesNotMatch(renterBrowser, /<select/);
});

test("equipment detail workspace mobile layout prioritizes booking and removes features block", async () => {
  const [detail, actions, serverData] = await Promise.all([
    readSource("../app/equipment/[id]/EquipmentDetailClient.tsx"),
    readSource("../lib/actions/local-data.ts"),
    readSource("../lib/server/firebase-data.ts"),
  ]);

  assert.match(detail, /workspaceContentClassName/);
  assert.match(detail, /workspaceBookingClassName/);
  assert.match(detail, /order-1 mb-2/);
  assert.match(detail, /kk-owner-detail-card/);
  assert.match(detail, /disabled=\{isPending \|\| \(!availability\.available && !isOwnListing\)\}/);
  assert.doesNotMatch(detail, /Features & Inclusions|वैशिष्ट्ये आणि समावेश/);
  assert.doesNotMatch(detail, /Work Type|कामाचा प्रकार/);
  assert.doesNotMatch(detail, /Operator included|Operator optional|ऑपरेटर समाविष्ट|ऑपरेटर ऐच्छिक/);
  assert.doesNotMatch(detail, />\s*\{equipment\.district\}\s*<\/span>/);
  assert.match(detail, /kk-owner-location-row/);
  assert.match(detail, /equipment\.ownerLocation/);
  assert.match(actions, /isListingBookable/);
  assert.match(serverData, /isListingBookable/);
  assert.match(serverData, /This equipment is not available for booking right now\./);
});

test("same user cannot book their own owner listing in workspace and backend booking flows", async () => {
  const [detail, publicPage, renterPage, ownerPage, equipmentSource, firebaseData, formRoute, actions] = await Promise.all([
    readSource("../app/equipment/[id]/EquipmentDetailClient.tsx"),
    readSource("../app/equipment/[id]/page.tsx"),
    readSource("../app/renter-profile/equipment/[id]/page.tsx"),
    readSource("../app/owner-profile/equipment/[id]/page.tsx"),
    readSource("../lib/equipment.ts"),
    readSource("../lib/server/firebase-data.ts"),
    readSource("../app/api/forms/booking-request/route.ts"),
    readSource("../lib/actions/local-data.ts"),
  ]);

  assert.match(equipmentSource, /ownerUserId: string/);
  assert.match(firebaseData, /ownerUserId: listing\.ownerUserId/);
  assert.match(publicPage, /if \(session\) \{\s*redirect\(`\/\$\{session\.activeWorkspace\}-profile\/equipment\/\$\{equipment\.id\}`\);/);
  assert.match(renterPage, /currentUserId=\{session\.user\.id\}/);
  assert.match(ownerPage, /currentUserId=\{session\.user\.id\}/);
  assert.match(detail, /currentUserId/);
  assert.match(detail, /isOwnListing/);
  assert.match(detail, /setOwnListingToast\(true\)/);
  assert.match(detail, /!availability\.available && !isOwnListing/);
  assert.match(detail, /You cannot book your own listings/);
  assert.match(actions, /listing\.ownerUserId === session\.user\.id/);
  assert.match(formRoute, /listing\.ownerUserId === session\.user\.id/);
  assert.match(firebaseData, /listing\.ownerUserId === input\.renterUserId/);
});
