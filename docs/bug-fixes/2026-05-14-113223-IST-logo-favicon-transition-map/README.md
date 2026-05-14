# Logo, Favicon, Transition, and Map Alignment Fix

## Scope

- Port the supplied `/home/hkuma/Pictures/Screenshots/logo.html` logo treatment
  more faithfully into the React logo component.
- Remove the Kisan Kamai wordmark dot and remove the extra icon glow/background.
- Keep `Kisan Kamai Smart Equipment Rental` visible in the header and profile
  workspace sidebar logo.
- Restore the older footer text wordmark instead of the full logo component.
- Add crawlable brand tractor favicon assets for browser tabs, manifest, and
  search favicon discovery.
- Remove the center route-transition wheel while retaining the top progress
  transition.
- Strengthen Google Maps overlay centering for the `Use ctrl + scroll to zoom
  the map` message.
- Remove requested register and partner wording.

## Verification

Local checks completed:

- Source contracts for logo, favicon, transition, map overlay, register copy,
  and partner copy passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Playwright rendered QA passed against `http://localhost:3000` using system
  Chrome:
  - public home header logo, footer wordmark, and favicon links
  - register stale phone-verification copy removed
  - partner form heading no longer contains `Premium`
  - route transition no longer exposes the center wheel pseudo element
  - injected Google Maps overlay text centers correctly
  - authenticated owner workspace renders the full sidebar logo after creating
    a Firebase-backed session cookie

Release gates to run before deployment:

```bash
npm run test:contracts
npm run typecheck
npm run build
npm run verify
npm run launch:gate
```

Live smoke targets:

- `https://www.kisankamai.com/`
- `https://www.kisankamai.com/register`
- `https://www.kisankamai.com/partner`
- `https://www.kisankamai.com/rent-equipment`
- `https://www.kisankamai.com/owner-profile`
- `https://www.kisankamai.com/renter-profile`
