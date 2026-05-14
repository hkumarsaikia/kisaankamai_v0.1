# Rent Layout, Logo, OTP, And Backend Discord Fixes

## Scope

- Compact `/rent-equipment` and category query page vertical spacing so the search bar clears the fixed header without leaving large empty areas.
- Keep Firebase phone OTP verification functional while hiding the public reCAPTCHA slot and removing reset-code helper copy from `/forgot-password/verify-otp`.
- Apply the updated cart-forward brand logo treatment to the public header and owner/renter workspace sidebars.
- Replace the footer wordmark with the supplied outlined gradient Kisan Kamai SVG treatment and keep the India flag marker in the copyright line.
- Make backend Discord activity embeds read like operational updates instead of exposing raw event names, long account IDs, or JSON-style payload blocks.

## Files Touched

- `app/rent-equipment/RentEquipmentView.tsx`
- `app/forgot-password/verify-otp/page.tsx`
- `app/register/page.tsx`
- `app/globals.css`
- `components/BrandLogo.tsx`
- `components/Header.tsx`
- `components/NavigationTransitionProvider.tsx`
- `components/Footer.tsx`
- `components/auth/LoginClient.tsx`
- `components/auth/RegisterClient.tsx`
- `components/owner-profile/OwnerProfileWorkspaceShell.tsx`
- `lib/server/backend-activity.ts`
- `tests/cropin-motion-scalability-contracts.test.mjs`
- `tests/dark-mode-visual-contracts.test.mjs`
- `tests/live-site-fixes-contracts.test.mjs`
- `tests/navigation-and-layout-contracts.test.mjs`
- `tests/ops-integration-contracts.test.mjs`

## Verification Plan

- `npm run test:contracts`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run verify`
- `npm run launch:gate`
- Local rendered checks for `/rent-equipment`, `/rent-equipment?query=harvesters`, `/rent-equipment?query=tractors`, and `/forgot-password/verify-otp`.
- Live smoke checks after Firebase App Hosting rollout.
