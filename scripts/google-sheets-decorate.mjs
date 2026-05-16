import { JWT } from "google-auth-library";
import workbookManifest from "../data/operational-sheets-workbook.json" with { type: "json" };
import { appendAuditEntry, readSheetRows, replaceSheetRows, upsertWorkbookMetaEntries } from "./lib/google-sheets.mjs";
import { getGoogleSheetConfig, isSheetsConfigured, loadRepoEnv } from "./lib/env.mjs";
import { getStringOption, parseArgs, printUsage } from "./lib/cli.mjs";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const DASHBOARD_TITLE = "Kisan Kamai HQ";
const CHART_DATA_TITLE = "Kisan Kamai Chart Data";
const DASHBOARD_RANGE = `${DASHBOARD_TITLE}!A1:H120`;
const CHART_DATA_RANGE = `${CHART_DATA_TITLE}!A1:Q80`;
const SHEET_FONT = "Arial";

const options = parseArgs();
if (options.help) {
  printUsage([
    "Usage: node scripts/google-sheets-decorate.mjs [--sheet-id <id>]",
    "",
    "Applies a polished visual layer to the operational Google Sheets workbook.",
    "The script does not move or rewrite operational headers. Dashboard copy",
    "and formatting are kept production-presentable for operational review.",
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
  workbook_meta: { code: "META", purpose: "Workbook settings and mirror notes", owner: "Operations", tone: "Slate" },
  owners: { code: "OWN", purpose: "Owner profile mirror", owner: "Profiles", tone: "Emerald" },
  renters: { code: "REN", purpose: "Renter profile mirror", owner: "Profiles", tone: "Sky" },
  listings: { code: "LST", purpose: "Owner-published equipment", owner: "Marketplace", tone: "Harvest" },
  bookings: { code: "BKG", purpose: "Booking requests and status", owner: "Bookings", tone: "Violet" },
  payments: { code: "EST", purpose: "Direct settlement estimates", owner: "Finance notes", tone: "Amber" },
  saved_items: { code: "SAV", purpose: "Saved equipment mirror", owner: "Renter workspace", tone: "Teal" },
  support_requests: { code: "SUP", purpose: "Support and public request inbox", owner: "Support", tone: "Rose" },
  booking_requests: { code: "CBK", purpose: "Public booking callback requests", owner: "Support", tone: "Indigo" },
  newsletter_subscriptions: { code: "NEWS", purpose: "Newsletter signups", owner: "Marketing", tone: "Green" },
  coming_soon_notifications: { code: "WAIT", purpose: "Coming-soon interest list", owner: "Launch", tone: "Orange" },
  feedback: { code: "FDBK", purpose: "Owner and renter feedback", owner: "Product", tone: "Purple" },
  bug_reports: { code: "BUG", purpose: "Client bug reports", owner: "Engineering", tone: "Red" },
  auth_events: { code: "AUTH", purpose: "Auth activity log", owner: "Security", tone: "Blue" },
  sync_audit: { code: "AUD", purpose: "Mirror and release audit trail", owner: "Operations", tone: "Graphite" },
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

const chartPalette = ["#0B4F37", "#2E7D5A", "#F2A23A", "#2563EB", "#7C3AED", "#DC2626", "#0F766E"];

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
    "spreadsheetId,sheets(properties(sheetId,title,index,hidden,gridProperties(rowCount,columnCount,frozenRowCount,hideGridlines)),bandedRanges(bandedRangeId),charts(chartId,spec(title)))";
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
        hidden: Boolean(sheet.properties?.hidden),
        bandedRangeIds: (sheet.bandedRanges || [])
          .map((banding) => banding.bandedRangeId)
          .filter((bandedRangeId) => Number.isInteger(bandedRangeId)),
        chartIds: (sheet.charts || [])
          .map((chart) => chart.chartId)
          .filter((chartId) => Number.isInteger(chartId)),
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
    const design = sheetDesign[definition.key] || { code: "OPS", purpose: "Operational mirror", owner: "Operations", tone: "Clean" };

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
                fontFamily: SHEET_FONT,
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
                fontFamily: SHEET_FONT,
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
            note: `${design.code} - ${definition.title}\n${design.purpose}\n\nDesign rule: tables remain operational, filterable, and readable for production review.`,
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
  return ensureSheet(DASHBOARD_TITLE, {
    index: 0,
    rowCount: 120,
    columnCount: 8,
    frozenRowCount: 8,
    hidden: false,
  });
}

async function ensureChartDataSheet() {
  return ensureSheet(CHART_DATA_TITLE, {
    index: 1,
    rowCount: 100,
    columnCount: 17,
    frozenRowCount: 1,
    hidden: true,
  });
}

async function ensureSheet(title, properties) {
  let sheetStateMap = await getSpreadsheetState();
  if (!sheetStateMap.has(title)) {
    await sheetsFetch(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title,
                index: properties.index,
                gridProperties: {
                  rowCount: properties.rowCount,
                  columnCount: properties.columnCount,
                  frozenRowCount: properties.frozenRowCount,
                  hideGridlines: true,
                },
                hidden: properties.hidden,
                tabColorStyle: { rgbColor: hexToRgbColor(palette.primary) },
              },
            },
          },
        ],
      }),
    });
    sheetStateMap = await getSpreadsheetState();
  }

  return sheetStateMap.get(title);
}

