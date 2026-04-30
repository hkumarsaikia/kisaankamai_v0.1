import "server-only";

import { JWT } from "google-auth-library";
import workbookManifest from "@/data/operational-sheets-workbook.json";

export type SheetKey =
  | "workbook_meta"
  | "owners"
  | "renters"
  | "listings"
  | "bookings"
  | "payments"
  | "saved_items"
  | "support_requests"
  | "booking_requests"
  | "newsletter_subscriptions"
  | "coming_soon_notifications"
  | "feedback"
  | "bug_reports"
  | "auth_events"
  | "sync_audit";

type WorkbookColumnType =
  | "text"
  | "number"
  | "currency"
  | "boolean"
  | "date"
  | "datetime"
  | "json"
  | "url";

type WorkbookColumn = {
  key: string;
  header: string;
  width?: number;
  type: WorkbookColumnType;
};

type WorkbookConditionalRule = {
  columnKey: string;
  type: string;
  value?: string;
  background: string;
  foreground: string;
};

type SheetDefinition = {
  key: SheetKey;
  title: string;
  backfillMode: "replace" | "preserve";
  tabColor: string;
  columns: WorkbookColumn[];
  conditionalRules?: WorkbookConditionalRule[];
  headers: string[];
};

export type SheetAppendResult = {
  sheet: SheetKey;
  title: string;
  updatedRange: string;
  rowNumber?: number;
};

type SpreadsheetStateEntry = {
  title: string;
  sheetId: number;
  frozenRowCount: number;
  columnCount: number;
  conditionalRuleCount: number;
  hasBasicFilter: boolean;
  hasTable: boolean;
  bandedRangeIds: number[];
};

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const SHEET_DEFINITIONS: SheetDefinition[] = (workbookManifest.sheets as Array<
  Omit<SheetDefinition, "headers">
>).map((sheet) => ({
  ...sheet,
  headers: sheet.columns.map((column) => column.header),
}));
const LEGACY_SHEET_TITLES: Partial<Record<SheetKey, string[]>> = {
  owners: ["Owners"],
  renters: ["Renters"],
  listings: ["Equipment"],
  bookings: ["Bookings"],
};

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
  if (!value) {
    return "";
  }

  return value.trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");
}

function isSheetsEnabled() {
  return Boolean(getSheetId() && getServiceAccountEmail() && getServiceAccountKey());
}

