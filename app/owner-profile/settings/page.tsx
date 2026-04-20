import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterProfileSettingsContent } from "@/components/renter-profile/RenterProfileViews";

export default function OwnerProfileSettingsPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="settings"
      title="Settings / सेटिंग्ज"
      subtitle="Manage your owner profile and workspace preferences."
    >
      <RenterProfileSettingsContent />
    </OwnerProfileWorkspaceShell>
  );
}
