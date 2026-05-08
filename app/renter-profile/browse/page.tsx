import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterEquipmentBrowser } from "@/components/renter-profile/RenterEquipmentBrowser";
import { localizedText } from "@/lib/i18n";
import { getEquipmentList } from "@/lib/server/equipment";

export default async function RenterProfileBrowsePage() {
  const equipment = await getEquipmentList();

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="browse"
      title={localizedText("Browse Equipment", "उपकरणे शोधा")}
    >
      <RenterEquipmentBrowser equipment={equipment} />
    </OwnerProfileWorkspaceShell>
  );
}
