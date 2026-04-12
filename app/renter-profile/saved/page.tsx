"use client";

import Link from "next/link";

const savedItems = [
  { name: "Mahindra Yuvo Tech+ 575", cat: "Tractors", price: "₹2,400/day", rating: "4.8", loc: "Satara, MH", avail: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-mErNd0cvUOnTIz2qYkJjeqz2GI0G6gf083wAvr6xtG-rrQkVKaP1q3o1c6oBRxIR2C7eevgtcfXnBlQK6O9-_57BT0gxEfV9fQO0o9mOpwmZGWkTF_SCNFD4NYNLC5fcabMjqwDOKXXJ6SNO7U28jUtB0LlDkmHS4l8KYNOj7bBLXWv3OblJuc5rDRBQfEKF1qOT-7gjGY3PJ0flxYm53QV3BHHTWVnRYHheHg7DSkoZH3xtZCoEzjX7jv0hrLxYVXH1YzXwnEPa" },
  { name: "John Deere W70 Harvester", cat: "Harvesters", price: "₹4,500/day", rating: "4.9", loc: "Pune, MH", avail: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHOe29gcelvR3hhiqH5MuIXjI6mK385yEB1xy--h-5igX8AReGU-jzNuG8XezEPGRMyEVEYnyp7lafBGew8eqkAkMI0ciLmJXUmHw016fqQcHBFqws8VCeGQFWXkx6-m-f9PWE_gaBFQb7_9BMY68bdLRugkt1oMIF5AdKxBSpGAvb8ERWaC56qyhdwP509BAbrZr4T2tTTkBQEe3epSAcZ_NAjHf2BqysMP92jUD3-7p7tZmuVoxrkghuu2odwGW_oJSNBTUfMluS" },
  { name: "Sonalika Challenger 7ft", cat: "Implements", price: "₹1,000/day", rating: "4.5", loc: "Nashik, MH", avail: false, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0PJvvNvwRkUkIBzXAzehu_jG4PyuErWl_2rnNKiedhc8uzTs6hMtMY_hPw8Fyz4zbZDh598Pc79ZpFp35kJjXgO-AEt7FqPDYgdq4p99rHqPGFIDbPkvs_OUEuXmCKzPyYosWGrUW4AuR4MZt_7sCRYRmMEJgwEdTkAGJDB0AmknfBwcg_J8Nd2TfXAeA1UadmXhfbkLr_9c2qiFWMKCUM11tfNVE-UenmD4QB6cEqCh-fxXFVNtnr9mFvJLa4S-m0yaH-IXBEU02" },
];

export default function SavedEquipmentPage() {
  return (
    <>
      <div>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight">
          Saved Equipment <span className="text-secondary ml-2 font-normal text-lg">/ जतन केलेली उपकरणे</span>
        </h2>
        <p className="text-slate-500 mt-2">{savedItems.length} items saved</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {savedItems.map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div className="h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
              <img className="w-full h-full object-cover" alt={item.name} src={item.img} loading="lazy" decoding="async" />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all">
                <span className="material-symbols-outlined text-red-500 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
              </button>
              {!item.avail && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg">Currently Unavailable</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{item.cat}</span>
              <h3 className="text-xl font-bold text-primary mt-1">{item.name}</h3>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{item.loc}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-amber-500">star</span>{item.rating}</span>
              </div>
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-primary text-lg">{item.price}</p>
                {item.avail ? (
                  <Link href="/rent-equipment" className="text-sm font-bold text-white bg-primary px-5 py-2.5 rounded-xl hover:opacity-90 transition-all">Book Now</Link>
                ) : (
                  <button disabled className="text-sm font-bold text-slate-400 bg-slate-100 px-5 py-2.5 rounded-xl cursor-not-allowed">Unavailable</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Banner */}
      <section className="bg-gradient-to-br from-primary-container to-[#00251a] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-white mb-2">Need something else?</h3>
          <p className="text-emerald-100/80 max-w-md">Browse our full catalog of 150+ machines available across Maharashtra.</p>
        </div>
        <Link href="/renter-profile/browse" className="relative z-10 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg">
          Browse All Equipment
        </Link>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[10rem] text-emerald-100">agriculture</span>
        </div>
      </section>
    </>
  );
}
