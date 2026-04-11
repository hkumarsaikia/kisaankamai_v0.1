"use client";

import Link from "next/link";

const categories = [
  { name: "Tractors", icon: "agriculture", count: 48 },
  { name: "Harvesters", icon: "grass", count: 22 },
  { name: "Implements", icon: "construction", count: 35 },
  { name: "Seeders & Planters", icon: "eco", count: 18 },
  { name: "Sprayers & Drones", icon: "flight", count: 12 },
  { name: "Tillers & Rotavators", icon: "landscape", count: 28 },
];

const featuredEquipment = [
  { name: "Mahindra Yuvo Tech+ 575", cat: "Tractors", price: "₹2,400/day", rating: "4.8", loc: "Satara, MH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-mErNd0cvUOnTIz2qYkJjeqz2GI0G6gf083wAvr6xtG-rrQkVKaP1q3o1c6oBRxIR2C7eevgtcfXnBlQK6O9-_57BT0gxEfV9fQO0o9mOpwmZGWkTF_SCNFD4NYNLC5fcabMjqwDOKXXJ6SNO7U28jUtB0LlDkmHS4l8KYNOj7bBLXWv3OblJuc5rDRBQfEKF1qOT-7gjGY3PJ0flxYm53QV3BHHTWVnRYHheHg7DSkoZH3xtZCoEzjX7jv0hrLxYVXH1YzXwnEPa" },
  { name: "John Deere W70 Harvester", cat: "Harvesters", price: "₹4,500/day", rating: "4.9", loc: "Pune, MH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHOe29gcelvR3hhiqH5MuIXjI6mK385yEB1xy--h-5igX8AReGU-jzNuG8XezEPGRMyEVEYnyp7lafBGew8eqkAkMI0ciLmJXUmHw016fqQcHBFqws8VCeGQFWXkx6-m-f9PWE_gaBFQb7_9BMY68bdLRugkt1oMIF5AdKxBSpGAvb8ERWaC56qyhdwP509BAbrZr4T2tTTkBQEe3epSAcZ_NAjHf2BqysMP92jUD3-7p7tZmuVoxrkghuu2odwGW_oJSNBTUfMluS" },
  { name: "Maschio Gaspardo Rotavator", cat: "Implements", price: "₹1,200/day", rating: "4.6", loc: "Nashik, MH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0PJvvNvwRkUkIBzXAzehu_jG4PyuErWl_2rnNKiedhc8uzTs6hMtMY_hPw8Fyz4zbZDh598Pc79ZpFp35kJjXgO-AEt7FqPDYgdq4p99rHqPGFIDbPkvs_OUEuXmCKzPyYosWGrUW4AuR4MZt_7sCRYRmMEJgwEdTkAGJDB0AmknfBwcg_J8Nd2TfXAeA1UadmXhfbkLr_9c2qiFWMKCUM11tfNVE-UenmD4QB6cEqCh-fxXFVNtnr9mFvJLa4S-m0yaH-IXBEU02" },
  { name: "Sonalika Worldtrac 90", cat: "Tractors", price: "₹2,800/day", rating: "4.7", loc: "Kolhapur, MH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0Xgk8KN6rbnB--4zbEBVLRSULk2I1ecqvzJKgAgL7CCVwL5V8XYrUIafNV_xdh_-LkUCcmppGJe4Fi0gliErjlMqCd1kwlU9pBC5ZGqDo5cx_nekusQVYWdvtCZRmGfyKguYkzwjgRdX8Ub7J5XanLG8ORqesvFrnmg0n-LcPucCPUXAsE-79akkHcovigCdWyKhxtk6jO0ZTEOvALnvwKK9g2QAZihwr-bv20ycHhV0aq-0IqHbd7Qpg3myyEprX0bC3Plfgv67A" },
  { name: "DJI Agras T40 Drone", cat: "Sprayers", price: "₹1,800/day", rating: "4.9", loc: "Aurangabad, MH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZYfFNJ2BxACyAGTpeVdMvGsDp-pOCBj9t2qB-y2NNGSNqEdfLXvYR0vnvI9gAlqXftaTbqtw_0IENiq0KcG-H6p7jSM-581oWny1VG9vyssAinIroJODgrd5yqHTlPnToXETMi8qHNDOPUJ0OI0OnFUmwcK9coiabh_BmQYjcb5kNTQ2UumIDKzfv0R1Om5-4Gg2nszSb0MCLWDhKev8bwh_YajXe6HxJQVceQN570YOt_IrUVPmgHWUSLMWPVhOtp_0hWgZ4BgpO" },
  { name: "Auto Multi-crop Seeder", cat: "Seeders", price: "₹900/day", rating: "4.5", loc: "Sangli, MH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvoklDzQgJfFABFZswEWAb6ERi2kYcGZgCyzvk18JL2YS3Aav2ZdaXy-_tfWvX13tDoAwgMjdQH6eQG832KxhiypLFdVTOHkjYMxcKsSmMI0rDMh4sdiXnmIh65FYOUIvrc-3Lue8vV8iYnuR-9x01Y8iELU-p9fAy9Q0L3URNgQLxzoIcSZycefVIguYVoB6tQ6S9BUY9gsxUxL_3d2CgH9WrmYf2YhK3O9P8pJF8QuWgm-no0DYUQOb73RSwY3ZiFn4nEZSmPrPo" },
];

export default function BrowseEquipmentPage() {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">Browse Equipment</h2>
          <p className="text-slate-500 mt-1">Find the right machinery for your farm</p>
        </div>
        {/* Search Bar */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input type="text" placeholder="Search equipment..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2 text-sm font-medium hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filters
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <section>
        <h3 className="text-lg font-bold text-on-surface mb-4">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-center hover:border-primary hover:shadow-md transition-all cursor-pointer group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <p className="text-sm font-bold text-on-surface">{cat.name}</p>
              <p className="text-xs text-slate-500 mt-1">{cat.count} available</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipment Grid */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-on-surface">Available Near You</h3>
          <button className="text-sm font-bold text-primary flex items-center gap-1">Sort <span className="material-symbols-outlined text-[16px]">swap_vert</span></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredEquipment.map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <img className="w-full h-full object-cover" alt={item.name} src={item.img} loading="lazy" decoding="async" />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all">
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">bookmark</span>
                </button>
                <span className="absolute bottom-3 left-3 text-[10px] bg-primary/90 text-white px-2 py-1 rounded font-bold uppercase">{item.cat}</span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-on-surface">{item.name}</h4>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <span className="material-symbols-outlined text-[14px]">star</span>{item.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>{item.loc}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-primary text-sm">{item.price}</p>
                  <Link href="/rent-equipment" className="text-xs font-bold text-white bg-primary px-4 py-2 rounded-lg hover:opacity-90 transition-all">Book Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
