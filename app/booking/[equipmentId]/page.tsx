import BookingRequestClient from "../BookingRequestClient";
import { notFound } from "next/navigation";
import { getEquipmentById } from "@/lib/server/equipment";

export const dynamicParams = true;

export default async function BookingFlow({
  params,
}: {
  params: { equipmentId: string };
}) {
  const equipment = await getEquipmentById(params.equipmentId);

  if (!equipment) {
    notFound();
  }

  return <BookingRequestClient equipment={equipment} />;
}

