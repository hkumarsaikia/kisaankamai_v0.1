# Google Sheets Operations

## Contract

- Firebase remains the source of truth.
- Google Sheets is a best-effort operational mirror only.
- Sheets failures must never block a successful Firebase write.

The workbook schema lives in `data/operational-sheets-workbook.json`.

## Form Email Notifications

Form rows in `support_requests`, `booking_requests`, and `feedback` include:

- `notification_email_to`
- `notification_email_status`
- `notification_email_sent_at`

The live app writes `notification_email_to=hkumarsaikia@gmail.com` and
`notification_email_status=pending`. A bound Google Sheets Apps Script then
sends the actual email from the spreadsheet owner context, which is the only
supported way to get the "from the sheet" sender behavior requested for this
workflow.

Apps Script source lives in `scripts/google-sheets-apps-script/Code.gs`.

Install it on the production workbook:

1. Open the Google Sheet from `GOOGLE_SHEET_ID`.
2. Go to Extensions -> Apps Script.
3. Paste `scripts/google-sheets-apps-script/Code.gs`.
4. Run `installKisanKamaiEmailTrigger` once and approve permissions.
5. Run `sendPendingKisanKamaiNotifications` once to flush pending rows.

The generated email explains the source sheet, row number, row fields, and form
details so the receiver knows where the update happened and what request needs
attention.

## Required Env

- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

The scripts also accept `--sheet-id` when you need to override the env workbook.

Local tooling now prefers the App Hosting `GOOGLE_SHEET_ID` from `apphosting.yaml` when it is present, so the repo uses the same workbook locally and in production unless you explicitly override it.

## Commands

Bootstrap the workbook structure, headers, filters, widths, and conditional rules:
It also applies frozen headers, banding, tab colors, row height, and typed
numeric/date formatting.

```bash
npm run sheets:bootstrap
```

Verify the workbook matches the manifest:

```bash
npm run sheets:verify
```

Backfill the replace-mode tabs from Firestore:

```bash
npm run sheets:backfill
```

## Tabs

The operational workbook now includes:

- `workbook_meta`
- `owners`
- `renters`
- `listings`
- `bookings`
- `payments`
- `saved_items`
- `support_requests`
- `booking_requests`
- `feedback`
- `bug_reports`
- `auth_events`
- `sync_audit`

## Backfill Scope

`google-sheets-backfill.mjs` replaces the Firestore-backed tabs from live data and preserves the sheet-native log tabs:

- Replaced: owners, renters, listings, bookings, payments, saved_items, support_requests, booking_requests, feedback, bug_reports
- Preserved: auth_events, sync_audit

Those preserved tabs are not rebuilt from Firebase because they are append-only operational logs that currently live in Sheets.

## Notes

- The live server mirror now writes richer row shapes, typed numeric cells, stronger headers, filters, and status-based conditional styling.
- `booking_requests` is now a first-class sheet instead of being lost inside generic submission payloads.
- `feature-request` submissions are visible in `support_requests` with subject, urgency, location, and message columns plus the full payload JSON.
- `saved_items` is backfilled from Firestore even though the live runtime does not currently append every saved-item toggle into Sheets.
