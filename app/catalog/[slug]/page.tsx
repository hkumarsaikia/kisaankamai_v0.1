import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return [
    { slug: 'tractors' }, { slug: 'harvesters' }, { slug: 'ploughs' },
    { slug: 'sprayers' }, { slug: 'implements' }, { slug: 'pumps' },
    { slug: 'rotavators' }, { slug: 'balers' }, { slug: 'seeders' },
    { slug: 'trolleys' }, { slug: 'threshers' }
  ];
}

export default function EquipmentDetail() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">

{/*  Top Navigation (JSON Shell)  */}

<main className="pt-24 pb-12 px-4 md:px-8 max-w-screen-2xl mx-auto">
{/*  Breadcrumbs & Local Context  */}

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
{/*  Left: Gallery & Details (8 Columns)  */}
<div className="lg:col-span-8 space-y-10">
{/*  High-End Gallery  */}
<section className="space-y-4">
<div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-surface-variant relative group">
<img className="w-full h-full object-cover" data-alt="Modern high-performance John Deere tractor parked in a lush green Indian sugarcane field at sunrise with warm cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSyY2H9kmQ5H_MJHOrceuJUebS7Ji01L0-gQwyB68e-c7XWXXfhkzYDyyWBZYBrMRAg1sexAjcmLl4rsCV8RP3knzPrAAOJ73B9al5H57K4KHMjynhj35aIj2UbXmoF1iZdm0AVkLKJNcSWXWFEtcL1e8sCEW0jgL6XVBESQHx7djz0eaOUHCale4bGXMqTqDgctAQZVD75FZtMTGXQbFmD4gJwPlglP6t4xN6YA4q4_wm1VPpSmoCvsG9LNyEty-MjtgEq-pSdkbf"loading="lazy" decoding="async" />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
<span className="text-white font-headline font-medium">Main Field View - Sangli, Maharashtra</span>
</div>
</div>
<div className="grid grid-cols-4 gap-4">
<div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover" data-alt="Close up view of tractor engine and heavy duty wheels in an agricultural setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh9eiUT5qY0JurzZdIslVNqF7pZNYO1y6LAaS8RSxom-FogcaqyPRMDnW_493lmSmyl7iic7hWm1CCC2dsfXxLHqbo2XV25KP6hqSErCCSmp5ctrTUQE8MuIyejzg5rUsE9xVMm5GDcmQdpF5_Se_lsQn4zgd6loLqGeITe2o3tfmFetq9rME5454MmIiUYDmUtYhXbepoHmYtnSPjP-mxKWnWgNvik-F8yu5BMIAeJMjtYGC_y-P4CKI87wSqu-3c2rL6JLp00VQ4"loading="lazy" decoding="async" />
</div>
<div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover" data-alt="Ergonomic dashboard and controls inside a modern tractor cabin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJUayHc4m8eHQkQSlfUK-R5jvF0g5GtZfHm6Ya9vR5eq0ndLOT8pUFBV9oN8VAY2VQukqBtZVxPl70x0bq2WEj-xKWzEn6WV8D2oUu2wcP7YgdFgNRFRpM96aMZeKWonakgA2jVZHG2etfijeH4KGAwIzYzPCNL0WdHBy7hVwB7DOeSmyQ5hn5gWV_-G9YroXHNEkKCelFqHq59OIVR_3A46U4hRAast-iHSAVTlNu6C2ANbset1-ZfRNc66dpHOA7WDrs2dQvt_g6"loading="lazy" decoding="async" />
</div>
<div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-crop" data-alt="Rear view of tractor with rotavator attachment in a plowed field" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXl4OftQjfNzN_r4M-_69LZ8nlx8tLuvc0JnRfU_q-I2u-jVTez_jgxihOCs4fcinOX5VuMj_GEBDFkirhWvRentCkYNUBzTvO1d2lVN8K3mBO7EPst1O6YcrB-CfUFt5MJd4gReaoZMezfvqLijoUaiDd61dR69AI-qXWqUI30B2pIzk2wUH3D5pcztdT7VBRyMRjDew0EUemZWAPXIAKA6R0pC5pTVoa8JKdpt9z1E0t1QJcIMII6gGsNYRqAf8_2ziCBOXl55Yx"loading="lazy" decoding="async" />
</div>
<div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant relative flex items-center justify-center cursor-pointer group">
<div className="absolute inset-0 bg-primary-container/80 backdrop-blur-sm group-hover:bg-primary-container transition-colors"></div>
<div className="relative text-on-primary text-center">
<span className="material-symbols-outlined text-3xl mb-1">gallery_thumbnail</span>
<p className="text-xs font-bold uppercase tracking-widest">+12 Photos</p>
</div>
</div>
</div>
</section>
{/*  Product Intro Header  */}
<section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant">
<div className="space-y-2">
<div className="flex items-center gap-3 mb-2">
<span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">Premium Listing</span>
<span className="flex items-center gap-1 text-on-tertiary-container font-label font-bold text-sm">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span>
                                4.9 (42 Bookings)
                            </span>
