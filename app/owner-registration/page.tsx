import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function OwnerRegistration() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">

{/*  TopNavBar  */}

<main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
{/*  Progress Header  */}
<div className="mb-12">
<h1 className="text-3xl font-extrabold text-primary mb-2">List Your Equipment</h1>
<p className="text-on-surface-variant mb-8">आपले उपकरण भाड्याने देण्यासाठी नोंदणी करा</p>
<div className="flex items-center justify-between border-b border-outline-variant overflow-x-auto whitespace-nowrap scrollbar-hide">
<div className="px-4 pb-4 step-active flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="info">info</span>
<span>Basic Info</span>
</div>
<div className="px-4 pb-4 step-inactive flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="image">image</span>
<span>Images</span>
</div>
<div className="px-4 pb-4 step-inactive flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="payments">payments</span>
<span>Pricing</span>
</div>
<div className="px-4 pb-4 step-inactive flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="location_on">location_on</span>
<span>Location</span>
</div>
<div className="px-4 pb-4 step-inactive flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="person">person</span>
<span>Operator</span>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
{/*  Form Section  */}
<div className="lg:col-span-2 space-y-10">
{/*  Section 1: Basic Info  */}
<section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
<h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="agriculture">agriculture</span>
                        Equipment Details / उपकरणाची माहिती
                    </h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="font-label text-sm font-semibold text-on-surface-variant">Equipment Type / उपकरणाचा प्रकार</label>
<select className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all">
<option>Select Type</option>
<option>Tractor (ट्रॅक्टर)</option>
<option>Harvester (कापणी यंत्र)</option>
<option>Rotavator (रोटाव्हेटर)</option>
<option>Seeder (पेरणी यंत्र)</option>
</select>
</div>
<div className="space-y-2">
<label className="font-label text-sm font-semibold text-on-surface-variant">Brand / मेक (उदा. Mahindra)</label>
<input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. John Deere" type="text"/>
</div>
<div className="space-y-2">
<label className="font-label text-sm font-semibold text-on-surface-variant">Model &amp; Year / मॉडेल आणि वर्ष</label>
<input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 5050E, 2022" type="text"/>
</div>
<div className="space-y-2">
<label className="font-label text-sm font-semibold text-on-surface-variant">Horsepower / अश्वशक्ती (HP)</label>
<input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 45" type="number"/>
</div>
</div>
</section>
{/*  Section 2: Upload UI  */}
<section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
<h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="add_a_photo">add_a_photo</span>
                        Photos / फोटो
                    </h2>
<p className="text-sm text-on-surface-variant mb-6">Upload clear photos of your equipment for better visibility.</p>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center bg-surface-container-low hover:bg-emerald-50 transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-3xl text-outline mb-2 group-hover:text-primary transition-colors" data-icon="upload">upload</span>
<span className="text-xs font-bold text-on-surface-variant">Add Cover</span>
</div>
<div className="relative group aspect-square rounded-xl overflow-hidden shadow-sm">
<img className="w-full h-full object-cover" data-alt="Close-up of a modern green tractor parked in a vibrant wheat field at midday with sharp details" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkU1MDeqjUKzld2Xll9nkvPbvF0gMqRaji9Gm7O3jaoKRJtWk3XHh63cCoKryTrkdH-hxl07dCiVnZzYhS2ZGgAQ_vxTq4Jl9PWQPPkr6QTtNMyT7uy-v7ry0HNPBRWnX0bz1IiJeGDQ84XeK7OWe9fEQXY3oHJfm1bhvzRkoV36Ge5w6fbxAzr8wmMjmdu6-nhXRNsSxP8l0BTo8e-5nNVLXK45smzYtLK57qRlrwZdtQzGlyvMWmmlx6V1Tgvd5bhzpXvXvppKmk"/>
<button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white text-error">
<span className="material-symbols-outlined text-sm" data-icon="close">close</span>
</button>
</div>
<div className="aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center bg-surface-container-low cursor-not-allowed">
<span className="material-symbols-outlined text-outline/50" data-icon="image">image</span>
</div>
<div className="aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center bg-surface-container-low cursor-not-allowed">
<span className="material-symbols-outlined text-outline/50" data-icon="image">image</span>
</div>
</div>
</section>
{/*  Section 3: Pricing  */}
<section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
<h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="currency_rupee">currency_rupee</span>
                        Pricing &amp; Billing / किंमत आणि बिलिंग
                    </h2>
<div className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-2">
<label className="font-label text-sm font-semibold text-on-surface-variant">Rate per Hour / प्रति तास दर</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
<input className="w-full pl-10 p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="800" type="number"/>
</div>
</div>
<div className="space-y-2">
<label className="font-label text-sm font-semibold text-on-surface-variant">Rate per Acre / प्रति एकर दर (Optional)</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
<input className="w-full pl-10 p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="1200" type="number"/>
</div>
</div>
</div>
<div className="p-4 bg-tertiary-fixed rounded-lg flex gap-4">
<span className="material-symbols-outlined text-on-tertiary-fixed" data-icon="lightbulb">lightbulb</span>
<p className="text-xs text-on-tertiary-fixed-variant leading-relaxed">
<strong>Tip:</strong> Farmers in your area usually charge ₹750–₹900 per hour for 45HP tractors. Competitive pricing helps you get more bookings.
                            </p>
</div>
</div>
</section>
{/*  Section 4: Location & Availability  */}
<section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
<h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="distance">distance</span>
                        Operational Area / कार्यक्षेत्र
                    </h2>
