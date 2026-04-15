import "server-only";

import { JWT } from "google-auth-library";

type SheetKey =
  | "owners"
  | "renters"
  | "listings"
  | "bookings"
  | "payments"
  | "support_requests"
  | "feedback"
  | "bug_reports"
  | "auth_events"
  | "sync_audit";

type SheetDefinition = {
  key: SheetKey;
  title: string;
  headers: string[];
  tabColor: { red: number; green: number; blue: number };
};

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const SHEET_DEFINITIONS: SheetDefinition[] = [
  {
    key: "owners",
    title: "owners",
    headers: ["timestamp", "uid", "full_name", "email", "phone", "village", "pincode", "workspace", "source"],
    tabColor: { red: 0.11, green: 0.47, blue: 0.26 },
  },
  {
    key: "renters",
    title: "renters",
    headers: ["timestamp", "uid", "full_name", "email", "phone", "village", "pincode", "workspace", "source"],
    tabColor: { red: 0.16, green: 0.56, blue: 0.69 },
  },
  {
    key: "listings",
    title: "listings",
    headers: [
      "timestamp",
      "listing_id",
      "owner_uid",
      "name",
      "category",
      "location",
      "district",
      "price_per_hour",
      "status",
      "cover_image",
    ],
    tabColor: { red: 0.71, green: 0.47, blue: 0.13 },
  },
  {
    key: "bookings",
    title: "bookings",
    headers: [
      "timestamp",
      "booking_id",
      "listing_id",
      "owner_uid",
      "renter_uid",
      "status",
      "start_date",
      "end_date",
      "amount",
    ],
    tabColor: { red: 0.6, green: 0.39, blue: 0.74 },
  },
  {
    key: "payments",
    title: "payments",
    headers: ["timestamp", "payment_id", "booking_id", "owner_uid", "renter_uid", "amount", "status", "method"],
    tabColor: { red: 0.92, green: 0.62, blue: 0.18 },
  },
  {
    key: "support_requests",
    title: "support_requests",
    headers: ["timestamp", "submission_id", "user_id", "category", "full_name", "phone", "email", "source_path"],
    tabColor: { red: 0.82, green: 0.27, blue: 0.33 },
  },
  {
    key: "feedback",
    title: "feedback",
    headers: ["timestamp", "submission_id", "user_id", "role", "category", "subject", "rating", "contact_me"],
    tabColor: { red: 0.9, green: 0.36, blue: 0.58 },
  },
  {
    key: "bug_reports",
    title: "bug_reports",
    headers: ["timestamp", "bug_id", "severity", "source", "runtime", "pathname", "status_code", "user_id", "fingerprint"],
    tabColor: { red: 0.63, green: 0.18, blue: 0.18 },
  },
  {
    key: "auth_events",
    title: "auth_events",
    headers: ["timestamp", "event_type", "user_id", "email", "phone", "workspace", "path", "outcome"],
    tabColor: { red: 0.2, green: 0.32, blue: 0.73 },
  },
  {
    key: "sync_audit",
    title: "sync_audit",
    headers: ["timestamp", "entity_type", "entity_id", "destination", "outcome", "note"],
    tabColor: { red: 0.45, green: 0.45, blue: 0.49 },
  },
];

const sheetGlobals = globalThis as typeof globalThis & {
  __kkSheetsReady?: Promise<void>;
};

function getSheetId() {
  return process.env.GOOGLE_SHEET_ID || "";
}

function getServiceAccountEmail() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL || "";
}

