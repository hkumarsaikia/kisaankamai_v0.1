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

test("rent equipment empty states do not show owner-publish explanatory copy", async () => {
  const viewSource = await readFile(new URL("../app/rent-equipment/RentEquipmentView.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(viewSource, /Public results stay empty until owners publish complete live listings with images and location details\./);
  assert.doesNotMatch(viewSource, /When owners publish complete live listings in this category, they will appear here automatically\./);
  assert.doesNotMatch(viewSource, /मालकांनी फोटो आणि ठिकाणाच्या तपशीलांसह पूर्ण थेट यादी प्रकाशित करेपर्यंत सार्वजनिक निकाल रिकामे राहतील/);
  assert.doesNotMatch(viewSource, /मालकांनी या वर्गवारीतील पूर्ण थेट यादी प्रकाशित केली की ती येथे आपोआप दिसेल/);
});

test("login uses a registered mobile number and password only", async () => {
  const [loginSource, validationSource, localAuthSource, firebaseDataSource, authLoginRouteSource, httpSource] = await Promise.all([
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/validation/forms.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/local-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/login/route.ts", import.meta.url), "utf8").catch(() => ""),
    readFile(new URL("../lib/server/http.ts", import.meta.url), "utf8"),
  ]);

  assert.match(loginSource, /Mobile number/);
  assert.match(loginSource, /password/);
  assert.match(loginSource, /\/api\/auth\/login/);
  assert.doesNotMatch(loginSource, /loginAction/);
  assert.doesNotMatch(loginSource, /Mobile number or Email ID|Email ID|name@example\.com|Continue with Google|GoogleAuthButton/);
  assert.doesNotMatch(loginSource, /startPhoneVerification|verifyPhoneOtp|OtpVerificationForm|Phone OTP|confirmationId|otpDigits/);
  assert.doesNotMatch(validationSource, /Enter your mobile number or email/);
  assert.match(localAuthSource, /loginAndCreateSession/);
  assert.match(authLoginRouteSource, /loginInputSchema/);
  assert.match(authLoginRouteSource, /loginAndCreateSession/);
  assert.match(authLoginRouteSource, /mirrorAuthEvent/);
  assert.match(authLoginRouteSource, /withLoggedRoute/);
  assert.match(firebaseDataSource, /loginWithPhone/);
  assert.match(firebaseDataSource, /passwordLoginEmail/);
  assert.match(firebaseDataSource, /resolvePasswordLoginEmail/);
  assert.match(firebaseDataSource, /buildIdentityToolkitReferer/);
  assert.match(firebaseDataSource, /Referer/);
  assert.match(httpSource, /isLoopbackHostname/);
  assert.match(httpSource, /areSameOriginForMutation/);
  assert.match(httpSource, /appendKnownSiteOriginVariants/);
  assert.match(httpSource, /kisankamai\.com/);
  assert.match(httpSource, /www\.kisankamai\.com/);
});

test("login route returns specific phone-not-found and bad-password states", async () => {
  const [loginSource, authLoginRouteSource, localAuthSource, firebaseDataSource] = await Promise.all([
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/login/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/local-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(firebaseDataSource, /loginWithPhoneDetailed/);
  assert.match(localAuthSource, /loginAndCreateSessionDetailed/);
  assert.match(authLoginRouteSource, /reason:\s*"not-found"/);
  assert.match(authLoginRouteSource, /reason:\s*"invalid-password"/);
  assert.match(authLoginRouteSource, /Please register first/);
  assert.match(authLoginRouteSource, /Incorrect password/);
  assert.match(loginSource, /LoginNotice/);
  assert.match(loginSource, /REGISTER_FIRST_TOAST_MS\s*=\s*5000/);
  assert.match(loginSource, /toast\?\.kind === "register"/);
  assert.match(loginSource, /Incorrect password/);
});

test("successful registration returns to plain login without pleaseLogin query state", async () => {
  const [loginSource, registerSource] = await Promise.all([
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(loginSource, /pleaseLogin/);
  assert.doesNotMatch(registerSource, /pleaseLogin/);
  assert.match(registerSource, /router\.replace\("\/login"\)/);
});

test("phone password auth repairs legacy credentials and reset uses the same credential writer", async () => {
  const [firebaseDataSource, resetSource, packageSource, repairScriptSource] = await Promise.all([
    readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/password-reset.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/repair-password-login-emails.mjs", import.meta.url), "utf8").catch(() => ""),
  ]);

  assert.match(firebaseDataSource, /getPasswordLoginEmailCandidates/);
  assert.match(firebaseDataSource, /rememberPasswordLoginEmailForUser/);
  assert.match(firebaseDataSource, /buildPasswordLoginEmail\(normalizedPhone \|\| userId\)/);
  assert.match(firebaseDataSource, /getAuthUserByPhone/);
  assert.match(firebaseDataSource, /getUserByPhoneNumber/);
  assert.match(firebaseDataSource, /getPasswordLoginEmailCandidates\(user,\s*authUserByPhone\)/);
  assert.match(firebaseDataSource, /authUserByPhone\?\.email/);
  assert.match(resetSource, /createOrUpdatePasswordLoginCredential/);
  assert.doesNotMatch(resetSource, /auth\.updateUser\(user\.id,\s*\{\s*password/);
  assert.match(packageSource, /auth:repair-password-login-emails/);
  assert.match(repairScriptSource, /getUserByPhoneNumber/);
  assert.match(repairScriptSource, /passwordLoginEmail/);
  assert.match(repairScriptSource, /redactEmail/);
  assert.doesNotMatch(repairScriptSource, /password\s*:/);
  assert.doesNotMatch(repairScriptSource, /idToken|refreshToken/);
});

test("manual registration checks uniqueness before Firebase OTP and requires password-backed phone login", async () => {
  const [
    registerSource,
    sessionRouteSource,
    typeSource,
    preflightSource,
    phoneTestModeRouteSource,
    phoneTestModeHelperSource,
    firebaseAuthClientSource,
  ] = await Promise.all([
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-session-route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/local-data/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/register/preflight/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/phone-test-mode/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/phone-auth-test-mode.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/auth/firebase-auth-client.ts", import.meta.url), "utf8"),
  ]);

  assert.match(registerSource, /startPhoneVerification/);
  assert.match(registerSource, /verifyPhoneOtp/);
  assert.match(registerSource, /password/);
  assert.match(registerSource, /finishFirebaseAuthSession/);
  assert.match(registerSource, /\/api\/auth\/register\/preflight/);
  assert.match(registerSource, /\/api\/auth\/phone-test-mode/);
  assert.match(registerSource, /kk_phone_auth_test_token/);
  assert.match(registerSource, /x-kk-phone-auth-test-token/);
  assert.match(registerSource, /disableAppVerificationForTesting/);
  assert.match(preflightSource, /assertRegistrationIdentifiersAvailable/);
  assert.match(preflightSource, /isPhoneAuthTestModeAllowed/);
  assert.match(preflightSource, /Account already exists\. Please login with your registered mobile number\./);
  assert.match(preflightSource, /Account already exists\. Please login with your registered phone number\./);
  assert.match(phoneTestModeRouteSource, /isPhoneAuthTestModeAllowed/);
  assert.match(phoneTestModeHelperSource, /KK_PHONE_AUTH_TEST_MODE_TOKEN/);
  assert.match(phoneTestModeHelperSource, /timingSafeEqual/);
  assert.match(phoneTestModeHelperSource, /finalTestManifest/);
  assert.match(firebaseAuthClientSource, /appVerificationDisabledForTesting/);
  assert.match(firebaseAuthClientSource, /disableAppVerificationForTesting/);
  assert.doesNotMatch(registerSource, /Create account with Google|GoogleAuthButton/);
  assert.doesNotMatch(registerSource, /workspacePreference/);
  assert.doesNotMatch(registerSource, /Primary workspace|मुख्य कार्यक्षेत्र/);
  assert.doesNotMatch(registerSource, /clearServerAuthSession/);
  assert.match(sessionRouteSource, /password/);
  assert.match(sessionRouteSource, /createOrUpdatePasswordLoginCredential/);
  assert.match(typeSource, /passwordLoginEmail/);
});

test("registration no longer asks for identity verification documents", async () => {
  const registerSource = await readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(registerSource, /Optional identity verification/);
  assert.doesNotMatch(registerSource, /Phone verification creates the account/);
  assert.doesNotMatch(registerSource, /verificationDocumentTypes/);
  assert.doesNotMatch(registerSource, /uploadVerificationDocuments/);
  assert.doesNotMatch(registerSource, /idType/);
  assert.doesNotMatch(registerSource, /idNumber/);
  assert.doesNotMatch(registerSource, /Aadhaar Card|PAN Card|Voter ID|Driving License|Passport/);
  assert.match(registerSource, /verificationStatus:\s*"not_submitted"/);
});

test("registration district selection is limited to Maharashtra districts", async () => {
  const [registerSource, districtSource] = await Promise.all([
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/auth/india-districts.ts", import.meta.url), "utf8"),
  ]);

  assert.match(registerSource, /MAHARASHTRA_DISTRICTS/);
  assert.doesNotMatch(registerSource, /getIndiaDistrictSuggestions/);
  assert.match(districtSource, /MAHARASHTRA_DISTRICTS/);
  assert.match(districtSource, /Nashik/);
  assert.match(districtSource, /Jalgaon/);
  assert.match(districtSource, /Pune/);
  assert.doesNotMatch(districtSource, /AGRA/);
});

test("Google auth entrypoints are disabled while phone-only auth is active", async () => {
  const [loginSource, registerSource, googleResolveSource, googleRegisterSource, googleEmailPageSource] = await Promise.all([
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/google/resolve/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/google/register/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/register/google-email/page.tsx", import.meta.url), "utf8"),
  ]);

  for (const source of [loginSource, registerSource]) {
    assert.doesNotMatch(source, /GoogleAuthButton|Continue with Google|Create account with Google/);
  }
  for (const source of [googleResolveSource, googleRegisterSource]) {
    assert.match(source, /Google sign-in is disabled/);
    assert.match(source, /status:\s*410/);
  }
  assert.match(googleEmailPageSource, /redirect\("\/register"\)/);
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
