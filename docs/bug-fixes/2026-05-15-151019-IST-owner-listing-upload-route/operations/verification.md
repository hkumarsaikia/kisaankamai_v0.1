# Verification

## Automated Checks

- `npm run typecheck` passed.
- `npm run test:contracts` passed with 224/224 contracts.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run verify` passed.
- `npm run launch:gate` passed, including Firebase preflight, Firestore/Storage rules dry-run, and Google Sheets workbook verification.

## Local Dev Smoke

Started the local app with:

```bash
PORT=3042 npm run dev
```

Checked:

- `GET /favicon.ico` returned `200` with `content-type: image/png`.
- Anonymous `GET /list-equipment` returned `307` to `/login`.
- Auth-cookie `GET /list-equipment?listingId=test123` returned `307` to `/owner-profile/list-equipment?listingId=test123`.
- Marathi cookie `GET /forgot-password/success` contained `पासवर्ड यशस्वीरित्या बदलला` and `हा पासवर्ड खाजगी ठेवा`.
