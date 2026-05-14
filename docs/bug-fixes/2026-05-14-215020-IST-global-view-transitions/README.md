# Global View Transitions

## Scope

Added native React view transitions across the full site route tree, including public marketing pages, marketplace pages, auth pages, and owner/renter workspace routes.

## Changes

- Enabled `experimental.viewTransition` in `next.config.mjs`.
- Added `components/PageViewTransition.tsx` and wrapped all `app/template.tsx` page bodies with a pathname key so sibling workspace routes animate too.
- Added transition type inference in `AppLink` and `useSmoothRouter`.
- Added the React view-transition CSS recipe to `app/globals.css`.
- Isolated persistent public header/footer and workspace navigation chrome with `viewTransitionName`.
- Added `tests/view-transitions-contracts.test.mjs`.

## Verification

- `node --test tests/view-transitions-contracts.test.mjs`
- `npm run typecheck`
- `npm run test:contracts`

Remaining release checks are run from the root app before rollout.
