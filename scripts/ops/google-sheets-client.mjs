import { JWT } from "google-auth-library";
import { loadRuntimeEnv, requireEnv } from "./shared-env.mjs";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const DEFAULT_COLUMN_WIDTH = 180;

const SHEET_DEFINITIONS = [
  {
    key: "owners",
    title: "owners",
    headers: ["timestamp", "seed_batch_id", "source", "uid", "workspace", "full_name", "email", "phone_e164", "phone_display", "village", "address", "pincode", "field_area_acres", "created_at", "updated_at", "notes"],
    tabColor: { red: 0.11, green: 0.47, blue: 0.26 },
  },
  {
    key: "renters",
    title: "renters",
    headers: ["timestamp", "seed_batch_id", "source", "uid", "workspace", "full_name", "email", "phone_e164", "phone_display", "village", "address", "pincode", "field_area_acres", "created_at", "updated_at", "notes"],
    tabColor: { red: 0.16, green: 0.56, blue: 0.69 },
  },
  {
    key: "listings",
    title: "listings",
    headers: ["timestamp", "seed_batch_id", "source", "listing_id", "owner_uid", "slug", "name", "category", "category_label", "location", "district", "state", "price_per_hour", "unit_label", "hp", "distance_km", "rating", "rating_count", "status", "operator_included", "available_from", "cover_image", "gallery_count", "tags", "work_types", "created_at", "updated_at"],
    tabColor: { red: 0.71, green: 0.47, blue: 0.13 },
  },
  {
    key: "bookings",
    title: "bookings",
    headers: ["timestamp", "seed_batch_id", "source", "booking_id", "listing_id", "owner_uid", "renter_uid", "status", "start_date", "end_date", "amount", "payment_id", "payment_status", "payment_method", "created_at", "updated_at", "note"],
    tabColor: { red: 0.6, green: 0.39, blue: 0.74 },
  },
  {
    key: "payments",
    title: "payments",
    headers: ["timestamp", "seed_batch_id", "source", "payment_id", "booking_id", "owner_uid", "renter_uid", "amount", "status", "method", "created_at"],
    tabColor: { red: 0.92, green: 0.62, blue: 0.18 },
  },
  {
    key: "support_requests",
    title: "support_requests",
    headers: ["timestamp", "seed_batch_id", "source", "submission_id", "user_id", "type", "category", "full_name", "phone", "email", "location", "equipment_needed", "message", "source_path", "created_at"],
    tabColor: { red: 0.82, green: 0.27, blue: 0.33 },
  },
  {
    key: "feedback",
    title: "feedback",
    headers: ["timestamp", "seed_batch_id", "source", "submission_id", "user_id", "role", "category", "subject", "message", "rating", "contact_me", "created_at"],
    tabColor: { red: 0.9, green: 0.36, blue: 0.58 },
  },
  {
    key: "bug_reports",
    title: "bug_reports",
    headers: ["timestamp", "seed_batch_id", "source", "bug_id", "severity", "runtime", "pathname", "status_code", "user_id", "fingerprint", "message", "occurred_at"],
    tabColor: { red: 0.63, green: 0.18, blue: 0.18 },
  },
  {
    key: "auth_events",
    title: "auth_events",
    headers: ["timestamp", "seed_batch_id", "source", "event_type", "user_id", "email", "phone", "workspace", "path", "outcome", "identifier"],
    tabColor: { red: 0.2, green: 0.32, blue: 0.73 },
  },
  {
    key: "sync_audit",
    title: "sync_audit",
    headers: ["timestamp", "seed_batch_id", "entity_type", "entity_id", "destination", "outcome", "note"],
    tabColor: { red: 0.45, green: 0.45, blue: 0.49 },
  },
];

function definitionFor(sheetKey) {
  const definition = SHEET_DEFINITIONS.find((entry) => entry.key === sheetKey);
  if (!definition) {
    throw new Error(`Unknown sheet key: ${sheetKey}`);
  }

  return definition;
}

function sanitizeCell(value) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function normalizePrivateKey(value) {
  if (!value) {
    return "";
  }

  return value.trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");
}

async function getSheetsToken() {
  await loadRuntimeEnv();

  const client = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || requireEnv("FIREBASE_CLIENT_EMAIL"),
    key: normalizePrivateKey(
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || requireEnv("FIREBASE_PRIVATE_KEY")
    ),
    scopes: [SHEETS_SCOPE],
  });

  const response = await client.getAccessToken();
  const token =
    typeof response === "string"
      ? response
      : response && typeof response === "object" && typeof response.token === "string"
        ? response.token
        : "";
  if (!token) {
    throw new Error("Could not acquire a Google Sheets access token.");
  }

  return token;
}

