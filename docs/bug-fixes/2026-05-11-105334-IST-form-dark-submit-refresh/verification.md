# Form Submission, Dark Mode, and Profile Refresh Fix

## Scope

This record covers the May 11, 2026 fix pass for form submission failures, dark-mode form visibility issues, stale newsletter state, missing Material Symbols glyphs, and profile settings changes not propagating to linked profile surfaces.

## Root Causes

- Shared JSON form validation returned the generic `Validation failed.` message before field-level errors, so users could not see the real problem.
- Several public and workspace form schemas required at least 10 characters for free-text messages, rejecting normal short user inputs.
- Partner form success did not always clear stale error text.
- Workspace support, feedback, and settings action buttons used dark green foreground/background combinations that became unreadable in dark mode.
- Footer newsletter success stayed in the success state indefinitely.
- Profile settings save returned only `{ ok, userId }`, so the client did not receive a refreshed session after saving name, village, district, address, or related profile fields.
- The Material Symbols subset missed dynamic icon names used by visible pages, so some icons rendered as uppercase text.

## Changes

- Added shared field-error formatting in `lib/server/http.ts` and `lib/client/forms.ts`.
- Relaxed free-text minimums for partner, feedback, support, report, and feature-request forms while keeping non-empty validation.
- Updated public support, feature request, partner, coming-soon, catalog callback, profile support, and profile feedback forms to use useful field-level submission errors.
- Reset the footer newsletter button/message after successful submission.
- Returned and applied the refreshed session from `/api/profile/complete`.
- Broadcast `session-refresh` after profile settings save.
- Tightened dark-mode contrast for workspace form buttons and profile-photo edit action.
- Added `precision_manufacturing`, `track_changes`, and `vibration` to the Material Symbols subset.
- Added contract coverage in `tests/form-submission-flow-contracts.test.mjs`.

## Local Rendered QA

Executed against `npm run dev` on `http://localhost:3000` using headless Chromium in dark mode:

- Public support form submitted with a short message.
- Feature request form submitted with a short description.
- Partner enquiry form submitted without showing a stale error beside success.
- Coming-soon notify form submitted and reset.
- Footer newsletter submitted and reset to the normal send button.
- Owner test account logged in.
- Owner settings name change propagated to the owner profile surface, then the original name was restored.
- Owner workspace support form submitted in dark mode.
- Owner workspace feedback form submitted in dark mode.
- Mobile dark screenshots were captured for `/support` and `/owner-profile/support`.
- No browser console errors were observed during the rendered QA sequence.

Screenshots from local rendered QA were saved outside the repo under `/tmp/kisan-form-dark-qa`.

## Verification Commands

```bash
node --test tests/form-submission-flow-contracts.test.mjs
npm run typecheck
```

Full release verification commands are recorded in the release note for the commit that contains this fix.
