import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterBookingsBoard } from "@/components/renter-profile/RenterBookingsBoard";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getRenterBookings } from "@/lib/server/local-data";

export default async function RenterProfilePage() {
  const session = await getCurrentSession();
  const bookings = session ? await getRenterBookings(session.user.id) : [];

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="dashboard"
      title="Renter Profile"
      subtitle="Review your active schedules, booking value, and tracking updates in one renter view."
    >
      <RenterBookingsBoard bookings={bookings} variant="dashboard" />
    </OwnerProfileWorkspaceShell>
  );
}
