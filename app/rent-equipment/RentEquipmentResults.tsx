import { AppLink as Link } from "@/components/AppLink";
import { ContentImage } from "@/components/ContentImage";
import { LazyMap } from "@/components/LazyMap";
import { createHubCirclesFromEquipment, createListingMarkersFromEquipment } from "@/lib/map-data";
import { getEquipmentList } from "@/lib/server/equipment";
import { assetPath } from "@/lib/site";
import { getEquipmentAvailability, getVisibleEquipmentRating } from "@/lib/equipment";

const QUERY_ALIASES: Record<string, string[]> = {
  tractor: ["tractor"],
  tractors: ["tractor"],
  harvester: ["harvester"],
  harvesters: ["harvester"],
  implement: ["implement", "rotavator", "seed drill"],
  implements: ["implement", "rotavator", "seed drill"],
  plough: ["plough", "plow"],
  ploughs: ["plough", "plow"],
  sprayer: ["sprayer"],
  sprayers: ["sprayer"],
  seeder: ["seeder", "seed drill"],
  seeders: ["seeder", "seed drill"],
  trolley: ["trolley"],
  trolleys: ["trolley"],
};

function matchesLocation(candidate: string, location: string) {
  if (!location) {
    return true;
  }

  const normalizedCandidate = candidate.toLowerCase();
  const normalizedLocation = location.toLowerCase();

  if (normalizedLocation === "423501") {
    return normalizedCandidate.includes("kalwan");
  }

  if (normalizedLocation === "431715") {
    return normalizedCandidate.includes("mukhed");
  }

  return normalizedCandidate.includes(normalizedLocation);
}

function matchesEquipmentLocation(
  item: Awaited<ReturnType<typeof getEquipmentList>>[number],
  location: string
) {
  const searchableLocation = [item.location, item.district, item.state].filter(Boolean).join(" ");
  return matchesLocation(searchableLocation, location);
}

function expandQueryTerms(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const terms = new Set<string>();

  if (!normalizedQuery) {
    return terms;
  }

  terms.add(normalizedQuery);

  if (normalizedQuery.endsWith("s") && normalizedQuery.length > 1) {
    terms.add(normalizedQuery.slice(0, -1));
  }

  for (const alias of QUERY_ALIASES[normalizedQuery] || []) {
    terms.add(alias);
  }

  return terms;
}