function sanitizeCell(value: unknown) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function safeJson(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function hexToRgbColor(hex: string) {
  const normalized = hex.replace("#", "").trim();
  const safe =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalized;

  return {
    red: Number.parseInt(safe.slice(0, 2), 16) / 255,
    green: Number.parseInt(safe.slice(2, 4), 16) / 255,
    blue: Number.parseInt(safe.slice(4, 6), 16) / 255,
  };
}

function columnToA1(index: number) {
  let current = index + 1;
  let output = "";

  while (current > 0) {
    const remainder = (current - 1) % 26;
    output = String.fromCharCode(65 + remainder) + output;
    current = Math.floor((current - 1) / 26);
  }

  return output;
}

function getSheetDefinition(sheetKey: SheetKey) {
  const definition = SHEET_DEFINITIONS.find((sheet) => sheet.key === sheetKey);
  if (!definition) {
    throw new Error(`Unknown sheet: ${sheetKey}`);
  }
  return definition;
}

function getLegacyTitleCandidates(definition: SheetDefinition) {
  return [
    definition.title,
    definition.title.toLowerCase(),
    definition.title.toUpperCase(),
    ...(LEGACY_SHEET_TITLES[definition.key] || []),
  ];
}

function getSheetEndColumn(definition: SheetDefinition) {
  return columnToA1(definition.columns.length - 1);
}

function getHeaderRange(definition: SheetDefinition) {
  return `${definition.title}!A1:${getSheetEndColumn(definition)}1`;
}

function getAppendRange(definition: SheetDefinition) {
  return `${definition.title}!A:${getSheetEndColumn(definition)}`;
}

function getCellRange(definition: SheetDefinition, columnIndex: number, rowNumber: number) {
  const column = columnToA1(columnIndex);
  return `${definition.title}!${column}${rowNumber}`;
}

function extractRowNumber(updatedRange: string) {
  const match = updatedRange.match(/![A-Z]+(\d+):/);
  return match ? Number(match[1]) : undefined;
}

function groupColumnWidths(columns: WorkbookColumn[]) {
  const groups: Array<{ startIndex: number; endIndex: number; width: number }> = [];
  let startIndex = 0;

  while (startIndex < columns.length) {
    const width = columns[startIndex].width || 180;
    let endIndex = startIndex + 1;

    while (endIndex < columns.length && (columns[endIndex].width || 180) === width) {
      endIndex += 1;
    }

    groups.push({ startIndex, endIndex, width });
    startIndex = endIndex;
  }

  return groups;
}

function buildColumnFormat(column: WorkbookColumn) {
  if (column.type === "currency") {
    return {
      format: {
        numberFormat: {
          type: "NUMBER",
          pattern: "[$₹]#,##0.00",
        },
        horizontalAlignment: "RIGHT",
      },
      fields: "userEnteredFormat(numberFormat,horizontalAlignment)",
    };
  }

  if (column.type === "number") {
    return {
      format: {
        numberFormat: {
          type: "NUMBER",
          pattern: "0.00",
        },
        horizontalAlignment: "RIGHT",
      },
      fields: "userEnteredFormat(numberFormat,horizontalAlignment)",
    };
  }

  if (column.type === "boolean") {
    return {
      format: {
        horizontalAlignment: "CENTER",
      },
      fields: "userEnteredFormat(horizontalAlignment)",
    };
  }

  return null;
}

function buildConditionalFormatRequests(definition: SheetDefinition, sheetState: SpreadsheetStateEntry) {
  const requests: object[] = [];

  for (let index = sheetState.conditionalRuleCount - 1; index >= 0; index -= 1) {
    requests.push({
      deleteConditionalFormatRule: {
        sheetId: sheetState.sheetId,
        index,
      },
    });
  }

  for (const [index, rule] of (definition.conditionalRules || []).entries()) {
    const columnIndex = definition.columns.findIndex((column) => column.key === rule.columnKey);
    if (columnIndex < 0) {
      continue;
    }

    const condition: { type: string; values?: Array<{ userEnteredValue: string }> } = {
      type: rule.type,
    };

    if (rule.value !== undefined) {
      condition.values = [{ userEnteredValue: String(rule.value) }];
    }

    requests.push({
      addConditionalFormatRule: {
        index,
        rule: {
          ranges: [
            {
              sheetId: sheetState.sheetId,
              startRowIndex: 1,
              startColumnIndex: columnIndex,
              endColumnIndex: columnIndex + 1,
            },
          ],
          booleanRule: {
            condition,
            format: {
              backgroundColor: hexToRgbColor(rule.background),
              textFormat: {
                foregroundColor: hexToRgbColor(rule.foreground),
                bold: true,
              },
            },
          },
        },
      },
    });
  }

  return requests;
}

let _sheetsJwtClient: JWT | undefined;

async function getSheetsToken() {
  if (!_sheetsJwtClient) {
    _sheetsJwtClient = new JWT({
      email: getServiceAccountEmail(),
      key: getServiceAccountKey(),
      scopes: [SHEETS_SCOPE],
    });
  }

  const response = await _sheetsJwtClient.getAccessToken();
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

async function getSpreadsheetState() {
  const payload = await sheetsFetch<{
    sheets?: Array<{
      properties?: {
        sheetId?: number;
        title?: string;
        gridProperties?: {
          frozenRowCount?: number;
          columnCount?: number;
        };
      };
      conditionalFormats?: unknown[];
      basicFilter?: object;
      bandedRanges?: Array<{ bandedRangeId?: number }>;
      tables?: Array<{ tableId?: string }>;
    }>;
  }>(
    `?fields=${encodeURIComponent(
      "sheets(properties(sheetId,title,gridProperties(frozenRowCount,columnCount)),conditionalFormats,basicFilter,bandedRanges(bandedRangeId),tables(tableId))"
    )}`
  );

  return new Map(
    (payload.sheets || [])
      .map((sheet) => ({
        title: sheet.properties?.title,
        sheetId: sheet.properties?.sheetId,
        frozenRowCount: sheet.properties?.gridProperties?.frozenRowCount || 0,
        columnCount: sheet.properties?.gridProperties?.columnCount || 0,
        conditionalRuleCount: Array.isArray(sheet.conditionalFormats) ? sheet.conditionalFormats.length : 0,
        hasBasicFilter: Boolean(sheet.basicFilter),
        hasTable: Array.isArray(sheet.tables) && sheet.tables.length > 0,
        bandedRangeIds: (sheet.bandedRanges || [])
          .map((banding) => banding.bandedRangeId)
          .filter((bandedRangeId): bandedRangeId is number => typeof bandedRangeId === "number"),
      }))
      .filter((sheet): sheet is SpreadsheetStateEntry => Boolean(sheet.title && sheet.sheetId !== undefined))
      .map((sheet) => [sheet.title, sheet])
  );
}

async function ensureWorkbookStructure() {
  if (!isSheetsEnabled()) {
    return;
  }

  const initialState = await getSpreadsheetState();
  const renameRequests: object[] = [];
  const reservedTitles = new Set(initialState.keys());

  for (const definition of SHEET_DEFINITIONS) {
    if (initialState.has(definition.title)) {
      continue;
    }

    const aliasState = getLegacyTitleCandidates(definition)
      .filter((candidate, index, list) => candidate && list.indexOf(candidate) === index)
      .map((candidate) => initialState.get(candidate))
      .find(Boolean);

    if (!aliasState || reservedTitles.has(definition.title)) {
      continue;
    }

    renameRequests.push({
      updateSheetProperties: {
        properties: {
          sheetId: aliasState.sheetId,
          title: definition.title,
        },
        fields: "title",
      },
    });
    reservedTitles.add(definition.title);
  }

  if (renameRequests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests: renameRequests }),
    });
  }

  const renamedState = renameRequests.length ? await getSpreadsheetState() : initialState;
  const addRequests: object[] = [];

  for (const definition of SHEET_DEFINITIONS) {
    if (renamedState.has(definition.title)) {
      continue;
    }

    addRequests.push({
      addSheet: {
        properties: {
          title: definition.title,
          gridProperties: {
            rowCount: 200,
            columnCount: definition.columns.length,
            frozenRowCount: 1,
          },
          tabColorStyle: {
            rgbColor: hexToRgbColor(definition.tabColor),
          },
        },
      },
    });
  }

  if (addRequests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests: addRequests }),
    });
  }

  const sheetStateMap = await getSpreadsheetState();
  const formatRequests: object[] = [];

  for (const definition of SHEET_DEFINITIONS) {
    const sheetState = sheetStateMap.get(definition.title);
    if (!sheetState) {
      continue;
    }

    formatRequests.push({
      updateSheetProperties: {
        properties: {
          sheetId: sheetState.sheetId,
          gridProperties: {
            frozenRowCount: 1,
            columnCount: Math.max(sheetState.columnCount, definition.columns.length),
          },
          tabColorStyle: {
            rgbColor: hexToRgbColor(definition.tabColor),
          },
        },
        fields: "gridProperties.frozenRowCount,gridProperties.columnCount,tabColorStyle",
      },
    });

    for (const widthGroup of groupColumnWidths(definition.columns)) {
      formatRequests.push({
        updateDimensionProperties: {
          range: {
            sheetId: sheetState.sheetId,
            dimension: "COLUMNS",
            startIndex: widthGroup.startIndex,
            endIndex: widthGroup.endIndex,
          },
          properties: {
            pixelSize: widthGroup.width,
          },
          fields: "pixelSize",
        },
      });
    }

    formatRequests.push({
      updateDimensionProperties: {
        range: {
          sheetId: sheetState.sheetId,
          dimension: "ROWS",
          startIndex: 0,
          endIndex: 1,
        },
        properties: {
          pixelSize: 42,
        },
        fields: "pixelSize",
      },
    });

    if (!sheetState.hasBasicFilter && !sheetState.hasTable) {
      formatRequests.push({
        setBasicFilter: {
          filter: {
            range: {
              sheetId: sheetState.sheetId,
              startRowIndex: 0,
              startColumnIndex: 0,
              endColumnIndex: definition.columns.length,
            },
          },
        },
      });
    }

    for (const bandingId of sheetState.bandedRangeIds) {
      formatRequests.push({
        deleteBanding: {
          bandedRangeId: bandingId,
        },
      });
    }

    formatRequests.push({
      addBanding: {
        bandedRange: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 0,
            startColumnIndex: 0,
            endColumnIndex: definition.columns.length,
          },
          rowProperties: {
            headerColorStyle: {
              rgbColor: hexToRgbColor(definition.tabColor),
            },
            firstBandColorStyle: {
              rgbColor: hexToRgbColor("#FFFFFF"),
            },
            secondBandColorStyle: {
              rgbColor: hexToRgbColor("#F4F7F3"),
            },
            footerColorStyle: {
              rgbColor: hexToRgbColor("#E7EFE8"),
            },
          },
        },
      },
    });

    formatRequests.push(
      {
        repeatCell: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
          },
          cell: {
            userEnteredFormat: {
              backgroundColorStyle: {
                rgbColor: hexToRgbColor(definition.tabColor),
              },
              textFormat: {
                bold: true,
                foregroundColor: {
                  red: 1,
                  green: 1,
                  blue: 1,
                },
              },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              wrapStrategy: "WRAP",
            },
          },
          fields:
            "userEnteredFormat(backgroundColorStyle,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
        },
      },
      {
        repeatCell: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: definition.columns.length,
          },
          cell: {
            userEnteredFormat: {
              verticalAlignment: "TOP",
              wrapStrategy: "WRAP",
            },
          },
          fields: "userEnteredFormat(verticalAlignment,wrapStrategy)",
        },
      }
    );

    for (const [columnIndex, column] of definition.columns.entries()) {
      const format = buildColumnFormat(column);
      if (!format) {
        continue;
      }

      formatRequests.push({
        repeatCell: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 1,
            startColumnIndex: columnIndex,
            endColumnIndex: columnIndex + 1,
          },
          cell: {
            userEnteredFormat: format.format,
          },
          fields: format.fields,
        },
      });
    }

    formatRequests.push(...buildConditionalFormatRequests(definition, sheetState));
  }

  if (formatRequests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests: formatRequests }),
    });
  }

  await Promise.all(
    SHEET_DEFINITIONS.map((definition) =>
      sheetsFetch(`/values/${encodeURIComponent(getHeaderRange(definition))}?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({
          range: getHeaderRange(definition),
          majorDimension: "ROWS",
          values: [definition.headers],
        }),
      })
    )
  );
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

export async function appendSheetRow(sheet: SheetKey, row: unknown[]): Promise<SheetAppendResult | undefined> {
  if (!isSheetsEnabled()) {
    return;
  }

  await ensureSheetsReady();
  const definition = getSheetDefinition(sheet);

  const result = await sheetsFetch<{
    updates?: {
      updatedRange?: string;
    };
  }>(`/values/${encodeURIComponent(getAppendRange(definition))}:append?valueInputOption=RAW`, {
    method: "POST",
    body: JSON.stringify({
      values: [row.map(sanitizeCell)],
    }),
  });

  const updatedRange = result?.updates?.updatedRange || "";

  return {
    sheet,
    title: definition.title,
    updatedRange,
    rowNumber: updatedRange ? extractRowNumber(updatedRange) : undefined,
  };
}

export async function updateSheetCell(sheet: SheetKey, columnKey: string, rowNumber: number, value: unknown) {
  if (!isSheetsEnabled() || rowNumber < 2) {
    return;
  }

  await ensureSheetsReady();
  const definition = getSheetDefinition(sheet);
  const columnIndex = definition.columns.findIndex((column) => column.key === columnKey);
  if (columnIndex < 0) {
    return;
  }

  await sheetsFetch(`/values/${encodeURIComponent(getCellRange(definition, columnIndex, rowNumber))}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({
      range: getCellRange(definition, columnIndex, rowNumber),
      majorDimension: "ROWS",
      values: [[sanitizeCell(value)]],
    }),
  });
}

