import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterProfileFeedbackSuccessContent } from "@/components/renter-profile/RenterProfileViews";

export default function OwnerProfileFeedbackSuccessPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="feedback"
      title="Feedback Submitted"
      subtitle="Thank you for helping us improve the owner experience."
    >
      <RenterProfileFeedbackSuccessContent />
    </OwnerProfileWorkspaceShell>
  );
}
