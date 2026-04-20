import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerProfileSavedContent } from "@/components/owner-profile/OwnerProfileViews";

export default function RenterProfileSavedPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="saved"
      title="Saved Equipment"
      subtitle="Review the machines you shortlisted for future bookings"
    >
      <OwnerProfileSavedContent />
    </OwnerProfileWorkspaceShell>
  );
}
