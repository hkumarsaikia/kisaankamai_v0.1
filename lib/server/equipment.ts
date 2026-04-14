import "server-only";

import {
  getListingById,
  getPublicEquipmentById,
  getPublicEquipmentList,
  listingToEquipmentRecord,
} from "@/lib/server/local-data";

export async function getEquipmentList() {
  return getPublicEquipmentList();
}

export async function getEquipmentById(id: string) {
  const publicMatch = await getPublicEquipmentById(id);
  if (publicMatch) {
    return publicMatch;
  }

  const listing = await getListingById(id);
  return listing ? listingToEquipmentRecord(listing) : null;
}

export async function getEquipmentStaticParams() {
  return (await getPublicEquipmentList()).map((item) => ({ id: item.id }));
}
