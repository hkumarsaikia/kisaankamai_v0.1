import "server-only";

import type {
  BookingRecord,
  ListingRecord,
  PaymentRecord,
  SavedItemRecord,
  SessionRecord,
  SubmissionRecord,
  UserProfile,
} from "@/lib/types";
import { appendSheetRowsSafe } from "@/lib/server/google-sheets";

function profileSheet(profile: UserProfile) {
  return profile.workspacePreference === "owner" ? "owners" : "renters";
}

export async function mirrorAuthEvent(input: {
  eventType: string;
  session?: SessionRecord | null;
  identifier?: string;
  outcome: string;
}) {
  await appendSheetRowsSafe(
    [
      {
        sheet: "auth_events",
        values: [
          new Date().toISOString(),
          input.eventType,
          input.session?.user.uid || "",
          input.session?.user.email || input.identifier || "",
          input.session?.user.phone || "",
          input.session?.user.workspacePreference || "",
          "",
          input.outcome,
        ],
      },
    ],
    {
      entityType: "auth_event",
      entityId: input.session?.user.uid || input.identifier || input.eventType,
      note: input.eventType,
    }
  );
}

export async function mirrorProfile(profile: UserProfile, source: string) {
  await appendSheetRowsSafe(
    [
      {
        sheet: profileSheet(profile),
        values: [
          new Date().toISOString(),
          profile.uid,
          profile.fullName,
          profile.email || "",
          profile.phone,
          profile.village,
          profile.pincode,
          profile.workspacePreference,
          source,
        ],
      },
    ],
    {
      entityType: "profile",
      entityId: profile.uid,
      note: source,
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
          listing.ownerUid,
          listing.name,
          listing.category,
          listing.location,
          listing.district,
          listing.pricePerHour,
          listing.status,
          listing.coverImage || "",
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
  const rows: Array<
    | {
        sheet: "bookings";
        values: unknown[];
      }
    | {
        sheet: "payments";
        values: unknown[];
      }
  > = [
    {
      sheet: "bookings",
      values: [
        new Date().toISOString(),
        booking.id,
        booking.listingId,
        booking.ownerUid,
        booking.renterUid,
        booking.status,
        booking.startDate || "",
        "",
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
        payment.ownerUid,
        payment.renterUid,
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

export async function mirrorSubmission(submission: SubmissionRecord) {
  const payload = submission.payload || {};

  if (submission.type === "support") {
    await appendSheetRowsSafe(
      [
        {
          sheet: "support_requests",
          values: [
            submission.createdAt,
            submission.id,
            submission.userUid || "",
            typeof payload.category === "string" ? payload.category : "",
            typeof payload.fullName === "string" ? payload.fullName : "",
            typeof payload.phone === "string" ? payload.phone : "",
            "",
            "",
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

  await appendSheetRowsSafe(
    [
      {
        sheet: "feedback",
        values: [
          submission.createdAt,
          submission.id,
          submission.userUid || "",
          "",
          typeof payload.topic === "string" ? payload.topic : "",
          typeof payload.subject === "string" ? payload.subject : "",
          typeof payload.rating === "number" ? payload.rating : "",
          typeof payload.followUp === "boolean" ? payload.followUp : "",
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

export async function mirrorSavedItem(savedItem: SavedItemRecord, action: "saved" | "unsaved") {
  await appendSheetRowsSafe(
    [
      {
        sheet: "saved_items",
        values: [
          new Date().toISOString(),
          savedItem.id,
          savedItem.userUid,
          savedItem.listingId,
          action,
        ],
      },
    ],
    {
      entityType: "saved_item",
      entityId: savedItem.id,
      note: action,
    }
  );
}
