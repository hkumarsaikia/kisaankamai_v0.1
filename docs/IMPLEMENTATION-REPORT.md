# Implementation Report

This report records the current upgrade program that vendors external repositories and adapts only the parts that are technically compatible with the Kisan Kamai website.

## Vendored sources

- `openform` is used as a one-question and progressive-disclosure form UX reference.
- `superpowers` is used as an engineering and repo-hardening reference.
- `rn-interface-kit` is used as a visual/motion reference for manual web-native ports.
- The detailed usage contract and current adoption boundaries are documented in `docs/VENDORED-REPOS.md`.

## Standards applied

- Prefer shared abstractions over repeated page-local logic.
- Keep backend contracts stable when upgrading frontend behavior.
- Use typed data structures for generated sitemap data, map data, and reusable form configuration.
- Remove dead or replaced graph/mock code when a real replacement ships.
- Keep incompatible upstream runtimes out of the website build.

## Work log

- Replaced the old graph-based docs site map with a static generated sitemap workflow.
- Removed Mermaid diagram blocks from the core architecture and roadmap docs.
- Added a vendored-repo note to make the external-source contract explicit.
- Cloned the three upstream repositories into `vendor/` as full git clones for auditability and future reference.
- Excluded `vendor/` from the application TypeScript surface so the Next.js app stays isolated from incompatible upstream runtimes.
- Added a shared form kit:
  - `FormShell`
  - `FormSection`
  - `FormGrid`
  - `FormField`
  - `FormNotice`
  - `FormActions`
  - `FormStepActions`
  - `ChoicePills`
  - `ReviewList`
- Ported OpenForm-style progressive form UX into active website flows while keeping the existing local-data and server-action backend:
  - login
  - register
  - forgot-password
  - complete-profile
  - owner-registration
  - locations expansion request
  - support
  - feedback
  - partner inquiry
- Centralized real map data in `lib/map-data.ts` and used that shared dataset across:
  - homepage
  - support
  - rent-equipment
  - equipment detail
  - locations overview
  - locations by city
- Replaced fake or decorative map-first locations pages with real `LazyMap` / `MapComponent` surfaces backed by shared marker and circle data.
- Verified the app pipeline after the refactor:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `next dev`
  - `next start`

## rn-interface-kit guidance

Patterns from `rn-interface-kit` that translate well to the web:

- premium card hierarchies
- bold landing-page compositions
- richer visual grouping for forms and dashboard surfaces
- motion pacing and state transitions that can be recreated with Framer Motion

Patterns that should not be ported directly:

- Expo Router assumptions
- Reanimated- and Gesture Handler-specific interactions
- Skia canvas code as a drop-in replacement for DOM rendering

Recommended web adaptation targets:

- landing page hero blocks and feature cards
- multi-step form shells and progress UI
- owner/renter dashboard cards, summaries, and empty states

## superpowers-style hardening choices applied

- Runtime isolation: vendored repos are present for reference but not part of the app build graph.
- Shared abstractions: repeated form structure and map datasets were consolidated instead of copied page-by-page.
- Typed contracts: static sitemap output, map hub data, and form-shell primitives are now explicit and reusable.
- Replacement over duplication: old graph sitemap assets were retired instead of being left alongside the new workflow.
- Validation-first rollout: the upgraded surfaces were held to successful lint, typecheck, build, dev, and production-start checks.

## Follow-up recommendations

- Continue migrating remaining authenticated/settings/dashboard forms onto the shared form shell for total visual consistency.
- Expand bilingual dictionary coverage so the newly upgraded form surfaces can avoid mixed hardcoded copy.
- Add image-rich upload review steps to more owner and booking flows now that the shared shell is in place.
- If a later round wants deeper `rn-interface-kit` inspiration, port it through web-native components only and keep Expo/React Native code out of the runtime.
