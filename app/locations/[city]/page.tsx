import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return [
    { city: 'kalwan' }, { city: 'mukhed' }, { city: 'sangli' }, { city: 'pune' }, { city: 'mumbai' }
  ];
}

export default function RegionalSearch() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">

{/*  TopAppBar  */}

{/*  Main Content Canvas  */}
<main className="pt-24 pb-32">
{/*  Search Hero Section  */}
<section className="px-8 max-w-screen-2xl mx-auto mb-12">
<div className="relative overflow-hidden rounded-[2rem] bg-primary-container p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 min-h-[400px]">
<div className="absolute inset-0 opacity-20">
<img alt="" className="w-full h-full object-cover" data-alt="Wide cinematic shot of a sunset over Maharashtra sugarcane fields with a modern tractor silhouette in the distance" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtEf9o_wnLKEHbwRQgvA3IOVmNOb-y8G7zUOucxhMLbQbyH0Wks4x9AqRKw8VWVgvJoky1elE2CR1i6gri7YARrARIVGiiutAVr6bHZK1VvXwcyZqCXAJXWmOJS1u8rwWH4nbTGehQlvh6UPQ8nNU82rM7QZyScYU9Uk79GjpyUzgP1_-vu9S9EYOzIxFkZSeQqOSaYJUlEeayq-htDf4w-91BgjJKuF4tUSLZ3AZvZigN13o0-t4X0tVPFGU9bpQd8Nixg_g7GF45"/>
</div>
<div className="relative z-10 max-w-2xl text-center md:text-left">
<h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                        Rent Premium Equipment <br/>in <span className="text-secondary-container">Sangli</span>
</h1>
<p className="text-primary-fixed-dim text-lg md:text-xl font-medium mb-10 max-w-lg">
                        Find verified tractors, harvesters, and specialized implements from trusted local owners across Western Maharashtra.
                    </p>
{/*  Search Bar Interface  */}
<div className="flex flex-col md:flex-row bg-white rounded-2xl p-2 shadow-2xl gap-2">
<div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-surface-variant">
<span className="material-symbols-outlined text-outline mr-3">location_on</span>
<div className="flex flex-col items-start">
<span className="text-[10px] uppercase font-bold text-outline tracking-wider">Location</span>
<select className="bg-transparent border-none p-0 focus:ring-0 font-headline font-bold text-on-surface">
<option>Sangli, Maharashtra</option>
<option>Satara, Maharashtra</option>
<option>Kolhapur, Maharashtra</option>
</select>
</div>
</div>
<div className="flex-1 flex items-center px-4 py-2">
<span className="material-symbols-outlined text-outline mr-3">agriculture</span>
<div className="flex flex-col items-start">
<span className="text-[10px] uppercase font-bold text-outline tracking-wider">Equipment</span>
<input className="bg-transparent border-none p-0 focus:ring-0 font-headline font-bold text-on-surface placeholder:text-outline/50 w-full" placeholder="What are you looking for?" type="text"/>
</div>
</div>
<button className="bg-secondary text-white px-8 py-4 rounded-xl font-headline font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined">search</span>
                            Find Now
                        </button>
</div>
</div>
<div className="relative z-10 hidden lg:block">
<div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
<div className="flex items-center gap-4 mb-4">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary-container">
<span className="material-symbols-outlined" style={{'fontVariationSettings': '\'FILL\' 1'}}>verified</span>
</div>
<div>
<div className="text-white font-bold">100% Verified</div>
<div className="text-primary-fixed-dim text-sm">Working conditions checked</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container">
<span className="material-symbols-outlined" style={{'fontVariationSettings': '\'FILL\' 1'}}>support_agent</span>
</div>
<div>
<div className="text-white font-bold">Local Support</div>
<div className="text-primary-fixed-dim text-sm">On-field assistance available</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Category Chips & Filters  */}
<section className="px-8 max-w-screen-2xl mx-auto mb-10">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
{/*  Category Horizontal Scroll  */}
<div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 w-full md:w-auto">
<button className="flex items-center gap-2 px-6 py-2 bg-primary-container text-white rounded-full font-headline font-semibold whitespace-nowrap">
<span className="material-symbols-outlined text-sm">grid_view</span>
                        All Equipment
                    </button>
<button className="flex items-center gap-2 px-6 py-2 bg-white text-on-surface-variant border border-outline-variant rounded-full font-headline font-semibold whitespace-nowrap hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-sm">agriculture</span>
                        Tractors
                    </button>
