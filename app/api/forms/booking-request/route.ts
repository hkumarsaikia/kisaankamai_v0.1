import { NextRequest, NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/validation/forms";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import {
  createBookingRecord,
  createSubmissionRecord,
  getListingById,
} from "@/lib/server/local-data";
import { parseJsonBody } from "@/lib/server/http";

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

  const listing = payload.equipmentId ? await getListingById(payload.equipmentId) : null;
  let bookingId: string | undefined;

  if (listing) {
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
    payload: payload as Record<string, unknown>,
    userId: session.user.id,
    listingId: listing?.id,
  });

  return NextResponse.json({
    ok: true,
    id: submission.id,
    bookingId,
  });
});
