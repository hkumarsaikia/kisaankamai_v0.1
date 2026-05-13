"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { ContentImage } from "@/components/ContentImage";
import { EquipmentSortMenu, type EquipmentSortKey } from "@/components/equipment/EquipmentSortMenu";
import { useLanguage } from "@/components/LanguageContext";
import { LazyMap } from "@/components/LazyMap";
import { SharedIcon } from "@/components/SharedIcon";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import { DETAIL_ROUTE_TEMPLATE } from "@/lib/discovery-routes";
import { createHubCirclesFromEquipment, createListingMarkersFromEquipment } from "@/lib/map-data";
import { assetPath } from "@/lib/site";
import { normalizeCategorySlug, type EquipmentCategorySummary } from "@/lib/equipment-categories";
import { getLocalizedCategoryLabel, getLocalizedLocationParts } from "@/lib/localized-market-labels";
import {
  getEquipmentAvailability,
  getVisibleEquipmentRating,
  sortEquipmentByAvailabilityPriceDistance,
  type EquipmentRecord,
} from "@/lib/equipment";

type RentEquipmentViewMode = "available" | "query-category" | "empty";
type SortKey = EquipmentSortKey;

type LocalizedLabel = {
  en: string;
  mr: string;
};

const categoryIconBySlug: Record<string, string> = {
  tractor: "agriculture",
  tractors: "agriculture",
  harvester: "precision_manufacturing",
  harvesters: "precision_manufacturing",
  implement: "build",
  implements: "build",
  sprayer: "mist",
  sprayers: "mist",
  rotavator: "settings_input_component",
  rotavators: "settings_input_component",
  seeder: "psychiatry",
  seeders: "psychiatry",
  trolley: "local_shipping",
  trolleys: "local_shipping",
  thresher: "precision_manufacturing",
  threshers: "precision_manufacturing",
  pump: "water_drop",
  pumps: "water_drop",
  baler: "inventory",
  balers: "inventory",
};

function getCategoryIcon(summary: EquipmentCategorySummary) {
  return (
    categoryIconBySlug[summary.slug] ||
    categoryIconBySlug[summary.category] ||
    "agriculture"
  );
}

function formatCount(value: number, language: "en" | "mr") {
  return value.toLocaleString(language === "mr" ? "mr-IN" : "en-IN");
}

function formatMachinePower(value: string | number | undefined, language: "en" | "mr") {
  const rawValue = String(value || "").trim();

  if (!rawValue) {
    return "";
  }

  if (language === "en") {
    return rawValue;
  }

  return rawValue
    .replace(/\d+/g, (match) => Number(match).toLocaleString("mr-IN"))
    .replace(/\bHP\b/gi, "एचपी");
}

function buildSearchHref(location: string, query: string) {
  const params = new URLSearchParams();
  const normalizedLocation = location.trim();
  const normalizedQuery = query.trim();

  if (normalizedLocation) {
    params.set("location", normalizedLocation);
  }

  if (normalizedQuery) {
    params.set("query", normalizedQuery);
  }

  const search = params.toString();
  return search ? `/rent-equipment?${search}` : "/rent-equipment";
}

function SearchForm({
  location,
  query,
  onLocationChange,
  onQueryChange,
  buttonLabel,
  className = "",
}: {
  location: string;
  query: string;
  onLocationChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  buttonLabel?: LocalizedLabel;
  className?: string;
}) {
  const { langText } = useLanguage();
  const router = useSmoothRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.replace(buildSearchHref(location, query));
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="flex-1 w-full relative">
        <SharedIcon
          name="search"
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-outline"
        />
        <input
          className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface"
          placeholder={langText("Search equipment...", "उपकरणे शोधा...")}
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div className="flex-1 w-full relative">
        <SharedIcon
          name="location"
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-outline"
        />
        <input
          className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface"
          placeholder={langText("Location or pincode", "ठिकाण किंवा पिनकोड")}
          type="text"
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
        />
      </div>
      <button className="w-full rounded-lg bg-primary-container text-white dark:text-primary-fixed px-8 py-3 font-bold transition-opacity hover:opacity-90 md:w-auto" type="submit">
        {langText(buttonLabel?.en || "Search", buttonLabel?.mr || "शोधा")}
      </button>
    </form>
  );
}

