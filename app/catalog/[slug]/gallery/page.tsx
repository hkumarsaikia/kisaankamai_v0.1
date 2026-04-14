import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContentImage } from "@/components/ContentImage";

export function generateStaticParams() {
  return [
    { slug: 'tractors' }, { slug: 'harvesters' }, { slug: 'ploughs' },
    { slug: 'sprayers' }, { slug: 'implements' }, { slug: 'pumps' },
    { slug: 'rotavators' }, { slug: 'balers' }, { slug: 'seeders' },
    { slug: 'trolleys' }, { slug: 'threshers' }
  ];
}

export default function EquipmentDetailVariant() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">

{/*  TopNavBar  */}

<main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
{/*  Breadcrumbs  */}

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
{/*  Left Column: Media & Specs  */}
<div className="lg:col-span-8 space-y-12">
{/*  Gallery Section  */}
<section className="space-y-4">
<div className="relative aspect-[16/9] overflow-hidden rounded-xl group">
<ContentImage className="w-full h-full object-cover" alt="high-resolution cinematic shot of a green John Deere 5310 tractor parked in a lush Indian wheat field during sunset" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjyxXIJJ6WiY6OI8G6YQSPyaiGAeR-Z_YTsna_HUjT-3kCv-rfBjKkQgzwcEAU6jmTgXzOAzs2bi-dTEQr7g9t1SeLJ_tKeBGnbki__GKoSI5Y2ocDLmr7LSl1Pp4d9r-ByET-ECYnDkaqYzBc1NAtZKsjNtu_on9RzjtXHBRJhsDenkrP2uGmKFvJb1Xyr0PSxCyW6IfCcSYhKk7_UsKugQFaxFtCWosMMAPlTuE8BSAWObJONZWXm_HRuDqgzhD-KVQJeuZ2i10w"loading="lazy" decoding="async" />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
<span className="text-white font-label text-sm bg-black/40 backdrop-blur px-3 py-1 rounded-full">Exterior View • Field Ready</span>
</div>
</div>
<div className="grid grid-cols-4 gap-4">
<div className="aspect-square rounded-lg overflow-hidden border-2 border-primary-container ring-offset-2 ring-2 ring-transparent">
<ContentImage className="w-full h-full object-cover" alt="side profile of a green modern tractor in a rural farm setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp904-zCMJnnTenpE3Ap9zZtiRvESuzL-EWgHqaB2hfovaMuAixDrxFzVnZsrudHi9--3qJSORzVFOCbrLCW3cFiou4b41daX4xMo_HXQjD9Oa6_ntUyzQ8WGjele5FBYHiR_5dDrz9zyNPgM5XaKLvo0HmzDAXvwrOqu_vO95sT4Kgm2iOUFaeHbGNPQwvOqgnMzlfSULcsaMUjm040lzw6bpz4wbLHwNcZPK7Fv3NOa-vbFvCQ7pVzpUnWRq9QvxtGElohUyu9x9"loading="lazy" decoding="async" />
</div>
<div className="aspect-square rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
<ContentImage className="w-full h-full object-cover" alt="close-up of tractor dashboard and steering wheel with modern digital controls" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCscFeTLbhEY1HeR187fmDkJ0vE869sRv4Fm8SqqUbJylVq-YzoXhOR2UHBKFJ882lFeBvYVT4FjraRwtjU5BNJaETYwesyrNKWm1FS3_pmO7Ku0dnApgVSco21xcfl-vRvnV-katQFvhQktiJK-24S6BpSjh57ZMTV4ZlpGglmAIhWFpFOQaJqTYCfUlufUMiwdT-kyjVmToPnZ6X1jO4l0UbhwOEtEHJ_e-ZLUsIUw-h8ONbzl6jaJfV2azT8Oq7ABU-w94RIEIuY"loading="lazy" decoding="async" />
</div>
<div className="aspect-square rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
<ContentImage className="w-full h-full object-cover" alt="close-up of large tractor rear tires with heavy tread in soft brown soil" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArhI421MnRh9MTyM8Og0XYjMp_9bMCAhRVUYVyBU0kRje1UuNEPhdnGb3beLBpRNz2Bj8YQPXRjDPnRMPTY4iV9bS3WNfgaTptaFjMaa-v_155-LJ0ciGUStS1sskaPF5ZXPFNU-SsyXvXF0NP5EcKQjFg9Mp6y_9rqYm-vXIi_J56gT5yOmQTa05YjVnFC5j65JaKznXOsGv6X5wS9WRWCRJJfHhDKaaQFb04Dyl_8txsz8yGMogKTqRyMawkVu60GBuo7r_ip1kg"loading="lazy" decoding="async" />
</div>
<div className="relative aspect-square rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
<ContentImage className="w-full h-full object-cover" alt="wide shot of a tractor working in a vast green field under a blue sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTIWpTmWen5Nf1oaiRYYEvAITI2fxew4k6Z_3fQy1JyLWi08oGNs7tnirEOyVjU6cmzDkN7AxF_D_3GBEMfNVlc5QDi1HsKk84j6LtIlmyounFydqvnJK9fSyBQzOWhkkbTwa44ZBy1Az2pyxHrmrDjW5afpbHHA4vTid31fktHLPbrW6AO1oxExBxNn8fipEsSAZLzWyY5aguzOeAD9PLr2YV_1McFDKVvPWe3iWzTWWCtwA0-hLq_uPzvPcXl_-uTCTsvxEt4Gn7"loading="lazy" decoding="async" />
<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
<span className="text-white font-bold text-lg">+12</span>
</div>
</div>
</div>
</section>
{/*  Specs Bento Grid  */}
<section>
<div className="flex items-end justify-between mb-6">
<h2 className="text-3xl font-black text-primary tracking-tight font-headline">Technical Specifications</h2>
<span className="text-sm font-label text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-base">verified</span> Verified by Kisan Kamai
                        </span>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
