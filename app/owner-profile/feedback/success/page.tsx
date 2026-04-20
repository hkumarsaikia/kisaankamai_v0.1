import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileFeedbackSuccessCard } from "@/components/profile/ProfileFeedbackSuccessCard";

export default function OwnerProfileFeedbackSuccessPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="feedback"
      title="Feedback Submitted"
      subtitle="Thank you for helping us improve the owner experience."
    >
      <ProfileFeedbackSuccessCard
        primaryHref="/owner-profile"
        primaryLabel="Back to Owner Profile"
        secondaryHref="/owner-profile/browse"
        secondaryLabel="Manage Equipment"
        message="Your feedback has been recorded for the owner workspace."
      />
    </OwnerProfileWorkspaceShell>
  );
}
