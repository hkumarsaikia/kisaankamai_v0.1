import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("rent equipment routes receive merged baseline and live category summaries instead of static chips", async () => {
  const [pageSource, viewSource, categorySource] = await Promise.all([
    readFile(new URL("../app/rent-equipment/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/rent-equipment/RentEquipmentView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/equipment-categories.ts", import.meta.url), "utf8"),
  ]);

  assert.match(pageSource, /getMergedCategorySummariesFromEquipment/);
  assert.match(pageSource, /categorySummaries=/);
  assert.match(viewSource, /categorySummaries/);
  assert.doesNotMatch(viewSource, /const categoryChips = \[/);
  assert.match(categorySource, /getCategorySummariesFromEquipment/);
  assert.match(categorySource, /getMergedCategorySummariesFromEquipment/);
  assert.match(categorySource, /normalizeCategorySlug/);
});

test("login uses one identifier and password form with no phone OTP login branch", async () => {
  const [loginSource, localAuthSource, firebaseDataSource] = await Promise.all([
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/local-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(loginSource, /Mobile number or Email ID/);
  assert.match(loginSource, /password/);
  assert.match(loginSource, /loginAction/);
  assert.doesNotMatch(loginSource, /startPhoneVerification|verifyPhoneOtp|OtpVerificationForm|Phone OTP|confirmationId|otpDigits/);
  assert.match(localAuthSource, /loginAndCreateSession/);
  assert.match(firebaseDataSource, /passwordLoginEmail/);
  assert.match(firebaseDataSource, /resolvePasswordLoginEmail/);
});

test("manual registration keeps Firebase phone verification and requires password-backed login", async () => {
  const [registerSource, sessionRouteSource, typeSource] = await Promise.all([
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-session-route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/local-data/types.ts", import.meta.url), "utf8"),
  ]);

  assert.match(registerSource, /startPhoneVerification/);
  assert.match(registerSource, /verifyPhoneOtp/);
  assert.match(registerSource, /password/);
  assert.match(registerSource, /finishFirebaseAuthSession/);
  assert.doesNotMatch(registerSource, /workspacePreference/);
  assert.doesNotMatch(registerSource, /Primary workspace|मुख्य कार्यक्षेत्र/);
  assert.doesNotMatch(registerSource, /clearServerAuthSession/);
  assert.match(sessionRouteSource, /password/);
  assert.match(sessionRouteSource, /createOrUpdatePasswordLoginCredential/);
  assert.match(typeSource, /passwordLoginEmail/);
});

test("Google auth allows Firebase OAuth origins and redirects on popup internal errors", async () => {
  const [googleSource, nextConfigSource] = await Promise.all([
    readFile(new URL("../components/auth/GoogleAuthButton.tsx", import.meta.url), "utf8"),
    readFile(new URL("../next.config.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(googleSource, /signInWithPopup/);
  assert.match(googleSource, /signInWithRedirect/);
  assert.match(googleSource, /getRedirectResult/);
  assert.match(googleSource, /auth\/internal-error/);
  assert.match(nextConfigSource, /https:\/\/apis\.google\.com/);
  assert.match(nextConfigSource, /https:\/\/accounts\.google\.com/);
  assert.match(nextConfigSource, /https:\/\/gokisaan\.firebaseapp\.com/);
  assert.match(nextConfigSource, /same-origin-allow-popups/);
});

test("login and register pages fit inside the shared header and footer shell", async () => {
  const [loginSource, registerSource, chromeSource] = await Promise.all([
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/SiteChrome.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(chromeSource, /<Footer \/>/);
  assert.doesNotMatch(loginSource, /<main className="[^"]*min-h-screen/);
  assert.doesNotMatch(registerSource, /<main className="[^"]*min-h-screen/);
  assert.match(loginSource, /pt-28/);
  assert.match(registerSource, /pt-28/);
});

test("booking and listing workflows stay Firebase FCM only for notifications", async () => {
  const [firebaseDataSource, actionSource, repoSource] = await Promise.all([
    readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/actions/local-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/pause-mock-listings.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(firebaseDataSource, /sendPushNotificationToUsers/);
  assert.match(firebaseDataSource, /notifyBookingCreated/);
  assert.match(firebaseDataSource, /notifyListingChanged/);
  assert.match(actionSource, /notifyListingChanged/);
  assert.match(repoSource, /MOCK_LISTING_IDS/);

  for (const source of [firebaseDataSource, actionSource]) {
    assert.doesNotMatch(source, /MSG91|Twilio|sms|SMS|whatsapp/i);
  }
});
