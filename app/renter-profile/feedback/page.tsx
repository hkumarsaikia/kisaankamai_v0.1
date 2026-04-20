import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerProfileFeedbackContent } from "@/components/owner-profile/OwnerProfileViews";

export default function RenterProfileFeedbackPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="feedback"
      title="Feedback"
      subtitle="Tell us what would improve your renter experience."
    >
      <OwnerProfileFeedbackContent />
    </OwnerProfileWorkspaceShell>
  );
}