</div>
<h1 className="text-4xl md:text-5xl font-headline font-extrabold text-primary leading-tight">John Deere 5310 Performer</h1>
<p className="text-lg text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-secondary">location_on</span>
                            Kavathe Mahankal, Sangli District
                        </p>
</div>
<div className="bg-surface-container p-6 rounded-3xl border border-outline-variant/30">
<p className="text-sm font-label text-outline mb-1">Rental Starting at</p>
<p className="text-3xl font-headline font-black text-primary">₹850 <span className="text-sm font-medium text-on-surface-variant">/ hour</span></p>
</div>
</section>
{/*  High-End Specs Bento Grid  */}
<section className="space-y-6">
<h2 className="text-2xl font-headline font-bold text-primary">Technical Specifications</h2>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="bg-white p-5 rounded-2xl border border-outline-variant/50 shadow-sm">
<span className="material-symbols-outlined text-secondary mb-3">settings_input_component</span>
<p className="text-xs font-label text-outline uppercase tracking-wider mb-1">Engine Power</p>
<p className="font-headline font-bold text-on-surface">55 HP Category</p>
</div>
<div className="bg-white p-5 rounded-2xl border border-outline-variant/50 shadow-sm">
<span className="material-symbols-outlined text-secondary mb-3">speed</span>
<p className="text-xs font-label text-outline uppercase tracking-wider mb-1">PTO Power</p>
<p className="font-headline font-bold text-on-surface">46.7 HP</p>
</div>
<div className="bg-white p-5 rounded-2xl border border-outline-variant/50 shadow-sm">
<span className="material-symbols-outlined text-secondary mb-3">oil_barrel</span>
<p className="text-xs font-label text-outline uppercase tracking-wider mb-1">Fuel Capacity</p>
<p className="font-headline font-bold text-on-surface">68 Liters</p>
</div>
<div className="bg-white p-5 rounded-2xl border border-outline-variant/50 shadow-sm">
<span className="material-symbols-outlined text-secondary mb-3">weight</span>
<p className="text-xs font-label text-outline uppercase tracking-wider mb-1">Lift Capacity</p>
<p className="font-headline font-bold text-on-surface">2000 kgf</p>
</div>
</div>
</section>
{/*  Content & Description  */}
<section className="grid md:grid-cols-2 gap-12">
<div className="space-y-6">
<h2 className="text-2xl font-headline font-bold text-primary">Features &amp; Inclusions</h2>
<ul className="space-y-4">
<li className="flex items-start gap-4">
<div className="bg-primary-fixed p-1.5 rounded-full mt-0.5">
<span className="material-symbols-outlined text-primary text-sm">check</span>
</div>
<div>
<p className="font-bold text-on-surface">Verified Professional Operator</p>
<p className="text-sm text-on-surface-variant">The rental includes a skilled operator from the local Sangli area with 5+ years experience.</p>
</div>
</li>
<li className="flex items-start gap-4">
<div className="bg-primary-fixed p-1.5 rounded-full mt-0.5">
<span className="material-symbols-outlined text-primary text-sm">check</span>
</div>
<div>
<p className="font-bold text-on-surface">Regular Maintenance Log</p>
<p className="text-sm text-on-surface-variant">Last serviced 15 days ago. Guaranteed zero downtime during critical field hours.</p>
</div>
</li>
<li className="flex items-start gap-4">
<div className="bg-primary-fixed p-1.5 rounded-full mt-0.5">
<span className="material-symbols-outlined text-primary text-sm">check</span>
</div>
<div>
<p className="font-bold text-on-surface">Fuel Management</p>
<p className="text-sm text-on-surface-variant">Standard pricing is excluding fuel. Diesel to be provided by the farmer on-site.</p>
</div>
</li>
</ul>
</div>
<div className="space-y-6">
<h2 className="text-2xl font-headline font-bold text-primary">Owner Details</h2>
<div className="bg-surface-container-low p-6 rounded-3xl flex items-center gap-5 border border-outline-variant/20">
<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
<img className="w-full h-full object-cover" data-alt="Portrait of a smiling professional Indian farm equipment owner wearing a clean shirt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx8BPkFHHBamaE-An0NzPhipkcRgYV4yxQwFlNhqIFtfQgtcYBE32I6H3zqvoMXVq98g6KnWjw_hznamk3yYw2EeQ2oYAHGvcZtqGPC-Ax0quwp2DaHiOKLFaXrT_kkZrJcnFMmVoHCNNOeJOeKtZXk1m8wkTS-F2XIbJPZz9ZsMV8gvq76TcK1ZaXxkQq7NFMG0TbSeOv2gv9lwNU4QAIHmx7Mton5nRBIInSJRHMJ9QwLIU9KirhwYAhU8bCt40CZj4ompQ4nZNp"loading="lazy" decoding="async" />
</div>
<div>
<p className="text-xs font-label text-outline uppercase tracking-widest">Listing Owner</p>
<p className="font-headline font-extrabold text-primary text-xl">Sanjay Patil</p>
<p className="text-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-xs text-primary" style={{'fontVariationSettings': '\'FILL\' 1'}}>verified</span>
                                    Identity Verified Member
                                </p>
