"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function OwnerDashboardPage() {
  const { user, profile } = useAuth();
  const userName = user?.name || profile?.fullName || "Owner";

  return (
    <>
      {/* Welcome & Quick Actions Strip */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-emerald-950 dark:text-emerald-50 font-headline tracking-tight">
            Namaste, {userName.split(" ")[0]} ji! <span className="text-emerald-600 font-medium text-xl ml-2">नमस्ते!</span>
          </h2>
          <p className="text-on-surface-variant dark:text-slate-400 font-medium mt-1">Ready to manage your fleet today?</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 p-1 bg-surface-container-high dark:bg-slate-900 rounded-xl border border-outline-variant dark:border-slate-800 shadow-sm">
          <Link href="/owner-dashboard/add-listing" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Listing
          </Link>
          <Link href="/owner-dashboard/bookings" className="flex items-center gap-2 px-4 py-2 text-primary dark:text-primary-fixed font-bold text-sm hover:bg-primary-container/10 rounded-lg transition-all">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            View Bookings
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 text-primary dark:text-primary-fixed font-bold text-sm hover:bg-primary-container/10 rounded-lg transition-all">
            <span className="material-symbols-outlined text-sm">update</span>
            Availability
          </button>
        </div>
      </section>

      {/* KPI Grid & Dashboard Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left 2/3 Content */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          {/* KPI Cards Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-8xl">agriculture</span>
              </div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Listings</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-950 dark:text-emerald-50">12</span>
                <span className="text-emerald-600 text-xs font-bold">+2 this week</span>
              </div>
            </div>
            
            <div className="bg-emerald-50/20 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-slate-800 flex flex-col gap-2 relative overflow-hidden group border-l-4 border-l-secondary">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">New Requests</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-950 dark:text-emerald-50">03</span>
                <span className="px-2 py-0.5 bg-secondary text-white text-[10px] rounded-full font-bold animate-pulse">ACTION NEEDED</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-2 relative overflow-hidden group">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Payments</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-950 dark:text-emerald-50">₹24.5k</span>
                <span className="text-emerald-600 text-[10px] font-bold py-1 px-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">PROCESSING</span>
              </div>
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-emerald-950 dark:text-emerald-50 text-lg">Revenue Overview</h3>
              <select className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none">
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
            </div>
            {/* Chart Area */}
            <div className="h-64 w-full flex items-end justify-between gap-2 md:gap-4 px-2 select-none pt-8 border-b border-l border-slate-100 dark:border-slate-800 relative">
              <div className="absolute top-0 left-0 text-[10px] text-slate-400 font-bold -translate-x-full pr-2">₹50k</div>
              <div className="absolute top-1/2 left-0 text-[10px] text-slate-400 font-bold -translate-x-full pr-2">₹25k</div>
              
              <div className="w-1/6 bg-emerald-100 dark:bg-emerald-900/30 rounded-t-sm h-[30%] relative group cursor-pointer hover:bg-emerald-200 transition-colors"><span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity">₹12k</span></div>
              <div className="w-1/6 bg-emerald-200 dark:bg-emerald-800/40 rounded-t-sm h-[50%] relative group cursor-pointer hover:bg-emerald-300 transition-colors"><span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity">₹21k</span></div>
              <div className="w-1/6 bg-emerald-300 dark:bg-emerald-700/50 rounded-t-sm h-[40%] relative group cursor-pointer hover:bg-emerald-400 transition-colors"><span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity">₹18k</span></div>
              <div className="w-1/6 bg-emerald-400 dark:bg-emerald-600/60 rounded-t-sm h-[75%] relative group cursor-pointer hover:bg-emerald-500 transition-colors"><span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity">₹35k</span></div>
              <div className="w-1/6 bg-emerald-500 dark:bg-emerald-500/80 rounded-t-sm h-[60%] relative group cursor-pointer hover:bg-emerald-600 transition-colors"><span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity">₹28k</span></div>
              <div className="w-1/6 bg-emerald-600 dark:bg-emerald-400 rounded-t-sm h-[90%] relative group cursor-pointer hover:bg-emerald-700 transition-colors"><span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity">₹42k</span></div>
            </div>
            <div className="flex justify-between px-4 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>

          {/* Popular Equipment List */}
          <section className="flex flex-col gap-4">
            <h3 className="font-black text-emerald-950 dark:text-emerald-50 text-lg uppercase tracking-wide">Top Performing Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group">
                <div className="h-32 w-full relative">
                  <img alt="Performance" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1592982537447-6f2a6a0a030e?q=80&w=2940&auto=format&fit=crop" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded">MOST POPULAR</span>
                </div>
                <div className="p-4 flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-emerald-950 dark:text-emerald-50">Mahindra Arjun 605</h4>
                    <p className="text-xs text-slate-500">22 Bookings this month</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-700 font-black">₹18,200</span>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Earned</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group">
                <div className="h-32 w-full relative">
                  <img alt="Performance" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1601614742567-c10006da7715?q=80&w=2938&auto=format&fit=crop" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-tertiary text-white text-[10px] font-black px-2 py-1 rounded">HIGH RATING</span>
                </div>
                <div className="p-4 flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-emerald-950 dark:text-emerald-50">Rotavator 7-feet HD</h4>
                    <p className="text-xs text-slate-500">14 Bookings this month</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-700 font-black">₹12,450</span>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Earned</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Utility Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          {/* Mini Calendar Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-emerald-950 dark:text-emerald-50 text-sm uppercase tracking-wide">June 2024</h4>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2 text-slate-400 font-bold">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              <span className="p-1 text-slate-300 dark:text-slate-700">27</span><span className="p-1 text-slate-300 dark:text-slate-700">28</span><span className="p-1 text-slate-300 dark:text-slate-700">29</span><span className="p-1 text-slate-300 dark:text-slate-700">30</span><span className="p-1 text-slate-300 dark:text-slate-700">31</span><span className="p-1 font-medium">1</span><span className="p-1 font-medium">2</span>
              <span className="p-1 font-medium">3</span><span className="p-1 font-medium">4</span><span className="p-1 font-medium">5</span><span className="p-1 font-medium">6</span><span className="p-1 font-medium">7</span><span className="p-1 font-medium">8</span><span className="p-1 font-medium">9</span>
              <span className="p-1 font-medium">10</span><span className="p-1 font-medium">11</span><span className="p-1 bg-secondary text-white rounded-full font-bold shadow-md">12</span><span className="p-1 font-medium">13</span><span className="p-1 font-medium">14</span><span className="p-1 font-medium">15</span><span className="p-1 font-medium">16</span>
              <span className="p-1 font-medium">17</span><span className="p-1 font-medium">18</span><span className="p-1 font-medium">19</span><span className="p-1 font-medium">20</span><span className="p-1 font-medium">21</span><span className="p-1 font-medium">22</span><span className="p-1 font-medium">23</span>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 bg-secondary rounded-full"></div>
                <div>
                  <p className="text-xs font-black text-emerald-950 dark:text-emerald-50 uppercase tracking-tight">Today&apos;s Rental</p>
                  <p className="text-xs text-slate-500">Pick-up: Tractor at 10:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Earnings Summary */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-black text-emerald-950 dark:text-emerald-50 text-sm uppercase tracking-wide mb-6">Recent Payments</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg text-lg">account_balance_wallet</span>
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Bank Transfer</p>
                    <p className="text-[10px] text-slate-400">June 10, 2024</p>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">+ ₹13,200</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg text-lg">account_balance_wallet</span>
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">UPI Payment</p>
                    <p className="text-[10px] text-slate-400">June 08, 2024</p>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">+ ₹11,850</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-xs font-black text-slate-500 hover:border-emerald-100 dark:hover:border-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all uppercase tracking-widest">Withdraw Funds</button>
          </div>

          {/* Quick Support Card */}
          <div className="bg-emerald-950 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10">
              <span className="material-symbols-outlined text-8xl text-white">support_agent</span>
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-wide mb-2">Need Help?</h4>
            <p className="text-emerald-300 text-xs font-medium mb-6 leading-relaxed">Stuck somewhere? Our agritech specialists are here to assist you.</p>
            <div className="flex flex-col gap-2 relative z-10">
              <button className="w-full py-2 bg-emerald-500 text-emerald-950 font-bold text-xs rounded-lg hover:brightness-110 transition-all">Chat Now</button>
              <button className="w-full py-2 bg-white/10 text-white font-bold text-xs rounded-lg hover:bg-white/20 transition-all">Call Relationship Manager</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
