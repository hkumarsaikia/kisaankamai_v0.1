import Image from "next/image";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getRenterBookings } from "@/lib/server/local-data";

const statusConfig: Record<string, string> = {
  active: "bg-amber-100 text-amber-800",
  upcoming: "bg-blue-100 text-blue-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  pending: "bg-slate-100 text-slate-700",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function MyBookingsPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const bookings = await getRenterBookings(session.user.id);

  return (
    <>
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tight mb-2">My Bookings</h1>
        <p className="text-slate-500">Track and manage all your equipment rentals</p>
      </div>

      <div className="flex flex-col gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-5 group hover:shadow-md transition-all">
            <div className="w-full md:w-40 h-40 md:h-auto rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
              <Image className="object-cover" alt={booking.listing?.name || "Equipment"} src={booking.listing?.coverImage || "/assets/generated/hero_tractor.png"} fill />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${statusConfig[booking.status] || "bg-slate-100 text-slate-700"}`}>{booking.status}</span>
                  <span className="text-slate-400 text-xs font-medium">#{booking.id}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-1">{booking.listing?.name || "Equipment"}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>{booking.listing?.district || "Maharashtra"}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Duration</p>
                    <p className="text-sm font-bold text-on-surface">{booking.startDate} to {booking.endDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Total</p>
                    <p className="text-sm font-bold text-on-surface">₹{booking.amount.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Owner</p>
                    <p className="text-sm font-bold text-on-surface">{booking.ownerProfile?.fullName || "Owner"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!bookings.length ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-sm text-slate-500 dark:text-slate-400">
            No renter bookings yet. Use the browse page to book equipment.
          </div>
        ) : null}
      </div>
    </>
  );
}

