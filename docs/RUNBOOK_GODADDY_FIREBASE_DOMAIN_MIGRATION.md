# GoDaddy To Firebase Domain Migration Runbook

## Status

Deferred. Do not execute this runbook until:

- the live repo URL is known
- the root app release is approved
- the operational workbook bootstrap and verify steps are green

## Preflight

1. Confirm the exact Firebase App Hosting site/project that owns the root app deployment.
2. Confirm who controls the GoDaddy DNS zone for the production domain and `www`.
3. Lower the existing GoDaddy DNS TTL ahead of the cutover window if the current records allow it.
4. Capture the current GoDaddy DNS zone as a rollback snapshot.
5. Run `npm run repo:sync-live -- --repo-url "<git-url>" --branch main` and save the result.
6. Run `npm run sheets:verify` so the operational workbook is current before the cutover.

## Firebase Side

1. Open the Firebase console for the production project.
2. Start the custom domain flow for the root App Hosting site.
3. Add the apex domain and `www` if both are required.
4. Copy the exact verification and routing records Firebase generates.

Do not guess the DNS records ahead of time. Use the console-generated values for the specific project and date of migration.

## GoDaddy Side

1. Remove or replace the current apex and `www` records only after the Firebase domain flow is ready.
2. Add the Firebase-provided TXT/CNAME/A/AAAA records exactly as issued.
3. Avoid mixing old parking/forwarding records with the new Firebase records.
4. Wait for Firebase domain verification and certificate provisioning to complete.

## Validation

1. Check both the apex domain and `www`.
2. Confirm HTTPS certificate issuance.
3. Confirm the root app resolves correctly on both the apex domain and `www`.
4. Validate login, listing read paths, booking flows, and at least one Sheets-backed write path.
5. Re-run `npm run repo:sync-live -- --repo-url "<git-url>" --branch main`.
6. Re-run `npm run sheets:verify`.

## Rollback

If the cutover fails:

1. Restore the prior GoDaddy DNS snapshot.
2. Remove the incomplete Firebase custom domain mapping if it is blocking re-validation.
3. Recheck apex and `www` resolution after propagation.
4. Record the failure reason in the operational workbook `sync_audit` tab once Sheets access is stable again.
