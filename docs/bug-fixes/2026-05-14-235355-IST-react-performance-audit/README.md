# React Performance Audit

Date: 2026-05-14 23:53 IST

Scope: whole Kisan Kamai root app, with focused code changes on first-load bundle weight, route transition runtime, homepage image delivery, catalog filtering, and non-critical monitoring startup.

## Changes

- Deferred the global client performance monitor until browser idle time instead of importing it in the root layout during first hydration.
- Removed the global Leaflet stylesheet import from the root layout so map CSS stays with lazy map chunks.
- Replaced the global Framer Motion route-shell dependency with a CSS route-enter animation using the existing shared motion tokens.
- Made homepage generated asset references explicit WebP paths and paused the hero carousel while the tab is hidden or reduced motion is requested.
- Added responsive `sizes` hints to homepage category cards to stop mobile from downloading 750px card images for 364px layouts.
- Reused generated WebP assets in owner/renter workspace fallbacks and selected public marketing pages.
- Reduced repeated work in rent-equipment filtering and listing sorting by hoisting query-term arrays and the availability reference date.
- Updated the motion contract test so it verifies the lighter CSS route-shell path and the absence of `framer-motion` in that component.

## Verification

- `npm run test:contracts`: passed, 218/218.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run verify`: passed after the final image-size patch.
- `npm run launch:gate`: passed before the final image-size patch, including Firebase preflight dry run and workbook verification.

## Lighthouse Samples

Local production server:

- Initial route check: `/` returned 200 in 0.130846s, `/rent-equipment` returned 200 in 0.155190s.
- Browser: Puppeteer Chromium via `CHROME_PATH`.
- Command shape: `npx --yes lighthouse@latest <url> --chrome-flags="--headless=new --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --output=json`.

Mobile home before final category-card `sizes` patch:

- Performance 81, Accessibility 98, Best Practices 100, SEO 100.
- FCP 1.5s, LCP 4.8s, TBT 120ms, CLS 0.
- Total byte weight: 1,102 KiB.
- Image delivery savings: 352 KiB.

Mobile home after final category-card `sizes` patch:

- Performance 82, Accessibility 98, Best Practices 100, SEO 100.
- FCP 1.5s, LCP 4.8s, TBT 80ms, CLS 0.
- Total byte weight: 703 KiB.
- Image delivery savings: 38 KiB.

Mobile rent-equipment:

- Performance 85, Accessibility 98, Best Practices 100, SEO 100.
- FCP 1.7s, LCP 4.3s, TBT 30ms, CLS 0.
- Total byte weight: 544 KiB.

## Notes

- Root routes still build as dynamic because the app-level language/session/bootstrap behavior depends on request state. Converting that safely would require a separate architecture pass.
- The remaining mobile LCP ceiling is mostly render timing under Lighthouse throttling, not TTFB or layout shift. TTFB was about 20ms in local production samples.
