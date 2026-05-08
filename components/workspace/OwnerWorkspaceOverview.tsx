"use client";

import { useState } from "react";
import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { assetPath } from "@/lib/site";
import { supportContact } from "@/lib/support-contact";

type ListingSummary = {
  id: string;
  name: string;
  status: string;
  coverImage: string;
  location: string;
  district: string;
  pricePerHour: number;
};

type BookingSummary = {
  id: string;
  status: string;
  amount: number;
  startDate: string;
  endDate: string;
  listing?: {
    id?: string | null;
    name?: string | null;
    coverImage?: string | null;
    district?: string | null;
    location?: string | null;
  } | null;
  renterProfile?: { fullName?: string | null; village?: string | null } | null;
};

type PaymentSummary = {
  id: string;
  status: string;
  amount: number;
};

export function OwnerWorkspaceOverview({
  ownerName,
  village,
  pincode,
  listings,
  bookings,
}: {
  ownerName: string;
  village?: string | null;
  pincode?: string | null;
  listings: ListingSummary[];
  bookings: BookingSummary[];
  payments: PaymentSummary[];
}) {
  const { langText } = useLanguage();
  const [requestView, setRequestView] = useState<"active" | "upcoming" | "history">("active");

  const activeListings = listings.filter((listing) => listing.status === "active");
  const activeRequests = bookings.filter((booking) => booking.status !== "completed" && booking.status !== "cancelled" && booking.status !== "upcoming");
  const upcomingRequests = bookings.filter((booking) => booking.status === "upcoming");
  const completedBookings = bookings.filter((booking) => booking.status === "completed");
  const displayedRequests =
    requestView === "active"
      ? activeRequests
      : requestView === "upcoming"
        ? upcomingRequests
        : completedBookings;
  const bookingValueInFlow = bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce((sum, booking) => sum + booking.amount, 0);

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
            <span>Owner Profile</span>
            <span className="h-1 w-1 rounded-full bg-outline-variant" />
            <span className="text-secondary">मराठी पोर्टल</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Booking Management</h1>
          <p className="mt-1 text-sm font-medium text-on-surface-variant">
            {langText(
              `Manage incoming requests for ${ownerName}'s equipment.`,
              `${ownerName} यांच्या उपकरणांसाठी येणाऱ्या विनंत्या व्यवस्थापित करा.`
            )}
          </p>
        </div>
        <div className="flex w-full overflow-hidden rounded-xl border border-surface-container-highest bg-white p-1 text-sm font-bold text-on-surface-variant shadow-sm md:w-auto">
          {(["active", "upcoming", "history"] as const).map((view) => (
            <button
              key={view}
              type="button"
              aria-pressed={requestView === view}
              onClick={() => setRequestView(view)}
              className={`flex-1 rounded-lg px-4 py-2 text-center capitalize transition-colors md:flex-none ${
                requestView === view ? "bg-primary text-white" : "hover:bg-surface-container hover:text-primary"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
                New Requests
                <span className="rounded-full bg-secondary-container px-2 py-0.5 text-xs text-on-secondary-container">{displayedRequests.length}</span>
              </h2>
              <Link href="/owner-profile" className="text-sm font-bold text-secondary hover:underline">
                मराठीत पहा
              </Link>
            </div>

            {displayedRequests.slice(0, 3).map((booking) => (
              <RequestCard key={booking.id} booking={booking} />
            ))}

            {!displayedRequests.length ? (
              <div className="rounded-3xl border border-dashed border-outline-variant bg-white px-6 py-16 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
                  <span className="material-symbols-outlined text-4xl text-outline">inventory_2</span>
                </div>
                <h2 className="text-2xl font-bold text-primary">No new requests yet</h2>
                <p className="mx-auto mt-2 max-w-sm text-on-surface-variant">Update your pricing or add professional photos to attract more farmers to your equipment.</p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/list-equipment" className="rounded-xl bg-primary px-8 py-3 font-bold text-white transition-all hover:shadow-lg">
                    Add New Listing
                  </Link>
                  <Link href="/owner-profile" className="rounded-xl border border-surface-container-highest bg-white px-8 py-3 font-bold text-primary transition-all hover:bg-surface">
                    Optimize Current
                  </Link>
                </div>
              </div>
            ) : null}
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Recently Completed</h2>
              <Link href="/owner-profile" className="text-sm font-bold text-on-surface-variant transition-colors hover:text-primary">
                View All History
              </Link>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="flex min-w-max gap-4">
                {completedBookings.slice(0, 4).map((booking) => (
                  <div key={booking.id} className="flex w-80 items-center gap-4 rounded-xl border border-surface-container-highest bg-white p-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-surface-container">
                      <Image
                        src={booking.listing?.coverImage || assetPath("/assets/generated/hero_tractor.png")}
                        alt={booking.listing?.name || "Equipment"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="block text-xs font-black uppercase tracking-tight text-on-surface-variant">Completed {booking.endDate}</span>
                      <h4 className="text-sm font-bold text-primary">{booking.listing?.name || langText("Equipment", "उपकरण")}</h4>
                      <span className="text-xs font-medium text-secondary">₹{booking.amount.toLocaleString("en-IN")} Earned</span>
                    </div>
                    <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                ))}
                {!completedBookings.length ? (
                  <div className="w-80 rounded-xl border border-dashed border-outline-variant bg-white p-6 text-sm text-on-surface-variant">
                    Completed bookings will appear here.
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section className="rounded-2xl border border-surface-container-highest bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-bold text-primary">Schedule</h2>
              <span className="material-symbols-outlined text-on-surface-variant">calendar_month</span>
            </div>
            <div className="mb-4 grid grid-cols-7 gap-1 text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <span key={`${day}-${index}`} className="text-[10px] font-black uppercase text-on-surface-variant">{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2].map((day) => (
                <div
                  key={`${day}`}
                  className={`flex h-8 items-center justify-center text-xs ${
                    day === 24
                      ? "rounded-lg bg-primary font-bold text-white shadow-sm"
                      : day === 25 || day === 26
                        ? "rounded-lg bg-primary-fixed font-bold text-primary"
                        : day === 28 || day === 29
                          ? "rounded-lg bg-secondary-container font-bold text-on-secondary-container"
                          : "font-bold text-on-surface"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-surface-container-highest pt-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold">Request review today</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-secondary-container" />
                <span className="text-xs font-semibold">Upcoming equipment pickup</span>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-primary-container p-6 text-white shadow-lg">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-primary-container">Estimated Booking Value</span>
              <div className="mt-1 text-3xl font-extrabold">₹{bookingValueInFlow.toLocaleString("en-IN")}</div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-on-primary-container">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                {bookings.length} booking requests
              </div>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-white/10">request_quote</span>
          </section>

          <section className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
            <h3 className="mb-2 text-sm font-bold text-primary">Need help managing equipment?</h3>
            <p className="mb-4 text-xs leading-relaxed text-on-surface-variant">Our support team is available in Marathi and English to help you list or manage bookings.</p>
            <Link href="/support" className="block rounded-lg border border-surface-container-highest bg-white py-2 text-xs font-bold text-primary transition-colors hover:bg-surface">
              Contact Support
            </Link>
          </section>

          <section className="rounded-2xl border border-outline-variant bg-white p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-secondary">Owner Snapshot</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <Row label="Active listings" value={String(activeListings.length)} />
              <Row label="Village" value={village || "Not set"} />
              <Row label="Pincode" value={pincode || "Not set"} />
            </dl>
            <Link href="/list-equipment" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-container">
              <span className="material-symbols-outlined text-sm">add</span>
              Add New Listing
            </Link>
          </section>
        </aside>
      </section>
    </div>
  );
}

function RequestCard({ booking }: { booking: BookingSummary }) {
  const listingName = booking.listing?.name || "Equipment";
  const renterName = booking.renterProfile?.fullName || "Renter";
  const renterVillage = booking.renterProfile?.village || booking.listing?.district || "Maharashtra";

  return (
    <article className="group rounded-2xl border border-surface-container-highest bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="relative h-36 w-full flex-shrink-0 overflow-hidden rounded-xl bg-surface-container md:h-32 md:w-32">
          <Image
            src={booking.listing?.coverImage || assetPath("/assets/generated/hero_tractor.png")}
            alt={listingName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-primary">{listingName}</h3>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-primary-fixed text-[10px] font-black text-primary">
                  {renterName.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-on-surface">
                  {renterName} <span className="font-normal text-on-surface-variant">from {renterVillage}</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-lg font-extrabold text-primary">₹{booking.amount.toLocaleString("en-IN")}</span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">Estimated Total</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-surface-container-highest py-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-secondary">calendar_month</span>
              <span className="text-xs font-bold">{booking.startDate} - {booking.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-secondary">fact_check</span>
              <span className="text-xs font-bold capitalize">{booking.status}</span>
            </div>
            {booking.status === "pending" ? (
              <span className="ml-auto rounded bg-amber-50 px-2 py-1 text-[10px] font-black uppercase text-amber-700">Urgent</span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/owner-profile" className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-primary/90">
              Review Request
            </Link>
            <Link href="/owner-profile" className="rounded-lg border border-surface-container-highest px-6 py-2.5 text-center text-sm font-bold text-on-surface transition-colors hover:bg-surface-container">
              Schedule
            </Link>
            <a
              href={supportContact.phoneHref}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-container-highest text-primary transition-colors hover:bg-surface-container"
            >
              <span className="material-symbols-outlined">call</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="font-black text-primary">{value}</dd>
    </div>
  );
}
