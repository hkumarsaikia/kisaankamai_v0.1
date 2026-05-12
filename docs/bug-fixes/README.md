# Bug-Fix Evidence Bundles

This directory contains timestamped operational records for bug-fix work that
needs source, generated artifact, verification, or review evidence to travel
with the repo.

## Convention

Use this shape:

```text
docs/bug-fixes/<YYYY-MM-DD-HHMMSS-TZ>-<short-slug>/
  README.md
  operations/
  generated/
```

## Rules

- Keep canonical source files in their normal app paths.
- Keep generated files used by tests or documentation in their canonical paths.
- Store timestamped copies, manifests, and verification summaries here.
- Do not commit local credentials, passwords, OTP notes, or real webhook secrets.
- Include CodeRabbit/manual review evidence when a bug fix was review-driven.

## Current Bundles

- `2026-05-12-084714-IST-cropin-motion-scalability/`: Cropin-inspired motion timing, route transition flow, self-hosted icon font, status-filtered public listing reads, and empty rent-equipment spacing.
- `2026-05-08-235352-IST-code-review-hardening/`: booking transition hardening, sort-menu accessibility, production dependency cleanup, site-map regeneration, and CodeRabbit verification.
