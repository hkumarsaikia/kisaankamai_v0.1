import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

test("public SEO metadata brands titles, supports noindex pages, and includes structured data", async () => {
  const [metadataSource, layoutSource] = await Promise.all([
    readFile(new URL("../lib/site-metadata.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(metadataSource, /normalizeTitle/);
  assert.match(metadataSource, /\$\{title\} \| \$\{SITE_NAME\}/);
  assert.match(metadataSource, /DEFAULT_SHARE_IMAGE_PATH = "\/assets\/share\/kisan-kamai-og\.jpg"/);
  assert.match(metadataSource, /getShareCacheVersion/);
  assert.match(metadataSource, /process\.env\.K_REVISION/);
  assert.match(metadataSource, /getShareImageUrl/);
  assert.match(metadataSource, /imagePath\?: string/);
  assert.match(metadataSource, /og:image:type" content="image\/jpeg"/);
  assert.match(metadataSource, /og:image:width" content="1200"/);
  assert.match(metadataSource, /twitter:image:alt/);
  assert.match(metadataSource, /noIndex\?: boolean/);
  assert.match(metadataSource, /noindex,follow/);
  assert.match(layoutSource, /siteStructuredData/);
  assert.match(layoutSource, /type: "image\/jpeg"/);
  assert.match(layoutSource, /"@type": "WebSite"/);
  assert.match(layoutSource, /SearchAction/);
  assert.match(layoutSource, /application\/ld\+json/);
  assert.match(layoutSource, /Rent and List Farm Equipment in Maharashtra/);
});

test("share preview image is a dedicated 1200x630 JPEG for social platforms", async () => {
  await access(new URL("../public/assets/share/kisan-kamai-og.jpg", import.meta.url));
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
  assert.match(homeSource, /Helping farmers choose equipment with confidence/);
  assert.doesNotMatch(
    homeSource,
    /Farmer ratings|Rated for practical equipment access|Clear photos, direct owner coordination/
  );
  assert.match(ownerExperienceSource, /Renter Profiles/);
  assert.match(ownerBenefitsSource, /Set your availability, review renter requests, and coordinate work clearly/);
});

test("public Marathi mode uses source-controlled labels for highlighted marketing and listing UI", async () => {
  const [homeSource, ownerBenefitsSource, aboutSource, rentViewSource, marketLabelsSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-benefits/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/rent-equipment/RentEquipmentView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/localized-market-labels.ts", import.meta.url), "utf8"),
  ]);

  assert.match(homeSource, /शेतकऱ्यांना आत्मविश्वासाने उपकरणे निवडण्यात मदत/);
  assert.match(homeSource, /राहुल पवार/);
  assert.doesNotMatch(homeSource, /Sample renter review|Sample owner review|Sample support review|Renter review|Owner review|Support review|नमुना/);
  assert.match(ownerBenefitsSource, /तुम्ही किती कमाई करू शकता/);
  assert.match(ownerBenefitsSource, /getLocalizedDistrictLabel/);
  assert.match(aboutSource, /उत्तर महाराष्ट्रातील स्थानिक शेतकरी संबंधांवर/);
  assert.match(rentViewSource, /getLocalizedCategoryLabel/);
  assert.match(rentViewSource, /getLocalizedLocationParts/);
  assert.match(marketLabelsSource, /Tractors/);
  assert.match(marketLabelsSource, /ट्रॅक्टर्स/);
  assert.match(marketLabelsSource, /Maharashtra/);
  assert.match(marketLabelsSource, /महाराष्ट्र/);
});

test("live Lighthouse accessibility fixes keep labels and canonical paths valid", async () => {
  const [headerSource, footerSource, homeSource, rentPageSource] = await Promise.all([
    readFile(new URL("../components/Header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/Footer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/rent-equipment/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(headerSource, /const accessibleLabel = `\$\{buttonLabel\} - \$\{ariaLabel\}`/);
  assert.match(headerSource, /aria-label=\{accessibleLabel\}/);
  assert.match(footerSource, /text-slate-400 text-xs font-normal/);
  assert.match(homeSource, /aria-label=\{t\("home\.select_location"\)\}/);
  assert.match(rentPageSource, /metadata = buildPageMetadata/);
  assert.match(rentPageSource, /path: "\/rent-equipment"/);
  assert.match(rentPageSource, /imagePath: "\/assets\/share\/pages\/rent-equipment\.jpg"/);
});

test("page share previews use route metadata exports, dedicated thumbnails, and cache-busted images", async () => {
  const [metadataSource, pageMetadataSource, nextConfigSource, howItWorksLayout, supportLayout, ownerBenefitsLayout] = await Promise.all([
    readFile(new URL("../lib/site-metadata.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/public-page-metadata.ts", import.meta.url), "utf8"),
    readFile(new URL("../next.config.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/how-it-works/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/support/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-benefits/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(metadataSource, /imageUrl\.searchParams\.set\("v", getShareCacheVersion\(\)\)/);
  assert.match(metadataSource, /title,\s*\n\s*description,/);
  assert.match(nextConfigSource, /CDN-Cache-Control/);
  assert.match(nextConfigSource, /\/assets\/share\/:path\*/);
  assert.match(pageMetadataSource, /ownerBenefits: buildPageMetadata\(\{[\s\S]*imagePath: "\/assets\/share\/pages\/owner-benefits\.jpg"/);
  assert.match(pageMetadataSource, /support: buildPageMetadata\(\{[\s\S]*imagePath: "\/assets\/share\/pages\/support\.jpg"/);
  assert.match(pageMetadataSource, /howItWorks: buildPageMetadata\(\{[\s\S]*imagePath: "\/assets\/share\/pages\/how-it-works\.jpg"/);
  assert.match(howItWorksLayout, /metadata = publicPageMetadata\.howItWorks/);
  assert.match(supportLayout, /metadata = publicPageMetadata\.support/);
  assert.match(ownerBenefitsLayout, /metadata = publicPageMetadata\.ownerBenefits/);

  await Promise.all(
    [
      "about",
      "categories",
      "coming-soon",
      "faq",
      "feature-request",
      "feedback",
      "forgot-password",
      "how-it-works",
      "list-equipment",
      "login",
      "owner-benefits",
      "owner-experience",
      "partner",
      "profile-selection",
      "register",
      "rent-equipment",
      "support",
      "terms",
      "trust-safety",
      "verify-contact",
    ].map((name) => access(new URL(`../public/assets/share/pages/${name}.jpg`, import.meta.url)))
  );
});
