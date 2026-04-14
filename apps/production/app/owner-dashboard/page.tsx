import { createListingAction } from "@/app/actions";
import { FormField, FormGrid, FormSection, FormShell } from "@/components/forms/FormKit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";
import { listOwnerBookings, listOwnerListings, listOwnerPayments } from "@/lib/server/repositories";

export default async function OwnerDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const [listings, bookings, payments, params] = await Promise.all([
    listOwnerListings(session.user.uid),
    listOwnerBookings(session.user.uid),
    listOwnerPayments(session.user.uid),
    searchParams,
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">Owner workspace</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Manage listings, requests, and payouts</h1>
      </div>
      {params?.message ? (
        <p className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
          {params.message}
        </p>
      ) : null}
      <section className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <FormShell
          eyebrow="Owner listing"
          title="Create a polished production listing"
          description="The listing payload stays the same. This redesign only improves the clarity and trust cues around the publishing workflow."
          aside={
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">Listing quality cues</h3>
              <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                Clear names, location coverage, and media help renters trust the listing before they request a booking.
              </p>
            </div>
          }
        >
          <form action={createListingAction} className="grid gap-5" encType="multipart/form-data">
            <FormSection title="Listing basics" description="These fields map directly to the production listing contract.">
              <FormGrid>
                <FormField label="Equipment name" required>
                  <input className="kk-input" name="name" placeholder="Equipment name" required />
                </FormField>
                <FormField label="Category" required>
                  <input className="kk-input" name="category" placeholder="Category" required />
                </FormField>
                <FormField label="District" required>
                  <input className="kk-input" name="district" placeholder="District" required />
                </FormField>
                <FormField label="Location" required>
                  <input className="kk-input" name="location" placeholder="Location" required />
                </FormField>
                <FormField label="Price per hour" required>
                  <input className="kk-input" type="number" min="1" step="1" name="pricePerHour" placeholder="Price per hour" required />
                </FormField>
                <FormField label="Operator">
                  <div className="kk-form-subtle flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <input type="checkbox" name="operatorIncluded" className="rounded border-slate-300" />
                    Operator included
                  </div>
                </FormField>
              </FormGrid>
            </FormSection>
            <FormSection title="Description and media" description="Add the same description and media payload the production action already expects.">
              <div className="grid gap-5">
                <FormField label="Description" required>
                  <textarea className="kk-input min-h-[140px]" name="description" placeholder="Describe the machine, condition, and work coverage" required />
                </FormField>
                <FormField label="Images">
                  <input className="kk-input" type="file" name="images" accept="image/*" multiple />
                </FormField>
                <div className="flex justify-end">
                  <Button type="submit">Publish listing</Button>
                </div>
              </div>
            </FormSection>
          </form>
        </FormShell>

        <div className="grid gap-6">
          <div className="kk-card">
            <h2 className="text-xl font-black">Live metrics</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.25rem] bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Listings</p>
                <p className="mt-2 text-3xl font-black">{listings.length}</p>
              </div>
              <div className="rounded-[1.25rem] bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Bookings</p>
                <p className="mt-2 text-3xl font-black">{bookings.length}</p>
              </div>
              <div className="rounded-[1.25rem] bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Payments</p>
                <p className="mt-2 text-3xl font-black">{payments.length}</p>
              </div>
            </div>
          </div>
          <div className="kk-card">
            <h2 className="text-xl font-black">Published listings</h2>
            <div className="mt-4 space-y-4">
              {listings.length ? (
                listings.map((listing) => (
                  <div key={listing.id} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black">{listing.name}</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{listing.location}, {listing.district}</p>
                      </div>
                      <Badge variant="success">{listing.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">No production listings yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
