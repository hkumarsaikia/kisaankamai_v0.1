# Google Search Favicon ICO Signal

## Scope

Google search was showing the Kisan Kamai cart mark as the large result
thumbnail, but the small result favicon slot still showed Google's generic
globe icon. The small icon is controlled by the site favicon crawl signal, not
the Open Graph/share image.

## Root Cause

`/favicon.ico` was a dynamic route that returned the cart PNG while using the
`.ico` URL. Browsers tolerate that, but favicon crawlers can be stricter and
Google also caches favicon results separately from page thumbnails.

## Changes

- Added a real `public/brand/kisan-kamai-favicon.ico` ICO container with the
  approved 48x48 cart PNG embedded inside it.
- Updated `app/favicon.ico/route.ts` to serve the ICO file as `image/x-icon`.
- Updated root metadata and the web manifest so `/favicon.ico` is declared as
  `image/x-icon`.
- Added/updated contract tests so future changes cannot silently switch
  `/favicon.ico` back to a PNG response.
- Installed and used the requested `agent-browser` skill for rendered/live
  browser validation.

## Verification

- `agent-browser doctor --offline --quick`
- `node --test tests/navigation-and-layout-contracts.test.mjs tests/owner-listing-release-fixes-contracts.test.mjs tests/profile-dropdown-notifications-contracts.test.mjs`
- Full release verification should confirm:
  - `GET /favicon.ico` returns `200`.
  - `Content-Type` is `image/x-icon`.
  - The downloaded file is an ICO resource.
  - Home metadata and `/manifest.webmanifest` advertise `/favicon.ico` as
    `image/x-icon`.

## Operational Note

This makes the live website expose the correct cart favicon signal. The visible
Google search result icon can still take time to update because Google controls
favicon recrawl and cache refresh timing.
