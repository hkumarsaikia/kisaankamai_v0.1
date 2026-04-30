import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm";
import { localizedText } from "@/lib/i18n";
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
      title={localizedText("Settings", "सेटिंग्ज")}
      subtitle={localizedText(
        "Manage your owner profile and workspace preferences.",
        "तुमचा मालक प्रोफाइल आणि वर्कस्पेस प्राधान्ये व्यवस्थापित करा."
      )}
    >
      <ProfileSettingsForm family="owner-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
