"use client";

import { useLanguage } from "@/components/LanguageContext";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import { FormEvent, ReactNode, useMemo, useState } from "react";

export default function RentEquipmentClient({
  initialLocation,
  initialQuery,
  children,
}: {
  initialLocation: string;
  initialQuery: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const router = useSmoothRouter();
  const [location, setLocation] = useState(initialLocation);
  const [query, setQuery] = useState(initialQuery);
  const [suggestionMsg, setSuggestionMsg] = useState("");

  const normalizedLocation = useMemo(() => location.trim(), [location]);
  const normalizedQuery = useMemo(() => query.trim(), [query]);

  const applySearch = () => {
    const params = new URLSearchParams();
    if (normalizedLocation) params.set("location", normalizedLocation);
    if (normalizedQuery) params.set("query", normalizedQuery);

    const nextHref = params.toString() ? `/rent-equipment?${params.toString()}` : "/rent-equipment";
    router.replace(nextHref);

    if (/^\d{6}$/.test(normalizedLocation) && normalizedLocation !== "423501" && normalizedLocation !== "431715") {
      setSuggestionMsg(
        t("rent-equipment.RentEquipmentClient.location_not_found_in_our_system_showing_nearby_available_hubs")
      );
    } else {
      setSuggestionMsg("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearch();
  };

  return (
    <div className="flex-grow">
      <section className="sticky top-20 z-40 border-b border-outline-variant/30 bg-white/95 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/95">
        <form className="mx-auto grid max-w-7xl gap-4 px-6 py-5 lg:grid-cols-[1fr_1.4fr_auto] lg:items-center" onSubmit={handleSubmit}>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400">
              location_on
            </span>
            <input
              className="kk-form-search-input"
              placeholder={t("rent-equipment.RentEquipmentClient.enter_location_or_pincode")}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onBlur={applySearch}
            />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400">
              search
            </span>
            <input
              className="kk-form-search-input"
              placeholder={t("rent-equipment.RentEquipmentClient.search_tractors_harvesters")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button type="submit" className="kk-form-primary-button whitespace-nowrap">
            {t("rent-equipment.RentEquipmentClient.refresh_results")}
          </button>
        </form>

        {suggestionMsg ? (
          <div className="mx-auto max-w-7xl px-6 pb-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
              {suggestionMsg}
            </div>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary dark:text-amber-400">
              Find equipment
            </p>
            <h1 className="mt-3 text-3xl font-black text-primary dark:text-emerald-50 md:text-4xl">
              {t("rent-equipment.RentEquipmentClient.available_equipment")}
            </h1>
            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-on-surface-variant dark:text-slate-400">
              {t(
                "rent-equipment.RentEquipmentClient.browse_cached_listings_from_trusted_owners_results_revalidate_in_the_background_while_the_shell_stays_interactive"
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm font-semibold text-on-surface-variant shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40 dark:text-slate-300">
            {normalizedQuery || normalizedLocation ? (
              <span>
                Searching for{" "}
                <span className="font-black text-primary dark:text-emerald-50">
                  {normalizedQuery || "all equipment"}
                </span>
              </span>
            ) : (
              <span>Showing all available listings</span>
            )}
          </div>
        </div>

        <div className="mt-8">{children}</div>
      </section>
    </div>
  );
}
