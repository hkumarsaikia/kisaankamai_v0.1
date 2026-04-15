import { createBookingAction, toggleSavedAction } from "@/app/actions";
import { AppLink } from "@/components/app-link";
import { FormField, FormSection } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/server/auth";
import { listPublicListings } from "@/lib/server/repositories";

export default async function RentEquipmentPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const [session, listings, params] = await Promise.all([getCurrentSession(), listPublicListings(), searchParams]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight">Browse equipment listings</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          Listings in this app are pulled from Firestore and kept in sync with the owner dashboard.
        </p>
      </div>
      {params?.message ? (
        <p className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
          {params.message}
        </p>
      ) : null}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {listings.map((listing) => (
          <article key={listing.id} className="kk-card overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-slate-800">
              {listing.coverImage ? (
                <img src={listing.coverImage} alt={listing.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold uppercase tracking-[0.18em] text-slate-500">No image</div>
              )}
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{listing.category}</p>
                <h2 className="mt-2 text-2xl font-black">{listing.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{listing.description}</p>
              </div>
              <p className="rounded-full bg-brand-50 px-4 py-2 text-sm font-black text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                ₹{listing.pricePerHour}/hr
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{listing.location}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{listing.district}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                {listing.operatorIncluded ? "Operator included" : "Operator optional"}
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-[auto_1fr]">
              {session ? (
                <form action={toggleSavedAction}>
                  <input type="hidden" name="listingId" value={listing.id} />
                  <button className="kk-button-secondary w-full">Save</button>
                </form>
              ) : (
                <AppLink href="/login" className="kk-button-secondary text-center">Log in to save</AppLink>
              )}
              <form action={createBookingAction} className="kk-form-surface grid gap-4 p-4">
                <input type="hidden" name="listingId" value={listing.id} />
                <input type="hidden" name="listingName" value={listing.name} />
                <input type="hidden" name="ownerUid" value={listing.ownerUid} />
                <FormSection title="Booking request" description="Submit the same booking payload without leaving the listing card.">
                  <div className="grid gap-4">
                    <FormField label="Field location" required>
                      <input className="kk-input" name="fieldLocation" placeholder="Field location" required />
                    </FormField>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Work type" required>
                        <input className="kk-input" name="workType" placeholder="Work type" required />
                      </FormField>
                      <FormField label="Approx hours">
                        <input className="kk-input" name="approxHours" type="number" min="1" step="1" placeholder="Approx hours" />
                      </FormField>
                    </div>
                    <FormField label="Start date">
                      <input className="kk-input" name="startDate" type="date" />
                    </FormField>
                    <Button disabled={!session}>
                      {session ? "Request booking" : "Log in to book"}
                    </Button>
                  </div>
                </FormSection>
              </form>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
