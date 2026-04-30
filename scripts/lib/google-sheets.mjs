import { JWT } from "google-auth-library";
import workbookManifest from "../../data/operational-sheets-workbook.json" with { type: "json" };
import { getGoogleSheetConfig, isSheetsConfigured } from "./env.mjs";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const SHEET_DEFINITIONS = workbookManifest.sheets.map((sheet) => ({
  ...sheet,
  headers: sheet.columns.map((column) => column.header),
}));
const LEGACY_SHEET_TITLES = {
  owners: ["Owners"],
  renters: ["Renters"],
  listings: ["Equipment"],
  bookings: ["Bookings"],
};

export function getWorkbookManifest() {
  return workbookManifest;
}

export function getSheetDefinitions() {
  return SHEET_DEFINITIONS;
}

export function getSheetDefinition(sheetKey) {
  const definition = SHEET_DEFINITIONS.find((entry) => entry.key === sheetKey || entry.title === sheetKey);
  if (!definition) {
    throw new Error(`Unknown sheet definition: ${sheetKey}`);
  }
  return definition;
}

function getLegacyTitleCandidates(definition) {
  return [definition.title, definition.title.toLowerCase(), definition.title.toUpperCase(), ...(LEGACY_SHEET_TITLES[definition.key] || [])];
}

export function sanitizeCell(value) {
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

export function rowObjectToValues(sheetKey, rowObject) {
  const definition = getSheetDefinition(sheetKey);
  return definition.columns.map((column) => sanitizeCell(rowObject?.[column.key] ?? ""));
}

function hexToRgbColor(hex) {
  const normalized = hex.replace("#", "").trim();
  const safe = normalized.length === 3
    ? normalized
        .split("")
        .map((part) => `${part}${part}`)
        .join("")
    : normalized;

  const red = Number.parseInt(safe.slice(0, 2), 16) / 255;
  const green = Number.parseInt(safe.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(safe.slice(4, 6), 16) / 255;

  return { red, green, blue };
}

function columnToA1(index) {
  let current = index + 1;
  let output = "";

  while (current > 0) {
    const remainder = (current - 1) % 26;
    output = String.fromCharCode(65 + remainder) + output;
    current = Math.floor((current - 1) / 26);
  }

  return output;
}

function getSheetEndColumn(definition) {
  return columnToA1(definition.columns.length - 1);
}

function getHeaderRange(definition) {
  return `${definition.title}!A1:${getSheetEndColumn(definition)}1`;
}

function getDataStartRange(definition) {
  return `${definition.title}!A2`;
}

function getClearRange(definition) {
  return `${definition.title}!A2:${getSheetEndColumn(definition)}`;
}

function getSheetsToken(overrides = {}) {
  const config = getGoogleSheetConfig(overrides);
  const client = new JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: [SHEETS_SCOPE],
  });

  return client.getAccessToken().then((response) => {
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
  });
}

async function sheetsFetch(path, init = {}, overrides = {}) {
  const config = getGoogleSheetConfig(overrides);
  if (!config.spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID for Google Sheets operations.");
  }

  const token = await getSheetsToken(overrides);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.text().catch(() => "");
    throw new Error(`Google Sheets request failed (${response.status}): ${payload}`);
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}

async function getSpreadsheetState(overrides = {}) {
  const fields =
    "sheets(properties(sheetId,title,gridProperties(frozenRowCount,columnCount)),conditionalFormats,basicFilter,bandedRanges(bandedRangeId),tables(tableId))";
  const payload = await sheetsFetch(`?fields=${encodeURIComponent(fields)}`, undefined, overrides);

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
          .filter((bandedRangeId) => typeof bandedRangeId === "number"),
      }))
      .filter((sheet) => sheet.title && Number.isInteger(sheet.sheetId))
      .map((sheet) => [sheet.title, sheet])
  );
}