function getServiceAccountKey() {
  const value = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY || "";
  return value ? value.replace(/\\n/g, "\n") : "";
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

async function getSheetsToken() {
  const client = new JWT({
    email: getServiceAccountEmail(),
    key: getServiceAccountKey(),
    scopes: [SHEETS_SCOPE],
  });

  const token = await client.getAccessToken();
  if (!token) {
    throw new Error("Could not acquire a Google Sheets access token.");
  }

  return token;
}

async function sheetsFetch<T = unknown>(path: string, init?: RequestInit) {
  const token = await getSheetsToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${getSheetId()}${path}`, {
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

  return (await response.json()) as T;
}

async function getExistingSheets() {
  const payload = await sheetsFetch<{ sheets?: Array<{ properties?: { sheetId?: number; title?: string } }> }>(
    "?fields=sheets(properties(sheetId,title))"
  );

  return new Map(
    (payload.sheets || [])
      .map((sheet) => sheet.properties)
      .filter((sheet): sheet is { sheetId: number; title: string } => Boolean(sheet?.sheetId !== undefined && sheet.title))
      .map((sheet) => [sheet.title, sheet.sheetId])
  );
}

async function ensureWorkbookStructure() {
  if (!isSheetsEnabled()) {
    return;
  }

  const existingSheets = await getExistingSheets();
  const requests: object[] = [];

  for (const definition of SHEET_DEFINITIONS) {
    if (!existingSheets.has(definition.title)) {
      requests.push({
        addSheet: {
          properties: {
            title: definition.title,
            gridProperties: {
              frozenRowCount: 1,
            },
            tabColorStyle: {
              rgbColor: definition.tabColor,
            },
          },
        },
      });
    }
  }

  if (requests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests }),
    });
  }

  const refreshedSheets = await getExistingSheets();
  const formattingRequests: object[] = [];

  for (const definition of SHEET_DEFINITIONS) {
    const sheetId = refreshedSheets.get(definition.title);
    if (sheetId === undefined) {
      continue;
    }

    formattingRequests.push(
      {
        updateSheetProperties: {
          properties: {
            sheetId,
            gridProperties: {
              frozenRowCount: 1,
            },
            tabColorStyle: {
              rgbColor: definition.tabColor,
            },
          },
          fields: "gridProperties.frozenRowCount,tabColorStyle",
        },
      },
      {
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: "COLUMNS",
            startIndex: 0,
            endIndex: definition.headers.length,
          },
          properties: {
            pixelSize: 180,
          },
          fields: "pixelSize",
        },
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
          },
          cell: {
            userEnteredFormat: {
              backgroundColorStyle: {
                rgbColor: definition.tabColor,
              },
              textFormat: {
                bold: true,
                foregroundColor: {
                  red: 1,
                  green: 1,
                  blue: 1,
                },
              },
              wrapStrategy: "WRAP",
            },
          },
          fields: "userEnteredFormat(backgroundColorStyle,textFormat,wrapStrategy)",
        },
      }
    );
  }

  if (formattingRequests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests: formattingRequests }),
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

  if (!sheetGlobals.__kkSheetsReady) {
    sheetGlobals.__kkSheetsReady = ensureWorkbookStructure().catch((error) => {
      sheetGlobals.__kkSheetsReady = undefined;
      throw error;
    });
  }

  await sheetGlobals.__kkSheetsReady;
}

export async function appendSheetRow(sheet: SheetKey, row: unknown[]) {
  if (!isSheetsEnabled()) {
    return;
  }

  await ensureSheetsReady();
  const definition = SHEET_DEFINITIONS.find((entry) => entry.key === sheet);
  if (!definition) {
    throw new Error(`Unknown sheet: ${sheet}`);
  }

  await sheetsFetch(`/values/${encodeURIComponent(`${definition.title}!A:Z`)}:append?valueInputOption=RAW`, {
    method: "POST",
    body: JSON.stringify({
      values: [row.map(sanitizeCell)],
    }),
  });
}

export async function recordSheetAudit(entityType: string, entityId: string, outcome: string, note?: string) {
  try {
    await appendSheetRow("sync_audit", [new Date().toISOString(), entityType, entityId, "google-sheets", outcome, note || ""]);
  } catch (error) {
    console.error("Could not record Google Sheets sync audit event:", error);
  }
}

export async function appendSheetRowsSafe(
  rows: Array<{ sheet: SheetKey; values: unknown[] }>,
  audit?: { entityType: string; entityId: string; note?: string }
) {
  // Sheets is an operational mirror only. Firebase remains the write of record,
  // so mirroring failures must never block a successful primary write path.
  if (!isSheetsEnabled() || !rows.length) {
    return;
  }

  try {
    for (const row of rows) {
      await appendSheetRow(row.sheet, row.values);
    }

    if (audit) {
      await recordSheetAudit(audit.entityType, audit.entityId, "success", audit.note);
    }
  } catch (error) {
    console.error("Could not mirror rows to Google Sheets:", error);
    if (audit) {
      await recordSheetAudit(audit.entityType, audit.entityId, "error", error instanceof Error ? error.message : String(error));
    }
  }
}

