# Footer Wordmark And Profile Label Fix

## Scope

- Replaced the public footer wordmark with the CSS text-stroke treatment from `/home/hkuma/Music/kisankamai.html`.
- Kept the footer background, links, newsletter form, and India flag copy unchanged.
- Updated the owner/renter workspace sidebar label style from wide uppercase micro text to normal title-case website typography.

## Root Cause

- The footer was still using an SVG wordmark instead of the supplied local HTML wordmark style.
- The workspace labels used `uppercase` with `tracking-[0.22em]`, which made "Owner Profile" and "Renter Profile" visually inconsistent with the surrounding brand text.

## Verification Evidence

- `node --test tests/navigation-and-layout-contracts.test.mjs tests/owner-listing-release-fixes-contracts.test.mjs`
- Local rendered footer smoke on `http://localhost:3052/?lang=en`
  - Screenshot: `logs/runtime/footer-music-wordmark-smoke.png`
  - Verified `.kk-footer-logo-text` uses Manrope, weight 800, `linear-gradient(135deg, #10b981 0%, #06b6d4 100%)`, `-webkit-text-fill-color: #002a1b`, and `-webkit-text-stroke: 3px transparent`.
- Local rendered owner workspace smoke on `http://localhost:3052/owner-profile`
  - Screenshot: `logs/runtime/workspace-profile-label-desktop-smoke.png`
  - Verified label text is `Owner Profile`, `text-transform: none`, and tight letter spacing.
- Local rendered renter workspace smoke on `http://localhost:3052/renter-profile`
  - Screenshot: `logs/runtime/workspace-renter-profile-label-desktop-smoke.png`
  - Verified label text is `Renter Profile`, `text-transform: none`, and tight letter spacing.