function ResultCard({
  item,
}: {
  item: Awaited<ReturnType<typeof getEquipmentList>>[number];
}) {
  const visibleRating = getVisibleEquipmentRating(item);
  const availability = getEquipmentAvailability(item);

  return (
    <article className="group overflow-hidden rounded-2xl border border-surface-variant bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/50 dark:bg-slate-900/40">
      <div className="relative aspect-square overflow-hidden bg-surface-container-high dark:bg-slate-900/60">
        <ContentImage
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={item.name}
          src={assetPath(item.coverImage)}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-secondary shadow-sm dark:bg-slate-950/85 dark:text-emerald-300">
          {item.categoryLabel}
        </div>
        <span
          className={`equipment-availability-dot absolute right-3 top-3 z-10 inline-flex h-4 w-4 rounded-full border-2 border-white shadow-lg ring-4 ${
            availability.available
              ? "bg-emerald-500 ring-emerald-500/20"
              : "bg-red-500 ring-red-500/20"
          }`}
          aria-label={availability.available ? "Available" : "Not available"}
          role="img"
          title={availability.available ? "Available" : "Not available"}
        />
        {visibleRating ? (
          <div className="equipment-rating-pill absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-primary shadow-sm dark:bg-slate-950/85 dark:text-white">
            <span className="material-symbols-outlined text-[15px] text-amber-500">star</span>
            {visibleRating.value.toFixed(1)}
          </div>
        ) : null}
      </div>

      <div className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-primary transition-colors group-hover:text-secondary dark:text-emerald-50">
              {item.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-on-surface-variant dark:text-slate-400">
              {item.location}, {item.district}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300">₹{item.pricePerHour}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline dark:text-slate-500">
              {item.unitLabel}
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-container-highest px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant dark:bg-slate-900/70 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400">
          <span>{item.hp}</span>
          <span>{item.distanceKm} km away</span>
          <span>{item.ownerVerified ? "Verified" : "Pending"}</span>
        </div>

        <Link
          href={`/equipment/${item.id}`}
          className="mt-auto block rounded-xl bg-primary-container px-5 py-3 text-center text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-primary dark:bg-emerald-700 dark:hover:bg-emerald-600"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

function EmptyState({
  inventoryItems,
}: {
  inventoryItems: Awaited<ReturnType<typeof getEquipmentList>>;
}) {
  const inventoryMarkers = createListingMarkersFromEquipment(inventoryItems);
  const inventoryCircles = createHubCirclesFromEquipment(inventoryItems);

  return (
    <section className="space-y-12">
      <div className="mx-auto max-w-4xl rounded-3xl border border-outline-variant bg-white p-8 text-center shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40 md:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-low text-primary-container dark:bg-slate-900/60 dark:text-emerald-300">
          <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            agriculture
          </span>
        </div>
        <h2 className="mt-6 text-2xl font-extrabold text-primary-container dark:text-emerald-50 md:text-3xl">
          No equipment matched this search.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-on-surface-variant dark:text-slate-400 md:text-lg">
          Try another location, a nearby pincode, or a broader equipment term.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-primary-container p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-secondary-container">
              Need help finding the right machine?
            </p>
            <h3 className="mt-4 text-3xl font-bold leading-tight">
              Share your requirement and our team will help you match with a nearby owner.
            </h3>
            <div className="mt-8 space-y-4">
              {[
                "Mechanical inspection and support before you book.",
                "Transparent pricing with verified owners.",
                "Local help for delivery and coordination.",
              ].map((line) => (
                <div key={line} className="flex gap-3 text-sm font-medium text-white/90">
                  <span className="material-symbols-outlined text-secondary-container">check_circle</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-secondary-container px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-on-secondary-container transition-transform hover:-translate-y-0.5"
            >
              Request Callback
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {inventoryMarkers.length ? (
          <LazyMap
            center={[inventoryMarkers[0].lat, inventoryMarkers[0].lng]}
            zoom={11}
            markers={inventoryMarkers}
            circles={inventoryCircles}
            height="400px"
            className="rounded-3xl border border-outline-variant shadow-lg dark:border-slate-800/50"
            showControls
          />
        ) : (
          <div className="rounded-3xl border border-outline-variant bg-white p-8 shadow-lg dark:border-slate-800/50 dark:bg-slate-900/40">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Map unavailable</p>
            <h3 className="mt-3 text-2xl font-black text-primary dark:text-emerald-50">No mapped live listing regions yet</h3>
            <p className="mt-3 text-sm font-medium leading-6 text-on-surface-variant dark:text-slate-400">
              Live listings are available, but the current records do not include enough location detail to place them on the public map.
            </p>
          </div>
        )}
      </div>

    </section>
  );
}

export default async function RentEquipmentResults({
  location,
  query,
}: {
  location: string;
  query: string;
}) {
  const items = await getEquipmentList();
  const normalizedQuery = query.trim().toLowerCase();
  const queryTerms = expandQueryTerms(query);

  const filteredItems = items.filter((item) => {
    const searchableText = [
      item.name,
      item.categoryLabel,
      item.category,
      item.location,
      item.district,
      ...item.tags,
      ...item.workTypes,
    ]
      .join(" ")
      .toLowerCase();

    const queryMatch =
      !normalizedQuery ||
      Array.from(queryTerms).some((term) => searchableText.includes(term));

    return queryMatch && matchesEquipmentLocation(item, location);
  });

  if (!filteredItems.length) {
    return <EmptyState inventoryItems={items} />;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-secondary dark:text-amber-400">
            Available results
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-primary dark:text-emerald-50">
            {filteredItems.length} machine{filteredItems.length === 1 ? "" : "s"} available
          </h2>
        </div>
        <p className="text-sm font-medium text-on-surface-variant dark:text-slate-400">
          Filtered by current inventory and your search terms.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <ResultCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
