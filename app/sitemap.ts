import type { MetadataRoute } from "next";
import { getPublicEquipmentList } from "@/lib/server/firebase-data";
import { SITE_DOMAIN } from "@/lib/site-metadata";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/categories",
  "/coming-soon",
  "/faq",
  "/feature-request",
  "/feedback",
  "/how-it-works",
  "/list-equipment",
  "/login",
  "/owner-benefits",
  "/owner-experience",
  "/owner-profile",
  "/partner",
  "/profile-selection",
  "/register",
  "/rent-equipment",
  "/report",
  "/renter-profile",
  "/support",
  "/terms",
  "/verify-contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: new URL(route, SITE_DOMAIN).toString(),
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route === "/rent-equipment" || route === "/list-equipment" ? 0.9 : 0.7,
  })) satisfies MetadataRoute.Sitemap;

  const equipmentEntries = (await getPublicEquipmentList()).map((item) => ({
    url: new URL(`/equipment/${item.id}`, SITE_DOMAIN).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  })) satisfies MetadataRoute.Sitemap;

  return [...staticEntries, ...equipmentEntries];
}
