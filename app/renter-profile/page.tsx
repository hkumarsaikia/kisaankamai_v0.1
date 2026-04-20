import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerProfileDashboardContent } from "@/components/owner-profile/OwnerProfileViews";

export default function RenterProfilePage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="dashboard"
      title="Renter Profile"
      subtitle="Welcome back, Namdev. You have 2 active bookings."
    >
      <OwnerProfileDashboardContent />
    </OwnerProfileWorkspaceShell>
  );
}
