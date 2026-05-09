# Verification

## Targeted Tests

Command:

```bash
node --test tests/offline-settlement-notifications-contracts.test.mjs tests/profile-listing-availability-contracts.test.mjs tests/ops-integration-contracts.test.mjs
```

Result:

- Passed.
- 21 tests passed.

## Full Root App Verification

Command:

```bash
npm run verify
```

Result:

- Passed.
- Lint passed.
- Typecheck passed.
- Contract tests passed: 167/167.
- Production build completed successfully.
- Re-run after the documentation refresh also passed with the same 167/167 contract test count and a successful production build.

## Diff Hygiene

Command:

```bash
git diff --check
```

Result:

- Passed.
- No trailing whitespace or conflict markers detected.

## Production Dependency Scope Check

Command:

```bash
npm ls puppeteer --omit=dev
```

Result:

- Passed for the requested Puppeteer production-weight finding.
- Output shows no production Puppeteer dependency.

## CodeRabbit

Command:

```bash
coderabbit review --agent -t uncommitted -c AGENTS.md
```

Result:

- Passed.
- CodeRabbit completed review with zero findings.

## Deployment

No live deployment, repo push, or Discord notification was run for this specific documentation-bundle step.

## Documentation Refresh

The root docs, setup/development docs, operations runbooks, site-map docs,
roadmap, audit notes, `AGENTS.md`, and `docs/bug-fixes/` index were refreshed
so the review hardening and documentation-bundle conventions are discoverable
from the active workspace docs.
