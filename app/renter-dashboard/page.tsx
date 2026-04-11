"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function RenterDashboardPage() {
  const { user, profile } = useAuth();
  const userName = user?.name || profile?.fullName || "Farmer";

  return (
    <>
      {/* Welcome & Stats Hero */}
      <section className="bg-gradient-to-br from-primary-container to-[#00251a] p-8 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Good morning, {userName}!
          </h2>
          <p className="text-emerald-100/80 max-w-md">
            Your fields are waiting. You have 2 active bookings for today&apos;s harvest season.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Total Rents</p>
              <p className="text-white text-2xl font-black">24</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Savings</p>
              <p className="text-white text-2xl font-black">₹12,400</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 hidden sm:block">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Active</p>
              <p className="text-white text-2xl font-black">2</p>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20 pointer-events-none">
          <span className="material-symbols-outlined text-[12rem] text-emerald-100">agriculture</span>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          {/* Active Bookings */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xl font-bold text-on-surface">Active Bookings</h3>
              <Link href="/renter-dashboard/bookings" className="text-emerald-700 dark:text-emerald-400 text-sm font-bold hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Card 1 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex gap-5 group hover:shadow-md transition-all">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img className="w-full h-full object-cover" alt="Mahindra Tractor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-mErNd0cvUOnTIz2qYkJjeqz2GI0G6gf083wAvr6xtG-rrQkVKaP1q3o1c6oBRxIR2C7eevgtcfXnBlQK6O9-_57BT0gxEfV9fQO0o9mOpwmZGWkTF_SCNFD4NYNLC5fcabMjqwDOKXXJ6SNO7U28jUtB0LlDkmHS4l8KYNOj7bBLXWv3OblJuc5rDRBQfEKF1qOT-7gjGY3PJ0flxYm53QV3BHHTWVnRYHheHg7DSkoZH3xtZCoEzjX7jv0hrLxYVXH1YzXwnEPa" loading="lazy" decoding="async" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">In Progress</span>
                      <span className="text-slate-500 text-xs font-medium">#BK-9021</span>
                    </div>
                    <h4 className="font-bold text-on-surface leading-tight">Mahindra Novo 755 DI</h4>
                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      Satara District, MH
                    </p>
                  </div>
                  <div className="mt-2 flex justify-between items-center border-t border-dashed border-slate-200 dark:border-slate-700 pt-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Ends: 18 Nov</p>
                    <button className="text-emerald-900 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Details <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Booking Card 2 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex gap-5 group hover:shadow-md transition-all">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img className="w-full h-full object-cover" alt="John Deere Harvester" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHOe29gcelvR3hhiqH5MuIXjI6mK385yEB1xy--h-5igX8AReGU-jzNuG8XezEPGRMyEVEYnyp7lafBGew8eqkAkMI0ciLmJXUmHw016fqQcHBFqws8VCeGQFWXkx6-m-f9PWE_gaBFQb7_9BMY68bdLRugkt1oMIF5AdKxBSpGAvb8ERWaC56qyhdwP509BAbrZr4T2tTTkBQEe3epSAcZ_NAjHf2BqysMP92jUD3-7p7tZmuVoxrkghuu2odwGW_oJSNBTUfMluS" loading="lazy" decoding="async" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Starting Tomorrow</span>
                      <span className="text-slate-500 text-xs font-medium">#BK-9442</span>
                    </div>
                    <h4 className="font-bold text-on-surface leading-tight">John Deere W70 Harvester</h4>
                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      Pune District, MH
                    </p>
                  </div>
                  <div className="mt-2 flex justify-between items-center border-t border-dashed border-slate-200 dark:border-slate-700 pt-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Duration: 2 Days</p>
                    <button className="text-emerald-900 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Details <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recommended Strip */}
          <section>
            <h3 className="text-xl font-bold text-on-surface mb-6">Recommended for You</h3>
            <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
              {[
                { cat: "Implements", name: "Maschio Gaspardo Rotavator", price: "₹1,200/day", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0PJvvNvwRkUkIBzXAzehu_jG4PyuErWl_2rnNKiedhc8uzTs6hMtMY_hPw8Fyz4zbZDh598Pc79ZpFp35kJjXgO-AEt7FqPDYgdq4p99rHqPGFIDbPkvs_OUEuXmCKzPyYosWGrUW4AuR4MZt_7sCRYRmMEJgwEdTkAGJDB0AmknfBwcg_J8Nd2TfXAeA1UadmXhfbkLr_9c2qiFWMKCUM11tfNVE-UenmD4QB6cEqCh-fxXFVNtnr9mFvJLa4S-m0yaH-IXBEU02" },
                { cat: "Tractors", name: "Sonalika Worldtrac 90", price: "₹2,800/day", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0Xgk8KN6rbnB--4zbEBVLRSULk2I1ecqvzJKgAgL7CCVwL5V8XYrUIafNV_xdh_-LkUCcmppGJe4Fi0gliErjlMqCd1kwlU9pBC5ZGqDo5cx_nekusQVYWdvtCZRmGfyKguYkzwjgRdX8Ub7J5XanLG8ORqesvFrnmg0n-LcPucCPUXAsE-79akkHcovigCdWyKhxtk6jO0ZTEOvALnvwKK9g2QAZihwr-bv20ycHhV0aq-0IqHbd7Qpg3myyEprX0bC3Plfgv67A" },
                { cat: "Seeders", name: "Automatic Multi-crop Seeder", price: "₹900/day", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvoklDzQgJfFABFZswEWAb6ERi2kYcGZgCyzvk18JL2YS3Aav2ZdaXy-_tfWvX13tDoAwgMjdQH6eQG832KxhiypLFdVTOHkjYMxcKsSmMI0rDMh4sdiXnmIh65FYOUIvrc-3Lue8vV8iYnuR-9x01Y8iELU-p9fAy9Q0L3URNgQLxzoIcSZycefVIguYVoB6tQ6S9BUY9gsxUxL_3d2CgH9WrmYf2YhK3O9P8pJF8QuWgm-no0DYUQOb73RSwY3ZiFn4nEZSmPrPo" },
              ].map((item, i) => (
                <div key={i} className="min-w-[240px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="h-32 bg-slate-100 dark:bg-slate-800">
                    <img className="w-full h-full object-cover" alt={item.name} src={item.img} loading="lazy" decoding="async" />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-secondary uppercase mb-1">{item.cat}</p>
                    <h5 className="font-bold text-sm text-on-surface">{item.name}</h5>
                    <p className="text-slate-500 text-xs font-semibold mt-2">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent History */}
          <section>
            <h3 className="text-xl font-bold text-on-surface mb-6">Recent History</h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Equipment</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden">
                        <img className="w-full h-full object-cover" alt="Tractor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDybtNEsLeoOla6VS8d7nHTY12sEwP5O0x42NAFwD5S_tPoDdCMK8prC1mTWlXnx8y5XS2Ijj3Wwa9IkaJAGj4Dr6ii-h3jvxkfynNx6cWvVsGXf1L4pqgduNf7mSkxCyesZ8CD0GNuosFFvHbReXo9coQsg2Dskyrt_lqDHngAnDSSc8e3AYGlSR6ZHwQORfpYFxGnZJ6-Wui9OpoJssfVXnp4A-Kp8YdpNDGKdVUvj8WBwnE3Vj947mkNKQPgulumbdr5cW-3ZYwJ" loading="lazy" decoding="async" />
                      </div>
                      <span className="text-sm font-semibold text-on-surface">Powertrac 439 Plus</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">Nov 12, 2024</td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">₹3,400</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden">
                        <img className="w-full h-full object-cover" alt="Drone" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZYfFNJ2BxACyAGTpeVdMvGsDp-pOCBj9t2qB-y2NNGSNqEdfLXvYR0vnvI9gAlqXftaTbqtw_0IENiq0KcG-H6p7jSM-581oWny1VG9vyssAinIroJODgrd5yqHTlPnToXETMi8qHNDOPUJ0OI0OnFUmwcK9coiabh_BmQYjcb5kNTQ2UumIDKzfv0R1Om5-4Gg2nszSb0MCLWDhKev8bwh_YajXe6HxJQVceQN570YOt_IrUVPmgHWUSLMWPVhOtp_0hWgZ4BgpO" loading="lazy" decoding="async" />
                      </div>
                      <span className="text-sm font-semibold text-on-surface">DJI Agras T40 Spraying</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">Nov 08, 2024</td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">₹1,800</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column – Widgets */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          {/* Booking Schedule Calendar */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-on-surface">Booking Schedule</h3>
              <span className="text-xs font-bold text-emerald-700 cursor-pointer">Nov 2024</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 mb-4">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {[28,29,30,31].map(d => <span key={d} className="py-2 text-slate-300">{d}</span>)}
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(d => <span key={d} className="py-2 font-medium">{d}</span>)}
              <span className="py-2 bg-emerald-900 text-white rounded-lg font-bold">13</span>
              <span className="py-2 font-medium bg-emerald-100 text-emerald-900 rounded-lg">14</span>
              <span className="py-2 font-medium bg-emerald-100 text-emerald-900 rounded-lg">15</span>
              {[16,17].map(d => <span key={d} className="py-2 font-medium">{d}</span>)}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border-l-4 border-emerald-700">
                <span className="material-symbols-outlined text-emerald-700">schedule</span>
                <div>
                  <p className="text-xs font-bold text-on-surface">Tractor - 10:00 AM</p>
                  <p className="text-[10px] text-slate-500">Arrival at your farm</p>
                </div>
              </div>
            </div>
          </section>

          {/* Spending Summary */}
          <section className="bg-emerald-950 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-emerald-200 uppercase tracking-widest text-xs mb-4">November Spending</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black">₹18,250</span>
                <span className="text-emerald-400 text-xs font-bold flex items-center">
                  <span className="material-symbols-outlined text-sm">trending_up</span> 12%
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-100/60 font-medium">Rentals</span>
                  <span className="font-bold">₹15,400</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[84%]"></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-100/60 font-medium">Operator Fees</span>
                  <span className="font-bold">₹2,850</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[16%]"></div>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-[8rem]">payments</span>
            </div>
          </section>

          {/* Quick Support */}
          <section className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white">support_agent</span>
              </div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200">Quick Support</h3>
            </div>
            <p className="text-amber-800/80 dark:text-amber-300/60 text-sm mb-6 font-medium">Need help with a booking or a technical issue?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/support" className="bg-white dark:bg-slate-900 text-amber-700 font-bold py-3 px-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-amber-50 transition-colors">
                <span className="material-symbols-outlined text-sm">call</span> Call Now
              </Link>
              <Link href="/support" className="bg-amber-600 text-white font-bold py-3 px-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-amber-700 transition-colors">
                <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
