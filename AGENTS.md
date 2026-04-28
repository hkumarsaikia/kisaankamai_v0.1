# Repository Guide

The root Next.js app is the canonical public frontend for `https://www.kisankamai.com`.

## Root App Commands

```bash
npm install
npm run dev
npm run dev:logged
npm run dev:public
npm run tunnel:public
npm run start:logged
npm run lint
npm run typecheck
npm run build
npm run verify
```

- Use `npm run dev:logged` or `npm run start:logged` when you need captured runtime logs.
- Runtime logs from the helper scripts live under `logs/runtime/`.
- Start `npm run dev:public` before `npm run tunnel:public` when you need a shareable tunnel URL for the local app.
- Treat `npm run verify` as the default root-app validation pass.

## Archived Reference

- The previous Windows-root reference and local generated artifacts were removed after the Ubuntu rebuild.
- Cross-agent handoff files are not part of the active root app.

## Repo Notes

- `vendor/` is reference-only and should not be edited for product changes.
