# Owner Listing Route, Upload Loader, and Workspace Footer Fix

## Scope

- Localized the `/forgot-password/success` security note so Marathi mode no longer leaves that paragraph in English.
- Moved the real listing editor into `/owner-profile/list-equipment` and kept `/list-equipment` as a compatibility redirect.
- Added a proxy-level redirect for authenticated legacy `/list-equipment?listingId=<id>` requests so the route redirects before App Router rendering.
- Increased the Server Actions body limit for three real listing photos and added visible photo-upload progress in the listing form.
- Added visible profile-photo upload progress on owner/renter settings.
- Updated the owner/renter workspace footer copy to `© 2026 Kisan Kamai. Rooted in Trust. Built with care for Bharat.🇮🇳`.
- Prioritized `/favicon.ico` as the first cart-icon metadata and manifest icon for browser/search discovery.
- Aligned the workspace portal label under the cart mark start.

## Notes

- Google Search favicon changes can still depend on Google's crawl/cache timing. The live site now exposes `/favicon.ico` as the cart PNG and advertises it first in metadata.
- `/owner-profile/list-equipment` remains protected by server-side session verification. The legacy `/list-equipment` route is not an owner editor anymore.