<div className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="space-y-2">
<label className="font-label text-sm font-semibold text-on-surface-variant">District / जिल्हा</label>
<select className="w-full p-3 rounded-lg border border-outline-variant bg-white">
<option>Satara</option>
<option>Pune</option>
<option>Nashik</option>
</select>
</div>
<div className="space-y-2">
<label className="font-label text-sm font-semibold text-on-surface-variant">Taluka / तालुका</label>
<input className="w-full p-3 rounded-lg border border-outline-variant" placeholder="e.g. Karad" type="text"/>
</div>
<div className="space-y-2">
<label className="font-label text-sm font-semibold text-on-surface-variant">Radius / त्रिज्या (KM)</label>
<input className="w-full p-3 rounded-lg border border-outline-variant" placeholder="15" type="number"/>
</div>
</div>
<div className="h-48 bg-surface-container-high rounded-xl overflow-hidden relative border border-outline-variant">
<img className="w-full h-full object-cover grayscale opacity-50" data-alt="Stylized map showing Satara district topography with markers for agriculture hubs and clean vector lines" data-location="Satara, India" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE2XpOUK9ws4B1N6CsCWTe7S7UDqF8-gogrPFqOKFs_Lfe3KJhjTiiEr7JfQZsoWfGgMKUDSvQLDF533vqWJQrrctAM5ZqtLS_3nrqQVsB2AwwqagakQnPoPIWWlcf2h5qDg8UC3RWc6gqaPzlARv3Edd2a6a77ZL_rDbnQqjKiHD0d5e8591pumrwm_CEdlSy_OAHK-nduKvdRoDD9qBgCqRZhpWGCbIm0y3At9LEpOdDOiwUCKU8tPnYaLSJW_Ji3WHvJB_Mrl9G"/>
<div className="absolute inset-0 flex items-center justify-center">
<div className="bg-primary/20 p-8 rounded-full border-2 border-primary animate-pulse"></div>
<div className="absolute bg-white px-3 py-1.5 rounded-full shadow-lg border border-primary flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-sm" data-icon="location_on" style={{'fontVariationSettings': '\'FILL\' 1'}}>location_on</span>
<span className="text-xs font-bold text-primary">Karad, Satara</span>
</div>
</div>
</div>
</div>
</section>
{/*  Navigation Buttons  */}
<div className="flex items-center justify-between pt-6">
<Link href="/owner-dashboard" className="px-8 py-3 text-primary font-bold hover:bg-emerald-50 rounded-lg transition-all">
                        Skip / वगळा
                    </Link>
<button className="px-10 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all">
                        Continue / पुढे सुरू ठेवा
                    </button>
</div>
</div>
{/*  Preview Card (Sticky)  */}
<div className="lg:col-span-1">
<div className="sticky top-28 space-y-6">
<div className="bg-white rounded-2xl border border-surface-container-highest shadow-xl overflow-hidden">
<div className="aspect-[4/3] relative">
<img className="w-full h-full object-cover" data-alt="Powerful blue tractor with large tires parked in a lush green field under a clear blue sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEqtpz50nGqO5PXychK55yTwvYxHnpQvgY7YdcTK_wZJDASU4EzqAKbR_qU1-7K49zffPeSVaKRx51vhC2xAOLDAPxhBECAYCYwXuhLqq8feYZMidBF4zldokMW10bkfDS4AmZSYQaZwopI95ndz-ri-flHU9u0oUlCA7hzuFWDGAiIHsB9qRF1M_3o5Hl7gIBGneiGkMwoh-xF0Y40IaAEMh8td4aOpML_HiSUFoGTdyAiRDaQ7EPhBf1NLQ8EB5bcwlrgIImNmb7"/>
<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">Live Preview</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-xs font-bold text-secondary uppercase tracking-widest">Tractor</p>
<h3 className="text-xl font-extrabold text-primary">Mahindra 575 DI</h3>
</div>
<div className="text-right">
<p className="text-lg font-black text-primary">₹850</p>
<p className="text-[10px] text-on-surface-variant font-bold">PER HOUR</p>
</div>
</div>
<div className="flex flex-wrap gap-2 mb-6">
<span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">45 HP</span>
<span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">Power Steering</span>
<span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">2022 Model</span>
</div>
<div className="flex items-center gap-3 pt-4 border-t border-surface-container-highest">
<div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Portrait of a smiling Indian farmer in a white shirt with a green landscape in the background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwok2EnfZT5USD1LJz32y3_ABau9sOGvXTwhePspXxEe3zcfrni3xkR84C3zdglew-2ihRO7PPDItpBmfbGLG0LWHwAWKDR3wO5pQHVHesVviwnaxqqCKVFiv4rwhhGAdvzgyefqjT_uIOBdHUpZc6YU3ErXFOQtkAiztE-L4ZG1Ib4NV9Scl6muOQNqmWS6rVQDJJhoG9njf7MS-p4fTdEfnqT6fPiJm7XCk6Jlzaqb1hewhTCB8Th1vf4-NA7P8JdnxX3xW8Zr7s"/>
</div>
<div>
<p className="text-xs font-bold text-primary">Sunil Deshmukh</p>
<p className="text-[10px] text-on-surface-variant">Verified Owner • Karad</p>
</div>
</div>
</div>
</div>
<div className="bg-secondary-fixed/30 p-6 rounded-2xl border border-secondary-container/20">
<h4 className="text-on-secondary-fixed-variant font-bold text-sm mb-2 flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="verified_user">verified_user</span>
                            Trust Policy
                        </h4>
<p className="text-xs text-on-secondary-fixed-variant/80 leading-relaxed">
                            Your listing will be reviewed within 24 hours. Ensure all information is accurate to avoid rejection.
                        </p>
</div>
</div>
</div>
</div>
</main>
{/*  Footer  */}


      </main>
      <Footer />
    </div>
  );
}