function groupColumnWidths(columns) {
  const groups = [];
  let startIndex = 0;

  while (startIndex < columns.length) {
    const width = columns[startIndex].width || 180;
    let endIndex = startIndex + 1;

    while (endIndex < columns.length && (columns[endIndex].width || 180) === width) {
      endIndex += 1;
    }

    groups.push({
      startIndex,
      endIndex,
      width,
    });

    startIndex = endIndex;
  }

  return groups;
}

function buildColumnFormat(column) {
  if (column.type === "currency") {
    return {
      numberFormat: { type: "NUMBER", pattern: "[$₹]#,##0.00" },
      horizontalAlignment: "RIGHT",
    };
  }

  if (column.type === "number") {
    return {
      numberFormat: { type: "NUMBER", pattern: "0.00" },
      horizontalAlignment: "RIGHT",
    };
  }

  if (column.type === "boolean") {
    return {
      horizontalAlignment: "CENTER",
    };
  }

  return null;
}

function buildConditionalFormatRequests(definition, sheetState) {
  const requests = [];
  const currentRuleCount = sheetState?.conditionalRuleCount || 0;

  for (let index = currentRuleCount - 1; index >= 0; index -= 1) {
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

    const condition = {
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

export async function ensureWorkbookStructure(overrides = {}) {
  if (!isSheetsConfigured(overrides)) {
    throw new Error("Google Sheets is not configured. Missing sheet ID or service account credentials.");
  }

  const initialState = await getSpreadsheetState(overrides);
  const renameRequests = [];
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
    }, overrides);
  }

  const renamedState = renameRequests.length ? await getSpreadsheetState(overrides) : initialState;
  const addRequests = [];

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
    }, overrides);
  }

  const sheetStateMap = await getSpreadsheetState(overrides);
  const requests = [];

  for (const definition of SHEET_DEFINITIONS) {
    const sheetState = sheetStateMap.get(definition.title);
    if (!sheetState) {
      continue;
    }

    requests.push({
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
      requests.push({
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

    requests.push({
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
      requests.push({
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

    for (const bandingId of sheetState.bandedRangeIds || []) {
      requests.push({
        deleteBanding: {
          bandedRangeId: bandingId,
        },
      });
    }

    requests.push({
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

    requests.push(
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

      requests.push({
        repeatCell: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 1,
            startColumnIndex: columnIndex,
            endColumnIndex: columnIndex + 1,
          },
          cell: {
            userEnteredFormat: format,
          },
          fields: "userEnteredFormat(numberFormat,horizontalAlignment)",
        },
      });
    }

    requests.push(...buildConditionalFormatRequests(definition, sheetState));
  }

  if (requests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests }),
    }, overrides);
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
      }, overrides)
    )
  );
}

export async function clearSheetRows(sheetKey, overrides = {}) {
  const definition = getSheetDefinition(sheetKey);

  await sheetsFetch(`/values/${encodeURIComponent(getClearRange(definition))}:clear`, {
    method: "POST",
    body: JSON.stringify({}),
  }, overrides);
}

