# Site Map Viewer

This folder contains a fully isolated manual-open documentation viewer for the current Kisan Kamai codebase.

## What it shows

- App routes found in `app/**/page.tsx`
- Shared navigation components such as header, footer, sidebars, and top bars
- Internal links, redirects, external links, placeholder links, and inferred flows
- Missing or unresolved routes referenced in code
- Source attribution so you can see where a link comes from

## How to regenerate

Run this from the repo root:

```powershell
node docs/site-map/generate-site-map.mjs
```

This rewrites:

- `docs/site-map/map-data.js`

The generator also reads `tunnel.log` when available and uses the current public-tunnel URL as the default base URL in the viewer.

## How to open it manually

Open this file directly in your browser:

- `docs/site-map/index.html`

You can:

- pan and zoom the graph
- search routes, components, files, or destinations
- filter node groups and edge types
- switch between `Structure Map` and `Journey Lenses`
- switch theme with `System`, `Light`, and `Dark`
- inspect incoming and outgoing relationships
- open resolvable route and external targets in a new browser tab using the base URL field
- explore curated goal flows for `Renter Booking`, `Owner Listing`, and `Auth & Profile Setup`

## Notes

- `surface` edges mean a page or layout renders a shared component, such as `Header`, `Footer`, or a profile sidebar.
- `placeholder` edges mark incomplete or non-final destinations such as `#`, `tel:+`, or other unfinished targets.
- `missing-route` nodes are links referenced in code that do not currently have a matching `app/**/page.tsx`.
