import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterProfileDashboardContent } from "@/components/renter-profile/RenterProfileViews";

export default function OwnerProfilePage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="dashboard"
      title="Owner Profile"
      subtitle="Good Morning, Ramesh. Review your latest requests and keep your fleet moving."
    >
      <RenterProfileDashboardContent />
    </OwnerProfileWorkspaceShell>
  );
}
