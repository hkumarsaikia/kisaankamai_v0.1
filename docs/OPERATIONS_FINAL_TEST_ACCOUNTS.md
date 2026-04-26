# Final Test Accounts

## Purpose

The final test account tooling creates two deletable Firebase Auth + Firestore accounts and consolidates the current fixture data under them:

- one owner
- one renter

The account plan lives in `data/final-test-accounts-manifest.json`.

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

## Test OTP Configuration

Firebase does not expose fictional phone-number setup through the repo scripts. Add these two numbers manually in Firebase Console > Authentication > Sign-in method > Phone > Phone numbers for testing:

- `+91 90000 00101` -> `111111`
- `+91 90000 00102` -> `222222`

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
