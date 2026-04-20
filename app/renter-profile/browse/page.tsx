import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerProfileBrowseContent } from "@/components/owner-profile/OwnerProfileViews";

export default function RenterProfileBrowsePage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="browse"
      title="Browse Equipment"
      subtitle="Explore nearby machines matched to your work type and booking window"
    >
      <OwnerProfileBrowseContent />
    </OwnerProfileWorkspaceShell>
  );
}
