"use client";

import { AppLink as Link } from "@/components/AppLink";
import { TrackingOrderModal } from "@/components/workspace/TrackingOrderModal";
import { updateBookingStatusAction } from "@/lib/actions/local-data";
import type { BookingRecord, ListingRecord, ProfileRecord } from "@/lib/local-data/types";
import { supportContact } from "@/lib/support-contact";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type FilterKey = "all" | "pending" | "confirmed" | "active" | "completed" | "cancelled";

type BookingWithDetails = BookingRecord & {
  listing: ListingRecord | null;
  ownerProfile: ProfileRecord | null;
};

type RenterBookingsBoardProps = {
  bookings: BookingWithDetails[];
  variant?: "dashboard" | "page";
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

export function RenterBookingsBoard({
  bookings,
  variant = "page",
}: RenterBookingsBoardProps) {
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

  const activeBookings = bookings.filter((booking) => mapBookingStatus(booking.status).filter === "active").length;
  const pendingBookings = bookings.filter((booking) => mapBookingStatus(booking.status).filter === "pending").length;
  const totalSpend = bookings.reduce((sum, booking) => sum + booking.amount, 0);

  const handleCancel = (bookingId: string) => {
    setErrorState((current) => ({ ...current, [bookingId]: "" }));
    setButtonState((current) => ({ ...current, [bookingId]: "pending" }));

    startTransition(async () => {
      const result = await updateBookingStatusAction(bookingId, "cancelled");
      if (!result.ok) {
        setButtonState((current) => ({ ...current, [bookingId]: "error" }));
        setErrorState((current) => ({
          ...current,
          [bookingId]: result.error || "Could not cancel this booking.",
        }));
        return;
      }

      setButtonState((current) => ({ ...current, [bookingId]: "success" }));
      window.setTimeout(() => router.refresh(), 700);
    });
  };

  return (
    <div className="space-y-8">
      {variant === "dashboard" ? (
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-5 shadow-sm">
            <p className="font-label text-sm font-medium text-on-surface-variant">Active Bookings</p>
            <p className="mt-2 font-headline text-3xl font-bold text-on-background">{activeBookings}</p>
          </div>
          <div className="rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-5 shadow-sm">
            <p className="font-label text-sm font-medium text-on-surface-variant">Pending</p>
            <p className="mt-2 font-headline text-3xl font-bold text-on-background">{pendingBookings}</p>
          </div>
          <div className="rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-5 shadow-sm">
            <p className="font-label text-sm font-medium text-on-surface-variant">Total Booking Value</p>
            <p className="mt-2 font-headline text-3xl font-bold text-on-background">₹{totalSpend.toLocaleString("en-IN")}</p>
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-3xl font-extrabold text-primary">
              {variant === "dashboard" ? "Booking Overview" : "My Bookings"}
            </h2>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              {variant === "dashboard"
                ? "Track, cancel, call, and inspect your renter bookings from one place."
                : "Manage your equipment rentals, schedules, and delivery tracking."}
            </p>
          </div>
          <Link
            href="/renter-profile/browse"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-5 py-3 text-sm font-bold text-white"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Browse Equipment
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
              const ownerProfile = booking.ownerProfile;
              const status = mapBookingStatus(booking.status);
              const actionState = buttonState[booking.id] || "idle";
              const isCancelling = actionState === "pending" || isPending;
              const detailsHref = `/renter-profile/equipment/${listing?.id || booking.listingId}`;
              const ownerPhone = ownerProfile?.phone || supportContact.phoneE164;
              const ownerName = ownerProfile?.fullName || listing?.ownerName || "Verified Owner";
              const canCancel = booking.status !== "cancelled" && booking.status !== "completed";

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm"
                >
                  <img
                    src={listing?.coverImage || listing?.galleryImages?.[0] || "https://placehold.co/640x640?text=Equipment"}
                    alt={listing?.name || "Equipment booking"}
                    className="aspect-square w-full object-cover"
                  />

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-headline text-lg font-bold text-on-background">
                          {listing?.name || "Equipment Booking"}
                        </h3>
                        <p className="mt-1 text-sm text-on-surface-variant">
                          {ownerName}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${status.tone}`}>
                        {status.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-4">
                      <div>
                        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                          Dates
                        </p>
                        <p className="mt-1 text-sm font-semibold text-on-background">
                          {formatDateRange(booking.startDate, booking.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                          Total
                        </p>
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
                        Track Order
                      </button>
                      <Link
                        href={detailsHref}
                        className="rounded-xl border border-outline-variant px-3 py-2.5 text-center text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
                      >
                        Details
                      </Link>
                      <a
                        href={`tel:${ownerPhone}`}
                        className="flex items-center justify-center gap-1 rounded-xl border border-outline-variant px-3 py-2.5 text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-sm">call</span>
                        Call Owner
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCancel(booking.id)}
                        disabled={!canCancel || isCancelling}
                        className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                          !canCancel
                            ? "cursor-not-allowed border border-outline-variant bg-surface-container text-on-surface-variant"
                            : actionState === "success"
                              ? "bg-emerald-600 text-white"
                              : "border border-error text-error hover:bg-error-container"
                        }`}
                      >
                        {!canCancel
                          ? "Cancelled"
                          : actionState === "pending"
                            ? "Cancelling..."
                            : actionState === "success"
                              ? "Cancelled"
                              : "Cancel"}
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
              Change the filter or browse equipment to place a new booking.
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
        contactPhone={selectedBooking?.ownerProfile?.phone || null}
        contactLabel="Call Owner"
        onClose={() => setSelectedBookingId(null)}
      />
    </div>
  );
}
