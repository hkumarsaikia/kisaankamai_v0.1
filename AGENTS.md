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
- Root npm commands are hardware-tuned through `scripts/hardware-tuned-runner.mjs`.
  The runner auto-detects CPU/RAM, uses cacheable checks where safe, and leaves
  system headroom instead of permanently changing global CPU policy.
- Browser-capable commands must prefer the fixed NVIDIA GPU path. The runner
  exports PRIME render offload variables, Chrome/Puppeteer executable paths, and
  Chrome GPU flags for the NVIDIA dGPU by default.
- Use `KK_CPU_MODE=balanced` by default. Use `KK_CPU_MODE=performance` only for
  short local bursts, `KK_CPU_MODE=eco` when keeping the desktop very responsive,
  `KK_MAX_WORKERS=<n>` for an explicit worker cap, and `KK_DISABLE_NICE=1` only
  when process priority lowering gets in the way.

## Local HTML Page Replacement

When a local HTML file is provided to replace a live website page, treat that HTML file as the design authority, not just a visual reference.

Port the exact structure, typography, colors, spacing, cards, forms, backgrounds, images, animations, and visual states from the supplied local HTML.

Only adapt the minimum required for React/Next.js, routing, auth, i18n, backend form submission, accessibility, and the shared site header/footer when explicitly required.

Do not redesign, normalize, simplify, restyle, or substitute the local HTML design with the existing site design system unless explicitly requested.

Verify the implemented page visually against the supplied local HTML, not only by checking text, routes, or functional markers.

## Archived Reference

- The previous Windows-root reference and local generated artifacts were removed after the Ubuntu rebuild.
- Cross-agent handoff files are not part of the active root app.

## Bug-Fix Evidence

- Keep timestamped bug-fix records under `docs/bug-fixes/<YYYY-MM-DD-HHMMSS-TZ>-<short-slug>/`.
- Do not move canonical source, lockfiles, generated docs used by tests, or runtime config into those folders; store review notes, manifests, verification summaries, and copied artifacts there.
- Do not commit local credential guides, OTP notes, passwords, or webhook secrets. `FINAL_TEST_ACCOUNT_LOGIN_GUIDE.md` is local-only and ignored.

## Repo Notes

- `vendor/` is reference-only and should not be edited for product changes.
- Use `/home/hkuma/Work/kisan_kamai` as the canonical working checkout. Do not create or continue work in `~/.config/superpowers/worktrees/kisan_kamai/...` unless explicitly requested by the user. If an old worktree must be removed, first verify it is clean and that its branch has no commits missing from `main`.
