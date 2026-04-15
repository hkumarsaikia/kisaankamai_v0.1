import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContentImage } from "@/components/ContentImage";

export default function ListEquipment() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">

        {/*  TopNavBar Component  */}

        <div className="pt-20">
          {/*  Hero Section  */}
          <section className="relative min-h-[500px] md:min-h-[70vh] py-16 flex items-center overflow-hidden">
<div className="absolute inset-0 z-0">
<div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent z-10"></div>
<ContentImage alt="Owner with tractor" className="w-full h-full object-cover" data-alt="A smiling Indian farmer standing proudly next to his clean modern green tractor in a lush sugarcane field in Kolhapur at sunrise" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpJNrHUhz2IVLOk8s20PA7GB7Td4tJa3tkVfqY2uvx4s3YdLgn1vqZX12LfmdgfhNIPSsL-yc67FdukLdGtl02Z8M_XgXPkHu5fN0MHfiib-OLwDso9DhjaNGZ85EJs484Lth2-XlFRgZ7D8Z7YwRujfWl6at-ANFRZ7JiNgI9_zqJOF9FThdiLwtaGJsEJxNTJw3kw9dTyquLXw2IL6PNz5OygaUfcoFoHdCDNRs4CqLnCQm0F9nbvG59y_VaMsoTZbnAUWgzUIM7"loading="lazy" decoding="async" />
</div>
<div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
<div className="max-w-2xl">
<span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md text-amber-200 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>stars</span>
                        Empowering Rural Owners
                    </span>
<h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                        Your Equipment, <br/>
<span className="text-secondary-container">Your Extra Income.</span>
</h1>
<p className="font-body text-xl text-white/90 mb-10 leading-relaxed max-w-xl">
                        List your tractors, harvesters, and implements on Kisan Kamai. Reach verified farmers across Sangli, Satara, and Kolhapur.
                    </p>
<div className="flex flex-col sm:flex-row gap-4">
<button className="bg-secondary text-white px-8 py-4 rounded-xl font-headline font-bold text-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-secondary/20">
                            List and Earn Now
                        </button>
<button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-white/20 active:scale-95 transition-all">
                            Check Earnings Potential
                        </button>
