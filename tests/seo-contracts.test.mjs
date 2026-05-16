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
  assert.match(metadataSource, /og:image:url" content=\{shareImage\}/);
  assert.match(metadataSource, /meta name="thumbnail" content=\{shareImage\}/);
  assert.match(metadataSource, /link rel="image_src" href=\{shareImage\}/);
  assert.match(metadataSource, /locale: "en_IN"/);
  assert.match(metadataSource, /og:image:width" content="1200"/);
  assert.match(metadataSource, /twitter:image:alt/);
  assert.match(metadataSource, /noIndex\?: boolean/);
  assert.match(metadataSource, /noindex,follow/);
  assert.match(layoutSource, /siteStructuredData/);
  assert.match(layoutSource, /crawlerRequest \|\| !hasBrowserLanguageHeader/);
  assert.match(layoutSource, /const crawlerSafeEnglishChrome = crawlerRequest \|\| !hasBrowserLanguageHeader/);
  assert.match(layoutSource, /<SiteChrome crawlerSafeLabels=\{crawlerSafeEnglishChrome\}/);
  assert.match(layoutSource, /buildLanguageBootScript\(initialLanguage\)/);
  assert.match(layoutSource, /type: "image\/jpeg"/);
  assert.match(layoutSource, /max-image-preview:none/);
  assert.doesNotMatch(layoutSource, /max-image-preview:large/);
  assert.match(layoutSource, /name="google" content="notranslate"/);
  assert.match(layoutSource, /og:image:url/);
  assert.match(layoutSource, /rel="image_src"/);
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
  const [headerSource, siteChromeSource, footerSource, homeSource, rentPageSource] = await Promise.all([
    readFile(new URL("../components/Header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/SiteChrome.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/Footer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/rent-equipment/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(headerSource, /crawlerSafeLabels/);
  assert.match(headerSource, /\? "Marathi"/);
  assert.match(siteChromeSource, /crawlerSafeLabels=\{crawlerSafeLabels\}/);
  assert.match(headerSource, /const accessibleLabel = `\$\{buttonLabel\} - \$\{ariaLabel\}`/);
  assert.match(headerSource, /aria-label=\{accessibleLabel\}/);
  assert.match(footerSource, /text-slate-400 text-xs font-normal/);
  assert.match(homeSource, /aria-label=\{t\("home\.select_location"\)\}/);
  assert.match(rentPageSource, /metadata = buildPageMetadata/);
  assert.match(rentPageSource, /path: "\/rent-equipment"/);
  assert.match(rentPageSource, /imagePath: "\/assets\/share\/pages\/rent-equipment\.jpg"/);
});

test("page share previews use route metadata exports, dedicated thumbnails, and cache-busted images", async () => {
  const [
    metadataSource,
    pageMetadataSource,
    publicHeadSource,
    nextConfigSource,
    howItWorksLayout,
    supportLayout,
    ownerBenefitsLayout,
    rentEquipmentHead,
    supportHead,
    ownerBenefitsHead,
  ] = await Promise.all([
    readFile(new URL("../lib/site-metadata.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/public-page-metadata.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/public-page-head.tsx", import.meta.url), "utf8"),
    readFile(new URL("../next.config.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/how-it-works/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/support/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-benefits/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/rent-equipment/head.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/support/head.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-benefits/head.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(metadataSource, /imageUrl\.searchParams\.set\("v", getShareCacheVersion\(\)\)/);
  assert.match(metadataSource, /title,\s*\n\s*description,/);
  assert.match(nextConfigSource, /CDN-Cache-Control/);
  assert.match(nextConfigSource, /\/assets\/share\/:path\*/);
  assert.match(pageMetadataSource, /ownerBenefits: \{[\s\S]*imagePath: "\/assets\/share\/pages\/owner-benefits\.jpg"/);
  assert.match(pageMetadataSource, /support: \{[\s\S]*imagePath: "\/assets\/share\/pages\/support\.jpg"/);
  assert.match(pageMetadataSource, /howItWorks: \{[\s\S]*imagePath: "\/assets\/share\/pages\/how-it-works\.jpg"/);
  assert.match(pageMetadataSource, /rentEquipment: \{[\s\S]*imagePath: "\/assets\/share\/pages\/rent-equipment\.jpg"/);
  assert.match(pageMetadataSource, /export const publicPageMetadataInputs/);
  assert.match(publicHeadSource, /renderPublicPageHead/);
  assert.match(publicHeadSource, /renderHeadMetadata\(publicPageMetadataInputs\[key\]\)/);
  assert.match(howItWorksLayout, /metadata = publicPageMetadata\.howItWorks/);
  assert.match(supportLayout, /metadata = publicPageMetadata\.support/);
  assert.match(ownerBenefitsLayout, /metadata = publicPageMetadata\.ownerBenefits/);
  assert.match(rentEquipmentHead, /renderPublicPageHead\("rentEquipment"\)/);
  assert.match(supportHead, /renderPublicPageHead\("support"\)/);
  assert.match(ownerBenefitsHead, /renderPublicPageHead\("ownerBenefits"\)/);

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

test("open browser tabs detect a newer App Hosting build and refresh safely", async () => {
  const [layoutSource, monitorSource, routeSource, buildInfoSource] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/BuildFreshnessMonitor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/build-info/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/build-info.ts", import.meta.url), "utf8"),
  ]);

  assert.match(layoutSource, /getBuildRevision/);
  assert.match(layoutSource, /<meta name="kisan-kamai-build-revision" content=\{buildRevision\}/);
  assert.match(layoutSource, /<BuildFreshnessMonitor initialRevision=\{buildRevision\}/);
  assert.match(monitorSource, /\/api\/build-info/);
  assert.match(monitorSource, /cache: "no-store"/);
  assert.match(monitorSource, /visibilitychange/);
  assert.match(monitorSource, /window\.location\.reload\(\)/);
  assert.match(routeSource, /export const dynamic = "force-dynamic"/);
  assert.match(routeSource, /X-Kisan-Kamai-Revision/);
  assert.match(routeSource, /CDN-Cache-Control/);
  assert.match(buildInfoSource, /process\.env\.K_REVISION/);
});

test("crawl-audit fixes keep bot metadata in head and filtered search URLs canonical", async () => {
  const [nextConfigSource, proxySource, metadataSource, equipmentSource, layoutSource, pageMetadataSource, llmsSource] = await Promise.all([
    readFile(new URL("../next.config.mjs", import.meta.url), "utf8"),
    readFile(new URL("../proxy.js", import.meta.url), "utf8"),
    readFile(new URL("../lib/site-metadata.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/equipment/[id]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/public-page-metadata.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
  ]);

  assert.match(nextConfigSource, /htmlLimitedBots/);
  assert.match(nextConfigSource, /SEOmatorBot/);
  assert.doesNotMatch(proxySource, /X-Robots-Tag/);
  assert.doesNotMatch(proxySource, /noindex, follow/);
  assert.doesNotMatch(metadataSource, /Northern Maharashtra with Kisan Kamai\. Browse machinery, manage bookings, and coordinate directly/);
  assert.match(metadataSource, /Browse machines and manage bookings with local owners and renters nearby/);
  assert.match(equipmentSource, /slice\(0, 127\)/);
  assert.match(layoutSource, /publisher/);
  assert.match(layoutSource, /contactPoint/);
  assert.match(layoutSource, /sameAs/);
  assert.match(pageMetadataSource, /Browse available farm equipment across Maharashtra/);
  assert.match(pageMetadataSource, /Sign in to manage equipment listings, booking requests, saved machines, and profile settings/);
  assert.match(llmsSource, /Kisan Kamai/);
  assert.match(llmsSource, /https:\/\/www\.kisankamai\.com\/rent-equipment/);
});

test("seo-audited public forms expose explicit labels for static crawlers", async () => {
  const [homeSource, registerSource, ownerBenefitsSource, partnerSource, forgotPasswordSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/owner-benefits/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/partner/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/forgot-password/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(homeSource, /htmlFor="home-equipment-search"/);
  assert.match(homeSource, /id="home-equipment-search"/);
  for (const id of [
    "register-full-name",
    "register-phone",
    "register-email",
    "register-password",
    "register-village",
    "register-district",
    "register-pincode",
  ]) {
    assert.match(registerSource, new RegExp(`htmlFor="${id}"`));
    assert.match(registerSource, new RegExp(`id="${id}"`));
  }

  for (const id of ["owner-benefits-equipment-type", "owner-benefits-district", "owner-benefits-usage-days"]) {
    assert.match(ownerBenefitsSource, new RegExp(`htmlFor="${id}"`));
    assert.match(ownerBenefitsSource, new RegExp(`id="${id}"`));
  }

  for (const id of [
    "partner-organization-name",
    "partner-type",
    "partner-business-location",
    "partner-contact-person",
    "partner-phone",
    "partner-message",
  ]) {
    assert.match(partnerSource, new RegExp(`htmlFor="${id}"`));
    assert.match(partnerSource, new RegExp(`id="${id}"`));
  }

  assert.match(forgotPasswordSource, /htmlFor="contact-input"/);
  assert.match(forgotPasswordSource, /id="contact-input"/);
});
