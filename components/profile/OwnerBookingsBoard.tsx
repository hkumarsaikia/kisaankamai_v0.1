"use client";

import { AppLink as Link } from "@/components/AppLink";
import { TrackingOrderModal } from "@/components/workspace/TrackingOrderModal";
import { updateBookingStatusAction } from "@/lib/actions/local-data";
import type { BookingRecord, ListingRecord, ProfileRecord } from "@/lib/local-data/types";
import { supportContact } from "@/lib/support-contact";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

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
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<Record<string, "idle" | "pending" | "success" | "error">>({});
  const [errorState, setErrorState] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const visibleBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => mapBookingStatus(booking.status).filter === activeFilter);

  const selectedBooking =
    bookings.find((booking) => booking.id === selectedBookingId) || null;

  const summary = useMemo(
    () => ({
      pending: bookings.filter((booking) => mapBookingStatus(booking.status).filter === "pending").length,
      active: bookings.filter((booking) => mapBookingStatus(booking.status).filter === "active").length,
      earnings: bookings.reduce((sum, booking) => sum + booking.amount, 0),
    }),
    [bookings]
  );

  const runStatusUpdate = (bookingId: string, nextStatus: "confirmed" | "cancelled") => {
    setErrorState((current) => ({ ...current, [bookingId]: "" }));
    setButtonState((current) => ({ ...current, [bookingId]: "pending" }));

    startTransition(async () => {
      const result = await updateBookingStatusAction(bookingId, nextStatus);
      if (!result.ok) {
        setButtonState((current) => ({ ...current, [bookingId]: "error" }));
        setErrorState((current) => ({
          ...current,
          [bookingId]: result.error || "Could not update this booking.",
        }));
        return;
      }

      setButtonState((current) => ({ ...current, [bookingId]: "success" }));
      window.setTimeout(() => router.refresh(), 650);
    });
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-5 shadow-sm">
          <p className="font-label text-sm font-medium text-on-surface-variant">Pending Requests</p>
          <p className="mt-2 font-headline text-3xl font-bold text-on-background">{summary.pending}</p>
        </div>
        <div className="rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-5 shadow-sm">
          <p className="font-label text-sm font-medium text-on-surface-variant">Active Jobs</p>
          <p className="mt-2 font-headline text-3xl font-bold text-on-background">{summary.active}</p>
        </div>
        <div className="rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-5 shadow-sm">
          <p className="font-label text-sm font-medium text-on-surface-variant">Booking Value</p>
          <p className="mt-2 font-headline text-3xl font-bold text-on-background">₹{summary.earnings.toLocaleString("en-IN")}</p>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-3xl font-extrabold text-primary">Booking Requests</h2>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              Review incoming bookings, approve or decline them, and keep call and tracking actions on the same page.
            </p>
          </div>
          <Link
            href="/owner-profile/browse"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-5 py-3 text-sm font-bold text-white"
          >
            <span className="material-symbols-outlined text-[18px]">agriculture</span>
            Manage Equipment
          </Link>
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
                {filter.label}
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
              const detailsHref = `/equipment/${listing?.id || booking.listingId}`;
              const renterPhone = renter?.phone || supportContact.phoneE164;
              const renterName = renter?.fullName || "Verified Renter";
              const canApprove = booking.status === "pending";
              const canDecline = booking.status === "pending" || booking.status === "confirmed";

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm"
                >
                  <img
                    src={listing?.coverImage || listing?.galleryImages?.[0] || "https://placehold.co/640x640?text=Booking"}
                    alt={listing?.name || "Booking request"}
                    className="aspect-square w-full object-cover"
                  />

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-headline text-lg font-bold text-on-background">
                          {listing?.name || "Equipment Booking"}
                        </h3>
                        <p className="mt-1 text-sm text-on-surface-variant">{renterName}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${status.tone}`}>
                        {status.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-4">
                      <div>
                        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Dates</p>
                        <p className="mt-1 text-sm font-semibold text-on-background">
                          {formatDateRange(booking.startDate, booking.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Total</p>
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

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBookingId(booking.id)}
                        className="rounded-xl bg-primary-container px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary"
                      >
                        Track
                      </button>
                      <Link
                        href={detailsHref}
                        className="rounded-xl border border-outline-variant px-3 py-2.5 text-center text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
                      >
                        Details
                      </Link>
                      <a
                        href={`tel:${renterPhone}`}
                        className="flex items-center justify-center gap-1 rounded-xl border border-outline-variant px-3 py-2.5 text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-sm">call</span>
                        Call
                      </a>
                      <button
                        type="button"
                        onClick={() => runStatusUpdate(booking.id, canApprove ? "confirmed" : "cancelled")}
                        disabled={isPending || (!canApprove && !canDecline)}
                        className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
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
                          ? "Updating..."
                          : actionState === "success"
                            ? canApprove
                              ? "Approved"
                              : "Declined"
                            : canApprove
                              ? "Approve"
                              : canDecline
                                ? "Decline"
                                : "Closed"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
            <h3 className="font-headline text-2xl font-bold text-primary">No bookings in this section</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              Change the filter or keep your listings active to receive new requests.
            </p>
          </div>
        )}
      </section>

      <TrackingOrderModal
        open={Boolean(selectedBooking)}
        equipmentName={selectedBooking?.listing?.name || "Equipment Booking"}
        bookingLabel={selectedBooking ? `Booking ${selectedBooking.id}` : ""}
        statusLabel={selectedBooking ? mapBookingStatus(selectedBooking.status).badge : ""}
        scheduledLabel={
          selectedBooking
            ? `Scheduled for ${formatDateRange(selectedBooking.startDate, selectedBooking.endDate)}`
            : ""
        }
        operatorIncluded={selectedBooking?.listing?.operatorIncluded}
        contactPhone={selectedBooking?.renterProfile?.phone || null}
        contactLabel="Call Renter"
        onClose={() => setSelectedBookingId(null)}
      />
    </div>
  );
}
