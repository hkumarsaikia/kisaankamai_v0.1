const KISAN_KAMAI_NOTIFICATION_TO = "hkumarsaikia@gmail.com";
const KISAN_KAMAI_FORM_SHEETS = ["support_requests", "booking_requests", "newsletter_subscriptions", "feedback"];
const notification_email_sent_at = "Notification Email Sent At";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Kisan Kamai")
    .addItem("Install email trigger", "installKisanKamaiEmailTrigger")
    .addItem("Send pending form emails", "sendPendingKisanKamaiNotifications")
    .addToUi();
}

function installKisanKamaiEmailTrigger() {
  const spreadsheet = SpreadsheetApp.getActive();
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === "sendPendingKisanKamaiNotifications")
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger("sendPendingKisanKamaiNotifications")
    .forSpreadsheet(spreadsheet)
    .onChange()
    .create();
}

function sendPendingKisanKamaiNotifications() {
  const spreadsheet = SpreadsheetApp.getActive();

  KISAN_KAMAI_FORM_SHEETS.forEach((sheetName) => {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      return;
    }

    const range = sheet.getDataRange();
    const values = range.getValues();
    if (values.length < 2) {
      return;
    }

    const headers = values[0].map((header) => String(header || "").trim());
    const statusIndex = headers.indexOf("Notification Email Status");
    const toIndex = headers.indexOf("Notification Email To");
    const sentAtIndex = headers.indexOf(notification_email_sent_at);
    if (statusIndex < 0 || toIndex < 0 || sentAtIndex < 0) {
      return;
    }

    values.slice(1).forEach((row, offset) => {
      const rowNumber = offset + 2;
      const status = String(row[statusIndex] || "").trim().toLowerCase();
      const recipient = String(row[toIndex] || KISAN_KAMAI_NOTIFICATION_TO).trim();
      if (status === "sent" || status === "sending" || !recipient) {
        return;
      }

      sheet.getRange(rowNumber, statusIndex + 1).setValue("sending");

      const rowObject = buildKisanKamaiRowObject(headers, row);
      const subject = `Kisan Kamai form update: ${sheetName} row ${rowNumber}`;
      const htmlBody = buildKisanKamaiEmailHtml(sheetName, rowNumber, rowObject);
      const plainBody = buildKisanKamaiEmailText(sheetName, rowNumber, rowObject);

      MailApp.sendEmail({
        to: recipient,
        subject,
        body: plainBody,
        htmlBody,
        name: "Kisan Kamai Sheets",
      });

      sheet.getRange(rowNumber, statusIndex + 1).setValue("sent");
      sheet.getRange(rowNumber, sentAtIndex + 1).setValue(new Date());
      sheet.getRange(rowNumber, toIndex + 1).setValue(recipient);
    });
  });
}

function buildKisanKamaiRowObject(headers, row) {
  return headers.reduce((record, header, index) => {
    if (header) {
      record[header] = row[index];
    }
    return record;
  }, {});
}

function buildKisanKamaiEmailHtml(sheetName, rowNumber, rowObject) {
  const rows = Object.keys(rowObject)
    .filter((key) => !/^Notification Email/.test(key))
    .map((key) => {
      const value = rowObject[key] === "" || rowObject[key] === null ? "-" : rowObject[key];
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e4ebe6;color:#416053;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(key)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e4ebe6;color:#10251d;font-size:14px;font-weight:600;">${escapeHtml(String(value))}</td>
        </tr>`;
    })
    .join("");

  return `
    <div style="margin:0;padding:24px;background:#f4f7f3;font-family:Manrope,Arial,sans-serif;color:#10251d;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #dbe5df;border-radius:22px;overflow:hidden;box-shadow:0 18px 60px rgba(16,37,29,.12);">
        <div style="background:#143b2e;padding:24px 28px;color:#ffffff;">
          <div style="font-size:13px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c2ecd9;">Kisan Kamai Form Update</div>
          <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;">New request mirrored to Google Sheets</h1>
          <p style="margin:10px 0 0;color:#d9efe5;font-size:14px;">Sheet <strong>${escapeHtml(sheetName)}</strong>, row <strong>${rowNumber}</strong> was updated by the live website.</p>
        </div>
        <div style="padding:24px 28px;">
          <p style="margin:0 0 16px;color:#416053;font-size:14px;line-height:1.6;">Review the row in the workbook and handle the request based on the source page, category, contact details, and message below.</p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e4ebe6;border-radius:14px;overflow:hidden;">${rows}</table>
        </div>
      </div>
    </div>`;
}

function buildKisanKamaiEmailText(sheetName, rowNumber, rowObject) {
  const details = Object.keys(rowObject)
    .filter((key) => !/^Notification Email/.test(key))
    .map((key) => `${key}: ${rowObject[key] || "-"}`)
    .join("\n");

  return `Kisan Kamai form update\nSheet: ${sheetName}\nRow: ${rowNumber}\n\n${details}`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
