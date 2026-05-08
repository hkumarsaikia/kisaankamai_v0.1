"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { updateBookingStatusAction } from "@/lib/actions/local-data";
import type { BookingRecord, ListingRecord, ProfileRecord } from "@/lib/local-data/types";
import { supportContact } from "@/lib/support-contact";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type BookingWithDetails = BookingRecord & {
  listing: ListingRecord | null;
  renterProfile: ProfileRecord | null;
};

type FilterKey = "all" | "pending" | "confirmed" | "active" | "completed" | "cancelled";

type OwnerBookingsBoardProps = {
  bookings: BookingWithDetails[];
};

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All Bookings" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function mapBookingStatus(status: BookingRecord["status"]) {
  switch (status) {
    case "upcoming":
    case "confirmed":
      return { badge: "Confirmed", filter: "confirmed" as const, tone: "bg-secondary-fixed text-on-secondary-fixed" };
    case "active":
      return { badge: "Active", filter: "active" as const, tone: "bg-primary-fixed text-on-primary-fixed" };
    case "completed":
      return { badge: "Completed", filter: "completed" as const, tone: "bg-emerald-100 text-emerald-800" };
    case "cancelled":
      return { badge: "Cancelled", filter: "cancelled" as const, tone: "bg-error-container text-error" };
    default:
      return { badge: "Pending", filter: "pending" as const, tone: "bg-surface-container text-on-surface" };
  }
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  });

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startDate} - ${endDate}`;
  }

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function countFilter(bookings: BookingWithDetails[], filter: FilterKey) {
  if (filter === "all") {
    return bookings.length;
  }

  return bookings.filter((booking) => mapBookingStatus(booking.status).filter === filter).length;
}

export function OwnerBookingsBoard({ bookings }: OwnerBookingsBoardProps) {
  const { langText } = useLanguage();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [buttonState, setButtonState] = useState<Record<string, "idle" | "pending" | "success" | "error">>({});
  const [errorState, setErrorState] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const visibleBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => mapBookingStatus(booking.status).filter === activeFilter);

  const runStatusUpdate = (bookingId: string, nextStatus: "confirmed" | "cancelled") => {
    setErrorState((current) => ({ ...current, [bookingId]: "" }));
    setButtonState((current) => ({ ...current, [bookingId]: "pending" }));

    startTransition(async () => {
      const result = await updateBookingStatusAction(bookingId, nextStatus);
      if (!result.ok) {
        setButtonState((current) => ({ ...current, [bookingId]: "error" }));
        setErrorState((current) => ({
          ...current,
          [bookingId]: result.error || langText("Could not update this booking.", "हे बुकिंग अपडेट करता आले नाही."),
        }));
        return;
      }

      setButtonState((current) => ({ ...current, [bookingId]: "success" }));
      window.setTimeout(() => router.refresh(), 650);
    });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-3xl font-extrabold text-primary">{langText("Booking Requests", "बुकिंग विनंत्या")}</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-outline-variant/50 pb-2">
          {FILTERS.map((filter) => {
            const active = filter.key === activeFilter;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active
                    ? "bg-primary-container text-on-primary"
                    : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container"
                }`}
              >
                {langText(
                  filter.label,
                  {
                    "All Bookings": "सर्व बुकिंग",
                    Pending: "प्रलंबित",
                    Confirmed: "पुष्टी",
                    Active: "सक्रिय",
                    Completed: "पूर्ण",
                    Cancelled: "रद्द",
                  }[filter.label] || filter.label
                )}
                <span className="ml-2 text-xs opacity-80">({countFilter(bookings, filter.key)})</span>
              </button>
            );
          })}
        </div>

        {visibleBookings.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleBookings.map((booking) => {
              const listing = booking.listing;
              const renter = booking.renterProfile;
              const status = mapBookingStatus(booking.status);
              const actionState = buttonState[booking.id] || "idle";
              const detailsHref = `/owner-profile/equipment/${listing?.id || booking.listingId}`;
              const renterPhone = renter?.phone || supportContact.phoneE164;
              const renterName = renter?.fullName || langText("Renter", "भाडेकरू");
              const canApprove = booking.status === "pending";
              const canDecline = booking.status === "pending" || booking.status === "confirmed";

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm"
                >
                  <img
                    src={listing?.coverImage || listing?.galleryImages?.[0] || "https://placehold.co/640x640?text=Booking"}
                    alt={listing?.name || langText("Booking request", "बुकिंग विनंती")}
                    className="aspect-square w-full object-cover"
                  />

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-headline text-lg font-bold text-on-background">
                          {listing?.name || langText("Equipment Booking", "उपकरण बुकिंग")}
                        </h3>
                        <p className="mt-1 text-sm text-on-surface-variant">{renterName}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${status.tone}`}>
                        {langText(
                          status.badge,
                          {
                            Pending: "प्रलंबित",
                            Confirmed: "पुष्टी",
                            Active: "सक्रिय",
                            Completed: "पूर्ण",
                            Cancelled: "रद्द",
                          }[status.badge] || status.badge
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-4">
                      <div>
                        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">{langText("Dates", "तारखा")}</p>
                        <p className="mt-1 text-sm font-semibold text-on-background">
                          {formatDateRange(booking.startDate, booking.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">{langText("Total", "एकूण")}</p>
                        <p className="mt-1 text-sm font-semibold text-on-background">
                          ₹{booking.amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {errorState[booking.id] ? (
                      <div className="rounded-xl border border-error/20 bg-error-container px-3 py-2 text-sm font-medium text-error">
                        {errorState[booking.id]}
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-3">
                      <Link
                        href={detailsHref}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary-container px-3 py-2.5 text-center text-xs font-bold text-white transition-colors hover:bg-primary"
                      >
                        {langText("Details", "तपशील")}
                      </Link>
                      <a
                        href={`tel:${renterPhone}`}
                        className="flex min-h-11 items-center justify-center gap-1 rounded-xl border border-outline-variant px-3 py-2.5 text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-sm">call</span>
                        {langText("Call", "कॉल")}
                      </a>
                      <button
                        type="button"
                        onClick={() => runStatusUpdate(booking.id, canApprove ? "confirmed" : "cancelled")}
                        disabled={isPending || (!canApprove && !canDecline)}
                        className={`min-h-11 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                          actionState === "success"
                            ? "bg-emerald-600 text-white"
                            : canApprove
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : canDecline
                                ? "border border-error text-error hover:bg-error-container"
                                : "cursor-not-allowed border border-outline-variant bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {actionState === "pending"
                          ? langText("Updating...", "अपडेट करत आहे...")
                          : actionState === "success"
                            ? canApprove
                              ? langText("Approved", "मंजूर")
                              : langText("Declined", "नाकारले")
                            : canApprove
                              ? langText("Approve", "मंजूर करा")
                              : canDecline
                                ? langText("Decline", "नकार द्या")
                                : langText("Closed", "बंद")}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
            <h3 className="font-headline text-2xl font-bold text-primary">{langText("No bookings in this section", "या विभागात बुकिंग नाहीत")}</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              {langText(
                "Change the filter or keep your listings active to receive new requests.",
                "फिल्टर बदला किंवा नवीन विनंत्यांसाठी तुमच्या लिस्टिंग सक्रिय ठेवा."
              )}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
