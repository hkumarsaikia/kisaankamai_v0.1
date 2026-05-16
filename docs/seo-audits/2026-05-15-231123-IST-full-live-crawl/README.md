# Kisan Kamai Full Live SEO Crawl Audit

This folder contains the SEOmator full-crawl evidence for the production site audit on 2026-05-15/16 IST. The final after-crawl was run after deploying commit `980365d930985f34d009534f28b53806f2130f9c` to Firebase App Hosting.

## Commands

```bash
npx -y @seomator/seo-audit@3.0.1 self doctor -v
npx -y @seomator/seo-audit@3.0.1 audit https://www.kisankamai.com --crawl --max-pages 100 --concurrency 4 --timeout 60000 --format json --output baseline-crawl.json --refresh --verbose
npm run verify
npm run launch:gate
firebase apphosting:rollouts:create kisankamai-web-backend --project gokisaan --git-commit 980365d930985f34d009534f28b53806f2130f9c --force
npm run firebase:deploy
npx -y @seomator/seo-audit@3.0.1 audit https://www.kisankamai.com --crawl --max-pages 100 --concurrency 4 --timeout 60000 --format json --output after-crawl.json --refresh --verbose
```

## Before vs After

| Metric | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Overall score | 96 | 97 | +1 |
| Crawled pages | 26 | 26 | +0 |
| Total issues | 967 | 826 | -141 |
| Failures | 132 | 55 | -77 |
| Warnings | 835 | 771 | -64 |

## Largest Rule Deltas

- warn:crawl-canonical-redirect: 11 -> 0 (-11)
- warn:crawl-sitemap-domain: 11 -> 0 (-11)
- fail:links-broken-internal: 11 -> 0 (-11)
- fail:perf-response-time: 21 -> 10 (-11)
- warn:security-https-redirect: 11 -> 0 (-11)
- warn:core-description-length: 22 -> 12 (-10)
- warn:cwv-fcp: 14 -> 4 (-10)
- fail:technical-404-page: 10 -> 0 (-10)
- fail:technical-robots-txt-exists: 10 -> 0 (-10)
- fail:technical-robots-txt-valid: 10 -> 0 (-10)
- fail:technical-sitemap-exists: 10 -> 0 (-10)
- warn:technical-sitemap-valid: 10 -> 0 (-10)
- fail:cwv-lcp: 7 -> 1 (-6)
- warn:perf-response-time: 5 -> 11 (+6)
- fail:a11y-form-labels: 5 -> 0 (-5)
- warn:content-description-pixel-width: 0 -> 4 (+4)
- warn:content-duplicate-near: 10 -> 7 (-3)
- warn:a11y-aria-labels: 2 -> 0 (-2)
- warn:cwv-ttfb: 13 -> 11 (-2)
- warn:a11y-form-labels: 1 -> 0 (-1)
- warn:a11y-heading-order: 24 -> 23 (-1)
- warn:content-broken-html: 7 -> 6 (-1)
- fail:content-description-pixel-width: 1 -> 0 (-1)
- fail:content-duplicate-near: 11 -> 10 (-1)
- warn:content-heading-hierarchy: 25 -> 24 (-1)

## Files

- `baseline-crawl.json`, `baseline-crawl.log`, `baseline-issues-summary.md`: original production crawl.
- `after-crawl.json`, `after-crawl.log`, `after-issues-summary.md`: post-fix production crawl.
- `before-after-summary.json`: machine-readable comparison.
- `live-robots-*`, `live-sitemap-*`, `live-home-*`: crawl-time snapshots.

## Remaining Manual Review

- Response-time and Core Web Vitals warnings remain dependent on production server/image timing and need deeper infrastructure and media sequencing work.
- SEOmator still reports some duplicate or thin-content warnings around shared route templates and filtered marketplace experiences; avoid creating low-value duplicate pages and monitor Search Console coverage.
- SEOmator still reports `content-meta-in-body` on one equipment detail URL (`/equipment/listing-042f5960`). A crawler HTML check also shows streamed dynamic metadata after `<body>` on equipment detail pages, so this remains the safest manual-review item for future Next.js metadata work.
