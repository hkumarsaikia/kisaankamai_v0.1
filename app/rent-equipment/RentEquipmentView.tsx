"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { ContentImage } from "@/components/ContentImage";
import { LazyMap } from "@/components/LazyMap";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import { DETAIL_ROUTE_TEMPLATE } from "@/lib/discovery-routes";
import { RENT_RESULTS_CIRCLES, RENT_RESULTS_MARKERS } from "@/lib/map-data";
import type { EquipmentRecord } from "@/lib/equipment";

type RentEquipmentViewMode = "available" | "query-category" | "empty";

const categoryChips = [
  { label: "Tractors", value: "tractors", icon: "agriculture" },
  { label: "Harvesters", value: "harvesters", icon: "agriculture" },
  { label: "Sprayers", value: "sprayers", icon: "mist" },
  { label: "Rotavators", value: "rotavators", icon: "settings_input_component" },
  { label: "Implements", value: "implements", icon: "build" },
] as const;

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
  buttonLabel = "Search",
  className = "",
}: {
  location: string;
  query: string;
  onLocationChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  buttonLabel?: string;
  className?: string;
}) {
  const router = useSmoothRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.replace(buildSearchHref(location, query));
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="flex-1 w-full relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input
          className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface"
          placeholder="Search equipment..."
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div className="flex-1 w-full relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">location_on</span>
        <input
          className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface"
          placeholder="Location"
          type="text"
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
        />
      </div>
      <button className="w-full md:w-auto bg-primary-container text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity" type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}

function EquipmentCard({ item, compact = false }: { item: EquipmentRecord; compact?: boolean }) {
  if (compact) {
    return (
      <article className="flex flex-col md:flex-row bg-surface rounded-2xl border border-surface-variant shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
        <div className="w-full md:w-2/5 lg:w-1/3 relative h-64 md:h-auto bg-surface-container-lowest">
          <ContentImage alt={item.name} className="w-full h-full object-cover object-center" src={item.coverImage} />

        </div>
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-4">
              <div>

                <h3 className="text-xl md:text-2xl font-bold text-on-background font-headline leading-tight">
                  {item.name}
                  <span className="block text-base font-medium text-on-surface-variant mt-0.5">{item.categoryLabel}</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary font-headline">₹{item.pricePerHour}</span>
                <span className="text-on-surface-variant text-sm block">per hour</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-on-surface-variant font-label mt-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">location_on</span>
                <span>{item.location}, {item.district}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">engineering</span>
                <span className="text-on-surface font-medium">{item.operatorIncluded ? "Operator Included" : "Operator Optional"}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-surface-container px-3 py-1 text-[11px] font-bold text-on-surface-variant">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href={DETAIL_ROUTE_TEMPLATE(item.id)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary"
            >
              View Details
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col bg-surface rounded-xl overflow-hidden border border-surface-variant hover:shadow-md transition-shadow group">
      <div className="relative w-full aspect-square bg-surface-container-high overflow-hidden">
        <ContentImage alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={item.coverImage} />
        <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary font-label uppercase tracking-wider">
          {item.category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-on-surface text-lg font-bold leading-tight font-headline mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
        <p className="text-primary font-bold text-base mb-3 font-label">₹{item.pricePerHour} <span className="text-on-surface-variant text-sm font-normal">/ hour</span></p>
        <div className="flex flex-col gap-2 mt-auto mb-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-body">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span>{item.district}, Maharashtra</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-body">
            <span className="material-symbols-outlined text-[16px]">build</span>
            <span>{item.hp}</span>
          </div>
        </div>
        <Link href={DETAIL_ROUTE_TEMPLATE(item.id)} className="w-full py-2.5 px-4 bg-primary-container text-on-primary-container rounded-lg font-label font-bold text-sm hover:bg-primary-container/90 transition-colors text-center">
          View Details
        </Link>
      </div>
    </article>
  );
}

export default function RentEquipmentView({
  view,
  items,
  initialLocation,
  initialQuery,
}: {
  view: RentEquipmentViewMode;
  items: EquipmentRecord[];
  initialLocation: string;
  initialQuery: string;
}) {
  const [location, setLocation] = useState(initialLocation);
  const [query, setQuery] = useState(initialQuery);
  const title = useMemo(() => {
    if (view === "available") {
      return "Available Equipment";
    }

    if (view === "query-category") {
      return "Find Equipment";
    }

    return "Search Results";
  }, [view]);

  if (view === "empty") {
    return (
      <div className="bg-surface text-on-surface pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant">
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
          <div className="bg-white rounded-2xl border border-outline-variant p-12 md:p-20 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-6xl text-on-primary-container opacity-20">agriculture</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary-container mb-4 font-headline">No equipment matched this search.</h2>
            <p className="text-on-surface-variant max-w-lg mb-2 text-lg leading-relaxed">
              Try another location, a nearby pincode, or a broader equipment term.
            </p>
            <p className="text-on-surface-variant/80 text-sm italic font-medium">
              या शोधाशी जुळणारे कोणतेही उपकरण सापडले नाही. कृपया दुसरे ठिकाण किंवा जवळचा पिनकोड वापरून पहा.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-primary-container text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 font-headline">Need help finding the right machine?</h3>
              <p className="text-on-primary-container text-lg mb-8 leading-relaxed max-w-md">
                Share your requirement and our team will help you match with a nearby owner.
              </p>
              <div className="space-y-2 mb-8">
                <p className="text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  तुम्हाला हवी असलेली मशिन शोधण्यात मदत हवी आहे का?
                </p>
              </div>
            </div>
            <Link
              href="/support"
              className="relative z-10 w-fit rounded-xl bg-secondary-container px-8 py-4 text-sm font-black uppercase tracking-wider text-on-secondary-container transition-transform hover:translate-y-[-2px]"
            >
              Request Callback
            </Link>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]">support_agent</span>
            </div>
          </div>

          <LazyMap
            center={[16.855, 74.56]}
            zoom={11}
            markers={RENT_RESULTS_MARKERS}
            circles={RENT_RESULTS_CIRCLES}
            height="400px"
            className="rounded-2xl border border-outline-variant shadow-lg"
            showControls
            deferUntilVisible={false}
          />
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
              <span className="block text-lg font-medium text-on-surface-variant mt-1">उपकरणे शोधा</span>
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
              {categoryChips.map((chip) => (
                <Link
                  key={chip.value}
                  href={`/rent-equipment?query=${chip.value}`}
                  className={`flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap border transition-colors ${
                    query.trim().toLowerCase() === chip.value
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-surface text-on-surface border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{chip.icon}</span>
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-surface-variant pb-4 pt-2">
            <p className="text-on-surface font-medium text-base font-body">
              Showing <span className="font-bold">{items.length}</span> machines available{location ? ` in ${location}` : ""}
              <span className="text-sm text-on-surface-variant block mt-0.5">शोध परिणाम</span>
            </p>
            <button className="flex items-center gap-2 text-on-surface border border-outline-variant rounded-lg px-4 py-2 text-sm font-medium hover:bg-surface-container-low transition-colors bg-surface" type="button">
              <span className="material-symbols-outlined text-lg">tune</span>
              Filters
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
                <h1 className="font-headline text-[32px] font-bold leading-tight tracking-tight text-on-surface">Available Equipment</h1>
                <p className="font-body text-base font-normal leading-normal text-on-surface-variant">
                  Browse high-quality agricultural machinery available for rent.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  className="flex items-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  Filters
                </button>
                <button
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary/90"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">sort</span>
                  Sort
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>


        </div>
      </main>
    </div>
  );
}