</div>
</div>
</div>
</section>
{/*  Why List Section (Efficiency, Trust, Payments)  */}
<section className="py-24 bg-white">
<div className="max-w-7xl mx-auto px-6">
<div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
<div className="max-w-2xl">
<h2 className="font-headline text-4xl font-extrabold text-primary mb-4">Why Partners Choose Kisan Kamai</h2>
<p className="text-on-surface-variant text-lg">We build technology to ensure your expensive machinery is never sitting idle when it could be earning.</p>
</div>
<div className="hidden md:block h-px flex-grow mx-12 bg-outline-variant/30"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/*  Efficiency Card  */}
<div className="p-8 rounded-3xl bg-surface-container-low border border-surface-container-highest group hover:border-primary-container/30 transition-all">
<div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center mb-6 shadow-inner">
<span className="material-symbols-outlined text-on-primary-container text-3xl" data-icon="speed">speed</span>
</div>
<h3 className="font-headline text-2xl font-bold text-primary mb-4">Maximum Efficiency</h3>
<p className="text-on-surface-variant leading-relaxed">Reduce downtime by filling gaps in your seasonal schedule. Our smart matching connects you with nearby demand instantly.</p>
</div>
{/*  Trust Card  */}
<div className="p-8 rounded-3xl bg-surface-container-low border border-surface-container-highest group hover:border-primary-container/30 transition-all">
<div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center mb-6 shadow-inner">
<span className="material-symbols-outlined text-on-primary-container text-3xl" data-icon="verified_user">verified_user</span>
</div>
<h3 className="font-headline text-2xl font-bold text-primary mb-4">Verified Trust</h3>
<p className="text-on-surface-variant leading-relaxed">Every renter is identity-verified. We provide the security layer you need to lease your equipment with complete peace of mind.</p>
</div>
{/*  Payments Card  */}
<div className="p-8 rounded-3xl bg-surface-container-low border border-surface-container-highest group hover:border-primary-container/30 transition-all">
<div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center mb-6 shadow-inner">
<span className="material-symbols-outlined text-on-primary-container text-3xl" data-icon="payments">payments</span>
</div>
<h3 className="font-headline text-2xl font-bold text-primary mb-4">Secure Payments</h3>
<p className="text-on-surface-variant leading-relaxed">No more chasing collections. Payments are handled securely through the platform and transferred directly to your bank account.</p>
</div>
</div>
</div>
</section>
{/*  3-Step Guide Section  */}
<section className="py-24 bg-primary-container relative overflow-hidden">
{/*  Background Decorative Elements  */}
<div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
<svg className="w-full h-full text-white fill-current" viewBox="0 0 100 100">
<circle cx="100" cy="0" r="80"></circle>
</svg>
</div>
<div className="max-w-7xl mx-auto px-6 relative z-10">
<div className="text-center mb-20">
<h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white mb-4">Start Earning in Minutes</h2>
<p className="text-on-primary-container text-lg max-w-xl mx-auto">Three simple steps to transition from owner to professional equipment partner.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
{/*  Progress Line  */}
<div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-white/10 z-0"></div>
{/*  Step 1  */}
<div className="flex flex-col items-center px-8 relative z-10">
<div className="w-24 h-24 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-3xl font-black mb-8 border-8 border-primary-container shadow-xl">1</div>
<h4 className="font-headline text-2xl font-bold text-white mb-3 text-center">Create Profile</h4>
<p className="text-on-primary-container text-center leading-relaxed">Enter your personal details and location. Set up your KYC to receive payments.</p>
</div>
{/*  Step 2  */}
<div className="flex flex-col items-center px-8 relative z-10 mt-16 md:mt-0">
<div className="w-24 h-24 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-3xl font-black mb-8 border-8 border-primary-container shadow-xl">2</div>
<h4 className="font-headline text-2xl font-bold text-white mb-3 text-center">Add Details</h4>
<p className="text-on-primary-container text-center leading-relaxed">Upload clear photos, model information, and set your daily or hourly rental rates.</p>
</div>
{/*  Step 3  */}
<div className="flex flex-col items-center px-8 relative z-10 mt-16 md:mt-0">
<div className="w-24 h-24 rounded-full bg-on-tertiary-container text-white flex items-center justify-center text-3xl font-black mb-8 border-8 border-primary-container shadow-xl">3</div>
<h4 className="font-headline text-2xl font-bold text-white mb-3 text-center">Go Live</h4>
<p className="text-on-primary-container text-center leading-relaxed">Your listing is verified and published. Start receiving booking requests from local farmers.</p>
</div>
</div>
</div>
</section>
{/*  Categories Section  */}
<section className="py-24 bg-surface">
<div className="max-w-7xl mx-auto px-6">
<div className="flex items-center justify-between mb-12">
<h2 className="font-headline text-4xl font-extrabold text-primary">What Can You List?</h2>
<div className="flex gap-2">
<span className="px-4 py-1 bg-primary/5 rounded-full text-primary text-sm font-semibold border border-primary/10">Sangli</span>
<span className="px-4 py-1 bg-primary/5 rounded-full text-primary text-sm font-semibold border border-primary/10">Satara</span>
<span className="px-4 py-1 bg-primary/5 rounded-full text-primary text-sm font-semibold border border-primary/10">Kolhapur</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/*  Tractor Card  */}
<div className="relative group rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
<ContentImage alt="Tractors" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Modern red and blue Indian tractors parked in a neat row in a sunny farm courtyard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBukZQoo5oJvbevO4qV7eu-5dby7ya1GJpkvTMIXTHsCIrNR6cgRzo54NK0074M6OhAGoPYJL7szxrJXEW3vAOYUh4e_pUxtCu3znzHcm7ShNPbxPIoP8acImacO4UjCMtLAGeP2mXB-JmZ78MhhwAzue44BgWw1EJwAMrFa3BWEYMmEMqYumO7OKgY92HBbto86xJyvIwUcgxhiqldIEd0n98NDTjiLHckPI4JRm7m_q_KXPMF5d_Qv7126uqqthXj-L1H8OJXQh4p"loading="lazy" decoding="async" />
<div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>
<div className="absolute bottom-0 left-0 p-8 w-full">
<h3 className="font-headline text-2xl font-bold text-white mb-2">Tractors</h3>
<p className="text-white/80 text-sm mb-4">40HP - 90HP utility and heavy-duty tractors.</p>
<button className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-sm font-bold hover:bg-white/30 transition-all uppercase tracking-wider">List Now</button>
</div>
</div>
{/*  Harvester Card  */}
<div className="relative group rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
<ContentImage alt="Harvesters" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Combine harvester working in a golden wheat field in Maharashtra under a clear blue sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC07V_J8rC9ZxUmwsJkDMPLUHPrVlFCfmLY6NrCUUoob2MglR3lPKgWnIl1Tb16YvOvE9Wdt-Iqeo8dF97x5ZlbTyhSu_8ax0tIXeAbxif6c6zi1G8mIqdv4_z88AqrjDPNGgCFJFN2jEjJOn3KHawqmuKn0k7psO3qpSSz_9Q74gdoP5Cm2HnzmqYgbS8YeQwce_YUqbJ-6TYD5icCHJAHSx5KvD88HDqlQVc0n7I6xV7vtPYTdEAE6xa_EVGjcKmBt_EFnCrcVCbM"loading="lazy" decoding="async" />
<div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>
<div className="absolute bottom-0 left-0 p-8 w-full">
<h3 className="font-headline text-2xl font-bold text-white mb-2">Harvesters</h3>
<p className="text-white/80 text-sm mb-4">Sugar cane, maize, and grain combine harvesters.</p>
<button className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-sm font-bold hover:bg-white/30 transition-all uppercase tracking-wider">List Now</button>
</div>
</div>
{/*  Implements Card  */}
<div className="relative group rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
<ContentImage alt="Implements" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Close up of a heavy duty agricultural rotavator and seeder attachments in a rustic barn" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWNILv7etn7BACAHYnqBIb4d8ktEUtzdDUp6alIpwc94MAjjKoI9hxCiggbV8_SsvJyYmq4pMBsLby8-7S6tdwZrLF8qMGRWduXvnORhMyuPWrracmAskfqO34CzCDw5zfkJG3qtLsPFMtisgo8rgOWaojAMva6bPQAwBdQFWtj6SOWHz9MgR_Xw0qwYb23vHe9MXWo2tUnWd46qkthXZN_gwFkn2u2M19IVTNFPNB5R52l-jj_1m8HT9OPCa9V9z-jSLXqR75jjIK"loading="lazy" decoding="async" />
<div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>
<div className="absolute bottom-0 left-0 p-8 w-full">
<h3 className="font-headline text-2xl font-bold text-white mb-2">Implements</h3>
<p className="text-white/80 text-sm mb-4">Rotavators, seeders, plows, and sprayers.</p>
<button className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-sm font-bold hover:bg-white/30 transition-all uppercase tracking-wider">List Now</button>
</div>
</div>
</div>
</div>
</section>
{/*  CTA Section  */}
<section className="py-24 px-6">
<div className="max-w-7xl mx-auto rounded-[3rem] bg-on-tertiary-fixed relative overflow-hidden flex flex-col md:flex-row items-center">
<div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
<div className="p-12 md:p-20 relative z-10 md:w-3/5">
<h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white mb-8">Ready to grow your farming business?</h2>
<p className="text-on-tertiary-fixed-variant text-xl mb-10 leading-relaxed">Join hundreds of equipment owners in South Maharashtra who are earning better through Kisan Kamai.</p>
<div className="flex flex-wrap gap-6">
<button className="bg-white text-primary px-10 py-5 rounded-2xl font-headline font-extrabold text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">Start Listing Today</button>
<div className="flex flex-col">
<span className="text-white/60 text-sm font-semibold mb-1">Talk to an expert</span>
<span className="text-white font-bold text-xl tracking-wide">+91 80012 34567</span>
</div>
</div>
</div>
<div className="md:w-2/5 p-12 md:p-20 flex justify-center items-center">
<div className="relative">
<div className="absolute -inset-10 bg-on-tertiary-container/30 blur-3xl rounded-full"></div>
<div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-white">
<div className="flex items-center gap-4 mb-6">
<div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
<span className="material-symbols-outlined" style={{'fontVariationSettings': '\'FILL\' 1'}}>check</span>
</div>
<div>
<div className="font-bold text-lg">Verified Partner</div>
<div className="text-sm text-white/70">Sangli District</div>
</div>
</div>
<blockquote className="text-lg italic leading-relaxed text-white/90">
                                "Listing my rotavator during the off-season helped me cover its yearly maintenance and earn extra. The platform makes everything easy."
                            </blockquote>
</div>
</div>
</div>
</div>
</section>
        </div>
        {/*  Footer Component  */}


      </main>
      <Footer />
    </div>
  );
}
