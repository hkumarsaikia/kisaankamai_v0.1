import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileFeedbackForm } from "@/components/profile/ProfileFeedbackForm";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function RenterProfileFeedbackPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="feedback"
      title="Feedback"
      subtitle="Tell us what would improve your renter experience."
    >
      <ProfileFeedbackForm family="renter-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
