import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm";
import { localizedText } from "@/lib/i18n";
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
      title={localizedText("Settings", "सेटिंग्ज")}
      subtitle={localizedText(
        "Manage your account and preferences.",
        "तुमचे खाते आणि प्राधान्ये व्यवस्थापित करा."
      )}
    >
      <ProfileSettingsForm family="renter-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
