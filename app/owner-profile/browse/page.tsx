import { OwnerEquipmentBrowser } from "@/components/owner-profile/OwnerEquipmentBrowser";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings, getOwnerListings } from "@/lib/server/local-data";

export default async function OwnerProfileBrowsePage() {
  const session = await getCurrentSession();
  const [listings, bookings] = session
    ? await Promise.all([
        getOwnerListings(session.user.id),
        getOwnerBookings(session.user.id),
      ])
    : [[], []];

  const bookingCountByListing = new Map<string, number>();
  for (const booking of bookings) {
    bookingCountByListing.set(
      booking.listingId,
      (bookingCountByListing.get(booking.listingId) || 0) + 1
    );
  }

  const listingSummaries = listings.map((listing) => ({
    ...listing,
    bookingCount: bookingCountByListing.get(listing.id) || 0,
  }));

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="browse"
      title="My Equipment"
      subtitle="Review your live listings, sort by HP or distance, and open edit or detail flows safely."
    >
      <OwnerEquipmentBrowser listings={listingSummaries} />
    </OwnerProfileWorkspaceShell>
  );
}
