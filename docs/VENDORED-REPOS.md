# Vendored Repositories

The `vendor/` folder contains full upstream git clones kept inside this repo as audited reference sources. They are here to guide implementation decisions, not to become part of the website runtime by default.

## At a glance

| Repo | Current role in Kisan Kamai | Direct runtime import | Where it is already reflected |
| --- | --- | --- | --- |
| `vendor/openform` | Form UX and interaction reference | No | Shared form kit and progressive form flows |
| `vendor/superpowers` | Engineering workflow and repo-hardening reference | No | Planning, structure, documentation standards |
| `vendor/rn-interface-kit` | Visual and motion reference for manual web ports | No | Design direction only; no direct runtime adoption |

## Current usage status

### `vendor/openform`

- Source: `https://github.com/dabit3/openform`
- Intended role here: borrow polished form UX patterns while keeping Kisan Kamai's own validation, server actions, and Firebase-backed data flow.
- Already reflected in the codebase through:
  - `components/forms/FormKit.tsx`
  - `components/forms/OwnerListingWizard.tsx`
  - progressive form upgrades in:
    - `app/login/page.tsx`
    - `app/register/page.tsx`
    - `app/forgot-password/page.tsx`
    - `app/complete-profile/page.tsx`
    - `app/owner-registration/page.tsx`
    - `app/support/page.tsx`
    - `app/feedback/page.tsx`
    - `app/partner/page.tsx`
    - `app/locations/page.tsx`
- Patterns already adapted:
  - stronger form shell and section framing
  - clearer progress flow
  - progressive disclosure for longer flows
  - better review and submit treatment
  - more deliberate visual hierarchy than plain stacked fields
- What to continue using it for:
  - registration and onboarding
  - profile completion
  - owner listing create/edit flows
  - booking request and support/contact flows
  - any long form that needs better completion UX
- What not to adopt from it:
  - OpenForm backend architecture
  - Supabase assumptions
  - hosted form-product concepts
  - its auth or dashboard model

### `vendor/superpowers`

- Source: `https://github.com/obra/superpowers`
- Intended role here: engineering discipline and implementation workflow reference.
- Current status in this repo:
  - not imported into website runtime
  - used only as a process and standards reference
  - documented in:
    - `docs/IMPLEMENTATION-REPORT.md`
    - `vendor/superpowers/.codex/INSTALL.md`
- How it is useful for this project:
  - writing decision-complete plans before large refactors
  - structuring debugging and verification work
  - preferring shared abstractions over repeated page-local logic
  - documenting constraints and intended use of external references
  - keeping feature work auditable and reversible
- Where to use it going forward:
  - auth and session refactors
  - translation and theme hardening
  - booking and listing workflow upgrades
  - map reliability work
  - production-readiness audits and regression passes
- What not to do with it:
  - do not wire it into the browser or app runtime
  - do not make the website depend on files inside `vendor/superpowers`
  - do not treat `.codex` install instructions as application code

### `vendor/rn-interface-kit`

- Source: `https://github.com/anwersolangi/rn-interface-kit`
- Intended role here: design and motion inspiration for manual web-native recreation.
- Current status in this repo:
  - no direct app imports
  - no Expo, Reanimated, Gesture Handler, or Skia runtime added to the website
  - used as a local visual reference only
- Best use in this project:
  - hero sections
  - CTA panels
  - onboarding and profile-selection screens
  - owner/renter dashboard cards
  - empty states and premium summary surfaces
  - motion pacing references for Framer Motion work
- What to borrow:
  - bold composition
  - stronger card hierarchy
  - richer grouping of related content
  - more intentional visual rhythm between sections
- What not to borrow directly:
  - React Native components
  - Expo router patterns
  - Reanimated or Gesture Handler code
  - Skia rendering assumptions

## How these repos should be used

### Use `openform` when

- redesigning or consolidating forms
- deciding whether a flow should be single-step or multi-step
- improving review, completion, and submission feedback
- upgrading mobile and keyboard form usability

### Use `superpowers` when

- planning large or risky implementation work
- defining acceptance criteria and regression checks
- reviewing architecture decisions before code changes
- deciding where shared abstractions should replace duplicated logic

### Use `rn-interface-kit` when

- refreshing premium-facing UI sections
- improving dashboard and onboarding composition
- choosing motion direction for web-native recreations
- designing cleaner empty states, feature cards, and call-to-action panels

## Boundaries

- App runtime code must not import directly from `vendor/`.
- Vendored repos are reference material, not production dependencies.
- Patterns borrowed from vendored repos should be rewritten into first-party web code under this repo's own components and utilities.
- React Native or Expo dependencies from vendored repos must not be added to the website build.
- Upstream repos remain intact so future audits can compare local adaptations against their source patterns.
