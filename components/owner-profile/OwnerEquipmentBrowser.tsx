"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { getEquipmentAvailability, getVisibleEquipmentRating } from "@/lib/equipment";
import type { ListingRecord } from "@/lib/local-data/types";

type ListingSummary = ListingRecord & {
  bookingCount: number;
};

export function OwnerEquipmentBrowser({
  listings,
}: {
  listings: ListingSummary[];
}) {
  const { langText } = useLanguage();

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface dark:text-slate-100">
              {langText("Available Equipment", "उपलब्ध उपकरणे")}{" "}
              <span className="font-normal text-on-surface-variant dark:text-slate-400">
                ({listings.length} {langText("Results", "निकाल")})
              </span>
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => {
            const visibleRating = getVisibleEquipmentRating(listing);
            const availability = getEquipmentAvailability(listing);

            return (
              <article
                key={listing.id}
                className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
              <div className="relative">
                <span
                  className={`equipment-availability-dot absolute right-4 top-4 z-10 inline-flex h-4 w-4 rounded-full border-2 border-white shadow-lg ring-4 ${
                    availability.available
                      ? "bg-emerald-500 ring-emerald-500/20"
                      : "bg-red-500 ring-red-500/20"
                  }`}
                  aria-label={availability.available ? langText("Available", "उपलब्ध") : langText("Not available", "उपलब्ध नाही")}
                  role="img"
                  title={availability.available ? langText("Available", "उपलब्ध") : langText("Not available", "उपलब्ध नाही")}
                />
                <img src={listing.coverImage} alt={listing.name} className="aspect-[4/3] w-full object-cover" />
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">{listing.name}</h3>
                    <p className="text-sm text-on-surface-variant dark:text-slate-400">
                      {listing.categoryLabel}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${
                      listing.status === "active"
                        ? "bg-primary-fixed text-on-primary-fixed"
                        : "bg-surface-container text-on-surface"
                    }`}
                  >
                    {listing.status === "active" ? langText("Active", "सक्रिय") : langText("Paused", "थांबवले")}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-xl bg-surface-container-low p-4 text-sm">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">HP</p>
                    <p className="mt-1 font-semibold text-on-surface">{listing.hp}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Distance", "अंतर")}</p>
                    <p className="mt-1 font-semibold text-on-surface">{listing.distanceKm} km</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Bookings", "बुकिंग")}</p>
                    <p className="mt-1 font-semibold text-on-surface">{listing.bookingCount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-primary-container">₹{listing.pricePerHour}/hr</p>
                    {visibleRating ? (
                      <p className="equipment-rating-pill mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                        <span className="material-symbols-outlined text-[15px]">star</span>
                        {visibleRating.value.toFixed(1)}
                      </p>
                    ) : null}
                  </div>
                  <p className="text-right text-on-surface-variant">
                    {listing.location}, {listing.district}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/owner-profile/list-equipment?listingId=${listing.id}`}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100"
                  >
                    {langText("Edit", "संपादन")}
                  </Link>
                  <Link
                    href={`/owner-profile/equipment/${listing.id}`}
                    className="rounded-xl bg-primary-container px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    {langText("Details", "तपशील")}
                  </Link>
                </div>
              </div>
              </article>
            );
          })}
        </div>

        {!listings.length ? (
          <div className="rounded-[1.75rem] border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
            <h3 className="text-2xl font-black text-primary">{langText("No equipment matched this search", "या शोधाशी जुळणारी उपकरणे नाहीत")}</h3>
          </div>
        ) : null}
      </section>
    </div>
  );
}
