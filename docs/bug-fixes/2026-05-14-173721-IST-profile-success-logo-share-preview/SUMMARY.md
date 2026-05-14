# Profile Success Routes, Logo, And Share Preview Fixes

## Scope

- Removed the owner and renter profile feedback success pages.
- Kept workspace feedback submissions on the same form after success so deleted success routes are not opened.
- Removed the visible owner/renter profile label under the workspace logo and from the workspace header eyebrow.
- Kept normal uncookied browser visits defaulted to Marathi while defaulting uncookied crawler/social-preview requests to English so Google and social snippets use English metadata and page language.
- Exposed stronger share-preview metadata for WhatsApp-style scrapers: `image_src`, `thumbnail`, `og:image:url`, and `og:locale`.
- Switched `/favicon.ico` to the cart PNG mark and adjusted icon metadata so Google can pick up the cart favicon.
- Removed the header logo subtitle, tightened the mobile header logo/action layout to prevent overlap, and made the footer wordmark transparent so the footer background shows through.

## Files Touched

- `app/favicon.ico/route.ts`
- `app/layout.tsx`
- `app/manifest.ts`
- `app/owner-profile/feedback/success/page.tsx`
- `app/renter-profile/feedback/success/page.tsx`
- `components/BrandLogo.tsx`
- `components/Footer.tsx`
- `components/Header.tsx`
- `components/owner-profile/OwnerProfileViews.tsx`
- `components/owner-profile/OwnerProfileWorkspaceShell.tsx`
- `components/profile/ProfileFeedbackForm.tsx`
- `components/renter-profile/RenterProfileViews.tsx`
- `lib/i18n.ts`
- `lib/site-metadata.tsx`
- `next.config.mjs`
- Profile workspace, navigation, dropdown icon, and SEO contract tests.

## Verification

- `npm run test:contracts`: 215/215 passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; deleted profile feedback success routes are absent from the route list.
- `npm run verify`: passed.
- `npm run launch:gate`: passed, including Firebase dry-run checks and Sheets verification.
- Local rendered checks confirmed normal mobile browser default `lang="mr"`, Googlebot/WhatsApp user agents receive `lang="en"`, share-preview image metadata is present, `/favicon.ico` serves `image/png`, deleted profile feedback success routes return 404, and the mobile header logo no longer overlaps the theme or menu controls.
- Live smoke checks are required after Firebase App Hosting rollout.
