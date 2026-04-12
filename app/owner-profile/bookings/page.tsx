"use client";

import Link from "next/link";

export default function BookingsManagementPage() {
  return (
    <>
      {/* Page Header & Tab Segmented Control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface mb-2 font-headline">Bookings Management</h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            बुक केलेल्या उपकरणांचे व्यवस्थापन करा | Manage your equipment bookings
          </p>
        </div>
        <div className="inline-flex p-1 bg-surface-container dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button className="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-bold text-sm shadow-sm transition-all text-white">
            Active (4)
          </button>
          <button className="px-6 py-2.5 rounded-lg text-on-surface-variant dark:text-slate-400 font-semibold text-sm hover:text-primary dark:hover:text-emerald-400 transition-all">
            Upcoming (2)
          </button>
          <button className="px-6 py-2.5 rounded-lg text-on-surface-variant dark:text-slate-400 font-semibold text-sm hover:text-primary dark:hover:text-emerald-400 transition-all">
            History
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Bookings Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Booking Card 1: Pending Approval */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-bl-xl text-[10px] font-black uppercase tracking-widest text-slate-800">
              Pending Approval
            </div>
            <div className="flex flex-col md:flex-row gap-6 mt-2">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Front view of a powerful modern red tractor working in a sunlit wheat field in India" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwC-t3Q4wKp7hBtuFYrZIHjQas-YqDQ6ZEmaqb8lZ_9HYCM00VAq-8AIiUuvRIzJts0MfQogIvLwzRpKF0Z8wwJQVqJqA4FcBxg3BUAcs4OAJDtXGswqEvvdlJGb49Lr7_rSt03I9YLKs6B4SvUCEOxY0E4r_6zs-7PImSP-gsb4NT1Hj4pSzLx8rCIO5gTIyMRdPq6eLHNU4Uhk-Dlqp5H7BVH-Vd_cQV5auaJbDTUNogRl0n9oschvtDf4P3tckWt3wg5yuQul1M"loading="lazy" decoding="async" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Mahindra 575 DI XP Plus</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      Sangli District, Maharashtra
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-900 dark:text-emerald-400">₹4,200</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Est. Total Earnings</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 dark:border-slate-800/50 mb-6">
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Renter</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-container text-[10px] text-white flex items-center justify-center font-bold">RK</div>
                      <span className="text-sm font-bold text-on-surface dark:text-slate-200">Rajesh Kulkarni</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Dates</p>
                    <span className="text-sm font-bold text-on-surface dark:text-slate-200">Oct 24 - Oct 26 (3 Days)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 bg-primary-container text-white py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span> Approve
                  </button>
                  <button className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Decline</button>
                  <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined">chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card 2: Confirmed/Ongoing */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-primary-container text-white px-4 py-1.5 rounded-bl-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Ongoing
            </div>
            <div className="flex flex-col md:flex-row gap-6 mt-2">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <img className="w-full h-full object-cover" alt="Close-up of a high-tech agricultural harvester machinery focusing on the mechanical blades with dust in the air" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANh8zccqtzvRJXpuUmCAiz_1k362JD_kn7pR4zhgHxCM39TSavsHzr8rmmqpwXbSzEDSnpOBzQy6uv0pEMBYLxKXkujzI2_5FPZbC7l_DQ_MXlRgeWgZe_ftsujjriztX5a6QwgKJsTFhvaUA7Afvsdw-3pki0KbXZVuEIBGMHj2NpG4UlqYutzGXzhc29tecjEgWXH-516XhP2Qr5LVsHG1z8nrg8HJjfDi9rCtSHxze3ea9sHm_wsqeCjCzwLeLevAfpE7rI0pwd"loading="lazy" decoding="async" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Swaraj 744 FE Rotavator</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      Satara, Maharashtra
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-900 dark:text-emerald-400">₹2,850</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Current Earnings</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 dark:border-slate-800/50 mb-6">
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Renter</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary-container text-slate-900 text-[10px] flex items-center justify-center font-bold">SM</div>
                      <span className="text-sm font-bold text-on-surface dark:text-slate-200">Sunil Mane</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">End Time</p>
                    <span className="text-sm font-bold text-on-surface dark:text-slate-200">Today, 06:00 PM</span>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 pb-2 md:pb-0">
                    <span className="material-symbols-outlined text-[20px]">contact_phone</span>
                    <span className="text-sm font-bold">+91 98765 43210</span>
                  </div>
                  <div className="flex w-full md:w-auto gap-2">
                    <button className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Extend</button>
                    <button className="flex-1 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors">End Session</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card 3: Upcoming */}
          <div className="bg-surface-container-lowest dark:bg-slate-900/50 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 border-dashed opacity-80 hover:opacity-100 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-3xl">agriculture</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Upcoming Oct 28</span>
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-50">Kubota Seeder Attachment</h4>
                  <p className="text-xs text-slate-500 font-medium">Customer: Amit Pawar • ₹1,200 total</p>
                </div>
              </div>
              <button className="text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-tighter hover:underline">View Readiness Notes</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Widgets */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          {/* Calendar Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-emerald-950 dark:text-emerald-50">Availability Calendar</h3>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-500">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-500">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-bold text-on-surface dark:text-white mb-4">October 2024</p>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase mb-2">
                <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center items-center">
                <div className="p-2 text-slate-300 dark:text-slate-600 text-xs">20</div>
                <div className="p-2 text-slate-300 dark:text-slate-600 text-xs">21</div>
                <div className="p-2 text-slate-300 dark:text-slate-600 text-xs">22</div>
                <div className="p-2 text-slate-800 dark:text-slate-200 text-xs font-medium">23</div>
                <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold relative group cursor-pointer shadow-sm">
                  24
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white p-2 rounded text-[10px] w-24 z-10 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all origin-bottom">
                     Tractor Booking
                  </div>
                </div>
                <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold shadow-sm">25</div>
                <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold shadow-sm">26</div>
                <div className="p-2 text-slate-800 dark:text-slate-200 text-xs font-medium">27</div>
                <div className="p-2 bg-primary-container text-white rounded-lg text-xs font-bold shadow-sm">28</div>
                <div className="p-2 text-slate-800 dark:text-slate-200 text-xs font-medium">29</div>
                <div className="p-2 text-slate-800 dark:text-slate-200 text-xs font-medium">30</div>
                <div className="p-2 text-slate-800 dark:text-slate-200 text-xs font-medium">31</div>
                <div className="p-2 text-slate-300 dark:text-slate-600 text-xs">1</div>
                <div className="p-2 text-slate-300 dark:text-slate-600 text-xs">2</div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded bg-secondary-container"></span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Pending Approvals</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded bg-primary-container"></span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Confirmed / Ongoing</span>
              </div>
            </div>
          </div>

          {/* Quick Earnings Widget */}
          <div className="bg-primary-container rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-black text-emerald-400/80 tracking-widest mb-1">Weekly Potential</p>
              <h3 className="text-3xl font-black mb-4">₹12,450</h3>
              <div className="flex items-center gap-2 text-sm text-emerald-300 mb-6">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+18% from last week</span>
              </div>
              <Link href="/owner-profile/revenue" className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span> View Full Report
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
          </div>

          {/* History / Activity Sidebar */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Recently Completed</h4>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface dark:text-slate-200">John Deere 5050D</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Earnings: ₹5,500 • Oct 18</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 transition-colors text-[18px]">arrow_forward_ios</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
