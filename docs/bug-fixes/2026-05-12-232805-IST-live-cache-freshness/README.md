# Live Cache Freshness Guard

## Scope

- Verified live HTML freshness headers on `https://www.kisankamai.com`,
  `https://kisankamai.com`, and HTTP redirects.
- Verified repeated no-cache live requests returned one active App Hosting
  revision.
- Confirmed the Firebase messaging service worker does not install a fetch
  cache for app pages.
- Added `/api/build-info` with no-store headers and the active build revision.
- Added `BuildFreshnessMonitor` so already-open browser tabs reload when a
  newer live revision is deployed.

## Root Cause

The live server was already returning `Cache-Control: private, no-cache,
no-store` and `CDN-Cache-Control: no-store` for HTML. The remaining practical
stale-view case is a user keeping an old React app open in a browser tab while a
new Firebase App Hosting rollout goes live.

## Runtime Behavior

Fresh navigations get uncached HTML from the live server. Open tabs compare the
initial revision from the rendered page with `/api/build-info` on focus,
visibility changes, and a five-minute interval. When the revision differs, the
tab reloads itself and receives the current deployed website.

## Verification Plan

```bash
curl -fsSI https://www.kisankamai.com/
curl -fsS https://www.kisankamai.com/api/build-info
npm run test:contracts
npm run verify
npm run launch:gate
```
