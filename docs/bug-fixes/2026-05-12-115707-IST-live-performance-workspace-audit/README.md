# Live Performance And Workspace Audit

Date: 2026-05-12 11:57:07 IST

## Scope

This bundle records the live performance and workspace regression pass for the
production Kisan Kamai site. It covers:

- Live final-account E2E registration, OTP, password reset, listing, booking,
  owner/renter mode, and notification flows.
- Root-cause hardening for password reset completion when stale temporary phone
  records exist from production registration probes.
- Lighthouse accessibility, SEO, and performance findings for the home page and
  rent-equipment route.
- Source-level fixes for accessibility labels, canonical rent-equipment
  metadata, availability status semantics, and footer contrast.

## Root Cause

The first final-account E2E run failed during password reset completion:

```text
Run: 2026-05-12T06-09-54-749Z
Error: Password reset complete failed: {"ok":false,"error":"No Kisan Kamai account is linked to this verified mobile number."}
```

The registration UI probe can create temporary Firebase users with the final
test phone numbers before the seeded final test accounts are restored. Cleanup
deleted Auth users and identifier locks, but it only deleted Firestore
`users`/`profiles` docs for the known seeded UIDs. A stale temporary Firestore
profile could then match the phone number first during password reset
completion.

The fix has two parts:

- Password reset completion now resolves the verified user by decoded Firebase
  UID and compares that user's stored phone with the verified phone.
- Final-account cleanup now deletes every `users` and `profiles` document that
  matches the seeded test phones or emails, not only the seeded UID docs.

## Lighthouse Baseline

These reports were captured from `https://www.kisankamai.com` before the final
rollout in this pass and are stored under `generated/`.

| Report | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| home desktop | 92 | 86 | 100 | 100 | 0.7s | 1.6s | 0ms | 0.001 | 1.6s |
| home mobile | 78 | 86 | 100 | 100 | 1.7s | 4.5s | 50ms | 0 | 6.3s |
| rent desktop | 84 | 91 | 100 | 92 | 1.0s | 2.3s | 0ms | 0.004 | 1.8s |
| rent mobile | 88 | 91 | 100 | 92 | 1.6s | 3.7s | 40ms | 0 | 3.3s |

## Implemented Fixes

- Home page farmer-rating stars are hidden from assistive technology because
  they are decorative.
- Home page location select now has a stable accessible label.
- Header language switcher accessible name now includes the visible button
  text.
- Footer operating label contrast was improved.
- Public rent-equipment route now has route-specific metadata and canonical
  path metadata.
- Availability status dots with accessible labels now expose an image role.
- Password reset completion and final test cleanup are hardened against stale
  duplicate phone records.
- The home hero now serves a mobile-specific WebP source for the first LCP
  image while keeping the existing desktop visual treatment.

## Verification

Local verification completed before commit:

```text
node --test tests/final-hardening-contracts.test.mjs tests/firebase-runtime-contracts.test.mjs
Result: 15/15 passed

node --test tests/seo-contracts.test.mjs tests/cropin-motion-scalability-contracts.test.mjs tests/profile-listing-availability-contracts.test.mjs tests/live-site-fixes-contracts.test.mjs tests/final-hardening-contracts.test.mjs tests/firebase-runtime-contracts.test.mjs
Result: 51/51 passed

npm run verify
Result: passed, including 200/200 contract tests, lint, typecheck, and production build
```

Live final-account E2E passed after the cleanup hardening:

```text
Run: 2026-05-12T06-20-20-591Z
Result: passed
Coverage: registration probe, forgot-password request/complete, login after reset,
owner listing publish, own-listing booking block, renter booking, owner decline,
renter notification, renter-account owner listing, owner-account booking,
approval notification, route smoke checks, and cleanup
```

Post-deploy live verification results are recorded in the release message for
the final commit tied to this bundle.

## Remaining Performance Notes

Home mobile LCP and Speed Index should be watched across multiple production
runs because App Hosting response time and mobile network emulation can vary.
The first safe image-delivery fix in this bundle adds a mobile-specific hero
source; deeper improvements would require a broader home-page JavaScript and
rendering-sequence pass.
