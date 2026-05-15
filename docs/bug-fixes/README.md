# Bug-Fix Evidence Bundles

This directory contains timestamped operational records for bug-fix work that
needs source, generated artifact, verification, or review evidence to travel
with the repo.

## Convention

Use this shape:

```text
docs/bug-fixes/<YYYY-MM-DD-HHMMSS-TZ>-<short-slug>/
  README.md
  operations/
  generated/
```

## Rules

- Keep canonical source files in their normal app paths.
- Keep generated files used by tests or documentation in their canonical paths.
- Store timestamped copies, manifests, and verification summaries here.
- Do not commit local credentials, passwords, OTP notes, or real webhook secrets.
- Include CodeRabbit/manual review evidence when a bug fix was review-driven.

## Current Bundles

- `2026-05-15-223357-IST-google-search-thumbnail-removal/`: changed Google crawler image preview policy to remove search-result thumbnails while preserving social share images.
- `2026-05-15-214533-IST-google-search-favicon-ico/`: real ICO favicon signal for Google/browser favicon discovery, metadata and manifest type correction, and agent-browser validation.
- `2026-05-15-151019-IST-owner-listing-upload-route/`: owner workspace listing route, three-photo upload body limit, listing/profile upload loaders, workspace footer copy, and favicon priority.
- `2026-05-14-215020-IST-global-view-transitions/`: native React view transitions enabled across public and workspace routes with persistent chrome isolation.
- `2026-05-13-002923-IST-performance-dark-mode-qa/`: dark-mode contrast fix for forgot-password, Material Symbols font subsetting, root font preload cleanup, and Lighthouse evidence for home and rent-equipment.
- `2026-05-12-232805-IST-live-cache-freshness/`: verified live no-store headers and added a build-info freshness monitor so already-open tabs reload after newer App Hosting rollouts.
- `2026-05-12-224733-IST-share-previews-cache-disclaimer/`: centered the how-it-works disclaimer card, moved public routes to App Router metadata layouts, added page-specific social thumbnails, and added deployment-versioned share image cache busting.
- `2026-05-12-213622-IST-complete-profile-partner-submit/`: removed the active complete-profile route and fixed the partner enquiry submit loader/null-reset failure.
- `2026-05-12-203514-IST-home-testimonial-html-port/`: homepage testimonial-card HTML port with simplified heading copy and public card badges/tags removed.
- `2026-05-12-174051-IST-review-card-polish/`: homepage review-card label cleanup and card styling refinement so public cards no longer display sample badges.
- `2026-05-12-170642-IST-share-preview-marathi-reviews/`: dedicated Open Graph/Twitter share image, realistic homepage review cards, and explicit Marathi labels for owner-benefits, about, and rent-equipment surfaces.
- `2026-05-12-154617-IST-scalability-live-audit/`: live frontend/UI scan, Lighthouse scaling evidence, and targeted Firestore read optimization for owner/renter workspace booking enrichment.
- `2026-05-12-115707-IST-live-performance-workspace-audit/`: live final-account E2E hardening, password-reset duplicate-phone fix, Lighthouse accessibility/SEO patches, and performance evidence for home and rent-equipment.
- `2026-05-12-103648-IST-home-farmer-rating-tiles/`: Homepage Cropin-inspired section refinement that restores farmer rating style tiles without unsupported named testimonials or numeric claims.
- `2026-05-12-084714-IST-cropin-motion-scalability/`: Cropin-inspired motion timing, route transition flow, self-hosted icon font, status-filtered public listing reads, and empty rent-equipment spacing.
- `2026-05-08-235352-IST-code-review-hardening/`: booking transition hardening, sort-menu accessibility, production dependency cleanup, site-map regeneration, and CodeRabbit verification.
