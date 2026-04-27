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

test("public dark-mode imagery uses deep overlays instead of pale primary overlays", async () => {
  const sources = await Promise.all(
    [
      "../app/page.tsx",
      "../app/about/page.tsx",
      "../app/how-it-works/page.tsx",
      "../app/terms/page.tsx",
      "../app/partner/page.tsx",
      "../app/owner-benefits/page.tsx",
    ].map(readSource)
  );

  for (const source of sources) {
    assert.match(source, /kk-dark-image-overlay/);
    assert.doesNotMatch(source, /from-primary\/8[05]|from-primary\/90|via-primary\/55|via-primary\/60/);
  }
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
