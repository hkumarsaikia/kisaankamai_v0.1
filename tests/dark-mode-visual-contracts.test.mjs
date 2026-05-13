import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("auth pages use shared dark-aware surfaces without the verify OTP vignette overlay", async () => {
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

  for (const source of [login, register, forgot]) {
    assert.match(source, /kk-auth-page/);
    assert.match(source, /kk-dark-image-overlay/);
  }
  assert.match(verifyOtp, /kk-auth-page/);
  assert.doesNotMatch(verifyOtp, /kk-dark-image-overlay/);
  assert.match(forgot, /mt-auto p-12 text-white/);
  assert.doesNotMatch(forgot, /mt-auto p-12 text-on-primary/);
  assert.match(forgot, /text-outline-variant dark:text-emerald-200/);

  assert.match(otpForm, /kk-auth-card/);
  assert.match(otpForm, /kk-otp-input/);
  assert.doesNotMatch(otpForm, /bg-white\/85|border-white\/60|bg-slate-100\/50|focus:bg-white/);
  assert.doesNotMatch(googleButton, /border-slate-300 bg-white px-5/);
});

test("reported dark-mode problem pages do not use low-contrast primary-container text on dark surfaces", async () => {
  const [rentView, support] = await Promise.all([
    readSource("../app/rent-equipment/RentEquipmentView.tsx"),
    readSource("../app/support/page.tsx"),
  ]);

  for (const source of [rentView, support]) {
    assert.doesNotMatch(source, /text-primary-container/);
  }
  assert.match(support, /text-primary dark:text-emerald-950/);
});

