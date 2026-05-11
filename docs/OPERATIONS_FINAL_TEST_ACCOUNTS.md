# Final Test Accounts

## Purpose

The final test account tooling creates two deletable Firebase Auth + Firestore accounts and consolidates the current fixture data under them:

- one owner
- one renter

The account plan lives in `data/final-test-accounts-manifest.json`.

Do not commit real passwords or OTP notes. The local helper guide
`FINAL_TEST_ACCOUNT_LOGIN_GUIDE.md` is intentionally ignored by Git; keep
actual credentials in local-only files, password manager notes, or runtime logs
under `logs/runtime/final-test-accounts/`.

## Seed

```bash
npm run seed:final-test-accounts -- --owner-password "<password>" --renter-password "<password>"
```

You can also provide:

- `KK_FINAL_TEST_OWNER_PASSWORD`
- `KK_FINAL_TEST_RENTER_PASSWORD`

Dry-run:

```bash
npm run seed:final-test-accounts -- --dry-run --owner-password "<password>" --renter-password "<password>"
```

## Cleanup

```bash
npm run cleanup:final-test-accounts
```

Dry-run:

```bash
npm run cleanup:final-test-accounts -- --dry-run
```

Cleanup removes the dedicated Firebase Auth users, Firestore users, profiles,
fixture listings, bookings, payments, saved items, and the matching
`auth-identifiers` reservations for the final account phone numbers and emails.
Keep that identifier cleanup in place so the same final test contacts can be
used again for registration probes after a full reset.

## Live Owner/Renter E2E

```bash
npm run live:e2e:final-accounts
```

The live E2E script targets `https://www.kisankamai.com` by default and uses
the dedicated final owner/renter accounts. It cleans previous final-test state,
seeds the accounts, exercises password reset, login, owner listing publish with
three photos, own-listing booking prevention, renter booking, owner decline,
role switching, reciprocal owner/renter booking, approval, in-app notification
records, protected/public route smokes, and then removes the temporary live
E2E listings/bookings/submissions/notifications it created.

Use `KK_LIVE_E2E_BASE_URL` only when intentionally pointing the run at another
deployed host. The script reads passwords from
`KK_FINAL_TEST_OWNER_PASSWORD`/`KK_FINAL_TEST_RENTER_PASSWORD` or from the
ignored `logs/runtime/final-test-accounts/latest-seed.json` file.

Production public registration still uses Google's real Firebase reCAPTCHA
challenge before phone verification. Complete that one browser step manually for a true
public signup check, or use Firebase phone-number test mode in a controlled
non-production environment. Do not bypass the production CAPTCHA in automation.

For production-safe live automation of the public registration page, use the
token-gated fictional-number path:

```bash
npm run firebase:phone-test-numbers
npm run live:e2e:final-accounts
```

`npm run firebase:phone-test-numbers` ensures the final owner/renter fictional
phone numbers and OTP codes are configured in Firebase Auth. The live register
page then asks `/api/auth/phone-test-mode` whether Firebase app verification may
be disabled for that specific phone number. The route returns `enabled: true`
only when all conditions are true:

- the phone is one of the configured final test phone numbers
- the E2E browser supplies the matching token in `kk_phone_auth_test_token`
- the token matches either `KK_PHONE_AUTH_TEST_MODE_TOKEN` or the token derived
  from the existing Firebase Admin private key

This keeps real public registration on the normal Firebase phone verification path
while allowing deterministic full registration OTP automation for the dedicated
test accounts.

## Test OTP Configuration

The repo can configure these through the Identity Toolkit Admin API:

```bash
npm run firebase:phone-test-numbers -- --dry-run
npm run firebase:phone-test-numbers
```

If the API credentials do not have permission to patch Identity Toolkit config,
add these two numbers manually in Firebase Console > Authentication > Sign-in
method > Phone > Phone numbers for testing:

- `+91 90000 00101` -> `123456`
- `+91 90000 00102` -> `123456`

These values match `data/final-test-accounts-manifest.json`. The latest local seed summary, including the seeded emails and passwords you used, is written to `logs/runtime/final-test-accounts/latest-seed.json`.

## What Gets Seeded

- 2 user docs
- 2 profile docs
- 3 paused fixture listings reassigned to the final owner
- 5 fixture bookings reassigned to the final owner and final renter
- 4 payments whose source bookings exist in the imported fixture set
- 2 saved items reassigned to the final renter

Seeded fixture listings are deliberately paused so test/demo equipment does not appear on public rent-equipment, equipment-detail, or category pages. Use real owner-created active listings for public marketplace validation.

## Pause Known Mock Listings

If legacy mock listing docs already exist in Firestore, pause them instead of deleting them:

```bash
npm run pause:mock-listings -- --dry-run
npm run pause:mock-listings
```

The script targets the known legacy IDs only: `2`, `4`, `5`, `ft-listing-2`, `ft-listing-4`, and `ft-listing-5`.

## Known Fixture Gaps

Some fixture payments are intentionally skipped because the source fixture set contains payment rows whose booking IDs do not exist in `data/bookings.json`. The seed script reports those skipped payment IDs in dry-run and live execution output instead of inventing synthetic bookings.

## Recommended Follow-up

After seeding or cleanup, run:

```bash
npm run sheets:backfill
```

That refreshes the operational workbook so the Sheets mirror reflects the new Firebase state.
