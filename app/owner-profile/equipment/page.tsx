"use client";

import Link from "next/link";

export default function MyEquipmentPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl font-black text-emerald-950 dark:text-emerald-50 font-headline tracking-tight">My Equipment</h1>
         <Link href="/owner-profile/add-listing" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span> Add New
         </Link>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Listings</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">05</h3>
            <p className="text-xs text-emerald-600 font-bold mt-1">Manage all assets</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">list_alt</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active (सक्रिय)</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">04</h3>
            <p className="text-xs text-emerald-600/70 font-medium mt-1">Available for rent</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Paused (थांबवलेले)</p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">01</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Hidden from marketplace</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 group-hover:-rotate-6 transition-transform">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>pause_circle</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 pl-4 pr-10 rounded-lg text-sm font-semibold focus:ring-emerald-500 focus:border-emerald-500 outline-none">
              <option>All Types (सर्व प्रकार)</option>
              <option>Tractor</option>
              <option>Rotavator</option>
              <option>Harvester</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
          </div>
          <div className="relative">
            <select className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 pl-4 pr-10 rounded-lg text-sm font-semibold focus:ring-emerald-500 focus:border-emerald-500 outline-none">
              <option>District (जिल्हा)</option>
              <option>Satara</option>
              <option>Sangli</option>
              <option>Kolhapur</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">location_on</span>
          </div>
          <div className="relative">
            <select className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 pl-4 pr-10 rounded-lg text-sm font-semibold focus:ring-emerald-500 focus:border-emerald-500 outline-none">
              <option>Status</option>
              <option>Active</option>
              <option>Paused</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">toggle_on</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">View:</span>
          <button className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg"><span className="material-symbols-outlined shrink-0 text-[20px]">grid_view</span></button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"><span className="material-symbols-outlined shrink-0 text-[20px]">list</span></button>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Add New Listing Card (Empty State) */}
        <Link href="/owner-profile/add-listing" className="border-2 border-dashed border-emerald-900/20 dark:border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all group cursor-pointer h-full min-h-[380px]">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl">add</span>
          </div>
          <h4 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">New Equipment?</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[240px] mb-6">List your tractor or harvester and start earning today.</p>
          <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all">Add Listing (नवीन नोंदणी करा)</button>
        </Link>
        
        {/* Equipment Card 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
          <div className="relative h-52 overflow-hidden shrink-0">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="modern red tractor parked in a vibrant green Indian farm field during daylight, high resolution editorial style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEpws_jPceK3Mfw7NV_qefZa8HXQa3AkPdyewZZZB8wTWEMlsIU251G6TP-svuqI2NxHZFdRNOarWHD5qDuXbypEwBCwGQnFwoymRI3NZDpe8qz0YDuFa7kpfv2Na8RG5qxJPdWcUESzmomOIv8Z0tOZMPjEcQRAqqmRQ-lwqzNsoX0iDZbprQamtPcRpUTZKDZjRVnUZV_Y5pUirZ2kQLqZfbUByU21N48WsMmzdUP7gJ9UpEalqmwOVSa7NzpGTNFDVQjuHC0nq1"loading="lazy" decoding="async" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">Tractor</span>
              <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">Active</span>
            </div>
            <div className="absolute top-4 right-4">
              <button className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-slate-700 dark:text-white shadow-md">
                <span className="material-symbols-outlined text-lg">more_vert</span>
              </button>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Mahindra Novo 755</h4>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-sm">location_on</span> Karad, Satara
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Rate</p>
                <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">₹850<span className="text-xs font-medium text-slate-500">/hr</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Bookings</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">event_repeat</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200">24 Times</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Earnings</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">payments</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200">₹42,500</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-3 text-xs font-bold text-slate-600 dark:text-slate-400">Visible</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">View Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Card 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
          <div className="relative h-52 overflow-hidden shrink-0">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="heavy-duty agricultural rotavator attachment for tractor, industrial close-up in a rural workshop setting, sharp focus" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArNo-Mgzb0iDHsNxc4R9uRz7SJlgpbhbjPPU8HIymVBn8V99yqFc_NZ24zOV5ls_LJlxHvO8of8B48xIMS4fYEJtvkO0buUhQ4HDcv5Pdjky4YlbnLS8qyl3z_qfR_Ro5qLgDRWSFpJGciG6lSyQ5tQ-4SlXUOeygHMWP9rxujoIIdrXH3vY1ZJuQSS8uIATzYvG-haMhLhO97M6FPH459aLjG-b4RlLWCNLL_waaIyd7kTUtSQEqRhRuhuSUZL3s5MtiSEMmiRiKr"loading="lazy" decoding="async" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">Rotavator</span>
              <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">Paused</span>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Shaktiman Multi Speed</h4>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-sm">location_on</span> Wai, Satara
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Rate</p>
                <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">₹400<span className="text-xs font-medium text-slate-500">/hr</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 opacity-60">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Bookings</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">event_repeat</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200">12 Times</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 opacity-60">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Earnings</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">payments</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200">₹18,200</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-3 text-xs font-bold text-slate-400">Hidden</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
