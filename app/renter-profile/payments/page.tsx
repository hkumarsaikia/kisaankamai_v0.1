"use client";

const transactions = [
  { id: "TXN-4012", equip: "Mahindra Novo 605 DI-i", date: "Nov 14, 2024", amount: "₹9,600", status: "paid", method: "UPI" },
  { id: "TXN-3998", equip: "John Deere Rotavator", date: "Nov 10, 2024", amount: "₹2,400", status: "paid", method: "Bank Transfer" },
  { id: "TXN-3945", equip: "Powertrac 439 Plus", date: "Nov 06, 2024", amount: "₹3,400", status: "paid", method: "UPI" },
  { id: "TXN-3901", equip: "DJI Agras T40", date: "Nov 02, 2024", amount: "₹1,800", status: "refunded", method: "UPI" },
  { id: "TXN-3855", equip: "Sonalika Worldtrac", date: "Oct 28, 2024", amount: "₹5,600", status: "paid", method: "Cash" },
];

export default function PaymentsPage() {
  return (
    <>
      <div>
        <h2 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-50">
          Financial Overview / आर्थिक सारांश
        </h2>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-container to-[#00251a] text-white p-6 rounded-xl relative overflow-hidden">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Total Spent</p>
          <h3 className="text-3xl font-extrabold mb-1">₹1,42,500</h3>
          <p className="text-emerald-200/60 text-xs">All time</p>
          <div className="absolute -right-4 -bottom-4 opacity-10"><span className="material-symbols-outlined text-[5rem]">payments</span></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">This Month</p>
          <h3 className="text-3xl font-extrabold text-emerald-900 dark:text-white mb-1">₹18,200</h3>
          <p className="text-emerald-600 text-xs font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span>+12% vs last month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Pending</p>
          <h3 className="text-3xl font-extrabold text-emerald-900 dark:text-white mb-1">₹4,300</h3>
          <p className="text-amber-600 text-xs font-bold">2 invoices pending</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Rentals</p>
          <h3 className="text-3xl font-extrabold text-emerald-900 dark:text-white mb-1">14</h3>
          <p className="text-slate-400 text-xs">Lifetime bookings</p>
        </div>
      </section>

      {/* Transactions Table */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-on-surface">Transaction History</h3>
          <button className="text-sm font-bold text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">download</span> Download Report
          </button>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-primary font-bold">{tx.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-on-surface">{tx.equip}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">{tx.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{tx.method}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${tx.status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                      {tx.status === "paid" ? "Paid" : "Refunded"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
