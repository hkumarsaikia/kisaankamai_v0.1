import path from "node:path";
import { loadRuntimeEnv, requireEnv, resolveFromRoot } from "./shared-env.mjs";

function normalizePhoneE164(input) {
  const trimmed = input.trim();
  if (!trimmed.startsWith("+")) {
    throw new Error(`Expected E.164 phone number, received: ${input}`);
  }

  return `+${trimmed.replace(/\D/g, "")}`;
}

export async function getDemoSeedConfig() {
  await loadRuntimeEnv();

  const seedBatchId =
    process.env.KK_SEED_BATCH_ID ||
    `kk-demo-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;

  return {
    seedBatchId,
    seedSource: "demo-seed",
    owner: {
      uid: "demo-owner-kisankamai",
      email: requireEnv("KK_TEST_OWNER_EMAIL"),
      password: requireEnv("KK_TEST_OWNER_PASSWORD"),
      phoneE164: normalizePhoneE164(requireEnv("KK_TEST_OWNER_PHONE_E164")),
      otpCode: requireEnv("KK_TEST_OWNER_OTP_CODE"),
      fullName: "Sanjay Patil",
      village: "Mukhed",
      address: "Mukhed, Nanded, Maharashtra",
      pincode: "431715",
      fieldArea: 18,
      rolePreference: "owner",
    },
    renter: {
      uid: "demo-renter-kisankamai",
      email: requireEnv("KK_TEST_RENTER_EMAIL"),
      password: requireEnv("KK_TEST_RENTER_PASSWORD"),
      phoneE164: normalizePhoneE164(requireEnv("KK_TEST_RENTER_PHONE_E164")),
      otpCode: requireEnv("KK_TEST_RENTER_OTP_CODE"),
      fullName: "Rajesh Kulkarni",
      village: "Kalwan",
      address: "Kalwan, Nashik, Maharashtra",
      pincode: "423501",
      fieldArea: 9,
      rolePreference: "renter",
    },
    manifestPath: resolveFromRoot("logs", "runtime", "seed-manifests", `${seedBatchId}.json`),
    dataPaths: {
      users: resolveFromRoot("data", "users.json"),
      profiles: resolveFromRoot("data", "profiles.json"),
      listings: resolveFromRoot("data", "listings.json"),
      bookings: resolveFromRoot("data", "bookings.json"),
      payments: resolveFromRoot("data", "payments.json"),
      savedItems: resolveFromRoot("data", "saved-items.json"),
      submissions: resolveFromRoot("data", "form-submissions.json"),
    },
    docs: {
      goDaddyRunbook: path.join("docs", "RUNBOOK_GODADDY_FIREBASE_DOMAIN_MIGRATION.md"),
    },
  };
}
