import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings, getOwnerListings, getOwnerPayments } from "@/lib/server/firebase-data";

export default async function OwnerDashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const [listings, bookings, payments] = await Promise.all([
    getOwnerListings(session.user.id),
    getOwnerBookings(session.user.id),
    getOwnerPayments(session.user.id),
  ]);

  const activeListings = listings.filter((listing) => listing.status === "active");
  const pendingBookings = bookings.filter((booking) => booking.status === "pending");
  const totalRevenue = payments
    .filter((payment) => payment.status === "paid" || payment.status === "processing")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const featuredListings = listings.slice(0, 2);

  return (
    <>
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-emerald-950 dark:text-emerald-50 font-headline tracking-tight">
            Namaste, {session.profile.fullName.split(" ")[0]} ji!
          </h2>
          <p className="text-on-surface-variant dark:text-slate-400 font-medium mt-1">
            Your owner workspace is now running on local test data.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 p-1 bg-surface-container-high dark:bg-slate-900 rounded-xl border border-outline-variant dark:border-slate-800 shadow-sm">
          <Link href="/owner-registration" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Listing
          </Link>
          <Link href="/owner-profile/bookings" className="flex items-center gap-2 px-4 py-2 text-primary dark:text-primary-fixed font-bold text-sm hover:bg-primary-container/10 rounded-lg transition-all">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            View Bookings
          </Link>
          <Link href="/owner-profile/revenue" className="flex items-center gap-2 px-4 py-2 text-primary dark:text-primary-fixed font-bold text-sm hover:bg-primary-container/10 rounded-lg transition-all">
            <span className="material-symbols-outlined text-sm">payments</span>
            Revenue
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Listings</span>
              <div className="mt-3 text-3xl font-black text-emerald-950 dark:text-emerald-50">{activeListings.length}</div>
              <p className="text-xs text-emerald-600 font-bold mt-1">{listings.length} total listings</p>
            </div>

            <div className="bg-emerald-50/20 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-slate-800 border-l-4 border-l-secondary">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Requests</span>
              <div className="mt-3 text-3xl font-black text-emerald-950 dark:text-emerald-50">{pendingBookings.length}</div>
              <p className="text-xs text-amber-700 font-bold mt-1">Approval needed</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Revenue In Flow</span>
              <div className="mt-3 text-3xl font-black text-emerald-950 dark:text-emerald-50">₹{totalRevenue.toLocaleString("en-IN")}</div>
              <p className="text-xs text-emerald-600 font-bold mt-1">{payments.length} payment records</p>
            </div>
          </div>

          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-emerald-950 dark:text-emerald-50 text-lg">Recent Booking Activity</h3>
              <Link href="/owner-profile/bookings" className="text-sm font-bold text-primary dark:text-emerald-400">
                Open full queue
              </Link>
            </div>
            <div className="space-y-4">
              {bookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-black text-emerald-950 dark:text-emerald-50">
                      {booking.listing?.name || "Equipment"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {booking.renterProfile?.fullName || "Renter"} • {booking.startDate} to {booking.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">{booking.status}</span>
                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">₹{booking.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
              {!bookings.length ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No bookings yet for this owner account.</p>
              ) : null}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="font-black text-emerald-950 dark:text-emerald-50 text-lg uppercase tracking-wide">Top Performing Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredListings.map((listing) => (
                <div key={listing.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="h-40 w-full relative">
                    <Image src={listing.coverImage} alt={listing.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded">
                      {listing.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-4 flex justify-between items-end">
                    <div>
                      <h4 className="font-bold text-emerald-950 dark:text-emerald-50">{listing.name}</h4>
                      <p className="text-xs text-slate-500">{listing.location}, {listing.district}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-700 font-black">₹{listing.pricePerHour}/hr</span>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Local pricing</p>
                    </div>
                  </div>
                </div>
              ))}
              {!featuredListings.length ? (
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-sm text-slate-500 dark:text-slate-400">
                  Add your first listing to populate the owner dashboard.
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-black text-emerald-950 dark:text-emerald-50 text-sm uppercase tracking-wide mb-6">
              Owner Snapshot
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Name</span>
                <span className="font-bold text-emerald-950 dark:text-emerald-50">{session.profile.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Village</span>
                <span className="font-bold text-emerald-950 dark:text-emerald-50">{session.profile.village}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Pincode</span>
                <span className="font-bold text-emerald-950 dark:text-emerald-50">{session.profile.pincode}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-950 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10">
              <span className="material-symbols-outlined text-8xl text-white">support_agent</span>
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-wide mb-2">Need Help?</h4>
            <p className="text-emerald-300 text-xs font-medium mb-6 leading-relaxed">
              Local support submissions are stored directly inside the project data folder for testing.
            </p>
            <div className="flex flex-col gap-2 relative z-10">
              <Link href="/owner-profile/support" className="w-full py-2 bg-emerald-500 text-emerald-950 font-bold text-xs rounded-lg hover:brightness-110 transition-all text-center">
                Open Owner Support
              </Link>
              <Link href="/support" className="w-full py-2 bg-white/10 text-white font-bold text-xs rounded-lg hover:bg-white/20 transition-all text-center">
                General Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

