import { notFound, redirect } from "next/navigation";
import EquipmentDetailClient from "@/app/equipment/[id]/EquipmentDetailClient";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getEquipmentById, getEquipmentList } from "@/lib/server/equipment";
import { localizedText } from "@/lib/i18n";

export default async function RenterProfileEquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const equipment = await getEquipmentById(id);
  if (!equipment) {
    notFound();
  }

  const relatedEquipment = (await getEquipmentList())
    .filter((item) => item.id !== equipment.id && item.category === equipment.category)
    .slice(0, 3);

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="browse"
      title={localizedText("Equipment Details", "उपकरण तपशील")}
      subtitle={localizedText("Review and request this machine inside the renter workspace.", "भाडेकरू वर्कस्पेसमध्ये हे उपकरण तपासा आणि विनंती करा.")}
    >
      <EquipmentDetailClient equipment={equipment} relatedEquipment={relatedEquipment} showBreadcrumbs={false} containerVariant="workspace" />
    </OwnerProfileWorkspaceShell>
  );
}
