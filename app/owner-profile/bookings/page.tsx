import { updateBookingStatusFormAction } from "@/lib/actions/local-data";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings } from "@/lib/server/firebase-data";

export default async function BookingsManagementPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const bookings = await getOwnerBookings(session.user.id);
  const active = bookings.filter((booking) => booking.status === "active" || booking.status === "confirmed");
  const upcoming = bookings.filter((booking) => booking.status === "upcoming" || booking.status === "pending");

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface mb-2 font-headline">Bookings Management</h1>
          <p className="text-on-surface-variant">Manage your local test bookings and request approvals.</p>
        </div>
        <div className="inline-flex p-1 bg-surface-container dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="px-6 py-2.5 rounded-lg bg-primary-container text-white font-bold text-sm shadow-sm transition-all">Active ({active.length})</div>
          <div className="px-6 py-2.5 rounded-lg text-on-surface-variant dark:text-slate-400 font-semibold text-sm">Upcoming ({upcoming.length})</div>
        </div>
      </div>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    {booking.status}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{booking.id}</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">
                  {booking.listing?.name || "Equipment"}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  {booking.renterProfile?.fullName || "Renter"} • {booking.startDate} to {booking.endDate}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Amount: ₹{booking.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {booking.status === "pending" ? (
                  <>
                    <form action={updateBookingStatusFormAction.bind(null, booking.id, "confirmed")}>
                      <button className="px-4 py-2 bg-primary-container text-white rounded-lg text-sm font-bold">
                        Approve
                      </button>
                    </form>
                    <form action={updateBookingStatusFormAction.bind(null, booking.id, "cancelled")}>
                      <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300">
                        Decline
                      </button>
                    </form>
                  </>
                ) : null}

                {booking.status === "confirmed" || booking.status === "upcoming" ? (
                  <form action={updateBookingStatusFormAction.bind(null, booking.id, "active")}>
                    <button className="px-4 py-2 border border-emerald-200 dark:border-emerald-900/40 rounded-lg text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      Mark Active
                    </button>
                  </form>
                ) : null}

                {booking.status === "active" ? (
                  <form action={updateBookingStatusFormAction.bind(null, booking.id, "completed")}>
                    <button className="px-4 py-2 border border-emerald-200 dark:border-emerald-900/40 rounded-lg text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      Complete
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {!bookings.length ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-sm text-slate-500 dark:text-slate-400">
            No bookings are attached to this owner account yet.
          </div>
        ) : null}
      </div>
    </>
  );
}


