# Programmatic SEO Strategy

Kisan Kamai does not currently publish indexable programmatic SEO landing pages.
The live category experience is the marketplace search page, and the catalog
route family is kept only for compatibility:

```text
/catalog/[slug] -> /rent-equipment?query=<slug>
```

This contract restores the earlier category behavior for links such as
`/catalog/tractors` and `/catalog/balers`: users should land on the filtered
live equipment list, not a separate guide-style category page.

## Current Route Contract

- `/categories` is the public category hub.
- Category cards link directly to `/rent-equipment?query=<slug>`.
- `/catalog/[slug]` redirects to the same filtered search URL.
- `/catalog/[slug]/gallery` also redirects to the filtered search URL.
- `app/sitemap.ts` includes public static routes and public equipment detail
  URLs only; it does not include `/catalog/[slug]`.

## Deferred Opportunities

### Equipment Category Landing Pages

Status: deferred.

Reason: the May 16 category-page experiment changed the live category pages too
much from the earlier marketplace behavior. Any future category SEO rollout must
be explicitly approved before implementation and must preserve the product
experience users expect from category links.

Minimum requirements before reconsidering indexable category pages:

- enough real public inventory for each category
- page-specific title, description, intro, safety notes, and internal links
- visible links to live inventory without replacing the marketplace flow
- reviewed English and Marathi content
- no fake availability, rankings, testimonials, pricing claims, or guarantees
- no duplicate or thin pages in sitemap output

### Category + Location Pages

Pattern:

```text
/catalog/[category]/[district]
```

Status: deferred.

Reason: generating pages for every equipment category and Maharashtra district
would create many low-value pages unless each page has enough real local
inventory, local copy, and useful service-area data.

Pages below the threshold should not be created or should remain `noindex`.

## Indexation Safeguards

- Do not add `/catalog/[slug]` entries to `app/sitemap.ts`.
- Do not recreate `lib/programmatic-seo.ts` without an approved rollout plan.
- Do not link `/categories` cards to `/catalog/[slug]` while catalog routes are
  compatibility redirects.
- Do not generate category-location pages from keyword ideas alone.

## Verification

Before releasing SEO or category-routing changes, run:

```bash
npm run test:contracts
npm run verify
npm run launch:gate
```

After deployment, smoke-check:

```bash
curl -fsSI https://www.kisankamai.com/catalog/tractors | grep -Ei "HTTP/|location:"
curl -fsSI https://www.kisankamai.com/catalog/balers | grep -Ei "HTTP/|location:"
curl -fsS https://www.kisankamai.com/sitemap.xml | grep -q "/catalog/" && echo "unexpected catalog sitemap entry"
```
