# Performance And Dark-Mode QA

## Scope

Checked live and local production rendering for public performance and dark-mode visibility regressions.

## Root Causes

- `/forgot-password` used `text-on-primary` over an image overlay. In dark mode that token resolves to a dark green foreground, making the lower brand copy nearly invisible on desktop.
- The forgot-password phone icon and support urgent-call icon also used light-mode icon tokens that fell below readable contrast in dark mode.
- The self-hosted Material Symbols font shipped as a full 453 KB WOFF2 even though the app uses a limited icon set.
- Runtime Google Fonts preconnects remained after the app moved to self-hosted Next fonts and a local Material Symbols font.
- The Marathi Mukta font was preloaded with five weights, making multiple Devanagari files compete with above-the-fold route content on first load.

## Changes

- Changed the `/forgot-password` image-panel brand copy to stable `text-white`.
- Added dark-mode icon colors for the forgot-password phone field and the support urgent-call card.
- Replaced `public/fonts/material-symbols-outlined.woff2` with a subset generated from the active Material Symbols icon set.
- Removed unused Google Fonts runtime preconnects from the root layout.
- Reduced Mukta to `400`, `600`, and `700` and disabled eager preload so Marathi still renders correctly without forcing every weight into the first critical wave.
- Added contracts for the forgot-password contrast token, subset font size, and lean root font setup.

## Verification

- `npm run test:contracts`: passed, 209/209.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- Local production rendered dark-mode and icon sweep:
  - Mobile and desktop routes checked: `/`, `/rent-equipment`, `/rent-equipment?query=balers`, `/support`, `/owner-benefits`, `/login`, `/register`, `/forgot-password`, `/forgot-password/new-password`, `/terms`, `/feature-request`, `/coming-soon`, `/profile-selection`.
  - Result: no serious dark-mode contrast failures and `badIcons=0`.
- Live rendered dark-mode and icon sweep after deploy:
  - Mobile and desktop routes checked: `/`, `/forgot-password`, `/rent-equipment`, `/rent-equipment?query=balers`, `/support`, `/owner-benefits`, `/profile-selection`.
  - Result: `200` responses, `iconFont=true`, `badIcons=0`, `lows=0`, and no page or console errors.

## Lighthouse Evidence

Baseline live samples before this local patch:

- Home mobile: performance 68, accessibility 98, best practices 100, SEO 100.
- Rent-equipment mobile: performance 85, accessibility 98, best practices 100, SEO 100.

Local production samples after the patch:

- Home mobile: performance 80, accessibility 98, best practices 100, SEO 100.
- Rent-equipment mobile: performance 82, accessibility 98, best practices 100, SEO 100.

Live samples after deployment:

- Home mobile: performance 86, accessibility 98, best practices 100, SEO 100; FCP 1.7s, LCP 3.5s, CLS 0, TBT 200ms.
- Rent-equipment mobile: performance 84, accessibility 98, best practices 100, SEO 100; FCP 1.8s, LCP 2.7s, CLS 0, TBT 150ms.

Notes:

- Local `/rent-equipment` performance is slightly lower than the live baseline sample because Lighthouse samples vary by run and environment, but the heavy Material Symbols payload no longer appears in top network costs.
- The remaining performance bottleneck is mostly route JavaScript and server/render timing, not dark-mode CSS or the icon font.
