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

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatShortDate(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
}

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
  const { language, langText } = useLanguage();
  const locale = language === "mr" ? "mr-IN" : "en-IN";
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
  const requestViewLabels: Record<typeof requestView, string> = {
    active: langText("Active", "सक्रिय"),
    upcoming: langText("Upcoming", "आगामी"),
    history: langText("History", "इतिहास"),
  };

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
            <span>{langText("Owner Profile", "मालक प्रोफाइल")}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">{langText("Booking Management", "बुकिंग व्यवस्थापन")}</h1>
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
              {requestViewLabels[view]}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
                {langText("New Requests", "नवीन विनंत्या")}
                <span className="rounded-full bg-secondary-container px-2 py-0.5 text-xs text-on-secondary-container">{displayedRequests.length}</span>
              </h2>
              <Link href="/owner-profile" className="text-sm font-bold text-secondary hover:underline">
                {langText("View all", "सर्व पहा")}
              </Link>
            </div>

            {displayedRequests.slice(0, 3).map((booking) => (
              <RequestCard key={booking.id} booking={booking} />
            ))}

            {!displayedRequests.length ? (
              <div className="rounded-3xl border border-dashed border-outline-variant bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
                  <span className="material-symbols-outlined text-4xl text-outline">inventory</span>
                </div>
                <h2 className="text-2xl font-bold text-primary">{langText("No new requests yet", "अजून नवीन विनंत्या नाहीत")}</h2>
                <p className="mx-auto mt-2 max-w-sm text-on-surface-variant">
                  {langText(
                    "Update your pricing or add clear photos to attract more farmers to your equipment.",
                    "तुमच्या उपकरणांकडे अधिक शेतकरी आकर्षित करण्यासाठी किंमत अद्यतनित करा किंवा स्पष्ट फोटो जोडा."
                  )}
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/list-equipment" className="rounded-xl bg-primary px-8 py-3 font-bold text-white transition-[box-shadow] hover:shadow-lg">
                    {langText("Add New Listing", "नवीन लिस्टिंग जोडा")}
                  </Link>
                  <Link href="/owner-profile" className="rounded-xl border border-surface-container-highest bg-white px-8 py-3 font-bold text-primary transition-colors hover:bg-surface dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900">
                    {langText("Optimize Current", "सध्याची लिस्टिंग सुधारा")}
                  </Link>
                </div>
              </div>
            ) : null}
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">{langText("Recently Completed", "अलीकडे पूर्ण झालेले")}</h2>
              <Link href="/owner-profile" className="text-sm font-bold text-on-surface-variant transition-colors hover:text-primary">
                {langText("View All History", "संपूर्ण इतिहास पहा")}
              </Link>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="flex min-w-max gap-4">
                {completedBookings.slice(0, 4).map((booking) => (
                  <div key={booking.id} className="flex w-80 items-center gap-4 rounded-xl border border-surface-container-highest bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-surface-container">
                      <Image
                        src={booking.listing?.coverImage || assetPath("/assets/generated/hero_tractor.png")}
                        alt={booking.listing?.name || "Equipment"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="block text-xs font-black uppercase tracking-tight text-on-surface-variant">
                        {langText("Completed", "पूर्ण")} {formatShortDate(booking.endDate, locale)}
                      </span>
                      <h4 className="text-sm font-bold text-primary">{booking.listing?.name || langText("Equipment", "उपकरण")}</h4>
                      <span className="text-xs font-medium text-secondary">
                        {formatCurrency(booking.amount, locale)} {langText("Estimated", "अंदाजित")}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                ))}
                {!completedBookings.length ? (
                  <div className="w-80 rounded-xl border border-dashed border-outline-variant bg-white p-6 text-sm text-on-surface-variant dark:border-slate-700 dark:bg-slate-900">
                    {langText("Completed bookings will appear here.", "पूर्ण बुकिंग येथे दिसतील.")}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section className="rounded-2xl border border-surface-container-highest bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-bold text-primary">{langText("Schedule", "वेळापत्रक")}</h2>
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
                <span className="text-xs font-semibold">{langText("Request review today", "आज विनंती तपासा")}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-secondary-container" />
                <span className="text-xs font-semibold">{langText("Upcoming equipment pickup", "आगामी उपकरण पिकअप")}</span>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-primary-container p-6 text-white shadow-lg">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-fixed">
                {langText("Estimated Booking Value", "अंदाजित बुकिंग मूल्य")}
              </span>
              <div className="mt-1 text-3xl font-extrabold">{formatCurrency(bookingValueInFlow, locale)}</div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary-fixed/90">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                {bookings.length.toLocaleString(locale)} {langText("booking requests", "बुकिंग विनंत्या")}
              </div>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-white/10">request_quote</span>
          </section>

          <section className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
            <h3 className="mb-2 text-sm font-bold text-primary">{langText("Need help managing equipment?", "उपकरण व्यवस्थापनासाठी मदत हवी आहे का?")}</h3>
            <p className="mb-4 text-xs leading-relaxed text-on-surface-variant">
              {langText(
                "Our support team is available in Marathi and English to help you list or manage bookings.",
                "लिस्टिंग किंवा बुकिंग व्यवस्थापनासाठी आमची सपोर्ट टीम मराठी आणि इंग्रजीमध्ये उपलब्ध आहे."
              )}
            </p>
            <Link href="/support" className="block rounded-lg border border-surface-container-highest bg-white py-2 text-xs font-bold text-primary transition-colors hover:bg-surface dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900">
              {langText("Contact Support", "सपोर्टशी संपर्क करा")}
            </Link>
          </section>

          <section className="rounded-2xl border border-outline-variant bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-secondary">{langText("Owner Snapshot", "मालक आढावा")}</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <Row label={langText("Active listings", "सक्रिय लिस्टिंग")} value={activeListings.length.toLocaleString(locale)} />
              <Row label={langText("Village", "गाव")} value={village || langText("Not set", "निश्चित केलेले नाही")} />
              <Row label={langText("Pincode", "पिनकोड")} value={pincode || langText("Not set", "निश्चित केलेले नाही")} />
            </dl>
            <Link href="/list-equipment" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-container">
              <span className="material-symbols-outlined text-sm">add</span>
              {langText("Add New Listing", "नवीन लिस्टिंग जोडा")}
            </Link>
          </section>
        </aside>
      </section>
    </div>
  );
}

function RequestCard({ booking }: { booking: BookingSummary }) {
  const { language, langText } = useLanguage();
  const locale = language === "mr" ? "mr-IN" : "en-IN";
  const listingName = booking.listing?.name || langText("Equipment", "उपकरण");
  const renterName = booking.renterProfile?.fullName || langText("Renter", "भाडेकरू");
  const renterVillage = booking.renterProfile?.village || booking.listing?.district || "Maharashtra";

  return (
    <article className="group rounded-2xl border border-surface-container-highest bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="relative h-36 w-full flex-shrink-0 overflow-hidden rounded-xl bg-surface-container md:h-32 md:w-32">
          <Image
            src={booking.listing?.coverImage || assetPath("/assets/generated/hero_tractor.png")}
            alt={listingName}
            fill
            sizes="(max-width: 768px) 100vw, 128px"
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
                  {renterName} <span className="font-normal text-on-surface-variant">{langText("from", "येथून")} {renterVillage}</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-lg font-extrabold text-primary">{formatCurrency(booking.amount, locale)}</span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">{langText("Estimated Total", "अंदाजित एकूण")}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-surface-container-highest py-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-secondary">calendar_month</span>
              <span className="text-xs font-bold">
                {formatShortDate(booking.startDate, locale)} - {formatShortDate(booking.endDate, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-secondary">fact_check</span>
              <span className="text-xs font-bold capitalize">{statusLabel(booking.status, langText)}</span>
            </div>
            {booking.status === "pending" ? (
              <span className="ml-auto rounded bg-amber-50 px-2 py-1 text-[10px] font-black uppercase text-amber-700">{langText("Urgent", "तातडीचे")}</span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/owner-profile" className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-primary/90">
              {langText("Review Request", "विनंती तपासा")}
            </Link>
            <Link href="/owner-profile" className="rounded-lg border border-surface-container-highest px-6 py-2.5 text-center text-sm font-bold text-on-surface transition-colors hover:bg-surface-container">
              {langText("Schedule", "वेळापत्रक")}
            </Link>
            <a
              href={supportContact.phoneHref}
              aria-label={langText("Call support", "सपोर्टला कॉल करा")}
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

function statusLabel(status: string, langText: (english: string, marathi: string) => string) {
  switch (status) {
    case "confirmed":
      return langText("Confirmed", "पुष्टी");
    case "active":
      return langText("Active", "सक्रिय");
    case "upcoming":
      return langText("Upcoming", "आगामी");
    case "completed":
      return langText("Completed", "पूर्ण");
    case "cancelled":
      return langText("Cancelled", "रद्द");
    default:
      return langText("Pending", "प्रलंबित");
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="font-black text-primary">{value}</dd>
    </div>
  );
}
