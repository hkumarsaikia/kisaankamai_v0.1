"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageContext";

export default function RenterDashboardPage() {
  const router = useRouter();
  const { langText } = useLanguage();

  return (
    <div className="bg-background text-on-background antialiased flex dark:bg-slate-950">
      {/* Fixed Left Sidebar */}
      <aside className="h-screen w-72 border-r border-outline-variant fixed left-0 top-0 bg-white dark:bg-slate-950 dark:border-slate-800 flex flex-col z-50 hidden lg:flex">
        {/* Brand Logo */}
        <div className="px-6 py-8 space-y-4">
          <div className="text-xl font-extrabold text-primary-container dark:text-emerald-300 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-3xl">agriculture</span>
          Kisan Kamai
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle compact />
          </div>
        </div>
        {/* Renter Profile Card */}
        <div className="px-6 pb-6">
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Namdev Patil" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCypyV6vB27-5Ov9O_ybFC-9gBMqaj3f9_xbNmzqzVylXlYvQ-XaaXofIh5yHi9IttHfsDt4oMBL2VvHG7PA3TwEHQ4n-riP_kq87RVVir_aH2Cc4eQBdk8rfgF536Y04CDVfGiGKw6in9wgPvw6L2NpClYozhmFDsSuJCmFELPlYaMT2CTwI7aGObjxAp7jpUHBEBmjIc-vJq9Lvkc5Js_xQ6ReiaF3A7toq9qJH0krHUFs44rhRVGP7ylmHcScrpzm9_84jHTrAlp"/>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-on-surface truncate">Namdev Patil</p>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span> {langText("Satara, MH", "सातारा, महाराष्ट्र")}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">{langText("Trusted Renter", "विश्वासू भाडेकरू")}</span>
              <span className="text-[10px] font-medium text-on-surface-variant italic">ID: KK-9281</span>
            </div>
          </div>
        </div>
        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1">
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-container font-bold bg-surface-container-high border-r-4 border-primary-container transition-all" href="#">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span>
            {langText("Dashboard", "डॅशबोर्ड")}
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all" href="/rent-equipment">
            <span className="material-symbols-outlined">explore</span>
            {langText("Browse Equipment", "अवजारे पाहा")}
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all" href="#">
            <span className="material-symbols-outlined">calendar_month</span>
            {langText("My Bookings", "माझी बुकिंग्ज")}
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all" href="#">
            <span className="material-symbols-outlined">bookmark</span>
            {langText("Saved Equipment", "जतन केलेली अवजारे")}
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all" href="#">
            <span className="material-symbols-outlined">payments</span>
            {langText("Payments", "पेमेंट्स")}
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all" href="#">
            <span className="material-symbols-outlined">settings</span>
            {langText("Settings", "सेटिंग्ज")}
          </Link>
        </nav>
        {/* Switch Role + Footer Actions */}
        <div className="px-4 py-6 border-t border-outline-variant/30 dark:border-slate-800 space-y-1">
          <button
            onClick={() => router.push("/owner-dashboard")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-secondary bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
          >
            <span className="material-symbols-outlined text-secondary">swap_horiz</span> {langText("Switch to Owner Profile", "मालक प्रोफाइलकडे जा")}
          </button>
          <div className="px-4 py-2">
            <LanguageToggle compact className="w-full justify-center" />
          </div>
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-error hover:bg-red-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined">logout</span> {langText("Logout", "लॉगआउट")}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-72 flex-1 flex flex-col min-h-screen">
        {/* Top Navigation / Header area */}
        <header className="h-20 bg-white/80 dark:bg-slate-950/85 backdrop-blur-md sticky top-0 px-6 lg:px-10 flex items-center justify-between border-b border-outline-variant/20 dark:border-slate-800 z-40">
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-on-surface dark:text-slate-100 leading-tight">{langText("Renter Dashboard / शेतकरी डॅशबोर्ड", "शेतकरी डॅशबोर्ड / Renter Dashboard")}</h1>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">{langText("Welcome back, Namdev. You have 2 active bookings.", "पुन्हा स्वागत आहे, नामदेव. तुमच्याकडे २ सक्रिय बुकिंग्ज आहेत.")}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle compact />
            </div>
            <div className="hidden sm:flex bg-surface-container-low dark:bg-slate-900/60 p-1 rounded-full border border-outline-variant/30 dark:border-slate-800">
              <button className="px-5 py-1.5 text-xs font-bold rounded-full bg-primary-container text-white shadow-sm">{langText("Current", "सध्याचे")}</button>
              <button className="px-5 py-1.5 text-xs font-medium rounded-full text-on-surface-variant dark:text-slate-400 hover:text-on-surface transition-colors">{langText("Upcoming", "पुढील")}</button>
              <button className="px-5 py-1.5 text-xs font-medium rounded-full text-on-surface-variant dark:text-slate-400 hover:text-on-surface transition-colors">{langText("History", "इतिहास")}</button>
            </div>
            <div className="w-10 h-10 rounded-full border border-outline-variant/30 dark:border-slate-800 flex items-center justify-center text-on-surface-variant dark:text-slate-400 cursor-pointer hover:bg-surface-container dark:hover:bg-slate-900/60 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-error rounded-full"></span>
            </div>
            {/* Mobile menu button */}
            <button className="lg:hidden p-2 text-on-surface dark:text-slate-200">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10 flex flex-col xl:flex-row gap-8">
          {/* Left Grid (Sections A, B, C) */}
          <div className="flex-1 space-y-10">
            {/* Section A: Active Booking Cards */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-on-surface dark:text-slate-100 flex items-center gap-2">
                  {langText("Active Bookings / सक्रिय बुकिंग्ज", "सक्रिय बुकिंग्ज / Active Bookings")}
                </h2>
                <Link className="text-primary-container text-sm font-bold hover:underline" href="#">{langText("View All", "सर्व पहा")}</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="bg-white border border-outline-variant/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary-container/5 transition-all group">
                  <div className="h-40 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="John Deere 5050D" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsrECKKQV6KB_aVIhfGHU3NZwr5wbps7eMTfSgp3Dc4-876XTdR4DbxF7YBY-ycJ8Kw4oUtSmp9b5hxUytx7Or0jc1nJbrDTCxJdTpGvrJDYkSdVNLWAD0KZ7A-fGGn9JnlvTy5z91YaL6NtvxvQSjJfAsKW8m6AHUBYuW89y4QU0I5AsCVanqidLzR3PsorIuvhrpegJHEG7jDlqWzZqbpvcVxrXhLB3FFIKT-DPLWWEAgHOMgfFt9mj58vuZgAT-7dvbWJCj0BuM"/>
                    <div className="absolute top-3 left-3 px-3 py-1 bg-primary-container text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
                      Confirmed
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-on-surface text-lg">John Deere 5050D</h3>
                      <p className="text-primary font-extrabold">₹3,500 <span className="text-xs text-on-surface-variant font-normal">/ day</span></p>
                    </div>
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">event</span> 12 Oct - 15 Oct (3 Days)
                      </div>
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">person</span> Owner: Amol Shinde
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 text-xs font-bold bg-primary-container text-white rounded-lg hover:opacity-90 transition-opacity">Track Order</button>
                      <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-xl">chat</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-outline-variant/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary-container/5 transition-all group">
                  <div className="h-40 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="Mahindra Rotavator" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB15SM3BX-16G88tZAvSYZYdz0_bLrzpiV9cAgBeo-OK3eHbVR5j6gboV7V8rAx_T07weF70XbDfjHxGn1EGdex1lVzhXvOi6Zf0qLlX1y0xsiz6lEWSqHxbmHlb_p-mS3-Ny3dRWd2egnv5bip0dF5bgG-_46ii0CZE68yWICuUUl4ZlYviYvHMgJDv8f7v0Ci_If4I0FSQ5iqLn_z6NWuyojonf3gSUoQA3-dt-48MkyBJ0lEYYKla4vfHLUlX21X6WVWOJ-sfGRv"/>
                    <div className="absolute top-3 left-3 px-3 py-1 bg-orange-400 text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
                      Pending Approval
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-on-surface text-lg">Mahindra Rotavator</h3>
                      <p className="text-primary font-extrabold">₹1,200 <span className="text-xs text-on-surface-variant font-normal">/ day</span></p>
                    </div>
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">event</span> 18 Oct - 19 Oct (1 Day)
                      </div>
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">person</span> Owner: Ravi Gaikwad
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 text-xs font-bold border border-primary-container text-primary-container rounded-lg hover:bg-emerald-50 transition-colors">Edit Request</button>
                      <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-xl">close</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section B: Recommended Equipment */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-on-surface">Recommended for You <span className="text-on-surface-variant font-normal">/ तुमच्यासाठी शिफारस</span></h2>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {/* Recommendation 1 */}
                <div className="flex-none w-64 bg-white rounded-xl border border-outline-variant/30 p-3 hover:border-primary-container transition-colors cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-32 object-cover rounded-lg mb-3" alt="Multicrop Seed Drill" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_HLz7VSN4J3FBfsFFmZMKP4-xNIgoaxhDdfeqzHQZfKVyV73fRjbpeZeqP1ql7nti2m5bFQaASrmR-ceTBMG-sXQmb7KojMkosbcfVw9sfRcglt9NMORgVWh_TG1vj0vU79-bHjDXLQAnjb8MXmh7x1CpRggdmBZHzu4-j1zm6G9wS0KWRJ89qebLOd8lCSRYn80aV9fvhL29ivtXEIe7RIv0fksRbBqBTBMXheRrz0XRX7YEXdNiOZAW_FcdLf79sWVi9PT1HTCd"/>
                  <p className="text-xs font-medium text-amber-800 mb-1">Seed Drills</p>
                  <h4 className="font-bold text-on-surface text-sm mb-2">Multicrop Seed Drill</h4>
                  <p className="text-primary-container font-extrabold text-sm">₹800 <span className="text-[10px] text-on-surface-variant font-normal">/ acre</span></p>
                </div>
                {/* Recommendation 2 */}
                <div className="flex-none w-64 bg-white rounded-xl border border-outline-variant/30 p-3 hover:border-primary-container transition-colors cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-32 object-cover rounded-lg mb-3" alt="Kubota Harvester DC-68G" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSZX-mOsMuIEggPZWypkGDd9h8d-B5TiXfMslfVJg8xO8-NMTQWUAU0wFieneSJ0vgQbuMk9dmVIZFRzvBLNJck-88KEX5KOa7hXLa5F9llVguI5jJDDCsbfaO9Qv5qpd9pL1H21tFTLPvOl3H-toiOZfYcqLjJGTD76fk12FItJG37moN9W438EuNOnu50V3AQzr8ibacy46ACpocN4WVp1ic7jXUUvL2EgcTbzjF_YZDDE8UEqN8B50rd4wf7gvFDrjyYJiAJSHL"/>
                  <p className="text-xs font-medium text-amber-800 mb-1">Harvesters</p>
                  <h4 className="font-bold text-on-surface text-sm mb-2">Kubota Harvester DC-68G</h4>
                  <p className="text-primary-container font-extrabold text-sm">₹2,200 <span className="text-[10px] text-on-surface-variant font-normal">/ hr</span></p>
                </div>
                {/* Recommendation 3 */}
                <div className="flex-none w-64 bg-white rounded-xl border border-outline-variant/30 p-3 hover:border-primary-container transition-colors cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-32 object-cover rounded-lg mb-3" alt="DJI Agras Drone T30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHBC3Q5y_ORwgMVwxwsCHq2-7TzwpuPoDFAjxMPd08EvK2lGpoUMgu0y72siAvWjIEY-PnYvF3uBI8k5hm6c9QGwDeqYUK1hVKO5rHPbQsn0qQWU7XIgFdQm97MHJq4TbX7jJf59B_TzcFUZFe3Hx4fRxSmUm_vafNMETiI5PQSfxCzw2z9cC4UgCOsiUPYEYBmgI2NZMnW4_BTz581yRN4GQkCczyESEYDjWkszzUdWohSDtNFzPORVE65rsxwkXi2NVQKbpD4-G4"/>
                  <p className="text-xs font-medium text-amber-800 mb-1">Sprayers</p>
                  <h4 className="font-bold text-on-surface text-sm mb-2">DJI Agras Drone T30</h4>
                  <p className="text-primary-container font-extrabold text-sm">₹450 <span className="text-[10px] text-on-surface-variant font-normal">/ acre</span></p>
                </div>
              </div>
            </section>

            {/* Section C: Recently Completed Rentals */}
            <section>
              <h2 className="text-lg font-bold text-on-surface mb-6">Recent History <span className="text-on-surface-variant font-normal">/ अलीकडील व्यवहार</span></h2>
              <div className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low border-b border-outline-variant/30">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Equipment</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img alt="Swaraj 744" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjKfTw_ch-hOlHGSR1zqO98qtRnuDaIrP0Un4I5m2wCBJ6sQcdwJC_VQAklPmJCaVm3MO5zM4eO-tMzONCrxyWTHoKABAk77naPbJhUg2o_Nw6DNF7gODR0V8k54D3xuo6WQJBqO5mbfNbTIevAmrADki54BJhE50zKHVt-mRqvjCrwkveb2eFTdTOBWjbM3MnXdiY6e06yy91xAHHhw2f2VvcllDWrkPM5obRWbyq8n69KoMmTjil9-4VSPMEo9v6d63DrptAny0Y"/>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface">Swaraj 744 FE</p>
                              <p className="text-[10px] text-on-surface-variant">Owner: Kiran Patil</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">22 Sep - 24 Sep</td>
                        <td className="px-6 py-4 text-sm font-bold text-on-surface">₹7,200</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Completed</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xs font-bold text-primary-container hover:underline">Re-book</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img alt="Disc Plough" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2kWK-2_mZ4G0Qu0bvYbbtdfmPggSIGWS2K2IjMA2PsCZUgKeMYrJFaDDs3ohwVFCGdSZQ-X_cZPVdvpDL80MfYpF5GVhdYkvnTjkgUFUav-N9xcQqlKMAsLLphzAiV2htfwUe-8NJPJ6TYTQFiAaGv1U-EDKyfgRN26oPuUzRUJnVM8uzT9giH_wKcupyEWJuPGZcF4XzbkJCM1yhTfR6vS2Mwn9_fl9ASQoC_rZe4ubIrHD8A47ZIjBlyfFaMLDP7FpZVb9h7D6x"/>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface">3-Bottom Disc Plough</p>
                              <p className="text-[10px] text-on-surface-variant">Owner: Sandeep Mane</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">10 Sep - 11 Sep</td>
                        <td className="px-6 py-4 text-sm font-bold text-on-surface">₹1,800</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Completed</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xs font-bold text-primary-container hover:underline">Re-book</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (Widgets) */}
          <aside className="w-full xl:w-80 space-y-6">
            {/* Widget 1: Schedule Calendar */}
            <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-on-surface">Booking Schedule</h3>
                <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-4">
                <div className="text-[10px] font-bold text-on-surface-variant">M</div>
                <div className="text-[10px] font-bold text-on-surface-variant">T</div>
                <div className="text-[10px] font-bold text-on-surface-variant">W</div>
                <div className="text-[10px] font-bold text-on-surface-variant">T</div>
                <div className="text-[10px] font-bold text-on-surface-variant">F</div>
                <div className="text-[10px] font-bold text-on-surface-variant">S</div>
                <div className="text-[10px] font-bold text-error">S</div>
                {/* Mini Calendar View */}
                <div className="text-xs py-2 text-slate-300">10</div>
                <div className="text-xs py-2 text-slate-300">11</div>
                <div className="text-xs py-2 bg-primary-container text-white rounded-full font-bold">12</div>
                <div className="text-xs py-2 bg-primary-container text-white rounded-full font-bold">13</div>
                <div className="text-xs py-2 bg-primary-container text-white rounded-full font-bold">14</div>
                <div className="text-xs py-2 bg-primary-container text-white rounded-full font-bold">15</div>
                <div className="text-xs py-2 text-slate-300">16</div>
                <div className="text-xs py-2 text-on-surface-variant">17</div>
                <div className="text-xs py-2 bg-orange-200 text-orange-900 rounded-full font-bold">18</div>
                <div className="text-xs py-2 bg-orange-200 text-orange-900 rounded-full font-bold">19</div>
                <div className="text-xs py-2">20</div>
                <div className="text-xs py-2">21</div>
                <div className="text-xs py-2">22</div>
                <div className="text-xs py-2">23</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-surface-container-low rounded-lg border-l-4 border-primary-container">
                  <div className="text-[10px] font-bold text-on-surface-variant leading-tight">12<br/>Oct</div>
                  <div className="text-xs font-bold text-on-surface truncate">John Deere 5050D Delivery</div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-surface-container-low rounded-lg border-l-4 border-orange-400">
                  <div className="text-[10px] font-bold text-on-surface-variant leading-tight">18<br/>Oct</div>
                  <div className="text-xs font-bold text-on-surface truncate">Rotavator Booking Pending</div>
                </div>
              </div>
            </div>

            {/* Widget 2: Spending Summary */}
            <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-on-surface mb-1">Spending Summary</h3>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-4">October 2023</p>
              <div className="mb-4">
                <p className="text-3xl font-extrabold text-primary-container">₹12,400</p>
                <p className="text-xs text-on-surface-variant font-medium">Estimated spend this month</p>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mb-1 uppercase">
                    <span>Paid</span>
                    <span>₹9,000</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full" style={{width: "72%"}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mb-1 uppercase">
                    <span>Upcoming</span>
                    <span>₹3,400</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-400 h-full" style={{width: "28%"}}></div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2.5 text-xs font-bold border border-outline-variant rounded-xl hover:bg-surface-container transition-colors">Download Invoice</button>
            </div>

            {/* Widget 3: Support Card */}
            <div className="bg-amber-900 rounded-2xl p-6 relative overflow-hidden group">
              {/* Decorative element */}
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-[96px] text-white">support_agent</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-white text-lg mb-2 leading-tight">Need help with your booking?</h3>
                <p className="text-amber-200 text-xs mb-6 opacity-90">Our field support team is available from 8 AM to 8 PM in Satara.</p>
                <button className="bg-white text-amber-900 font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-transform">
                  <span className="material-symbols-outlined text-sm">call</span>
                  Contact Support
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* FAB for quick action */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-primary-container text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </div>
    </div>
  );
}
