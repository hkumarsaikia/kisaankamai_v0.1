import { Suspense } from "react";
import { IS_PAGES_BUILD } from "@/lib/runtime";
import RentEquipmentClient from "./RentEquipmentClient";
import RentEquipmentResults from "./RentEquipmentResults";

export default function RentEquipmentPage({
  searchParams,
}: {
  searchParams?: { location?: string; query?: string };
}) {
  const location = IS_PAGES_BUILD ? "" : searchParams?.location || "";
  const query = IS_PAGES_BUILD ? "" : searchParams?.query || "";

  return (
    <RentEquipmentClient initialLocation={location} initialQuery={query}>
      <Suspense fallback={<ResultsSkeleton />}>
        <RentEquipmentResults location={location} query={query} />
      </Suspense>
    </RentEquipmentClient>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40"
        >
          <div className="mb-5 h-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="mb-3 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mb-3 h-8 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mb-6 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}
