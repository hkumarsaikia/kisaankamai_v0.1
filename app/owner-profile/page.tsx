import { OwnerWorkspaceOverview } from "@/components/workspace/OwnerWorkspaceOverview";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings, getOwnerListings, getOwnerPayments } from "@/lib/server/firebase-data";

export default async function OwnerDashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const [listings, bookings, payments] = await Promise.all([
    getOwnerListings(session.user.id),
    getOwnerBookings(session.user.id),
    getOwnerPayments(session.user.id),
  ]);

  return (
    <OwnerWorkspaceOverview
      ownerName={session.profile.fullName.split(" ")[0] || session.profile.fullName}
      village={session.profile.village}
      pincode={session.profile.pincode}
      listings={listings}
      bookings={bookings}
      payments={payments}
    />
  );
}
