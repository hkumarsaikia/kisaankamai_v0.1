import BookingRequestClient from "../BookingRequestClient";
import { notFound } from "next/navigation";
import { getEquipmentById, getEquipmentStaticParams } from "@/lib/server/equipment";

export async function generateStaticParams() {
  return (await getEquipmentStaticParams()).map(({ id }) => ({ equipmentId: id }));
}

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

