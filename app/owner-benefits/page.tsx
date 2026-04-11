"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { assetPath } from "@/lib/site";

export default function OwnerBenefitsPage() {
  const { langText } = useLanguage();

  return (
    <main className="bg-surface dark:bg-slate-950 min-h-screen">
      <Header />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[716px] flex items-center overflow-hidden bg-primary-container dark:bg-slate-950">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-30 mix-blend-overlay" alt="Cinematic wide shot of a modern red tractor in a golden wheat field during sunset in rural Maharashtra" src={assetPath("/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container dark:from-emerald-950 via-primary-container/80 dark:via-emerald-950/80 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-on-tertiary-container/20 border border-on-tertiary-container/30 rounded-full text-on-tertiary-container dark:text-amber-400 font-label text-xs font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  stars
                </span>
                {langText("Owner Opportunity", "मालकांची संधी")}
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white leading-tight">
                {langText("Maximize Your ", "जास्तीत जास्त ")}<br />
                <span className="text-on-secondary-container dark:text-amber-200">{langText("Machine's Potential.", "यंत्राचा वापर.")}</span>
              </h1>
              <p className="text-on-primary-container dark:text-emerald-100 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                {langText(
                  "Turn your idle farming equipment into a consistent revenue stream. Connect with verified farmers in Sangli, Satara, and Kolhapur districts.",
                  "तुमची न वापरलेली कृषी उपकरणे सातत्यपूर्ण उत्पन्नाच्या प्रवाहात बदला. सांगली, सातारा आणि कोल्हापूर जिल्ह्यातील सत्यापित शेतकऱ्यांशी संपर्कात राहा."
                )}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-secondary-container text-on-secondary-container font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
                  {langText("List Your Machine Now", "आत्ताच तुमचे मशीन सूचीबद्ध करा")}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className="bg-white/10 backdrop-blur text-white border border-white/20 font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all">
                  {langText("View Success Stories", "यशस्वी कथा पहा")}
                </button>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mt-12">
                <span className="material-symbols-outlined text-on-secondary-container dark:text-amber-400 text-4xl mb-4">account_balance_wallet</span>
                <h3 className="text-white font-bold text-xl mb-2">{langText("Steady Income", "नियमित उत्पन्न")}</h3>
                <p className="text-on-primary-container dark:text-emerald-100 text-sm">
                  {langText("Supplement your seasonal earnings with consistent rental requests from local farmers.", "स्थानिक शेतकऱ्यांकडून मिळणाऱ्या सातत्यपूर्ण भाडे विनंत्यांमुळे तुमची हंगामी कमाई पूरक करा.")}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                <span className="material-symbols-outlined text-on-secondary-container dark:text-amber-400 text-4xl mb-4">verified_user</span>
                <h3 className="text-white font-bold text-xl mb-2">{langText("Verified Renters", "सत्यापित भाडेकरू")}</h3>
                <p className="text-on-primary-container dark:text-emerald-100 text-sm">
                  {langText("Every renter is KYC-verified. Your equipment is in safe, professional hands.", "प्रत्येक भाडेकरूची KYC पडताळणी झाली आहे. तुमचे उपकरण सुरक्षित, व्यावसायिक हातात आहे.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Earnings Calculator */}
        <section className="py-24 bg-surface dark:bg-slate-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="font-headline text-4xl font-extrabold text-primary dark:text-emerald-50 mb-4">{langText("How much can you earn?", "तुम्ही किती कमवू शकता?")}</h2>
              <p className="text-on-surface-variant dark:text-slate-400 font-medium">
                {langText("Select your equipment type to see estimated monthly earnings based on local market rates in Western Maharashtra.", "पश्चिम महाराष्ट्रातील स्थानिक बाजार दरांवर आधारित अंदाजित मासिक कमाई पाहण्यासाठी तुमचा उपकरण प्रकार निवडा.")}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calculator Sidebar */}
              <div className="lg:col-span-1 bg-white dark:bg-slate-900/40 p-8 rounded-3xl shadow-sm border border-outline-variant/30 dark:border-slate-800/50 space-y-8">
                <div>
                  <label className="block text-sm font-bold text-primary dark:text-emerald-400 mb-4 uppercase tracking-wider">{langText("Equipment Type", "उपकरणाचा प्रकार")}</label>
                  <div className="space-y-3">
                    <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/20 text-primary dark:text-emerald-400 font-bold">
                      <span className="flex items-center gap-3"><span className="material-symbols-outlined">agriculture</span> {langText("Tractor (45HP+)", "ट्रॅक्टर (45HP+)")}</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </button>
                    <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl border border-outline-variant text-on-surface-variant dark:text-slate-400 font-medium hover:border-primary/50 transition-colors">
                      <span className="flex items-center gap-3"><span className="material-symbols-outlined">settings_input_component</span> {langText("Harvester", "हार्वेस्टर")}</span>
                    </button>
                    <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl border border-outline-variant text-on-surface-variant dark:text-slate-400 font-medium hover:border-primary/50 transition-colors">
                      <span className="flex items-center gap-3"><span className="material-symbols-outlined">tire_repair</span> {langText("Rotavator", "रोटाव्हेटर")}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary dark:text-emerald-400 mb-4 uppercase tracking-wider">{langText("Operational District", "कार्यरत जिल्हा")}</label>
                  <select className="w-full rounded-xl border-outline-variant bg-white dark:bg-slate-900/50 text-on-surface dark:text-emerald-50 focus:ring-primary focus:border-primary py-3">
                    <option>{langText("Sangli", "सांगली")}</option>
                    <option>{langText("Satara", "सातारा")}</option>
                    <option>{langText("Kolhapur", "कोल्हापूर")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary dark:text-emerald-400 mb-4 uppercase tracking-wider">{langText("Expected Usage (Days/Month)", "अपेक्षित वापर (दिवस/महिना)")}</label>
                  <input className="w-full accent-primary h-2 bg-surface-container dark:bg-slate-900 rounded-lg appearance-none cursor-pointer" max="25" min="5" type="range" defaultValue="15" />
                  <div className="flex justify-between mt-2 text-xs font-bold text-on-surface-variant dark:text-slate-400">
                    <span>{langText("5 Days", "5 दिवस")}</span>
                    <span>{langText("25 Days", "25 दिवस")}</span>
                  </div>
                </div>
              </div>

              {/* Earnings Display */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 bg-primary-container text-white p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-on-primary-container dark:text-emerald-300 text-sm font-bold uppercase tracking-widest">{langText("Estimated Monthly Earnings", "अंदाजित मासिक कमाई")}</span>
                    <div className="text-6xl font-extrabold mt-4 mb-2">₹45,000 - ₹62,000</div>
                    <p className="text-on-primary-container dark:text-emerald-100 max-w-sm">
                      {langText("Based on typical rental demand for 45HP tractors in Kolhapur during the Rabi season.", "कोल्हापूरमध्ये रब्बी हंगामात 45HP ट्रॅक्टरच्या ठराविक भाड्याच्या मागणीवर आधारित.")}
                    </p>
                  </div>
                  <div className="mt-8 flex gap-4 relative z-10">
                    <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                      <span className="block text-[10px] uppercase font-bold text-on-primary-container dark:text-emerald-200">{langText("Avg. Daily Rate", "सरासरी दैनिक दर")}</span>
                      <span className="text-lg font-bold">₹3,500</span>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                      <span className="block text-[10px] uppercase font-bold text-on-primary-container dark:text-emerald-200">{langText("Market Demand", "बाजार मागणी")}</span>
                      <span className="text-lg font-bold">{langText("High", "उच्च")}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[200px] opacity-5 text-white">payments</span>
                </div>
                <div className="bg-secondary/5 border border-secondary/10 dark:border-slate-800/50 p-8 rounded-3xl flex flex-col justify-center">
                  <h4 className="text-secondary dark:text-amber-500 font-extrabold text-2xl mb-2">{langText("Platform Fee", "प्लॅटफॉर्म शुल्क")}</h4>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm font-medium">
                    {langText("Transparent 10% commission only when you earn. No hidden listing charges.", "पारदर्शक १०% कमिशन फक्त तुम्ही कमावता तेव्हा. कोणतेही छुपे शुल्क नाही.")}
                  </p>
                </div>
                <div className="bg-tertiary/5 border border-tertiary/10 dark:border-slate-800/50 p-8 rounded-3xl flex flex-col justify-center">
                  <h4 className="text-tertiary dark:text-emerald-500 font-extrabold text-2xl mb-2">{langText("Payout Speed", "पेमेंट गती")}</h4>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm font-medium">
                    {langText("Earnings are transferred directly to your bank account within 48 hours of job completion.", "काम पूर्ण झाल्याच्या 48 तासांच्या आत कमाई थेट तुमच्या बँक खात्यात हस्तांतरित केली जाते.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Owner Stories */}
        <section className="py-24 bg-surface-container-low dark:bg-slate-950/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-4 py-1 bg-secondary/10 text-secondary dark:text-amber-500 rounded-full text-xs font-bold uppercase mb-4 tracking-widest">{langText("Trust & Safety", "विश्वास आणि सुरक्षा")}</div>
                <h2 className="font-headline text-4xl font-extrabold text-primary dark:text-emerald-50 mb-6">{langText("Your machine is our priority.", "तुमचे यंत्र आमचे प्राधान्य आहे.")}</h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-white dark:bg-slate-900/70 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-primary dark:text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-primary dark:text-emerald-100 mb-1">{langText("Safe Handoff Protocol", "सुरक्षित हस्तांतरण प्रक्रिया")}</h4>
                      <p className="text-on-surface-variant dark:text-slate-400 text-sm">{langText("Digital checklist and photo-verification at both pickup and return ensures your equipment's condition is documented.", "डिजिटल चेकलिस्ट आणि फोटो व्हेरिफिकेशन तुमच्या उपकरणाची स्थिती दस्तऐवजीकरण सुनिश्चित करते.")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border border-outline-variant/30 dark:border-slate-800/50 p-8 rounded-[2.5rem] relative z-10 shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <img className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" alt="Owner" src={assetPath("/assets/generated/farmer_portrait.png")} loading="lazy" decoding="async" />
                    <div>
                      <h5 className="font-bold text-primary dark:text-emerald-50">Sanjay Deshmukh</h5>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">{langText("Tractor Owner • Karad, Satara", "ट्रॅक्टर मालक • कराड, सातारा")}</p>
                    </div>
                  </div>
                  <p className="text-on-surface dark:text-slate-300 font-medium italic leading-relaxed mb-8">
                    {langText('"I was hesitant about giving my New Holland tractor to someone else... Now, my tractor pays for its own EMI and maintenance through rental income during the off-season."', '"सुरुवातीला मला माझा ट्रॅक्टर दुसऱ्याला देताना संकोच वाटत होता... पण आता, माझा ट्रॅक्टर स्वतःचे ईएमआय आणि देखभालीचा खर्च स्वतः भरतो."')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

