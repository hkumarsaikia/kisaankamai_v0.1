import "server-only";

import { createSign } from "node:crypto";

type SheetKey =
  | "owners"
  | "renters"
  | "listings"
  | "bookings"
  | "payments"
  | "support_requests"
  | "feedback"
  | "saved_items"
  | "bug_reports"
  | "auth_events"
  | "sync_audit";

type SheetRow = {
  sheet: SheetKey;
  values: unknown[];
};

type SheetDefinition = {
  key: SheetKey;
  title: SheetKey;
  headers: string[];
};

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const SHEET_DEFINITIONS: SheetDefinition[] = [
  {
    key: "owners",
    title: "owners",
    headers: ["timestamp", "uid", "full_name", "email", "phone", "village", "pincode", "workspace", "source"],
  },
  {
    key: "renters",
    title: "renters",
    headers: ["timestamp", "uid", "full_name", "email", "phone", "village", "pincode", "workspace", "source"],
  },
  {
    key: "listings",
    title: "listings",
    headers: ["timestamp", "listing_id", "owner_uid", "name", "category", "location", "district", "price_per_hour", "status", "cover_image"],
  },
  {
    key: "bookings",
    title: "bookings",
    headers: ["timestamp", "booking_id", "listing_id", "owner_uid", "renter_uid", "status", "start_date", "end_date", "amount"],
  },
  {
    key: "payments",
    title: "payments",
    headers: ["timestamp", "payment_id", "booking_id", "owner_uid", "renter_uid", "amount", "status", "method"],
  },
  {
    key: "support_requests",
    title: "support_requests",
    headers: ["timestamp", "submission_id", "user_id", "category", "full_name", "phone", "email", "source_path"],
  },
  {
    key: "feedback",
    title: "feedback",
    headers: ["timestamp", "submission_id", "user_id", "role", "category", "subject", "rating", "contact_me"],
  },
  {
    key: "saved_items",
    title: "saved_items",
    headers: ["timestamp", "saved_item_id", "user_id", "listing_id", "action"],
  },
  {
    key: "bug_reports",
    title: "bug_reports",
    headers: ["timestamp", "bug_id", "severity", "source", "runtime", "pathname", "status_code", "user_id", "fingerprint"],
  },
  {
    key: "auth_events",
    title: "auth_events",
    headers: ["timestamp", "event_type", "user_id", "email", "phone", "workspace", "path", "outcome"],
  },
  {
    key: "sync_audit",
    title: "sync_audit",
    headers: ["timestamp", "entity_type", "entity_id", "destination", "outcome", "note"],
  },
];

const sheetsGlobals = globalThis as typeof globalThis & {
  __kkProdSheetsReady?: Promise<void>;
};

function getSheetId() {
  return process.env.GOOGLE_SHEET_ID || "";
}

function getServiceAccountEmail() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL || "";
}

function getServiceAccountKey() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY || "";
  return key ? key.replace(/\\n/g, "\n") : "";
}

function isSheetsEnabled() {
  return Boolean(getSheetId() && getServiceAccountEmail() && getServiceAccountKey());
}

function sanitizeCell(value: unknown) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function createJwtAssertion() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: getServiceAccountEmail(),
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const input = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claims))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(input);
  signer.end();
  const signature = signer.sign(getServiceAccountKey());
  return `${input}.${signature.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")}`;
}

async function getAccessToken() {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: createJwtAssertion(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.text().catch(() => "");
    throw new Error(`Google token exchange failed (${response.status}): ${payload}`);
  }

  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) {
    throw new Error("Google token exchange did not return an access token.");
  }

  return payload.access_token;
}

async function sheetsFetch<T = unknown>(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  const response = await fetch(`${SHEETS_API_BASE}/${getSheetId()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.text().catch(() => "");
    throw new Error(`Google Sheets request failed (${response.status}): ${payload}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json().catch(() => undefined)) as T;
}

async function getExistingSheets() {
  const payload = await sheetsFetch<{ sheets?: Array<{ properties?: { sheetId?: number; title?: string } }> }>(
    "?fields=sheets(properties(sheetId,title))"
  );

  return new Map(
    (payload?.sheets || [])
      .map((sheet) => sheet.properties)
      .filter((sheet): sheet is { sheetId: number; title: string } => Boolean(sheet?.sheetId !== undefined && sheet.title))
      .map((sheet) => [sheet.title, sheet.sheetId])
  );
}

async function ensureWorkbookStructure() {
  const existingSheets = await getExistingSheets();
  const addRequests = SHEET_DEFINITIONS.filter((definition) => !existingSheets.has(definition.title)).map((definition) => ({
    addSheet: {
      properties: {
        title: definition.title,
        gridProperties: {
          frozenRowCount: 1,
        },
      },
    },
  }));

  if (addRequests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests: addRequests }),
    });
  }

  for (const definition of SHEET_DEFINITIONS) {
    await sheetsFetch(`/values/${encodeURIComponent(`${definition.title}!A1:Z1`)}?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({
        range: `${definition.title}!A1:Z1`,
        majorDimension: "ROWS",
        values: [definition.headers],
      }),
    });
  }
}

async function ensureSheetsReady() {
  if (!isSheetsEnabled()) {
    return;
  }

  if (!sheetsGlobals.__kkProdSheetsReady) {
    sheetsGlobals.__kkProdSheetsReady = ensureWorkbookStructure().catch((error) => {
      sheetsGlobals.__kkProdSheetsReady = undefined;
      throw error;
    });
  }

  await sheetsGlobals.__kkProdSheetsReady;
}

async function appendSheetRow(row: SheetRow) {
  const definition = SHEET_DEFINITIONS.find((entry) => entry.key === row.sheet);
  if (!definition) {
    throw new Error(`Unknown Google Sheet target: ${row.sheet}`);
  }

  await sheetsFetch(`/values/${encodeURIComponent(`${definition.title}!A:Z`)}:append?valueInputOption=RAW`, {
    method: "POST",
    body: JSON.stringify({
      values: [row.values.map(sanitizeCell)],
    }),
  });
}

export async function recordSheetAudit(entityType: string, entityId: string, outcome: string, note?: string) {
  try {
    await appendSheetRow({
      sheet: "sync_audit",
      values: [new Date().toISOString(), entityType, entityId, "google-sheets", outcome, note || ""],
    });
  } catch (error) {
    console.warn("Google Sheets audit skipped:", error);
  }
}

export async function appendSheetRowsSafe(
  rows: SheetRow[],
  audit?: { entityType: string; entityId: string; note?: string }
) {
  if (!isSheetsEnabled() || !rows.length) {
    return;
  }

  try {
    await ensureSheetsReady();
    for (const row of rows) {
      await appendSheetRow(row);
    }

    if (audit) {
      await recordSheetAudit(audit.entityType, audit.entityId, "success", audit.note);
    }
  } catch (error) {
    console.warn("Google Sheets mirroring skipped:", error);
    if (audit) {
      await recordSheetAudit(audit.entityType, audit.entityId, "error", error instanceof Error ? error.message : String(error));
    }
  }
}
