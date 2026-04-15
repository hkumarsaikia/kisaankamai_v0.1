import "server-only";

import type {
  BookingRecord,
  FormSubmissionRecord,
  ListingRecord,
  LocalSession,
  PaymentRecord,
  ProfileRecord,
} from "@/lib/local-data/types";
import type { BugReportRecord } from "@/lib/bug-reporting/types";
import { appendSheetRowsSafe } from "@/lib/server/google-sheets";

function profileTargetSheet(rolePreference?: string) {
  return rolePreference === "owner" ? "owners" : "renters";
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
        values: [
          new Date().toISOString(),
          input.eventType,
          input.session?.user.id || "",
          input.session?.user.email || input.identifier || "",
          input.session?.user.phone || "",
          input.workspace || input.session?.activeWorkspace || "",
          input.path || "",
          input.outcome,
        ],
      },
    ],
    {
      entityType: "auth_event",
      entityId: input.session?.user.id || input.identifier || input.eventType,
      note: input.eventType,
    }
  );
}

export async function mirrorProfile(input: {
  userId: string;
  profile: ProfileRecord;
  source: string;
}) {
  await appendSheetRowsSafe(
    [
      {
        sheet: profileTargetSheet(input.profile.rolePreference),
        values: [
          new Date().toISOString(),
          input.userId,
          input.profile.fullName,
          input.profile.email || "",
          input.profile.phone || "",
          input.profile.village,
          input.profile.pincode,
          input.profile.rolePreference,
          input.source,
        ],
      },
    ],
    {
      entityType: "profile",
      entityId: input.userId,
      note: input.source,
    }
  );
}

export async function mirrorListing(listing: ListingRecord, source: string) {
  await appendSheetRowsSafe(
    [
      {
        sheet: "listings",
        values: [
          new Date().toISOString(),
          listing.id,
          listing.ownerUserId,
          listing.name,
          listing.category,
          listing.location,
          listing.district,
          listing.pricePerHour,
          listing.status,
          listing.coverImage,
        ],
      },
    ],
    {
      entityType: "listing",
      entityId: listing.id,
      note: source,
    }
  );
}

export async function mirrorBookingAndPayment(booking: BookingRecord, payment?: PaymentRecord) {
  const rows: Array<{ sheet: "bookings" | "payments"; values: unknown[] }> = [
    {
      sheet: "bookings",
      values: [
        new Date().toISOString(),
        booking.id,
        booking.listingId,
        booking.ownerUserId,
        booking.renterUserId,
        booking.status,
        booking.startDate,
        booking.endDate,
        booking.amount,
      ],
    },
  ];

  if (payment) {
    rows.push({
      sheet: "payments",
      values: [
        new Date().toISOString(),
        payment.id,
        payment.bookingId,
        payment.ownerUserId,
        payment.renterUserId,
        payment.amount,
        payment.status,
        payment.method,
      ],
    });
  }

  await appendSheetRowsSafe(rows, {
    entityType: "booking",
    entityId: booking.id,
    note: payment ? "booking+payment" : "booking",
  });
}

export async function mirrorSubmission(submission: FormSubmissionRecord) {
  const payload = submission.payload || {};
  const supportCategory = typeof payload.category === "string" ? payload.category : "";

  if (submission.type === "feedback") {
    await appendSheetRowsSafe(
      [
        {
          sheet: "feedback",
          values: [
            submission.createdAt,
            submission.id,
            submission.userId || "",
            payload.role || "",
            payload.category || "",
            payload.subject || "",
            payload.rating || "",
            payload.contactMe || false,
          ],
        },
      ],
      {
        entityType: "submission",
        entityId: submission.id,
        note: submission.type,
      }
    );
    return;
  }

  if (submission.type === "support-request" || submission.type === "callback-request" || submission.type === "partner-inquiry") {
    await appendSheetRowsSafe(
      [
        {
          sheet: "support_requests",
          values: [
            submission.createdAt,
            submission.id,
            submission.userId || "",
            supportCategory || submission.type,
            payload.fullName || "",
            payload.phone || payload.mobileNumber || "",
            payload.email || "",
            payload.sourcePath || "",
          ],
        },
      ],
      {
        entityType: "submission",
        entityId: submission.id,
        note: submission.type,
      }
    );
  }
}

export async function mirrorBugReport(report: BugReportRecord) {
  await appendSheetRowsSafe(
    [
      {
        sheet: "bug_reports",
        values: [
          report.occurredAt,
          report.id,
          report.severity,
          report.source,
          report.runtime,
          report.pathname || "",
          report.statusCode || "",
          report.userId || "",
          report.fingerprint || "",
        ],
      },
    ],
    {
      entityType: "bug_report",
      entityId: report.id,
      note: report.source,
    }
  );
}