<span className="material-symbols-outlined text-secondary text-3xl mb-2">bolt</span>
<span className="text-2xl font-black text-primary">55 HP</span>
<span className="text-xs font-label uppercase tracking-widest text-on-surface-variant mt-1">Engine Power</span>
</div>
<div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
<span className="material-symbols-outlined text-secondary text-3xl mb-2">settings_input_component</span>
<span className="text-2xl font-black text-primary">46.7 HP</span>
<span className="text-xs font-label uppercase tracking-widest text-on-surface-variant mt-1">PTO Power</span>
</div>
<div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
<span className="material-symbols-outlined text-secondary text-3xl mb-2">weight</span>
<span className="text-2xl font-black text-primary">2000 KG</span>
<span className="text-xs font-label uppercase tracking-widest text-on-surface-variant mt-1">Lift Capacity</span>
</div>
<div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
<span className="material-symbols-outlined text-secondary text-3xl mb-2">calendar_today</span>
<span className="text-2xl font-black text-primary">2022</span>
<span className="text-xs font-label uppercase tracking-widest text-on-surface-variant mt-1">Model Year</span>
</div>
</div>
</section>
{/*  Description & Features  */}
<section className="prose prose-slate max-w-none">
<h3 className="text-2xl font-bold text-primary font-headline mb-4">About this Equipment</h3>
<p className="text-on-surface-variant leading-relaxed text-lg mb-6">
                        The John Deere 5310 GearPro is a powerhouse designed for heavy-duty agricultural tasks. Featuring a high-torque engine and a versatile 12F+4R gear system, it excels in both puddling and dry land operations. This specific unit is maintained by a certified operator and comes equipped with standard linkage for various implements.
                    </p>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-outline-variant/20 rounded-lg">
