import { NextRequest, NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/validation/forms";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import {
  createBookingRecord,
  createSubmissionRecord,
  getListingById,
} from "@/lib/server/firebase-data";
import { parseJsonBody } from "@/lib/server/http";
import {
  assertRateLimit,
  buildPublicFormRateLimitRules,
} from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("forms-booking-request", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, bookingRequestSchema);
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Login required.", redirectTo: "/login" },
      { status: 401 }
    );
  }
  await assertRateLimit(request, buildPublicFormRateLimitRules(request, "forms-booking-request", payload, {
    authenticatedUserId: session.user.id,
  }));

  const normalizedWorkType = payload.workType || payload.task || "General equipment work";
  const bookingRequestPayload = {
    ...payload,
    workType: normalizedWorkType,
    task: payload.task || normalizedWorkType,
  };
  const listing = payload.equipmentId ? await getListingById(payload.equipmentId) : null;
  let bookingId: string | undefined;

  if (listing) {
    if (listing.ownerUserId === session.user.id) {
      return NextResponse.json(
        { ok: false, code: "OWN_LISTING", error: "You cannot book your own listings." },
        { status: 409 }
      );
    }

    const approxHours = payload.approxHours || 8;
    const amount = Math.max(1, Number(approxHours)) * listing.pricePerHour;
    const startDate = payload.startDate || new Date().toISOString().slice(0, 10);
    const booking = await createBookingRecord({
      listingId: listing.id,
      renterUserId: session.user.id,
      startDate,
      endDate: startDate,
      amount,
    });
    bookingId = booking.id;
  }

  const submission = await createSubmissionRecord({
    type: "booking-request",
    payload: bookingRequestPayload as Record<string, unknown>,
    userId: session.user.id,
    listingId: listing?.id,
  });

  return NextResponse.json({
    ok: true,
    id: submission.id,
    bookingId,
  });
});
