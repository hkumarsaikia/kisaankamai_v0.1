# Live Final Account E2E

## Scope

Live website verification for the two dedicated final test accounts on `https://www.kisankamai.com`.

## Root Cause Found

The final-test cleanup helper removed Firebase Auth users, Firestore users, profiles, fixture listings, bookings, payments, and saved items, but it did not remove the matching `auth-identifiers` reservation documents. After cleanup, the same final test phone/email could still be rejected by registration preflight as already reserved.

## Fix

- Added `auth-identifiers` cleanup for the final owner and renter test accounts.
- Seed now also writes the matching phone/email reservation documents so seeded accounts match production registration constraints.
- Added `npm run live:e2e:final-accounts` for repeatable live owner/renter testing.

## Live E2E Result

Run ID: `2026-05-11T14-26-02-337Z`

Passed:

- Forgot-password request and reset completion for the owner test account.
- Login after reset-password change.
- Owner published a live listing with three photos.
- Same owner in renter mode could not book their own listing.
- Renter booked the owner's listing.
- Owner received the booking request notification.
- Renter received the booking request sent notification.
- Owner declined the pending booking.
- Renter received the booking declined notification.
- Renter account switched to owner mode and published its own listing with three photos.
- Owner account switched to renter mode and booked the renter-owned listing.
- Renter-as-owner approved the booking.
- Owner-as-renter received the approved booking notification.
- Temporary live listings/bookings/submissions/notifications from the run were cleaned up.

Expected manual step:

- Full public registration with Firebase phone OTP stopped at the real Google reCAPTCHA image challenge in the browser. That is expected for the production live site and should be completed manually or in Firebase test mode, not bypassed in automation.

## Evidence

- `live-e2e-summary.json`
- `register-owner-recaptcha.png`
- `owner-own-listing-blocked.png`
- `renter-booked-owner-listing.png`
