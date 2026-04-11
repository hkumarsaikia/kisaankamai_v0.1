"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { assetPath } from "@/lib/site";

export default function BookingFlowPage() {
  const { langText } = useLanguage();

  return (
    <main className="bg-background dark:bg-slate-950 min-h-screen">
      <Header />
      <div className="pt-28 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-primary dark:text-emerald-50 tracking-tight mb-2">
            {langText("Book Your Equipment", "तुमची उपकरणे बुक करा")}
          </h1>
          <p className="text-on-surface-variant dark:text-slate-400">
            {langText("Complete 4 simple steps to secure your farming implements", "तुमची शेतीची साधने सुरक्षित करण्यासाठी ४ सोप्या पायऱ्या पूर्ण करा")}
          </p>
        </header>

        {/* Stepper Indicator */}
        <div className="relative flex justify-between items-center mb-16 max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant dark:bg-emerald-800 -z-10 -translate-y-1/2"></div>
          {/* Step 1 (Active) */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold ring-4 ring-primary-fixed dark:ring-emerald-900">1</div>
            <span className="text-xs font-bold text-primary dark:text-emerald-400 uppercase tracking-wider">{langText("Details", "तपशील")}</span>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-variant dark:bg-slate-900/70 text-outline dark:text-emerald-200 flex items-center justify-center font-bold">2</div>
            <span className="text-xs font-medium text-outline dark:text-slate-400 uppercase tracking-wider">{langText("Location", "स्थान")}</span>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-variant dark:bg-slate-900/70 text-outline dark:text-emerald-200 flex items-center justify-center font-bold">3</div>
            <span className="text-xs font-medium text-outline dark:text-slate-400 uppercase tracking-wider">{langText("Review", "पुनरावलोकन")}</span>
          </div>
          {/* Step 4 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-variant dark:bg-slate-900/70 text-outline dark:text-emerald-200 flex items-center justify-center font-bold">4</div>
            <span className="text-xs font-medium text-outline dark:text-slate-400 uppercase tracking-wider">{langText("Status", "स्थिती")}</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Step Content: Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-slate-900/40 rounded-[32px] p-8 md:p-10 shadow-sm border border-surface-variant dark:border-slate-800/50">
              <h2 className="text-2xl font-bold text-primary dark:text-emerald-50 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary dark:text-amber-500">event_available</span>
                {langText("Date & Task Details", "तारीख आणि कार्याचा तपशील")}
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Start Date", "सुरुवात तारीख")}</label>
                    <div className="relative">
                      <input className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-surface-variant dark:border-slate-800 rounded-xl p-4 text-on-surface dark:text-emerald-50 focus:ring-2 focus:ring-secondary-container transition-all" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Duration (Days)", "कालावधी (दिवस)")}</label>
                    <select className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-surface-variant dark:border-slate-800 rounded-xl p-4 text-on-surface dark:text-emerald-50 focus:ring-2 focus:ring-secondary-container transition-all">
                      <option>{langText("1 Day", "१ दिवस")}</option>
                      <option>{langText("2-3 Days", "२-३ दिवस")}</option>
                      <option>{langText("1 Week", "१ आठवडा")}</option>
                      <option>{langText("Custom", "सानुकूल")}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Select Farming Task", "शेतीचे काम निवडा")}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button className="flex flex-col items-center justify-center p-4 border-2 border-secondary-container dark:border-amber-500 bg-secondary-fixed/20 dark:bg-amber-900/20 rounded-2xl text-secondary dark:text-amber-400 transition-all" type="button">
                      <span className="material-symbols-outlined mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
                      <span className="text-xs font-bold">{langText("Ploughing", "नांगरणी")}</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border-2 border-transparent bg-surface-container-low dark:bg-slate-900/50 rounded-2xl text-on-surface dark:text-emerald-100 hover:border-surface-variant dark:hover:border-slate-700 transition-all" type="button">
                      <span className="material-symbols-outlined mb-2">grain</span>
                      <span className="text-xs font-bold">{langText("Sowing", "पेरणी")}</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border-2 border-transparent bg-surface-container-low dark:bg-slate-900/50 rounded-2xl text-on-surface dark:text-emerald-100 hover:border-surface-variant dark:hover:border-slate-700 transition-all" type="button">
                      <span className="material-symbols-outlined mb-2">water_drop</span>
                      <span className="text-xs font-bold">{langText("Spraying", "फवारणी")}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Field Size (Acres)", "शेत आकार (एकर)")}</label>
                  <div className="flex items-center gap-4">
                    <input className="w-full h-2 bg-surface-container dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-secondary dark:accent-amber-500" max="50" min="1" type="range" defaultValue={5} />
                    <span className="bg-secondary-container dark:bg-amber-600 text-on-secondary-container dark:text-white px-4 py-1 rounded-full font-bold min-w-[60px] text-center">5</span>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    className="w-full bg-primary-container text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3" 
                    type="button"
                    onClick={() => alert(langText("Booking request sent! Connecting you to the owner...", "बुकिंग विनंती पाठवली! तुम्हाला मालकाशी जोडत आहे..."))}
                  >
                    {langText("Save & Continue", "जतन करा आणि पुढे जा")}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Trust Signal */}
            <div className="bg-primary-fixed/30 dark:bg-slate-900/70 rounded-2xl p-6 flex items-start gap-4 border border-primary-fixed dark:border-slate-800">
              <span className="material-symbols-outlined text-primary-container dark:text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <div>
                <h4 className="font-bold text-primary-container dark:text-emerald-100">{langText("Kisan Kamai Guarantee", "किसान कमाईची हमी")}</h4>
                <p className="text-sm text-on-primary-fixed-variant dark:text-slate-300 leading-relaxed">
                  {langText(
                    "Your payment is only processed after the owner confirms availability. We ensure equipment reaches your field on time.",
                    "मालकाने उपलब्धता निश्चित केल्यानंतरच तुमच्या पेमेंटवर प्रक्रिया केली जाते. आम्ही उपकरणे वेळेवर तुमच्या शेतात पोहोचतील याची खात्री देतो."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Sidebar: Right Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              {/* Equipment Card Preview */}
              <div className="bg-white dark:bg-slate-900/40 rounded-[32px] overflow-hidden shadow-sm border border-surface-variant dark:border-slate-800/50">
                <div className="h-48 relative">
                  <img className="w-full h-full object-cover" alt="Tractor" src={assetPath("/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary dark:text-emerald-100 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    4.9 {langText("(120+ Bookings)", "(१२०+ बुकिंग्ज)")}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary dark:text-emerald-50 mb-1">Mahindra Novo 605 DI-i</h3>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-4">{langText("65 HP • Heavy Duty • 2023 Model", "६५ अश्वशक्ती • हेवी ड्युटी • २०२३ मॉडेल")}</p>
                  <div className="flex justify-between items-end border-t border-surface-variant dark:border-slate-800/50 pt-4">
                    <div>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-widest">{langText("Base Rate", "मूळ दर")}</p>
                      <p className="text-2xl font-black text-secondary dark:text-amber-500">₹1,200 <span className="text-sm font-normal text-on-surface-variant dark:text-slate-400">{langText("/ hour", "/ तास")}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-widest">{langText("Owner", "मालक")}</p>
                      <p className="font-bold text-primary dark:text-emerald-100">Suresh Patil, Sangli</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-slate-950 dark:bg-slate-900 text-white rounded-[32px] p-8 space-y-4">
                <h4 className="text-lg font-bold">{langText("Need Assistance?", "मदत हवी आहे?")}</h4>
                <p className="text-emerald-200/70 text-sm leading-relaxed">
                  {langText("Our support team is available in Marathi & English to help you complete your booking.", "तुमचे बुकिंग पूर्ण करण्यात मदत करण्यासाठी आमची सपोर्ट टीम मराठी आणि इंग्रजीमध्ये उपलब्ध आहे.")}
                </p>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
                  <span className="material-symbols-outlined text-orange-400">support_agent</span>
                  <div>
                    <p className="text-xs font-bold uppercase text-emerald-300">{langText("Call Support", "सपोर्टला कॉल करा")}</p>
                    <p className="font-bold">+91 1800-456-7890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