<span className="material-symbols-outlined text-emerald-600" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
<span className="text-on-surface font-medium">Power Steering &amp; Oil Immersed Brakes</span>
</div>
<div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-outline-variant/20 rounded-lg">
<span className="material-symbols-outlined text-emerald-600" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
<span className="text-on-surface font-medium">Side Shift Gear Lever for Comfort</span>
</div>
<div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-outline-variant/20 rounded-lg">
<span className="material-symbols-outlined text-emerald-600" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
<span className="text-on-surface font-medium">Dual Clutch for Independent PTO</span>
</div>
<div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-outline-variant/20 rounded-lg">
<span className="material-symbols-outlined text-emerald-600" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
<span className="text-on-surface font-medium">Extra Coolant Reservoir for Long Hours</span>
</div>
</div>
</section>
{/*  Availability & Location  */}
<section>
<h3 className="text-2xl font-bold text-primary font-headline mb-6">Location &amp; Service Area</h3>
<div className="bg-surface-container-high rounded-2xl overflow-hidden border border-outline-variant/30">
<div className="h-64 bg-slate-300 relative">
{/*  Map Placeholder  */}
<div className="absolute inset-0 bg-cover bg-center" data-location="Nashik, Maharashtra" style={{'backgroundImage': 'url(\'https'}}></div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="bg-primary text-white p-3 rounded-full shadow-xl ring-4 ring-white">
<span className="material-symbols-outlined">agriculture</span>
</div>
</div>
</div>
<div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900">
<div>
<p className="text-sm font-label text-on-surface-variant uppercase tracking-widest">Base Location</p>
<p className="text-xl font-bold text-primary">Niphad, Nashik District</p>
<p className="text-sm text-on-surface-variant">Available for service within 25km radius</p>
</div>
<div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 rounded-full">
<span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
<span className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Ready for Booking</span>
</div>
</div>
</div>
</section>
</div>
{/*  Right Column: Booking Card & Operator  */}
<div className="lg:col-span-4 space-y-8">
{/*  Inquiry Card  */}
<div className="sticky top-28 bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-2xl p-6 shadow-xl shadow-primary/5">
<div className="flex items-baseline gap-2 mb-6">
<span className="text-4xl font-black text-primary">₹800</span>
<span className="text-on-surface-variant font-label">/ hour</span>
</div>
<div className="space-y-4 mb-6">
<div className="p-4 bg-surface-container rounded-xl border border-outline-variant/20">
<label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Select Service Date</label>
<div className="flex items-center justify-between">
<span className="font-bold text-on-surface">Tomorrow, Oct 24</span>
<span className="material-symbols-outlined text-secondary">calendar_month</span>
</div>
</div>
<div className="p-4 bg-surface-container rounded-xl border border-outline-variant/20">
<label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Estimated Hours</label>
<div className="flex items-center justify-between">
<span className="font-bold text-on-surface">Minimum 4 Hours</span>
<span className="material-symbols-outlined text-secondary">schedule</span>
</div>
</div>
</div>
<button className="w-full bg-primary-container text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-primary-container/20 hover:translate-y-[-2px] active:translate-y-0 transition-all mb-4">
                        Request to Book
                    </button>
<p className="text-center text-xs text-on-surface-variant font-label px-4">
                        Price includes operator charges. Fuel to be discussed based on usage.
                    </p>
