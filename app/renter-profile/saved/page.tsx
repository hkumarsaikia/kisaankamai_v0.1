import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { SavedListingsBoard } from "@/components/profile/SavedListingsBoard";
import { getRenterSavedListings } from "@/lib/server/firebase-data";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function RenterProfileSavedPage() {
  const session = await getCurrentSession();
  const listings = session ? await getRenterSavedListings(session.user.id) : [];

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="saved"
      title="Saved Equipment"
      subtitle="Review the machines you shortlisted for future bookings"
    >
      <SavedListingsBoard listings={listings} />
    </OwnerProfileWorkspaceShell>
  );
}
