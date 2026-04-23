import type { EquipmentRecord } from "@/lib/equipment";

export interface SiteMapMarker {
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  color?: string;
}

export interface SiteMapCircle {
  lat: number;
  lng: number;
  radius: number;
  color?: string;
}

export interface RegionalHub {
  slug: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  center: [number, number];
  color: string;
  markerColor: string;
  address: string;
  description: string;
  equipmentSummary: string;
  clusters: string[];
}

export const REGIONAL_HUBS: RegionalHub[] = [
  {
    slug: "sangli",
    name: "Sangli Hub",
    district: "Sangli",
    state: "Maharashtra",
    lat: 16.8547,
    lng: 74.5643,
    center: [16.8547, 74.5643],
    color: "#00251a",
    markerColor: "#00251a",
    address: "Market Yard Road, Sangli 416416",
    description: "Primary farm equipment operations hub with tractor, rotavator, and operator support for the wider Sangli belt.",
    equipmentSummary: "24 active tractors and local operator support",
    clusters: ["Miraj Cluster", "Tasgaon Hub", "Walwa Region"],
  },
  {
    slug: "satara",
    name: "Satara Hub",
    district: "Satara",
    state: "Maharashtra",
    lat: 17.6805,
    lng: 74.0183,
    center: [17.6805, 74.0183],
    color: "#934a24",
    markerColor: "#934a24",
    address: "Bombay Restaurant Chowk, Satara 415001",
    description: "Regional coordination hub for planting and harvesting support, covering Satara, Karad, Wai, and nearby clusters.",
    equipmentSummary: "12 active harvesters and planting support",
    clusters: ["Karad Cluster", "Phaltan Hub", "Wai Region"],
  },
  {
    slug: "kolhapur",
    name: "Kolhapur Hub",
    district: "Kolhapur",
    state: "Maharashtra",
    lat: 16.705,
    lng: 74.2433,
    center: [16.705, 74.2433],
    color: "#693c00",
    markerColor: "#693c00",
    address: "Shiroli Pulachi, Kolhapur 416122",
    description: "Kolhapur sugarcane belt service hub focused on loaders, rotavators, and seasonal machine availability.",
    equipmentSummary: "8 sugarcane loaders and rotavator coverage",
    clusters: ["Hatkanangale Hub", "Shirol Cluster", "Panhala Region"],
  },
  {
    slug: "kalwan",
    name: "Kalwan Area Hub",
    district: "Nashik Region",
    state: "Maharashtra",
    lat: 20.48,
    lng: 73.8,
    center: [20.48, 73.8],
    color: "#934a24",
    markerColor: "#934a24",
    address: "Kalwan, Nashik Region 423501",
    description: "Expansion-focused service hub covering early demand from Kalwan, Dindori, and adjoining Nashik-region villages.",
    equipmentSummary: "Active regional expansion hub",
    clusters: ["Kalwan", "Dindori Corridor", "Peth Reach"],
  },
  {
    slug: "mukhed",
    name: "Mukhed Area Hub",
    district: "Nanded Region",
    state: "Maharashtra",
    lat: 18.77,
    lng: 77.36,
    center: [18.77, 77.36],
    color: "#00251a",
    markerColor: "#00251a",
    address: "Mukhed, Nanded Region 431715",
    description: "Emerging expansion headquarters for Mukhed and nearby Nanded-region corridors where new renter demand is being validated.",
    equipmentSummary: "Primary expansion headquarters for the region",
    clusters: ["Mukhed", "Deglur Reach", "Loha Corridor"],
  },
];

export const HOMEPAGE_MARKERS: SiteMapMarker[] = REGIONAL_HUBS.filter((hub) =>
  ["kalwan", "mukhed"].includes(hub.slug)
).map((hub) => ({
  lat: hub.center[0],
  lng: hub.center[1],
  label: hub.name,
  sublabel: hub.equipmentSummary,
  color: hub.markerColor,
}));

export const SUPPORT_HUB_MARKERS: SiteMapMarker[] = REGIONAL_HUBS.filter((hub) =>
  ["kalwan", "mukhed"].includes(hub.slug)
).map((hub) => ({
  lat: hub.center[0],
  lng: hub.center[1],
  label: hub.name,
  sublabel: hub.address,
  color: hub.markerColor,
}));

export const RENT_RESULTS_MARKERS: SiteMapMarker[] = [];

export const RENT_RESULTS_CIRCLES: SiteMapCircle[] = [];

export const LOCATIONS_OVERVIEW_MARKERS: SiteMapMarker[] = REGIONAL_HUBS.map((hub) => ({
  lat: hub.center[0],
  lng: hub.center[1],
  label: hub.name,
  sublabel: hub.equipmentSummary,
  color: hub.markerColor,
}));

export const LOCATIONS_OVERVIEW_CIRCLES: SiteMapCircle[] = REGIONAL_HUBS.map((hub) => ({
  lat: hub.center[0],
  lng: hub.center[1],
  radius: hub.slug === "sangli" || hub.slug === "satara" || hub.slug === "kolhapur" ? 22000 : 18000,
  color: hub.markerColor,
}));

export function getRegionalHubBySlug(slug: string) {
  return REGIONAL_HUBS.find((hub) => hub.slug === slug);
}

function normalizeLocationValue(value?: string) {
  return value?.trim().toLowerCase() || "";
}

function findHubForListingLocation(location: string, district?: string) {
  const normalizedLocation = normalizeLocationValue(location);
  const normalizedDistrict = normalizeLocationValue(district);

  if (!normalizedLocation && !normalizedDistrict) {
    return null;
  }

  return (
    REGIONAL_HUBS.find((hub) =>
      [
        hub.slug,
        hub.name,
        hub.district,
        ...hub.clusters,
      ].some((entry) => {
        const candidate = normalizeLocationValue(entry);
        return (
          Boolean(candidate) &&
          ((normalizedLocation && (normalizedLocation.includes(candidate) || candidate.includes(normalizedLocation))) ||
            (normalizedDistrict && (normalizedDistrict.includes(candidate) || candidate.includes(normalizedDistrict))))
        );
      })
    ) || null
  );
}

export function createListingMarker(label: string, location: string, district?: string): SiteMapMarker[] {
  const matchingHub = findHubForListingLocation(location, district);

  if (!matchingHub) {
    return [];
  }

  return [
    {
      lat: matchingHub.center[0],
      lng: matchingHub.center[1],
      label,
      sublabel: district ? `${location}, ${district}` : location,
      color: matchingHub.markerColor,
    },
  ];
}

export function createListingMarkersFromEquipment(
  items: Pick<EquipmentRecord, "id" | "name" | "location" | "district">[]
) {
  return items.flatMap((item) => createListingMarker(item.name, item.location, item.district));
}

export function createHubCirclesFromEquipment(
  items: Pick<EquipmentRecord, "location" | "district">[]
) {
  const seen = new Set<string>();

  return items.flatMap((item) => {
    const matchingHub = findHubForListingLocation(item.location, item.district);
    if (!matchingHub || seen.has(matchingHub.slug)) {
      return [];
    }

    seen.add(matchingHub.slug);
    return [
      {
        lat: matchingHub.center[0],
        lng: matchingHub.center[1],
        radius:
          matchingHub.slug === "sangli" || matchingHub.slug === "satara" || matchingHub.slug === "kolhapur"
            ? 22000
            : 18000,
        color: matchingHub.markerColor,
      } satisfies SiteMapCircle,
    ];
  });
}
