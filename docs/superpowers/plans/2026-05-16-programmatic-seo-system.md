# Programmatic SEO System Implementation Plan

**Superseded:** The live `/catalog/[slug]` category-page rollout was reverted by
`docs/superpowers/plans/2026-05-16-catalog-redirect-restore.md`. Current catalog
routes are redirect-only compatibility routes.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a safe programmatic SEO foundation around existing equipment category data without generating thin or duplicate location pages.

**Architecture:** Use the existing `/catalog/[slug]` route as the category-spoke template, backed by a source-controlled pSEO data module and live listing counts from Firestore. Keep `/categories` as the hub, include only approved category spokes in the sitemap, and link each spoke to filtered live inventory through `/rent-equipment?query=...`.

**Tech Stack:** Next.js App Router, TypeScript, React server components, existing Kisan Kamai metadata helpers, Firebase-backed live equipment reads, source-level contract tests.

---

### Task 1: Contract Tests

**Files:**
- Modify: `tests/seo-contracts.test.mjs`

- [x] Add a test proving `/catalog/[slug]` is a real programmatic category route, not a redirect-only stub.
- [x] Assert pSEO config exists, limits indexable routes to approved equipment categories, includes unique titles/descriptions, emits schema, and avoids category-location route generation.
- [x] Run `node --test tests/seo-contracts.test.mjs` and verify the new test fails before implementation.

### Task 2: Programmatic Category Data

**Files:**
- Create: `lib/programmatic-seo.ts`

- [x] Add source-controlled category page config for existing baseline categories only.
- [x] Include title, meta description, intro, use cases, safety note, and related category slugs.
- [x] Export helpers for resolving valid category pages, building category URLs, and returning indexable category entries.
- [x] Do not create location/category permutations.

### Task 3: Category Page Template

**Files:**
- Modify: `app/catalog/[slug]/page.tsx`

- [x] Replace redirect-only behavior with a server-rendered category landing page.
- [x] Generate metadata per category with canonical `/catalog/[slug]`.
- [x] Render unique page content, live count, sample listings when available, related categories, and CTA links to `/rent-equipment?query=slug`.
- [x] Emit CollectionPage/BreadcrumbList JSON-LD using only visible facts.
- [x] Return `notFound()` for unknown slugs.

### Task 4: Sitemap and Internal Links

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/categories/page.tsx`
- Modify: `docs/SEO.md`

- [x] Add indexable `/catalog/[slug]` category pages to sitemap.
- [x] Link category hub cards to `/catalog/[slug]` instead of query URLs.
- [x] Document that location pages remain deferred until there is enough unique local inventory and copy.

### Task 5: Verification and Release

**Files:**
- Test: `tests/seo-contracts.test.mjs`

- [x] Run `node --test tests/seo-contracts.test.mjs`.
- [x] Run `npm run test:contracts`.
- [x] Run `npm run verify`.
- [x] Run `npm run launch:gate` before release/deploy if committing.
- [x] Commit only scoped pSEO files; leave unrelated local skill files untouched.
