import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerPayments, getOwnerBookings } from "@/lib/server/local-data";

export default async function EarningsDashboard() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const [payments, bookings] = await Promise.all([
    getOwnerPayments(session.user.id),
    getOwnerBookings(session.user.id),
  ]);

  const lifetime = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments
    .filter((payment) => payment.status === "processing")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const paid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-primary dark:text-emerald-400 tracking-tight">Revenue Analytics</h2>
          <p className="text-on-surface-variant dark:text-slate-400 font-medium">Local owner payouts and booking-linked revenue records.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-on-surface-variant dark:text-slate-400 text-sm font-semibold mb-1">Lifetime Earnings</p>
          <h3 className="text-3xl font-black text-primary dark:text-white">₹{lifetime.toLocaleString("en-IN")}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-on-surface-variant dark:text-slate-400 text-sm font-semibold mb-1">Paid Out</p>
          <h3 className="text-3xl font-black text-primary dark:text-white">₹{paid.toLocaleString("en-IN")}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-on-surface-variant dark:text-slate-400 text-sm font-semibold mb-1">Pending Payouts</p>
          <h3 className="text-3xl font-black text-primary dark:text-white">₹{pending.toLocaleString("en-IN")}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h4 className="font-bold text-primary dark:text-white">Payout History</h4>
          <div className="text-sm font-bold text-slate-500">{bookings.length} linked bookings</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{payment.createdAt.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary dark:text-emerald-50">{payment.bookingId}</td>
                  <td className="px-6 py-4 text-sm font-black text-primary dark:text-emerald-400">₹{payment.amount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface dark:text-slate-400">{payment.method}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${payment.status === "paid" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : payment.status === "processing" ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!payments.length ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-slate-500 dark:text-slate-400" colSpan={5}>
                    No payout records yet for this owner account.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