function buildDashboardRows() {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const rows = [
    ["Kisan Kamai Operations HQ", "", "", "", "", "", "", ""],
    ["Production workbook for the Firebase-to-Google-Sheets operational mirror. Sheets support review and reporting; Firebase remains the source of truth.", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["Source of truth", "Firebase first; Sheets is a best-effort mirror.", "", "Operational scope", "Profiles, listings, bookings, support.", "", "Last decorated", timestamp],
    ["Data rule", "Do not edit mirrored rows as source data.", "", "Review rule", "Use filters, status columns, and audit tabs for triage.", "", "Quick check", "Run npm run sheets:verify"],
    ["", "", "", "", "", "", "", ""],
    ["Sheet map", "", "", "", "", "", "", ""],
    ["Code", "Sheet", "Purpose", "Live rows", "Owner", "Tone", "Signal", "Action"],
  ];

  for (const definition of sheetDefinitions) {
    const design = sheetDesign[definition.key] || { code: "OPS", purpose: "Operational mirror", owner: "Operations", tone: "Clean" };
    const quotedTitle = quoteSheetTitle(definition.title);
    rows.push([
      design.code,
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
    ["User submits", "Source of truth", "Best-effort mirror", "Decorated tab", "Human review", "Call/message", "sync_audit", "Complete"],
    ["", "", "", "", "", "", "", ""],
    ["Workbook standard", "", "", "", "", "", "", ""],
    ["Use clean headers, frozen filters, status-based conditional formatting, compact notes, and consistent row heights. Keep operational tabs readable before presentation styling.", "", "", "", "Dashboard content should explain ownership, data flow, and verification without temporary demo wording.", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["Live visual board", "", "", "", "", "", "", ""],
    ["Interactive Google Sheets charts below are linked to formula-backed ranges in the hidden Kisan Kamai Chart Data sheet. They refresh automatically as mirrored rows change.", "", "", "", "", "", "", ""],
  );

  return rows;
}

function buildChartDataRows() {
  const rows = Array.from({ length: 80 }, () => Array.from({ length: 17 }, () => ""));
  const set = (rowIndex, columnIndex, value) => {
    rows[rowIndex][columnIndex] = value;
  };
  const countRows = (title) => `=MAX(COUNTA(${quoteSheetTitle(title)}!A:A)-1,0)`;

  set(0, 0, "Operational Area");
  set(0, 1, "Live Rows");
  for (const [index, definition] of sheetDefinitions.entries()) {
    set(index + 1, 0, definition.title);
    set(index + 1, 1, countRows(definition.title));
  }

  set(0, 3, "Booking Status");
  set(0, 4, "Bookings");
  for (const [index, status] of ["pending", "confirmed", "active", "completed", "cancelled"].entries()) {
    set(index + 1, 3, status);
    set(index + 1, 4, `=COUNTIF(bookings!F:F,D${index + 2})`);
  }

  set(0, 6, "Listing Status");
  set(0, 7, "Listings");
  for (const [index, status] of ["active", "paused", "draft", "archived", "deleted"].entries()) {
    set(index + 1, 6, status);
    set(index + 1, 7, `=COUNTIF(listings!H:H,G${index + 2})`);
  }

  set(0, 9, "Public Channel");
  set(0, 10, "Rows");
  const submissionSheets = [
    ["Support", "support_requests"],
    ["Booking callbacks", "booking_requests"],
    ["Newsletter", "newsletter_subscriptions"],
    ["Coming soon", "coming_soon_notifications"],
    ["Feedback", "feedback"],
    ["Bug reports", "bug_reports"],
  ];
  for (const [index, [label, title]] of submissionSheets.entries()) {
    set(index + 1, 9, label);
    set(index + 1, 10, countRows(title));
  }

  set(0, 12, "Notification Status");
  set(0, 13, "Rows");
  const notificationStatusCells = [
    ["support_requests", "Q"],
    ["booking_requests", "R"],
    ["newsletter_subscriptions", "H"],
    ["coming_soon_notifications", "I"],
    ["feedback", "N"],
  ];
  for (const [index, status] of ["pending", "sending", "sent", "failed"].entries()) {
    set(index + 1, 12, status);
    set(
      index + 1,
      13,
      `=${notificationStatusCells
        .map(([title, column]) => `COUNTIF(${quoteSheetTitle(title)}!${column}:${column},M${index + 2})`)
        .join("+")}`
    );
  }

  set(0, 15, "Equipment Category");
  set(0, 16, "Listings");
  set(
    1,
    15,
    '=IFERROR(QUERY(listings!G2:G,"select G, count(G) where G is not null group by G order by count(G) desc label G \'\', count(G) \'\'",0),{"No category",0})'
  );

  return rows;
}

function buildDashboardFormatRequests(dashboardSheet) {
  const sheetId = dashboardSheet.sheetId;
  const allRange = {
    sheetId,
    startRowIndex: 0,
    endRowIndex: 120,
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
            rowCount: Math.max(dashboardSheet.rowCount || 120, 120),
            columnCount: 8,
          },
          hidden: false,
          tabColorStyle: { rgbColor: hexToRgbColor(palette.primary) },
        },
        fields: "gridProperties.frozenRowCount,gridProperties.hideGridlines,gridProperties.rowCount,gridProperties.columnCount,hidden,tabColorStyle",
      },
    },
    {
      repeatCell: {
        range: allRange,
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#F7FBF8"),
            textFormat: {
              fontFamily: SHEET_FONT,
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
              fontFamily: SHEET_FONT,
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
              fontFamily: SHEET_FONT,
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
            textFormat: { fontFamily: SHEET_FONT, fontSize: 10, foregroundColor: hexToRgbColor(palette.ink) },
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
            textFormat: { bold: true, fontFamily: SHEET_FONT, fontSize: 13, foregroundColor: hexToRgbColor("#FFFFFF") },
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
            textFormat: { bold: true, fontFamily: SHEET_FONT, fontSize: 10, foregroundColor: hexToRgbColor(palette.ink) },
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
            textFormat: { fontFamily: SHEET_FONT, fontSize: 10, foregroundColor: hexToRgbColor(palette.ink) },
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
            textFormat: { bold: true, fontFamily: SHEET_FONT, fontSize: 11, foregroundColor: hexToRgbColor("#6A3B00") },
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
            textFormat: { fontFamily: SHEET_FONT, fontSize: 10, foregroundColor: hexToRgbColor(palette.ink) },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
    {
      mergeCells: {
        range: { sheetId, startRowIndex: 31, endRowIndex: 32, startColumnIndex: 0, endColumnIndex: 8 },
        mergeType: "MERGE_ALL",
      },
    },
    {
      mergeCells: {
        range: { sheetId, startRowIndex: 32, endRowIndex: 33, startColumnIndex: 0, endColumnIndex: 8 },
        mergeType: "MERGE_ALL",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 31, endRowIndex: 32, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor(palette.primaryDeep),
            textFormat: { bold: true, fontFamily: SHEET_FONT, fontSize: 13, foregroundColor: hexToRgbColor("#FFFFFF") },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 32, endRowIndex: 33, startColumnIndex: 0, endColumnIndex: 8 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#E9F5ED"),
            textFormat: { fontFamily: SHEET_FONT, fontSize: 10, foregroundColor: hexToRgbColor(palette.muted) },
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
    [31, 33, 38],
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
    { startRowIndex: 31, endRowIndex: 33, startColumnIndex: 0, endColumnIndex: 8 },
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

function buildChartDataFormatRequests(chartDataSheet) {
  const sheetId = chartDataSheet.sheetId;
  const requests = [
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          hidden: true,
          gridProperties: {
            frozenRowCount: 1,
            hideGridlines: true,
            rowCount: Math.max(chartDataSheet.rowCount || 100, 100),
            columnCount: 17,
          },
          tabColorStyle: { rgbColor: hexToRgbColor("#6B7280") },
        },
        fields: "hidden,gridProperties.frozenRowCount,gridProperties.hideGridlines,gridProperties.rowCount,gridProperties.columnCount,tabColorStyle",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 80, startColumnIndex: 0, endColumnIndex: 17 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#F8FAFC"),
            textFormat: { fontFamily: SHEET_FONT, fontSize: 10, foregroundColor: hexToRgbColor(palette.ink) },
            verticalAlignment: "MIDDLE",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 17 },
        cell: {
          userEnteredFormat: {
            backgroundColor: hexToRgbColor("#111827"),
            textFormat: { bold: true, fontFamily: SHEET_FONT, fontSize: 10, foregroundColor: hexToRgbColor("#FFFFFF") },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
  ];

  for (const [index, width] of Array.from({ length: 17 }, (_, index) => [index, index % 3 === 2 ? 34 : 150])) {
    requests.push({
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 },
        properties: { pixelSize: width },
        fields: "pixelSize",
      },
    });
  }

  return requests;
}

function sourceRange(sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex) {
  return {
    sources: [
      {
        sheetId,
        startRowIndex,
        endRowIndex,
        startColumnIndex,
        endColumnIndex,
      },
    ],
  };
}

function anchor(dashboardSheetId, rowIndex, columnIndex, widthPixels, heightPixels) {
  return {
    overlayPosition: {
      anchorCell: { sheetId: dashboardSheetId, rowIndex, columnIndex },
      offsetXPixels: 0,
      offsetYPixels: 0,
      widthPixels,
      heightPixels,
    },
  };
}

function buildBasicChartRequest({
  dashboardSheetId,
  chartDataSheetId,
  title,
  subtitle,
  chartType,
  domain,
  series,
  rowIndex,
  columnIndex,
  widthPixels = 560,
  heightPixels = 300,
  leftAxisTitle = "Rows",
  bottomAxisTitle = "",
}) {
  return {
    addChart: {
      chart: {
        spec: {
          title,
          subtitle,
          fontName: SHEET_FONT,
          backgroundColorStyle: { rgbColor: hexToRgbColor("#FFFFFF") },
          titleTextFormat: {
            bold: true,
            fontSize: 14,
            foregroundColor: hexToRgbColor(palette.ink),
          },
          subtitleTextFormat: {
            fontSize: 10,
            foregroundColor: hexToRgbColor(palette.muted),
          },
          basicChart: {
            chartType,
            legendPosition: "NO_LEGEND",
            axis: [
              { position: "BOTTOM_AXIS", title: bottomAxisTitle },
              { position: "LEFT_AXIS", title: leftAxisTitle },
            ],
            domains: [
              {
                domain: {
                  sourceRange: sourceRange(chartDataSheetId, domain.startRowIndex, domain.endRowIndex, domain.startColumnIndex, domain.endColumnIndex),
                },
              },
            ],
            series: series.map((range, index) => ({
              series: {
                sourceRange: sourceRange(chartDataSheetId, range.startRowIndex, range.endRowIndex, range.startColumnIndex, range.endColumnIndex),
              },
              targetAxis: chartType === "BAR" ? "BOTTOM_AXIS" : "LEFT_AXIS",
              colorStyle: { rgbColor: hexToRgbColor(chartPalette[index % chartPalette.length]) },
            })),
            headerCount: 1,
          },
        },
        position: anchor(dashboardSheetId, rowIndex, columnIndex, widthPixels, heightPixels),
      },
    },
  };
}

function buildPieChartRequest({
  dashboardSheetId,
  chartDataSheetId,
  title,
  subtitle,
  domain,
  series,
  rowIndex,
  columnIndex,
  widthPixels = 560,
  heightPixels = 300,
}) {
  return {
    addChart: {
      chart: {
        spec: {
          title,
          subtitle,
          fontName: SHEET_FONT,
          backgroundColorStyle: { rgbColor: hexToRgbColor("#FFFFFF") },
          titleTextFormat: {
            bold: true,
            fontSize: 14,
            foregroundColor: hexToRgbColor(palette.ink),
          },
          subtitleTextFormat: {
            fontSize: 10,
            foregroundColor: hexToRgbColor(palette.muted),
          },
          pieChart: {
            legendPosition: "RIGHT_LEGEND",
            domain: {
              sourceRange: sourceRange(chartDataSheetId, domain.startRowIndex, domain.endRowIndex, domain.startColumnIndex, domain.endColumnIndex),
            },
            series: {
              sourceRange: sourceRange(chartDataSheetId, series.startRowIndex, series.endRowIndex, series.startColumnIndex, series.endColumnIndex),
            },
            threeDimensional: false,
          },
        },
        position: anchor(dashboardSheetId, rowIndex, columnIndex, widthPixels, heightPixels),
      },
    },
  };
}

function buildDashboardChartRequests(dashboardSheet, chartDataSheet) {
  const dashboardSheetId = dashboardSheet.sheetId;
  const chartDataSheetId = chartDataSheet.sheetId;
  const requests = (dashboardSheet.chartIds || []).map((chartId) => ({
    deleteEmbeddedObject: { objectId: chartId },
  }));

  requests.push(
    buildBasicChartRequest({
      dashboardSheetId,
      chartDataSheetId,
      title: "Operational Row Volume",
      subtitle: "Live row counts from every operational tab",
      chartType: "COLUMN",
      domain: { startRowIndex: 0, endRowIndex: sheetDefinitions.length + 1, startColumnIndex: 0, endColumnIndex: 1 },
      series: [{ startRowIndex: 0, endRowIndex: sheetDefinitions.length + 1, startColumnIndex: 1, endColumnIndex: 2 }],
      rowIndex: 34,
      columnIndex: 0,
      leftAxisTitle: "Rows",
      bottomAxisTitle: "Sheet",
    }),
    buildPieChartRequest({
      dashboardSheetId,
      chartDataSheetId,
      title: "Booking Status Mix",
      subtitle: "Current booking states from the bookings mirror",
      domain: { startRowIndex: 1, endRowIndex: 6, startColumnIndex: 3, endColumnIndex: 4 },
      series: { startRowIndex: 1, endRowIndex: 6, startColumnIndex: 4, endColumnIndex: 5 },
      rowIndex: 34,
      columnIndex: 4,
    }),
    buildBasicChartRequest({
      dashboardSheetId,
      chartDataSheetId,
      title: "Listing Inventory Status",
      subtitle: "Owner-published equipment state distribution",
      chartType: "BAR",
      domain: { startRowIndex: 0, endRowIndex: 6, startColumnIndex: 6, endColumnIndex: 7 },
      series: [{ startRowIndex: 0, endRowIndex: 6, startColumnIndex: 7, endColumnIndex: 8 }],
      rowIndex: 52,
      columnIndex: 0,
      leftAxisTitle: "Status",
      bottomAxisTitle: "Listings",
    }),
    buildBasicChartRequest({
      dashboardSheetId,
      chartDataSheetId,
      title: "Public Submission Channels",
      subtitle: "Support, callback, newsletter, feedback, and bug-report intake",
      chartType: "COLUMN",
      domain: { startRowIndex: 0, endRowIndex: 7, startColumnIndex: 9, endColumnIndex: 10 },
      series: [{ startRowIndex: 0, endRowIndex: 7, startColumnIndex: 10, endColumnIndex: 11 }],
      rowIndex: 52,
      columnIndex: 4,
      leftAxisTitle: "Rows",
      bottomAxisTitle: "Channel",
    }),
    buildPieChartRequest({
      dashboardSheetId,
      chartDataSheetId,
      title: "Notification Email Status",
      subtitle: "Pending, sending, sent, and failed rows across form mirrors",
      domain: { startRowIndex: 1, endRowIndex: 5, startColumnIndex: 12, endColumnIndex: 13 },
      series: { startRowIndex: 1, endRowIndex: 5, startColumnIndex: 13, endColumnIndex: 14 },
      rowIndex: 70,
      columnIndex: 0,
    }),
    buildBasicChartRequest({
      dashboardSheetId,
      chartDataSheetId,
      title: "Equipment Category Mix",
      subtitle: "Live listing categories from the listings mirror",
      chartType: "COLUMN",
      domain: { startRowIndex: 0, endRowIndex: 20, startColumnIndex: 15, endColumnIndex: 16 },
      series: [{ startRowIndex: 0, endRowIndex: 20, startColumnIndex: 16, endColumnIndex: 17 }],
      rowIndex: 70,
      columnIndex: 4,
      leftAxisTitle: "Listings",
      bottomAxisTitle: "Category",
    })
  );

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

async function updateChartDataValues() {
  await sheetsFetch(`/values/${encodeURIComponent(CHART_DATA_RANGE)}:clear`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  await sheetsFetch(`/values/${encodeURIComponent(`${CHART_DATA_TITLE}!A1`)}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    body: JSON.stringify({
      range: `${CHART_DATA_TITLE}!A1`,
      majorDimension: "ROWS",
      values: buildChartDataRows(),
    }),
  });
}

async function removeWorkbookMetaEntry(section, key) {
  const rows = await readSheetRows("workbook_meta", overrides);
  const dataRows = rows.slice(1);
  const filteredRows = dataRows.filter((row) => row[0] !== section || row[1] !== key);
  if (filteredRows.length !== dataRows.length) {
    await replaceSheetRows("workbook_meta", filteredRows, overrides);
  }
}

async function run() {
  const dashboardSheet = await ensureDashboardSheet();
  const chartDataSheet = await ensureChartDataSheet();
  let state = await getSpreadsheetState();

  await sheetsFetch(":batchUpdate", {
    method: "POST",
    body: JSON.stringify({
      requests: [{ unmergeCells: { range: { sheetId: dashboardSheet.sheetId } } }],
    }),
  });

  await updateDashboardValues();
  await updateChartDataValues();
  state = await getSpreadsheetState();

  const refreshedDashboardSheet = state.get(DASHBOARD_TITLE);
  const refreshedChartDataSheet = state.get(CHART_DATA_TITLE);
  const requests = [
    ...buildOperationalRequests(state),
    ...buildDashboardFormatRequests(refreshedDashboardSheet || dashboardSheet),
    ...buildChartDataFormatRequests(refreshedChartDataSheet || chartDataSheet),
    ...buildDashboardChartRequests(refreshedDashboardSheet || dashboardSheet, refreshedChartDataSheet || chartDataSheet),
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
        key: "operations_dashboard",
        value: DASHBOARD_TITLE,
        notes: "Production dashboard for workbook ownership, data-flow, verification guidance, and live native Google Sheets charts.",
      },
      {
        section: "design",
        key: "live_chart_data",
        value: CHART_DATA_TITLE,
        notes: "Hidden formula-backed sheet powering native dashboard charts. Charts update automatically when mirrored rows change.",
      },
    ],
    overrides
  );
  await removeWorkbookMetaEntry("design", "decorative_dashboard");

  await appendAuditEntry(
    {
      recorded_at: decoratedAt,
      run_id: `sheets-decorate-${decoratedAt}`,
      entity_type: "workbook",
      entity_id: getGoogleSheetConfig(overrides).spreadsheetId,
      destination: "google-sheets",
      outcome: "success",
      operation: "decorate_workbook",
      note: `Decorated ${sheetDefinitions.length} operational tabs plus ${DASHBOARD_TITLE} live charts.`,
      details_json: JSON.stringify({
        dashboard: DASHBOARD_TITLE,
        chartDataSheet: CHART_DATA_TITLE,
        charts: [
          "Operational Row Volume",
          "Booking Status Mix",
          "Listing Inventory Status",
          "Public Submission Channels",
          "Notification Email Status",
          "Equipment Category Mix",
        ],
        operationalTabs: sheetDefinitions.map((definition) => definition.title),
        safety: "No operational header rows moved or rewritten beyond existing manifest headers.",
      }),
    },
    overrides
  );

  console.log(
    `Decorated workbook ${getGoogleSheetConfig(overrides).spreadsheetId} with ${sheetDefinitions.length} operational tabs, ${DASHBOARD_TITLE}, and live native charts.`
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
