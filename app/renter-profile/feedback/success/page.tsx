import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerProfileFeedbackSuccessContent } from "@/components/owner-profile/OwnerProfileViews";

export default function RenterProfileFeedbackSuccessPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="feedback"
      title="Feedback Submitted"
      subtitle="Thank you for helping us improve Kisan Kamai."
    >
      <OwnerProfileFeedbackSuccessContent />
    </OwnerProfileWorkspaceShell>
  );
}
