import { ListEquipmentEditorPage } from "@/components/owner-profile/ListEquipmentEditorPage";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getListingById } from "@/lib/server/local-data";
import { localizedText } from "@/lib/i18n";
import { redirect } from "next/navigation";

export default async function ListEquipmentPage({
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
  const listing =
    listingId
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
      subtitle={localizedText(
        "Use the guided listing flow to publish equipment details, pricing, service area, and photos.",
        "उपकरण तपशील, किंमत, सेवा क्षेत्र आणि फोटो प्रकाशित करण्यासाठी मार्गदर्शित लिस्टिंग फ्लो वापरा."
      )}
    >
      <ListEquipmentEditorPage listing={listing} defaultVillage={session?.profile.village || ""} />
    </OwnerProfileWorkspaceShell>
  );
}
