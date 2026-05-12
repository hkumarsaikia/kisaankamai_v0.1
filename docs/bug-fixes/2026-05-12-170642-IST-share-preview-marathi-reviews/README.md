# Share Preview, Review Tiles, and Marathi Labels

## Scope

- Added a dedicated social sharing preview image for WhatsApp, Telegram, Instagram, and other Open Graph/Twitter consumers.
- Replaced the generic homepage farmer-rating cards with realistic sample review cards using distinct farmer profiles and Marathi copy.
- Fixed source-controlled Marathi labels for the owner-benefits calculator, about-page value cards, and rent-equipment listing/category/location labels.

## Canonical Changes

- `public/assets/share/kisan-kamai-og.jpg`
- `lib/site-metadata.tsx`
- `app/layout.tsx`
- `app/page.tsx`
- `app/owner-benefits/page.tsx`
- `app/about/page.tsx`
- `app/rent-equipment/RentEquipmentView.tsx`
- `lib/localized-market-labels.ts`
- `tests/seo-contracts.test.mjs`

## Generated Evidence

- `generated/kisan-kamai-og.jpg`: copied timestamped evidence of the canonical 1200x630 JPEG share image.

## Verification

Verification commands and live smoke evidence should be recorded in `operations/verification.md` after the release commands finish.
