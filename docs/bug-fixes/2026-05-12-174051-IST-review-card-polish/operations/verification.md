# Verification

## Source Checks

```bash
rg -n "Sample renter|Sample owner|Sample support|SAMPLE|नमुना|sample review" app tests docs --glob '!node_modules'
```

Result:

- Passed. Only the regression assertion in `tests/seo-contracts.test.mjs` matches.

## Automated Gates

```bash
npm run verify
npm run launch:gate
```

Result:

- `npm run verify`: Passed. Contracts 203/203, lint, typecheck, and production build completed.
- `npm run launch:gate`: Passed. Contracts 203/203, production build, Firebase preflight, Firestore/Storage rules dry run, and workbook verification completed.

## Rendered Local QA

Production server:

```bash
PORT=3109 npm run start:logged
```

Playwright checks against `http://localhost:3109/`:

- English homepage renders 3 `.kk-farmer-rating-card` cards.
- English cards contain `Renter review`, `Owner review`, and `Support review`.
- Marathi homepage renders 3 `.kk-farmer-rating-card` cards.
- Marathi cards contain `भाडेकरू पुनरावलोकन`, `मालक पुनरावलोकन`, and `सपोर्ट पुनरावलोकन`.
- No rendered card contains `Sample`, `SAMPLE`, or `नमुना`.
- Mobile viewport renders the cards without horizontal overflow.

Screenshots:

- `/tmp/kisan-home-review-cards-section-en.png`
- `/tmp/kisan-home-review-cards-section-mr.png`
- `/tmp/kisan-home-review-cards-mobile-en.png`

## Release Smoke

Deployment commands:

```bash
firebase apphosting:rollouts:create kisankamai-web-backend --git-commit a0a2d920088f1e620a43bcfbfd05599c841f2282 --project gokisaan --force
npm run firebase:deploy
```

Result:

- App Hosting rollout created successfully for commit `a0a2d920088f1e620a43bcfbfd05599c841f2282`.
- Firestore and Storage rules deployed successfully.
- `https://www.kisankamai.com/` returned 200.
- `https://kisankamai.com/` returned 200.
- Live Playwright rendered checks passed for both domains in English and Marathi.
- Live homepage review cards render 3 cards and do not contain public `Sample`, `SAMPLE`, or `नमुना` labels.
