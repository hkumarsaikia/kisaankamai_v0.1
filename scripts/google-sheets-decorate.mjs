import { JWT } from "google-auth-library";
import workbookManifest from "../data/operational-sheets-workbook.json" with { type: "json" };
import { appendAuditEntry, upsertWorkbookMetaEntries } from "./lib/google-sheets.mjs";
import { getGoogleSheetConfig, isSheetsConfigured, loadRepoEnv } from "./lib/env.mjs";
import { getStringOption, parseArgs, printUsage } from "./lib/cli.mjs";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const DASHBOARD_TITLE = "Kisan Kamai HQ";
const DASHBOARD_RANGE = `${DASHBOARD_TITLE}!A1:H80`;

const options = parseArgs();
if (options.help) {
  printUsage([
    "Usage: node scripts/google-sheets-decorate.mjs [--sheet-id <id>]",
    "",
    "Applies a polished visual layer to the operational Google Sheets workbook.",
    "The script does not move or rewrite operational headers. Playful mascot",
    "decorations are kept inside a separate dashboard tab.",
  ]);
  process.exit(0);
}

loadRepoEnv();

const spreadsheetId = getStringOption(options, "sheet-id", "");
const overrides = spreadsheetId ? { spreadsheetId } : {};

if (!isSheetsConfigured(overrides)) {
  throw new Error("Google Sheets is not configured. Missing sheet ID or service account credentials.");
}

const sheetDefinitions = workbookManifest.sheets.map((sheet) => ({
  ...sheet,
  headers: sheet.columns.map((column) => column.header),
}));

const sheetDesign = {
  workbook_meta: { icon: "🧭", purpose: "Workbook settings and mirror notes", owner: "Ops", tone: "Slate" },
  owners: { icon: "👨‍🌾", purpose: "Owner profile mirror", owner: "Profiles", tone: "Emerald" },
  renters: { icon: "🧑‍🌾", purpose: "Renter profile mirror", owner: "Profiles", tone: "Sky" },
  listings: { icon: "🚜", purpose: "Owner-published equipment", owner: "Marketplace", tone: "Harvest" },
  bookings: { icon: "📅", purpose: "Booking requests and status", owner: "Bookings", tone: "Violet" },
  payments: { icon: "🤝", purpose: "Direct settlement estimates", owner: "Finance notes", tone: "Amber" },
  saved_items: { icon: "⭐", purpose: "Saved equipment mirror", owner: "Renter workspace", tone: "Teal" },
  support_requests: { icon: "🛟", purpose: "Support and public request inbox", owner: "Support", tone: "Rose" },
  booking_requests: { icon: "📬", purpose: "Public booking callback requests", owner: "Support", tone: "Indigo" },
  newsletter_subscriptions: { icon: "📨", purpose: "Newsletter signups", owner: "Marketing", tone: "Green" },
  coming_soon_notifications: { icon: "🔔", purpose: "Coming-soon interest list", owner: "Launch", tone: "Orange" },
  feedback: { icon: "💬", purpose: "Owner and renter feedback", owner: "Product", tone: "Purple" },
  bug_reports: { icon: "🐞", purpose: "Client bug reports", owner: "Engineering", tone: "Red" },
  auth_events: { icon: "🔐", purpose: "Auth activity log", owner: "Security", tone: "Blue" },
  sync_audit: { icon: "🧾", purpose: "Mirror and release audit trail", owner: "Ops", tone: "Graphite" },
};

const palette = {
  ink: "#10231B",
  muted: "#53675D",
  primary: "#0B4F37",
  primaryDeep: "#073B2A",
  surface: "#FFFFFF",
  surfaceSoft: "#F4FAF6",
  surfaceAlt: "#EAF3EC",
  border: "#D5E3D9",
  gold: "#F2A23A",
  amberSoft: "#FFF6E5",
  roseSoft: "#FCE8E6",
  blueSoft: "#E8F0FE",
};

