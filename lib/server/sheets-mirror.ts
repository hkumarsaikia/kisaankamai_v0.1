import "server-only";

import workbookManifest from "@/data/operational-sheets-workbook.json";
import type {
  BookingRecord,
  FormSubmissionRecord,
  ListingRecord,
  LocalSession,
  PaymentRecord,
  ProfileRecord,
} from "@/lib/local-data/types";
import type { BugReportRecord } from "@/lib/bug-reporting/types";
import { appendSheetRowsSafe, type SheetAppendResult, type SheetKey } from "@/lib/server/google-sheets";

type SheetColumnManifest = {
  key: SheetKey;
  columns: Array<{ key: string }>;
};

const SHEET_COLUMN_KEYS = new Map(
  (workbookManifest.sheets as SheetColumnManifest[]).map((sheet) => [sheet.key, sheet.columns.map((column) => column.key)])
);
const FORM_NOTIFICATION_EMAIL_TO = "hkumarsaikia@gmail.com";
const PENDING_NOTIFICATION_STATUS = "pending";

function notificationEmailFields() {
  return {
    notification_email_to: FORM_NOTIFICATION_EMAIL_TO,
    notification_email_status: PENDING_NOTIFICATION_STATUS,
    notification_email_sent_at: "",
  };
}

function sheetValues(sheet: SheetKey, row: Record<string, unknown>) {
  const columnKeys = SHEET_COLUMN_KEYS.get(sheet);
  if (!columnKeys) {
    throw new Error(`No sheet manifest found for ${sheet}`);
  }

  return columnKeys.map((columnKey) => row[columnKey] ?? "");
}

