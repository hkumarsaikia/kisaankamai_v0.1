# Maps, Registration, Logo, Backend Discord Notifications

## Scope

- Center Google Maps scroll-hint overlay text across all map embeds.
- Remove identity verification from the public registration form.
- Replace the text-only site mark with the supplied Kisan Kamai tractor logo in the shared header, footer, favicon, and manifest path.
- Add the India flag marker to the global footer copyright line.
- Extend the shared page-transition loader to programmatic route changes used in profile/workspace flows.
- Add env-driven backend activity notifications for registration, login/session, logout, profile updates, listings, bookings, and public form submissions.
- Remove the two live test/customer equipment records and linked bookings/payments/submissions/storage objects requested by screenshot review.

## Data Cleanup

Deleted Firestore/Storage records:

- `listing-5f554029` (`674`)
- `listing-71d16950` (`Codex E2E Tractor 1777793737846`)

Linked records removed:

- 2 bookings
- 2 payment mirrors
- 2 form-submission mirrors
- 4 listing images

## Backend Discord Configuration

Runtime code reads the backend notification webhook from:

- `DISCORD_WEBHOOK_BACKEND_URL`
- fallback: `DISCORD_WEBHOOK_BACKEND_NOTIFICATION_URL`

The real webhook URL is intentionally not committed. App Hosting injects
`DISCORD_WEBHOOK_BACKEND_URL` from the Secret Manager secret named
`discordWebhookBackendUrl` at runtime only, and the secret access grant was
applied to the App Hosting compute service account at the project IAM level
with `roles/secretmanager.secretAccessor`.

## Verification Checklist

- `npm run typecheck`: passed
- `npm run test:contracts`: passed, 215/215 contracts
- `npm run lint`: passed
- `npm run build`: passed
- `npm run verify`: passed
- `npm run launch:gate`: passed, including Firebase preflight, Firestore/Storage dry run, and workbook verification
- `npm run sheets:backfill`: passed; workbook mirror updated after the listing deletion
- Local rendered QA: passed with Playwright using `/usr/bin/google-chrome`
- `gcloud projects add-iam-policy-binding gokisaan --member=serviceAccount:firebase-app-hosting-compute@gokisaan.iam.gserviceaccount.com --role=roles/secretmanager.secretAccessor --condition=None`: passed

Rendered QA covered:

- `/`: shared logo appears in header/footer, footer shows India flag, Material Symbols font is ready, route history patch is active.
- `/register`: identity verification document UI is absent and the mobile number field remains present.
- `/about`: Material Symbols render with the self-hosted font instead of visible ligature words.
- `/rent-equipment?query=balers`: deleted listings are absent and the no-equipment support button has healthy footer spacing.

Artifacts:

- `local-rendered-qa.json`
- `screenshots/home-logo-footer.png`
- `screenshots/register-no-identity.png`
- `screenshots/about-icons.png`
- `screenshots/rent-empty-spacing.png`
