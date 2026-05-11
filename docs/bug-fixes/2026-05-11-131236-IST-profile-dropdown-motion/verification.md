# Profile Dropdown Motion Fix

## Scope

This record covers the May 11, 2026 profile dropdown motion fix for the live header profile tile and dropdown menu.

## Root Cause

- The compact profile pill reused the global `.kk-depth-tile` interaction that is tuned for larger content cards.
- The global card interaction applies pointer-driven tilt and an 8px lift, which feels too jumpy on a small fixed header control.
- The dropdown panel used a short scale-pop animation, so the menu appeared abruptly instead of flowing from the profile trigger.

## Fix

- Kept the existing profile dropdown structure and routes.
- Marked the profile trigger with `data-depth-motion="static"` so the global pointer-tilt listener ignores it.
- Added a profile-trigger-specific depth treatment with a 2px lift, softer shadow, and no pointer rotation.
- Changed the dropdown enter/exit timing to a softer anchored reveal.

## Verification Plan

- Source contracts must assert the profile trigger opts out of pointer tilt and uses profile-specific motion.
- Rendered browser QA must log in with a final test account, hover the profile trigger, open the dropdown, and confirm:
  - The trigger transform uses only a small vertical translation.
  - The dropdown uses the new `kk-profile-dropdown-enter` animation.
  - Desktop and mobile profile dropdowns remain visible and readable.
  - No framework overlay or relevant console errors appear.
