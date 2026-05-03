import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readSource(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("renter dashboard removes requested subtitles and KPI tiles", async () => {
  const [page, board] = await Promise.all([
    readSource("../app/renter-profile/page.tsx"),
    readSource("../components/renter-profile/RenterBookingsBoard.tsx"),
  ]);

  assert.doesNotMatch(page, /Review your active schedules, booking value, and tracking updates in one renter view\./);
  assert.doesNotMatch(board, /Track, cancel, call, and inspect your renter bookings from one place\./);
  assert.doesNotMatch(board, /Active Bookings/);
  assert.doesNotMatch(board, /Total Booking Value/);
  assert.doesNotMatch(board, /activeBookings|pendingBookings|totalSpend/);
});

test("owner bookings, saved equipment, settings, and owner browse remove requested workspace blocks", async () => {
  const [ownerBookings, savedPage, savedBoard, settingsForm, ownerBrowser, workspaceShell] = await Promise.all([
    readSource("../components/profile/OwnerBookingsBoard.tsx"),
    readSource("../app/renter-profile/saved/page.tsx"),
    readSource("../components/profile/SavedListingsBoard.tsx"),
    readSource("../components/profile/ProfileSettingsForm.tsx"),
    readSource("../components/owner-profile/OwnerEquipmentBrowser.tsx"),
    readSource("../components/owner-profile/OwnerProfileWorkspaceShell.tsx"),
  ]);

  assert.doesNotMatch(ownerBookings, /Pending Requests|Active Jobs|Booking Value/);
  assert.doesNotMatch(ownerBookings, /summary = useMemo/);
  assert.doesNotMatch(savedPage, /Review the machines you shortlisted for future bookings/);
  assert.doesNotMatch(savedBoard, /Review the machines you shortlisted and open their real equipment detail pages/);
  assert.doesNotMatch(settingsForm, /Workspace[\s\S]*shared profile and verification metadata/);
  assert.doesNotMatch(ownerBrowser, /Equipment Search|Sort Equipment|Add Listing/);
  assert.doesNotMatch(ownerBrowser, /setQuery|setSortBy|SortKey/);
  assert.match(workspaceShell, /flex min-h-screen flex-col/);
  assert.match(workspaceShell, /<main className=\{`flex min-h-screen flex-col/);
  assert.match(workspaceShell, /<div className="mx-auto max-w-6xl px-6 pt-8 flex-1/);
});

test("profile dropdown account links are removed while profile and sign out remain", async () => {
  const dropdown = await readSource("../components/ProfileDropdownMenu.tsx");

  assert.match(dropdown, /header\.dropdown\.owner_profile/);
  assert.match(dropdown, /header\.dropdown\.renter_profile/);
  assert.match(dropdown, /header\.menu\.sign_out/);
  assert.match(dropdown, /NOTIFICATIONS/);
  assert.match(dropdown, /Clear All/);
  assert.match(dropdown, /All caught up!/);
  assert.match(dropdown, /animate-pulse/);
  assert.match(dropdown, /Booking Confirmed/);
  assert.match(dropdown, /New Request/);
  assert.doesNotMatch(dropdown, /resolvedSettingsHref|resolvedSupportHref/);
  assert.doesNotMatch(dropdown, /header\.menu\.settings|header\.menu\.help_support/);
  assert.doesNotMatch(dropdown, /settings<\/span>|help_outline/);
});

test("owner benefits select controls use one custom arrow", async () => {
  const ownerBenefits = await readSource("../app/owner-benefits/page.tsx");

  assert.match(ownerBenefits, /kk-owner-benefits-select/);
  assert.match(ownerBenefits, /kk-owner-benefits-select-arrow/);
  assert.match(ownerBenefits, /const ownerBenefitsSelectStyle/);
  assert.match(ownerBenefits, /appearance:\s*"none"/);
  assert.match(ownerBenefits, /WebkitAppearance:\s*"none"/);
  assert.match(ownerBenefits, /MozAppearance:\s*"none"/);
  assert.match(ownerBenefits, /backgroundImage:\s*"none"/);
  assert.equal((ownerBenefits.match(/style=\{ownerBenefitsSelectStyle\}/g) || []).length, 2);
  assert.equal((ownerBenefits.match(/kk-owner-benefits-select-arrow/g) || []).length, 2);
});

test("owner and renter rating surfaces are removed, equipment rating remains scoped to equipment cards", async () => {
  const [
    detail,
    rentView,
    ownerBrowser,
    renterBrowser,
    savedBoard,
    ownerBookings,
    renterBookings,
    legacyViews,
    earnings,
  ] = await Promise.all([
    readSource("../app/equipment/[id]/EquipmentDetailClient.tsx"),
    readSource("../app/rent-equipment/RentEquipmentView.tsx"),
    readSource("../components/owner-profile/OwnerEquipmentBrowser.tsx"),
    readSource("../components/renter-profile/RenterEquipmentBrowser.tsx"),
    readSource("../components/profile/SavedListingsBoard.tsx"),
    readSource("../components/profile/OwnerBookingsBoard.tsx"),
    readSource("../components/renter-profile/RenterBookingsBoard.tsx"),
    readSource("../components/owner-profile/OwnerProfileViews.tsx"),
    readSource("../app/owner-profile/earnings/page.tsx"),
  ]);

  assert.match(rentView, /equipment-rating-pill/);
  assert.match(rentView, /item\.rating > 0/);
  assert.match(ownerBrowser, /equipment-rating-pill/);
  assert.match(renterBrowser, /equipment-rating-pill/);
  assert.match(savedBoard, /equipment-rating-pill/);
  assert.match(earnings, /listing\.rating\.toFixed\(1\)/);

  assert.doesNotMatch(detail, /Highly Trusted|Pending verification|workspace_premium|Listing location/);
  assert.doesNotMatch(detail, /Owner profile rating|owner rating/i);
  assert.doesNotMatch(ownerBookings, /Verified Renter|rating\.toFixed|>\s*star\s*</);
  assert.doesNotMatch(renterBookings, /Verified Owner|rating\.toFixed|>\s*star\s*</);
  assert.doesNotMatch(legacyViews, /rating:\s*"4\.[0-9]"|workspace_premium|Highly Trusted/);
});

test("rent equipment query cards are compact and retain equipment ratings", async () => {
  const source = await readSource("../app/rent-equipment/RentEquipmentView.tsx");

  assert.match(source, /function EquipmentCard/);
  assert.match(source, /compact \? "h-36 sm:h-40 md:h-44"/);
  assert.match(source, /compact \? "p-4 md:p-5"/);
  assert.match(source, /compact \? "text-lg md:text-xl"/);
  assert.match(source, /equipment-rating-pill/);
  assert.doesNotMatch(source, /h-64 md:h-auto/);
  assert.doesNotMatch(source, /text-xl md:text-2xl/);
});

test("equipment detail removes owner trust metadata and reduces workspace detail spacing", async () => {
  const [detail, layout, ownerPage, renterPage] = await Promise.all([
    readSource("../app/equipment/[id]/EquipmentDetailClient.tsx"),
    readSource("../lib/equipment-detail-layout.js"),
    readSource("../app/owner-profile/equipment/[id]/page.tsx"),
    readSource("../app/renter-profile/equipment/[id]/page.tsx"),
  ]);

  assert.doesNotMatch(detail, /ownerBadge|Pending verification|Listing location|workspace_premium/);
  assert.match(detail, /equipment\.rating > 0/);
  assert.match(layout, /workspaceContainer/);
  assert.match(ownerPage, /containerVariant="workspace"/);
  assert.match(renterPage, /containerVariant="workspace"/);
});

test("profile support feedback and settings components port the supplied local HTML visual systems", async () => {
  const [support, feedback, settings] = await Promise.all([
    readSource("../components/profile/ProfileSupportWorkspace.tsx"),
    readSource("../components/profile/ProfileFeedbackForm.tsx"),
    readSource("../components/profile/ProfileSettingsForm.tsx"),
  ]);

  assert.match(support, /Submit a Request/);
  assert.match(support, /Call Support/);
  assert.match(support, /WhatsApp Help/);
  assert.match(support, /bg-surface-container-lowest rounded-2xl shadow-xl p-6 md:p-10/);
  assert.match(support, /Issue Category/);
  assert.match(support, /Issue Details/);

  assert.match(feedback, /Overall Satisfaction/);
  assert.match(feedback, /I am a/);
  assert.match(feedback, /Feedback Category/);
  assert.match(feedback, /bg-surface-container-low p-5 rounded-xl/);
  assert.match(feedback, /material-symbols-outlined text-3xl/);
  assert.match(feedback, /"fill"/);

  assert.match(settings, /Profile Settings/);
  assert.match(settings, /Profile Photo/);
  assert.match(settings, /Personal Information/);
  assert.match(settings, /Farm Details/);
  assert.match(settings, /Account Settings/);
  assert.match(settings, /shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\]/);
});
