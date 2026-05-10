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
  assert.match(workspaceShell, /kk-workspace-main flex min-h-svh flex-col/);
  assert.match(workspaceShell, /<main className="kk-workspace-main flex min-h-svh flex-col/);
  assert.match(workspaceShell, /<div className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 pt-4 sm:px-6 sm:pt-8/);
});

test("owner workspace removes requested dashboard copy, tracking actions, and old owner subtitles", async () => {
  const [
    ownerDashboard,
    ownerBrowsePage,
    ownerBrowser,
    ownerBookingsPage,
    ownerBookings,
    ownerEarnings,
    ownerFeedbackPage,
    ownerSupportPage,
    legacyOwnerViews,
  ] = await Promise.all([
    readSource("../app/owner-profile/page.tsx"),
    readSource("../app/owner-profile/browse/page.tsx"),
    readSource("../components/owner-profile/OwnerEquipmentBrowser.tsx"),
    readSource("../app/owner-profile/bookings/page.tsx"),
    readSource("../components/profile/OwnerBookingsBoard.tsx"),
    readSource("../app/owner-profile/earnings/page.tsx"),
    readSource("../app/owner-profile/feedback/page.tsx"),
    readSource("../app/owner-profile/support/page.tsx"),
    readSource("../components/owner-profile/OwnerProfileViews.tsx"),
  ]);

  for (const source of [
    ownerDashboard,
    ownerBrowsePage,
    ownerBrowser,
    ownerBookingsPage,
    ownerBookings,
    ownerEarnings,
    ownerFeedbackPage,
    ownerSupportPage,
    legacyOwnerViews,
  ]) {
    assert.doesNotMatch(source, /Active Listings|Open Bookings|Paid Earnings|Fleet Snapshot/);
    assert.doesNotMatch(source, /Call renters directly and inspect the linked equipment from the owner workspace\./);
    assert.doesNotMatch(source, /Review your most recent listings and jump into edit mode\./);
    assert.doesNotMatch(source, /Sort your fleet by HP or distance and jump straight into edit or equipment details\./);
    assert.doesNotMatch(source, /Review your live listings, sort by HP or distance, and open edit or detail flows safely\./);
    assert.doesNotMatch(source, /Manage incoming rental requests and recently completed jobs\./);
    assert.doesNotMatch(source, /Review incoming bookings, approve or decline them, and keep call and tracking actions on the same page\./);
    assert.doesNotMatch(source, /Manage Equipment/);
    assert.doesNotMatch(source, /Track listed rates, booking estimates, and completed rental income\./);
    assert.doesNotMatch(source, /Review pricing, rating, and booking counts for your live owner listings\./);
    assert.doesNotMatch(source, /Completed, processing, and refunded owner payments tied to recent bookings\./);
    assert.doesNotMatch(source, /Share ideas that would improve the owner profile and fleet workflow\./);
    assert.doesNotMatch(source, /Get owner help for listing, booking, and verification issues\./);
  }

  assert.doesNotMatch(ownerDashboard, /getOwnerPayments|activeListings|openBookings|totalEarnings/);
  assert.doesNotMatch(ownerBookings, /TrackingOrderModal|selectedBookingId|setSelectedBookingId|langText\("Track"|>\s*Track\s*</);
  assert.doesNotMatch(legacyOwnerViews, /Track Order|actionThree:\s*"Track"|Track all your confirmed/);
});

test("owner booking cards expose separate approve and decline controls for pending requests", async () => {
  const [ownerBookings, ownerActivity] = await Promise.all([
    readSource("../components/profile/OwnerBookingsBoard.tsx"),
    readSource("../components/profile/OwnerRecentBookingActivity.tsx"),
  ]);

  for (const source of [ownerBookings, ownerActivity]) {
    assert.match(source, /owner-[a-z-]+approve-button/);
    assert.match(source, /owner-[a-z-]+decline-button/);
    assert.match(source, /booking\.status === "pending"/);
    assert.match(source, /runStatusUpdate\(booking\.id, "confirmed"\)/);
    assert.match(source, /runStatusUpdate\(booking\.id, "cancelled"\)/);
  }

  assert.doesNotMatch(ownerBookings, /onClick=\{\(\) => runStatusUpdate\(booking\.id, canApprove \? "confirmed" : "cancelled"\)\}/);
});

test("owner workspace forms use compact aesthetically balanced layouts", async () => {
  const [settings, feedback, support, earnings] = await Promise.all([
    readSource("../components/profile/ProfileSettingsForm.tsx"),
    readSource("../components/profile/ProfileFeedbackForm.tsx"),
    readSource("../components/profile/ProfileSupportWorkspace.tsx"),
    readSource("../app/owner-profile/earnings/page.tsx"),
  ]);

  assert.match(settings, /xl:grid-cols-\[20rem_minmax\(0,1fr\)\]/);
  assert.match(settings, /xl:sticky xl:top-24/);
  assert.match(settings, /space-y-8/);
  assert.doesNotMatch(settings, /mx-auto max-w-4xl px-0 pb-24 pt-2/);

  assert.match(feedback, /mx-auto w-full max-w-4xl/);
  assert.match(feedback, /rounded-\[2rem\]/);
  assert.match(feedback, /lg:p-10/);
  assert.doesNotMatch(feedback, /min-h-\[calc\(100vh-8rem\)\]/);

  assert.match(support, /items-start/);
  assert.match(support, /max-w-5xl/);
  assert.match(support, /lg:sticky lg:top-24/);
  assert.doesNotMatch(support, /min-h-\[calc\(100vh-8rem\)\]/);

  assert.match(earnings, /min-w-0/);
  assert.match(earnings, /break-words/);
  assert.match(earnings, /sm:flex-row/);
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
  assert.match(dropdown, /\/api\/notifications/);
  assert.match(dropdown, /markNotificationRead/);
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
  assert.match(rentView, /getVisibleEquipmentRating/);
  assert.match(ownerBrowser, /equipment-rating-pill/);
  assert.match(renterBrowser, /equipment-rating-pill/);
  assert.match(savedBoard, /equipment-rating-pill/);
  assert.match(earnings, /getVisibleEquipmentRating/);

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
  assert.match(source, /getVisibleEquipmentRating/);
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
  assert.match(detail, /getVisibleEquipmentRating/);
  assert.match(layout, /workspaceContainer/);
  assert.match(ownerPage, /containerVariant="workspace"/);
  assert.match(renterPage, /containerVariant="workspace"/);
});

test("equipment rating stars require real review counts and fixture ratings are not faked", async () => {
  const [
    equipmentSource,
    rentView,
    rentResults,
    detail,
    ownerBrowser,
    renterBrowser,
    savedBoard,
    earnings,
    listingAction,
    seedFixtures,
  ] = await Promise.all([
    readSource("../lib/equipment.ts"),
    readSource("../app/rent-equipment/RentEquipmentView.tsx"),
    readSource("../app/rent-equipment/RentEquipmentResults.tsx"),
    readSource("../app/equipment/[id]/EquipmentDetailClient.tsx"),
    readSource("../components/owner-profile/OwnerEquipmentBrowser.tsx"),
    readSource("../components/renter-profile/RenterEquipmentBrowser.tsx"),
    readSource("../components/profile/SavedListingsBoard.tsx"),
    readSource("../app/owner-profile/earnings/page.tsx"),
    readSource("../lib/actions/local-data.ts"),
    readSource("../data/listings.json"),
  ]);

  assert.match(equipmentSource, /function getEquipmentRatingCount/);
  assert.match(equipmentSource, /function getVisibleEquipmentRating/);

  for (const source of [rentView, rentResults, detail, ownerBrowser, renterBrowser, savedBoard, earnings]) {
    assert.match(source, /getVisibleEquipmentRating/);
    assert.doesNotMatch(source, /\.rating\s*>\s*0/);
  }

  assert.doesNotMatch(listingAction, /rating:\s*Number\(formData\.get\("rating"\)\s*\|\|\s*4\.8\)/);

  const listings = JSON.parse(seedFixtures);
  for (const listing of listings) {
    const rating = Number(listing.rating || 0);
    const ratingCount = Number(listing.ratingCount || listing.reviewCount || listing.ratingsCount || 0);
    assert.ok(
      rating === 0 || ratingCount > 0,
      `${listing.id} must not carry a visible fixture rating without a real rating count`
    );
  }
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
