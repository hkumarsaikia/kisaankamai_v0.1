# Footer, Map, Search, and Share Preview Fixes

Date: 2026-05-15 10:21 IST

## Scope

- Spread the public footer columns across the available desktop width so the
  wordmark sits farther left, newsletter sits farther right, and marketplace
  links remain centered.
- Fix Google Maps gesture overlay styling so only the `Use ctrl + scroll to
  zoom the map` text is centered. The Google overlay container is no longer
  narrowed or translated.
- Follow-up: the Google Maps helper now targets only the smallest exact
  instruction text node and offsets that line from the live map bounds, so the
  text centers in the tile without moving the whole gesture overlay.
- Keep crawler and share-preview HTML in English for Googlebot and social bots,
  even while normal browser visits can default to Marathi.
- Reuse the route metadata inputs for `head.tsx` files so non-homepage public
  links expose page-specific Open Graph and Twitter preview images.
- Align owner/renter workspace labels from the logo/cart edge in the sidebar.
- Regenerate the brand tractor PNG favicon assets from the approved cart mark.

## Verification

- `npm run test:contracts -- tests/navigation-and-layout-contracts.test.mjs tests/dark-mode-visual-contracts.test.mjs tests/seo-contracts.test.mjs tests/final-hardening-contracts.test.mjs`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run verify`
- Local rendered checks on `http://localhost:3037/` confirmed footer column
  distribution, isolated Googlebot English rendering, route-specific support
  page `og:image`, and favicon PNG responses.

## Notes

- Local rendered map QA used the Leaflet fallback because the local production
  server did not have a Google Maps API key. The Google-specific overlay fix is
  guarded by source contracts and should be smoke-checked on the deployed site
  where Google Maps is configured.
- Google search snippets and search favicons are cached by Google. The deployed
  site can expose English crawler HTML and a valid cart favicon immediately,
  but Google may update the visible search result after its next crawl.
