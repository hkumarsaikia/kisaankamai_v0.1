# Roadmap

## Current Direction

- Root app is the canonical live site on Firebase App Hosting.
- Remove obsolete parallel surfaces and keep the root app as the only supported frontend runtime.
- Keep CodeRabbit/manual review hardening fixes documented in timestamped `docs/bug-fixes/` bundles when they affect operational behavior.

## Near-Term Priorities

- Keep owner/renter flows, listing publication, booking transitions, profile sync, and notification inbox behavior aligned with the Firebase-backed root runtime.
- Maintain route-by-route UI quality for language switching, dark-mode readability, mobile workspace layout, page-transition motion, and form loading states.
- Keep `/catalog/[slug]` as a redirect-only compatibility route and evaluate any future category SEO landing pages through a reviewed content/data quality gate before implementation.
- Keep Google Sheets mirroring and the `Kisan Kamai HQ` decoration layer operational without letting Sheets become the database of record.
- Reduce residual duplicated or legacy code paths and dependency audit surface without forced downgrades of core runtime packages.
