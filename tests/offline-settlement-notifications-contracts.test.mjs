import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readSource(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("owner earnings presents booking value and direct offline settlement, not payment processing", async () => {
  const earnings = await readSource("../app/owner-profile/earnings/page.tsx");

  assert.match(earnings, /Booking Value History/);
  assert.match(earnings, /Estimated Rental Value/);
  assert.match(earnings, /bookingStatusLabel/);
  assert.match(earnings, /bookingStatusTone/);
  assert.match(earnings, /booking\.status/);
  assert.match(earnings, /booking requests/);

  assert.doesNotMatch(earnings, /Rental Income History/);
  assert.doesNotMatch(earnings, /Kisan Kamai does not collect or process payments/);
  assert.doesNotMatch(earnings, /<LocalizedText en="Direct Settlement"/);
  assert.doesNotMatch(earnings, /Settlement Mode/);
  assert.doesNotMatch(earnings, /Phone Confirmation|Manual Confirmation/);
  assert.doesNotMatch(earnings, /paymentTone/);
  assert.doesNotMatch(earnings, /payment\.status/);
  assert.doesNotMatch(earnings, />\s*\{payment\.method\}\s*</);
});

test("equipment booking and public guidance avoid platform fees or secure payment promises", async () => {
  const sources = await Promise.all(
    [
      "../app/equipment/[id]/EquipmentDetailClient.tsx",
      "../app/page.tsx",
      "../app/owner-experience/page.tsx",
      "../app/feature-request/page.tsx",
      "../components/workspace/OwnerWorkspaceOverview.tsx",
      "../components/workspace/RenterWorkspaceOverview.tsx",
    ].map(readSource)
  );

  const combined = sources.join("\n");

  assert.match(combined, /Kisan Kamai does not collect money/);
  assert.match(combined, /Direct Settlement/);
  assert.match(combined, /Pricing & Settlement/);

  assert.doesNotMatch(combined, /SERVICE_FEE|Service Fee|सेवा शुल्क/);
  assert.doesNotMatch(combined, /Payment handled locally|Secure Payments|View Payments|payment records/);
  assert.doesNotMatch(combined, /Available payment methods depend on the owner/);
  assert.doesNotMatch(combined, /Payments and Pricing|पेमेंट्स आणि किंमत/);
});

test("new booking mirrors use direct settlement estimate semantics, not payment processor states", async () => {
  const firebaseData = await readSource("../lib/server/firebase-data.ts");
  const sheetsMirror = await readSource("../lib/server/sheets-mirror.ts");
  const types = await readSource("../lib/local-data/types.ts");
  const combined = `${firebaseData}\n${sheetsMirror}\n${types}`;

  assert.match(combined, /method: "Direct Settlement"/);
  assert.match(combined, /booking\+settlement-estimate/);
  assert.match(combined, /booking-value-estimate/);
  assert.match(combined, /export type PaymentStatus = BookingStatus/);

  assert.doesNotMatch(combined, /Phone Confirmation|Manual Confirmation/);
  assert.doesNotMatch(combined, /status: "processing"/);
  assert.doesNotMatch(combined, /return "refunded"/);
  assert.doesNotMatch(combined, /booking\+payment|booking-payment/);
});

test("visible support and legacy workspace copy use pricing or direct-settlement language instead of payout/refund flows", async () => {
  const sources = await Promise.all(
    [
      "../app/support/page.tsx",
      "../components/profile/ProfileSupportWorkspace.tsx",
      "../components/workspace/OwnerRevenuePanel.tsx",
      "../components/renter-profile/RenterProfileViews.tsx",
      "../components/owner-profile/OwnerProfileViews.tsx",
      "../lib/i18n.manual.ts",
      "../lib/i18n.auto.ts",
    ].map(readSource)
  );

  const combined = sources.join("\n");

  assert.match(combined, /Pricing & Settlement/);
  assert.match(combined, /Direct Settlement/);
  assert.match(combined, /Offline settlement/);

  assert.doesNotMatch(combined, /Payment Issue|Payout Issue|Earnings Help|Payment Help/);
  assert.doesNotMatch(combined, /Billing issues|refunds|Payments and refunds/);
  assert.doesNotMatch(combined, /Paid out|Pending payouts|Payout history|No payout records yet/);
  assert.doesNotMatch(combined, /Resolved payout question|Resolved payment clarification/);
  assert.doesNotMatch(combined, /Get Paid Fast|Payout Speed|guaranteed payouts|transferred directly to your bank account/);
});

test("profile dropdown exposes unread notification count, refreshes inbox, and reverts failed optimistic reads", async () => {
  const dropdown = await readSource("../components/ProfileDropdownMenu.tsx");
  const apiRoute = await readSource("../app/api/notifications/route.ts");
  const inbox = await readSource("../lib/server/notification-inbox.ts");

  assert.match(dropdown, /unreadCount/);
  assert.match(dropdown, /notificationTotalCount/);
  assert.match(dropdown, /kk-profile-notification-badge/);
  assert.match(dropdown, /PROFILE_NOTIFICATIONS_REFRESH_MS/);
  assert.match(dropdown, /window\.setInterval/);
  assert.match(dropdown, /visibilitychange/);
  assert.match(dropdown, /revertNotificationRead/);
  assert.match(dropdown, /markNotificationRead/);
  assert.match(dropdown, /setNotificationsError\(true\)/);
  assert.match(dropdown, /aria-label=\{langText\("Unread notifications"/);
  assert.match(apiRoute, /getUnreadNotificationInbox/);
  assert.match(apiRoute, /unreadCount: inbox\.unreadCount/);
  assert.match(inbox, /notifications\.slice\(0, Math\.max\(1, limit\)\)/);
  assert.match(inbox, /unreadCount: notifications\.length/);
});

test("booking cancellation and decline updates create clear inbox notifications for the opposite party", async () => {
  const firebaseData = await readSource("../lib/server/firebase-data.ts");
  const messaging = await readSource("../lib/server/firebase-messaging.ts");
  const inbox = await readSource("../lib/server/notification-inbox.ts");

  assert.match(firebaseData, /previousStatus: booking\.status/);
  assert.match(firebaseData, /Booking declined/);
  assert.match(firebaseData, /Booking cancelled/);
  assert.match(firebaseData, /userIds: \[input\.booking\.renterUserId\]/);
  assert.match(firebaseData, /userIds: \[input\.booking\.ownerUserId\]/);
  assert.match(firebaseData, /status: input\.booking\.status/);
  assert.match(firebaseData, /workspace: "renter"/);
  assert.match(firebaseData, /workspace: "owner"/);
  assert.match(messaging, /createUserNotifications/);
  assert.match(inbox, /status === "cancelled"/);
  assert.match(inbox, /return "danger"/);
});

test("booking status transitions are constrained by actor and current status", async () => {
  const [firebaseData, actions] = await Promise.all([
    readSource("../lib/server/firebase-data.ts"),
    readSource("../lib/actions/local-data.ts"),
  ]);

  assert.match(firebaseData, /ALLOWED_BOOKING_STATUS_TRANSITIONS/);
  assert.match(firebaseData, /assertAllowedBookingStatusTransition/);
  assert.match(firebaseData, /cancelled:\s*\[\]/);
  assert.match(firebaseData, /completed:\s*\[\]/);
  assert.match(firebaseData, /const actorRole = ownerCanUpdate \? "owner" : "renter"/);
  assert.match(firebaseData, /assertAllowedBookingStatusTransition\(\{\s*actorRole,\s*currentStatus: booking\.status,\s*nextStatus: status,\s*\}\)/);
  assert.match(firebaseData, /if \(booking\.status === status\) \{\s*return booking;\s*\}/);
  assert.doesNotMatch(actions, /status: "pending" \| "upcoming" \| "active" \| "confirmed" \| "completed" \| "cancelled"/);
  assert.match(actions, /status: BookingRecord\["status"\]/);
});
