# Material Symbols and HTTPS Hardening Fix

## Scope

This record covers the May 11, 2026 production regression where Material Symbols rendered as visible words such as `agriculture`, `search`, `event_available`, and `verified`.

## Root Cause

- The root layout generated a Google Fonts Material Symbols URL with a long `icon_names=...` subset.
- Live Chromium blocked that stylesheet with `net::ERR_BLOCKED_BY_ORB`.
- Direct HTTP verification showed Google Fonts returned `400 Bad Request` for the generated subset URL.
- Because the stylesheet failed, elements still had the `Material Symbols Outlined` font-family declaration from local CSS, but no icon font was loaded, so ligature words were rendered visibly.

## Fix

- Replaced the generated `icon_names` subset URL with the valid full Material Symbols ligature stylesheet:

```text
https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap
```

- Linked the stylesheet directly in the document head instead of deferring it through the `kk-material-symbols-loader` script.
- Added production `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` so browsers are explicitly instructed to remain on HTTPS after a secure visit.
- Updated tests and docs so the invalid subset pattern is not reintroduced.

## Verification Plan

- Source contracts must assert that `app/layout.tsx` does not use `icon_names=` and that the Material Symbols stylesheet is a direct `rel="stylesheet"` link.
- Rendered browser verification must confirm:
  - Google Fonts stylesheet request returns `200`.
  - No Material Symbols stylesheet request fails.
  - Visible icon elements have compact icon-sized boxes rather than word-sized boxes.
  - `document.fonts.check("24px 'Material Symbols Outlined'")` is true.
- Live HTTP verification must confirm:
  - `http://kisankamai.com` redirects to HTTPS.
  - `http://www.kisankamai.com` redirects to HTTPS.
  - HTTPS responses include `Strict-Transport-Security` after deployment.
