import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("public SEO metadata brands titles, supports noindex pages, and includes structured data", async () => {
  const [metadataSource, layoutSource] = await Promise.all([
    readFile(new URL("../lib/site-metadata.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(metadataSource, /normalizeTitle/);
  assert.match(metadataSource, /\$\{title\} \| \$\{SITE_NAME\}/);
  assert.match(metadataSource, /noIndex\?: boolean/);
  assert.match(metadataSource, /noindex,follow/);
  assert.match(layoutSource, /siteStructuredData/);
  assert.match(layoutSource, /"@type": "WebSite"/);
  assert.match(layoutSource, /SearchAction/);
  assert.match(layoutSource, /application\/ld\+json/);
  assert.match(layoutSource, /Rent and List Farm Equipment in Maharashtra/);
});

test("sitemap contains indexable public routes and excludes protected or utility routes", async () => {
  const [sitemapSource, robotsSource] = await Promise.all([
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
  ]);

  for (const route of ["/", "/rent-equipment", "/categories", "/owner-benefits", "/how-it-works", "/support"]) {
    assert.match(sitemapSource, new RegExp(`"${route.replace("/", "\\/")}"`));
  }

  for (const route of [
    "/api/",
    "/complete-profile",
    "/list-equipment",
    "/login",
    "/owner-profile",
    "/profile-selection",
    "/register",
    "/renter-profile",
    "/verify-contact",
  ]) {
    assert.doesNotMatch(sitemapSource, new RegExp(route.replace(/\//g, "\\/")));
  }

  assert.match(robotsSource, /disallow/);
  assert.match(robotsSource, /\/api\//);
  assert.match(robotsSource, /\/owner-profile\//);
  assert.match(robotsSource, /\/renter-profile\//);
});

test("public marketing copy avoids unsupported testimonial, ranking, and numeric claims", async () => {
  const [homeSource, ownerExperienceSource, ownerBenefitsSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-experience/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-benefits/page.tsx", import.meta.url), "utf8"),
  ]);
  const combined = `${homeSource}\n${ownerExperienceSource}\n${ownerBenefitsSource}`;

  assert.doesNotMatch(combined, /Rooted Success Stories|testimonials|saved me|Rajesh Deshmukh|Sanjay Kulkarni|Vikas More/);
  assert.doesNotMatch(combined, /India's most trusted|1,200\+|₹85,000|40% faster|strict KYC|24\/7 Assistance/);
  assert.doesNotMatch(combined, /verified farmers|Verified Renters|premium to use/);
  assert.match(homeSource, /farmerRatingTiles/);
  assert.match(homeSource, /Farmer ratings/);
  assert.match(ownerExperienceSource, /Renter Profiles/);
  assert.match(ownerBenefitsSource, /Set your availability, review renter requests, and coordinate work clearly/);
});
