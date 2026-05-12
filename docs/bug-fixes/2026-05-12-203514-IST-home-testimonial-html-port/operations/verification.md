# Verification

## Source Checks

```bash
rg -n "Farmer ratings|Rated for practical equipment access|Clear photos, direct owner coordination|Renter review|Owner review|Support review|नमुना" app/page.tsx tests
```

Result:

- Passed. Removed homepage visible legacy heading/subtitle/review-badge strings from `app/page.tsx`.
- Remaining matches are regression assertions only.

## Automated Gates

```bash
npm run test:contracts
npm run verify
npm run launch:gate
```

Result:

- `npm run test:contracts`: Passed. Contracts 203/203.
- `npm run verify`: Passed. Lint, typecheck, contracts 203/203, and production build completed.
- `npm run launch:gate`: Passed. Lint, typecheck, contracts 203/203, production build, Firebase preflight, Firestore/Storage rules dry run, and workbook verification completed.

## Rendered Local QA

Production server:

```bash
PORT=3109 npm run start:logged
```

Playwright checks against `http://localhost:3109/`:

- Desktop English renders 3 `.kk-farmer-rating-card` cards.
- Desktop Marathi renders 3 `.kk-farmer-rating-card` cards.
- Mobile English renders 3 `.kk-farmer-rating-card` cards.
- All three card profile images load.
- No horizontal overflow was detected.
- The section contains `Helping farmers choose equipment with confidence`.
- The section does not contain `Farmer ratings`, `Rated for practical equipment access`, `Clear photos, direct owner coordination`, `Renter review`, `Owner review`, `Support review`, `Sample`, or `नमुना`.

Screenshots:

- `/tmp/kisan-home-testimonials-final-desktop-en.png`
- `/tmp/kisan-home-testimonials-final-desktop-mr.png`
- `/tmp/kisan-home-testimonials-final-mobile-en.png`

## Release Smoke

Deployment commands:

```bash
firebase apphosting:rollouts:create kisankamai-web-backend --git-commit b134922e759af67d0768736ac66b610921a977cf --project gokisaan --force
npm run firebase:deploy
```

Result:

- App Hosting rollout created successfully for commit `b134922e759af67d0768736ac66b610921a977cf`.
- Firestore and Storage rules deployed successfully.
- `https://www.kisankamai.com/` returned 200.
- `https://kisankamai.com/` returned 200.
- Live Playwright rendered checks passed on `www` in English and Marathi.
- Live Playwright rendered checks passed on apex in English.
- Live homepage testimonial cards render 3 cards, load all 3 profile images, show the new heading, and do not contain the removed legacy heading/subtitle/badge strings.
