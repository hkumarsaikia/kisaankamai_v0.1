# Footer Layout And Wordmark Fix

## Scope

- Added the requested space before the India flag in owner and renter workspace footers.
- Kept the footer wordmark source faithful to `/home/hkuma/Documents/kisankamai.html` by using the same outlined SVG text treatment without a separate background rectangle.
- Reduced the public footer description width so the copy wraps into a shorter block.
- Reduced the newsletter column width and redistributed the footer grid across the available page width.

## Verification

- `node --test tests/owner-listing-release-fixes-contracts.test.mjs tests/navigation-and-layout-contracts.test.mjs`
- `npm run typecheck`
- `npm run test:contracts`
- `npm run lint`
- `npm run build`
- `npm run verify`
- `npm run launch:gate`
