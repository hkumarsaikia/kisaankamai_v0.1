import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileSupportWorkspace } from "@/components/profile/ProfileSupportWorkspace";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function OwnerProfileSupportPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="support"
      title="Support"
      subtitle="Get owner help for listing, booking, and verification issues."
    >
      <ProfileSupportWorkspace family="owner-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