async function sheetsFetch(path, init) {
  const token = await getSheetsToken();
  const spreadsheetId = requireEnv("GOOGLE_SHEET_ID");
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Google Sheets request failed (${response.status}): ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function getExistingSheets() {
  const payload = await sheetsFetch("?fields=sheets(properties(sheetId,title))");
  return new Map(
    (payload?.sheets || [])
      .map((sheet) => sheet.properties)
      .filter((sheet) => sheet?.sheetId !== undefined && sheet?.title)
      .map((sheet) => [sheet.title, sheet.sheetId])
  );
}

function buildConditionalRequests(sheetId, definition) {
  const conditionalSets = {
    listings: {
      status: {
        active: { red: 0.84, green: 0.94, blue: 0.86 },
        paused: { red: 0.99, green: 0.91, blue: 0.74 },
      },
    },
    bookings: {
      status: {
        pending: { red: 0.99, green: 0.95, blue: 0.8 },
        confirmed: { red: 0.86, green: 0.92, blue: 0.99 },
        upcoming: { red: 0.9, green: 0.89, blue: 0.99 },
        active: { red: 0.84, green: 0.94, blue: 0.86 },
        completed: { red: 0.85, green: 0.96, blue: 0.92 },
        cancelled: { red: 0.98, green: 0.85, blue: 0.86 },
      },
      payment_status: {
        processing: { red: 0.99, green: 0.95, blue: 0.8 },
        paid: { red: 0.84, green: 0.94, blue: 0.86 },
        refunded: { red: 0.86, green: 0.92, blue: 0.99 },
      },
    },
    payments: {
      status: {
        processing: { red: 0.99, green: 0.95, blue: 0.8 },
        paid: { red: 0.84, green: 0.94, blue: 0.86 },
        refunded: { red: 0.86, green: 0.92, blue: 0.99 },
      },
    },
    auth_events: {
      outcome: {
        success: { red: 0.84, green: 0.94, blue: 0.86 },
        error: { red: 0.96, green: 0.8, blue: 0.8 },
      },
    },
    sync_audit: {
      outcome: {
        success: { red: 0.84, green: 0.94, blue: 0.86 },
        error: { red: 0.96, green: 0.8, blue: 0.8 },
      },
    },
    bug_reports: {
      severity: {
        fatal: { red: 0.72, green: 0.15, blue: 0.15 },
        error: { red: 0.96, green: 0.8, blue: 0.8 },
        warning: { red: 0.99, green: 0.95, blue: 0.8 },
        info: { red: 0.86, green: 0.92, blue: 0.99 },
      },
    },
  };

  const config = conditionalSets[definition.key];
  if (!config) {
    return [];
  }

  const requests = [];
  let index = 0;

  for (const [columnName, values] of Object.entries(config)) {
    const columnIndex = definition.headers.indexOf(columnName);
    if (columnIndex === -1) {
      continue;
    }

    for (const [equals, color] of Object.entries(values)) {
      requests.push({
        addConditionalFormatRule: {
          index,
          rule: {
            ranges: [{ sheetId, startRowIndex: 1, startColumnIndex: columnIndex, endColumnIndex: columnIndex + 1 }],
            booleanRule: {
              condition: {
                type: "TEXT_EQ",
                values: [{ userEnteredValue: equals }],
              },
              format: {
                backgroundColorStyle: {
                  rgbColor: color,
                },
                textFormat: {
                  bold: true,
                },
              },
            },
          },
        },
      });
      index += 1;
    }
  }

  return requests;
}

export async function ensureWorkbookStructure() {
  await loadRuntimeEnv();

  const existingSheets = await getExistingSheets();
  const addRequests = [];

  for (const definition of SHEET_DEFINITIONS) {
    if (!existingSheets.has(definition.title)) {
      addRequests.push({
        addSheet: {
          properties: {
            title: definition.title,
            gridProperties: { frozenRowCount: 1 },
            tabColorStyle: { rgbColor: definition.tabColor },
          },
        },
      });
    }
  }

  if (addRequests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests: addRequests }),
    });
  }

  const refreshedSheets = await getExistingSheets();
  const formattingRequests = [];

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
            gridProperties: { frozenRowCount: 1 },
            tabColorStyle: { rgbColor: definition.tabColor },
          },
          fields: "gridProperties.frozenRowCount,tabColorStyle",
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
              backgroundColorStyle: { rgbColor: definition.tabColor },
              textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
              wrapStrategy: "WRAP",
            },
          },
          fields: "userEnteredFormat(backgroundColorStyle,textFormat,wrapStrategy)",
        },
      },
      {
        setBasicFilter: {
          filter: {
            range: {
              sheetId,
              startRowIndex: 0,
              startColumnIndex: 0,
              endColumnIndex: definition.headers.length,
            },
          },
        },
      }
    );

    for (let index = 0; index < definition.headers.length; index += 1) {
      formattingRequests.push({
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: "COLUMNS",
            startIndex: index,
            endIndex: index + 1,
          },
          properties: {
            pixelSize: DEFAULT_COLUMN_WIDTH,
          },
          fields: "pixelSize",
        },
      });
    }

    formattingRequests.push(...buildConditionalRequests(sheetId, definition));
  }

  if (formattingRequests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests: formattingRequests }),
    });
  }

  for (const definition of SHEET_DEFINITIONS) {
    await sheetsFetch(`/values/${encodeURIComponent(`${definition.title}!A1:ZZ1`)}?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({
        range: `${definition.title}!A1:ZZ1`,
        majorDimension: "ROWS",
        values: [definition.headers],
      }),
    });
  }
}

export async function overwriteSheetRows(sheetKey, rows) {
  const definition = definitionFor(sheetKey);
  await ensureWorkbookStructure();

  await sheetsFetch(`/values/${encodeURIComponent(`${definition.title}!A2:ZZ`)}:clear`, {
    method: "POST",
    body: JSON.stringify({}),
  });

  if (!rows.length) {
    return;
  }

  await sheetsFetch(`/values/${encodeURIComponent(`${definition.title}!A2:ZZ`)}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({
      range: `${definition.title}!A2:ZZ`,
      majorDimension: "ROWS",
      values: rows.map((row) => row.map(sanitizeCell)),
    }),
  });
}

export async function listWorkbookSheets() {
  await loadRuntimeEnv();
  const sheets = await getExistingSheets();
  return Array.from(sheets.keys());
}

export { SHEET_DEFINITIONS };
