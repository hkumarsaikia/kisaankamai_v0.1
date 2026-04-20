import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileFeedbackForm } from "@/components/profile/ProfileFeedbackForm";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function OwnerProfileFeedbackPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="feedback"
      title="Feedback"
      subtitle="Share ideas that would improve the owner profile and fleet workflow."
    >
      <ProfileFeedbackForm family="owner-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
