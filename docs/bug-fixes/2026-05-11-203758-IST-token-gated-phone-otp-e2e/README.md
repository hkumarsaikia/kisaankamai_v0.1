# Token-Gated Phone OTP E2E

## Scope

Complete the remaining live public registration OTP verification gap without
weakening normal production registration.

## Root Cause

Firebase web phone auth correctly showed a real Google reCAPTCHA challenge on
the live production site. That is required for real public phone numbers and
cannot be bypassed by automation without using Firebase's fictional phone number
test mode.

## Fix

- Added `/api/auth/phone-test-mode`.
- The route returns test-mode access only for configured final-account fictional
  phone numbers and only when the E2E browser supplies a token matching either
  the optional `KK_PHONE_AUTH_TEST_MODE_TOKEN` or a token derived from the
  existing Firebase Admin private key.
- Updated the register page to request that gated decision before rendering
  Firebase reCAPTCHA.
- Updated the Firebase auth client so `appVerificationDisabledForTesting` can be
  enabled per verified test registration attempt instead of globally.
- Added `npm run firebase:phone-test-numbers` to configure Firebase Auth
  fictional phone numbers through the Identity Toolkit Admin API.
- Updated the live final-account E2E harness to inject the local matching token
  into the browser session for the public registration probe.
- Expanded final test account cleanup so it removes Firebase Auth users by the
  manifest UID, phone number, and email. The public registration probe can
  create Firebase-assigned UIDs, and those must be removed before deterministic
  seeding recreates the final accounts with manifest UIDs.

## Safety Boundary

Real users still use the normal Firebase phone verification path. Do not set
`NEXT_PUBLIC_PHONE_AUTH_TEST_MODE=true` on production because that is a broad
client-side switch.

## Verification

The release verification output for this folder should include:

- `npm run firebase:phone-test-numbers -- --dry-run`
- `npm run firebase:phone-test-numbers`
- `npm run test:contracts`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run verify`
- `npm run launch:gate`
- `npm run live:e2e:final-accounts`