<button className="flex items-center gap-2 px-6 py-2 bg-white text-on-surface-variant border border-outline-variant rounded-full font-headline font-semibold whitespace-nowrap hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-sm">grass</span>
                        Harvesters
                    </button>
<button className="flex items-center gap-2 px-6 py-2 bg-white text-on-surface-variant border border-outline-variant rounded-full font-headline font-semibold whitespace-nowrap hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-sm">hardware</span>
                        Implements
                    </button>
<button className="flex items-center gap-2 px-6 py-2 bg-white text-on-surface-variant border border-outline-variant rounded-full font-headline font-semibold whitespace-nowrap hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-sm">precision_manufacturing</span>
                        Rotavators
                    </button>
</div>
{/*  Advanced Filter Toggle  */}
<button className="flex items-center gap-2 px-6 py-2 bg-surface-container-high text-on-surface font-headline font-bold rounded-xl border border-outline-variant">
<span className="material-symbols-outlined">tune</span>
                    Advanced Filters
                </button>
</div>
</section>
{/*  Equipment Grid  */}
<section className="px-8 max-w-screen-2xl mx-auto">
<div className="flex flex-col lg:flex-row gap-10">
{/*  Sidebar Filters (Desktop)  */}
<aside className="hidden lg:block w-72 flex-shrink-0">
<div className="sticky top-28 space-y-8">
<div>
<h3 className="text-lg font-headline font-bold text-emerald-900 mb-4">Price Range (per day)</h3>
<div className="space-y-3">
<label className="flex items-center gap-3 cursor-pointer group">
<input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox"/>
<span className="text-on-surface-variant group-hover:text-on-surface">Below ₹2,000</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox"/>
<span className="text-on-surface-variant group-hover:text-on-surface">₹2,000 - ₹5,000</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox"/>
<span className="text-on-surface-variant group-hover:text-on-surface">Above ₹5,000</span>
</label>
</div>
</div>
<div>
<h3 className="text-lg font-headline font-bold text-emerald-900 mb-4">Equipment Capacity</h3>
<div className="space-y-3">
<label className="flex items-center gap-3 cursor-pointer group">
<input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox"/>
<span className="text-on-surface-variant group-hover:text-on-surface">Under 40 HP</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox"/>
<span className="text-on-surface-variant group-hover:text-on-surface">40 - 60 HP</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox"/>
<span className="text-on-surface-variant group-hover:text-on-surface">Above 60 HP</span>
</label>
</div>
</div>
<div>
<h3 className="text-lg font-headline font-bold text-emerald-900 mb-4">Service Options</h3>
<div className="space-y-3">
<label className="flex items-center gap-3 cursor-pointer group">
<input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox"/>
<span className="text-on-surface-variant group-hover:text-on-surface">With Operator</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox"/>
<span className="text-on-surface-variant group-hover:text-on-surface">Equipment Only</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox"/>
<span className="text-on-surface-variant group-hover:text-on-surface">Fuel Included</span>
</label>
</div>
</div>
</div>
</aside>
{/*  Equipment Cards  */}
<div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
{/*  Card 1  */}
<div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-surface-container border-t-0 flex flex-col group">
<div className="relative h-64 overflow-hidden">
<img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Close-up of a modern red Mahindra tractor standing in a clean rural barn setting with cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATOTXnZjVnSH_RilRqV_RT9rZXSZqOQbUklbiQjfcN3v337k8IezKXRpnH_M0wqX-yZsAGEiVPWxnTYWDCZMjrb2K-JMrO5hENXIaclV4KU98-cIc5wizU9wLKY-PzqMn8YzQ2m6uMpc6u1dRjxm16-YqMuQB-KvgfeLn5MCpLw4vzG263TxznFzCGikj1gB33G_j4zsQKjf2wCCHPmh86fLcCP9j-JVBoefeNsIdYB7UBED94zuHsMVyvJLBKl52DLAtFxezcLjB7"/>
<div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary-container px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span>
                                4.9 (42 Rentals)
                            </div>
<div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                                Available Today
                            </div>
</div>
<div className="p-6 flex-1 flex flex-col">
<div className="flex justify-between items-start mb-2">
<h4 className="text-xl font-headline font-extrabold text-on-surface">Mahindra Novo 755 DI</h4>
<span className="text-emerald-900 font-bold">₹2,800 <span className="text-xs font-normal text-outline">/day</span></span>
</div>
<div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
<span className="material-symbols-outlined text-base">location_on</span>
                                Miraj, Sangli (4km away)
                            </div>