function hexToRgbColor(hex) {
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

function quoteSheetTitle(title) {
  return `'${String(title).replaceAll("'", "''")}'`;
}

function getSheetsToken() {
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

async function sheetsFetch(path, init = {}) {
  const config = getGoogleSheetConfig(overrides);
  const token = await getSheetsToken();
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

async function getSpreadsheetState() {
  const fields =
    "spreadsheetId,sheets(properties(sheetId,title,index,gridProperties(rowCount,columnCount,frozenRowCount,hideGridlines)),bandedRanges(bandedRangeId))";
  const payload = await sheetsFetch(`?fields=${encodeURIComponent(fields)}`);
  return new Map(
    (payload.sheets || [])
      .map((sheet) => ({
        title: sheet.properties?.title,
        sheetId: sheet.properties?.sheetId,
        index: sheet.properties?.index || 0,
        rowCount: sheet.properties?.gridProperties?.rowCount || 1000,
        columnCount: sheet.properties?.gridProperties?.columnCount || 26,
        frozenRowCount: sheet.properties?.gridProperties?.frozenRowCount || 0,
        bandedRangeIds: (sheet.bandedRanges || [])
          .map((banding) => banding.bandedRangeId)
          .filter((bandedRangeId) => Number.isInteger(bandedRangeId)),
      }))
      .filter((sheet) => sheet.title && Number.isInteger(sheet.sheetId))
      .map((sheet) => [sheet.title, sheet])
  );
}

function buildBorder(color = palette.border, style = "SOLID") {
  return {
    style,
    width: 1,
    color: hexToRgbColor(color),
  };
}

function buildOperationalRequests(sheetStateMap) {
  const requests = [];

  for (const definition of sheetDefinitions) {
    const sheetState = sheetStateMap.get(definition.title);
    if (!sheetState) {
      continue;
    }

    const endColumnIndex = definition.columns.length;
    const rowLimit = Math.min(Math.max(sheetState.rowCount, 120), 500);
    const tabColor = definition.tabColor || palette.primary;
    const accent = hexToRgbColor(tabColor);
    const design = sheetDesign[definition.key] || { icon: "✨", purpose: "Operational mirror", owner: "Ops", tone: "Clean" };

    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: sheetState.sheetId,
          gridProperties: {
            frozenRowCount: 1,
            columnCount: Math.max(sheetState.columnCount, endColumnIndex),
            hideGridlines: true,
          },
          tabColorStyle: { rgbColor: accent },
        },
        fields: "gridProperties.frozenRowCount,gridProperties.columnCount,gridProperties.hideGridlines,tabColorStyle",
      },
    });

    for (const bandingId of sheetState.bandedRangeIds || []) {
      requests.push({ deleteBanding: { bandedRangeId: bandingId } });
    }

    requests.push({
      addBanding: {
        bandedRange: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 0,
            endRowIndex: rowLimit,
            startColumnIndex: 0,
            endColumnIndex,
          },
          rowProperties: {
            headerColorStyle: { rgbColor: accent },
            firstBandColorStyle: { rgbColor: hexToRgbColor(palette.surface) },
            secondBandColorStyle: { rgbColor: hexToRgbColor(palette.surfaceSoft) },
            footerColorStyle: { rgbColor: hexToRgbColor(palette.surfaceAlt) },
          },
        },
      },
    });

    requests.push(
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetState.sheetId,
            dimension: "ROWS",
            startIndex: 0,
            endIndex: 1,
          },
          properties: { pixelSize: 46 },
          fields: "pixelSize",
        },
      },
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetState.sheetId,
            dimension: "ROWS",
            startIndex: 1,
            endIndex: Math.min(rowLimit, 120),
          },
          properties: { pixelSize: 32 },
          fields: "pixelSize",
        },
      },
      {
        repeatCell: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex,
          },
          cell: {
            userEnteredFormat: {
              backgroundColorStyle: { rgbColor: accent },
              textFormat: {
                bold: true,
                fontFamily: "Manrope",
                fontSize: 10,
                foregroundColor: hexToRgbColor("#FFFFFF"),
              },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              wrapStrategy: "WRAP",
            },
          },
          fields: "userEnteredFormat(backgroundColorStyle,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
        },
      },
      {
        repeatCell: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 1,
            endRowIndex: rowLimit,
            startColumnIndex: 0,
            endColumnIndex,
          },
          cell: {
            userEnteredFormat: {
              textFormat: {
                fontFamily: "Manrope",
                fontSize: 10,
                foregroundColor: hexToRgbColor(palette.ink),
              },
              verticalAlignment: "MIDDLE",
              wrapStrategy: "WRAP",
            },
          },
          fields: "userEnteredFormat(textFormat,verticalAlignment,wrapStrategy)",
        },
      },
      {
        repeatCell: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 1,
          },
          cell: {
            note: `${design.icon} ${definition.title}\n${design.purpose}\n\nDesign rule: tables remain operational; playful characters stay decorative and non-blocking.`,
          },
          fields: "note",
        },
      },
      {
        updateBorders: {
          range: {
            sheetId: sheetState.sheetId,
            startRowIndex: 0,
            endRowIndex: rowLimit,
            startColumnIndex: 0,
            endColumnIndex,
          },
          top: buildBorder(tabColor, "SOLID_MEDIUM"),
          bottom: buildBorder(tabColor, "SOLID_MEDIUM"),
          left: buildBorder(tabColor, "SOLID_MEDIUM"),
          right: buildBorder(tabColor, "SOLID_MEDIUM"),
          innerHorizontal: buildBorder("#E5EFE7"),
          innerVertical: buildBorder("#E5EFE7"),
        },
      }
    );

    for (const [index, column] of definition.columns.entries()) {
      const width = Math.max(column.width || 180, 120);
      requests.push({
        updateDimensionProperties: {
          range: {
            sheetId: sheetState.sheetId,
            dimension: "COLUMNS",
            startIndex: index,
            endIndex: index + 1,
          },
          properties: { pixelSize: width },
          fields: "pixelSize",
        },
      });
    }
  }

  return requests;
}

