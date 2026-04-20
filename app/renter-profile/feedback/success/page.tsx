import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileFeedbackSuccessCard } from "@/components/profile/ProfileFeedbackSuccessCard";

export default function RenterProfileFeedbackSuccessPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="feedback"
      title="Feedback Submitted"
      subtitle="Thank you for helping us improve the renter experience."
    >
      <ProfileFeedbackSuccessCard
        primaryHref="/renter-profile"
        primaryLabel="Back to Renter Profile"
        secondaryHref="/renter-profile/bookings"
        secondaryLabel="My Bookings"
        message="Your feedback has been recorded for the renter workspace."
      />
    </OwnerProfileWorkspaceShell>
  );
}
