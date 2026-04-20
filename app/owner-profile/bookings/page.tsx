import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterProfileBookingsContent } from "@/components/renter-profile/RenterProfileViews";

export default function OwnerProfileBookingsPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="bookings"
      title="Bookings"
      subtitle="Manage incoming rental requests and recently completed jobs."
    >
      <RenterProfileBookingsContent />
    </OwnerProfileWorkspaceShell>
  );
}
