"use client";

export default function EarningsDashboard() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-primary dark:text-emerald-400 tracking-tight">Revenue Analytics</h2>
          <p className="text-on-surface-variant dark:text-slate-400 font-medium">Track your earnings and seasonal trends in Marathi and English.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors">
            <span className="material-symbols-outlined text-sm">calendar_today</span> Oct 1 - Oct 31, 2024
          </button>
          <button className="bg-primary hover:bg-primary-container dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
            <span className="material-symbols-outlined text-sm">download</span> Export Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm font-semibold mb-1 relative z-10">Lifetime Earnings</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <h3 className="text-3xl font-black text-primary dark:text-white">₹1,24,500</h3>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span> +12%
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-4 relative z-10">एकूण कमाई (Lifetime Earnings)</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/10 dark:bg-amber-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm font-semibold mb-1 relative z-10">This Month</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <h3 className="text-3xl font-black text-primary dark:text-white">₹42,800</h3>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span> +8.4%
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-4 relative z-10">या महिन्याची कमाई (This Month&apos;s Earnings)</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-fixed/10 dark:bg-blue-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm font-semibold mb-1 relative z-10">Pending Payouts</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <h3 className="text-3xl font-black text-primary dark:text-white">₹8,000</h3>
            <span className="text-secondary dark:text-amber-400 text-xs font-bold bg-secondary-container/20 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">Processing</span>
          </div>
          <p className="text-slate-400 text-xs mt-4 relative z-10">प्रलंबित देयके (Pending Payments)</p>
        </div>
      </div>

      {/* Charts & Insights Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Revenue Chart Container */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-primary dark:text-emerald-50">Monthly Growth Trends</h4>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">Revenue performance across the last 6 months</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-primary dark:bg-emerald-500"></span> Revenue</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-secondary dark:bg-amber-500"></span> Goal</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2 md:px-4 pt-4 border-l border-b border-slate-100 dark:border-slate-800 relative">
            <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-50 dark:opacity-20 pl-4">
              <div className="border-t border-slate-100 w-full"></div>
              <div className="border-t border-slate-100 w-full"></div>
              <div className="border-t border-slate-100 w-full"></div>
              <div className="border-t border-slate-100 w-full"></div>
            </div>
            {/* Chart Bars */}
            <div className="flex-1 flex flex-col justify-end items-center gap-2 group relative z-10">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[40%] group-hover:bg-primary/20 dark:group-hover:bg-emerald-900/50 transition-colors"></div>
              <span className="text-[10px] font-bold text-slate-400">MAY</span>
            </div>
            <div className="flex-1 flex flex-col justify-end items-center gap-2 group relative z-10">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[55%] group-hover:bg-primary/20 dark:group-hover:bg-emerald-900/50 transition-colors"></div>
              <span className="text-[10px] font-bold text-slate-400">JUN</span>
            </div>
            <div className="flex-1 flex flex-col justify-end items-center gap-2 group relative z-10">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[45%] group-hover:bg-primary/20 dark:group-hover:bg-emerald-900/50 transition-colors"></div>
              <span className="text-[10px] font-bold text-slate-400">JUL</span>
            </div>
            <div className="flex-1 flex flex-col justify-end items-center gap-2 group relative z-10">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[70%] group-hover:bg-primary/20 dark:group-hover:bg-emerald-900/50 transition-colors"></div>
              <span className="text-[10px] font-bold text-slate-400">AUG</span>
            </div>
            <div className="flex-1 flex flex-col justify-end items-center gap-2 group relative z-10">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[85%] group-hover:bg-primary/20 dark:group-hover:bg-emerald-900/50 transition-colors"></div>
              <span className="text-[10px] font-bold text-slate-400">SEP</span>
            </div>
            <div className="flex-1 flex flex-col justify-end items-center gap-2 group relative z-10">
              <div className="w-full bg-primary dark:bg-emerald-600 rounded-t-lg h-[95%] shadow-lg shadow-primary/10"></div>
              <span className="text-[10px] font-bold text-primary dark:text-emerald-400">OCT</span>
            </div>
          </div>
        </div>

        {/* Insight Card */}
        <div className="bg-primary dark:bg-slate-900 text-white p-6 rounded-xl shadow-xl flex flex-col justify-between relative overflow-hidden dark:border dark:border-slate-800">
          <div className="z-10">
            <span className="bg-secondary dark:bg-amber-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Seasonal Insight</span>
            <h4 className="text-xl font-bold mt-4 leading-tight">High Demand Expected for Harvesters</h4>
            <p className="text-emerald-100/70 dark:text-slate-300 text-sm mt-2 font-medium">Based on local crop cycles, demand for Harvesters in your district is expected to rise by 40% next month.</p>
          </div>
          <div className="mt-8 z-10">
            <button className="bg-white text-primary dark:bg-slate-800 dark:text-white px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors">Optimize My Listings</button>
            <p className="text-[10px] text-emerald-100/50 dark:text-slate-500 mt-3 text-center uppercase tracking-wider font-bold">हंगामी मागणी माहिती (Seasonal Insight)</p>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-800/40 dark:bg-emerald-900/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h4 className="font-bold text-primary dark:text-white">Recent Payout History</h4>
          <div className="flex flex-wrap gap-2">
            <button className="text-xs font-bold text-slate-500 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">All</button>
            <button className="text-xs font-bold text-primary dark:text-emerald-400 bg-primary-fixed dark:bg-emerald-900/50 px-3 py-1.5 rounded-lg">Paid</button>
            <button className="text-xs font-bold text-slate-500 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Processing</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Equipment</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Renter Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Oct 24, 2024</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                      <img className="w-full h-full object-cover" alt="Close-up of a modern bright red tractor parked in a golden wheat field during sunset with cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1x9ChW2Znkp7NnJ_fSKAOp1uPqxkm8JDgFzT_qJAfK116cP5bf688eq0P_VRMK3Huk7LXk1XhLkOEyZ2XUAW0Ta9kdj5wEDHpGIksDXY0fxjx3M3KkCa-6xPKGBINPd4qR134da5PIM1IFJBSipDBdnZY-e1uXIZfjDYB4BP-if52NdHSXGtZPiqrkxZPc-aH4tsVW9SrKsGATBBWIEi64kx0tN88RvakyQnyZ6Un6Q54qLsfi4NAqnhRHII9X7MTh0TawMMhcFf5"loading="lazy" decoding="async" />
                    </div>
                    <span className="text-sm font-bold text-primary dark:text-emerald-50">John Deere 5050D</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface dark:text-slate-400">Suresh Deshmukh</td>
                <td className="px-6 py-4 text-sm font-black text-primary dark:text-emerald-400">₹12,400</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">Paid</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 hover:text-primary dark:hover:text-emerald-400 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Oct 20, 2024</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                      <img className="w-full h-full object-cover" alt="Powerful combine harvester moving through a field of ripe grain with dust clouds under a clear blue sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-K7g-P38hUjSMLvfLXDF4G_Uurixet4C3zEfa6LGeqqYbILL08qlWVZrU9gqGaF_aKED60y9f4CvIRVl2b-WpTU_l8fbhGbfJqRFu2-ebg1k3BJaik167qh3ZBwtmNIUWFypyjnTOt3aFgRgBxvAqnIQfqXBTOaJcjHVZ90NfAq-Eozs-273JYOUtjTlkWnSdEN18HBvGxOK3ixiMeJmaHcEnbNfOzXAJjmzRMTvhwQ3R_ctvRMW9vHVMSUaxJBO2bNlrEPUp2wcQ"loading="lazy" decoding="async" />
                    </div>
                    <span className="text-sm font-bold text-primary dark:text-emerald-50">CLAAS Harvester</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface dark:text-slate-400">Prakash Patil</td>
                <td className="px-6 py-4 text-sm font-black text-primary dark:text-emerald-400">₹22,500</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">Paid</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 hover:text-primary dark:hover:text-emerald-400 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Oct 28, 2024</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                      <img className="w-full h-full object-cover" alt="Close-up of a modern bright red tractor parked in a golden wheat field during sunset with cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3CMLah2GUZRZqwN5g8ik-ycypmN0cC76GBTYQ4rn9e5Lf_bVN1U1ZZWPrwjk6lKBoFgcMEu4ktLGHXEKt184VRkQybpeuO96pbd9DJ1pEMZFaoeCYByaKypPVe7gQCeC9z-AZH-BgkjspLhKSOMs0OPMZnVnjqiQJUcatwJdfcKIX9swVRYsQOSAh4z6tzhbSKbIcKFjl66gf9rCN1CgUtH5-CH8UfZuTrJnmCun2c7c8nEFH6j99fDBRnUpH7TrvQpUwhTWdo5mw"loading="lazy" decoding="async" />
                    </div>
                    <span className="text-sm font-bold text-primary dark:text-emerald-50">Rotavator 7ft</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface dark:text-slate-400">Amol Shinde</td>
                <td className="px-6 py-4 text-sm font-black text-primary dark:text-emerald-400">₹8,000</td>
                <td className="px-6 py-4">
                  <span className="bg-tertiary-fixed dark:bg-teal-900/30 text-tertiary-container dark:text-teal-400 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">Processing</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 hover:text-primary dark:hover:text-emerald-400 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
          <button className="text-sm font-bold text-primary dark:text-emerald-400 hover:underline">View All Transactions</button>
        </div>
      </div>
    </>
  );
}
