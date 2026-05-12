# Verification

## Automated

- `npm run test:contracts`
  - Result: passed, 205/205 contract tests.
  - New coverage checks `/complete-profile` is absent from active route files and auth redirects.
  - New coverage checks `/partner` uses a stable `formElement`, resets through it, and renders a submit loader.
- `npm run verify`
  - Result: passed.
  - Includes lint, typecheck, 205/205 contract tests, and production build.
- `npm run launch:gate`
  - Result: passed.
  - Includes lint, typecheck, 205/205 contract tests, production build, Firebase preflight, Firestore/Storage rules dry run, and Sheets workbook verification.

## Rendered QA

- Local production server: `PORT=3109 npm run start:logged`.
- Browser: Playwright with system Google Chrome because Playwright's bundled Chromium does not support Ubuntu 26.04 in this environment.
- Result: passed.
  - `/complete-profile` returned 404.
  - `/partner` returned 200.
  - Partnership enquiry submit showed `Submitting...`, set `aria-busy="true"`, called `/api/forms/partner-inquiry`, showed success, reset the fields, and emitted no `currentTarget`/`reset` runtime errors.

## Live Release

- Firebase App Hosting rollout: created for the release commit containing this fix.
- Firestore/Storage rules: deployed.
- Live smoke:
  - `https://kisankamai.com/complete-profile` returned 404.
  - `https://www.kisankamai.com/complete-profile` returned 404.
  - `https://kisankamai.com/partner` returned 200.
  - `https://www.kisankamai.com/partner` returned 200.
- Live rendered QA:
  - `/complete-profile` returned 404.
  - `/partner` submit showed the loader, called the partner endpoint through an intercepted live browser request, rendered success, reset fields, and emitted no `currentTarget`/`reset` runtime error.
