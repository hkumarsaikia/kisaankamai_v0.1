"use client";

import { useState } from "react";
import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { assetPath } from "@/lib/site";
import { supportContact } from "@/lib/support-contact";

type BookingSummary = {
  id: string;
  listingId: string;
  status: string;
  amount: number;
  startDate: string;
  endDate: string;
  listing?: {
    id?: string | null;
    name?: string | null;
    coverImage?: string | null;
    district?: string | null;
  } | null;
  ownerProfile?: { fullName?: string | null } | null;
};

type SavedListingSummary = {
  id: string;
  name: string;
  coverImage: string;
  categoryLabel: string;
  pricePerHour: number;
};

type PaymentSummary = {
  id: string;
  amount: number;
  method: string;
  status: string;
  bookingId: string;
};

const recommendedEquipment = [
  {
    title: "Multicrop Seed Drill",
    category: "Seed Drills",
    price: "₹800",
    unit: "/ acre",
    href: "/rent-equipment?query=seeders",
    image: assetPath("/assets/generated/seed_drill.webp"),
  },
  {
    title: "Kubota Harvester DC-68G",
    category: "Harvesters",
    price: "₹2,200",
    unit: "/ hr",
    href: "/rent-equipment?query=harvesters",
    image: assetPath("/assets/generated/harvester_action.webp"),
  },
  {
    title: "DJI Agras Drone T30",
    category: "Sprayers",
    price: "₹450",
    unit: "/ acre",
    href: "/rent-equipment?query=sprayers",
    image: assetPath("/assets/generated/sprayer.webp"),
  },
];

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

