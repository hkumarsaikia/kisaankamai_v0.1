# Live Site Performance and QA Fixes

Date: 2026-05-10 21:18:59 IST

## Scope

- Reduced live homepage render weight from the generated marketing imagery.
- Reduced the Material Symbols payload by requesting only icon glyphs used by the app.
- Prevented repeated browser QA/page traversal from flooding `/api/bug-reports`.
- Removed remaining inline English/Marathi slash copy from the public support form.
- Deferred the authenticated session resolver on public requests that do not carry a session cookie.

## Source Fixes

- `lib/site.ts` maps `/assets/generated/*.png` marketing references to matching `.webp` files.
- `public/assets/generated/*.webp` contains optimized versions of the generated visual assets.
- `app/layout.tsx` uses a narrowed Material Symbols `icon_names` request with `display=block`.
- `app/layout.tsx` dynamically imports the Firebase-backed session resolver only when `kisan_kamai_session` exists.
- `lib/client/bug-reporting.ts` stores the client report budget in `localStorage` so full-page navigations and multi-route QA share the same client-side rate limit.
- `app/support/page.tsx` uses `langText(...)` instead of visible mixed-language slash labels.

## Verification Targets

- `npm run test:contracts`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run verify`
- Puppeteer broad-route audit across public routes and protected unauthenticated redirects.
- Lighthouse homepage comparison after deploy for image/font transfer reduction.

## Local Evidence Captured

- `lighthouse-home-local-final.json`
- Local Lighthouse categories: performance 71, accessibility 87, best practices 100, SEO 100.
- Local Lighthouse metrics: FCP 1.8s, LCP 9.0s, Speed Index 4.1s, TBT 140ms, CLS 0, root document 140ms.
- Local transfer weight after fixes: 1,933 KiB.
- Direct `hero_tractor.png` icon/manifest download removed from Lighthouse byte-weight results.
- Material Symbols CSS plus font dropped to a small subset request: 1,074 bytes CSS transfer and 17,645 bytes font transfer in the final local Lighthouse run.
- Puppeteer broad-route audit: 76 public route/state combinations, 15 protected routes, 0 failures, 0 warnings, 0 `/api/bug-reports` 429 responses, and all generated route images resolved as WebP.
