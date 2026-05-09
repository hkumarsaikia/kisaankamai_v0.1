# Code Review Hardening Bug Fixes

Timestamp: 2026-05-08 23:53:52 IST

This directory is the operational bundle for the CodeRabbit/manual review bug-fix work completed on the Kisan Kamai root app.

## Scope

- Constrained server-side booking status transitions by actor and current booking status.
- Removed closed sort-menu options from keyboard traversal while preserving the dropdown animation.
- Moved Puppeteer out of production dependencies.
- Added narrow npm overrides for vulnerable production transitive packages.
- Ignored the local final test account guide so credentials are not accidentally committed.
- Regenerated the static site-map docs and sanitized dynamic template expressions.

## Operational Files

- `operations/changed-files.txt`: tracked source, docs, and test files changed by this bug-fix work.
- `operations/superpowers-debugging-rerun.md`: Superpowers systematic debugging rerun record.
- `operations/verification.md`: commands run and verification result.
- `operations/audit-summary.md`: production dependency audit result and remaining advisory notes.
- `operations/coderabbit-review.jsonl`: CodeRabbit agent review result for the scoped diff.

## Generated Files

- `generated/site-map/site-map-data.json`: copied generated site-map JSON artifact.
- `generated/site-map/index.html`: copied generated site-map HTML artifact.

The canonical generated site-map files remain in `docs/site-map/` because tests and documentation links expect them there. This folder keeps a timestamped copy for the bug-fix record.
