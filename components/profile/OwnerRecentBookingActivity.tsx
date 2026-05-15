"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppLink as Link } from "@/components/AppLink";
import { LocalizedText } from "@/components/LocalizedText";
import { useLanguage } from "@/components/LanguageContext";
import { updateBookingStatusAction } from "@/lib/actions/local-data";
import type { BookingRecord, ListingRecord, ProfileRecord } from "@/lib/local-data/types";
import { supportContact } from "@/lib/support-contact";

type BookingWithDetails = BookingRecord & {
  listing?: ListingRecord | null;
  renterProfile?: ProfileRecord | null;
};

type ActionKey = "approve" | "decline";
type ActionState = "idle" | "pending" | "success" | "error";

type OwnerRecentBookingActivityProps = {
  bookings: BookingWithDetails[];
};

function formatDashboardDateRange(startDate: string, endDate: string, locale: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  });

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startDate} - ${endDate}`;
  }

  const formattedStart = formatter.format(start);
  const formattedEnd = formatter.format(end);
  return formattedStart === formattedEnd ? formattedStart : `${formattedStart} - ${formattedEnd}`;
}

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusText(status: BookingRecord["status"], langText: (en: string, mr: string) => string) {
  switch (status) {
    case "confirmed":
    case "upcoming":
      return langText("Confirmed", "पुष्टी");
    case "active":
      return langText("Active", "सक्रिय");
    case "completed":
      return langText("Completed", "पूर्ण");
    case "cancelled":
      return langText("Cancelled", "रद्द");
    default:
      return langText("Pending", "प्रलंबित");
  }
}

function statusTone(status: BookingRecord["status"]) {
  switch (status) {
    case "confirmed":
    case "upcoming":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200";
    case "active":
      return "bg-primary-fixed text-on-primary-fixed dark:bg-emerald-500/20 dark:text-emerald-100";
    case "completed":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200";
    default:
      return "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-100";
  }
}

function actionStateKey(bookingId: string, action: ActionKey) {
  return `${bookingId}:${action}`;
}

export function OwnerRecentBookingActivity({ bookings }: OwnerRecentBookingActivityProps) {
  const { language, langText } = useLanguage();
  const locale = language === "mr" ? "mr-IN" : "en-IN";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localBookings, setLocalBookings] = useState(bookings);
  const [buttonState, setButtonState] = useState<Record<string, ActionState>>({});
  const [errorState, setErrorState] = useState<Record<string, string>>({});

  const visibleBookings = useMemo(() => localBookings.slice(0, 4), [localBookings]);

  const runStatusUpdate = (bookingId: string, nextStatus: "confirmed" | "cancelled") => {
    const action: ActionKey = nextStatus === "confirmed" ? "approve" : "decline";
    const key = actionStateKey(bookingId, action);
    setErrorState((current) => ({ ...current, [bookingId]: "" }));
    setButtonState((current) => ({ ...current, [key]: "pending" }));

    startTransition(async () => {
      const result = await updateBookingStatusAction(bookingId, nextStatus);
      if (!result.ok) {
        setButtonState((current) => ({ ...current, [key]: "error" }));
        setErrorState((current) => ({
          ...current,
          [bookingId]: result.error || langText("Could not update this booking.", "हे बुकिंग अपडेट करता आले नाही."),
        }));
        return;
      }

      setLocalBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: nextStatus,
                updatedAt: new Date().toISOString(),
              }
            : booking
        )
      );
      setButtonState((current) => ({ ...current, [key]: "success" }));
      window.setTimeout(() => router.refresh(), 650);
    });
  };

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-black text-primary sm:text-2xl">
          <LocalizedText en="Recent Booking Activity" mr="अलीकडील बुकिंग हालचाल" />
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/owner-profile/browse"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-on-surface transition-colors hover:bg-surface-container dark:border-slate-700 dark:text-slate-100 sm:text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">agriculture</span>
            <LocalizedText en="My Equipment" mr="माझी उपकरणे" />
          </Link>
          <Link
            href="/owner-profile/list-equipment"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary-container px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <LocalizedText en="Add Listing" mr="लिस्टिंग जोडा" />
          </Link>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleBookings.length ? (
          visibleBookings.map((booking) => {
            const canActOnPending = booking.status === "pending";
            const approveState = buttonState[actionStateKey(booking.id, "approve")] || "idle";
            const declineState = buttonState[actionStateKey(booking.id, "decline")] || "idle";
            const renterPhone = booking.renterProfile?.phone || supportContact.phoneE164;

            return (
              <div
                key={booking.id}
                className="owner-dashboard-booking-card flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-surface-container-lowest shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="relative h-36 shrink-0 overflow-hidden bg-surface-container sm:h-40">
                  <img
                    src={booking.listing?.coverImage || "https://placehold.co/320x240?text=Equipment"}
                    alt={booking.listing?.name || "Equipment"}
                    className="owner-dashboard-booking-image h-full w-full object-cover"
                  />
                  <span className={`absolute right-3 top-3 inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-sm ${statusTone(booking.status)}`}>
                    {statusText(booking.status, langText)}
                  </span>
                </div>

                <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-on-surface dark:text-slate-100">
                      {booking.listing?.name || "Equipment Booking"}
                    </h3>
                    <p className="mt-1 truncate text-sm text-on-surface-variant dark:text-slate-400">
                      {booking.renterProfile?.fullName || <LocalizedText en="Verified renter" mr="पडताळलेला भाडेकरू" />}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-3">
                    <div>
                      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                        <LocalizedText en="Dates" mr="तारखा" />
                      </p>
                      <p className="mt-1 whitespace-nowrap text-sm font-semibold text-on-background">
                        {formatDashboardDateRange(booking.startDate, booking.endDate, locale)}
                      </p>
                    </div>
                    <div>
                      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                        <LocalizedText en="Total" mr="एकूण" />
                      </p>
                      <p className="mt-1 text-sm font-semibold text-on-background">
                        {formatCurrency(booking.amount, locale)}
                      </p>
                    </div>
                  </div>

                  {errorState[booking.id] ? (
                    <div className="rounded-xl border border-error/20 bg-error-container px-3 py-2 text-xs font-semibold text-error" role="alert">
                      {errorState[booking.id]}
                    </div>
                  ) : null}

                  <div className="owner-dashboard-booking-actions grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${renterPhone}`}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-on-surface transition-colors hover:bg-white/70 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      <LocalizedText en="Call" mr="कॉल" />
                    </a>
                    <Link
                      href={`/owner-profile/equipment/${booking.listing?.id || booking.listingId}`}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary-container px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <LocalizedText en="View" mr="पहा" />
                    </Link>
                    {canActOnPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => runStatusUpdate(booking.id, "confirmed")}
                          disabled={isPending}
                          className="owner-dashboard-approve-button inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
                        >
                          {approveState === "pending" ? (
                            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          ) : (
                            <span className="material-symbols-outlined text-[18px]">check</span>
                          )}
                          {approveState === "success"
                            ? langText("Approved", "मंजूर")
                            : approveState === "pending"
                              ? langText("Approving", "मंजूर करत आहे")
                              : langText("Approve", "मंजूर करा")}
                        </button>
                        <button
                          type="button"
                          onClick={() => runStatusUpdate(booking.id, "cancelled")}
                          disabled={isPending}
                          className="owner-dashboard-decline-button inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-wait disabled:opacity-70 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
                        >
                          {declineState === "pending" ? (
                            <span className="h-4 w-4 rounded-full border-2 border-red-300 border-t-red-700 animate-spin dark:border-red-300/30 dark:border-t-red-100" />
                          ) : (
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          )}
                          {declineState === "success"
                            ? langText("Declined", "नाकारले")
                            : declineState === "pending"
                              ? langText("Declining", "नाकारत आहे")
                              : langText("Decline", "नकार द्या")}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-outline-variant bg-surface-container-low p-8 text-center md:col-span-2 xl:col-span-3">
            <h3 className="text-2xl font-black text-primary">
              <LocalizedText en="No booking activity yet" mr="अजून बुकिंग हालचाल नाही" />
            </h3>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/owner-profile/browse"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100"
              >
                <LocalizedText en="View Equipment" mr="उपकरणे पहा" />
              </Link>
              <Link
                href="/owner-profile/support"
                className="rounded-xl bg-primary-container px-4 py-2 text-sm font-bold text-white"
              >
                <LocalizedText en="Contact Support" mr="सपोर्टशी संपर्क" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
