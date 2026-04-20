import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerBookingsBoard } from "@/components/profile/OwnerBookingsBoard";
import { getOwnerBookings } from "@/lib/server/firebase-data";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function OwnerProfileBookingsPage() {
  const session = await getCurrentSession();
  const bookings = session ? await getOwnerBookings(session.user.id) : [];

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="bookings"
      title="Bookings"
      subtitle="Manage incoming rental requests and recently completed jobs."
    >
      <OwnerBookingsBoard bookings={bookings} />
    </OwnerProfileWorkspaceShell>
  );
}
