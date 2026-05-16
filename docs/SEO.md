# SEO Operations

Kisan Kamai uses the root Next.js App Router metadata layer as the source of
truth for crawlable page metadata, canonical URLs, Open Graph/Twitter previews,
robots output, sitemap output, and site-level JSON-LD.

## Installed Skills

The repository includes the requested local skills under `.agents/skills/`:

- `seo-audit`
- `programmatic-seo`

Use them for future SEO reviews before changing route metadata, large public
copy sections, sitemap behavior, or programmatic page plans.

## Metadata Contract

- Keep public page titles specific and branded.
- Use `buildPageMetadata(...)` or `renderHeadMetadata(...)` from
  `lib/site-metadata.tsx` so titles, canonical URLs, share metadata, and
  optional `noIndex` behavior stay consistent.
- For App Router page bodies that are client components, expose route metadata
  from a colocated `layout.tsx` and `lib/public-page-metadata.ts`. Do not rely
  on `head.tsx` alone for social previews.
- Give public routes a page-specific `imagePath` under `public/assets/share/`
  so WhatsApp, Telegram, X, LinkedIn, Instagram, and other crawlers receive a
  relevant thumbnail instead of the homepage fallback.
- Share image URLs are deployment-versioned with `?v=...` from
  `NEXT_PUBLIC_SHARE_CACHE_VERSION`, `K_REVISION`, build IDs, or `v1`. This
  gives social crawlers a fresh image URL after each hosting rollout.
- `BuildFreshnessMonitor` compares the page's initial build revision with
  `/api/build-info` on focus, visibility change, and interval checks. If a user
  keeps an old tab open during a Firebase App Hosting rollout, the browser
  reloads when the live revision changes.
- Mark auth, account, workspace, utility, and submission-only routes as
  `noIndex`.
- Keep public descriptions factual. Do not add unsupported rankings,
  testimonials, payout claims, traffic numbers, certifications, guarantees, or
  inflated availability claims.

## Crawl Policy

`app/sitemap.ts` should include only indexable public routes and public live
equipment detail URLs. Do not add login, registration, profile, workspace,
utility, or API routes to the sitemap.

`app/robots.ts` should keep API and protected workspace areas disallowed while
allowing public marketing and marketplace discovery pages.

## Structured Data

`app/layout.tsx` emits site-level JSON-LD for:

- `WebSite`
- `Organization`
- `SearchAction` targeting `/rent-equipment?query=...`

Only add more schema when the facts are already present in the product and can
be kept accurate. Avoid schema for claims the site does not visibly support.

## Programmatic SEO Assessment

Detailed pSEO strategy and deferred route thresholds live in
`docs/PROGRAMMATIC_SEO.md`.

The catalog compatibility route is:

```text
/catalog/[slug] -> /rent-equipment?query=<slug>
```

`/catalog/[slug]` is not an indexable category landing page. It remains a
redirect-only surface so old/shared category URLs open the same live marketplace
search that users saw before the May 16 programmatic SEO experiment.

Do not reintroduce indexable catalog category pages, category-location pages, or
bulk keyword routes until every planned page has enough first-party inventory,
reviewed local copy, and useful local data to avoid thin or duplicate content.
If those pages are introduced later, ship them behind an explicit quality gate
and index only pages that meet the minimum data threshold.

## Verification

Before releasing SEO changes, run:

```bash
npm run test:contracts
npm run verify
npm run launch:gate
```

After deployment, smoke-check:

```bash
curl -fsS https://www.kisankamai.com/ | grep -E "<title>|application/ld\\+json"
curl -fsS https://www.kisankamai.com/robots.txt
curl -fsS https://www.kisankamai.com/sitemap.xml
curl -fsSI https://www.kisankamai.com/catalog/tractors | grep -Ei "HTTP/|location:"
curl -fsS https://www.kisankamai.com/support | grep -E "og:title|og:image|twitter:description"
curl -fsS https://www.kisankamai.com/api/build-info
```

Use Lighthouse SEO checks for rendered validation when Chrome is available.