async function ensureDashboardSheet() {
  let sheetStateMap = await getSpreadsheetState();
  if (!sheetStateMap.has(DASHBOARD_TITLE)) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: DASHBOARD_TITLE,
                index: 0,
                gridProperties: {
                  rowCount: 100,
                  columnCount: 8,
                  frozenRowCount: 8,
                  hideGridlines: true,
                },
                tabColorStyle: { rgbColor: hexToRgbColor(palette.primary) },
              },
            },
          },
        ],
      }),
    });
    sheetStateMap = await getSpreadsheetState();
  }

  return sheetStateMap.get(DASHBOARD_TITLE);
}

function buildDashboardRows() {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const rows = [
    ["🚜 Kisan Kamai Operations Garden ✨", "", "", "", "", "", "", ""],
    ["A polished command sheet for the Firebase -> Google Sheets operational mirror. Decorative toys and pets stay here so data tabs remain clean.", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["🌾 Source of truth", "Firebase first; Sheets is a best-effort mirror.", "", "🚜 Live ops", "Profiles, listings, bookings, support.", "", "✨ Last decorated", timestamp],
    ["🐾 Mascot corner", "🧸 toy tractor  🐕 guard pet  🐈 sheet helper", "", "🧼 Clean rule", "Readable tables first; glitter second.", "", "🔎 Quick check", "Run npm run sheets:verify"],
    ["", "", "", "", "", "", "", ""],
    ["Sheet map", "", "", "", "", "", "", ""],
    ["Icon", "Sheet", "Purpose", "Live rows", "Owner", "Tone", "Signal", "Action"],
  ];

  for (const definition of sheetDefinitions) {
    const design = sheetDesign[definition.key] || { icon: "✨", purpose: "Operational mirror", owner: "Ops", tone: "Clean" };
    const quotedTitle = quoteSheetTitle(definition.title);
    rows.push([
      design.icon,
      definition.title,
      design.purpose,
      `=MAX(COUNTA(${quotedTitle}!A:A)-1,0)`,
      design.owner,
      design.tone,
      "Live mirror",
      `Open ${definition.title}`,
    ]);
  }

  rows.push(
    ["", "", "", "", "", "", "", ""],
    ["Data flow", "", "", "", "", "", "", ""],
    ["Website action", "Firebase write", "Server mirror", "Google Sheets row", "Ops review", "Support follow-up", "Audit trail", "Done"],
    ["👤 User submits", "🔥 Source of truth", "🪞 Best-effort mirror", "📊 Decorated tab", "👀 Human review", "📞 Call/message", "🧾 sync_audit", "✅"],
    ["", "", "", "", "", "", "", ""],
    ["Design notes", "", "", "", "", "", "", ""],
    ["✨ Glitter is structural: borders, banding, tab colors, and status chips.", "", "", "", "🐾 Pets/toys are dashboard-only so operational tables stay useful.", "", "", ""],
  );

  return rows;
}

function buildDashboardFormatRequests(dashboardSheet) {
  const sheetId = dashboardSheet.sheetId;
  const allRange = {
    sheetId,
    startRowIndex: 0,
    endRowIndex: 80,
    startColumnIndex: 0,
    endColumnIndex: 8,
  };
  const cardBorder = buildBorder("#C7D8CC");
  const requests = [
    { unmergeCells: { range: allRange } },
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: {
            frozenRowCount: 8,
            hideGridlines: true,
            rowCount: Math.max(dashboardSheet.rowCount || 100, 100),
            columnCount: 8,
          },
          tabColorStyle: { rgbColor: hexToRgbColor(palette.primary) },
        },
        fields: "gridProperties.frozenRowCount,gridProperties.hideGridlines,gridProperties.rowCount,gridProperties.columnCount,tabColorStyle",
      },
    },
    {
      repeatCell: {
        range: allRange,
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#F7FBF8"),
            textFormat: {
              fontFamily: "Manrope",
              fontSize: 10,
              foregroundColor: hexToRgbColor(palette.ink),
            },
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)",
      },
    },
    {
      mergeCells: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
        mergeType: "MERGE_ALL",
      },
    },
    {
      mergeCells: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 8 },
        mergeType: "MERGE_ALL",
      },
    },
    {
      mergeCells: {
        range: { sheetId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 8 },
        mergeType: "MERGE_ALL",
      },
    },
    {
      mergeCells: {
        range: { sheetId, startRowIndex: 25, endRowIndex: 26, startColumnIndex: 0, endColumnIndex: 8 },
        mergeType: "MERGE_ALL",
      },
    },
    {
      mergeCells: {
        range: { sheetId, startRowIndex: 29, endRowIndex: 30, startColumnIndex: 0, endColumnIndex: 4 },
        mergeType: "MERGE_ALL",
      },
    },
    {
      mergeCells: {
        range: { sheetId, startRowIndex: 29, endRowIndex: 30, startColumnIndex: 4, endColumnIndex: 8 },
        mergeType: "MERGE_ALL",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor(palette.primary),
            textFormat: {
              bold: true,
              fontFamily: "Manrope",
              fontSize: 22,
              foregroundColor: hexToRgbColor("#FFFFFF"),
            },
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#E9F5ED"),
            textFormat: {
              italic: true,
              fontFamily: "Manrope",
              fontSize: 10,
              foregroundColor: hexToRgbColor(palette.muted),
            },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, endRowIndex: 5, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#FFFFFF"),
            textFormat: { fontFamily: "Manrope", fontSize: 10, foregroundColor: hexToRgbColor(palette.ink) },
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor(palette.primaryDeep),
            textFormat: { bold: true, fontFamily: "Manrope", fontSize: 13, foregroundColor: hexToRgbColor("#FFFFFF") },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 7, endRowIndex: 8, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#DFF1E6"),
            textFormat: { bold: true, fontFamily: "Manrope", fontSize: 10, foregroundColor: hexToRgbColor(palette.ink) },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 8, endRowIndex: 23, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#FFFFFF"),
            textFormat: { fontFamily: "Manrope", fontSize: 10, foregroundColor: hexToRgbColor(palette.ink) },
            verticalAlignment: "MIDDLE",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 25, endRowIndex: 27, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor(palette.amberSoft),
            textFormat: { bold: true, fontFamily: "Manrope", fontSize: 11, foregroundColor: hexToRgbColor("#6A3B00") },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 29, endRowIndex: 30, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#EEF6F0"),
            textFormat: { fontFamily: "Manrope", fontSize: 10, foregroundColor: hexToRgbColor(palette.ink) },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
  ];

  for (const [index, width] of [72, 190, 320, 100, 150, 120, 140, 170].entries()) {
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: "COLUMNS",
          startIndex: index,
          endIndex: index + 1,
        },
        properties: { pixelSize: width },
        fields: "pixelSize",
      },
    });
  }

  for (const [startIndex, endIndex, height] of [
    [0, 1, 58],
    [1, 2, 44],
    [3, 5, 58],
    [6, 8, 38],
    [8, 23, 34],
    [25, 27, 38],
    [29, 30, 58],
  ]) {
    requests.push({
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex, endIndex },
        properties: { pixelSize: height },
        fields: "pixelSize",
      },
    });
  }

  for (const range of [
    { startRowIndex: 3, endRowIndex: 5, startColumnIndex: 0, endColumnIndex: 8 },
    { startRowIndex: 7, endRowIndex: 23, startColumnIndex: 0, endColumnIndex: 8 },
    { startRowIndex: 25, endRowIndex: 27, startColumnIndex: 0, endColumnIndex: 8 },
    { startRowIndex: 29, endRowIndex: 30, startColumnIndex: 0, endColumnIndex: 8 },
  ]) {
    requests.push({
      updateBorders: {
        range: { sheetId, ...range },
        top: cardBorder,
        bottom: cardBorder,
        left: cardBorder,
        right: cardBorder,
        innerHorizontal: buildBorder("#E7EFE8"),
        innerVertical: buildBorder("#E7EFE8"),
      },
    });
  }

  return requests;
}

