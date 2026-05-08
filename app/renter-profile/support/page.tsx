import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileSupportWorkspace } from "@/components/profile/ProfileSupportWorkspace";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function RenterProfileSupportPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="support"
      title={localizedText("Support", "सपोर्ट")}
    >
      <ProfileSupportWorkspace family="renter-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
