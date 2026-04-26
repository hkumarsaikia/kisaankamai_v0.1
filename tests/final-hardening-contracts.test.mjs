import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("shared support contact uses the approved primary contact and roster", async () => {
  const { supportContact, supportTeamContacts } = await import("../lib/support-contact.ts");

  assert.equal(supportContact.email, "nikamrohit3531@gmail.com");
  assert.equal(supportContact.phoneE164, "+918485883531");
  assert.equal(supportContact.phoneHref, "tel:+918485883531");
  assert.equal(supportContact.whatsappHref, "https://wa.me/918485883531");
  assert.equal(supportContact.primaryContactName, "Rohit Nikaam");

  assert.deepEqual(supportTeamContacts, [
    {
      name: "Pratik Shinde",
      email: "pratikshinde6416@gmail.com",
      phoneE164: "+917385204960",
      phoneDisplay: "+91 73852 04960",
      whatsappE164: "+917385204960",
      whatsappDisplay: "+91 73852 04960",
    },
    {
      name: "Rohit Nikaam",
      email: "nikamrohit3531@gmail.com",
      phoneE164: "+918485883531",
      phoneDisplay: "+91 84858 83531",
      whatsappE164: "+918485883531",
      whatsappDisplay: "+91 84858 83531",
    },
  ]);
});

test("shipped auth pages remove Aadhaar auth copy, demo OTP values, and local-bypass verification messaging", async () => {
  const [loginSource, registerSource, verifyContactSource, forgotPasswordSource, forgotPasswordVerifySource, manualI18nSource] = await Promise.all([
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/verify-contact/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/forgot-password/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/forgot-password/verify-otp/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/i18n.manual.ts", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(loginSource, /Aadhaar|Aadhar/);
  assert.doesNotMatch(registerSource, /DEMO_OTP|123456|Send OTP|Verify OTP|otpVerified/);
  assert.doesNotMatch(registerSource, /Aadhaar verification helps confirm identity/i);
  assert.doesNotMatch(registerSource, /Verify OTP to unlock account creation/i);
  assert.doesNotMatch(verifyContactSource, /verification_disabled_for_local_testing|bypassed_in_this_local_data_phase/i);
  assert.doesNotMatch(forgotPasswordSource, /receive a reset code|Send Code/i);
  assert.doesNotMatch(forgotPasswordVerifySource, /Local verification gate|Any 6 digits will continue/i);
  assert.doesNotMatch(manualI18nSource, /Aadhar\/PAN|आधार\/पॅन/);
});

test("site contact pages route through the approved contact details and remove legacy hotline values", async () => {
  const sources = await Promise.all(
    [
      "../app/support/page.tsx",
      "../app/report/page.tsx",
      "../app/coming-soon/page.tsx",
      "../app/partner/page.tsx",
      "../app/terms/page.tsx",
      "../components/profile/ProfileSupportWorkspace.tsx",
      "../components/workspace/OwnerWorkspaceOverview.tsx",
      "../components/workspace/RenterWorkspaceOverview.tsx",
      "../components/workspace/TrackingOrderModal.tsx",
      "../components/profile/OwnerBookingsBoard.tsx",
      "../components/renter-profile/RenterBookingsBoard.tsx",
    ].map((filePath) => readFile(new URL(filePath, import.meta.url), "utf8"))
  );

  for (const source of sources) {
    assert.doesNotMatch(source, /support@kisankamai\.com|partners@kisankamai\.in|safety@kisankamai\.com|krishiseva/i);
    assert.doesNotMatch(source, /\+91 1800 555 0123|9118005550123|1800-123-4567|1800-KISAN-HELP/);
  }
});

test("root app no longer ships old demo phone placeholders or outdated faq contact values", async () => {
  const sources = await Promise.all(
    [
      "../app/forgot-password/page.tsx",
      "../app/register/page.tsx",
      "../app/report/page.tsx",
      "../app/support/page.tsx",
      "../components/renter-profile/RenterProfileViews.tsx",
      "../lib/i18n.auto.ts",
    ].map((filePath) => readFile(new URL(filePath, import.meta.url), "utf8"))
  );

  for (const source of sources) {
    assert.doesNotMatch(source, /98765 43210|9876543210|\+91 80012 34567/);
  }
});

test("root app exposes production metadata and crawler/share endpoints", async () => {
  const [layoutSource, sitemapSource, robotsSource, manifestSource, siteMetadataSource, categoriesHeadSource, faqHeadSource, forgotPasswordHeadSource] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/manifest.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/site-metadata.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/categories/head.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/faq/head.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/forgot-password/head.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layoutSource, /metadataBase/);
  assert.match(layoutSource, /openGraph/);
  assert.match(layoutSource, /twitter/);
  assert.match(sitemapSource, /SITE_DOMAIN/);
  assert.match(siteMetadataSource, /https:\/\/www\.kisankamai\.com/);
  assert.match(robotsSource, /sitemap/i);
  assert.match(manifestSource, /Kisan Kamai/);
  assert.match(categoriesHeadSource, /renderHeadMetadata/);
  assert.match(faqHeadSource, /renderHeadMetadata/);
  assert.match(forgotPasswordHeadSource, /renderHeadMetadata/);
});

test("sitemap and public equipment details only expose live public Firestore listings", async () => {
  const [sitemapSource, serverEquipmentSource] = await Promise.all([
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/equipment.ts", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(sitemapSource, /getMockEquipmentList|MOCK_EQUIPMENT/);
  assert.match(sitemapSource, /getPublicEquipmentList/);
  assert.doesNotMatch(serverEquipmentSource, /getListingById/);
  assert.doesNotMatch(serverEquipmentSource, /listingToEquipmentRecord/);
  assert.match(serverEquipmentSource, /getPublicEquipmentById/);
});

test("catalog pages do not ship hardcoded mock equipment detail experiences", async () => {
  const [catalogSource, gallerySource] = await Promise.all([
    readFile(new URL("../app/catalog/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/catalog/[slug]/gallery/page.tsx", import.meta.url), "utf8"),
  ]);

  for (const source of [catalogSource, gallerySource]) {
    assert.doesNotMatch(source, /John Deere 5310 Performer|Mahindra|Kubota|Swaraj/);
    assert.doesNotMatch(source, /CatalogBookingForm/);
    assert.match(source, /redirect\(/);
    assert.match(source, /\/rent-equipment/);
  }
});

test("password reset lookup does not reveal account email or hidden phone for email identifiers", async () => {
  const [routeSource, pageSource, resetSource] = await Promise.all([
    readFile(new URL("../app/api/auth/password-reset/request/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/forgot-password/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/password-reset.ts", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(routeSource, /email:\s*target\.email/);
  assert.doesNotMatch(routeSource, /resolvePasswordResetTarget/);
  assert.match(routeSource, /resolvePasswordResetPhoneInput/);
  assert.doesNotMatch(pageSource, /RESET_EMAIL_KEY/);
  assert.match(resetSource, /resolvePasswordResetPhoneInput/);
});
