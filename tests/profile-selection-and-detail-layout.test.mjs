import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("profile-selection now includes the shared site footer", async () => {
  const source = await readFile(new URL("../app/profile-selection/page.tsx", import.meta.url), "utf8");

  assert.match(source, /import\s+\{\s*Footer\s*\}\s+from\s+"@\/components\/Footer"/);
  assert.match(source, /<Footer\s*\/>/);
});

test("equipment detail exposes the compact sticky booking layout contract", async () => {
  const [layout, detailSource] = await Promise.all([
    import("../lib/equipment-detail-layout.js"),
    readFile(new URL("../app/equipment/[id]/EquipmentDetailClient.tsx", import.meta.url), "utf8"),
  ]);

  assert.equal(layout.DETAIL_BOOKING_LAYOUT.card, "lg:sticky lg:top-24 lg:max-h-none rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-2xl");
  assert.deepEqual({
    form: layout.DETAIL_BOOKING_LAYOUT.form,
    fields: layout.DETAIL_BOOKING_LAYOUT.fields,
    actions: layout.DETAIL_BOOKING_LAYOUT.actions,
    security: layout.DETAIL_BOOKING_LAYOUT.security,
  }, {
    form: "space-y-4",
    fields: "space-y-3",
    actions: "space-y-3 border-t border-outline-variant bg-surface-container-lowest pt-3",
    security: "mt-4 flex items-center justify-center gap-2 text-xs text-on-surface-variant",
  });
  assert.match(detailSource, /lg:self-start/);
  assert.doesNotMatch(layout.DETAIL_BOOKING_LAYOUT.card, /overflow-y-auto/);
});
