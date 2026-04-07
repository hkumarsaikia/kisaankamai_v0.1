"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

export default function OwnerExperiencePage() {
  const { langText } = useLanguage();

  return (
    <main className="bg-surface dark:bg-[#0f1a14] min-h-screen">
      <Header />
      <div className="pt-20 pb-32">
        {/* Hero Section: Owner Acquisition */}
        <section className="relative h-[530px] flex items-end px-6 pb-12 overflow-hidden bg-primary-container dark:bg-emerald-950">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              alt="Cinematic shot of a modern green tractor in a golden wheat field at sunset, high-end agricultural photography with warm light"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMf4-mHdpDSGO4B0heui_iQITAccwOQeyNR5nknz1jg0Ggy2oLIYA2HAS2IB3BT7sRnaYklPNv3MqG5r-kTzJppNOyTHuncW_hTkaf5kcR5aQM3yoA219R0_3mrS8_qWEfXAY_VK85ffYKfNEWijxiDRUqGfASYi9iuKqgfPp__baWGhL2Zz2My2nHSkXlH364Wway1pf3YGmnQ0hLVAYFEguICglZaj5KjfZpc9wOI8xZHepgsooTdEn751wsqGGdDQ1mpSa-AsBS"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container dark:from-emerald-950 via-primary-container/40 dark:via-emerald-950/60 to-transparent"></div>
          </div>
          <div className="relative z-10 space-y-4 max-w-7xl mx-auto w-full">
            <span className="bg-secondary dark:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              {langText("Earning Potential", "कमाईची क्षमता")}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight font-headline">
              {langText("Turn your tractor into steady income.", "तुमच्या ट्रॅक्टरला नियमित उत्पन्नाचे साधन बनवा.")}
            </h1>
            <p className="text-on-primary-container dark:text-emerald-100 text-lg font-medium opacity-90 max-w-2xl">
              {langText(
                "Join 500+ verified equipment owners in Maharashtra earning weekly.",
                "महाराष्ट्रातील ५०० हून अधिक सत्यापित उपकरण मालकांमध्ये सामील व्हा जे साप्ताहिक कमाई करत आहेत."
              )}
            </p>
          </div>
        </section>

        {/* Stats Bento Grid */}
        <section className="px-6 -mt-8 relative z-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-emerald-900/40 p-5 rounded-xl shadow-lg border border-emerald-50 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-secondary dark:text-amber-400">payments</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{langText("Avg. Monthly", "सरासरी मासिक")}</p>
              <p className="text-xl md:text-3xl font-extrabold text-primary dark:text-emerald-50">₹45,000+</p>
            </div>
            <div className="bg-white dark:bg-emerald-900/40 p-5 rounded-xl shadow-lg border border-emerald-50 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-tertiary-fixed-dim dark:text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{langText("Security", "सुरक्षा")}</p>
              <p className="text-xl md:text-3xl font-extrabold text-primary dark:text-emerald-50">{langText("100% Safe", "१००% सुरक्षित")}</p>
            </div>
          </div>
        </section>

        {/* Multi-step Form: Add Equipment Preview */}
        <section className="mt-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Listing Management Interface Preview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-4xl font-extrabold text-primary dark:text-emerald-50 font-headline">{langText("My Equipment", "माझी उपकरणे")}</h2>
                <button className="text-sm font-bold text-secondary dark:text-emerald-400 flex items-center gap-1">
                  {langText("View All", "सर्व पहा")} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              {/* Active Listing Card */}
              <div className="bg-white dark:bg-emerald-900/30 rounded-2xl shadow-sm border border-emerald-50 dark:border-emerald-800/50 overflow-hidden mb-6 hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    className="w-full h-full object-cover"
                    alt="Modern Mahindra tractor parked in a clean farmyard, bright natural daylight, crisp focus on agricultural machinery"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtySXYIiM5B5mQxsjQwMkOJsiKi1fZcO5Lpd_eVAqwDTlQuPyg6b0h-wXS5e8breLEswN-tK7T_wvoBhwMPAdm-sgbWFGDtjOUWrA88wiWTZf5MhgmagPd8C_PHJxP7h9_m08DFRFjTKXQDSgo7uJ28SZ7j52eISztEfOTKFBDmJ4rvrXpqE_1zwvx7enyZLwHwIISAK_uzZ6CDpJhD-P668TTHO0yl99PAK3r1nRTAhgdBzxzE_GHFhObSzU1jRYu8OMN8DSHf0YU"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">{langText("Active Listing", "सक्रिय सूची")}</div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-primary dark:text-emerald-50">John Deere 5050 D</h3>
                    <p className="text-secondary dark:text-emerald-400 font-extrabold">₹800/hr</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                      <span>{langText("12 Bookings", "१२ बुकिंग्ज")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      <span>{langText("Pune Dist.", "पुणे जिल्हा")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 border border-emerald-100 dark:border-emerald-800 rounded-lg text-sm font-bold text-primary dark:text-emerald-50 bg-emerald-50/50 dark:bg-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors">{langText("Edit Details", "सविस्तर माहिती संपादित करा")}</button>
                    <button className="px-4 py-3 border border-emerald-100 dark:border-emerald-800 rounded-lg text-primary dark:text-emerald-50 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Add Form */}
            <div className="bg-primary-container text-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-on-primary-container dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">{langText("Step 1 of 3", "पायरी १ पैकी ३")}</p>
                  <h2 className="text-2xl font-extrabold font-headline leading-tight">{langText("Add New Equipment", "नवीन उपकरणे जोडा")}</h2>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-emerald-800 flex items-center justify-center">
                  <span className="text-sm font-bold">33%</span>
                </div>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-primary-container dark:text-emerald-100 ml-1">{langText("Equipment Category", "उपकरणाचा प्रकार")}</label>
                  <div className="relative">
                    <select className="w-full bg-emerald-900/50 border-emerald-800 rounded-xl py-4 px-4 text-white appearance-none focus:ring-secondary focus:border-secondary transition-all">
                      <option>{langText("Tractors", "ट्रॅक्टर्स")}</option>
                      <option>{langText("Harvesters", "हार्वेस्टर्स")}</option>
                      <option>{langText("Rotavators", "रोटाव्हेटर्स")}</option>
                      <option>{langText("Seeders", "पेरणी यंत्रे")}</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-primary-container dark:text-emerald-100 ml-1">{langText("Make & Model", "बनवा आणि मॉडेल")}</label>
                  <input
                    className="w-full bg-emerald-900/50 border-emerald-800 rounded-xl py-4 px-4 text-white placeholder-emerald-700/50 focus:ring-secondary focus:border-secondary transition-all"
                    placeholder={langText("e.g. Mahindra Arjun 555", "उदा. महिंद्रा अर्जुन ५५५")}
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-primary-container dark:text-emerald-100 ml-1">{langText("Daily Rental Price (₹)", "दररोज भाड्याची किंमत (₹)")}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container font-bold">₹</span>
                    <input
                      className="w-full bg-emerald-900/50 border-emerald-800 rounded-xl py-4 pl-10 pr-4 text-white placeholder-emerald-700/50 focus:ring-secondary focus:border-secondary transition-all"
                      placeholder="5000"
                      type="number"
                    />
                  </div>
                </div>

                <button
                  className="w-full bg-secondary dark:bg-emerald-600 hover:bg-secondary/90 dark:hover:bg-emerald-500 text-white py-5 rounded-2xl font-extrabold text-lg shadow-xl shadow-black/20 mt-4 active:scale-95 transition-all"
                  type="button"
                >
                  {langText("Next: Upload Photos", "पुढे: फोटो अपलोड करा")}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
