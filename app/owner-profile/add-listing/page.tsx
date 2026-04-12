"use client";

export default function AddListingPage() {
  return (
    <>
      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Left Column: Form Progress & Main Input */}
        <div className="flex-1 max-w-3xl">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-primary dark:text-emerald-50 mb-2">Add New Equipment Listing</h2>
            <p className="text-on-surface-variant dark:text-slate-400 font-medium">Bilingual Support: English | मराठी</p>
          </div>

          {/* Progress Stepper */}
          <div className="flex justify-between items-center mb-10 px-2 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest dark:bg-slate-800 -z-10"></div>
            <div className="flex flex-col items-center gap-2 bg-background dark:bg-[#121212] px-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/20">1</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-emerald-500">Basics</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-background dark:bg-[#121212] px-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 flex items-center justify-center font-bold text-sm">2</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-500">Location</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-background dark:bg-[#121212] px-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 flex items-center justify-center font-bold text-sm">3</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-500">Photos</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-background dark:bg-[#121212] px-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 flex items-center justify-center font-bold text-sm">4</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-500">Pricing</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Section: Equipment Basics */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">settings_input_component</span>
                  <h3 className="text-lg font-bold text-primary dark:text-emerald-50">Equipment Basics / मूलभूत माहिती</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400">Category / वर्ग</label>
                    <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 px-4 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 font-manrope outline-none transition-all dark:text-white">
                      <option className="dark:bg-slate-800">Select Category</option>
                      <option className="dark:bg-slate-800">Tractor (ट्रॅक्टर)</option>
                      <option className="dark:bg-slate-800">Harvester (कापणी यंत्र)</option>
                      <option className="dark:bg-slate-800">Rotavator (रोटाव्हेटर)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400">Brand / ब्रँड</label>
                    <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 px-4 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 font-manrope outline-none transition-all dark:text-white" placeholder="e.g. Mahindra, John Deere" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400">Horsepower (HP) / अश्वशक्ती</label>
                    <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 px-4 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 font-manrope outline-none transition-all dark:text-white" placeholder="45" type="number" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400">Year of Purchase / खरेदीचे वर्ष</label>
                    <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 px-4 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 font-manrope outline-none transition-all dark:text-white" placeholder="2022" type="number" />
                  </div>
                </div>
              </div>

              {/* Section: Location */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">location_on</span>
                  <h3 className="text-lg font-bold text-primary dark:text-emerald-50">Location / ठिकाण</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400">District / जिल्हा</label>
                    <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 px-4 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 font-manrope outline-none transition-all dark:text-white">
                      <option className="dark:bg-slate-800">Satara (सातारा)</option>
                      <option className="dark:bg-slate-800">Sangli (सांगली)</option>
                      <option className="dark:bg-slate-800">Kolhapur (कोल्हापूर)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400">Taluka / Village / तालुका / गाव</label>
                    <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 px-4 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 font-manrope outline-none transition-all dark:text-white" placeholder="Enter your area" type="text" />
                  </div>
                </div>
              </div>

              {/* Section: Description */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">description</span>
                  <h3 className="text-lg font-bold text-primary dark:text-emerald-50">Description / वर्णन</h3>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400">Equipment Condition &amp; Details / उपकरणाची स्थिती आणि तपशील</label>
                  <textarea className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 px-4 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 font-manrope outline-none transition-all dark:text-white resize-y" placeholder="Describe implementation tools, recent servicing, etc." rows={4}></textarea>
                </div>
              </div>
            </div>
            
            {/* Form Footer Actions */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200 dark:border-slate-800">
              <button className="px-6 py-2 text-slate-500 dark:text-slate-400 font-bold hover:text-primary dark:hover:text-emerald-400 transition-colors">Save as Draft</button>
              <button className="px-8 py-3 bg-primary hover:bg-primary-container dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                Next Step: Photos
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Helper Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0 lg:mt-[98px]">
          {/* Listing Tips Card */}
          <div className="bg-emerald-950 text-white rounded-xl p-6 shadow-xl relative overflow-hidden dark:border dark:border-emerald-900/50">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <h4 className="font-bold text-sm tracking-wide uppercase">High-Performance Tips</h4>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0">check_circle</span>
                  <p className="text-xs leading-relaxed opacity-90 font-medium pt-0.5">Add high-quality photos from multiple angles including the engine and tools.</p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0">check_circle</span>
                  <p className="text-xs leading-relaxed opacity-90 font-medium pt-0.5">Be precise with HP (Horsepower). Farmers look for specific power for their tasks.</p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0">check_circle</span>
                  <p className="text-xs leading-relaxed opacity-90 font-medium pt-0.5">Mention if you provide an operator. This increases booking chances by 40%.</p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0">check_circle</span>
                  <p className="text-xs leading-relaxed opacity-90 font-medium pt-0.5">Keep your location updated. Renters prefer equipment within 15-20km radius.</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Live Preview Placeholder */}
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center py-12 shadow-sm">
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl mb-4">preview</span>
            <h5 className="text-sm font-bold text-slate-500 dark:text-slate-400">Live Preview</h5>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 px-4 leading-relaxed tracking-wide">Your listing preview will appear here as you fill the details.</p>
          </div>

          {/* Verification Badge Info */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 shrink-0 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <div>
                <h5 className="text-sm font-bold text-amber-900 dark:text-amber-400">Verification Process</h5>
                <p className="text-[11px] text-amber-800 dark:text-amber-500 mt-1 leading-relaxed">Once submitted, our team will verify the equipment documents to give you a &apos;Verified&apos; badge.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
