# Google Sheets Operations

## Contract

- Firebase remains the source of truth.
- Google Sheets is a best-effort operational mirror only.
- Sheets failures must never block a successful Firebase write.

The workbook schema lives in `data/operational-sheets-workbook.json`.

## Form Email Notifications

Form rows in `support_requests`, `booking_requests`, `newsletter_subscriptions`,
`coming_soon_notifications`, and `feedback` include:

- `notification_email_to`
- `notification_email_status`
- `notification_email_sent_at`

The live app writes `notification_email_to=hkumarsaikia@gmail.com` and
`notification_email_status=pending`. Email delivery is handled only by the
optional bound Google Sheets Apps Script when that script is installed and
authorized by the workbook owner.

Apps Script source lives in `scripts/google-sheets-apps-script/Code.gs`.

Install or refresh it on the production workbook when the fallback menu is
needed:

1. Open the Google Sheet from `GOOGLE_SHEET_ID`.
2. Go to Extensions -> Apps Script.
3. Paste `scripts/google-sheets-apps-script/Code.gs`.
4. Run `installKisanKamaiEmailTrigger` once and approve permissions.
5. Run `sendPendingKisanKamaiNotifications` once to flush pending rows.

The generated email explains the source sheet, row number, row fields, and form
details so the receiver knows where the update happened and what request needs
attention.

The homepage footer newsletter writes to the `newsletter_subscriptions` tab.
The `/coming-soon` notify form writes to `coming_soon_notifications`. Support,
feature request, report, callback, partner, and owner application forms write
to `support_requests`. Booking callbacks write to `booking_requests`. Feedback
writes to `feedback`.

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

Decorate the workbook after bootstrap or backfill:

```bash
npm run sheets:decorate
```

This keeps every operational tab structurally safe: header rows remain in row 1,
filters remain attached to the existing tables, and mirrored data rows are not
moved. The script applies polished tab colors, hidden gridlines, readable
headers, soft banding, borders, notes, row heights, and column widths across the
operational tabs. The `Kisan Kamai HQ` dashboard uses production-facing labels,
ownership notes, verification prompts, and data-flow explanations instead of
temporary demo-style decoration.

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

- `Kisan Kamai HQ` production operations dashboard and workbook map
- `workbook_meta`
- `owners`
- `renters`
- `listings`
- `bookings`
- `payments`
- `saved_items`
- `support_requests`
- `booking_requests`
- `newsletter_subscriptions`
- `coming_soon_notifications`
- `feedback`
- `bug_reports`
- `auth_events`
- `sync_audit`

## Backfill Scope

`google-sheets-backfill.mjs` replaces the Firestore-backed tabs from live data and preserves the sheet-native log tabs:

- Replaced: owners, renters, listings, bookings, payments, saved_items, support_requests, booking_requests, newsletter_subscriptions, coming_soon_notifications, feedback, bug_reports
- Preserved: auth_events, sync_audit

Those preserved tabs are not rebuilt from Firebase because they are append-only operational logs that currently live in Sheets.

## Notes

- The live server mirror now writes richer row shapes, typed numeric cells, stronger headers, filters, and status-based conditional styling.
- Booking rows mirror the server-accepted booking status after the shared transition guard runs. Sheets must not be treated as an authority for editing booking state.
- `booking_requests` is now a first-class sheet instead of being lost inside generic submission payloads.
- `feature-request` submissions are visible in `support_requests` with subject, urgency, location, and message columns plus the full payload JSON.
- Newsletter subscriptions are visible in `newsletter_subscriptions` and use the same pending/sent email notification columns as the other public forms.
- Coming-soon notify requests are visible in `coming_soon_notifications` with the same pending notification columns as the other public forms.
- Listings mirror the first three public gallery image URLs and their Storage paths so operations can audit exactly which owner-uploaded photos were saved.
- `saved_items` is backfilled from Firestore even though the live runtime does not currently append every saved-item toggle into Sheets.
