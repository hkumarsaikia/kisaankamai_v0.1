"use client";

import { useState } from "react";

const bookings = [
  { id: "BK-9021", name: "Mahindra Novo 605 DI-i", loc: "Satara District, MH", date: "Nov 14 - Nov 18, 2024", amount: "₹9,600", status: "active", owner: "Ramesh Patil", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-mErNd0cvUOnTIz2qYkJjeqz2GI0G6gf083wAvr6xtG-rrQkVKaP1q3o1c6oBRxIR2C7eevgtcfXnBlQK6O9-_57BT0gxEfV9fQO0o9mOpwmZGWkTF_SCNFD4NYNLC5fcabMjqwDOKXXJ6SNO7U28jUtB0LlDkmHS4l8KYNOj7bBLXWv3OblJuc5rDRBQfEKF1qOT-7gjGY3PJ0flxYm53QV3BHHTWVnRYHheHg7DSkoZH3xtZCoEzjX7jv0hrLxYVXH1YzXwnEPa" },
  { id: "BK-9442", name: "John Deere Rotavator 7ft", loc: "Pune District, MH", date: "Nov 20 - Nov 21, 2024", amount: "₹2,400", status: "upcoming", owner: "Suresh Jadhav", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0PJvvNvwRkUkIBzXAzehu_jG4PyuErWl_2rnNKiedhc8uzTs6hMtMY_hPw8Fyz4zbZDh598Pc79ZpFp35kJjXgO-AEt7FqPDYgdq4p99rHqPGFIDbPkvs_OUEuXmCKzPyYosWGrUW4AuR4MZt_7sCRYRmMEJgwEdTkAGJDB0AmknfBwcg_J8Nd2TfXAeA1UadmXhfbkLr_9c2qiFWMKCUM11tfNVE-UenmD4QB6cEqCh-fxXFVNtnr9mFvJLa4S-m0yaH-IXBEU02" },
  { id: "BK-8915", name: "Powertrac 439 Plus", loc: "Nashik District, MH", date: "Nov 10 - Nov 12, 2024", amount: "₹3,400", status: "completed", owner: "Kiran More", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDybtNEsLeoOla6VS8d7nHTY12sEwP5O0x42NAFwD5S_tPoDdCMK8prC1mTWlXnx8y5XS2Ijj3Wwa9IkaJAGj4Dr6ii-h3jvxkfynNx6cWvVsGXf1L4pqgduNf7mSkxCyesZ8CD0GNuosFFvHbReXo9coQsg2Dskyrt_lqDHngAnDSSc8e3AYGlSR6ZHwQORfpYFxGnZJ6-Wui9OpoJssfVXnp4A-Kp8YdpNDGKdVUvj8WBwnE3Vj947mkNKQPgulumbdr5cW-3ZYwJ" },
  { id: "BK-8800", name: "DJI Agras T40 Spraying", loc: "Aurangabad, MH", date: "Nov 06 - Nov 08, 2024", amount: "₹1,800", status: "completed", owner: "Vikas Deshmukh", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZYfFNJ2BxACyAGTpeVdMvGsDp-pOCBj9t2qB-y2NNGSNqEdfLXvYR0vnvI9gAlqXftaTbqtw_0IENiq0KcG-H6p7jSM-581oWny1VG9vyssAinIroJODgrd5yqHTlPnToXETMi8qHNDOPUJ0OI0OnFUmwcK9coiabh_BmQYjcb5kNTQ2UumIDKzfv0R1Om5-4Gg2nszSb0MCLWDhKev8bwh_YajXe6HxJQVceQN570YOt_IrUVPmgHWUSLMWPVhOtp_0hWgZ4BgpO" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "In Progress", color: "bg-amber-100 text-amber-800" },
  upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export default function MyBookingsPage() {
  const [tab, setTab] = useState("all");
  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "upcoming", label: "Upcoming" },
    { id: "completed", label: "Completed" },
  ];

  const filtered = tab === "all" ? bookings : bookings.filter(b => b.status === tab);

  return (
    <>
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tight mb-2">My Bookings</h1>
        <p className="text-slate-500">Track and manage all your equipment rentals</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-3 text-sm font-bold transition-all border-b-2 -mb-px ${tab === t.id ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-primary"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="flex flex-col gap-6">
        {filtered.map(b => {
          const st = statusConfig[b.status];
          return (
            <div key={b.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-5 group hover:shadow-md transition-all">
              <div className="w-full md:w-40 h-40 md:h-auto rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                <img className="w-full h-full object-cover" alt={b.name} src={b.img} loading="lazy" decoding="async" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${st.color}`}>{st.label}</span>
                    <span className="text-slate-400 text-xs font-medium">#{b.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-1">{b.name}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>{b.loc}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Duration</p>
                      <p className="text-sm font-bold text-on-surface">{b.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Total</p>
                      <p className="text-sm font-bold text-on-surface">{b.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Owner</p>
                      <p className="text-sm font-bold text-on-surface">{b.owner}</p>
                    </div>
                  </div>
                  <button className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
