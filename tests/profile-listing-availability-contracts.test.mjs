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

test("owner booking details action uses the same button alignment contract as sibling actions", async () => {
  const source = await readSource("../components/profile/OwnerBookingsBoard.tsx");

  assert.match(source, /grid grid-cols-1 items-stretch/);
  assert.match(source, /inline-flex min-h-11 items-center justify-center/);
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
  const [equipmentSource, rentView, renterBrowser, ownerBrowser, savedBoard, firebaseData] = await Promise.all([
    readSource("../lib/equipment.ts"),
    readSource("../app/rent-equipment/RentEquipmentView.tsx"),
    readSource("../components/renter-profile/RenterEquipmentBrowser.tsx"),
    readSource("../components/owner-profile/OwnerEquipmentBrowser.tsx"),
    readSource("../components/profile/SavedListingsBoard.tsx"),
    readSource("../lib/server/firebase-data.ts"),
  ]);

  assert.match(equipmentSource, /getEquipmentAvailability/);
  assert.match(equipmentSource, /sortEquipmentByAvailabilityPriceDistance/);
  assert.match(rentView, /Availability/);
  assert.match(rentView, /Price lowest to highest/);
  assert.match(rentView, /Distance/);
  assert.match(rentView, /SortControl/);
  assert.match(rentView, /equipment-availability-dot/);
  assert.match(renterBrowser, /sortEquipmentByAvailabilityPriceDistance/);
  assert.match(renterBrowser, /equipment-availability-dot/);
  assert.match(ownerBrowser, /equipment-availability-dot/);
  assert.match(savedBoard, /equipment-availability-dot/);
  assert.match(firebaseData, /status:\s*listing\.status/);
  assert.match(firebaseData, /availableFrom:\s*listing\.availableFrom/);
  assert.doesNotMatch(firebaseData, /listing\.status === "active" &&/);
});

test("equipment detail workspace mobile layout prioritizes booking and removes features block", async () => {
  const [detail, actions, serverData] = await Promise.all([
    readSource("../app/equipment/[id]/EquipmentDetailClient.tsx"),
    readSource("../lib/actions/local-data.ts"),
    readSource("../lib/server/firebase-data.ts"),
  ]);

  assert.match(detail, /workspaceContentClassName/);
  assert.match(detail, /workspaceBookingClassName/);
  assert.match(detail, /kk-owner-detail-card/);
  assert.match(detail, /disabled=\{isPending \|\| !availability\.available\}/);
  assert.doesNotMatch(detail, /Features & Inclusions|वैशिष्ट्ये आणि समावेश/);
  assert.match(actions, /isListingBookable/);
  assert.match(serverData, /isListingBookable/);
  assert.match(serverData, /This equipment is not available for booking right now\./);
});
