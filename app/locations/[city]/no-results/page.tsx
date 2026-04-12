import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return [
    { city: 'kalwan' }, { city: 'mukhed' }, { city: 'sangli' }, { city: 'pune' }, { city: 'mumbai' }
  ];
}

export default function NoResultsLoc() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">

{/*  Top Navigation Shell  */}

<main className="pt-32 pb-24 px-6 max-w-screen-xl mx-auto">
{/*  Error State Header  */}
<section className="mb-12">
<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
<div className="max-w-2xl">
<div className="flex items-center gap-2 mb-4">
<span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-sm">location_off</span>
                            Currently Unavailable
                        </span>
</div>
<h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4">No results in Satara</h1>
<p className="text-on-surface-variant text-lg max-w-xl">
                        We couldn't find any equipment matching your criteria in the Satara region right now. Don't worry, we're here to help you get the job done.
                    </p>
</div>
<div className="flex gap-3">
<button className="px-6 py-3 bg-primary-container text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg scale-95 active:scale-90 transition-transform">
<span className="material-symbols-outlined">call</span>
                        Request Callback
                    </button>
<button className="px-6 py-3 border-2 border-outline text-primary rounded-2xl font-bold flex items-center gap-2 scale-95 active:scale-90 transition-transform">
<span className="material-symbols-outlined">notifications_active</span>
                        Notify Me
                    </button>
</div>
</div>
</section>
{/*  Recovery Content Bento Grid  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/*  Area Suggestion Card  */}
<div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-outline-variant flex flex-col md:flex-row gap-8 overflow-hidden relative">
<div className="flex-1 z-10">
<h3 className="text-2xl font-bold text-primary mb-2">Nearby Availability</h3>
<p className="text-on-surface-variant mb-6">We found high availability in Kolhapur district, just 45km away from your location.</p>
<div className="space-y-4">
<div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-primary/5 hover:border-primary/20 transition-all cursor-pointer">
<div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-3xl">agriculture</span>
</div>
<div>
<h4 className="font-bold text-lg">Heavy Duty Tractors</h4>
<p className="text-sm text-on-surface-variant">12 units available in Kolhapur</p>
</div>
<span className="material-symbols-outlined ml-auto text-primary">arrow_forward_ios</span>
</div>
<div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-primary/5 hover:border-primary/20 transition-all cursor-pointer">
<div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center">
<span className="material-symbols-outlined text-on-tertiary-container text-3xl">precision_manufacturing</span>
</div>
<div>
<h4 className="font-bold text-lg">Rice Harvesters</h4>
<p className="text-sm text-on-surface-variant">4 units available in Kolhapur</p>
</div>
<span className="material-symbols-outlined ml-auto text-primary">arrow_forward_ios</span>
</div>
</div>
<button className="mt-8 text-primary font-bold flex items-center gap-2 hover:underline">
                        View all results in Kolhapur
                        <span className="material-symbols-outlined">east</span>
</button>
</div>
<div className="md:w-1/3 min-h-[300px] rounded-3xl overflow-hidden shadow-inner relative">
<img className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] opacity-80" data-alt="Modern satellite map view of rural farm lands with green and brown patches in Satara district, Maharashtra" data-location="Satara, Maharashtra" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw9QSlLEJDDyXxXc6Xt33wVLcql4DHyciw4N-m_tENtHtefJQv9SiIlgddkcXKj5s1O9TrJpugEMKjbNg46As1hS_mTU6JQMRbAC4rbja5VHALdcBIqE3lukrrV_g3XpbJxNcBYrnAI2cBLTWH0NrMHegK80GS5qOmWru1k9CRlw_4xgVIU3xHgBM5n7qCCCYyz_A9s4537QZgiiFhNPc0pZ0dSLQXdE8reV_z_zLsgoXZxKXzR53vm88jcc9KRKNs269KM2BERwJu"loading="lazy" decoding="async" />
<div className="absolute inset-0 flex items-center justify-center">
<div className="relative">
<div className="w-12 h-12 bg-primary/20 rounded-full animate-ping absolute -inset-0"></div>
<div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center relative">
<span className="material-symbols-outlined text-primary" style={{'fontVariationSettings': '\'FILL\' 1'}}>location_on</span>
</div>
</div>
</div>
</div>
</div>
{/*  Support Vertical Card  */}
<div className="bg-primary-container text-white rounded-[2rem] p-8 shadow-xl flex flex-col justify-between">
<div>
<div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-orange-500">support_agent</span>
</div>
<h3 className="text-2xl font-bold mb-4 leading-tight">Need urgent help?</h3>
<p className="text-emerald-100/80 mb-8">Our rural coordinators can manually check with local equipment owners who might not be listed yet.</p>
<ul className="space-y-4 mb-8">
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
<span>Direct coordination</span>
</li>
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
<span>Verified local owners</span>
</li>
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
<span>Priority booking</span>
</li>
</ul>
</div>
<button className="w-full bg-white text-primary font-black py-4 rounded-2xl hover:bg-emerald-50 transition-colors">
                    Talk to an Expert
                </button>
</div>
</div>
{/*  Help Categories Section  */}
<section className="mt-16">
<h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-2">
<span className="w-8 h-[2px] bg-orange-700"></span>
                OTHER WAYS TO PROCEED
            </h3>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/*  Option 1  */}
<div className="bg-white p-6 rounded-3xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-primary mb-4 block group-hover:scale-110 transition-transform">schedule</span>
<h4 className="font-bold text-lg mb-2">Change Dates</h4>
<p className="text-sm text-on-surface-variant">See if equipment becomes available in the coming days.</p>
</div>
{/*  Option 2  */}
<div className="bg-white p-6 rounded-3xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-primary mb-4 block group-hover:scale-110 transition-transform">tune</span>
<h4 className="font-bold text-lg mb-2">Adjust Filters</h4>
<p className="text-sm text-on-surface-variant">Broaden your search by removing some technical requirements.</p>
</div>
{/*  Option 3  */}
<div className="bg-white p-6 rounded-3xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-primary mb-4 block group-hover:scale-110 transition-transform">local_shipping</span>
<h4 className="font-bold text-lg mb-2">Check Logistics</h4>
<p className="text-sm text-on-surface-variant">Ask about long-distance delivery options for your area.</p>
</div>
{/*  Option 4  */}
<div className="bg-white p-6 rounded-3xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-primary mb-4 block group-hover:scale-110 transition-transform">history_edu</span>
<h4 className="font-bold text-lg mb-2">List Requirement</h4>
<p className="text-sm text-on-surface-variant">Post what you need and let owners find you directly.</p>
</div>
</div>
</section>
</main>
{/*  Footer Shell  */}

{/*  Bottom Navigation (Mobile Only)  */}


      </main>
      <Footer />
    </div>
  );
}
