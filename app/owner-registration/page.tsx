import { redirect } from "next/navigation";
import { OwnerSidebar } from "@/components/OwnerSidebar";
import { OwnerTopBar } from "@/components/OwnerTopBar";
import { OwnerRegistrationHeader } from "@/components/workspace/OwnerRegistrationHeader";
import { OwnerListingWizard } from "@/components/forms/OwnerListingWizard";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getListingById } from "@/lib/server/firebase-data";

export default async function OwnerRegistrationPage({
  searchParams,
}: {
  searchParams?: { listingId?: string };
}) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/profile-selection");
  }

  const listingId = searchParams?.listingId;
  const editing = listingId ? await getListingById(listingId) : null;
  const isEditing = Boolean(editing && editing.ownerUserId === session.user.id);

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <OwnerSidebar />
      <OwnerTopBar />
      <main className="mt-16 flex min-h-[calc(100vh-4rem)] flex-col gap-8 p-6 md:p-8 lg:ml-64">
        <div className="mx-auto w-full max-w-7xl">
          <OwnerRegistrationHeader isEditing={isEditing} />
          <OwnerListingWizard listing={isEditing ? editing : null} defaultVillage={session.profile.village} />
        </div>
      </main>
    </div>
  );
}
