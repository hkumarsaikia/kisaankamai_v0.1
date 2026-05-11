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

The codebase has equipment categories and live listing data, but it does not yet
have enough differentiated content, routing depth, or editorial data to support
large-scale location/category programmatic SEO pages safely.

For now, improve existing public pages and live equipment detail pages. Do not
generate thin category-location pages until there is a data-rich template with
unique local value, internal linking, and a quality review path.

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
```

Use Lighthouse SEO checks for rendered validation when Chrome is available.
