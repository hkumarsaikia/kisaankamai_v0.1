import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const asyncPostJsonForms = [
  "components/Footer.tsx",
  "app/support/page.tsx",
  "app/coming-soon/page.tsx",
  "app/catalog/[slug]/CatalogBookingForm.tsx",
  "components/profile/ProfileSupportWorkspace.tsx",
  "components/profile/ProfileFeedbackForm.tsx",
];

const asyncActionForms = [
  "app/complete-profile/page.tsx",
  "app/equipment/[id]/EquipmentDetailClient.tsx",
  "components/forms/OwnerListingWizard.tsx",
  "components/owner-profile/ListEquipmentEditorPage.tsx",
  "components/profile/ProfileSettingsForm.tsx",
];

test("async JSON form submissions use explicit submitting state instead of React transitions", async () => {
  for (const path of asyncPostJsonForms) {
    const file = await source(path);

    assert.match(file, /postJson/, `${path} should still post through the shared JSON client`);
    assert.doesNotMatch(file, /useTransition/, `${path} must not use useTransition for network form lifecycle`);
    assert.doesNotMatch(file, /startTransition\s*\(\s*async/, `${path} must not wrap async form POSTs in startTransition`);
    assert.match(file, /isSubmitting/, `${path} should expose a real request-lifecycle submitting flag`);
    assert.match(file, /setIsSubmitting\(true\)/, `${path} should set submitting before the request`);
    assert.match(file, /finally\s*\{[\s\S]*setIsSubmitting\(false\)/, `${path} should clear submitting in finally`);
  }
});

test("async server-action form submissions also use explicit request lifecycle state", async () => {
  for (const path of asyncActionForms) {
    const file = await source(path);

    assert.match(file, /<form|handleSubmit|handleBookingRequest/, `${path} should still contain a form submit flow`);
    assert.doesNotMatch(file, /useTransition/, `${path} must not use useTransition for async form submission state`);
    assert.doesNotMatch(file, /startTransition\s*\(\s*async/, `${path} must not wrap async form actions in startTransition`);
    assert.match(file, /isSubmitting/, `${path} should expose a real request-lifecycle submitting flag`);
    assert.match(file, /setIsSubmitting\(true\)/, `${path} should set submitting before the request`);
    assert.match(file, /finally\s*\{[\s\S]*setIsSubmitting\(false\)/, `${path} should clear submitting in finally`);
  }
});

test("booking submissions remain valid after the visible Work Type field was removed from detail pages", async () => {
  const [validation, actions, route, detail] = await Promise.all([
    source("lib/validation/forms.ts"),
    source("lib/actions/local-data.ts"),
    source("app/api/forms/booking-request/route.ts"),
    source("app/equipment/[id]/EquipmentDetailClient.tsx"),
  ]);

  assert.match(validation, /workType:[\s\S]*optional\(\)[\s\S]*or\(z\.literal\(""\)\)/);
  assert.match(actions, /const normalizedWorkType = parsed\.data\.workType \|\| parsed\.data\.task \|\| "General equipment work"/);
  assert.match(actions, /workType: normalizedWorkType/);
  assert.match(actions, /task: parsed\.data\.task \|\| normalizedWorkType/);
  assert.match(route, /const normalizedWorkType = payload\.workType \|\| payload\.task \|\| "General equipment work"/);
  assert.match(route, /workType: normalizedWorkType/);
  assert.match(route, /task: payload\.task \|\| normalizedWorkType/);
  assert.doesNotMatch(detail, /workType:\s*equipment\.workTypes\[0\] \|\| ""/);
});

test("support category placeholders are not submitted as real support categories", async () => {
  const support = await source("app/support/page.tsx");

  assert.match(support, /inquiryType:\s*""/);
  assert.match(support, /<option disabled value="">/);
  assert.match(support, /required[\s\S]*value=\{formState\.inquiryType\}/);
});

test("public and workspace forms surface useful validation errors and accept short real user messages", async () => {
  const [validation, http, support, feedback, feature, partner, catalog] = await Promise.all([
    source("lib/validation/forms.ts"),
    source("lib/server/http.ts"),
    source("components/profile/ProfileSupportWorkspace.tsx"),
    source("components/profile/ProfileFeedbackForm.tsx"),
    source("app/feature-request/page.tsx"),
    source("app/partner/page.tsx"),
    source("app/catalog/[slug]/CatalogBookingForm.tsx"),
  ]);

  for (const [schemaName, fieldName] of [
    ["partnerInquirySchema", "message"],
    ["feedbackSchema", "message"],
    ["supportRequestSchema", "message"],
    ["reportSubmissionSchema", "description"],
    ["featureRequestSchema", "description"],
  ]) {
    const schemaStart = validation.indexOf(`export const ${schemaName}`);
    assert.notEqual(schemaStart, -1, `${schemaName} should exist`);
    const schemaEnd = validation.indexOf("export const", schemaStart + 1);
    const schemaBlock = validation.slice(schemaStart, schemaEnd === -1 ? undefined : schemaEnd);
    const fieldIndex = schemaBlock.indexOf(`${fieldName}:`);
    assert.notEqual(fieldIndex, -1, `${schemaName}.${fieldName} should exist`);
    const fieldBlock = schemaBlock.slice(fieldIndex, fieldIndex + 240);
    assert.doesNotMatch(fieldBlock, /\.min\(10,/, `${schemaName}.${fieldName} should not reject ordinary short user messages`);
    assert.match(fieldBlock, /\.min\([34],/, `${schemaName}.${fieldName} should keep a small non-empty message guard`);
  }

  assert.match(http, /firstFieldErrorMessage/, "server validation should return the first useful field-level message");
  assert.doesNotMatch(http, /parsed\.error\.flatten\(\)\.formErrors\[0\] \|\| "Validation failed\."/);

  for (const file of [support, feedback, feature, partner, catalog]) {
    assert.doesNotMatch(file, /setError\(submitError\.message\)/, "forms should not show a generic Validation failed response when fieldErrors exist");
    assert.match(file, /formatSubmissionError|formatFormError|fieldErrors/, "forms should format field-level submission errors");
  }
});

test("dark workspace form buttons and headings remain readable in dark mode", async () => {
  const [support, feedback] = await Promise.all([
    source("components/profile/ProfileSupportWorkspace.tsx"),
    source("components/profile/ProfileFeedbackForm.tsx"),
  ]);

  assert.doesNotMatch(support, /text-primary-container/, "support workspace should not use dark green text for headings or contact links on dark cards");
  assert.doesNotMatch(support, /text-on-primary[\s\S]{0,140}bg-primary-container/, "support workspace submit button needs explicit readable text on dark green");
  assert.match(support, /text-white/, "support workspace submit button should keep white text in dark mode");

  assert.doesNotMatch(feedback, /text-on-primary[\s\S]{0,140}bg-primary-container/, "feedback submit button needs explicit readable text on dark green");
  assert.match(feedback, /text-white/, "feedback submit button should keep white text in dark mode");
});

test("profile settings save returns and applies a refreshed session", async () => {
  const [route, form] = await Promise.all([
    source("app/api/profile/complete/route.ts"),
    source("components/profile/ProfileSettingsForm.tsx"),
  ]);

  assert.match(route, /const nextSession = await updateLocalProfile/, "profile save route should keep the refreshed session returned by updateLocalProfile");
  assert.match(route, /session: nextSession/, "profile save route should return the refreshed session");
  assert.match(form, /payload\.session/, "settings form should consume the refreshed session");
  assert.match(form, /setSession\(payload\.session\)/, "settings form should update AuthContext immediately after save");
  assert.match(form, /emitAuthSyncEvent\("session-refresh"\)/, "settings save should broadcast profile changes to other tabs and surfaces");
});

test("Material Symbols stylesheet uses the stable full ligature font request", async () => {
  const layout = await source("app/layout.tsx");

  assert.match(layout, /Material\+Symbols\+Outlined:opsz,wght,FILL,GRAD@24,400,0\.\.1,0&display=swap/);
  assert.doesNotMatch(layout, /icon_names=/);
  assert.doesNotMatch(layout, /materialSymbolIconNames/);
  assert.match(layout, /data-kk-material-symbols="true"/);
  assert.match(layout, /rel="stylesheet"/);
  assert.doesNotMatch(layout, /kk-material-symbols-loader/);
});
