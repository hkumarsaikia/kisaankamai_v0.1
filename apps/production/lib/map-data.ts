import { coverageHubs } from "@/lib/content";

export const homepageMarkers = coverageHubs.map((hub) => ({
  lat: hub.lat,
  lng: hub.lng,
  label: hub.name,
  sublabel: hub.description,
  color: hub.slug === "satara" ? "#c55a11" : "#1f7d56",
}));

export const homepageCircles = coverageHubs.map((hub) => ({
  lat: hub.lat,
  lng: hub.lng,
  radius: 22000,
  color: hub.slug === "satara" ? "#c55a11" : "#1f7d56",
}));
