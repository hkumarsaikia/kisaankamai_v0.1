import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readSource(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("icon font is self-hosted and preloaded instead of remote-only", async () => {
  const [layout, globals] = await Promise.all([
    readSource("../app/layout.tsx"),
    readSource("../app/globals.css"),
  ]);

  assert.match(layout, /href="\/fonts\/material-symbols-outlined\.woff2"/);
  assert.match(layout, /rel="preload"/);
  assert.doesNotMatch(layout, /data-kk-material-symbols/);
  assert.match(globals, /@font-face[\s\S]*Material Symbols Outlined[\s\S]*\/fonts\/material-symbols-outlined\.woff2/);
});

test("page swaps and reveal animations use shared flow motion tokens", async () => {
  const [globals, navProvider, routeShell, scrollReveal, navTransition] = await Promise.all([
    readSource("../app/globals.css"),
    readSource("../components/NavigationTransitionProvider.tsx"),
    readSource("../components/RouteTransitionShell.tsx"),
    readSource("../components/ScrollReveal.tsx"),
    readSource("../lib/client/navigationTransition.ts"),
  ]);

  assert.match(globals, /--kk-ease-flow:\s*cubic-bezier\(0\.3,\s*1\.1,\s*0\.4,\s*1\)/);
  assert.match(globals, /@keyframes kk-route-veil/);
  assert.match(globals, /@keyframes kk-route-bar/);
  assert.match(navProvider, /kk-route-transition-bar/);
  assert.match(navProvider, /kk-route-transition-veil/);
  assert.match(routeShell, /y:\s*prefersReducedMotion \? 0 : 10/);
  assert.match(scrollReveal, /FLOW_EASE/);
  assert.match(scrollReveal, /scale:\s*0\.985/);
  assert.match(navTransition, /PAGE_ENTER_DURATION_SECONDS\s*=\s*0\.42/);
});

test("tile depth motion is requestAnimationFrame throttled for dense pages", async () => {
  const depthMotion = await readSource("../components/DepthMotion.tsx");

  assert.match(depthMotion, /requestAnimationFrame\(applyPointerMove\)/);
  assert.match(depthMotion, /cancelAnimationFrame\(animationFrame\)/);
  assert.match(depthMotion, /document\.addEventListener\("pointermove", handlePointerMove, \{ passive: true \}\)/);
});

test("homepage restores farmer rating cards with refined Cropin-style surface treatment", async () => {
  const [homeSource, globals] = await Promise.all([
    readSource("../app/page.tsx"),
    readSource("../app/globals.css"),
  ]);

  assert.match(homeSource, /farmerRatingTiles/);
  assert.match(homeSource, /kk-farmer-rating-section/);
  assert.match(homeSource, /kk-farmer-rating-card/);
  assert.match(homeSource, /Farmer ratings/);
  assert.match(homeSource, /SharedIcon key=\{\`\$\{item\.titleEn\}-star-\$\{starIndex\}\`\} name="star"/);
  assert.match(homeSource, /aria-hidden="true"[\s\S]*SharedIcon key=\{\`\$\{item\.titleEn\}-star-\$\{starIndex\}\`\} name="star"/);
  assert.doesNotMatch(homeSource, /platformUseCases/);
  assert.match(globals, /\.kk-farmer-rating-section/);
  assert.match(globals, /\.kk-farmer-rating-card::after/);
});

test("public equipment loading narrows Firestore reads before fallback", async () => {
  const firebaseData = await readSource("../lib/server/firebase-data.ts");

  assert.match(firebaseData, /\.where\("status", "in", \["active", "paused"\]\)/);
  assert.match(firebaseData, /listAllListings\.statusFilteredFallback/);
  assert.match(firebaseData, /snapshot = await listingsCollection\(\)\.get\(\)/);
});

test("workspace booking enrichment fetches only related listing and profile records", async () => {
  const firebaseData = await readSource("../lib/server/firebase-data.ts");

  assert.match(firebaseData, /FIRESTORE_TARGETED_READ_CHUNK_SIZE\s*=\s*50/);
  assert.match(firebaseData, /async function listListingsByIds\(listingIds: string\[\]\)/);
  assert.match(firebaseData, /listListingsByIds\(bookings\.map\(\(booking\) => booking\.listingId\)\)/);
  assert.match(firebaseData, /listProfilesByUserIds\(bookings\.map\(\(booking\) => booking\.renterUserId\)\)/);
  assert.match(firebaseData, /listProfilesByUserIds\(bookings\.map\(\(booking\) => booking\.ownerUserId\)\)/);
  assert.doesNotMatch(firebaseData, /getOwnerBookings[\s\S]*?listAllProfiles\(\)[\s\S]*?export async function getRenterBookings/);
  assert.doesNotMatch(firebaseData, /getRenterBookings[\s\S]*?listAllListings\(\)[\s\S]*?export async function getRenterSavedListings/);
  assert.doesNotMatch(firebaseData, /getRenterSavedListings[\s\S]*?listAllListings\(\)[\s\S]*?export async function getOwnerPayments/);
});

test("empty rent-equipment pages reserve footer separation", async () => {
  const rentView = await readSource("../app/rent-equipment/RentEquipmentView.tsx");

  assert.match(rentView, /min-h-\[calc\(100svh-5rem\)\]/);
  assert.match(rentView, /md:pb-24/);
  assert.match(rentView, /flex-1 flex-col items-center/);
});