<div className="grid grid-cols-2 gap-4 mb-6">
<div className="bg-surface-container-low p-3 rounded-xl">
<div className="text-[10px] uppercase font-bold text-outline">Power</div>
<div className="font-bold text-on-surface">74 HP</div>
</div>
<div className="bg-surface-container-low p-3 rounded-xl">
<div className="text-[10px] uppercase font-bold text-outline">Operator</div>
<div className="font-bold text-on-surface">Included</div>
</div>
</div>
<button className="w-full bg-emerald-950 text-white py-3 rounded-xl font-headline font-bold mt-auto hover:bg-emerald-900 transition-colors">Book Now</button>
</div>
</div>
{/*  Card 2  */}
<div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-surface-container border-t-0 flex flex-col group">
<div className="relative h-64 overflow-hidden">
<img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A John Deere harvester working in a golden wheat field in Satara during midday sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhl7CiHaLTGJHyIW0_4frRotyRzo80pDqPB34MBwr86szOMsqjxwMJz5R3_O1Pc_1n7fgeteEqyaFDKjJAGjvmv1Q6CQ9paZhI8Ah1l0J-fLh3L2l2IcOC5cat2BvQF9yppeqS_QxcHmFDQWFRtSUWsk7efpHCmhfsQXJa7LKcGtlzPs9Hfo32TPATP2YINi05WffJOi4-96_9_nfvLIo9zVv6ygrSm-OPfBG-sZr8CuIbZdT-c9wD5jj-W005ZaS2OTYcYvaHrrZa"/>
<div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary-container px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span>
                                4.7 (18 Rentals)
                            </div>
<div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                                Next: Oct 24
                            </div>
</div>
<div className="p-6 flex-1 flex flex-col">
<div className="flex justify-between items-start mb-2">
<h4 className="text-xl font-headline font-extrabold text-on-surface">John Deere W50 Harvester</h4>
<span className="text-emerald-900 font-bold">₹7,500 <span className="text-xs font-normal text-outline">/day</span></span>
</div>
<div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
<span className="material-symbols-outlined text-base">location_on</span>
                                Karad, Satara (12km away)
                            </div>
<div className="grid grid-cols-2 gap-4 mb-6">
<div className="bg-surface-container-low p-3 rounded-xl">
<div className="text-[10px] uppercase font-bold text-outline">Drive</div>
<div className="font-bold text-on-surface">4-Wheel</div>
</div>
<div className="bg-surface-container-low p-3 rounded-xl">
<div className="text-[10px] uppercase font-bold text-outline">Fuel</div>
<div className="font-bold text-on-surface">Excluded</div>
</div>
</div>
<button className="w-full border-2 border-emerald-950 text-emerald-950 py-3 rounded-xl font-headline font-bold mt-auto hover:bg-emerald-50 transition-colors">Request Booking</button>
</div>
</div>
{/*  Card 3  */}
<div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-surface-container border-t-0 flex flex-col group">
<div className="relative h-64 overflow-hidden">
<img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="High quality close up of a heavy duty agricultural rotavator implement attached to a tractor in a field in Kolhapur" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsg0yYZQ64SOjWTXqfdITQT562klxrq-XjpEkGlbcqxndRueudpZ24FpM-tQUALC-_H792vJGeu5A3YXhRo3BbcuIJ4MI23Q1o9xx4O5qV4CzYbKL1ZoZNL3nqhmpAyIwcJbHZzR0Bi8jFOdaFdJjqKhRm3YnzAUETGW2fezmo8IhaNoyTAAfhwwPMTOaNbG-MC04vfybgHM5A9KIT0ZR6FK6ER1zjXJUdYmbiHNTxmQsdPs2fWNlHCJtZU7uVEf8KoJFHIHhS3r-"/>
<div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary-container px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span>
                                4.8 (56 Rentals)
                            </div>
<div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                                Available Today
                            </div>
</div>
<div className="p-6 flex-1 flex flex-col">
<div className="flex justify-between items-start mb-2">
<h4 className="text-xl font-headline font-extrabold text-on-surface">Maschio Gaspardo Virat</h4>
<span className="text-emerald-900 font-bold">₹1,200 <span className="text-xs font-normal text-outline">/day</span></span>
</div>
<div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
<span className="material-symbols-outlined text-base">location_on</span>
                                Ichalkaranji, Kolhapur
                            </div>
