import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("auth and OTP pages use shared dark-aware surfaces instead of white glass panels", async () => {
  const [globals, login, register, forgot, verifyOtp, otpForm, googleButton] = await Promise.all([
    readSource("../app/globals.css"),
    readSource("../app/login/page.tsx"),
    readSource("../app/register/page.tsx"),
    readSource("../app/forgot-password/page.tsx"),
    readSource("../app/forgot-password/verify-otp/page.tsx"),
    readSource("../components/auth/OtpVerificationForm.tsx"),
    readSource("../components/auth/GoogleAuthButton.tsx"),
  ]);

  for (const className of [".kk-auth-page", ".kk-auth-card", ".kk-auth-input", ".kk-otp-input", ".kk-dark-image-overlay"]) {
    assert.match(globals, new RegExp(className.replace(".", "\\.")));
  }

  for (const source of [login, register, forgot, verifyOtp]) {
    assert.match(source, /kk-auth-page/);
    assert.match(source, /kk-dark-image-overlay/);
  }

  assert.match(otpForm, /kk-auth-card/);
  assert.match(otpForm, /kk-otp-input/);
  assert.doesNotMatch(otpForm, /bg-white\/85|border-white\/60|bg-slate-100\/50|focus:bg-white/);
  assert.doesNotMatch(googleButton, /border-slate-300 bg-white px-5/);
});

test("reported dark-mode problem pages do not use low-contrast primary-container text on dark surfaces", async () => {
  const [report, rentView] = await Promise.all([
    readSource("../app/report/page.tsx"),
    readSource("../app/rent-equipment/RentEquipmentView.tsx"),
  ]);

  for (const source of [report, rentView]) {
    assert.doesNotMatch(source, /text-primary-container/);
  }

  assert.doesNotMatch(report, /bg-secondary-fixed\/30/);
  assert.match(report, /bg-primary-container/);
});

test("requested public dark-mode imagery preserves image color without full-page wash overlays", async () => {
  const entries = await Promise.all(
    [
      ["home", "../app/page.tsx"],
      ["owner benefits", "../app/owner-benefits/page.tsx"],
      ["how it works", "../app/how-it-works/page.tsx"],
      ["terms", "../app/terms/page.tsx"],
      ["partner", "../app/partner/page.tsx"],
      ["report", "../app/report/page.tsx"],
      ["support", "../app/support/page.tsx"],
    ].map(async ([name, path]) => [name, await readSource(path)])
  );

  for (const [name, source] of entries) {
    assert.doesNotMatch(source, /kk-dark-image-overlay/, `${name} still uses a full dark image overlay`);
    assert.doesNotMatch(source, /kk-image-card-overlay/, `${name} still washes image cards`);
    assert.doesNotMatch(
      source,
      /object-cover[^"'\n]*(brightness-\[|grayscale-\[|opacity-55|opacity-\[0\.55\])/,
      `${name} still dims or desaturates an image directly`
    );
  }
});

test("home trust section no longer renders decorative background circles behind the tractor image", async () => {
  const home = await readSource("../app/page.tsx");

  assert.doesNotMatch(home, /-top-10 -left-10 w-40 h-40 bg-secondary\/5 rounded-full/);
  assert.doesNotMatch(home, /-bottom-10 -right-10 w-64 h-64 bg-primary\/5 rounded-full/);
});

test("visible route loading fallbacks are removed from public and profile routes", async () => {
  const loadingFiles = [
    "../app/list-equipment/loading.tsx",
    "../app/owner-profile/loading.tsx",
    "../app/profile-selection/loading.tsx",
    "../app/rent-equipment/loading.tsx",
    "../app/renter-profile/loading.tsx",
    "../app/report/loading.tsx",
    "../app/support/loading.tsx",
    "../app/equipment/[id]/loading.tsx",
  ];

  const sources = await Promise.all(loadingFiles.map(readSource));

  for (const source of sources) {
    assert.doesNotMatch(source, /LoadingScreen|animate-pulse|animate-\[pulse/);
  }
});

test("terms dark-mode support tiles use deep readable surfaces rather than pale cards", async () => {
  const terms = await readSource("../app/terms/page.tsx");

  assert.match(terms, /Discovery Only/);
  assert.match(terms, /Go to Support Center/);
  assert.doesNotMatch(terms, /absolute -bottom-8 -right-8 bg-primary p-10/);
  assert.doesNotMatch(terms, /bg-primary p-12 rounded-\[2\.5rem\] text-white/);
});

test("owner benefits hero is explicitly left aligned and register content allows the global footer after the form", async () => {
  const [ownerBenefits, register] = await Promise.all([
    readSource("../app/owner-benefits/page.tsx"),
    readSource("../app/register/page.tsx"),
  ]);

  assert.match(ownerBenefits, /text-left/);
  assert.match(ownerBenefits, /justify-start/);
  assert.doesNotMatch(ownerBenefits, /mx-auto w-full max-w-7xl px-6 text-center/);

  assert.match(register, /min-h-\[calc\(100svh-5rem\)\]/);
  assert.doesNotMatch(register, /fixed inset-0 z-0/);
});

test("support page uses a deep dark-mode call CTA instead of the light secondary button", async () => {
  const support = await readSource("../app/support/page.tsx");

  assert.match(support, /kk-deep-cta/);
  assert.doesNotMatch(support, /rounded-2xl bg-secondary px-10/);
});

test("home hero includes the compact register tile without unsupported payout copy", async () => {
  const home = await readSource("../app/page.tsx");

  assert.match(home, /HomeRegisterTile/);
  assert.match(home, /href="\/register"/);
  assert.match(home, /Register Now/);
  assert.match(home, /Rent, List & Grow/);
  assert.match(home, /bg-white/);
  assert.match(home, /dark:bg-surface-container-lowest/);
  assert.match(home, /max-w-\[min\(1760px,calc\(100vw-32px\)\)\]/);
  assert.doesNotMatch(home, /max-w-7xl items-center gap-10/);
  assert.doesNotMatch(home, /Secure Payouts/);
});

test("owner benefits calculator is interactive and covers expanded equipment categories", async () => {
  const ownerBenefits = await readSource("../app/owner-benefits/page.tsx");

  assert.match(ownerBenefits, /useState/);
  assert.match(ownerBenefits, /ownerEarningCategories/);
  assert.match(ownerBenefits, /selectedCategory/);
  assert.match(ownerBenefits, /monthlyEstimate/);
  for (const category of ["Tractor", "Harvester", "Rotavator", "Seed Drill", "Plough", "Trolley", "Sprayer", "Cultivator"]) {
    assert.match(ownerBenefits, new RegExp(category));
  }
});

test("forgot password success page uses the shared auth visual treatment", async () => {
  const success = await readSource("../app/forgot-password/success/page.tsx");

  assert.match(success, /kk-auth-page/);
  assert.match(success, /backdrop-blur/);
  assert.match(success, /assets\/generated\//);
  assert.doesNotMatch(success, /opacity-10/);
  assert.doesNotMatch(success, /tractorImage/);
});

test("feature request dark mode controls and CTA use readable contrast", async () => {
  const featureRequest = await readSource("../app/feature-request/page.tsx");

  assert.doesNotMatch(featureRequest, /has-\[:checked\]:bg-\[#eaf1ee\]/);
  assert.doesNotMatch(featureRequest, /bg-primary-container[^"']*text-on-primary/);
  assert.match(featureRequest, /has-\[:checked\]:bg-primary-container/);
  assert.match(featureRequest, /has-\[:checked\]:text-white/);
  assert.match(featureRequest, /Submit Feature Request/);
});
