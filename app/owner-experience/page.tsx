"use client";

import { ContentImage } from "@/components/ContentImage";

export default function OwnerExperience() {
  return (
    <div className="flex flex-col bg-background dark:bg-slate-950 min-h-screen">
      <div className="flex-grow">
        {/*  Hero Section  */}
        <section className="relative min-h-[819px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ContentImage alt="Equipment Owner" className="w-full h-full object-cover" data-alt="A professional Indian farmer standing proudly next to a high-end modern green tractor in a vast sun-drenched wheat field at sunrise" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0zmJeaPs1dObsXyNQTGsEbQSjfDd3Z9ykBz-xrB7P0hPiFcpkwzGFOcrWyzF0eXBQcfWxCWOCdYc84KWMGrbtqqGa5q-uElB6dywQpDO3EIKlWxTZFK_cvotGftAsBHTVbmzksOQfpVpYlYlwd1tT4V_JSnYVj9cIfdJUU39NsQL6gsNfB8tQnRq9V0sydN3bqGj4rDk1oG4_Gp2YZ3O6E4HNXzWI7QByAbflUyoYR9lddSdlm7SflX6YiuIW0qPTC20y1rVWkHZD" loading="lazy" decoding="async" />
            <div className="kk-banner-image-overlay" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">Your machinery,<br /><span className="text-secondary-container">Now a business.</span></h1>
              <p className="text-lg md:text-xl text-slate-200 max-w-lg mb-8 leading-relaxed">Unlock the hidden value of your farm equipment. Join India's most trusted marketplace to earn up to ₹85,000 extra per season by renting to verified farmers.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-secondary-container text-on-secondary-container font-black text-lg rounded-xl hover:scale-105 transition-transform shadow-xl">Get Started Free</button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all">
                  <span className="material-symbols-outlined">play_circle</span>
                  See How it Works
                </button>
              </div>
            </div>
            {/*  Earnings Calculator Preview  */}
            <div className="kk-depth-tile glass-panel p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold text-primary-container dark:text-primary-fixed mb-6">Estimate Your Earnings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-label font-semibold text-outline mb-2">Select Equipment Type</label>
                  <select className="w-full bg-surface-container border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-secondary">
                    <option>50HP+ Modern Tractor</option>
                    <option>Combine Harvester</option>
                    <option>Rotavator / Cultivator</option>
                    <option>Laser Land Leveler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-label font-semibold text-outline mb-2">Expected Rental Days (per season)</label>
                  <input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-secondary" max="60" min="10" type="range" defaultValue="30" />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>10 Days</span>
                    <span>60 Days</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 mb-1">Estimated Seasonal Revenue</p>
                  <p className="text-4xl font-black text-secondary">₹45,000 - ₹72,000</p>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-tighter">*Based on average regional demand and equipment age</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*  Trust Signals  */}
        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-70 grayscale hover:grayscale-0 transition-all font-bold text-slate-500">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined">verified_user</span> Verified Renters</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined">payments</span> Secure Payments</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined">shield_with_heart</span> Damage Support</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined">support_agent</span> 24/7 Assistance</div>
            </div>
          </div>
        </section>
        {/*  Listing Process  */}
        <section className="py-24 bg-surface-container-low dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-black text-primary-container dark:text-primary-fixed mb-4">Start Earning in 3 Simple Steps</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">We've simplified the listing process so you can focus on managing your farm while we handle the bookings.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="relative">
                <div className="w-16 h-16 bg-primary-container text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-container/20">
                  <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                </div>
                <h4 className="text-xl font-bold mb-3">1. List Your Equipment</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Upload clear photos, set your daily price, and define your service radius. We'll optimize your profile for visibility.</p>
                <div className="hidden md:block absolute top-8 -right-6 text-slate-300">
                  <span className="material-symbols-outlined text-4xl">arrow_forward</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-secondary/20">
                  <span className="material-symbols-outlined text-3xl">event_available</span>
                </div>
                <h4 className="text-xl font-bold mb-3">2. Manage Requests</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Receive booking requests directly on your phone. Review renter profiles and accept jobs that fit your schedule.</p>
                <div className="hidden md:block absolute top-8 -right-6 text-slate-300">
                  <span className="material-symbols-outlined text-4xl">arrow_forward</span>
                </div>
              </div>
              <div>
                <div className="w-16 h-16 bg-tertiary-container text-on-tertiary-container rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-tertiary/20">
                  <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                </div>
                <h4 className="text-xl font-bold mb-3">3. Get Paid Safely</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Funds are collected upfront and released directly to your bank account after the service is completed successfully.</p>
              </div>
            </div>
          </div>
        </section>
        {/*  Bento Grid Benefits  */}
        <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
              {/*  Main Feature  */}
              <div className="kk-depth-tile md:col-span-2 md:row-span-2 bg-primary-container rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group">
                <ContentImage alt="Control" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" data-alt="Modern high-tech control panel inside a tractor cab with GPS navigation display and ergonomic controls in soft focus" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHJBC_Z8UxCrm3y2H7Jtrd4pPovGFUHy07oagxN71Bkbx5t4Mgkmk3CAAQphOzfD_ps3gGx0lM0qKPmkJsplV-i9uND8aCiC2A5EoLObg7sdgW5LEvNrorixV6CKnAaCTIg_VPkHtmwWc7-1VhEyuPQv1pObkagixXSEhfZKOZtgs87ErXmlCkcxRf7Z6yTSvvFi1oEP8-jGGJZrtpqhora9ROHTD2eSpWRNcXP2p8ZXq9KZeXmq9LetFk2SBrLG_f1RCebz2mdOXW" loading="lazy" decoding="async" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white mb-4">Total Control over Availability</h3>
                  <p className="text-emerald-100 text-lg leading-relaxed">Decide exactly when your machines are available. Block dates for your own farm work with a single tap in the owner profile.</p>
                </div>
              </div>
              {/*  Secondary 1  */}
              <div className="kk-depth-tile md:col-span-2 bg-surface-container rounded-3xl p-8 flex items-center gap-6 group">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-primary-container mb-2">Verified Community</h4>
                  <p className="text-slate-600 dark:text-slate-500">Every renter undergoes a strict KYC check. Rent with peace of mind knowing who is using your equipment.</p>
                </div>
                <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-2xl flex-shrink-0 shadow-sm overflow-hidden">
                  <ContentImage alt="Security" className="w-full h-full object-cover" data-alt="Close up of a hand holding a digital smartphone with a secure checkmark verification badge and green interface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRLWVn3ooQucvqzhCFTn1ouEOZoLwL1m3sPyQgVU27EJqRdlsFl0WYvwA1dkWyfRCt0uVf-3J_o2Gyg1cZoqYB6aHeqtYmDAfCwEw9NShjphJksOrXGgc6AsUEESgZAUHLP7SbP0ShdUqt5VMuGogLvkg-AV6jZO33IVJ2riN1oVaHRsr0HQJ0enn5b7DodrUo5RQalS0qZXLBj3LPTKHrsQrsVsnmIyehGAeNPPyv6RXpYO_WXd-AtvjTNIqu9ApXnNe7uiLRRKqF" loading="lazy" decoding="async" />
                </div>
              </div>
              {/*  Secondary 2  */}
              <div className="bg-secondary text-white rounded-3xl p-8 flex flex-col justify-between">
                <span className="material-symbols-outlined text-4xl">trending_up</span>
                <div>
                  <h4 className="text-lg font-bold mb-1">Maximized ROI</h4>
                  <p className="text-sm text-secondary-fixed opacity-90">Recover your machinery investment 40% faster by filling idle days.</p>
                </div>
              </div>
              {/*  Secondary 3  */}
              <div className="bg-slate-900 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-lg font-bold text-white mb-1">Local Network</h4>
                  <p className="text-sm text-slate-400">Build relationships with reliable farmers in your own taluka.</p>
                </div>
                <span className="material-symbols-outlined text-secondary text-6xl absolute -bottom-4 -right-4 opacity-20">location_on</span>
              </div>
            </div>
          </div>
        </section>

        {/*  Final CTA  */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-container">
            <div className="absolute inset-0 opacity-20" style={{ 'backgroundImage': 'radial-gradient(#ffffff 1px, transparent 1px)', 'backgroundSize': '40px 40px' }}></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to grow your farm business?</h2>
            <p className="text-emerald-100 text-xl mb-12 max-w-2xl mx-auto">Join 1,200+ equipment owners already earning with Kisan Kamai. Free to list, premium to use.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-5 bg-secondary text-white font-black text-xl rounded-2xl hover:bg-secondary/90 transition-all shadow-2xl">Start Listing Now</button>
              <button className="px-10 py-5 bg-transparent border-2 border-white/40 text-white font-bold text-xl rounded-2xl hover:bg-white/10 transition-all">Talk to an Agent</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
