import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readSource(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("forgot password success page localizes every visible paragraph", async () => {
  const source = await readSource("../app/forgot-password/success/page.tsx");

  assert.match(source, /langText\(\s*"Keep this password private and contact support immediately if you did not request this reset\./);
  assert.doesNotMatch(source, /text\("Keep this password private/);
});

test("workspace footer uses the requested exact trust copy with India flag", async () => {
  const source = await readSource("../components/owner-profile/OwnerProfileWorkspaceShell.tsx");

  assert.match(source, /© 2026 Kisan Kamai\. Rooted in Trust\. Built with care for Bharat\.🇮🇳/);
  assert.doesNotMatch(source, /Kisan Kamai © 2026 Kisan Kamai\. Rooted in Trust/);
});

test("owner listing editor lives on the owner profile route and the legacy route redirects", async () => {
  const [legacyPage, ownerPage, shell, ownerRegistration, ownerBrowser, overview, proxySource] = await Promise.all([
    readSource("../app/list-equipment/page.tsx"),
    readSource("../app/owner-profile/list-equipment/page.tsx"),
    readSource("../components/owner-profile/OwnerProfileWorkspaceShell.tsx"),
    readSource("../app/owner-registration/page.tsx"),
    readSource("../components/owner-profile/OwnerEquipmentBrowser.tsx"),
    readSource("../components/workspace/OwnerWorkspaceOverview.tsx"),
    readSource("../proxy.js"),
  ]);

  assert.match(legacyPage, /redirect\(`\/owner-profile\/list-equipment\$\{query\}`\)/);
  assert.match(ownerPage, /OwnerProfileWorkspaceShell/);
  assert.match(ownerPage, /activeTab="add-listing"/);
  assert.match(shell, /addListingHref: "\/owner-profile\/list-equipment"/);
  assert.match(ownerRegistration, /redirect\("\/owner-profile\/list-equipment"\)/);
  assert.match(ownerBrowser, /\/owner-profile\/list-equipment\?listingId=\$\{listing\.id\}/);
  assert.doesNotMatch(overview, /href="\/list-equipment"/);
  assert.match(proxySource, /pathname === "\/list-equipment" && hasSession/);
  assert.match(proxySource, /new URL\("\/owner-profile\/list-equipment", request\.url\)/);
  assert.match(proxySource, /redirectUrl\.search = request\.nextUrl\.search/);
});

test("listing uploads have a server-action body limit and visible image upload state", async () => {
  const [config, editor] = await Promise.all([
    readSource("../next.config.mjs"),
    readSource("../components/owner-profile/ListEquipmentEditorPage.tsx"),
  ]);

  assert.match(config, /serverActions:\s*\{[\s\S]*bodySizeLimit:\s*"64mb"/);
  assert.match(editor, /isUploadingImages/);
  assert.match(editor, /Uploading photos/);
  assert.match(editor, /data-uploading=\{isUploadingImages \? "true" : "false"\}/);
  assert.match(editor, /disabled=\{isSubmitting\}/);
});

test("profile photo upload shows a real spinner state while the asset request is pending", async () => {
  const source = await readSource("../components/profile/ProfileSettingsForm.tsx");

  assert.match(source, /isPhotoUploading/);
  assert.match(source, /kk-flow-spinner/);
  assert.match(source, /Uploading profile photo/);
  assert.match(source, /aria-busy=\{isPhotoUploading\}/);
});

test("profile sidebar label aligns with the logo mark start and favicon metadata prioritizes the cart icon", async () => {
  const [shell, layout, manifest] = await Promise.all([
    readSource("../components/owner-profile/OwnerProfileWorkspaceShell.tsx"),
    readSource("../app/layout.tsx"),
    readSource("../app/manifest.ts"),
  ]);

  assert.match(shell, /kk-workspace-brand-block/);
  assert.match(shell, /kk-workspace-portal-label mt-2 pl-1\.5/);
  assert.match(layout, /icon:\s*\[\s*\{\s*url:\s*"\/favicon\.ico"/s);
  assert.match(layout, /rel:\s*"icon"/);
  assert.match(manifest, /src:\s*"\/favicon\.ico"[\s\S]*sizes:\s*"48x48"/);
});
