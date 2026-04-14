# Static Site Map

This folder now contains a generated, standalone documentation sitemap for the Kisan Kamai codebase.

## Outputs

Run from the repo root:

```powershell
node docs/site-map/generate-site-map.mjs
```

This generates:

- `docs/site-map/index.html`
- `docs/site-map/site-map-data.json`

## What it documents

- current `app/**/page.tsx` routes
- grouped route families: `public`, `discovery`, `auth`, `owner`, `renter`, `support`
- shared surfaces inferred from pages and layouts
- internal destinations and programmatic redirects
- unresolved internal references
- external destinations

## What changed

The old graph viewer has been retired. There is no longer any graph canvas, inspector, filters, journey lens model, `viewer.js`, `annotations.js`, or generated `map-data.js`.

Open `docs/site-map/index.html` directly in a browser to inspect the static sitemap.
