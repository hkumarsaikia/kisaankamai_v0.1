import { GoogleAuth, JWT } from "google-auth-library";
import finalTestManifest from "../data/final-test-accounts-manifest.json" with { type: "json" };
import { parseArgs, printUsage, getBooleanOption } from "./lib/cli.mjs";
import { getFirebaseAdminConfig, loadRepoEnv } from "./lib/env.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/configure-firebase-phone-test-numbers.mjs [--dry-run]",
    "",
    "Configures the final owner/renter Firebase Auth fictional phone numbers for deterministic OTP E2E.",
  ]);
  process.exit(0);
}

loadRepoEnv();

const dryRun = getBooleanOption(options, "dry-run", false);
const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

function normalizePhoneE164(input) {
  const trimmed = String(input || "").trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("+")) {
    return `+${trimmed.replace(/\D/g, "")}`;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  return `+${digits}`;
}

function testPhoneNumbersFromManifest() {
  return {
    [normalizePhoneE164(finalTestManifest.owner.phone)]: finalTestManifest.owner.otpCode,
    [normalizePhoneE164(finalTestManifest.renter.phone)]: finalTestManifest.renter.otpCode,
  };
}

async function getAccessToken() {
  const config = getFirebaseAdminConfig();

  if (config.clientEmail && config.privateKey) {
    const client = new JWT({
      email: config.clientEmail,
      key: config.privateKey,
      scopes: [CLOUD_PLATFORM_SCOPE],
    });
    const token = await client.getAccessToken();
    return typeof token === "string" ? token : token?.token || "";
  }

  const auth = new GoogleAuth({
    scopes: [CLOUD_PLATFORM_SCOPE],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return typeof token === "string" ? token : token?.token || "";
}

async function getIdentityToolkitConfig({ projectId, accessToken }) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Could not read Identity Toolkit config (${response.status}): ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function patchIdentityToolkitTestNumbers({ projectId, accessToken, testPhoneNumbers }) {
  const updateMask = "signIn.phoneNumber.testPhoneNumbers";
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config?updateMask=${encodeURIComponent(
      updateMask
    )}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signIn: {
          phoneNumber: {
            testPhoneNumbers,
          },
        },
      }),
    }
  );
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Could not update Identity Toolkit config (${response.status}): ${JSON.stringify(payload)}`);
  }

  return payload;
}

const config = getFirebaseAdminConfig();
const testPhoneNumbers = testPhoneNumbersFromManifest();
const accessToken = await getAccessToken();

if (!accessToken) {
  throw new Error("Could not acquire a Google Cloud access token for Identity Toolkit config.");
}

const currentConfig = await getIdentityToolkitConfig({
  projectId: config.projectId,
  accessToken,
});
const currentTestNumbers = currentConfig?.signIn?.phoneNumber?.testPhoneNumbers || {};
const mergedTestNumbers = {
  ...currentTestNumbers,
  ...testPhoneNumbers,
};

if (dryRun) {
  console.log(
    JSON.stringify(
      {
        projectId: config.projectId,
        dryRun: true,
        wouldEnsure: Object.keys(testPhoneNumbers),
        currentCount: Object.keys(currentTestNumbers).length,
        nextCount: Object.keys(mergedTestNumbers).length,
      },
      null,
      2
    )
  );
  process.exit(0);
}

await patchIdentityToolkitTestNumbers({
  projectId: config.projectId,
  accessToken,
  testPhoneNumbers: mergedTestNumbers,
});

console.log(
  JSON.stringify(
    {
      projectId: config.projectId,
      configured: true,
      ensured: Object.keys(testPhoneNumbers),
      totalCount: Object.keys(mergedTestNumbers).length,
    },
    null,
    2
  )
);
