# Share Previews, Cache Freshness, and Disclaimer Alignment

## Scope

- Centered the Important Disclaimer card copy on `/how-it-works`.
- Moved public route share previews to App Router metadata exports so crawlers
  receive page-specific titles, descriptions, canonical URLs, and images.
- Added route-specific 1200x630 share thumbnails under
  `public/assets/share/pages/`.
- Added deployment-versioned share image URLs so social crawlers receive a new
  thumbnail URL after each rollout.
- Added explicit HTML and share-image freshness headers in `next.config.mjs`.

## Why

Live checks showed several public routes still emitted homepage metadata even
though they had `head.tsx` files. Those `head.tsx` files were not enough for the
current App Router build, so external previews could reuse the generic homepage
title/image and social platforms could keep stale preview data.

## Cache Behavior

HTML routes are served with no-store freshness headers. Social platforms also
cache previews on their side, so the safer long-term fix is stable page metadata
plus a deployment-version query on `og:image` and Twitter image URLs.

## Verification Plan

Run:

```bash
npm run test:contracts
npm run verify
npm run launch:gate
```

Then smoke-check live metadata:

```bash
curl -fsS https://www.kisankamai.com/support | grep -E "og:title|og:image|twitter:description"
curl -fsS https://www.kisankamai.com/owner-benefits | grep -E "og:title|og:image|canonical"
curl -I https://www.kisankamai.com/owner-benefits
```
