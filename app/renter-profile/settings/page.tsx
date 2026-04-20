import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerProfileSettingsContent } from "@/components/owner-profile/OwnerProfileViews";

export default function RenterProfileSettingsPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="settings"
      title="Settings / सेटिंग्ज"
      subtitle="Manage your account and preferences"
    >
      <OwnerProfileSettingsContent />
    </OwnerProfileWorkspaceShell>
  );
}
