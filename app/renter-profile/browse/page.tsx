import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterEquipmentBrowser } from "@/components/renter-profile/RenterEquipmentBrowser";
import { getEquipmentList } from "@/lib/server/equipment";

export default async function RenterProfileBrowsePage() {
  const equipment = await getEquipmentList();

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="browse"
      title="Browse Equipment"
      subtitle="Explore nearby machines and sort the catalog by HP or distance before opening details."
    >
      <RenterEquipmentBrowser equipment={equipment} />
    </OwnerProfileWorkspaceShell>
  );
}