export async function replaceSheetRows(sheetKey, rows, overrides = {}) {
  const definition = getSheetDefinition(sheetKey);
  const values = rows.map((row) => (Array.isArray(row) ? row.map(sanitizeCell) : rowObjectToValues(sheetKey, row)));

  await clearSheetRows(sheetKey, overrides);
  if (!values.length) {
    return;
  }

  await sheetsFetch(`/values/${encodeURIComponent(getDataStartRange(definition))}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({
      range: getDataStartRange(definition),
      majorDimension: "ROWS",
      values,
    }),
  }, overrides);
}

export async function appendSheetRow(sheetKey, row, overrides = {}) {
  const definition = getSheetDefinition(sheetKey);
  const values = Array.isArray(row) ? row.map(sanitizeCell) : rowObjectToValues(sheetKey, row);

  await sheetsFetch(`/values/${encodeURIComponent(`${definition.title}!A:${getSheetEndColumn(definition)}`)}:append?valueInputOption=RAW`, {
    method: "POST",
    body: JSON.stringify({
      values: [values],
    }),
  }, overrides);
}

export async function readSheetRows(sheetKey, overrides = {}) {
  const definition = getSheetDefinition(sheetKey);
  const payload = await sheetsFetch(`/values/${encodeURIComponent(`${definition.title}!A1:${getSheetEndColumn(definition)}`)}`, undefined, overrides);
  return Array.isArray(payload.values) ? payload.values : [];
}

export async function upsertWorkbookMetaEntries(entries, overrides = {}) {
  const rows = await readSheetRows("workbook_meta", overrides);
  const existingEntries = rows.slice(1).map((row) => ({
    section: row[0] || "",
    key: row[1] || "",
    value: row[2] || "",
    updated_at: row[3] || "",
    notes: row[4] || "",
  }));

  const keyed = new Map(existingEntries.map((entry) => [`${entry.section}::${entry.key}`, entry]));
  const timestamp = new Date().toISOString();

  for (const entry of entries) {
    const normalized = {
      section: String(entry.section || ""),
      key: String(entry.key || ""),
      value: entry.value === undefined || entry.value === null ? "" : String(entry.value),
      updated_at: entry.updated_at || timestamp,
      notes: entry.notes === undefined || entry.notes === null ? "" : String(entry.notes),
    };

    keyed.set(`${normalized.section}::${normalized.key}`, normalized);
  }

  const nextRows = [...keyed.values()].sort((left, right) => {
    const sectionCompare = left.section.localeCompare(right.section);
    return sectionCompare || left.key.localeCompare(right.key);
  });

  await replaceSheetRows("workbook_meta", nextRows, overrides);
}

export async function appendAuditEntry(entry, overrides = {}) {
  await appendSheetRow(
    "sync_audit",
    {
      recorded_at: entry.recorded_at || new Date().toISOString(),
      run_id: entry.run_id || "",
      entity_type: entry.entity_type || "",
      entity_id: entry.entity_id || "",
      destination: entry.destination || "google-sheets",
      outcome: entry.outcome || "",
      operation: entry.operation || "",
      note: entry.note || "",
      details_json: entry.details_json || "",
    },
    overrides
  );
}

export async function verifyWorkbookStructure(overrides = {}) {
  const sheetStateMap = await getSpreadsheetState(overrides);
  const headerRows = await Promise.all(
    SHEET_DEFINITIONS.map(async (definition) => {
      const rows = await readSheetRows(definition.key, overrides).catch(() => []);
      return [definition.key, rows[0] || []];
    })
  );

  const headersByKey = new Map(headerRows);
  const sheetChecks = SHEET_DEFINITIONS.map((definition) => {
    const sheetState = sheetStateMap.get(definition.title);
    const headers = headersByKey.get(definition.key) || [];
    const conditionalRuleCount = sheetState?.conditionalRuleCount || 0;
    const expectedRuleCount = (definition.conditionalRules || []).length;

    return {
      key: definition.key,
      title: definition.title,
      exists: Boolean(sheetState),
      headerMatch: JSON.stringify(headers) === JSON.stringify(definition.headers),
      frozenRowMatch: (sheetState?.frozenRowCount || 0) === 1,
      filterPresent: Boolean(sheetState?.hasBasicFilter || sheetState?.hasTable),
      conditionalRuleCount,
      expectedConditionalRuleCount: expectedRuleCount,
      conditionalRuleMatch: conditionalRuleCount >= expectedRuleCount,
    };
  });

  return {
    ok: sheetChecks.every(
      (check) => check.exists && check.headerMatch && check.frozenRowMatch && check.filterPresent && check.conditionalRuleMatch
    ),
    manifestVersion: workbookManifest.version,
    spreadsheetId: getGoogleSheetConfig(overrides).spreadsheetId,
    sheetChecks,
  };
}
