# Dark Mode, Equipment Detail, and Booking Form Fixes

Date: 2026-05-13 16:18 IST

## Scope

- Improved dark-mode contrast for the partner ecosystem cards, coming-soon mobile app card, owner-benefits usage slider, and equipment sort menu.
- Reduced the equipment detail owner card width and normalized owner location labels so repeated city/district values collapse and Maharashtra is shown.
- Added the shared flow spinner to the equipment booking submit button.
- Made the unauthenticated booking toast use the red error treatment.
- Removed requested empty-state helper copy from owner browse, owner bookings, renter dashboard/bookings.
- Centered the `Always verify machine condition before paying.` warning line and Google Maps scroll overlay text.

## Verification

- `npm run test:contracts`
- `npm run verify`
- `npm run launch:gate`
- Local Playwright render QA on:
  - `/equipment/listing-5f554029`
  - `/how-it-works`
  - `/coming-soon`
  - `/partner`
  - `/owner-benefits`

## Rendered QA Notes

- Equipment owner card rendered at 358px wide on a 390px mobile viewport.
- Owner location rendered as `Pune, Maharashtra`.
- Booking submit rendered `.kk-flow-spinner` during submission.
- Unauthenticated booking toast rendered with `.kk-login-toast-error`.
- How-it-works warning rendered with `display: flex`, `justify-content: center`, and `text-align: center`.
- Dark mode boot path rendered readable coming-soon, partner, and owner-benefits surfaces.
