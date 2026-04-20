import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterProfileFeedbackContent } from "@/components/renter-profile/RenterProfileViews";

export default function OwnerProfileFeedbackPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="feedback"
      title="Feedback"
      subtitle="Share ideas that would improve the owner profile and fleet workflow."
    >
      <RenterProfileFeedbackContent />
    </OwnerProfileWorkspaceShell>
  );
}
