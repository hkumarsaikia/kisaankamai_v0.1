import { redirect } from "next/navigation";
import { OwnerSidebar } from "@/components/OwnerSidebar";
import { OwnerTopBar } from "@/components/OwnerTopBar";
import { OwnerListingWizard } from "@/components/forms/OwnerListingWizard";
import { getCurrentSession } from "@/lib/server/firebase-auth";
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
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary dark:text-emerald-50">
              {isEditing ? "Edit Equipment Listing" : "Register Equipment"}
            </h1>
            <p className="font-medium text-on-surface-variant dark:text-slate-400">
              {isEditing
                ? "Update your listing details, images, pricing, and availability."
                : "Create a live owner listing for your local marketplace inventory."}
            </p>
          </div>

          <OwnerListingWizard listing={isEditing ? editing : null} defaultVillage={session.profile.village} />
        </div>
      </main>
    </div>
  );
}
