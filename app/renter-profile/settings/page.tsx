import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function RenterProfileSettingsPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="settings"
      title="Settings / सेटिंग्ज"
      subtitle="Manage your account and preferences"
    >
      <ProfileSettingsForm family="renter-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
