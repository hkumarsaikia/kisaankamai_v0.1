import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterProfileBrowseContent } from "@/components/renter-profile/RenterProfileViews";

export default function OwnerProfileBrowsePage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="browse"
      title="My Equipment"
      subtitle="Review your live listings, update details, and grow your fleet."
    >
      <RenterProfileBrowseContent />
    </OwnerProfileWorkspaceShell>
  );
}