export function RenterWorkspaceOverview({
  renterName,
  bookings,
  savedListings,
}: {
  renterName: string;
  bookings: BookingSummary[];
  payments: PaymentSummary[];
  savedListings: SavedListingSummary[];
}) {
  const { language, langText } = useLanguage();
  const locale = language === "mr" ? "mr-IN" : "en-IN";
  const [bookingView, setBookingView] = useState<"current" | "upcoming" | "history">("current");
  const currentBookings = bookings.filter((booking) => booking.status !== "completed" && booking.status !== "cancelled" && booking.status !== "upcoming");
  const upcomingBookings = bookings.filter((booking) => booking.status === "upcoming");
  const completedBookings = bookings.filter((booking) => booking.status === "completed");
  const displayedBookings =
    bookingView === "current"
      ? currentBookings
      : bookingView === "upcoming"
        ? upcomingBookings
        : completedBookings;
  const bookingViewTitle =
    bookingView === "current"
      ? langText("Active Bookings", "सक्रिय बुकिंग्ज")
      : bookingView === "upcoming"
        ? langText("Upcoming Bookings", "आगामी बुकिंग्ज")
        : langText("Recent History", "अलीकडील व्यवहार");
  const totalBookingValue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
  const completedBookingValue = completedBookings.reduce((sum, booking) => sum + booking.amount, 0);
  const activeBookingValue = Math.max(totalBookingValue - completedBookingValue, 0);
  const bookingViewLabels: Record<typeof bookingView, string> = {
    current: langText("Current", "सध्याचे"),
    upcoming: langText("Upcoming", "आगामी"),
    history: langText("History", "इतिहास"),
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
            <span>{langText("Renter Profile", "भाडेकरू प्रोफाइल")}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {langText("Renter Profile", "भाडेकरू प्रोफाइल")}
          </h1>
          <p className="mt-1 text-sm font-medium text-on-surface-variant">
            {langText(
              `Welcome back, ${renterName}. You have ${currentBookings.length} active bookings and ${savedListings.length} saved listings.`,
              `पुन्हा स्वागत आहे, ${renterName}. तुमच्याकडे ${currentBookings.length} सक्रिय बुकिंग्ज आणि ${savedListings.length} जतन केलेली उपकरणे आहेत.`
            )}
          </p>
        </div>
        <div className="flex w-full overflow-hidden rounded-full border border-outline-variant/40 bg-surface-container-low p-1 text-xs font-bold text-on-surface-variant shadow-sm md:w-auto">
          {(["current", "upcoming", "history"] as const).map((view) => (
            <button
              key={view}
              type="button"
              aria-pressed={bookingView === view}
              onClick={() => setBookingView(view)}
              className={`flex-1 rounded-full px-5 py-2 text-center capitalize transition-colors md:flex-none ${
                bookingView === view ? "bg-primary-container text-white" : "hover:bg-white/70 hover:text-primary"
              }`}
            >
              {bookingViewLabels[view]}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-10">
          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-on-surface">
                {bookingViewTitle}
              </h2>
              <Link href="/renter-profile" className="text-sm font-bold text-primary-container hover:underline">
                {langText("View All", "सर्व पहा")}
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {displayedBookings.slice(0, 2).map((booking) => {
                const listingId = booking.listing?.id || booking.listingId;
                return (
                  <article key={booking.id} className="group overflow-hidden rounded-2xl border border-outline-variant/50 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary-container/5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="relative h-44">
                      <Image
                        src={booking.listing?.coverImage || assetPath("/assets/generated/hero_tractor.webp")}
                        alt={booking.listing?.name || "Equipment"}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-primary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-white">
                        {booking.status}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-on-surface">{booking.listing?.name || langText("Equipment", "उपकरण")}</h3>
                        <p className="text-right text-sm font-extrabold text-primary">
                          {formatCurrency(booking.amount, locale)} <span className="block text-[10px] font-normal text-on-surface-variant">{langText("estimated", "अंदाजित")}</span>
                        </p>
                      </div>
                      <div className="mb-5 space-y-2 text-sm text-on-surface-variant">
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">event</span>
                          {formatShortDate(booking.startDate, locale)} - {formatShortDate(booking.endDate, locale)}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">person</span>
                          {langText("Owner", "मालक")}: {booking.ownerProfile?.fullName || langText("Owner", "मालक")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={listingId ? `/renter-profile/equipment/${listingId}` : "/rent-equipment"} className="flex-1 rounded-lg bg-primary-container py-2 text-center text-xs font-bold text-white transition-opacity hover:opacity-90">
                          {langText("Track Order", "ऑर्डर ट्रॅक करा")}
                        </Link>
                        <a
                          href={supportContact.phoneHref}
                          aria-label={langText("Call support", "सपोर्टला कॉल करा")}
                          className="rounded-lg border border-outline-variant p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
                        >
                          <span className="material-symbols-outlined text-xl">call</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
              {!displayedBookings.length ? (
                <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-8 text-sm font-medium text-on-surface-variant dark:border-slate-700 dark:bg-slate-900">
                  {bookingView === "history"
                    ? langText("Completed rentals will appear here.", "पूर्ण झालेले व्यवहार येथे दिसतील.")
                    : langText("No bookings in this view yet. Browse equipment to start a new rental.", "या दृश्यात अजून बुकिंग नाहीत. नवीन भाडे सुरू करण्यासाठी उपकरणे पहा.")}
                </div>
              ) : null}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-on-surface">
                {langText("Recommended for You", "तुमच्यासाठी शिफारस")}
              </h2>
              <Link href="/rent-equipment" className="text-sm font-bold text-primary-container hover:underline">
                {langText("Browse all", "सर्व पहा")}
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recommendedEquipment.map((item) => (
                <Link key={item.title} href={item.href} className="group w-64 flex-none rounded-xl border border-outline-variant/30 bg-white p-3 transition-colors hover:border-primary-container dark:border-slate-800 dark:bg-slate-900">
                  <div className="relative mb-3 h-32 overflow-hidden rounded-lg">
                    <Image src={item.image} alt={item.title} fill sizes="256px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <p className="mb-1 text-xs font-medium text-tertiary">{item.category}</p>
                  <h4 className="mb-2 text-sm font-bold text-on-surface">{item.title}</h4>
                  <p className="text-sm font-extrabold text-primary-container">
                    {item.price} <span className="text-[10px] font-normal text-on-surface-variant">{item.unit}</span>
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-lg font-bold text-on-surface">
              {langText("Recent History", "अलीकडील व्यवहार")}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead className="border-b border-outline-variant/30 bg-surface-container-low">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">{langText("Equipment", "उपकरण")}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">{langText("Dates", "तारखा")}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">{langText("Total Amount", "एकूण रक्कम")}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">{langText("Status", "स्थिती")}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">{langText("Action", "कृती")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {completedBookings.slice(0, 3).map((booking) => {
                      const listingId = booking.listing?.id || booking.listingId;
                      return (
                        <tr key={booking.id} className="transition-colors hover:bg-surface-container-lowest">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-surface-container">
                                <Image src={booking.listing?.coverImage || assetPath("/assets/generated/hero_tractor.webp")} alt={booking.listing?.name || "Equipment"} fill sizes="40px" className="object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-on-surface">{booking.listing?.name || langText("Equipment", "उपकरण")}</p>
                                <p className="text-[10px] text-on-surface-variant">
                                  {langText("Owner", "मालक")}: {booking.ownerProfile?.fullName || langText("Owner", "मालक")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">
                            {formatShortDate(booking.startDate, locale)} - {formatShortDate(booking.endDate, locale)}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-on-surface">{formatCurrency(booking.amount, locale)}</td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-on-primary-container/10 px-2 py-0.5 text-[10px] font-bold text-primary-container">
                              {langText("Completed", "पूर्ण")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={listingId ? `/renter-profile/equipment/${listingId}` : "/rent-equipment"} className="text-xs font-bold text-primary-container hover:underline">
                              {langText("Re-book", "पुन्हा बुक करा")}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                    {!completedBookings.length ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-sm text-on-surface-variant">
                          {langText("Completed rentals will appear here.", "पूर्ण झालेले व्यवहार येथे दिसतील.")}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-on-surface">{langText("Booking Schedule", "बुकिंग वेळापत्रक")}</h3>
              <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
            </div>
            <div className="mb-4 grid grid-cols-7 gap-1 text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <div key={`${day}-${index}`} className={`text-[10px] font-bold text-on-surface-variant ${index === 6 ? "text-error" : ""}`}>{day}</div>
              ))}
              {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((day) => (
                <div key={day} className={`py-2 text-xs ${day >= 12 && day <= 15 ? "rounded-full bg-primary-container font-bold text-white" : day >= 18 && day <= 19 ? "rounded-full bg-secondary-container font-bold text-on-secondary-fixed" : "text-on-surface-variant"}`}>
                  {day}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border-l-4 border-primary-container bg-surface-container-low p-2">
                <div className="text-[10px] font-bold leading-tight text-on-surface-variant">12<br />Oct</div>
                <div className="truncate text-xs font-bold text-on-surface">{langText("Equipment delivery", "उपकरण वितरण")}</div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border-l-4 border-secondary-container bg-surface-container-low p-2">
                <div className="text-[10px] font-bold leading-tight text-on-surface-variant">18<br />Oct</div>
                <div className="truncate text-xs font-bold text-on-surface">{langText("Pending request review", "प्रलंबित विनंती तपासणी")}</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-1 font-bold text-on-surface">{langText("Booking Value Summary", "बुकिंग मूल्य सारांश")}</h3>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{langText("Current account", "सध्याचे खाते")}</p>
            <div className="mb-4">
              <p className="text-3xl font-extrabold text-primary-container">{formatCurrency(totalBookingValue, locale)}</p>
              <p className="text-xs font-medium text-on-surface-variant">
                {langText("Owner-listed estimates recorded so far", "आतापर्यंत नोंदलेले मालकाने दिलेले अंदाज")}
              </p>
            </div>
            <div className="space-y-3">
              <ProgressRow label="Completed" value={completedBookingValue} total={Math.max(totalBookingValue, 1)} tone="bg-primary-container" />
              <ProgressRow label="Active" value={activeBookingValue} total={Math.max(totalBookingValue, 1)} tone="bg-secondary-container" />
            </div>
            <Link href="/renter-profile" className="mt-6 block rounded-xl border border-outline-variant py-2.5 text-center text-xs font-bold transition-colors hover:bg-surface-container">
              {langText("View Bookings", "बुकिंग पहा")}
            </Link>
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-tertiary-container p-6">
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 rotate-12 text-8xl text-white/10">support_agent</span>
            <div className="relative z-10">
              <h3 className="mb-2 text-lg font-bold leading-tight text-white">{langText("Need help with your booking?", "तुमच्या बुकिंगसाठी मदत हवी आहे का?")}</h3>
              <p className="mb-6 text-xs text-tertiary-fixed/90">
                {langText("Our field support team is available from 8 AM to 8 PM.", "आमची फील्ड सपोर्ट टीम सकाळी ८ ते रात्री ८ उपलब्ध आहे.")}
              </p>
              <Link href="/support" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-extrabold text-tertiary-container shadow-lg shadow-tertiary-container/40 transition-transform hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-sm">call</span>
                {langText("Contact Support", "सपोर्टशी संपर्क करा")}
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function ProgressRow({ label, value, total, tone }: { label: string; value: number; total: number; tone: string }) {
  const { language } = useLanguage();
  const locale = language === "mr" ? "mr-IN" : "en-IN";
  const width = Math.min(100, Math.round((value / total) * 100));

  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] font-bold uppercase text-on-surface-variant">
        <span>{label}</span>
        <span>{formatCurrency(value, locale)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
        <div className={`h-full ${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