export async function updateNotificationEmailStatus(
  sheet: SheetKey,
  rowNumber: number,
  status: "pending" | "sent" | "email_failed" | "email_config_missing",
  sentAt?: string
) {
  await updateSheetCell(sheet, "notification_email_status", rowNumber, status);
  if (sentAt !== undefined) {
    await updateSheetCell(sheet, "notification_email_sent_at", rowNumber, sentAt);
  }
}

export async function recordSheetAudit(
  entityType: string,
  entityId: string,
  outcome: string,
  note?: string,
  operation = "append",
  details?: unknown
) {
  try {
    await appendSheetRow("sync_audit", [
      new Date().toISOString(),
      "",
      entityType,
      entityId,
      "google-sheets",
      outcome,
      operation,
      note || "",
      safeJson(details),
    ]);
  } catch (error) {
    console.error("Could not record Google Sheets sync audit event:", error);
  }
}

export async function appendSheetRowsSafe(
  rows: Array<{ sheet: SheetKey; values: unknown[] }>,
  audit?: { entityType: string; entityId: string; note?: string; operation?: string; details?: unknown }
): Promise<SheetAppendResult[]> {
  // Sheets is an operational mirror only. Firebase remains the write of record,
  // so mirroring failures must never block a successful primary write path.
  if (!isSheetsEnabled() || !rows.length) {
    return [];
  }

  try {
    const results: SheetAppendResult[] = [];
    for (const row of rows) {
      const result = await appendSheetRow(row.sheet, row.values);
      if (result) {
        results.push(result);
      }
    }

    if (audit) {
      await recordSheetAudit(audit.entityType, audit.entityId, "success", audit.note, audit.operation, audit.details);
    }

    return results;
  } catch (error) {
    console.error("Could not mirror rows to Google Sheets:", error);
    if (audit) {
      await recordSheetAudit(
        audit.entityType,
        audit.entityId,
        "error",
        error instanceof Error ? error.message : String(error),
        audit.operation,
        audit.details
      );
    }
    return [];
  }
}
