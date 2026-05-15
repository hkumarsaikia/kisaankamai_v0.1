# Google Search Thumbnail Removal

## Scope

Google search was showing a right-side image thumbnail for the Kisan Kamai
result. The request was to remove that Google result thumbnail while keeping
the normal cart favicon work intact.

## Root Cause

The root layout advertised:

```html
<meta name="robots" content="index,follow,max-image-preview:large" />
```

That tells Google it may show large image previews in search results. The
right-side thumbnail is separate from the small favicon slot.

## Change

- Changed the root robots directive to `index,follow,max-image-preview:none`.
- Kept `og:image`, `twitter:image`, `thumbnail`, and `image_src` metadata so
  external social previews can still render rich link cards.
- Updated the SEO contract test to guard against returning to
  `max-image-preview:large`.

## Verification

- `node --test tests/seo-contracts.test.mjs`
- Full release verification should confirm the live homepage contains
  `max-image-preview:none` and no longer contains `max-image-preview:large`.

## Operational Note

This is the correct crawl signal to remove Google image previews. The visible
Google search result can still lag until Google recrawls the page and refreshes
its cached result presentation.
