# Live Performance Audit And Fix

Date: 2026-05-11 17:44 IST

## Scope

User request: check live website performance and fix concrete issues found.

Audited live routes with Lighthouse:

- `/`
- `/rent-equipment`
- `/rent-equipment?query=balers`
- `/owner-benefits`
- `/support`

## Findings

- `/rent-equipment` had the clearest fixable performance bug:
  - Live mobile Lighthouse: performance 42, CLS 1.0, LCP 11.5s.
  - Live desktop Lighthouse: performance 57, CLS 0.337, LCP 3.0s.
- Root cause: `app/rent-equipment/loading.tsx` returned `null`, but still created an App Router streaming boundary. The shared footer rendered before the route content reserved layout height, then shifted when equipment cards streamed in.
- The largest repeated payload across pages was the full Material Symbols font at about 454 KB.

## Changes Made

- Removed `app/rent-equipment/loading.tsx` so the rent-equipment segment no longer streams a null fallback that pushes the shared footer after content resolves.
- Added a contract test preventing that null loading boundary from returning.
- Replaced the full Material Symbols request with an `icon_names=` subset covering the app's current icon names while preserving the same ligature font family and `FILL` variation range.
- Updated icon-font contracts to assert the subset request and required common icons.

## Local Production Verification

- Focused contracts passed.
- `npm run build` passed.
- Local production rendered QA passed:
  - `/`, `/rent-equipment`, `/rent-equipment?query=balers`, `/support`, `/owner-benefits`
  - Material Symbols resolved as a font.
  - No icon text fallback detected.
  - No horizontal overflow.
- Local production PerformanceObserver on `/rent-equipment`:
  - Mobile CLS: `0`
  - Desktop CLS: `0.0001`
- Local production Lighthouse on `/rent-equipment`:
  - Mobile: score 72, CLS 0, total payload 1,099 KiB.
  - Desktop: score 94, CLS 0.004, total payload 1,185 KiB.

## Pre-Fix Baseline

Live Lighthouse before the fix:

- `/rent-equipment` mobile: score 42, CLS 1.0, LCP 11.5s, total payload about 1,518 KiB.
- `/rent-equipment` desktop: score 57, CLS 0.337, LCP 3.0s, total payload about 1,604 KiB.

## Remaining Performance Notes

- Mobile LCP on listing-heavy pages still depends on owner-uploaded remote equipment images and server response time.
- Further improvement would require a deeper image sequencing/data caching pass, not a small layout fix.
