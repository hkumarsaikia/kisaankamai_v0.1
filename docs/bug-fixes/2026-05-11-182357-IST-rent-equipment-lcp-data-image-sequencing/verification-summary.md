# Rent Equipment LCP Data and Image Sequencing

Date: 2026-05-11 18:23 IST

## Scope

The mobile `/rent-equipment` route still had a performance opportunity after the prior CLS/font pass. The remaining issue was not layout shift. It was the server data path plus the first owner-uploaded listing image becoming the mobile LCP candidate.

## Baseline From Prior Release

- Live mobile Lighthouse score: 70
- Live mobile LCP: 7.9s
- Live mobile TTFB: 1.54s
- Live mobile CLS: 0
- Live desktop Lighthouse score: 85
- Live desktop LCP: 2.0s

## Changes

- Replaced the uncached public equipment discovery path with a tagged `unstable_cache` wrapper.
- Changed owner profile joins from all-profile loading to targeted profile document reads for listing owner IDs.
- Added immediate public equipment cache invalidation on profile, listing create, listing update, and listing delete.
- Changed the base `/rent-equipment` mobile listing card image sequence so owner-uploaded thumbnails no longer dominate mobile LCP:
  - Mobile thumbnail reduced to `64px` source sizing.
  - Mobile media area reduced to `64x96`.
  - Desktop card media remains unchanged.
  - Mobile-only nonessential descriptive copy is hidden so the heading becomes the LCP candidate.
- Updated the equipment owner details card:
  - Compact card sizing.
  - Static, non-tilting hover behavior.
  - Owner name, location, and profile photo now prefer current profile data over stale listing snapshots.

## Local Production Evidence

Server warm-up on `http://localhost:3035/rent-equipment`:

- First local production request: 200, TTFB 0.260s
- Warm cached request: 200, TTFB 0.015s

Rendered mobile QA:

- Route: `/rent-equipment`
- Status: 200
- CLS: 0
- Horizontal overflow: false
- Observed LCP element: `H1`, label `उपलब्ध उपकरणे`
- Observed LCP time: 908ms
- First card image size: `64x96`
- Console/page errors: none

Local Lighthouse after the change:

- Mobile score: 73
- Mobile LCP: 7.4s
- Mobile TTFB: root document took 20ms
- Mobile CLS: 0
- Mobile LCP node: page heading `उपलब्ध उपकरणे`, not the owner-uploaded image
- Desktop score: 94
- Desktop LCP: 1.4s
- Desktop TTFB: root document took 10ms
- Desktop CLS: 0.004

## Artifacts

- `lighthouse-mobile-rent.json`
- `lighthouse-desktop-rent.json`
- `mobile-rent-rendered.png`

## Verification Commands

- `npm run test:contracts`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run verify`
- `npm run launch:gate`

`npm run launch:gate` also completed the Firebase rules dry run and workbook verification for `1OWxACnAIgjwrO88NwiXTXge5e4PLYLmX1WrO5Z8sAzU`.

Live deploy and smoke verification are tracked after commit and rollout.