<hr className="my-6 border-slate-100 dark:border-slate-800"/>
{/*  Operator Profile  */}
<div>
<p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-4">Equipment Owner</p>
<div className="flex items-center gap-4">
<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-fixed">
<ContentImage className="w-full h-full object-cover" alt="friendly portrait of an Indian farmer in his mid-40s wearing a light colored shirt and a traditional turban" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2BiR1rjpxOmr3q_f5941_oTESNDHkSXVWFEBzVJB6B5qXRMC1DSAagwi8Ue_o-PAs4Oo6XMHV-CLtfd7KPRBemtMFGC2f3YBadUOfXRGvuGlbUb_0neKm1lgsB8NLgWUDqffWvmak5dWYthdC1SUyA0uzBOZsdc4VpPTyJui2e3rUZl24430KHeQkstUXNUACqCfuffo_-vTR1vFf4Aaq-n0lpbyrJaO7r1PgllJHHLZ0_L0wxirf16EnCkSpxZOESIFCVOU-MmSc"loading="lazy" decoding="async" />
</div>
<div>
<h4 className="font-black text-primary text-lg">Rajesh Gaikwad</h4>
<div className="flex items-center gap-1 text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-amber-500 text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>star</span>
<span className="font-bold">4.8</span>
<span>(14 Bookings)</span>
</div>
<p className="text-xs font-medium text-secondary">Responds in &lt; 2 hours</p>
</div>
</div>
</div>
</div>
{/*  Trust Badges  */}
<div className="grid grid-cols-1 gap-3">
<div className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
<span className="material-symbols-outlined text-emerald-700 bg-emerald-50 dark:bg-emerald-950 p-2 rounded-lg">shield_with_heart</span>
<div>
<p className="font-bold text-sm text-primary">Kisan Safety Shield</p>
<p className="text-xs text-on-surface-variant">Secure payments and verified operators for peace of mind.</p>
</div>
</div>
<div className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
<span className="material-symbols-outlined text-emerald-700 bg-emerald-50 dark:bg-emerald-950 p-2 rounded-lg">support_agent</span>
<div>
<p className="font-bold text-sm text-primary">Dedicated Support</p>
<p className="text-xs text-on-surface-variant">Call our helpdesk for assistance in English or Marathi.</p>
</div>
</div>
</div>
</div>
</div>
{/*  Related Equipment  */}
<section className="mt-20">
<div className="flex items-center justify-between mb-8">
<h2 className="text-3xl font-black text-primary tracking-tight font-headline">Similar Tractors Nearby</h2>
<a className="text-secondary font-bold hover:underline" href="#">View All</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/*  Card 1  */}
<div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-outline-variant/20 hover:shadow-xl transition-all">
<div className="relative h-48 overflow-hidden">
<ContentImage className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="red Mahindra tractor parked near a farmhouse with mountain backdrop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_og2NXDprVuuyb04vwODdVDVH8FdarGikHCsd0Sc30yB-IWlnuTknFrnLWuty0pWJGuh7oYc63lrulH8zmrii9ZVBQHfsEpXI2bPSAroAKHsX1aHlbbIIx1zuEodZkYHvODhC1tO-wsQATFkfIirya4ZpsGILy0fjh7s3uA6Hh8o47ts2mGvl2Btlr2yIwE1dF_QygFzme4UeCKdkReX72CW6koe8yrvHUFiKwbEPzZVYlp_aZzax5-USCuJ5fP14VL1PrYBUizFo"loading="lazy" decoding="async" />
<div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-primary">₹750/hr</div>
</div>
<div className="p-5">
<h4 className="font-bold text-lg text-primary mb-1">Mahindra 575 DI XP Plus</h4>
<p className="text-sm text-on-surface-variant flex items-center gap-1 mb-4">
<span className="material-symbols-outlined text-sm">location_on</span> Sangamner (12km away)
                        </p>
<div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-secondary">bolt</span>
<span className="text-sm font-bold">47 HP</span>
</div>
<button className="text-primary font-black text-sm uppercase tracking-widest hover:text-secondary transition-colors">Details</button>
</div>
</div>
</div>
{/*  Card 2  */}
<div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-outline-variant/20 hover:shadow-xl transition-all">
<div className="relative h-48 overflow-hidden">
<ContentImage className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="New Holland blue tractor in an open agricultural field" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxkM2kDd4XPDSVF1lyaOJA0cmxKE5S44Jh3tTTBR9xb2sHy69PR2rpbMbRXFtiIKI2tHrJtJw3ZJckBMmpsvJapuFjeO2n_Qbuak8ADuf70X1W-Pnbx88FmZxzEPFDbaWedZvDhSN7kEnwzppuwnhxjZYzxcciuRLl5wa_IPoR9D8e9NUUf4NryRaDK3nYEX3usiVqaqTI9U7f50DFBIeDRgYJmCBCmep-NZT-JDd9F6GmCwc4AGTEUvFCm6aQUN-dn3G_1CTlmRIx"loading="lazy" decoding="async" />
<div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-primary">₹850/hr</div>
</div>
<div className="p-5">
<h4 className="font-bold text-lg text-primary mb-1">New Holland 3630 TX Plus</h4>
<p className="text-sm text-on-surface-variant flex items-center gap-1 mb-4">
<span className="material-symbols-outlined text-sm">location_on</span> Yeola (18km away)
                        </p>
