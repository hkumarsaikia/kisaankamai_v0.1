import "server-only";

import { unstable_cache } from "next/cache";
import { EquipmentRecord, getMockEquipmentById, getMockEquipmentList } from "@/lib/equipment";
import {
  canUseServerEquipment,
  getAdminDatabases,
  Query,
  SERVER_APPWRITE_CONFIG,
} from "@/lib/server/appwrite-admin";

function normalizeEquipmentDocument(doc: Record<string, any>): EquipmentRecord {
  return {
    id: String(doc.$id || doc.id || doc.documentId || ""),
    slug: String(doc.slug || doc.$id || doc.id || ""),
    name: String(doc.name || doc.title || "Farm Equipment"),
    category: String(doc.category || "equipment"),
    categoryLabel: String(doc.categoryLabel || doc.category || "Equipment"),
    location: String(doc.location || doc.village || doc.city || "Maharashtra"),
    district: String(doc.district || "Maharashtra"),
    state: String(doc.state || "Maharashtra"),
    description: String(
      doc.description ||
        "Verified agricultural equipment listing available through Kisan Kamai."
    ),
    pricePerHour: Number(doc.pricePerHour || doc.hourlyRate || doc.price || 0),
    unitLabel: String(doc.unitLabel || "per hour"),
    rating: Number(doc.rating || 4.8),
    hp: String(doc.hp || doc.power || "N/A"),
    distanceKm: Number(doc.distanceKm || doc.distance || 0),
    ownerName: String(doc.ownerName || doc.owner || "Verified Owner"),
    ownerLocation: String(doc.ownerLocation || doc.location || "Maharashtra"),
    ownerVerified: Boolean(doc.ownerVerified ?? true),
    coverImage: String(doc.coverImage || doc.image || "/assets/generated/hero_tractor.png"),
    galleryImages: Array.isArray(doc.galleryImages)
      ? doc.galleryImages.map(String)
      : [String(doc.coverImage || doc.image || "/assets/generated/hero_tractor.png")],
    tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
    workTypes: Array.isArray(doc.workTypes) ? doc.workTypes.map(String) : [],
    operatorIncluded: Boolean(doc.operatorIncluded ?? true),
  };
}

const fetchEquipmentList = unstable_cache(
  async () => {
    if (!canUseServerEquipment()) {
      return getMockEquipmentList();
    }

    const documents = await getAdminDatabases().listDocuments(
      SERVER_APPWRITE_CONFIG.databaseId!,
      SERVER_APPWRITE_CONFIG.equipmentCollectionId!,
      [Query.limit(100)]
    );

    return documents.documents.map((doc) => normalizeEquipmentDocument(doc as Record<string, any>));
  },
  ["equipment-list"],
  { revalidate: 3600 }
);

const fetchEquipmentById = unstable_cache(
  async (id: string) => {
    if (!canUseServerEquipment()) {
      return getMockEquipmentById(id);
    }

    const doc = await getAdminDatabases().getDocument(
      SERVER_APPWRITE_CONFIG.databaseId!,
      SERVER_APPWRITE_CONFIG.equipmentCollectionId!,
      id
    );

    return normalizeEquipmentDocument(doc as Record<string, any>);
  },
  ["equipment-by-id"],
  { revalidate: 3600 }
);

export async function getEquipmentList() {
  return fetchEquipmentList();
}

export async function getEquipmentById(id: string) {
  return fetchEquipmentById(id);
}

export function getEquipmentStaticParams() {
  return getMockEquipmentList().map((item) => ({ id: item.id }));
}