async function updateDashboardValues() {
  await sheetsFetch(`/values/${encodeURIComponent(DASHBOARD_RANGE)}:clear`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  await sheetsFetch(`/values/${encodeURIComponent(`${DASHBOARD_TITLE}!A1`)}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    body: JSON.stringify({
      range: `${DASHBOARD_TITLE}!A1`,
      majorDimension: "ROWS",
      values: buildDashboardRows(),
    }),
  });
}

async function run() {
  const dashboardSheet = await ensureDashboardSheet();
  let state = await getSpreadsheetState();

  await sheetsFetch(":batchUpdate", {
    method: "POST",
    body: JSON.stringify({
      requests: [{ unmergeCells: { range: { sheetId: dashboardSheet.sheetId } } }],
    }),
  });

  await updateDashboardValues();
  state = await getSpreadsheetState();

  const refreshedDashboardSheet = state.get(DASHBOARD_TITLE);
  const requests = [
    ...buildOperationalRequests(state),
    ...buildDashboardFormatRequests(refreshedDashboardSheet || dashboardSheet),
  ];

  if (requests.length) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({ requests }),
    });
  }

  const decoratedAt = new Date().toISOString();
  await upsertWorkbookMetaEntries(
    [
      {
        section: "design",
        key: "decorated_at",
        value: decoratedAt,
        notes:
          "Workbook styled with polished headers, banding, borders, tab colors, and a Kisan Kamai HQ dashboard. Operational headers remain unchanged.",
      },
      {
        section: "design",
        key: "decorative_dashboard",
        value: DASHBOARD_TITLE,
        notes: "Strategic mascot/toy visuals live in this dashboard tab, not inside mirrored data rows.",
      },
    ],
    overrides
  );

  await appendAuditEntry(
    {
      recorded_at: decoratedAt,
      run_id: `sheets-decorate-${decoratedAt}`,
      entity_type: "workbook",
      entity_id: getGoogleSheetConfig(overrides).spreadsheetId,
      destination: "google-sheets",
      outcome: "success",
      operation: "decorate_workbook",
      note: `Decorated ${sheetDefinitions.length} operational tabs plus ${DASHBOARD_TITLE}.`,
      details_json: JSON.stringify({
        dashboard: DASHBOARD_TITLE,
        operationalTabs: sheetDefinitions.map((definition) => definition.title),
        safety: "No operational header rows moved or rewritten beyond existing manifest headers.",
      }),
    },
    overrides
  );

  console.log(
    `Decorated workbook ${getGoogleSheetConfig(overrides).spreadsheetId} with ${sheetDefinitions.length} operational tabs and ${DASHBOARD_TITLE}.`
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
