import EquipmentDetailClient from "./EquipmentDetailClient";

export function generateStaticParams() {
  // Define the IDs that should be pre-rendered
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <EquipmentDetailClient id={params.id} />;
}