</div>
</div>
<div className="flex gap-4">
<button className="flex-1 bg-white border border-primary text-primary px-4 py-3 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors">
<span className="material-symbols-outlined">chat_bubble</span>
                                Chat with Sanjay
                            </button>
</div>
</div>
</section>
</div>
{/*  Right: Inquiry Form & Sidebar (4 Columns)  */}
<aside className="lg:col-span-4">
<div className="sticky top-28 space-y-6">
{/*  Premium Inquiry Card  */}
<div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 p-8 space-y-6">
<div className="space-y-2">
<h3 className="text-2xl font-headline font-extrabold text-primary">Reserve this Equipment</h3>
<p className="text-sm text-on-surface-variant">Check availability and get a precise quote for your specific field requirements.</p>
</div>
<form className="space-y-4">
<div className="space-y-1.5">
<label className="text-xs font-label font-bold text-outline uppercase tracking-wider">Field Location (Sangli Region Only)</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-3.5 text-outline text-lg">location_on</span>
<input className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-label" placeholder="Village / Taluka name" type="text"/>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="space-y-1.5">
<label className="text-xs font-label font-bold text-outline uppercase tracking-wider">Work Type</label>
<select className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-label">
<option>Plowing</option>
<option>Sowing</option>
<option>Transport</option>
<option>Harrowing</option>
</select>
</div>
<div className="space-y-1.5">
<label className="text-xs font-label font-bold text-outline uppercase tracking-wider">Approx Hours</label>
<input className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-label" placeholder="8" type="number"/>
</div>
</div>
<div className="space-y-1.5">
<label className="text-xs font-label font-bold text-outline uppercase tracking-wider">Phone Number</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-3.5 text-outline text-lg">call</span>
<input className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-label" placeholder="+91 00000 00000" type="tel"/>
</div>
</div>
<button className="w-full bg-secondary text-on-secondary font-headline font-black py-4 rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Request Booking Callback
                            </button>
