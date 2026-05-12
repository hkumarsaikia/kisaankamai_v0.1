"use client";

import { AppLink as Link } from "@/components/AppLink";
import { EquipmentSortMenu, type EquipmentSortKey } from "@/components/equipment/EquipmentSortMenu";
import { useLanguage } from "@/components/LanguageContext";
import {
  getEquipmentAvailability,
  getVisibleEquipmentRating,
  sortEquipmentByAvailabilityPriceDistance,
  type EquipmentRecord,
} from "@/lib/equipment";
import { useState } from "react";

export function RenterEquipmentBrowser({
  equipment,
}: {
  equipment: EquipmentRecord[];
}) {
  const { langText } = useLanguage();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<EquipmentSortKey>("availability");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredMatches = equipment.filter((item) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      item.name,
      item.categoryLabel,
      item.location,
      item.district,
      item.hp,
      ...item.tags,
      ...item.workTypes,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
  const filteredEquipment = sortEquipmentByAvailabilityPriceDistance(filteredMatches, sortBy);

  return (
    <div className="space-y-7">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">
              {langText("Search Equipment", "उपकरणे शोधा")}
            </span>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">
                search
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-12 text-sm font-semibold text-on-surface outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
                placeholder={langText("Search tractor, location, HP, or work type", "ट्रॅक्टर, ठिकाण, HP किंवा कामाचा प्रकार शोधा")}
                type="search"
              />
            </div>
          </label>
          <div className="min-w-0">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">
              {langText("Sort Equipment", "उपकरणे क्रम लावा")}
            </span>
            <EquipmentSortMenu sortBy={sortBy} onSortChange={setSortBy} className="w-full justify-stretch lg:w-auto" />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-on-surface dark:text-slate-100">
              {langText("Available Equipment", "उपलब्ध उपकरणे")}{" "}
              <span className="font-normal text-on-surface-variant dark:text-slate-400">
                ({filteredEquipment.length} {langText("Results", "निकाल")})
              </span>
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEquipment.map((item) => {
            const visibleRating = getVisibleEquipmentRating(item);
            const availability = getEquipmentAvailability(item);

            return (
              <article
                key={item.id}
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
                <img src={item.coverImage} alt={item.name} className="aspect-square w-full object-cover" />
              </div>
              <div className="space-y-3 p-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">{item.name}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400">{item.categoryLabel}</p>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400">
                    {item.location}, {item.district}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 rounded-xl bg-surface-container-low p-3 text-sm">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">HP</p>
                    <p className="mt-1 font-semibold text-on-surface">{item.hp}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Distance", "अंतर")}</p>
                    <p className="mt-1 font-semibold text-on-surface">{item.distanceKm} km</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Rate", "दर")}</p>
                    <p className="mt-1 font-semibold text-on-surface">₹{item.pricePerHour}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-extrabold text-primary-container dark:text-emerald-200">
                    ₹{item.pricePerHour}/hr
                  </p>
                  {visibleRating ? (
                    <p className="equipment-rating-pill inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                      <span className="material-symbols-outlined text-[15px]">star</span>
                      {visibleRating.value.toFixed(1)}
                    </p>
                  ) : null}
                  <Link href={`/renter-profile/equipment/${item.id}`} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
                    {langText("View Details", "तपशील पहा")}
                  </Link>
                </div>
              </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
