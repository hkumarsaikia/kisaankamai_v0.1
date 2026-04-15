import { getCurrentSession } from "@/lib/server/local-auth";
import { getRenterPayments } from "@/lib/server/local-data";

export default async function PaymentsPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const payments = await getRenterPayments(session.user.id);
  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments.filter((payment) => payment.status === "processing").reduce((sum, payment) => sum + payment.amount, 0);
  const refunded = payments.filter((payment) => payment.status === "refunded").reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <>
      <div>
        <h2 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-50">Financial Overview</h2>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-container to-[#00251a] text-white p-6 rounded-xl relative overflow-hidden">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Total Spent</p>
          <h3 className="text-3xl font-extrabold mb-1">₹{totalSpent.toLocaleString("en-IN")}</h3>
          <p className="text-emerald-200/60 text-xs">All recorded payment activity</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Paid</p>
          <h3 className="text-3xl font-extrabold text-emerald-900 dark:text-white mb-1">₹{payments.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0).toLocaleString("en-IN")}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Pending</p>
          <h3 className="text-3xl font-extrabold text-emerald-900 dark:text-white mb-1">₹{pending.toLocaleString("en-IN")}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Refunded</p>
          <h3 className="text-3xl font-extrabold text-emerald-900 dark:text-white mb-1">₹{refunded.toLocaleString("en-IN")}</h3>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-on-surface">Transaction History</h3>
          <span className="text-sm font-bold text-primary">{payments.length} records</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-primary font-bold">{payment.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-on-surface">{payment.bookingId}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{payment.createdAt.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">₹{payment.amount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{payment.method}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${payment.status === "paid" ? "bg-green-100 text-green-800" : payment.status === "refunded" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!payments.length ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-slate-500 dark:text-slate-400" colSpan={6}>
                    No payment history yet for this renter account.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
