import { RenterWorkspaceOverview } from "@/components/workspace/RenterWorkspaceOverview";
import { getCurrentSession } from "@/lib/server/local-auth";
import {
  getRenterBookings,
  getRenterPayments,
  getRenterSavedListings,
} from "@/lib/server/firebase-data";

export default async function RenterDashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const [bookings, payments, savedListings] = await Promise.all([
    getRenterBookings(session.user.id),
    getRenterPayments(session.user.id),
    getRenterSavedListings(session.user.id),
  ]);

  return (
    <RenterWorkspaceOverview
      renterName={session.profile.fullName.split(" ")[0] || session.profile.fullName}
      bookings={bookings}
      payments={payments}
      savedListings={savedListings}
    />
  );
}
