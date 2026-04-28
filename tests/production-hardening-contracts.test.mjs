import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("site defaults to light mode and does not follow system dark mode by default", async () => {
  const layoutSource = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(layoutSource, /defaultTheme="light"/);
  assert.doesNotMatch(layoutSource, /defaultTheme="system"/);
  assert.doesNotMatch(layoutSource, /enableSystem(?!={false})/);
  assert.match(layoutSource, /kk-theme-boot/);
});

test("language provider hydrates from the server default before applying saved language", async () => {
  const languageSource = await readFile(new URL("../components/LanguageContext.tsx", import.meta.url), "utf8");

  assert.match(languageSource, /useState<Language>\(DEFAULT_LANGUAGE\)/);
  assert.match(languageSource, /localStorage\.getItem\(STORAGE_KEY\)/);
  assert.doesNotMatch(languageSource, /const bootLanguage\s*=\s*document\.documentElement\.dataset\.language/);
});

test("categories keep a baseline catalog while merging live owner listing categories", async () => {
  const [categorySource, categoriesPageSource, rentPageSource] = await Promise.all([
    readFile(new URL("../lib/equipment-categories.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/categories/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/rent-equipment/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(categorySource, /BASE_EQUIPMENT_CATEGORIES/);
  for (const slug of ["tractors", "harvesters", "implements", "ploughs", "sprayers", "rotavators", "seeders", "threshers", "pumps", "balers", "trolleys"]) {
    assert.match(categorySource, new RegExp(`slug:\\s*"${slug}"`));
  }
  assert.match(categorySource, /getMergedCategorySummariesFromEquipment/);
  assert.match(categoriesPageSource, /getMergedCategorySummariesFromEquipment/);
  assert.match(rentPageSource, /getMergedCategorySummariesFromEquipment/);
  assert.doesNotMatch(categoriesPageSource, /No live categories yet/);
});

test("support and report pages render one selected language without inline bilingual slash labels", async () => {
  const [supportSource, reportSource] = await Promise.all([
    readFile(new URL("../app/support/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/report/page.tsx", import.meta.url), "utf8"),
  ]);

  for (const source of [supportSource, reportSource]) {
    assert.match(source, /useLanguage/);
    assert.match(source, /langText/);
    assert.doesNotMatch(source, /Full Name\s*\/|Phone\s*\/|Email\s*\/|Category\s*\/|Message\s*\/|What happened\?\s*\/|Mobile Number\s*\/|District\s*\/|Description\s*\//);
  }
});

test("owner benefits removes the two requested hero templates", async () => {
  const ownerBenefitsSource = await readFile(new URL("../app/owner-benefits/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(ownerBenefitsSource, /owner-benefits\.steady_income/);
  assert.doesNotMatch(ownerBenefitsSource, /owner-benefits\.verified_renters/);
});

test("phone-only auth disables Google registration and login flows", async () => {
  const [loginSource, registerSource, googleResolveSource, googleRegisterSource, docsSource] = await Promise.all([
    readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/google/resolve/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/google/register/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../docs/DEVELOPMENT.md", import.meta.url), "utf8"),
  ]);

  for (const source of [loginSource, registerSource]) {
    assert.doesNotMatch(source, /GoogleAuthButton|Continue with Google|Create account with Google/);
  }
  for (const source of [googleResolveSource, googleRegisterSource]) {
    assert.match(source, /Google sign-in is disabled/);
    assert.match(source, /status:\s*410/);
  }
  assert.match(docsSource, /phone-only/i);
  assert.doesNotMatch(docsSource, /Existing Google accounts|New Google accounts/);
});

test("email and phone uniqueness use identifier lock documents", async () => {
  const firebaseDataSource = await readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8");

  assert.match(firebaseDataSource, /AUTH_IDENTIFIERS_COLLECTION/);
  assert.match(firebaseDataSource, /claimAuthIdentifier/);
  assert.match(firebaseDataSource, /releaseAuthIdentifier/);
  assert.match(firebaseDataSource, /runTransaction/);
});

test("sessions persist beyond the old five-day window and profile photos are part of the session contract", async () => {
  const [localAuthSource, typesSource, profileMenuSource] = await Promise.all([
    readFile(new URL("../lib/server/local-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/local-data/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/ProfileDropdownMenu.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(localAuthSource, /SESSION_MAX_AGE_DAYS\s*=\s*14/);
  assert.match(typesSource, /photoUrl\?: string/);
  assert.match(profileMenuSource, /photoUrl/);
  assert.doesNotMatch(profileMenuSource, /aida-public\/AB6AXuAPynK0ZgVc0Xzw8MYvvIJVEOBk4/);
});
