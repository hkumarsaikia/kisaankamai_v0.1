import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const asyncPostJsonForms = [
  "components/Footer.tsx",
  "app/support/page.tsx",
  "app/coming-soon/page.tsx",
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
