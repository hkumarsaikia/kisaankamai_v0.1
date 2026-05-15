import { ListEquipmentEditorPage } from "@/components/owner-profile/ListEquipmentEditorPage";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getListingById } from "@/lib/server/local-data";
import { redirect } from "next/navigation";

export default async function OwnerProfileListEquipmentPage({
  searchParams,
}: {
  searchParams?: Promise<{ listingId?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const listingId = resolvedSearchParams?.listingId || "";
  const listing = listingId
    ? await getListingById(listingId).then((record) =>
        record && record.ownerUserId === session.user.id ? record : null
      )
    : null;

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="add-listing"
      title={localizedText(
        listing ? "Edit Listing" : "Add New Listing",
        listing ? "लिस्टिंग संपादित करा" : "नवीन लिस्टिंग जोडा"
      )}
    >
      <ListEquipmentEditorPage listing={listing} defaultVillage={session.profile.village || ""} />
    </OwnerProfileWorkspaceShell>
  );
}