<div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-secondary">bolt</span>
<span className="text-sm font-bold">55 HP</span>
</div>
<button className="text-primary font-black text-sm uppercase tracking-widest hover:text-secondary transition-colors">Details</button>
</div>
</div>
</div>
{/*  Card 3  */}
<div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-outline-variant/20 hover:shadow-xl transition-all">
<div className="relative h-48 overflow-hidden">
<ContentImage className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Sonalika tractor working in a field with dust rising behind it" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2IZtYHmMxAWszB2OYEdHGSrEZz3HmE5xaK-MdNaoaUaZvbOjLeNcTme-zHZdLR5jVB2WSZjpujBJ4umJM_3oIV5OoTtPZPe8RwR-6oRBt_wPV468C6TTGleBuZ_yTSureAOqN51KU0hqz0zjZUyeHvK9jZDdQ1AmrpofWgGcn22oFeV6TOSZqEq_00LZR4doyYQc5DzrMyqeGLi5Hl-bhoSisNGElNkYIR6LXPj-tm57qBVT62r2TC879hQQXY-Lm28oPYMkmJ0y5"loading="lazy" decoding="async" />
<div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-primary">₹780/hr</div>
</div>
<div className="p-5">
<h4 className="font-bold text-lg text-primary mb-1">Sonalika Tiger DI 50</h4>
<p className="text-sm text-on-surface-variant flex items-center gap-1 mb-4">
<span className="material-symbols-outlined text-sm">location_on</span> Sinnar (22km away)
                        </p>
<div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-secondary">bolt</span>
<span className="text-sm font-bold">52 HP</span>
</div>
<button className="text-primary font-black text-sm uppercase tracking-widest hover:text-secondary transition-colors">Details</button>
</div>
</div>
</div>
</div>
</section>
{/*  FAQ Section  */}
<section className="mt-20 mb-20">
<div className="max-w-3xl mx-auto">
<h2 className="text-3xl font-black text-primary tracking-tight font-headline mb-8 text-center">Frequently Asked Questions</h2>
<div className="space-y-4">
<details className="group bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-xl p-6 open:shadow-md transition-all">
<summary className="flex justify-between items-center cursor-pointer list-none">
<span className="font-bold text-lg text-primary">Who provides the fuel?</span>
<span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
</summary>
<p className="mt-4 text-on-surface-variant leading-relaxed">
                            Fuel arrangements are typically discussed during the booking confirmation. Usually, the owner provides the tractor with a full tank, and the renter pays for the fuel consumed based on the hours of work.
                        </p>
</details>
<details className="group bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-xl p-6 open:shadow-md transition-all">
<summary className="flex justify-between items-center cursor-pointer list-none">
<span className="font-bold text-lg text-primary">Is the operator included in the price?</span>
<span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
</summary>
<p className="mt-4 text-on-surface-variant leading-relaxed">
                            Yes, the listed hourly rate of ₹800 includes the services of a professional operator. Our operators are experienced in handling the equipment and performing various agricultural tasks efficiently.
                        </p>
</details>
<details className="group bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-xl p-6 open:shadow-md transition-all">
<summary className="flex justify-between items-center cursor-pointer list-none">
<span className="font-bold text-lg text-primary">What happens if the equipment breaks down?</span>
<span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
</summary>
<p className="mt-4 text-on-surface-variant leading-relaxed">
                            In case of a technical failure, you are not charged for the downtime. The owner will either arrange for immediate repair or a replacement. Kisan Kamai support is available to mediate any disputes regarding work hours.
                        </p>
</details>
</div>
</div>
</section>
</main>
{/*  Footer  */}


      </main>
      <Footer />
    </div>
  );
}



