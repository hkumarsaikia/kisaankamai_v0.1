# Verification

## Source Checks

- `git diff --check`: passed.
- `npm run typecheck`: passed.
- `npm run test:contracts`: passed, 203/203.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run launch:gate`: passed, including Firebase preflight, Firestore/Storage dry run, and Sheets workbook verification.
- `npm run verify`: passed after rerunning without a parallel build lock.

## Rendered Local QA

Started the production build locally with:

```bash
PORT=3107 npm run start:logged
```

Used Playwright with the system Chrome binary because the Playwright package browser download does not support `ubuntu26.04-x64` in this environment:

```bash
node <playwright-rendered-marathi-check>
```

Rendered checks passed for:

- `/`: three homepage review cards render with the new sample review content and no old generic titles.
- `/owner-benefits`: calculator labels render in Marathi.
- `/about`: core value cards and team names render in Marathi.
- `/rent-equipment`: public listing labels render localized category and Maharashtra location text.

## Metadata QA

- Local `GET /` includes `og:image`, `og:image:secure_url`, `og:image:type=image/jpeg`, `og:image:width=1200`, `og:image:height=630`, `twitter:image`, and `twitter:image:alt`.
- Local `HEAD /assets/share/kisan-kamai-og.jpg` returns `200 OK`, `Content-Type: image/jpeg`, and `Content-Length: 93226`.

## Dev Server QA

Started the development server with:

```bash
PORT=3108 npm run dev
```

- `GET /owner-benefits`: `200 text/html; charset=utf-8`
- `GET /assets/share/kisan-kamai-og.jpg`: `200 image/jpeg`
