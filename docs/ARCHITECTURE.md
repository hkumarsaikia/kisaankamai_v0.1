# Architecture

## Production Runtime

The root app is the only public runtime.

- Hosting: Firebase App Hosting
- Auth: Firebase Auth with Admin-verified session cookies, phone verification for registration, and password login through registered mobile numbers only
- Data: Firestore
- Uploads: Firebase Cloud Storage
- Notifications: Firestore notification inbox plus Firebase Cloud Messaging web push
- Reporting mirror: Google Sheets (best-effort only, not the database of record)
- Diagnostics: local runtime logging for development, Firebase/Sentry-oriented hooks for hosted environments

## Data Contract

- Firebase is the primary runtime backend and the source of truth for auth, profiles, listings, bookings, offline booking-value records, saved items, submissions, and bug reports. Kisan Kamai does not collect, process, refund, or settle money on-platform; owner/renter money handling is direct and offline. Legacy `payments` records are compatibility booking-value mirrors only; new records use booking statuses and `Direct Settlement`.
- Registration does not choose an owner/renter workspace inline. New users complete auth/profile creation first, then choose the active workspace through `/profile-selection`.
- Optional email is profile metadata and uniqueness-reserved when provided; it is not a public login credential.
- Public equipment and category pages are generated from complete active Firestore listings only; archived seed/mock listings must stay paused or absent from the public active query set.
- Booking status mutations are centralized in the server data layer and checked against an actor/current-status transition matrix. Owners can progress or cancel eligible owned bookings, renters can cancel eligible own bookings, and terminal states such as `completed` and `cancelled` cannot be moved back into active states by crafted client/server-action calls.
- Booking and listing update notifications first persist unread inbox records in Firestore, then use Firebase Cloud Messaging for browser push delivery when the user has enabled device notifications. The profile dropdown shows the total unread count, refreshes the inbox while the session is active, and marks records read through the notification APIs. Phone-message providers are not part of the active runtime yet.
- Language preference is mirrored in the `kk_language` cookie and browser storage so the server-rendered route tree and client language provider start in the same language.
- Client bug reports are throttled and deduplicated in the browser before the Firestore-backed reporting API applies its server rate limit. The browser budget persists in `localStorage` across route reloads to keep QA crawls from exhausting the server limiter. Web-vitals reports are limited to poor-rated metrics so normal needs-improvement observations do not become production noise.
- Google Sheets mirroring is intentional. It runs after Firebase persistence for admin/reporting visibility and must remain best-effort.
- A Google Sheets outage or misconfiguration must not block a successful Firebase-backed write path.

## Performance Contract

- Anonymous public requests should avoid unnecessary Firebase session work. The root layout only imports the session resolver when a valid-looking `kisan_kamai_session` cookie is present.
- Generated site imagery is stored as optimized WebP siblings and routed through `assetPath(...)`; uploaded equipment photos remain untouched so owner media paths continue to match Firebase Storage URLs.
- Material Symbols are self-hosted from `/public/fonts/material-symbols-outlined.woff2` and preloaded by the root layout. Do not switch the site back to a remote-only icon stylesheet; if that request is blocked or delayed, icon ligature names can become visible text.
- Public listing discovery uses the cached public equipment loader and first narrows Firestore reads to `active` and `paused` listings. If that status-filtered query fails in a misconfigured environment, the loader falls back to the full scan and reports the fallback through server observability.
- Global UI motion uses the shared Kisan Kamai flow tokens in `app/globals.css`, the route transition provider, and the scroll reveal components. Route swaps, profile dropdowns, depth tiles, and scroll-reveal sections should use compositor-friendly opacity and transform transitions, with the reduced-motion guard preserved.

## Root App Boundaries

- `lib/server/local-auth.ts` is the server auth facade used by the root app.
- `lib/server/local-data.ts` is the root data facade and currently re-exports the Firebase-backed implementation.
- Root API routes and server actions now assume the server runtime only.
- UI affordances such as approve/decline buttons must mirror server permissions, but server mutations remain the source of authorization and state-transition truth.

## Deployment Shape

- Live site: `https://www.kisankamai.com`
- Apex redirect target: `https://www.kisankamai.com`
- Root App Hosting config: `apphosting.yaml`
