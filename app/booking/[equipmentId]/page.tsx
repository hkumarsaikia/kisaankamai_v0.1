import BookingRequestClient from "../BookingRequestClient";
import { getEquipmentStaticParams } from "@/lib/server/equipment";

export function generateStaticParams() {
  return getEquipmentStaticParams().map(({ id }) => ({ equipmentId: id }));
}

export default function BookingFlow({
  params,
}: {
  params: { equipmentId: string };
}) {
  return <BookingRequestClient equipmentId={params.equipmentId} />;
}
