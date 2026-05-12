# Homepage Testimonial HTML Port

## Scope

- Replaced the homepage review-card header copy with one bold line: `Helping farmers choose equipment with confidence`.
- Removed the old `Farmer ratings`, `Rated for practical equipment access`, and supporting paragraph copy from the section.
- Ported the supplied testimonial-card HTML structure into the existing React homepage body while preserving shared site chrome, Next image handling, language switching, dark mode, and responsive layout.
- Removed the prior review badges and tag chips so the public cards match the supplied local HTML design more closely.

## Canonical Changes

- `app/page.tsx`
- `app/globals.css`
- `tests/seo-contracts.test.mjs`

## Verification

Verification commands and live smoke evidence are recorded in `operations/verification.md`.
