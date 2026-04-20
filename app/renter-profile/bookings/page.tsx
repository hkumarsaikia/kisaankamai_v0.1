import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterBookingsBoard } from "@/components/renter-profile/RenterBookingsBoard";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getRenterBookings } from "@/lib/server/local-data";

export default async function RenterProfileBookingsPage() {
  const session = await getCurrentSession();
  const bookings = session ? await getRenterBookings(session.user.id) : [];

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="bookings"
      title="My Bookings"
      subtitle="Manage active, pending, completed, and cancelled rentals with inline tracking."
    >
      <RenterBookingsBoard bookings={bookings} variant="page" />
    </OwnerProfileWorkspaceShell>
  );
}