</form>
<div className="flex items-center gap-3 p-4 bg-tertiary-fixed rounded-2xl">
<span className="material-symbols-outlined text-on-tertiary-fixed-variant">verified_user</span>
<p className="text-xs font-label text-on-tertiary-fixed leading-tight">Your booking is protected by <span className="font-bold">Kisan Kamai Guarantee</span>. Payment is only released after work completion.</p>
</div>
</div>
{/*  Local Map Preview  */}
<div className="bg-surface-container-highest rounded-3xl overflow-hidden relative h-48 border border-outline-variant">
<img className="w-full h-full object-cover opacity-60 grayscale mix-blend-multiply" data-alt="Top down satellite view style abstract map showing agricultural field patterns and village roads" data-location="Sangli, Maharashtra" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqjjSxhYO7axJt_TQZ7nMnz-n9kYSVAw9LlPLNsSu_A78_ikYptP2v_6XXFHHkOHNtjwvLi_RsJSra8HdK-gxQv-ifAEWSQp7weu2vV0QObwtPHUE7p8L1dY3E2vD2QZUFBEt-OxZC3g0uW7p_UP3MQ4UhnwiIc9AL1KYdOwjLvrBGbofEJy_MAYUZr4cpC_UIRO1M1PK3KP8e4H64HDihsVR3sY36XDciEa_mvRtWBe60akNVp_uRr69L3Tyx2Wr_RBkDHJV9g_H0"loading="lazy" decoding="async" />
<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
<div className="relative">
<span className="material-symbols-outlined text-secondary text-5xl drop-shadow-xl" style={{'fontVariationSettings': '\'FILL\' 1'}}>location_on</span>
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-lg border border-outline-variant whitespace-nowrap text-xs font-bold text-primary">
                                    Owner is within 15km
                                </div>
</div>
</div>
</div>
</div>
</aside>
</div>
{/*  Related Equipment Horizontal Scroll  */}
<section className="mt-20 space-y-8">
<div className="flex items-center justify-between">
<div>
<h2 className="text-3xl font-headline font-extrabold text-primary">Similar in Sangli Region</h2>
<p className="text-on-surface-variant">Recommended equipment based on your area and crop season.</p>
</div>
<div className="flex gap-2">
<button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors">
<span className="material-symbols-outlined">arrow_back</span>
</button>
<button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors">
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
<div className="flex gap-6 overflow-x-auto no-scrollbar pb-8">
{/*  Card 1  */}
<div className="min-w-[320px] bg-white rounded-3xl border border-outline-variant/30 overflow-hidden group">
<div className="h-48 overflow-hidden relative">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Powerful Mahindra tractor in a golden sunset field" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8aPstg-9kV4PXknfBO-qOSkcyG7JAfRa3VhAam-Tpe4-Nf1DddIgB64mI66T79HrpdTgJwexYkRVqGCvP1A4z0nySQvwXfRxwpB5gaWL6EnppfR9l37aIPGHHdZR7YSOaSC0biV2jDSDZPuM8LiHOjPgruIl0V_IdifjgzkwW0lihQuDy2lKqmxNEh-a-_FRJHHoy18rZxgHo3rTE8MvZl0uFof2VdUVsEAq9PMhmC9ZBRuNQ3xL5ZBBDxaRk2LmzVig274QdYdbP"loading="lazy" decoding="async" />
<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">₹750/hr</div>
</div>
<div className="p-6 space-y-3">
<h4 className="font-headline font-bold text-lg group-hover:text-secondary transition-colors">Mahindra 575 DI</h4>
<p className="text-sm text-outline flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>Tasgaon, Sangli</p>
<div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
<span className="text-xs font-label bg-surface-container px-2 py-1 rounded">45 HP</span>
<span className="text-xs font-label font-bold text-on-tertiary-container flex items-center gap-0.5">
<span className="material-symbols-outlined text-xs" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span> 4.7
                            </span>
