"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { ContentImage } from "@/components/ContentImage";
import { useLanguage } from "@/components/LanguageContext";
import { LazyMap } from "@/components/LazyMap";
import { SharedIcon } from "@/components/SharedIcon";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import { DETAIL_ROUTE_TEMPLATE } from "@/lib/discovery-routes";
import { createHubCirclesFromEquipment, createListingMarkersFromEquipment } from "@/lib/map-data";
import { assetPath } from "@/lib/site";
import { normalizeCategorySlug, type EquipmentCategorySummary } from "@/lib/equipment-categories";
import type { EquipmentRecord } from "@/lib/equipment";

type RentEquipmentViewMode = "available" | "query-category" | "empty";

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
  baler: "inventory_2",
  balers: "inventory_2",
};

function getCategoryIcon(summary: EquipmentCategorySummary) {
  return (
    categoryIconBySlug[summary.slug] ||
    categoryIconBySlug[summary.category] ||
    "agriculture"
  );
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
      <button className="w-full md:w-auto bg-primary-container text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity" type="submit">
        {langText(buttonLabel?.en || "Search", buttonLabel?.mr || "शोधा")}
      </button>
    </form>
  );
}

function EquipmentCard({ item, compact = false }: { item: EquipmentRecord; compact?: boolean }) {
  const { langText, text } = useLanguage();
  const locationLabel = [item.location, item.district, item.state].filter(Boolean).join(", ");
  const categoryLabel = text(item.categoryLabel, {
    sourceLanguage: "en",
    cacheKey: `rent-category-${item.id}`,
  });

  if (compact) {
    return (
      <article className="flex flex-col md:flex-row bg-surface rounded-2xl border border-surface-variant shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
        <div className="w-full md:w-2/5 lg:w-1/3 relative h-64 md:h-auto bg-surface-container-lowest">
          <ContentImage
            alt={item.name}
            className="w-full h-full object-cover object-center"
            src={assetPath(item.coverImage)}
          />

        </div>
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-4">
              <div>

                <h3 className="text-xl md:text-2xl font-bold text-on-background font-headline leading-tight">
                  {item.name}
                  <span className="block text-base font-medium text-on-surface-variant mt-0.5">{categoryLabel}</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary font-headline">₹{item.pricePerHour}</span>
                <span className="text-on-surface-variant text-sm block">
                  {langText("per hour", "प्रति तास")}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-on-surface-variant font-label mt-2">
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
            <div className="flex flex-wrap gap-2 mt-3">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-surface-container px-3 py-1 text-[11px] font-bold text-on-surface-variant">
                  {text(tag, { sourceLanguage: "en", cacheKey: `rent-tag-${item.id}-${tag}` })}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
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
    <article className="flex flex-col bg-surface rounded-xl overflow-hidden border border-surface-variant hover:shadow-md transition-shadow group">
      <div className="relative w-full aspect-square bg-surface-container-high overflow-hidden">
        <ContentImage
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={assetPath(item.coverImage)}
        />
        <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary font-label uppercase tracking-wider">
          {text(item.category, { sourceLanguage: "en", cacheKey: `rent-badge-${item.id}` })}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-on-surface text-lg font-bold leading-tight font-headline mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
        <p className="text-primary font-bold text-base mb-3 font-label">
          ₹{item.pricePerHour}{" "}
          <span className="text-on-surface-variant text-sm font-normal">
            {langText("/ hour", "/ तास")}
          </span>
        </p>
        <div className="flex flex-col gap-2 mt-auto mb-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-body">
            <SharedIcon name="location" className="h-4 w-4" />
            <span>{locationLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-body">
            <span className="material-symbols-outlined text-[16px]">build</span>
            <span>{item.hp}</span>
          </div>
        </div>
        <Link href={DETAIL_ROUTE_TEMPLATE(item.id)} className="w-full py-2.5 px-4 bg-primary-container text-on-primary-container rounded-lg font-label font-bold text-sm hover:bg-primary-container/90 transition-colors text-center">
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
  const { langText } = useLanguage();
  const [location, setLocation] = useState(initialLocation);
  const [query, setQuery] = useState(initialQuery);
  const [availablePage, setAvailablePage] = useState(1);
  const activeCategorySlug = normalizeCategorySlug(initialQuery);
  const inventoryMarkers = useMemo(() => createListingMarkersFromEquipment(items), [items]);
  const inventoryCircles = useMemo(() => createHubCirclesFromEquipment(items), [items]);
  const availablePageSize = 8;
  const hasRequestedCategoryOrQuery = Boolean(initialQuery.trim());
  const availableTotalPages = Math.max(1, Math.ceil(items.length / availablePageSize));
  const activeAvailablePage = Math.min(availablePage, availableTotalPages);
  const paginatedAvailableItems = items.slice(
    (activeAvailablePage - 1) * availablePageSize,
    activeAvailablePage * availablePageSize
  );
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
      return langText(
        `Showing ${items.length} machines available in ${location}`,
        `${location} येथे ${items.length} मशिन्स उपलब्ध आहेत`
      );
    }

    return langText(
      `Showing ${items.length} machines available`,
      `${items.length} मशिन्स उपलब्ध आहेत`
    );
  }, [items.length, langText, location]);

  if (!items.length) {
    return (
      <div className="bg-surface text-on-surface pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 mb-8">
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
              <SharedIcon name="agriculture" className="h-16 w-16 text-on-primary-container opacity-20" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary-container mb-4 font-headline">
              {hasRequestedCategoryOrQuery
                ? langText(
                    "Equipment does not exist for this category yet.",
                    "या वर्गवारीसाठी अजून उपकरण उपलब्ध नाही."
                  )
                : langText(
                    "No live equipment listings are available right now.",
                    "सध्या कोणतीही थेट उपकरण यादी उपलब्ध नाही."
                  )}
            </h2>
            <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed">
              {hasRequestedCategoryOrQuery
                ? langText(
                    "When owners publish complete live listings in this category, they will appear here automatically.",
                    "मालकांनी या वर्गवारीतील पूर्ण थेट यादी प्रकाशित केली की ती येथे आपोआप दिसेल."
                  )
                : langText(
                    "Public results stay empty until owners publish complete live listings with images and location details.",
                    "मालकांनी फोटो आणि ठिकाणाच्या तपशीलांसह पूर्ण थेट यादी प्रकाशित करेपर्यंत सार्वजनिक निकाल रिकामे राहतील."
                  )}
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (view === "empty") {
    return (
      <div className="bg-surface text-on-surface pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 mb-8">
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
              <SharedIcon name="agriculture" className="h-16 w-16 text-on-primary-container opacity-20" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary-container mb-4 font-headline">
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
              <p className="text-on-primary-container text-lg mb-8 leading-relaxed max-w-md">
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
              <h3 className="mt-3 text-2xl font-bold text-primary-container">
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
      <div className="bg-background text-on-background antialiased min-h-screen flex flex-col pt-24">
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
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
                  {category.name}
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[11px] font-bold text-on-surface-variant">
                    {category.count}
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
            <button className="flex items-center gap-2 text-on-surface border border-outline-variant rounded-lg px-4 py-2 text-sm font-medium hover:bg-surface-container-low transition-colors bg-surface" type="button">
              <span className="material-symbols-outlined text-lg">tune</span>
              {langText("Filters", "फिल्टर्स")}
            </button>
          </div>

          <div className="flex flex-col gap-6 pb-12">
            {items.map((item) => (
              <EquipmentCard key={item.id} item={item} compact />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pt-24 text-on-background antialiased">
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full rounded-b-xl bg-surface-container-lowest p-8 shadow-sm">
          <div className="mb-8 flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="font-headline text-[32px] font-bold leading-tight tracking-tight text-on-surface">
                  {langText("Available equipment", "उपलब्ध उपकरणे")}
                </h1>
                <p className="font-body text-base font-normal leading-normal text-on-surface-variant">
                  {langText(
                    "Browse high-quality agricultural machinery available for rent.",
                    "भाड्याने उपलब्ध असलेली उच्च-गुणवत्तेची कृषी यंत्रे पाहा."
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  className="flex items-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  {langText("Filters", "फिल्टर्स")}
                </button>
                <button
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary/90"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">sort</span>
                  {langText("Sort", "क्रम लावा")}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedAvailableItems.map((item) => (
              <EquipmentCard key={item.id} item={item} />
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
