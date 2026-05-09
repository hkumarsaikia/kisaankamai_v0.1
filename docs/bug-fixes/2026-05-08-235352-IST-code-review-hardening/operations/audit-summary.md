# Production Audit Summary

Command:

```bash
npm audit --omit=dev --audit-level=high
```

Result:

- Passed for high/critical audit threshold.
- High production advisories were removed from the reviewed dependency surface.
- Remaining advisories reported by npm are low/moderate.

Remaining low/moderate advisory families:

- Firebase Admin transitive chain through Google Cloud Storage and Firestore packages.
- Next transitive PostCSS advisory through Next's bundled dependency tree.

Notes:

- `npm audit fix --force` suggests breaking changes, including downgrading `firebase-admin` and `next`, so those forced fixes were not applied.
- The direct review finding for Puppeteer production weight was fixed by moving Puppeteer to `devDependencies`.