test("requested public banner imagery uses one shared overlay while product imagery stays clear", async () => {
  const entries = await Promise.all(
    [
      ["home", "../app/page.tsx"],
      ["owner benefits", "../app/owner-benefits/page.tsx"],
      ["how it works", "../app/how-it-works/page.tsx"],
      ["terms", "../app/terms/page.tsx"],
      ["partner", "../app/partner/page.tsx"],
      ["support", "../app/support/page.tsx"],
    ].map(async ([name, path]) => [name, await readSource(path)])
  );
  const rentView = await readSource("../app/rent-equipment/RentEquipmentView.tsx");
  const globals = await readSource("../app/globals.css");

  for (const [name, source] of entries) {
    assert.match(source, /kk-banner-image-overlay/, `${name} does not use the shared banner overlay`);
    assert.doesNotMatch(
      source,
      /object-cover[^"'\n]*(brightness-\[|grayscale-\[|opacity-55|opacity-\[0\.55\])/,
      `${name} still dims or desaturates an image directly`
    );
  }

  assert.match(globals, /\.kk-banner-image-overlay/);
  assert.match(globals, /backdrop-filter:\s*blur\(2px\)|backdrop-blur/);
  assert.doesNotMatch(rentView, /kk-banner-image-overlay/);
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
    "../app/renter-profile/loading.tsx",
    "../app/support/loading.tsx",
    "../app/equipment/[id]/loading.tsx",
  ];

  const sources = await Promise.all(loadingFiles.map(readSource));

  for (const source of sources) {
    assert.doesNotMatch(source, /LoadingScreen|animate-pulse|animate-\[pulse/);
  }
});

test("rent equipment avoids a null segment loading boundary that shifts the footer during streaming", async () => {
  await assert.rejects(
    readSource("../app/rent-equipment/loading.tsx"),
    /ENOENT/
  );
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
  assert.match(home, /useAuth/);
  assert.match(home, /const showRegisterTile = !user/);
  assert.match(home, /showRegisterTile \? <HomeRegisterTile langText=\{langText\} \/> : null/);
  assert.match(home, /justify-start lg:grid-cols-\[minmax\(560px,760px\)\]/);
  assert.match(home, /href="\/register"/);
  assert.match(home, /Register Now/);
  assert.match(home, /Rent, List & Grow/);
  assert.match(home, /bg-white/);
  assert.match(home, /dark:bg-surface-container-lowest/);
  assert.match(home, /max-w-\[min\(1480px,calc\(100vw-48px\)\)\]/);
  assert.match(home, /lg:grid-cols-\[minmax\(560px,760px\)_minmax\(320px,390px\)\]/);
  assert.doesNotMatch(home, /xl:gap-52/);
  assert.doesNotMatch(home, /max-w-7xl items-center gap-10/);
  assert.doesNotMatch(home, /Secure Payouts/);
  assert.doesNotMatch(home, /Find equipment or publish your available machine/);
  assert.doesNotMatch(home, /Send requests and coordinate timing directly/);
  assert.doesNotMatch(home, /Rent locally or earn from idle equipment/);
  assert.doesNotMatch(home, /Stay connected with owner-managed rental support/);
});

test("home hero prioritizes the first visual image for Lighthouse LCP", async () => {
  const home = await readSource("../app/page.tsx");

  assert.match(home, /currentHeroSlide/);
  assert.doesNotMatch(home, /heroSlides\.map\(\(slide, index\) => \(/);
  assert.match(home, /loading="eager"/);
  assert.match(home, /priority/);
  assert.match(home, /fetchPriority="high"/);
});

test("generated marketing imagery is served through optimized webp assets", async () => {
  const siteSource = await readSource("../lib/site.ts");

  assert.match(siteSource, /GENERATED_IMAGE_WEBP_PATTERN/);
  assert.match(siteSource, /\.webp/);
  assert.match(siteSource, /path\.replace\(GENERATED_IMAGE_WEBP_PATTERN/);

  await Promise.all(
    ["hero_tractor", "harvester_action", "seed_drill", "modern_farm_tech"].map((name) =>
      access(new URL(`../public/assets/generated/${name}.webp`, import.meta.url))
    )
  );
  await access(new URL("../public/assets/generated/hero_tractor_mobile.webp", import.meta.url));
});

test("self-hosted Material Symbols font is subset for the active icon set", async () => {
  const font = await stat(new URL("../public/fonts/material-symbols-outlined.woff2", import.meta.url));

  assert.ok(
    font.size < 80_000,
    `Material Symbols should stay subset for first-load performance; current size is ${font.size} bytes`
  );
});

test("mobile icon controls keep accessible touch targets", async () => {
  const [login, register, forgotNewPassword, feedback] = await Promise.all([
    readSource("../app/login/page.tsx"),
    readSource("../app/register/page.tsx"),
    readSource("../app/forgot-password/new-password/page.tsx"),
    readSource("../components/profile/ProfileFeedbackForm.tsx"),
  ]);

  for (const source of [login, register, forgotNewPassword]) {
    assert.match(source, /min-h-11/);
    assert.match(source, /min-w-11/);
  }

  assert.match(feedback, /min-h-11/);
  assert.match(feedback, /min-w-11/);
  assert.match(feedback, /items-center justify-center/);
});

test("shared action controls use the refined flow animation primitives", async () => {
  const [globals, login, register, home] = await Promise.all([
    readSource("../app/globals.css"),
    readSource("../app/login/page.tsx"),
    readSource("../app/register/page.tsx"),
    readSource("../app/page.tsx"),
  ]);

  assert.match(globals, /\.kk-flow-button/);
  assert.match(globals, /kk-flow-sheen/);
  assert.match(globals, /\.kk-login-toast/);
  assert.match(globals, /kk-toast-5s/);
  assert.match(globals, /prefers-reduced-motion/);
  for (const source of [login, register, home]) {
    assert.match(source, /kk-flow-button/);
  }
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

test("mobile dark mode public pages avoid invisible semantic CTA and form surfaces", async () => {
  const [
    home,
    support,
    faq,
    ownerBenefits,
    ownerExperience,
    featureRequest,
    terms,
    register,
    registerSuccess,
    verifyContact,
    renterBookings,
    ownerBookings,
    savedListings,
    trackingOrderModal,
    rentEquipment,
  ] = await Promise.all([
    readSource("../app/page.tsx"),
    readSource("../app/support/page.tsx"),
    readSource("../app/faq/page.tsx"),
    readSource("../app/owner-benefits/page.tsx"),
    readSource("../app/owner-experience/page.tsx"),
    readSource("../app/feature-request/page.tsx"),
    readSource("../app/terms/page.tsx"),
    readSource("../app/register/page.tsx"),
    readSource("../app/register/success/page.tsx"),
    readSource("../app/verify-contact/page.tsx"),
    readSource("../components/renter-profile/RenterBookingsBoard.tsx"),
    readSource("../components/profile/OwnerBookingsBoard.tsx"),
    readSource("../components/profile/SavedListingsBoard.tsx"),
    readSource("../components/workspace/TrackingOrderModal.tsx"),
    readSource("../app/rent-equipment/RentEquipmentView.tsx"),
  ]);

  assert.match(home, /bg-secondary text-white[^"`]*dark:bg-secondary-container[^"`]*dark:text-on-secondary-container/);
  assert.match(home, /bg-primary text-white[^"`]*dark:bg-primary-container/);
  assert.match(support, /bg-primary px-6[^"`]*dark:bg-primary-container/);
  assert.match(support, /lg:col-span-7[^"`]*bg-white[^"`]*dark:bg-slate-950/);
  assert.match(faq, /bg-white text-primary[^"`]*dark:bg-slate-950[^"`]*dark:text-emerald-100/);
  assert.match(faq, /bg-secondary text-white[^"`]*dark:bg-secondary-container[^"`]*dark:text-on-secondary-container/);
  assert.match(ownerBenefits, /py-24 bg-white relative[^"`]*dark:bg-slate-950/);
  assert.match(ownerBenefits, /text-gray-700[^"`]*dark:text-slate-200/);
  assert.match(ownerBenefits, /bg-gray-50[^"`]*dark:bg-slate-950[^"`]*dark:text-slate-100/);
  assert.match(ownerBenefits, /left-4[^"`]*max-w-\[calc\(100%-2rem\)\][^"`]*sm:-left-6/);
  assert.match(ownerExperience, /text-secondary-container[^"`]*dark:text-secondary-fixed/);
  assert.match(ownerExperience, /bg-secondary text-white[^"`]*dark:bg-secondary-container[^"`]*dark:text-on-secondary-container/);
  assert.match(ownerExperience, /text-primary-container[^"`]*dark:text-primary-fixed/);
  assert.match(featureRequest, /text-inverse-primary[^"`]*dark:text-primary-fixed/);
  assert.match(terms, /text-secondary-container[^"`]*dark:text-secondary-fixed/);
  assert.match(register, /dark:text-on-primary-fixed/);
  assert.match(registerSuccess, /dark:bg-slate-950\/95/);
  assert.match(registerSuccess, /text-primary-container dark:text-primary-fixed/);
  assert.match(verifyContact, /bg-primary[^"`]*text-white[^"`]*dark:bg-primary-container/);
  assert.match(renterBookings, /bg-primary-container text-white dark:text-primary-fixed/);
  assert.match(ownerBookings, /bg-primary-container text-white dark:text-primary-fixed/);
  assert.match(savedListings, /dark:bg-slate-950\/90 dark:text-primary-fixed/);
  assert.match(trackingOrderModal, /bg-primary-container[^"`]*text-white[^"`]*dark:text-primary-fixed/);
  assert.match(rentEquipment, /bg-primary-container text-white dark:text-primary-fixed/);
  assert.doesNotMatch(renterBookings, /bg-primary-container text-on-primary/);
  assert.doesNotMatch(ownerBookings, /bg-primary-container text-on-primary/);
});
