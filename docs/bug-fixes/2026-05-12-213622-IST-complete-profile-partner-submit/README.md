# Complete Profile Removal and Partner Submit Fix

## Scope

- Removed the active `/complete-profile` App Router page so the live website returns the normal not-found route for that URL.
- Updated login, Google-auth, and verify-contact links so no active user flow sends users to `/complete-profile`.
- Fixed the `/partner` partnership enquiry form by keeping a stable form reference across the async submit lifecycle.
- Added a visible submit loader and disabled state to the partnership enquiry button.
- Regenerated the static site-map docs after removing the route.

## Root Cause

The partner form called `event.currentTarget.reset()` after awaiting the backend request. React event targets are not safe to depend on after the async boundary in this flow, so successful submissions could throw `Cannot read properties of null (reading 'reset')` after the backend accepted the request.

## Data Flow

`/partner` continues to submit through:

```text
Partner page form
  -> /api/forms/partner-inquiry
  -> createSubmissionRecord(type: "partner-inquiry")
  -> Firestore form-submissions
  -> Sheets mirror for partner enquiries
```

No backend schema or database collection was removed. Only the obsolete profile-completion page and active redirects to it were removed.

