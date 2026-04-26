import "server-only";

import {
  getPublicEquipmentById,
  getPublicEquipmentList,
} from "@/lib/server/firebase-data";

export async function getEquipmentList() {
  return getPublicEquipmentList();
}

export async function getEquipmentById(id: string) {
  return getPublicEquipmentById(id);
}

export async function getEquipmentStaticParams() {
  return (await getPublicEquipmentList()).map((item) => ({ id: item.id }));
}
