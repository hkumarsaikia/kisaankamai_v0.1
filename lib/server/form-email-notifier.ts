import "server-only";

import nodemailer from "nodemailer";
import type { FormSubmissionRecord } from "@/lib/local-data/types";
import {
  updateNotificationEmailStatus,
  type SheetAppendResult,
} from "@/lib/server/google-sheets";

type NotifyFormSubmissionInput = {
  submission: FormSubmissionRecord;
  mirroredRows: SheetAppendResult[];
};

const DEFAULT_NOTIFICATION_TO = "hkumarsaikia@gmail.com";

function getNotificationRecipient() {
  return (process.env.KK_FORM_NOTIFICATION_TO || DEFAULT_NOTIFICATION_TO).trim();
}

function getSmtpConfig() {
  const host = process.env.KK_SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.KK_SMTP_PORT || 465);
  const secure = String(process.env.KK_SMTP_SECURE || "true").toLowerCase() !== "false";
  const user = process.env.KK_SMTP_USER || "";
  const password = process.env.KK_SMTP_PASSWORD || "";

  return {
    host,
    port: Number.isFinite(port) ? port : 465,
    secure,
    user,
    password,
  };
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function titleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function visiblePayloadRows(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      const displayValue =
        typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e4ebe6;color:#416053;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(titleCase(key))}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e4ebe6;color:#10251d;font-size:14px;font-weight:650;white-space:pre-wrap;">${escapeHtml(displayValue)}</td>
        </tr>`;
    })
    .join("");
}

function buildEmailHtml(submission: FormSubmissionRecord, row: SheetAppendResult) {
  const rowNumber = row.rowNumber ? `row ${row.rowNumber}` : "new row";
  const payloadRows = visiblePayloadRows(submission.payload);

  return `
    <div style="margin:0;padding:24px;background:#f4f7f3;font-family:Manrope,Arial,sans-serif;color:#10251d;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #dbe5df;border-radius:22px;overflow:hidden;box-shadow:0 18px 60px rgba(16,37,29,.12);">
        <div style="background:#143b2e;padding:24px 28px;color:#ffffff;">
          <div style="font-size:13px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c2ecd9;">Kisan Kamai Website Request</div>
          <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;">${escapeHtml(titleCase(submission.type))}</h1>
          <p style="margin:10px 0 0;color:#d9efe5;font-size:14px;">Saved to <strong>${escapeHtml(row.title)}</strong>, <strong>${escapeHtml(rowNumber)}</strong>. Submission ID: <strong>${escapeHtml(submission.id)}</strong>.</p>
        </div>
        <div style="padding:24px 28px;">
          <p style="margin:0 0 16px;color:#416053;font-size:14px;line-height:1.6;">A new live website request was saved in Firebase and mirrored to Google Sheets. Review the request details below and follow up from the matching workbook row.</p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e4ebe6;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #e4ebe6;color:#416053;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Submitted At</td>
              <td style="padding:10px 12px;border-bottom:1px solid #e4ebe6;color:#10251d;font-size:14px;font-weight:650;">${escapeHtml(submission.createdAt)}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #e4ebe6;color:#416053;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Sheet Location</td>
              <td style="padding:10px 12px;border-bottom:1px solid #e4ebe6;color:#10251d;font-size:14px;font-weight:650;">${escapeHtml(row.title)} ${escapeHtml(rowNumber)}</td>
            </tr>
            ${payloadRows}
          </table>
        </div>
      </div>
    </div>`;
}

function buildEmailText(submission: FormSubmissionRecord, row: SheetAppendResult) {
  const details = Object.entries(submission.payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${titleCase(key)}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`)
    .join("\n");

  return [
    "Kisan Kamai website request",
    `Type: ${submission.type}`,
    `Submission ID: ${submission.id}`,
    `Submitted At: ${submission.createdAt}`,
    `Sheet: ${row.title}`,
    `Row: ${row.rowNumber || "unknown"}`,
    "",
    details,
  ].join("\n");
}

async function updateRows(
  rows: SheetAppendResult[],
  status: "sent" | "email_failed" | "email_config_missing",
  sentAt?: string
) {
  await Promise.all(
    rows
      .filter((row) => row.rowNumber)
      .map((row) => updateNotificationEmailStatus(row.sheet, row.rowNumber!, status, sentAt))
  );
}

export async function notifyFormSubmission({
  submission,
  mirroredRows,
}: NotifyFormSubmissionInput) {
  const rows = mirroredRows.filter((row) => row.rowNumber);
  if (!rows.length) {
    return;
  }

  const recipient = getNotificationRecipient();
  const smtp = getSmtpConfig();
  if (!recipient || !smtp.user || !smtp.password) {
    await updateRows(rows, "email_config_missing");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.password,
    },
  });

  try {
    for (const row of rows) {
      await transporter.sendMail({
        to: recipient,
        from: {
          name: process.env.KK_SMTP_FROM_NAME || "Kisan Kamai Website",
          address: process.env.KK_SMTP_FROM || smtp.user,
        },
        subject: `Kisan Kamai form update: ${row.title} row ${row.rowNumber}`,
        text: buildEmailText(submission, row),
        html: buildEmailHtml(submission, row),
      });
    }

    await updateRows(rows, "sent", new Date().toISOString());
  } catch (error) {
    console.error("Could not send Kisan Kamai form notification email:", error);
    await updateRows(rows, "email_failed");
  }
}
