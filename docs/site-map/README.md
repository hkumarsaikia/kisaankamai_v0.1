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
- dynamic template destinations sanitized for documentation display, for example dynamic telephone links become stable placeholders instead of raw template text

Current route conventions reflected by the generated sitemap:

- `/owner-profile/*` is the owner workspace family.
- `/renter-profile/*` is the renter workspace family.
- `/owner-profile/earnings` is the canonical earnings route.
- `/owner-profile/list-equipment?listingId=<id>` is the owner listing edit entrypoint; `/list-equipment` only redirects there for compatibility.
- `/support` is the public help/contact flow. `/report` is no longer a public route.
- profile/workspace pages render the local workspace footer with the trust/legal split used in the active shell.

## What changed

The old graph viewer has been retired. There is no longer any graph canvas, inspector, filters, journey lens model, `viewer.js`, `annotations.js`, or generated `map-data.js`.

Open `docs/site-map/index.html` directly in a browser to inspect the static sitemap.

Timestamped copies of generated sitemap artifacts may also appear inside `docs/bug-fixes/<timestamp>/generated/site-map/` when a bug-fix record needs immutable review evidence. The canonical generated files remain in this folder.
