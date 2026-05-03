import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { SavedListingsBoard } from "@/components/profile/SavedListingsBoard";
import { localizedText } from "@/lib/i18n";
import { getRenterSavedListings } from "@/lib/server/firebase-data";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function RenterProfileSavedPage() {
  const session = await getCurrentSession();
  const listings = session ? await getRenterSavedListings(session.user.id) : [];

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="saved"
      title={localizedText("Saved Equipment", "जतन केलेली उपकरणे")}
    >
      <SavedListingsBoard listings={listings} />
    </OwnerProfileWorkspaceShell>
  );
}
