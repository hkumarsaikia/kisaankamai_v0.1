import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function OwnerProfileSettingsPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="settings"
      title="Settings / सेटिंग्ज"
      subtitle="Manage your owner profile and workspace preferences."
    >
      <ProfileSettingsForm family="owner-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
