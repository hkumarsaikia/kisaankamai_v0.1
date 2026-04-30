import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileSupportWorkspace } from "@/components/profile/ProfileSupportWorkspace";
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
      title="Support"
      subtitle="Get booking help, owner support, and ticket updates in one place."
    >
      <ProfileSupportWorkspace family="renter-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
