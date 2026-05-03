"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
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

const FILTER_LABELS_MR: Record<string, string> = {
  "All Bookings": "सर्व बुकिंग",
  Pending: "प्रलंबित",
  Confirmed: "पुष्टी",
  Active: "सक्रिय",
  Completed: "पूर्ण",
  Cancelled: "रद्द",
};

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
  const { langText } = useLanguage();
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

  const handleCancel = (bookingId: string) => {
    setErrorState((current) => ({ ...current, [bookingId]: "" }));
    setButtonState((current) => ({ ...current, [bookingId]: "pending" }));

    startTransition(async () => {
      const result = await updateBookingStatusAction(bookingId, "cancelled");
      if (!result.ok) {
        setButtonState((current) => ({ ...current, [bookingId]: "error" }));
        setErrorState((current) => ({
          ...current,
          [bookingId]: result.error || langText("Could not cancel this booking.", "हे बुकिंग रद्द करता आले नाही."),
        }));
        return;
      }

      setButtonState((current) => ({ ...current, [bookingId]: "success" }));
      window.setTimeout(() => router.refresh(), 700);
    });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-3xl font-extrabold text-primary">
              {variant === "dashboard"
                ? langText("Booking Overview", "बुकिंग आढावा")
                : langText("My Bookings", "माझी बुकिंग")}
            </h2>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              {variant === "dashboard"
                ? langText("Manage your current equipment bookings.", "तुमची सध्याची उपकरण बुकिंग व्यवस्थापित करा.")
                : langText(
                    "Manage your equipment rentals, schedules, and delivery tracking.",
                    "उपकरण भाडे, वेळापत्रक आणि डिलिव्हरी ट्रॅकिंग व्यवस्थापित करा."
                  )}
            </p>
          </div>
          <Link
            href="/renter-profile/browse"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-5 py-3 text-sm font-bold text-white"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            {langText("Browse Equipment", "उपकरणे शोधा")}
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
                {langText(filter.label, FILTER_LABELS_MR[filter.label] || filter.label)}
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
              const ownerName = ownerProfile?.fullName || listing?.ownerName || langText("Owner", "मालक");
              const canCancel = booking.status !== "cancelled" && booking.status !== "completed";

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm"
                >
                  <img
                    src={listing?.coverImage || listing?.galleryImages?.[0] || "https://placehold.co/640x640?text=Equipment"}
                    alt={listing?.name || langText("Equipment booking", "उपकरण बुकिंग")}
                    className="aspect-square w-full object-cover"
                  />

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-headline text-lg font-bold text-on-background">
                          {listing?.name || langText("Equipment Booking", "उपकरण बुकिंग")}
                        </h3>
                        <p className="mt-1 text-sm text-on-surface-variant">
                          {ownerName}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${status.tone}`}>
                        {langText(status.badge, FILTER_LABELS_MR[status.badge] || status.badge)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-4">
                      <div>
                        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                          {langText("Dates", "तारखा")}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-on-background">
                          {formatDateRange(booking.startDate, booking.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                          {langText("Total", "एकूण")}
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
                        {langText("Track Order", "ऑर्डर ट्रॅक करा")}
                      </button>
                      <Link
                        href={detailsHref}
                        className="rounded-xl border border-outline-variant px-3 py-2.5 text-center text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
                      >
                        {langText("Details", "तपशील")}
                      </Link>
                      <a
                        href={`tel:${ownerPhone}`}
                        className="flex items-center justify-center gap-1 rounded-xl border border-outline-variant px-3 py-2.5 text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-sm">call</span>
                        {langText("Call Owner", "मालकाला कॉल करा")}
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
                          ? langText("Cancelled", "रद्द")
                          : actionState === "pending"
                            ? langText("Cancelling...", "रद्द करत आहे...")
                            : actionState === "success"
                              ? langText("Cancelled", "रद्द")
                              : langText("Cancel", "रद्द करा")}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
            <h3 className="font-headline text-2xl font-bold text-primary">
              {langText("No bookings in this section", "या विभागात बुकिंग नाहीत")}
            </h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              {langText(
                "Change the filter or browse equipment to place a new booking.",
                "फिल्टर बदला किंवा नवीन बुकिंगसाठी उपकरणे शोधा."
              )}
            </p>
          </div>
        )}
      </section>

      <TrackingOrderModal
        open={Boolean(selectedBooking)}
        equipmentName={selectedBooking?.listing?.name || langText("Equipment Booking", "उपकरण बुकिंग")}
        bookingLabel={selectedBooking ? `${langText("Booking", "बुकिंग")} ${selectedBooking.id}` : ""}
        statusLabel={selectedBooking ? langText(mapBookingStatus(selectedBooking.status).badge, FILTER_LABELS_MR[mapBookingStatus(selectedBooking.status).badge] || mapBookingStatus(selectedBooking.status).badge) : ""}
        scheduledLabel={
          selectedBooking
            ? `${langText("Scheduled for", "नियोजित")} ${formatDateRange(selectedBooking.startDate, selectedBooking.endDate)}`
            : ""
        }
        operatorIncluded={selectedBooking?.listing?.operatorIncluded}
        contactPhone={selectedBooking?.ownerProfile?.phone || null}
        contactLabel={langText("Call Owner", "मालकाला कॉल करा")}
        onClose={() => setSelectedBookingId(null)}
      />
    </div>
  );
}