<div className="grid grid-cols-2 gap-4 mb-6">
<div className="bg-surface-container-low p-3 rounded-xl">
<div className="text-[10px] uppercase font-bold text-outline">Width</div>
<div className="font-bold text-on-surface">6 Feet</div>
</div>
<div className="bg-surface-container-low p-3 rounded-xl">
<div className="text-[10px] uppercase font-bold text-outline">Blades</div>
<div className="font-bold text-on-surface">42 High Carbon</div>
</div>
</div>
<button className="w-full bg-emerald-950 text-white py-3 rounded-xl font-headline font-bold mt-auto hover:bg-emerald-900 transition-colors">Book Now</button>
</div>
</div>
{/*  Card 4 (Showing more results)  */}
<div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-surface-container border-t-0 flex flex-col group">
<div className="relative h-64 overflow-hidden">
<img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A blue New Holland tractor working in a lush green field in Sangli under a soft overcast morning sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw74rBAQ7JEBnHKfjQ0zZgCgW5WQAHAT2fnosa23iUYslm328GIanc1mQULYuIh4HPXpi1VWHlfer3f9laq_HwZezwVNZ8GKU-lhUqdL1jT6tWYlPJ_E4m2urTG-Wex3Q0RH1aRUHUrwgcGwcJC_uF4F4B0Utpzw96pQEMd-mZF6UcEsKRvpkEUNaFKLvTp2SMZKe1YBvWltCLANaVIwfpCp5QnqaQENzHO19ibo4WX0D0ON3tiXDUYLI5E2l-1IVodPpD0Gy7unEE"/>
<div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary-container px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span>
                                4.9 (29 Rentals)
                            </div>
<div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                                Available Today
                            </div>
</div>
<div className="p-6 flex-1 flex flex-col">
<div className="flex justify-between items-start mb-2">
<h4 className="text-xl font-headline font-extrabold text-on-surface">New Holland 3630 TX</h4>
<span className="text-emerald-900 font-bold">₹2,400 <span className="text-xs font-normal text-outline">/day</span></span>
</div>
<div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
<span className="material-symbols-outlined text-base">location_on</span>
                                Vita, Sangli (15km away)
                            </div>
<div className="grid grid-cols-2 gap-4 mb-6">
<div className="bg-surface-container-low p-3 rounded-xl">
<div className="text-[10px] uppercase font-bold text-outline">HP</div>
<div className="font-bold text-on-surface">55 HP</div>
</div>
<div className="bg-surface-container-low p-3 rounded-xl">
<div className="text-[10px] uppercase font-bold text-outline">Operator</div>
<div className="font-bold text-on-surface">Included</div>
</div>
</div>
<button className="w-full bg-emerald-950 text-white py-3 rounded-xl font-headline font-bold mt-auto hover:bg-emerald-900 transition-colors">Book Now</button>
</div>
</div>
</div>
</div>
</section>
{/*  No Availability Help Path  */}
<section className="px-8 max-w-screen-2xl mx-auto mt-20">
<div className="bg-tertiary-fixed p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-10">
<div className="flex-1">
<h2 className="text-3xl font-headline font-black text-on-tertiary-fixed mb-4">Can't find what you need?</h2>
<p className="text-on-tertiary-fixed-variant text-lg font-medium mb-6">
                        If the specific equipment or dates you're looking for aren't listed, our local support team can help find alternatives from our offline network of verified owners.
                    </p>
<div className="flex flex-wrap gap-4">
<button className="bg-tertiary text-white px-8 py-4 rounded-2xl font-headline font-bold flex items-center gap-2">
<span className="material-symbols-outlined">call</span>
                            Request Callback
                        </button>
<button className="bg-white/50 backdrop-blur text-tertiary px-8 py-4 rounded-2xl font-headline font-bold border border-tertiary/20">
                            Submit Custom Requirement
                        </button>
</div>
</div>
<div className="w-full md:w-1/3">
<img alt="" className="rounded-[2rem] shadow-lg" data-alt="Friendly Indian customer service representative in a modern office, wearing a headset and smiling, representing professional support" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbfAJ6kXrXsfYOtuwzlLEzYttSYDFzql1_VDsDOe3WqHAyxQ_X7KJSCyt3j6UJ4b8PtM_gc9iLE8qvTGP7yr0vI7BEAXHL4coOKKnqtx7Cz5jOL43uvoxXl_Dv_MtCgFaI_FbdZc-WnCSSnUbhwz4myviANBufjLijMO1aUL3z5LDyr3UEFIxSZx4bI1lUNZElcvLQkuCvso8BKV7-OQBdhakZHVyYJeGzkmjpqGL1_OkRqVvRj0apNLGQ6N7bEJCwo2SImrGj8vnX"/>
</div>
</div>
</section>
</main>
{/*  Footer  */}

{/*  BottomNavBar (Mobile)  */}


      </main>
      <Footer />
    </div>
  );
}
