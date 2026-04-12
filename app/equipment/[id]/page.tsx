import EquipmentDetailClient from "./EquipmentDetailClient";

export function generateStaticParams() {
  return [
    { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return <EquipmentDetailClient id={params.id} />;
}
