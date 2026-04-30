import RentEquipmentView from "./RentEquipmentView";
import { getRentEquipmentView } from "@/lib/discovery-routes";
import { getMergedCategorySummariesFromEquipment } from "@/lib/equipment-categories";
import { getEquipmentList } from "@/lib/server/equipment";

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
  terms.add(normalizedQuery.replace(/-/g, " "));

  if (normalizedQuery.endsWith("s") && normalizedQuery.length > 1) {
    terms.add(normalizedQuery.slice(0, -1));
  }

  for (const alias of QUERY_ALIASES[normalizedQuery] || []) {
    terms.add(alias);
  }

  return terms;
}

export default async function RentEquipmentPage({
  searchParams,
}: {
  searchParams?: Promise<{ location?: string; query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const location = resolvedSearchParams?.location || "";
  const query = resolvedSearchParams?.query || "";
  const items = await getEquipmentList();
  const categorySummaries = getMergedCategorySummariesFromEquipment(items);
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

  const requestedView = getRentEquipmentView({
    query,
    hasMatches: filteredItems.length > 0,
  });
  const view = items.length > 0 ? requestedView : "empty";

  const visibleItems = view === "available" ? items : filteredItems;

  return (
    <RentEquipmentView
      view={view}
      items={visibleItems}
      categorySummaries={categorySummaries}
      initialLocation={location}
      initialQuery={query}
    />
  );
}
