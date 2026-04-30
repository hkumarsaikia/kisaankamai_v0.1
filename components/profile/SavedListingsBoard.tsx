"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { toggleSavedListingAction } from "@/lib/actions/local-data";
import type { ListingRecord } from "@/lib/local-data/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type SavedListingsBoardProps = {
  listings: ListingRecord[];
};

export function SavedListingsBoard({ listings }: SavedListingsBoardProps) {
  const { langText } = useLanguage();
  const router = useRouter();
  const [buttonState, setButtonState] = useState<
    Record<string, "idle" | "pending" | "success" | "error">
  >({});
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleToggle = (listingId: string) => {
    setError("");
    setButtonState((current) => ({ ...current, [listingId]: "pending" }));

    startTransition(async () => {
      const result = await toggleSavedListingAction(listingId);
      if (!result.ok) {
        setButtonState((current) => ({ ...current, [listingId]: "error" }));
        setError(result.error || langText("Could not update saved equipment.", "जतन केलेली उपकरणे अपडेट करता आली नाहीत."));
        return;
      }

      setButtonState((current) => ({ ...current, [listingId]: "success" }));
      window.setTimeout(() => router.refresh(), 500);
    });
  };

  const handleClearAll = () => {
    if (!listings.length) {
      return;
    }

    setError("");
    startTransition(async () => {
      for (const listing of listings) {
        const result = await toggleSavedListingAction(listing.id);
        if (!result.ok) {
          setError(result.error || langText("Could not clear saved equipment.", "जतन केलेली उपकरणे साफ करता आली नाहीत."));
          return;
        }
      }

      window.setTimeout(() => router.refresh(), 500);
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-primary">{langText("Saved Equipment", "जतन केलेली उपकरणे")}</h2>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
            {langText(
              "Review the machines you shortlisted and open their real equipment detail pages.",
              "तुम्ही जतन केलेली उपकरणे तपासा आणि त्यांची अचूक तपशील पाने उघडा."
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          disabled={isPending || !listings.length}
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-on-surface disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {isPending ? langText("Updating...", "अपडेट करत आहे...") : langText("Clear Saved", "जतन केलेले साफ करा")}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
          {error}
        </div>
      ) : null}

      {listings.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((item) => {
            const state = buttonState[item.id] || "idle";
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative h-56">
                  <img
                    src={item.coverImage || item.galleryImages[0]}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    disabled={isPending}
                    className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${
                      state === "success" ? "bg-emerald-600 text-white" : "bg-white/90 text-primary-container"
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {state === "success" ? "check" : "bookmark"}
                    </span>
                  </button>
                  <div className="absolute right-4 top-4 rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-white">
                    {item.status === "active"
                      ? langText("Ready to Book", "बुकिंगसाठी तयार")
                      : langText("Paused", "थांबवलेले")}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface dark:text-slate-100">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">
                        {item.categoryLabel}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-on-surface dark:bg-slate-950 dark:text-slate-100">
                      {item.rating.toFixed(1)}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-on-surface-variant dark:text-slate-400">
                    {item.location}, {item.district} ({item.distanceKm} km {langText("away", "दूर")})
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-lg font-extrabold text-primary-container dark:text-emerald-200">
                      ₹{item.pricePerHour.toLocaleString("en-IN")} / {item.unitLabel}
                    </p>
                    <Link
                      href={`/renter-profile/equipment/${item.id}`}
                      className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white"
                    >
                      {langText("Details", "तपशील")}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-dashed border-outline-variant bg-surface-container-low p-8 text-center dark:border-slate-700 dark:bg-slate-950/60">
          <h3 className="text-2xl font-black text-primary">{langText("No saved equipment yet", "अजून उपकरणे जतन केलेली नाहीत")}</h3>
          <p className="mt-3 text-sm text-on-surface-variant">
            {langText(
              "Browse equipment and save machines you want to review later.",
              "उपकरणे शोधा आणि नंतर तपासायची उपकरणे जतन करा."
            )}
          </p>
          <Link
            href="/renter-profile/browse"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            {langText("Browse Equipment", "उपकरणे शोधा")}
          </Link>
        </section>
      )}
    </div>
  );
}
