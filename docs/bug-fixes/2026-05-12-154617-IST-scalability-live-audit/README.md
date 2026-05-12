# Live Scalability Audit

Request: check whether the live website scales properly across frontend, backend, and UI/UX, then fix verified issues.

## Evidence

- Live Lighthouse mobile checks:
  - `/`: performance 69, accessibility 98, best practices 100, SEO 100, CLS 0, LCP 7.0s.
  - `/rent-equipment`: performance 89, accessibility 98, best practices 100, SEO 100, CLS 0, LCP 3.7s.
  - `/rent-equipment?query=balers`: performance 97, accessibility 98, best practices 100, SEO 100, CLS 0.016, LCP 2.2s.
- Live public UI scan covered desktop/mobile and light/dark on `/`, `/rent-equipment`, `/rent-equipment?query=balers`, `/support`, `/owner-benefits`, `/forgot-password`, and `/profile-selection`.
  - 28 route/theme/viewport combinations checked.
  - No route failures, horizontal overflow, icon-font fallback, obvious inline English/Marathi slash strings, or console/page errors were found.
- Post-deploy live public UI scan repeated the same 28 route/theme/viewport combinations after the App Hosting rollout and found no problems.

## Backend Scaling Fix

The owner/renter workspace booking pages previously enriched user-specific bookings by reading every listing and every profile before filtering in memory. That pattern grows poorly as the marketplace adds listings and users.

Changed `lib/server/firebase-data.ts` so:

- `getOwnerBookings()` fetches the owner bookings first, then only the listing IDs and renter profile IDs referenced by those bookings.
- `getRenterBookings()` fetches the renter bookings first, then only the listing IDs and owner profile IDs referenced by those bookings.
- `getRenterSavedListings()` fetches the renter saved rows first, then only the saved listing IDs.
- Targeted profile/listing document reads are chunked in groups of 50 to avoid a large unbounded `Promise.all()` burst for users with a long booking or saved-equipment history.

This preserves the existing UI data shape while reducing Firestore reads on workspace pages from global collection scans to user-related document reads.

## Guardrail

`tests/cropin-motion-scalability-contracts.test.mjs` now checks that workspace booking enrichment keeps using targeted listing/profile fetches and does not regress to global listing/profile scans.

## Remaining Observation

Home mobile LCP is still the largest frontend opportunity. The route has zero CLS and low main-thread blocking, so the remaining cost is mainly first-view render/image timing and root document latency. This was not changed in this pass because the safe, behavior-preserving fix found in the audit was the backend workspace read pattern.
