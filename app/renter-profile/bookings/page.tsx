import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerProfileBookingsContent } from "@/components/owner-profile/OwnerProfileViews";

export default function RenterProfileBookingsPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="bookings"
      title="My Bookings"
      subtitle="Manage your equipment rentals and schedules"
    >
      <OwnerProfileBookingsContent />
    </OwnerProfileWorkspaceShell>
  );
}
