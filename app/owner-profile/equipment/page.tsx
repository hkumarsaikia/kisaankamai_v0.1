import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import {
  deleteListingFormAction,
  toggleListingStatusFormAction,
} from "@/lib/actions/firebase-data";
import { getCurrentSession } from "@/lib/server/firebase-auth";
import { getOwnerBookings, getOwnerListings } from "@/lib/server/firebase-data";

export default async function MyEquipmentPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const [listings, bookings] = await Promise.all([
    getOwnerListings(session.user.id),
    getOwnerBookings(session.user.id),
  ]);

  const activeCount = listings.filter((listing) => listing.status === "active").length;
  const pausedCount = listings.length - activeCount;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-emerald-950 dark:text-emerald-50 font-headline tracking-tight">My Equipment</h1>
        <Link href="/owner-registration" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> Add New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Listings</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{listings.length}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">Local JSON inventory</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active</p>
          <h3 className="text-3xl font-black text-emerald-600 mt-1">{activeCount}</h3>
          <p className="text-xs text-emerald-600/70 font-medium mt-1">Visible on browse pages</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Paused</p>
          <h3 className="text-3xl font-black text-amber-600 mt-1">{pausedCount}</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Hidden from marketplace</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <Link href="/owner-registration" className="border-2 border-dashed border-emerald-900/20 dark:border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all group cursor-pointer h-full min-h-[380px]">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl">add</span>
          </div>
          <h4 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">New Equipment?</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[240px] mb-6">List your tractor, harvester, or attachment and start testing real owner flows.</p>
          <span className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl">Add Listing</span>
        </Link>

        {listings.map((listing) => {
          const listingBookings = bookings.filter((booking) => booking.listingId === listing.id);
          const earnings = listingBookings.reduce((sum, booking) => sum + booking.amount, 0);
          const nextStatus = listing.status === "active" ? "paused" : "active";

          return (
            <div key={listing.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="relative h-52 overflow-hidden shrink-0">
                <Image src={listing.coverImage} alt={listing.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">
                    {listing.categoryLabel}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${listing.status === "active" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                    {listing.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{listing.name}</h4>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-sm">location_on</span> {listing.location}, {listing.district}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Rate</p>
                    <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">₹{listing.pricePerHour}<span className="text-xs font-medium text-slate-500">/hr</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Bookings</p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">event_repeat</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">{listingBookings.length} total</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Earnings</p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">payments</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">₹{earnings.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <form action={toggleListingStatusFormAction.bind(null, listing.id, nextStatus)}>
                    <button className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                      {listing.status === "active" ? "Pause" : "Activate"}
                    </button>
                  </form>
                  <div className="flex gap-2">
                    <Link href={`/owner-registration?listingId=${listing.id}`} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">
                      Edit
                    </Link>
                    <form action={deleteListingFormAction.bind(null, listing.id)}>
                      <button className="px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}


