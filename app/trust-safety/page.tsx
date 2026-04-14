"use client";

import { ContentImage } from "@/components/ContentImage";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

export default function TrustSafety() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow pt-28 pb-12">

{/*  Trust Partners Section  */}
<section className="py-16 bg-surface-container-low overflow-hidden">
<div className="max-w-screen-2xl mx-auto px-8">
<h2 className="text-center font-headline font-bold text-outline uppercase tracking-[0.2em] text-sm mb-12">{t("trust-safety.building_rural_prosperity_with_strategic_partners")}</h2>
<div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-4xl text-primary" style={{'fontVariationSettings': '\'FILL\' 1'}}>agriculture</span>
<span className="font-headline font-extrabold text-xl tracking-tighter">MAHINDRA AGRI</span>
</div>
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-4xl text-primary" style={{'fontVariationSettings': '\'FILL\' 1'}}>account_balance</span>
<span className="font-headline font-extrabold text-xl tracking-tighter">NABARD</span>
</div>
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-4xl text-primary" style={{'fontVariationSettings': '\'FILL\' 1'}}>eco</span>
<span className="font-headline font-extrabold text-xl tracking-tighter">TATA TRUSTS</span>
</div>
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-4xl text-primary" style={{'fontVariationSettings': '\'FILL\' 1'}}>verified_user</span>
<span className="font-headline font-extrabold text-xl tracking-tighter">ICAR</span>
</div>
</div>
</div>
</section>
{/*  Trust and Contact Detail Cards  */}
<section className="py-24 max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
{/*  Operating Areas Map  */}
<div className="md:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 overflow-hidden relative group">
<div className="flex-1 space-y-4">
<span className="inline-flex items-center gap-2 px-4 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold uppercase tracking-wider">Now Expanding</span>
<h3 className="text-4xl font-headline font-extrabold tracking-tight text-primary leading-tight">Operating across <br/>14 Districts of Maharashtra</h3>
<p className="text-on-surface-variant leading-relaxed max-w-md">Our logistical network ensures doorstep equipment delivery across Pune, Satara, Nashik, Aurangabad, and more.</p>
<ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm font-semibold text-primary/80 pt-4">
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Pune Region</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Marathwada</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Nashik Division</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Konkan Belt</li>
</ul>
</div>
<div className="flex-1 min-h-[300px] bg-surface-container rounded-2xl relative overflow-hidden">
<ContentImage className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50" alt="topographic map style illustration of rural landscape with vibrant green agricultural plots and winding irrigation canals" data-location="Maharashtra" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKSv9oUVtbcX6EHwd7fYs4gCnORb4b2Eg46816kdbheQtfd8rHpChEBbHyCUqXUSldaX4xf8mbNXLNWUbeVnNrzMz2ZL2OGniLh-dIjWMmZ5j95F1RZWvYjVGp0LvskANO5WfqDPVB7js6ipwriAL1gYu6DGWVkqMqHQc0P2lqGQnq00WBwbqjnM1u8uar8tDBoZ517mePHJFByMxZCI830BYC_1OXdOzd21JdrqbevTgatFQ-bfQJ_7_VaeqosSFXf0ETmSRoOLNC"loading="lazy" decoding="async" />
<div className="absolute inset-0 flex items-center justify-center">
<div className="relative">
<div className="absolute -inset-4 bg-orange-500/20 rounded-full animate-ping"></div>
<div className="relative bg-secondary text-white p-3 rounded-full shadow-lg">
<span className="material-symbols-outlined" style={{'fontVariationSettings': '\'FILL\' 1'}}>location_on</span>
</div>
</div>
</div>
</div>
</div>
{/*  App Coming Soon Card  */}
<div className="md:col-span-4 bg-primary rounded-[2rem] p-10 text-on-primary flex flex-col justify-between shadow-2xl relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-50 translate-x-12 -translate-y-12"></div>
<div className="relative z-10">
<h3 className="text-3xl font-headline font-extrabold mb-4 leading-tight">Digital Farming in your pocket.</h3>
<p className="opacity-80 text-lg mb-8">Manage rentals and track earnings on the move.</p>
</div>
<div className="space-y-4 relative z-10">
<div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-4">
<span className="material-symbols-outlined text-4xl">phone_iphone</span>
<div>
<p className="text-xs uppercase tracking-widest font-bold opacity-60">Mobile App</p>
<p className="font-bold">Coming Soon to iOS &amp; Play Store</p>
</div>
</div>
<button className="w-full py-4 bg-secondary text-white rounded-full font-bold shadow-xl shadow-black/20 hover:scale-105 transition-transform">Notify Me</button>
</div>
</div>
</section>
{/*  Final Trust Bar  */}
<section className="max-w-screen-2xl mx-auto px-8 mb-24">
<div className="bg-surface-container-high rounded-[2rem] py-12 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
<div className="flex items-center gap-6">
<div className="bg-primary-container p-4 rounded-2xl">
<span className="material-symbols-outlined text-4xl text-on-primary-container" style={{'fontVariationSettings': '\'FILL\' 1'}}>support_agent</span>
</div>
<div>
<h4 className="text-xl font-headline font-extrabold text-primary">Need assistance?</h4>
<p className="text-on-surface-variant">Our support team is available from 8 AM to 8 PM.</p>
</div>
</div>
<div className="flex flex-wrap gap-4 justify-center">
<a className="px-6 py-4 bg-surface-container-lowest rounded-2xl flex items-center gap-3 font-bold border border-outline-variant/10 shadow-sm hover:shadow-md transition-all" href="mailto:Support@krishiseva.in">
<span className="material-symbols-outlined text-secondary">mail</span>
                        Support@krishiseva.in
                    </a>
<a className="px-6 py-4 bg-surface-container-lowest rounded-2xl flex items-center gap-3 font-bold border border-outline-variant/10 shadow-sm hover:shadow-md transition-all" href="tel:+918001234567">
<span className="material-symbols-outlined text-secondary">call</span>
                        +91 800 123 4567
                    </a>
</div>
</div>
</section>
      </main>
      <Footer />
    </div>
  );
}



