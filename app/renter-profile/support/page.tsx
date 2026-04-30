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
      subtitle={localizedText(
        "Get booking help, owner support, and ticket updates in one place.",
        "बुकिंग मदत, मालक सपोर्ट आणि तिकीट अपडेट एका ठिकाणी मिळवा."
      )}
    >
      <ProfileSupportWorkspace family="renter-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
