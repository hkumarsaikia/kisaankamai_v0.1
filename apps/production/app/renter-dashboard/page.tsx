import { getCurrentSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";
import { listRenterBookings, listRenterPayments, listSavedListings } from "@/lib/server/repositories";

export default async function RenterDashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const [savedListings, bookings, payments] = await Promise.all([
    listSavedListings(session.user.uid),
    listRenterBookings(session.user.uid),
    listRenterPayments(session.user.uid),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">Renter workspace</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Saved listings, bookings, and payments</h1>
      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        <section className="kk-card">
          <h2 className="text-xl font-black">Saved equipment</h2>
          <div className="mt-4 space-y-4">
            {savedListings.length ? (
              savedListings.map((listing) => (
                <div key={listing.id} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-800">
                  <h3 className="text-lg font-black">{listing.name}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{listing.location}, {listing.district}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">No saved listings yet.</p>
            )}
          </div>
        </section>
        <section className="kk-card">
          <h2 className="text-xl font-black">Bookings</h2>
          <div className="mt-4 space-y-4">
            {bookings.length ? (
              bookings.map((booking) => (
                <div key={booking.id} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-800">
                  <h3 className="text-lg font-black">{booking.listingName}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{booking.fieldLocation}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{booking.status}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">No bookings yet.</p>
            )}
          </div>
        </section>
        <section className="kk-card">
          <h2 className="text-xl font-black">Payments</h2>
          <div className="mt-4 space-y-4">
            {payments.length ? (
              payments.map((payment) => (
                <div key={payment.id} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-lg font-black">₹{payment.amount}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{payment.method}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{payment.status}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">No payments yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
