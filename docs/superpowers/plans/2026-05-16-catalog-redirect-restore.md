# Catalog Redirect Restore

**Date:** 2026-05-16 22:42 IST

## Root Cause

Commit `2e10c16f` (`feat: add guarded programmatic category SEO pages`) changed
`/catalog/[slug]` from a redirect-only compatibility route into full indexable
programmatic category pages. That changed the live behavior of links such as
`/catalog/tractors` and `/catalog/balers`, which previously opened the filtered
marketplace search page.

## Fix Contract

- Restore `/catalog/[slug]` to redirect to `/rent-equipment?query=<slug>`.
- Keep `/catalog/[slug]/gallery` as a redirect route.
- Link `/categories` cards directly to filtered marketplace query pages.
- Remove `/catalog/[slug]` from sitemap generation.
- Remove the source-controlled programmatic SEO category data module so stale
  route assumptions do not remain active.
- Update tests and current docs to describe catalog as compatibility routing,
  not an approved indexable page family.

## Verification Checklist

- [x] `npm run test:contracts`
- [x] `npm run verify`
- [x] `npm run launch:gate`
- [x] Live smoke for `/catalog/tractors` and `/catalog/balers`
- [x] GitHub MCP config starts without the Copilot remote handshake error
