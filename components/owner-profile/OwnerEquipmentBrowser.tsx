"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import type { ListingRecord } from "@/lib/local-data/types";
import { useState } from "react";

type ListingSummary = ListingRecord & {
  bookingCount: number;
};

type SortKey = "distance" | "hp-high" | "hp-low";

function parseHpValue(hp: string) {
  const match = hp.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

export function OwnerEquipmentBrowser({
  listings,
}: {
  listings: ListingSummary[];
}) {
  const { langText } = useLanguage();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("distance");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredListings = listings
    .filter((listing) => {
      if (!normalizedQuery) {
        return true;
      }

      const searchable = [
        listing.name,
        listing.category,
        listing.location,
        listing.district,
        listing.hp,
        ...listing.tags,
        ...listing.workTypes,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (sortBy === "hp-high") {
        return parseHpValue(right.hp) - parseHpValue(left.hp);
      }

      if (sortBy === "hp-low") {
        return parseHpValue(left.hp) - parseHpValue(right.hp);
      }

      return left.distanceKm - right.distanceKm;
    });

  return (
    <div className="space-y-8">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr_auto]">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">
              {langText("Equipment Search", "उपकरण शोध")}
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder={langText("Search by equipment, district, HP, or tag", "उपकरण, जिल्हा, HP किंवा टॅगने शोधा")}
              type="search"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">
              {langText("Sort Equipment", "उपकरण क्रम लावा")}
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="distance">{langText("Closest Distance", "सर्वात जवळचे अंतर")}</option>
              <option value="hp-high">{langText("Highest HP", "सर्वाधिक HP")}</option>
              <option value="hp-low">{langText("Lowest HP", "कमी HP")}</option>
            </select>
          </label>

          <div className="flex items-end">
            <Link
              href="/list-equipment"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-container px-6 py-3 text-sm font-bold text-white"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {langText("Add Listing", "लिस्टिंग जोडा")}
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface dark:text-slate-100">
              {langText("Available Equipment", "उपलब्ध उपकरणे")}{" "}
              <span className="font-normal text-on-surface-variant dark:text-slate-400">
                ({filteredListings.length} {langText("Results", "निकाल")})
              </span>
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {langText(
                "Sort your fleet by HP or distance and jump straight into edit or equipment details.",
                "तुमची उपकरणे HP किंवा अंतरानुसार क्रम लावा आणि थेट संपादन किंवा तपशील उघडा."
              )}
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((listing) => (
            <article
              key={listing.id}
              className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <img src={listing.coverImage} alt={listing.name} className="aspect-[4/3] w-full object-cover" />
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
                    <p className="text-on-surface-variant">{listing.rating.toFixed(1)} {langText("rating", "रेटिंग")}</p>
                  </div>
                  <p className="text-right text-on-surface-variant">
                    {listing.location}, {listing.district}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/list-equipment?listingId=${listing.id}`}
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
          ))}
        </div>

        {!filteredListings.length ? (
          <div className="rounded-[1.75rem] border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
            <h3 className="text-2xl font-black text-primary">{langText("No equipment matched this search", "या शोधाशी जुळणारी उपकरणे नाहीत")}</h3>
            <p className="mt-3 text-sm text-on-surface-variant">
              {langText(
                "Try another keyword or sort order to find the listing you want to manage.",
                "व्यवस्थापित करायची लिस्टिंग शोधण्यासाठी दुसरा शब्द किंवा क्रम वापरा."
              )}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
