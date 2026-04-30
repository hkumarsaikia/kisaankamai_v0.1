import { AppLink as Link } from "@/components/AppLink";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings, getOwnerListings, getOwnerPayments } from "@/lib/server/local-data";
import { supportContact } from "@/lib/support-contact";

export default async function OwnerProfilePage() {
  const session = await getCurrentSession();
  const [listings, bookings, payments] = session
    ? await Promise.all([
        getOwnerListings(session.user.id),
        getOwnerBookings(session.user.id),
        getOwnerPayments(session.user.id),
      ])
    : [[], [], []];

  const activeListings = listings.filter((listing) => listing.status === "active").length;
  const openBookings = bookings.filter((booking) =>
    ["pending", "confirmed", "upcoming", "active"].includes(booking.status)
  ).length;
  const totalEarnings = payments.reduce(
    (sum, payment) => sum + (payment.status === "paid" ? payment.amount : 0),
    0
  );

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="dashboard"
      title={localizedText("Owner Profile", "मालक प्रोफाइल")}
      subtitle={localizedText(
        "Review bookings, equipment performance, and earnings without leaving the owner workspace.",
        "मालक वर्कस्पेस न सोडता बुकिंग, उपकरण कामगिरी आणि कमाई तपासा."
      )}
    >
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">Active Listings</p>
            <p className="mt-3 text-4xl font-black text-primary">{activeListings}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">Open Bookings</p>
            <p className="mt-3 text-4xl font-black text-primary">{openBookings}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">Paid Earnings</p>
            <p className="mt-3 text-4xl font-black text-primary">₹{totalEarnings.toLocaleString("en-IN")}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-6 dark:border-slate-800">
              <h2 className="text-2xl font-black text-primary">Recent Booking Activity</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Call renters directly and inspect the linked equipment from the owner workspace.
              </p>
            </div>
            <div className="space-y-4 p-6">
              {bookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-surface-container-low p-4 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    <img
                      src={booking.listing?.coverImage || "https://placehold.co/320x240?text=Equipment"}
                      alt={booking.listing?.name || "Equipment"}
                      className="h-32 w-full rounded-[1.25rem] object-cover md:h-24 md:w-28"
                    />
                    <div className="flex flex-1 items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">
                          {booking.listing?.name || "Equipment Booking"}
                        </h3>
                        <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">
                          {booking.renterProfile?.fullName || "Verified renter"}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-primary-container">
                          {booking.startDate} to {booking.endDate}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary-fixed px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary-container">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`tel:${booking.renterProfile?.phone || supportContact.phoneE164}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      Call Renter
                    </a>
                    <Link
                      href={`/owner-profile/equipment/${booking.listing?.id || booking.listingId}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2 text-sm font-bold text-white"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      View Equipment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-primary">Fleet Snapshot</h3>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Review your most recent listings and jump into edit mode.
                  </p>
                </div>
                <Link href="/owner-profile/browse" className="text-sm font-bold text-primary-container hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-5 space-y-4">
                {listings.slice(0, 3).map((listing) => (
                  <div key={listing.id} className="rounded-2xl bg-surface-container-low p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-on-surface">{listing.name}</p>
                        <p className="mt-1 text-sm text-on-surface-variant">
                          {listing.location}, {listing.district}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary-fixed px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary-container">
                        {listing.status}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/list-equipment?listingId=${listing.id}`}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100"
                      >
                        Edit Listing
                      </Link>
                      <Link
                        href={`/owner-profile/equipment/${listing.id}`}
                        className="rounded-xl bg-primary-container px-4 py-2 text-sm font-bold text-white"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </OwnerProfileWorkspaceShell>
  );
}