</div>
</div>
</div>
{/*  Card 2  */}
<div className="min-w-[320px] bg-white rounded-3xl border border-outline-variant/30 overflow-hidden group">
<div className="h-48 overflow-hidden relative">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Kubota mini tractor suitable for orchards and tight spaces" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzYbHMyx64YcSJD0yFY3h2oo9_8cVrZPGi3P7J8ektor0C-s3Yj3Kw6eMc7OkLtjvtX4rKhT39UJK7nGlccT0wJ2EDOx2fkrwot38DJOj6yOMYbRdr3-l6Pm77aeerwr1e42aF8qb3EeFe9R8QbmNjflFTdFclaWL5lb5YA9w3IsHlN8hsMV-auKKZYq0tVIJssocFFNeeuXM8IGYsRJMTm3POSOKFaAHLBRciptDoVVpDj7hu6FJ57sRwiwp6tWduSH_JUhO9NZ7b"loading="lazy" decoding="async" />
<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">₹600/hr</div>
</div>
<div className="p-6 space-y-3">
<h4 className="font-headline font-bold text-lg group-hover:text-secondary transition-colors">Kubota MU5502</h4>
<p className="text-sm text-outline flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>Miraj, Sangli</p>
<div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
<span className="text-xs font-label bg-surface-container px-2 py-1 rounded">50 HP</span>
<span className="text-xs font-label font-bold text-on-tertiary-container flex items-center gap-0.5">
<span className="material-symbols-outlined text-xs" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span> 4.8
                            </span>
</div>
</div>
</div>
{/*  Card 3  */}
<div className="min-w-[320px] bg-white rounded-3xl border border-outline-variant/30 overflow-hidden group">
<div className="h-48 overflow-hidden relative">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Powerful Swaraj tractor with cultivator attached" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ8KKP9IQY6iTtx_mDUut7Zwgt7dulqWr4f78pfv_Mz3YyOpjsfX_VphS6KACpflaIrGIRarva1w5pPlKs_4VUgU2qVCFcTvg9SYSr9F3FIpI0js07bOjcZd-v-H3yn077dTU2kT9qyvpkkfmUyCeEYeEG_WEMcT8oLTZas2fYmpMdyH-UomWZ-hB6d1R7KTi-NO_-6p76avaQrsizhcKjwzFYiz87Lw0u4Fo6aEDZD2VEb2gsQ_7O5JBWt73xgQYAqynwQPkIinfp"loading="lazy" decoding="async" />
<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">₹800/hr</div>
</div>
<div className="p-6 space-y-3">
<h4 className="font-headline font-bold text-lg group-hover:text-secondary transition-colors">Swaraj 855 FE</h4>
<p className="text-sm text-outline flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>Vita, Sangli</p>
<div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
<span className="text-xs font-label bg-surface-container px-2 py-1 rounded">55 HP</span>
<span className="text-xs font-label font-bold text-on-tertiary-container flex items-center gap-0.5">
<span className="material-symbols-outlined text-xs" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span> 4.9
                            </span>
</div>
</div>
</div>
</div>
</section>
</main>
{/*  Footer (JSON Shell)  */}

{/*  Bottom Nav for Mobile Only (JSON Shell)  */}
<div className="md:hidden fixed bottom-0 left-0 w-full h-20 z-50 flex justify-around items-center px-6 pb-2 bg-white/90 dark:bg-emerald-950/90 backdrop-blur-lg border-t border-emerald-100 dark:border-emerald-900 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[32px]">
<div className="flex flex-col items-center text-emerald-800/50 dark:text-emerald-200/50 transition-transform active:scale-90">
<span className="material-symbols-outlined">home</span>
<span className="font-['Mukta'] text-[12px] font-bold">Home</span>
</div>
<div className="flex flex-col items-center text-orange-700 dark:text-orange-500 scale-110 transition-transform active:scale-90">
<span className="material-symbols-outlined">handyman</span>
<span className="font-['Mukta'] text-[12px] font-bold">Rent</span>
</div>
<div className="flex flex-col items-center text-emerald-800/50 dark:text-emerald-200/50 transition-transform active:scale-90">
<span className="material-symbols-outlined">currency_rupee</span>
<span className="font-['Mukta'] text-[12px] font-bold">Earn</span>
</div>
<div className="flex flex-col items-center text-emerald-800/50 dark:text-emerald-200/50 transition-transform active:scale-90">
<span className="material-symbols-outlined">person</span>
<span className="font-['Mukta'] text-[12px] font-bold">Profile</span>
</div>
</div>

      </main>
      <Footer />
    </div>
  );
}
