# Mobile Dark Mode, Home Performance, and Empty-State Spacing

## Scope

- Fixed dark-mode contrast regressions on mobile public pages where light-only CTA/form classes made content hard to read.
- Reduced home-page initial render work by rendering only the active hero image, deferring the homepage map until visible, and deferring the Material Symbols stylesheet.
- Delayed automatic home hero rotation until after the initial Core Web Vitals window while preserving manual carousel controls.
- Restored visible compact spacing between the `/rent-equipment?query=balers` empty-state support CTA and the shared footer.
- Removed duplicate lower page headings from `/renter-profile/bookings` and `/renter-profile/saved`; the workspace shell remains the title owner.

## Changed Surfaces

- `app/layout.tsx`
- `app/page.tsx`
- `app/rent-equipment/RentEquipmentView.tsx`
- `app/support/page.tsx`
- `app/faq/page.tsx`
- `app/feature-request/page.tsx`
- `app/terms/page.tsx`
- `app/register/page.tsx`
- `app/verify-contact/page.tsx`
- `components/renter-profile/RenterBookingsBoard.tsx`
- `components/profile/SavedListingsBoard.tsx`
- Contract tests under `tests/`

## Verification Evidence

- Targeted source contracts: `node --test tests/renter-profile-workspace-contracts.test.mjs tests/workspace-cleanup-ratings-contracts.test.mjs tests/production-hardening-contracts.test.mjs tests/live-site-fixes-contracts.test.mjs tests/dark-mode-visual-contracts.test.mjs`
- Local production build: `npm run build`
- Mobile dark-mode browser QA: `node /tmp/kk-mobile-dark-qa.mjs`
- Rent empty-state desktop/mobile spacing QA: `node /tmp/kk-rent-empty-spacing-qa.mjs`
- Lighthouse home mobile sample after final local build: performance 75, accessibility 90, best practices 100, SEO 100; FCP 1.5s, LCP 7.9s, Speed Index 1.5s, TBT 80ms, CLS 0.

## Notes

- Lighthouse still reports the home hero H1 as the LCP element. The deeper remaining opportunity is server/render timing for the above-the-fold home hero, not the previously loaded inactive hero image set or below-the-fold map script.
- Browser QA artifacts for this pass were kept outside the repo under `/tmp/` and are not canonical source files.
