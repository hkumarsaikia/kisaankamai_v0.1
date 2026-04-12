import Link from "next/link";
import { getEquipmentList } from "@/lib/server/equipment";
import { assetPath } from "@/lib/site";

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

export default async function RentEquipmentResults({
  location,
  query,
}: {
  location: string;
  query: string;
}) {
  const items = await getEquipmentList();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const queryMatch =
      !normalizedQuery ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.categoryLabel.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery);

    return queryMatch && matchesLocation(item.location, location);
  });

  if (!filteredItems.length) {
    return (
      <div className="rounded-3xl border border-dashed border-outline-variant/40 bg-white/70 p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
        <h2 className="text-2xl font-black text-primary dark:text-emerald-50">No equipment matched this search.</h2>
        <p className="mt-3 font-medium text-on-surface-variant dark:text-slate-400">
          Try another location, a nearby pincode, or a broader equipment term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="group overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/50 dark:bg-slate-900/40"
        >
          <div className="relative h-56 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt={item.name}
              src={assetPath(item.coverImage)}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1 shadow-sm dark:bg-slate-950/80">
              <span className="text-xs font-black uppercase tracking-widest text-secondary dark:text-amber-400">
                {item.categoryLabel}
              </span>
            </div>
            <div className="absolute right-4 top-4 rounded-lg bg-white/90 px-3 py-1 text-xs font-bold shadow-sm dark:bg-slate-950/80 dark:text-white">
              {item.rating.toFixed(1)}
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-primary dark:text-emerald-50">{item.name}</h3>
                <p className="mt-1 text-sm font-medium text-on-surface-variant dark:text-slate-400">
                  {item.location}, {item.district}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300">₹{item.pricePerHour}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline dark:text-slate-500">
                  {item.unitLabel}
                </p>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-container-highest px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:bg-slate-900/70 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-5 flex items-center justify-between text-sm font-semibold text-on-surface-variant dark:text-slate-400">
              <span>{item.hp}</span>
              <span>{item.distanceKm} km away</span>
              <span>{item.ownerVerified ? "Verified" : "Pending"}</span>
            </div>

            <Link
              href={`/equipment/${item.id}`}
              className="block w-full rounded-xl bg-primary-container px-5 py-3 text-center text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-primary dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              View Equipment
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
