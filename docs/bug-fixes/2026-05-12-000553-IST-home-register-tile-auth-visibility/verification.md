# Homepage Register Tile Auth Visibility

Date: 2026-05-12 00:05 IST

## Scope

The homepage onboarding tile with `Rent, List & Grow` and `Register Now` should be visible only to signed-out visitors. When a user is logged in, the tile should disappear and stay hidden until the user signs out.

## Root Cause

`HomeRegisterTile` already read the auth session, but it used the session only to change the CTA destination from `/register` to a workspace route. The tile itself still rendered for authenticated users.

## Fix

- The homepage now derives `showRegisterTile` from `useAuth()` and only renders `HomeRegisterTile` for signed-out visitors.
- Signed-out visitors continue to see the same tile and the CTA links to `/register`.
- After signout clears the auth session, the tile renders again through the existing auth context state update.
- The authenticated hero layout switches to a single desktop grid column so hiding the tile does not leave an empty right column.
- The source contract now asserts the authenticated render guard, single-column layout, and the signed-out `/register` CTA.

## Verification Targets

- `npm run test:contracts`: passed, 193/193 contracts.
- `npm run verify`: passed, including lint, typecheck, contract tests, and production build.
- `npm run launch:gate`: passed, including production build, Firebase dry run, and workbook verification.
- `git diff --check`: passed.
- Playwright rendered QA passed with system Chrome:
  - signed-out homepage showed `Rent, List & Grow`, `Register Now`, `/register` links, and a two-column hero grid (`730px 390px`).
  - authenticated homepage hid the tile, `Register Now`, and `/register` links, and switched to a one-column hero grid (`760px`).
  - after logout, the homepage showed the tile again and returned to the two-column hero grid.
- Live smoke after Firebase App Hosting rollout remains the release verification target.