function SortControl({
  sortBy,
  onSortChange,
  variant = "surface",
}: {
  sortBy: SortKey;
  onSortChange: (value: SortKey) => void;
  variant?: "surface" | "primary";
}) {
  return <EquipmentSortMenu sortBy={sortBy} onSortChange={onSortChange} variant={variant} />;
}

function AvailabilityDot({ item }: { item: EquipmentRecord }) {
  const { langText } = useLanguage();
  const availability = getEquipmentAvailability(item);
  const label = availability.available
    ? langText("Available", "उपलब्ध")
    : langText("Not available", "उपलब्ध नाही");

  return (
    <span
      className={`equipment-availability-dot absolute right-3 top-3 z-10 inline-flex h-4 w-4 rounded-full border-2 border-white shadow-lg ring-4 ${
        availability.available
          ? "bg-emerald-500 ring-emerald-500/20"
          : "bg-red-500 ring-red-500/20"
      }`}
      aria-label={label}
      role="img"
      title={label}
    />
  );
}

function NoEquipmentAvailable({
  location,
  query,
  onLocationChange,
  onQueryChange,
}: {
  location: string;
  query: string;
  onLocationChange: (value: string) => void;
  onQueryChange: (value: string) => void;
}) {
  const { langText } = useLanguage();

  return (
    <div className="flex min-h-[calc(100svh-5rem)] flex-col bg-surface pb-20 pt-[5.5rem] text-on-surface md:pb-24 md:pt-[5.5rem]">
      <div className="mx-auto mb-6 w-full max-w-4xl px-4 md:px-8">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-2 shadow-sm md:p-3">
          <SearchForm
            location={location}
            query={query}
            onLocationChange={onLocationChange}
            onQueryChange={onQueryChange}
            buttonLabel={{ en: "Update Search", mr: "शोध अपडेट करा" }}
            className="flex flex-col gap-3 md:flex-row"
          />
        </div>
      </div>

      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 pb-8 text-center md:px-8">
        <div className="pointer-events-none absolute -z-10 flex items-center justify-center opacity-5">
          <span className="material-symbols-outlined text-[260px] text-primary">agriculture</span>
        </div>
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-low shadow-sm">
          <span className="material-symbols-outlined text-4xl text-secondary">search_off</span>
        </div>
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-on-surface md:text-5xl">
          {langText("No equipment available right now", "सध्या कोणतीही उपकरणे उपलब्ध नाहीत")}
        </h1>
        <p className="mx-auto mb-7 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
          {langText(
            "We could not find exact matches for your search in the selected area. Inventory changes daily, and our support team can help locate what you need manually.",
            "निवडलेल्या भागात तुमच्या शोधाशी जुळणारी उपकरणे सापडली नाहीत. यादी दररोज बदलते आणि आमची सपोर्ट टीम तुम्हाला आवश्यक उपकरण शोधण्यात मदत करू शकते."
          )}
        </p>
        <Link
          href="/support"
          className="kk-flow-button inline-flex items-center gap-3 rounded-xl bg-primary-container px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-primary hover:shadow-lg"
        >
          <span className="material-symbols-outlined">support_agent</span>
          <span>{langText("Call Our Expert Support", "तज्ञ सपोर्टला कॉल करा")}</span>
        </Link>
      </section>
    </div>
  );
}

