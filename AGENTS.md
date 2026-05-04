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

## Local HTML Page Replacement

When a local HTML file is provided to replace a live website page, treat that HTML file as the design authority, not just a visual reference.

Port the exact structure, typography, colors, spacing, cards, forms, backgrounds, images, animations, and visual states from the supplied local HTML.

Only adapt the minimum required for React/Next.js, routing, auth, i18n, backend form submission, accessibility, and the shared site header/footer when explicitly required.

Do not redesign, normalize, simplify, restyle, or substitute the local HTML design with the existing site design system unless explicitly requested.

Verify the implemented page visually against the supplied local HTML, not only by checking text, routes, or functional markers.

## Archived Reference

- The previous Windows-root reference and local generated artifacts were removed after the Ubuntu rebuild.
- Cross-agent handoff files are not part of the active root app.

## Repo Notes

- `vendor/` is reference-only and should not be edited for product changes.
- Use `/home/hkuma/Work/kisan_kamai` as the canonical working checkout. Do not create or continue work in `~/.config/superpowers/worktrees/kisan_kamai/...` unless explicitly requested by the user. If an old worktree must be removed, first verify it is clean and that its branch has no commits missing from `main`.
