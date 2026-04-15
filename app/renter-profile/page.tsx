import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { getCurrentSession } from "@/lib/server/local-auth";
import {
  getRenterBookings,
  getRenterPayments,
  getRenterSavedListings,
} from "@/lib/server/local-data";

export default async function RenterDashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const [bookings, payments, savedListings] = await Promise.all([
    getRenterBookings(session.user.id),
    getRenterPayments(session.user.id),
    getRenterSavedListings(session.user.id),
  ]);

  const activeBookings = bookings.filter((booking) => booking.status === "active" || booking.status === "confirmed");
  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-container to-[#00251a] p-8 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2">Good morning, {session.profile.fullName.split(" ")[0]}!</h2>
          <p className="text-emerald-100/80 max-w-md">
            Your renter dashboard shows live bookings, saved listings, and payment history.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Bookings</p>
              <p className="text-white text-2xl font-black">{bookings.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Saved</p>
              <p className="text-white text-2xl font-black">{savedListings.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 hidden sm:block">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Total Spent</p>
              <p className="text-white text-2xl font-black">₹{totalSpent.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xl font-bold text-on-surface">Active Bookings</h3>
              <Link href="/renter-profile/bookings" className="text-emerald-700 dark:text-emerald-400 text-sm font-bold hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeBookings.slice(0, 2).map((booking) => (
                <div key={booking.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex gap-5 group hover:shadow-md transition-all">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                    <Image className="object-cover" alt={booking.listing?.name || "Equipment"} src={booking.listing?.coverImage || "/assets/generated/hero_tractor.png"} fill />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{booking.status}</span>
                        <span className="text-slate-500 text-xs font-medium">{booking.id}</span>
                      </div>
                      <h4 className="font-bold text-on-surface leading-tight">{booking.listing?.name || "Equipment"}</h4>
                      <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {booking.listing?.district || "Maharashtra"}
                      </p>
                    </div>
                    <div className="mt-2 flex justify-between items-center border-t border-dashed border-slate-200 dark:border-slate-700 pt-2">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{booking.startDate}</p>
                      <span className="text-emerald-900 dark:text-emerald-400 text-xs font-bold">₹{booking.amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              ))}
              {!activeBookings.length ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-sm text-slate-500 dark:text-slate-400">
                  No active renter bookings yet. Browse equipment to create one.
                </div>
              ) : null}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-on-surface mb-6">Saved Equipment</h3>
            <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
              {savedListings.map((item) => (
                <div key={item.id} className="min-w-[240px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="h-32 bg-slate-100 dark:bg-slate-800 relative">
                    <Image className="object-cover" alt={item.name} src={item.coverImage} fill />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-secondary uppercase mb-1">{item.categoryLabel}</p>
                    <h5 className="font-bold text-sm text-on-surface">{item.name}</h5>
                    <p className="text-slate-500 text-xs font-semibold mt-2">₹{item.pricePerHour}/hr</p>
                  </div>
                </div>
              ))}
              {!savedListings.length ? (
                <div className="min-w-[240px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-sm text-slate-500 dark:text-slate-400">
                  Save equipment from browse pages to see it here.
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-on-surface mb-4">Latest Payment Records</h3>
            <div className="space-y-3">
              {payments.slice(0, 4).map((payment) => (
                <div key={payment.id} className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{payment.bookingId}</p>
                    <p className="text-xs text-slate-500">{payment.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">₹{payment.amount.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">{payment.status}</p>
                  </div>
                </div>
              ))}
              {!payments.length ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No payment records yet.</p>
              ) : null}
            </div>
          </section>

          <section className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white">support_agent</span>
              </div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200">Quick Support</h3>
            </div>
            <p className="text-amber-800/80 dark:text-amber-300/60 text-sm mb-6 font-medium">Need help with a booking or listing? Reach the shared support team here.</p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/support" className="bg-white dark:bg-slate-900 text-amber-700 font-bold py-3 px-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-amber-50 transition-colors">
                <span className="material-symbols-outlined text-sm">call</span> Support
              </Link>
              <Link href="/renter-profile/browse" className="bg-amber-600 text-white font-bold py-3 px-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-amber-700 transition-colors">
                <span className="material-symbols-outlined text-sm">search</span> Browse
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
