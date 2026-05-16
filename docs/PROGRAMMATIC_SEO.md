# Programmatic SEO Strategy

Kisan Kamai uses programmatic SEO only where the page has enough specific value
to help a farmer or equipment owner. The current safe implementation is an
equipment-category hub-and-spoke system.

## Implemented Opportunity

### Equipment Category Pages

Route pattern:

```text
/catalog/[slug]
```

Approved indexable slugs are sourced from `lib/programmatic-seo.ts` and mirror
the baseline equipment categories already used across the marketplace:

- `tractors`
- `harvesters`
- `implements`
- `ploughs`
- `sprayers`
- `rotavators`
- `seeders`
- `threshers`
- `pumps`
- `balers`
- `trolleys`

Each category page includes:

- unique title and meta description
- category-specific intro, use cases, selection tips, and safety note
- live public listing count from Firestore
- up to six live public listing cards when inventory exists
- links to the live inventory search page
- links to related category pages
- `CollectionPage` JSON-LD
- `BreadcrumbList` JSON-LD
- sitemap inclusion through `app/sitemap.ts`

The category hub at `/categories` links to these pages, making the pages
reachable without relying only on XML sitemap discovery.

## Deferred Opportunities

### Category + Location Pages

Pattern:

```text
/catalog/[category]/[district]
```

Status: deferred.

Reason: generating pages for every equipment category and Maharashtra district
would create many low-value pages unless each page has enough real local
inventory, local copy, and useful service-area data.

Minimum data threshold before indexing a category-location page:

- at least three public listings matching the category and district, or
- one public listing plus manually reviewed local guidance, support coverage,
  and nearby-category links
- page-specific title, description, intro, local availability note, and related
  nearby alternatives
- no fake availability, rankings, testimonials, price claims, or guarantees

Pages below the threshold should not be created or should remain `noindex`.

### Equipment Comparison Pages

Pattern:

```text
/compare/[equipment-a]-vs-[equipment-b]
```

Status: deferred.

Reason: the product does not yet store enough normalized comparison attributes
across listings to make these pages reliable.

Required data before implementation:

- normalized category, horsepower/capacity, unit rate, availability, and use
  cases
- enough live listings in both compared groups
- editorial guidance that explains when each option is suitable

## Indexation Safeguards

- Only `getIndexableProgrammaticCategoryPages()` feeds the sitemap.
- Unknown `/catalog/[slug]` routes return `notFound()`.
- Query URLs such as `/rent-equipment?query=tractors` remain live inventory
  actions, not canonical category landing pages.
- No category-location pages are generated in the current implementation.
- Auth, workspace, form, and utility pages remain excluded from the sitemap.

## Maintenance

When adding a new baseline equipment category:

1. Add the category to `BASE_EQUIPMENT_CATEGORIES`.
2. Add a matching entry in `PROGRAMMATIC_CATEGORY_PAGES`.
3. Add unique title, meta description, intro, use cases, tips, safety note, and
   related categories.
4. Run `node --test tests/seo-contracts.test.mjs`.
5. Run `npm run test:contracts`.
6. Run `npm run verify`.

Do not add bulk routes from keyword ideas alone. The route must be backed by
useful first-party inventory or reviewed editorial data.
