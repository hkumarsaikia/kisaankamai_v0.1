import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("root app now owns the Firebase CLI deploy layer for gokisaan", async () => {
  const [firebasercSource, firebaseJsonSource] = await Promise.all([
    readFile(new URL("../.firebaserc", import.meta.url), "utf8"),
    readFile(new URL("../firebase.json", import.meta.url), "utf8"),
  ]);

  assert.match(firebasercSource, /"default"\s*:\s*"gokisaan"/);
  assert.match(firebaseJsonSource, /"firestore"/);
  assert.match(firebaseJsonSource, /firebase\/firestore\.rules/);
  assert.match(firebaseJsonSource, /firebase\/firestore\.indexes\.json/);
  assert.match(firebaseJsonSource, /firebase\/storage\.rules/);
});

test("root Firestore and Storage rules use the canonical root-app schema instead of ownerUid drift", async () => {
  const [firestoreRulesSource, storageRulesSource] = await Promise.all([
    readFile(new URL("../firebase/firestore.rules", import.meta.url), "utf8"),
    readFile(new URL("../firebase/storage.rules", import.meta.url), "utf8"),
  ]);

  assert.match(firestoreRulesSource, /ownerUserId/);
  assert.match(firestoreRulesSource, /renterUserId/);
  assert.match(firestoreRulesSource, /userId/);
  assert.match(firestoreRulesSource, /saved-items/);
  assert.match(firestoreRulesSource, /form-submissions/);
  assert.match(firestoreRulesSource, /bug-reports/);
  assert.match(firestoreRulesSource, /verificationDocuments/);
  assert.match(firestoreRulesSource, /verificationDocumentType/);
  assert.match(firestoreRulesSource, /verificationDocumentNumber/);
  assert.doesNotMatch(firestoreRulesSource, /ownerUid|renterUid|userUid/);
  assert.match(storageRulesSource, /listings\/\{ownerUserId\}\/\{listingId\}/);
  assert.match(storageRulesSource, /profile-verification\/\{userId\}/);
  assert.match(storageRulesSource, /isAllowedVerificationDocument/);
});

test("server booking workflow emits Firebase push notifications through the shared helper", async () => {
  const [firebaseDataSource, firebaseMessagingSource] = await Promise.all([
    readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-messaging.ts", import.meta.url), "utf8"),
  ]);

  assert.match(firebaseDataSource, /notifyBookingCreated/);
  assert.match(firebaseDataSource, /notifyBookingStatusChanged/);
  assert.match(firebaseDataSource, /sendPushNotificationToUsers/);
  assert.match(firebaseMessagingSource, /sendEachForMulticast/);
  assert.match(firebaseMessagingSource, /fcmTokens/);
});

test("session-backed auth routes now share the Firebase session bridge instead of the legacy local register route", async () => {
  const [registerRouteSource, sessionRouteSource, helperSource] = await Promise.all([
    readFile(new URL("../app/api/auth/register/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/session/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-session-route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(registerRouteSource, /createFirebaseBackedSession/);
  assert.match(sessionRouteSource, /createFirebaseBackedSession/);
  assert.match(helperSource, /firebaseSessionRequestSchema/);
  assert.doesNotMatch(registerRouteSource, /registerAndCreateSession/);
});

test("package scripts expose the Firebase, Sheets, seed, repo-sync, and Discord operational flows", async () => {
  const packageSource = await readFile(new URL("../package.json", import.meta.url), "utf8");

  assert.match(packageSource, /"firebase:deploy"/);
  assert.match(packageSource, /"firebase:phone-test-numbers"/);
  assert.match(packageSource, /"sheets:bootstrap"/);
  assert.match(packageSource, /"sheets:verify"/);
  assert.match(packageSource, /"sheets:backfill"/);
  assert.match(packageSource, /"seed:final-test-accounts"/);
  assert.match(packageSource, /"cleanup:final-test-accounts"/);
  assert.match(packageSource, /"live:e2e:final-accounts"/);
  assert.match(packageSource, /"repo:sync-live"/);
  assert.match(packageSource, /"discord:notify"/);
  assert.doesNotMatch(packageSource, /"cross-agent:/);
});

test("live phone OTP E2E test mode is token-gated without a broad production bypass", async () => {
  const [routeSource, preflightSource, helperSource, e2eSource] = await Promise.all([
    readFile(new URL("../app/api/auth/phone-test-mode/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/register/preflight/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/phone-auth-test-mode.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/live-final-account-e2e.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(routeSource, /isPhoneAuthTestModeAllowed/);
  assert.match(preflightSource, /isPhoneAuthTestModeAllowed/);
  assert.match(preflightSource, /testMode: true/);
  assert.match(helperSource, /x-kk-phone-auth-test-token/);
  assert.match(helperSource, /timingSafeEqual/);
  assert.match(helperSource, /FIREBASE_PRIVATE_KEY/);
  assert.match(helperSource, /createHmac/);
  assert.match(helperSource, /configuredPhoneAuthTestNumbers/);
  assert.match(e2eSource, /KK_PHONE_AUTH_TEST_MODE_TOKEN/);
  assert.match(e2eSource, /FIREBASE_PRIVATE_KEY/);
  assert.match(e2eSource, /kk_phone_auth_test_token/);
});

test("final test account cleanup removes reserved auth identifiers before registration probes", async () => {
  const cleanupSource = await readFile(new URL("../scripts/lib/final-test-accounts.mjs", import.meta.url), "utf8");

  assert.match(cleanupSource, /AUTH_IDENTIFIERS_COLLECTION/);
  assert.match(cleanupSource, /phone:\$\{seedData\.owner\.phone\}/);
  assert.match(cleanupSource, /phone:\$\{seedData\.renter\.phone\}/);
  assert.match(cleanupSource, /email:\$\{seedData\.owner\.email\}/);
  assert.match(cleanupSource, /email:\$\{seedData\.renter\.email\}/);
  assert.match(cleanupSource, /getUserByPhoneNumber/);
  assert.match(cleanupSource, /getUserByEmail/);
});