function profileTargetSheets(rolePreference?: string) {
  return rolePreference === "owner" ? (["owners"] as const) : (["renters"] as const);
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

function textList(value: unknown) {
  if (!Array.isArray(value) || !value.length) {
    return "";
  }

  return value.map((entry) => String(entry)).join(" | ");
}

function listingImageFields(listing: ListingRecord) {
  return {
    gallery_image_1_url: listing.galleryImages[0] || "",
    gallery_image_2_url: listing.galleryImages[1] || "",
    gallery_image_3_url: listing.galleryImages[2] || "",
    gallery_image_1_path: listing.imagePaths[0] || "",
    gallery_image_2_path: listing.imagePaths[1] || "",
    gallery_image_3_path: listing.imagePaths[2] || "",
  };
}

export async function mirrorAuthEvent(input: {
  eventType: string;
  session?: LocalSession | null;
  identifier?: string;
  outcome: string;
  path?: string;
  workspace?: string;
}) {
  await appendSheetRowsSafe(
    [
      {
        sheet: "auth_events",
        values: sheetValues("auth_events", {
          occurred_at: new Date().toISOString(),
          event_type: input.eventType,
          user_id: input.session?.user.id || "",
          email_or_identifier: input.session?.user.email || input.identifier || "",
          phone: input.session?.user.phone || "",
          workspace: input.workspace || input.session?.activeWorkspace || "",
          path: input.path || "",
          outcome: input.outcome,
          source: "live-app",
        }),
      },
    ],
    {
      entityType: "auth_event",
      entityId: input.session?.user.id || input.identifier || input.eventType,
      note: input.eventType,
      operation: "append-auth-event",
    }
  );
}

export async function mirrorProfile(input: {
  userId: string;
  profile: ProfileRecord;
  source: string;
}) {
  const rows = profileTargetSheets(input.profile.rolePreference).map((sheet) => ({
    sheet,
    values: sheetValues(sheet, {
      mirrored_at: new Date().toISOString(),
      user_id: input.userId,
      account_scope: sheet === "owners" ? "owner" : "renter",
      full_name: input.profile.fullName,
      role_preference: input.profile.rolePreference,
      email: input.profile.email || "",
      phone: input.profile.phone || "",
      village: input.profile.village,
      address: input.profile.address,
      pincode: input.profile.pincode,
      field_area_acres: Number(input.profile.fieldArea || 0),
      farming_types: input.profile.farmingTypes || "",
      source: input.source,
      record_state: "live",
    }),
  }));

  await appendSheetRowsSafe(rows, {
    entityType: "profile",
    entityId: input.userId,
    note: input.source,
    operation: "append-profile",
  });
}

export async function mirrorListing(listing: ListingRecord, source: string) {
  await appendSheetRowsSafe(
    [
      {
        sheet: "listings",
        values: sheetValues("listings", {
          mirrored_at: new Date().toISOString(),
          listing_id: listing.id,
          owner_user_id: listing.ownerUserId,
          name: listing.name,
          slug: listing.slug,
          category: listing.category,
          category_label: listing.categoryLabel,
          status: listing.status,
          location: listing.location,
          district: listing.district,
          state: listing.state,
          price_per_hour: listing.pricePerHour,
          unit_label: listing.unitLabel,
          operator_included: listing.operatorIncluded,
          rating: listing.rating,
          hp: listing.hp,
          distance_km: listing.distanceKm,
          available_from: listing.availableFrom || "",
          work_types: textList(listing.workTypes),
          tags: textList(listing.tags),
          owner_name: listing.ownerName,
          owner_location: listing.ownerLocation,
          owner_verified: listing.ownerVerified,
          cover_image: listing.coverImage,
          ...listingImageFields(listing),
          gallery_count: listing.galleryImages.length,
          image_path_count: listing.imagePaths.length,
          created_at: listing.createdAt,
          updated_at: listing.updatedAt,
          source,
        }),
      },
    ],
    {
      entityType: "listing",
      entityId: listing.id,
      note: source,
      operation: "append-listing",
    }
  );
}

export async function mirrorBookingAndPayment(booking: BookingRecord, payment?: PaymentRecord) {
  const rows: Array<{ sheet: "bookings" | "payments"; values: unknown[] }> = [
    {
      sheet: "bookings",
      values: sheetValues("bookings", {
        mirrored_at: new Date().toISOString(),
        booking_id: booking.id,
        listing_id: booking.listingId,
        owner_user_id: booking.ownerUserId,
        renter_user_id: booking.renterUserId,
        status: booking.status,
        start_date: booking.startDate,
        end_date: booking.endDate,
        amount: booking.amount,
        created_at: booking.createdAt,
        updated_at: booking.updatedAt,
        source: payment ? "booking+payment" : "booking",
      }),
    },
  ];

  if (payment) {
    rows.push({
      sheet: "payments",
      values: sheetValues("payments", {
        mirrored_at: new Date().toISOString(),
        payment_id: payment.id,
        booking_id: payment.bookingId,
        owner_user_id: payment.ownerUserId,
        renter_user_id: payment.renterUserId,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        created_at: payment.createdAt,
        source: "booking-payment",
      }),
    });
  }

  await appendSheetRowsSafe(rows, {
    entityType: "booking",
    entityId: booking.id,
    note: payment ? "booking+payment" : "booking",
    operation: "append-booking",
  });
}

export async function mirrorSubmission(submission: FormSubmissionRecord): Promise<SheetAppendResult[]> {
  const payload = submission.payload || {};

  if (submission.type === "feedback") {
    return appendSheetRowsSafe(
      [
        {
          sheet: "feedback",
          values: sheetValues("feedback", {
            submitted_at: submission.createdAt,
            submission_id: submission.id,
            user_id: submission.userId || "",
            role: payload.role || "",
            category: payload.category || "",
            subject: payload.subject || "",
            rating: Number(payload.rating || 0),
            contact_me: Boolean(payload.contactMe),
            full_name: payload.fullName || "",
            mobile_number: payload.mobileNumber || payload.phone || "",
            message: payload.message || "",
            payload_json: safeJson(payload),
            ...notificationEmailFields(),
          }),
        },
      ],
      {
        entityType: "submission",
        entityId: submission.id,
        note: submission.type,
        operation: "append-feedback",
      }
    );
  }

  if (submission.type === "booking-request") {
    return appendSheetRowsSafe(
      [
        {
          sheet: "booking_requests",
          values: sheetValues("booking_requests", {
            submitted_at: submission.createdAt,
            submission_id: submission.id,
            user_id: submission.userId || "",
            listing_id: submission.listingId || "",
            equipment_id: payload.equipmentId || "",
            equipment_name: payload.equipmentName || "",
            field_location: payload.fieldLocation || "",
            work_type: payload.workType || "",
            start_date: payload.startDate || "",
            duration: payload.duration || "",
            task: payload.task || "",
            field_size: Number(payload.fieldSize || 0),
            phone: payload.phone || "",
            source_path: payload.sourcePath || "",
            payload_json: safeJson(payload),
            ...notificationEmailFields(),
          }),
        },
      ],
      {
        entityType: "submission",
        entityId: submission.id,
        note: submission.type,
        operation: "append-booking-request",
      }
    );
  }

  if (submission.type === "newsletter-subscription") {
    return appendSheetRowsSafe(
      [
        {
          sheet: "newsletter_subscriptions",
          values: sheetValues("newsletter_subscriptions", {
            submitted_at: submission.createdAt,
            submission_id: submission.id,
            user_id: submission.userId || "",
            email: payload.email || "",
            source_path: payload.sourcePath || "/",
            payload_json: safeJson(payload),
            ...notificationEmailFields(),
          }),
        },
      ],
      {
        entityType: "submission",
        entityId: submission.id,
        note: submission.type,
        operation: "append-newsletter-subscription",
      }
    );
  }

  if (submission.type === "coming-soon-notify") {
    const contact = String(payload.contact || "").trim();
    const phoneDigits = contact.replace(/\D/g, "").slice(-10);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

    return appendSheetRowsSafe(
      [
        {
          sheet: "coming_soon_notifications",
          values: sheetValues("coming_soon_notifications", {
            submitted_at: submission.createdAt,
            submission_id: submission.id,
            user_id: submission.userId || "",
            contact,
            email: isEmail ? contact : "",
            phone: !isEmail && /^\d{10}$/.test(phoneDigits) ? phoneDigits : "",
            source_path: payload.sourcePath || "/coming-soon",
            payload_json: safeJson(payload),
            ...notificationEmailFields(),
          }),
        },
      ],
      {
        entityType: "submission",
        entityId: submission.id,
        note: submission.type,
        operation: "append-coming-soon-notify",
      }
    );
  }

  if (
    submission.type === "support-request" ||
    submission.type === "feature-request" ||
    submission.type === "report" ||
    submission.type === "callback-request" ||
    submission.type === "partner-inquiry" ||
    submission.type === "owner-application"
  ) {
    return appendSheetRowsSafe(
      [
        {
          sheet: "support_requests",
          values: sheetValues("support_requests", {
            submitted_at: submission.createdAt,
            submission_id: submission.id,
            submission_type: submission.type,
            user_id: submission.userId || "",
            category: payload.category || "",
            subject: payload.subject || payload.title || payload.inquiryType || "",
            urgency: payload.urgency || "",
            full_name: payload.fullName || "",
            phone: payload.phone || payload.mobileNumber || "",
            email: payload.email || "",
            source_path: payload.sourcePath || "",
            location: payload.location || payload.village || payload.district || "",
            equipment_needed: payload.equipmentNeeded || "",
            message: payload.message || payload.description || "",
            payload_json: safeJson(payload),
            ...notificationEmailFields(),
          }),
        },
      ],
      {
        entityType: "submission",
        entityId: submission.id,
        note: submission.type,
        operation: "append-support-request",
      }
    );
  }

  return [];
}

export async function mirrorBugReport(report: BugReportRecord) {
  await appendSheetRowsSafe(
    [
      {
        sheet: "bug_reports",
        values: sheetValues("bug_reports", {
          occurred_at: report.occurredAt,
          bug_id: report.id,
          severity: report.severity,
          source: report.source,
          runtime: report.runtime,
          environment: report.environment,
          access_surface: report.accessSurface,
          pathname: report.pathname || "",
          url: report.url || "",
          method: report.method || "",
          status_code: report.statusCode || "",
          user_id: report.userId || "",
          active_workspace: report.activeWorkspace || "",
          request_id: report.requestId || "",
          fingerprint: report.fingerprint || "",
          handled: report.handled,
          browser: report.client?.browser || "",
          os: report.client?.os || "",
          device_type: report.client?.deviceType || "",
          metric_name: report.performance?.metricName || "",
          metric_value: report.performance?.metricValue || "",
          error_name: report.error?.name || "",
          error_message: report.error?.message || "",
          truncated: Boolean(report.truncated),
        }),
      },
    ],
    {
      entityType: "bug_report",
      entityId: report.id,
      note: report.source,
      operation: "append-bug-report",
    }
  );
}
