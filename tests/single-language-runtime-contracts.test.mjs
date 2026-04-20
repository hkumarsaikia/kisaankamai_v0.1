import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("root layout installs the single-language runtime inside the language provider", async () => {
  const source = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(source, /import \{ SingleLanguageRuntime \} from "@\/components\/SingleLanguageRuntime";/);
  assert.match(source, /<LanguageProvider>\s*<SingleLanguageRuntime \/>/s);
});

test("single-language runtime watches DOM mutations and translates visible text and attributes", async () => {
  const source = await readFile(
    new URL("../components/SingleLanguageRuntime.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /new MutationObserver/);
  assert.match(source, /translateText\(sourceValue\)/);
  assert.match(source, /attributeFilter: \[\.\.\.BASE_TRANSLATABLE_ATTRIBUTES, "value"\]/);
  assert.match(source, /material-symbols-outlined/);
});

test("profile dropdown keeps owner and renter labels and descriptions aligned to the corrected routes", async () => {
  const [dropdownSource, manualMessagesSource] = await Promise.all([
    readFile(new URL("../components/ProfileDropdownMenu.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/i18n.manual.ts", import.meta.url), "utf8"),
  ]);

  assert.match(dropdownSource, /resolvePortalHref\("owner"\)/);
  assert.match(dropdownSource, /resolvePortalHref\("renter"\)/);
  assert.match(dropdownSource, /t\("header.dropdown.renter_profile"\)/);
  assert.match(dropdownSource, /t\("header.desc.manage_your_fleet"\)/);
  assert.match(dropdownSource, /t\("header.desc.your_bookings_and_equipment"\)/);
  assert.match(manualMessagesSource, /"header.dropdown.renter_profile": "Renter Profile"/);
  assert.match(manualMessagesSource, /"header.dropdown.renter_profile": "भाडेकरू प्रोफाइल"/);
});