function EquipmentCard({ item, compact = false, priorityImage = false }: { item: EquipmentRecord; compact?: boolean; priorityImage?: boolean }) {
  const { language, langText, text } = useLanguage();
  const locationLabel = getLocalizedLocationParts([item.location, item.district, item.state], language);
  const visibleRating = getVisibleEquipmentRating(item);
  const rawCategoryLabel = item.categoryLabel.split("•")[0]?.trim() || item.category;
  const categoryLabel = getLocalizedCategoryLabel(item.category || rawCategoryLabel, language, rawCategoryLabel);
  const categoryBadge = getLocalizedCategoryLabel(item.category || rawCategoryLabel, language, rawCategoryLabel).toUpperCase();
  const powerLabel = formatMachinePower(item.hp, language);

  if (compact) {
    const imageClassName = compact ? "h-36 sm:h-40 md:h-44" : "";
    const bodyClassName = compact ? "p-4 md:p-5" : "";
    const titleClassName = compact ? "text-lg md:text-xl" : "";

    return (
      <article className="flex flex-col md:flex-row bg-surface rounded-2xl border border-surface-variant shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
        <div className={`equipment-card-media-frame w-full md:w-2/5 lg:w-[30%] relative ${imageClassName} bg-surface-container-lowest p-2.5 md:p-3`}>
          <AvailabilityDot item={item} />
          <ContentImage
            alt={item.name}
            className="h-full w-full rounded-xl object-cover object-center shadow-sm transition-transform duration-300 group-hover:scale-[1.015]"
            fetchPriority={priorityImage ? "high" : undefined}
            loading={priorityImage ? "eager" : "lazy"}
            priority={priorityImage}
            sizes="(max-width: 768px) calc(100vw - 3rem), 30vw"
            src={assetPath(item.coverImage)}
          />

        </div>
        <div className={`flex-1 ${bodyClassName} flex flex-col justify-between`}>
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-start gap-4">
              <div>

                <h3 className={`${titleClassName} font-bold text-on-background font-headline leading-tight`}>
                  {item.name}
                  <span className="block text-base font-medium text-on-surface-variant mt-0.5">{categoryLabel}</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-primary font-headline">₹{item.pricePerHour}</span>
                <span className="text-on-surface-variant text-sm block">
                  {langText("per hour", "प्रति तास")}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-on-surface-variant font-label mt-2">
              {visibleRating ? (
                <div className="equipment-rating-pill inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                  <span className="material-symbols-outlined text-[15px]">star</span>
                  {visibleRating.value.toFixed(1)}
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <SharedIcon name="location" className="h-[18px] w-[18px] text-outline" />
                <span>{locationLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">engineering</span>
                <span className="text-on-surface font-medium">
                  {item.operatorIncluded
                    ? langText("Operator included", "ऑपरेटर समाविष्ट")
                    : langText("Operator optional", "ऑपरेटर ऐच्छिक")}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-surface-container px-3 py-1 text-[11px] font-bold text-on-surface-variant">
                  {text(tag, { sourceLanguage: "en", cacheKey: `rent-tag-${item.id}-${tag}` })}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link
              href={DETAIL_ROUTE_TEMPLATE(item.id)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary"
            >
              {langText("View details", "तपशील पहा")}
              <SharedIcon name="arrow-right" className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group grid grid-cols-[5rem_minmax(0,1fr)] overflow-hidden rounded-xl border border-surface-variant bg-surface shadow-sm transition-shadow hover:shadow-md sm:flex sm:flex-col">
      <div className="relative m-2 h-24 w-16 self-start overflow-hidden rounded-lg bg-surface-container-high sm:m-0 sm:aspect-square sm:h-auto sm:w-full sm:self-auto sm:rounded-none">
        <AvailabilityDot item={item} />
        <ContentImage
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fetchPriority={priorityImage ? "high" : undefined}
          loading={priorityImage ? "eager" : "lazy"}
          priority={priorityImage}
          sizes="(max-width: 640px) 64px, (max-width: 1024px) 33vw, 25vw"
          src={assetPath(item.coverImage)}
        />
        <div className="absolute left-3 top-3 hidden rounded bg-surface-container-lowest/90 px-2 py-1 font-label text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-sm sm:block">
          {categoryBadge}
        </div>
        {visibleRating ? (
          <div className="equipment-rating-pill absolute bottom-3 left-3 hidden items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-black text-amber-700 shadow-sm backdrop-blur dark:bg-slate-950/85 dark:text-amber-200 sm:inline-flex">
            <span className="material-symbols-outlined text-[15px]">star</span>
            {visibleRating.value.toFixed(1)}
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col p-3 sm:flex-grow sm:p-4">
        <h3 className="mb-1 truncate font-headline text-base font-bold leading-tight text-on-surface transition-colors group-hover:text-primary sm:text-lg">{item.name}</h3>
        <p className="mb-2 font-label text-sm font-bold text-primary sm:mb-3 sm:text-base">
          ₹{item.pricePerHour}{" "}
          <span className="text-on-surface-variant text-sm font-normal">
            {langText("/ hour", "प्रति तास")}
          </span>
        </p>
        {visibleRating ? (
          <div className="equipment-rating-pill mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-black text-amber-700 dark:bg-amber-500/10 dark:text-amber-200 sm:hidden">
            <span className="material-symbols-outlined text-[14px]">star</span>
            {visibleRating.value.toFixed(1)}
          </div>
        ) : null}
        <div className="mt-auto mb-3 flex min-w-0 flex-col gap-1.5 sm:mb-4 sm:gap-2">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-body">
            <SharedIcon name="location" className="h-4 w-4 shrink-0" />
            <span className="truncate">{locationLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-body">
            <span className="material-symbols-outlined shrink-0 text-[16px]">build</span>
            <span className="truncate">{powerLabel}</span>
          </div>
        </div>
        <Link href={DETAIL_ROUTE_TEMPLATE(item.id)} className="w-full rounded-lg bg-primary-container px-3 py-2 text-center font-label text-sm font-bold text-white transition-colors hover:bg-primary-container/90 dark:text-primary-fixed sm:px-4 sm:py-2.5">
          {langText("View details", "तपशील पहा")}
        </Link>
      </div>
    </article>
  );
}

export default function RentEquipmentView({
  view,
  items,
  categorySummaries,
  initialLocation,
  initialQuery,
}: {
  view: RentEquipmentViewMode;
  items: EquipmentRecord[];
  categorySummaries: EquipmentCategorySummary[];
  initialLocation: string;
  initialQuery: string;
}) {
  const { language, langText } = useLanguage();
  const [location, setLocation] = useState(initialLocation);
  const [query, setQuery] = useState(initialQuery);
  const [availablePage, setAvailablePage] = useState(1);
  const [sortBy, setSortBy] = useState<SortKey>("availability");
  const activeCategorySlug = normalizeCategorySlug(initialQuery);
  const inventoryMarkers = useMemo(() => createListingMarkersFromEquipment(items), [items]);
  const inventoryCircles = useMemo(() => createHubCirclesFromEquipment(items), [items]);
  const availablePageSize = 8;
  const hasRequestedCategoryOrQuery = Boolean(initialQuery.trim());
  const sortedItems = useMemo(
    () => sortEquipmentByAvailabilityPriceDistance(items, sortBy),
    [items, sortBy]
  );
  const availableTotalPages = Math.max(1, Math.ceil(sortedItems.length / availablePageSize));
  const activeAvailablePage = Math.min(availablePage, availableTotalPages);
  const paginatedAvailableItems = sortedItems.slice(
    (activeAvailablePage - 1) * availablePageSize,
    activeAvailablePage * availablePageSize
  );
  const handleSortChange = (value: SortKey) => {
    setSortBy(value);
    setAvailablePage(1);
  };
  const title = useMemo(() => {
    if (view === "available") {
      return langText("Available equipment", "उपलब्ध उपकरणे");
    }

    if (view === "query-category") {
      return langText("Find equipment", "उपकरणे शोधा");
    }

    return langText("Search results", "शोध परिणाम");
  }, [langText, view]);

  const querySummary = useMemo(() => {
    if (location) {
      const localizedCount = formatCount(items.length, language);
      return langText(
        `Showing ${items.length} machines available in ${location}`,
        `${location} येथे ${localizedCount} मशिन्स उपलब्ध आहेत`
      );
    }

    const localizedCount = formatCount(items.length, language);
    return langText(
      `Showing ${items.length} machines available`,
      `${localizedCount} मशिन्स उपलब्ध आहेत`
    );
  }, [items.length, language, langText, location]);

  if (!items.length) {
    return (
      <NoEquipmentAvailable
        location={location}
        query={query}
        onLocationChange={setLocation}
        onQueryChange={setQuery}
      />
    );
  }

  if (view === "empty") {
    return (
      <div className="bg-surface text-on-surface pt-20 pb-8 md:pt-20 md:pb-10">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant">
            <SearchForm
              location={location}
              query={query}
              onLocationChange={setLocation}
              onQueryChange={setQuery}
              className="flex flex-col md:flex-row gap-4 items-center"
            />
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-6 mb-12">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-12 md:p-20 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
              <SharedIcon name="agriculture" className="h-16 w-16 text-primary opacity-35" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 font-headline">
              {hasRequestedCategoryOrQuery
                ? langText(
                    "Equipment does not exist for this category yet.",
                    "या वर्गवारीसाठी अजून उपकरण उपलब्ध नाही."
                  )
                : langText("No equipment matched this search.", "या शोधाशी जुळणारे कोणतेही उपकरण सापडले नाही.")}
            </h2>
            <p className="text-on-surface-variant max-w-lg mb-2 text-lg leading-relaxed">
              {langText(
                "Try another location, a nearby pincode, or a broader equipment term.",
                "दुसरे ठिकाण, जवळचा पिनकोड किंवा अधिक व्यापक उपकरण शब्द वापरून पहा."
              )}
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-primary-container text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 font-headline">
                {langText("Need help finding the right machine?", "योग्य मशिन शोधण्यासाठी मदत हवी आहे का?")}
              </h3>
              <p className="text-primary-fixed text-lg mb-8 leading-relaxed max-w-md">
                {langText(
                  "Share your requirement and our team will help you match with a nearby owner.",
                  "तुमची गरज सांगा आणि आमची टीम तुम्हाला जवळच्या मालकाशी जुळवून देईल."
                )}
              </p>
              <div className="space-y-2 mb-8">
                <p className="text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {langText(
                    "Get support to find the best machine for your work.",
                    "तुमच्या कामासाठी योग्य मशिन शोधण्यासाठी मदत मिळवा."
                  )}
                </p>
              </div>
            </div>
            <Link
              href="/support"
              className="relative z-10 w-fit rounded-xl bg-secondary-container px-8 py-4 text-sm font-black uppercase tracking-wider text-on-secondary-container transition-transform hover:translate-y-[-2px]"
            >
              {langText("Request callback", "कॉलबॅक मागवा")}
            </Link>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <SharedIcon name="support" className="h-[200px] w-[200px]" />
            </div>
          </div>

          {inventoryMarkers.length ? (
            <LazyMap
              center={[inventoryMarkers[0].lat, inventoryMarkers[0].lng]}
              zoom={11}
              markers={inventoryMarkers}
              circles={inventoryCircles}
              height="400px"
              className="rounded-2xl border border-outline-variant shadow-lg"
              showControls
              deferUntilVisible={false}
            />
          ) : (
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-lg">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">
                {langText("Map unavailable", "नकाशा उपलब्ध नाही")}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-primary">
                {langText("No mapped live listing locations yet", "अजून नकाशासाठी पुरेशी थेट ठिकाण माहिती उपलब्ध नाही")}
              </h3>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                {langText(
                  "We found live inventory, but the current listings do not include enough location detail to place them on the map.",
                  "थेट यादी उपलब्ध आहे, पण सध्याच्या नोंदींमध्ये नकाशावर दाखवण्यासाठी पुरेशी ठिकाण माहिती नाही."
                )}
              </p>
            </div>
          )}
        </section>

      </div>
    );
  }

  if (view === "query-category") {
    return (
      <div className="bg-background text-on-background antialiased min-h-screen flex flex-col pt-20 md:pt-20">
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-on-background font-headline tracking-tight">
              {title}
            </h1>
            <div className="bg-surface-container rounded-xl p-2 shadow-sm border border-surface-variant">
              <SearchForm
                location={location}
                query={query}
                onLocationChange={setLocation}
                onQueryChange={setQuery}
                className="flex flex-col md:flex-row items-center gap-2"
              />
            </div>
            <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {categorySummaries.map((category) => (
                <Link
                  key={category.slug}
                  href={`/rent-equipment?query=${category.slug}`}
                  className={`flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap border transition-colors ${
                    activeCategorySlug === category.slug
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-surface text-on-surface border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {getCategoryIcon(category)}
                  </span>
                  {getLocalizedCategoryLabel(category.slug || category.category, language, category.name)}
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[11px] font-bold text-on-surface-variant">
                    {formatCount(category.count, language)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-surface-variant pb-4 pt-2">
            <p className="text-on-surface font-medium text-base font-body">
              <span className="font-bold">{querySummary}</span>
              <span className="text-sm text-on-surface-variant block mt-0.5">
                {langText("Search results", "शोध परिणाम")}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-2 text-on-surface border border-outline-variant rounded-lg px-4 py-2 text-sm font-medium hover:bg-surface-container-low transition-colors bg-surface" type="button">
                <span className="material-symbols-outlined text-lg">tune</span>
                {langText("Filters", "फिल्टर्स")}
              </button>
              <SortControl sortBy={sortBy} onSortChange={handleSortChange} />
            </div>
          </div>

          <div className="flex flex-col gap-6 pb-12">
            {sortedItems.map((item, index) => (
              <EquipmentCard key={item.id} item={item} compact priorityImage={index === 0} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pt-20 text-on-background antialiased md:pt-20">
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 px-4 py-0 sm:px-6 lg:px-8">
        <div className="w-full rounded-b-xl bg-surface-container-lowest p-8 shadow-sm">
          <div className="mb-8 flex flex-col gap-6">
            <div className="available-search-panel rounded-xl border border-outline-variant bg-surface-container p-2 shadow-sm">
              <SearchForm
                location={location}
                query={query}
                onLocationChange={setLocation}
                onQueryChange={setQuery}
                className="flex flex-col gap-2 md:flex-row md:items-center"
              />
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="font-headline text-[32px] font-bold leading-tight tracking-tight text-on-surface">
                  {langText("Available equipment", "उपलब्ध उपकरणे")}
                </h1>
                <p className="hidden font-body text-base font-normal leading-normal text-on-surface-variant sm:block">
                  {langText(
                    "Browse high-quality agricultural machinery available for rent.",
                    "भाड्याने उपलब्ध असलेली उच्च-गुणवत्तेची कृषी यंत्रे पाहा."
                  )}
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-4">
                <button
                  className="flex items-center justify-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  {langText("Filters", "फिल्टर्स")}
                </button>
                <SortControl sortBy={sortBy} onSortChange={handleSortChange} variant="primary" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedAvailableItems.map((item, index) => (
              <EquipmentCard key={item.id} item={item} priorityImage={index === 0} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-outline-variant pt-6">
            <p className="text-sm font-medium text-on-surface-variant">
              {langText("Page", "पृष्ठ")} {activeAvailablePage} / {availableTotalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-surface text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
                disabled={activeAvailablePage <= 1}
                aria-label={langText("Previous page", "मागील पृष्ठ")}
                onClick={() => setAvailablePage((page) => Math.max(1, page - 1))}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-surface text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
                disabled={activeAvailablePage >= availableTotalPages}
                aria-label={langText("Next page", "पुढील पृष्ठ")}
                onClick={() => setAvailablePage((page) => Math.min(availableTotalPages, page + 1))}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
