"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { getVisibleEquipmentRating, type EquipmentRecord } from "@/lib/equipment";
import { useState } from "react";

type SortKey = "distance" | "hp-high" | "hp-low";

function parseHpValue(hp: string) {
  const match = hp.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

export function RenterEquipmentBrowser({
  equipment,
}: {
  equipment: EquipmentRecord[];
}) {
  const { langText } = useLanguage();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("distance");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredEquipment = equipment
    .filter((item) => {
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
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">
              {langText("Equipment Search", "उपकरण शोध")}
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder={langText("Search tractor, location, HP, or work type", "ट्रॅक्टर, ठिकाण, HP किंवा कामाचा प्रकार शोधा")}
              type="search"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">
              {langText("Sort Equipment", "उपकरणे क्रम लावा")}
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
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-on-surface dark:text-slate-100">
              {langText("Available Equipment", "उपलब्ध उपकरणे")}{" "}
              <span className="font-normal text-on-surface-variant dark:text-slate-400">
                ({filteredEquipment.length} {langText("Results", "निकाल")})
              </span>
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {langText(
                "Browse by HP or distance and open the exact equipment detail page from each tile.",
                "HP किंवा अंतरानुसार उपकरणे पहा आणि प्रत्येक टाइलमधून अचूक तपशील पान उघडा."
              )}
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEquipment.map((item) => {
            const visibleRating = getVisibleEquipmentRating(item);

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
              <img src={item.coverImage} alt={item.name} className="aspect-square w-full object-cover" />
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
