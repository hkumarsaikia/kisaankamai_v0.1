"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

// Note: This page uses its own sidebar and mobile nav, acting as an app layout
export default function OwnerDashboardPage() {
  const { langText } = useLanguage();

  return (
    <div className="bg-background dark:bg-[#0f1a14] min-h-screen font-body text-on-background antialiased flex">
      {/* SideNavBar (Shared Component) */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-surface-container-highest dark:border-emerald-800/50 bg-white dark:bg-emerald-950 z-40">
        <div className="px-6 py-8 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary dark:text-emerald-50 tracking-tighter">
            Kisan Kamai
          </Link>
          <ThemeToggle />
        </div>
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low dark:bg-emerald-900/30 border border-surface-container-highest dark:border-emerald-800/50">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container">
              <img
                className="w-full h-full object-cover"
                alt="Owner portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCExv3QOuibAX6OClfz_t075pUbPpJfzqx6sb25CiutKAmBrXyTH1QWiiPw-IW4p5WgJr3Dmm5g5mCx6isTHJzUsHMEW_vpFKttBYWOMjfGTCUxD3GX0E0jCk4LmKjk3uwBC42kquNUrTDYImmkeAjgiHZmhUCvsyaUAo-6qFhAGCwvj9j9M0yI2mPGM7qxvaED16FYQe-i4v3ins77rZpK6wLZFqza2K80SQHrw_rUlDaG0pHpssIDt2u1KfQiEk0X4VVCY3_OBKOq"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary dark:text-emerald-100 leading-tight">
                 {langText("Kisan Owner", "किसान मालक")}
              </span>
              <span className="text-[10px] font-medium text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
                {langText("Verified Partner", "सत्यापित भागीदार")}
              </span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-900/40 rounded-lg transition-all duration-200 group" href="#">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">dashboard</span>
            <span className="font-manrope text-sm font-medium">{langText("Dashboard", "डॅशबोर्ड")}</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-900/40 rounded-lg transition-all duration-200 group" href="#">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">agriculture</span>
            <span className="font-manrope text-sm font-medium">{langText("My Equipment", "माझी उपकरणे")}</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-r-4 border-emerald-700 dark:border-emerald-400 font-bold rounded-l-lg transition-all duration-200" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
            <span className="font-manrope text-sm font-medium">{langText("Bookings", "बुकिंग्ज")}</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-900/40 rounded-lg transition-all duration-200 group" href="#">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">payments</span>
            <span className="font-manrope text-sm font-medium">{langText("Earnings", "उत्पन्न")}</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-900/40 rounded-lg transition-all duration-200 group" href="#">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">settings</span>
            <span className="font-manrope text-sm font-medium">{langText("Settings", "सेटिंग्ज")}</span>
          </a>
        </nav>
        <div className="p-4 space-y-2 border-t border-surface-container-highest dark:border-emerald-800/50">
          <button className="w-full flex items-center justify-center gap-2 bg-primary-container text-white py-3 px-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-sm">add</span>
            {langText("Add New Listing", "नवीन नोंद जोडा")}
          </button>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-900/40 rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined">support_agent</span>
            <span className="font-manrope text-sm font-medium">{langText("Support", "मदत")}</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-900/40 rounded-lg transition-all" href="/">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-manrope text-sm font-medium">{langText("Sign Out", "साइन आउट")}</span>
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="lg:ml-64 flex-1 min-h-screen pb-12 w-full">
        {/* Top Sticky Header for Mobile */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md border-b border-surface-container-highest dark:border-emerald-800/50 px-6 py-4 flex justify-between items-center lg:hidden">
          <span className="text-xl font-extrabold text-primary dark:text-emerald-50">Kisan Kamai</span>
          <div className="flex gap-2">
            <ThemeToggle />
            <button className="p-2 text-on-surface dark:text-emerald-100">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 pt-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 mb-1">
                <span className="text-xs font-bold tracking-widest uppercase">{langText("Owner Portal", "ओनर पोर्टल")}</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-xs font-bold tracking-widest uppercase text-secondary dark:text-amber-500">{langText("Booking Management", "बुकिंग व्यवस्थापन")}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-primary dark:text-emerald-50 tracking-tight">
                {langText("Booking Management", "बुकिंग व्यवस्थापन")}
              </h1>
              <p className="text-on-surface-variant dark:text-slate-400 mt-1">
                {langText("Manage your incoming requests and schedule.", "तुमच्या येणाऱ्या विनंत्या आणि वेळापत्रक व्यवस्थापित करा.")}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-emerald-900/30 p-1 rounded-xl shadow-sm border border-surface-container-highest dark:border-emerald-800/50">
              <button className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg transition-all">{langText("Active", "सक्रिय")}</button>
              <button className="px-4 py-2 text-sm font-bold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-emerald-800/50 rounded-lg transition-all">{langText("Upcoming", "येणारे")}</button>
              <button className="px-4 py-2 text-sm font-bold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-emerald-800/50 rounded-lg transition-all">{langText("History", "इतिहास")}</button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left: New Requests Column */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary dark:text-emerald-50 flex items-center gap-2">
                  {langText("New Requests", "नवीन विनंत्या")} <span className="bg-secondary-container dark:bg-amber-600 text-on-secondary-container dark:text-white px-2 py-0.5 rounded-full text-xs">2</span>
                </h2>
              </div>

              {/* Request Card 1 */}
              <div className="bg-white dark:bg-emerald-900/20 rounded-2xl p-5 border border-surface-container-highest dark:border-emerald-800/50 shadow-sm hover:card-shadow-lg transition-all group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-surface-container dark:bg-emerald-900 flex-shrink-0">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Tractor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfu_AMK_TC8qMMVZ5e68Vj614f7M-Jvj39tLDf3BQJkq-OR0wlOV6NnKY023rSowbHNfyUR20P5q9Emgjo4e57yk4c-aACXJdZTlCLD205lUsSDSeqCy9E2TCpIP7z4Fvt3iHDiYNgRCVDnJB3NDcwl79hAdszGgm4yLyy0f7U7N9J_tB4bXx2XkjVYlAWGd5o9b53aF9pauVHDAIeeds_aa7VckpSTmbvjgEmlh9kYALpZ4nflwGb2cyeq4_Ih7RTZDPwgd3CIiRh" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-primary dark:text-emerald-100">Mahindra Yuvo 575 DI</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-surface-container-highest">
                            <img className="w-full h-full object-cover" alt="User portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx5bzL6bDQVA0JxAp7j3KMGj422zWVggwjN1uLMEN6YpdhDTjMjWHLXb_0V3dVd0WMlENhvLzIn426BpV8FXdPS88eGjjWb2YK4IpWBgH4aXhxV3uwZNLfBgajOd9yQhswUz1ZVqFEhjLJG_FKW9E9sLeR697KlUCScCYRDLMDl-t9mf5xwsJQudvzRFyYPPSv5jPOhU5v_omPSVzIiCTDoNc4oXdWzTRporMg1YH3LoPQoWVSEz4abYKQ3jGGBPZYgL9aOVZnMFfe" />
                          </div>
                          <span className="text-sm font-semibold text-on-surface dark:text-slate-300">Rajesh Deshmukh <span className="text-on-surface-variant dark:text-slate-500 font-normal">{langText("from Satara", "साताऱ्याहून")}</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-extrabold text-primary dark:text-emerald-400">₹3,200</span>
                        <span className="text-[10px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-tighter">{langText("Estimated Total", "अंदाजित एकूण")}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4 py-3 border-y border-surface-container-highest dark:border-emerald-800/50">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary dark:text-amber-500 text-lg">calendar_month</span>
                        <span className="text-xs font-bold dark:text-slate-300">24 Oct - 26 Oct</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary dark:text-amber-500 text-lg">history</span>
                        <span className="text-xs font-bold dark:text-slate-300">{langText("3 Days", "३ दिवस")}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black rounded uppercase">{langText("Urgent", "तातडीचे")}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">{langText("Approve Request", "विनंती मंजूर करा")}</button>
                      <button className="px-6 py-2.5 border border-surface-container-highest dark:border-emerald-700 text-on-surface dark:text-emerald-100 py-2 rounded-lg text-sm font-bold hover:bg-surface-container dark:hover:bg-emerald-900/50 transition-colors">{langText("Decline", "नकार द्या")}</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Calendar & Stats */}
            <div className="space-y-8">
              {/* Earnings Summary */}
              <div className="bg-primary-container text-white rounded-2xl p-6 shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-primary-container dark:text-emerald-300">{langText("Estimated Earnings", "अंदाजित कमाई")}</span>
                  <div className="text-3xl font-extrabold mt-1">₹42,850</div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-100">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    {langText("12% higher than last month", "गेल्या महिन्यापेक्षा 12% जास्त")}
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <span className="material-symbols-outlined text-[120px]">payments</span>
                </div>
              </div>

               {/* Quick Support Card */}
               <div className="bg-surface-container-low dark:bg-emerald-900/20 rounded-2xl p-6 border border-dashed border-outline-variant dark:border-emerald-800 text-center">
                <h3 className="text-sm font-bold text-primary dark:text-emerald-400 mb-2">{langText("Need help managing equipment?", "उपकरणे व्यवस्थापित करण्यासाठी मदत हवी आहे?")}</h3>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4 leading-relaxed">{langText("Our support team is available in Marathi & English to help you list or manage bookings.", "आमची सपोर्ट टीम तुम्हाला मदत करण्यासाठी मराठी आणि इंग्रजीमध्ये उपलब्ध आहे.")}</p>
                <button className="w-full py-2 bg-white dark:bg-emerald-900 text-primary dark:text-emerald-50 border border-surface-container-highest dark:border-emerald-800 rounded-lg text-xs font-bold hover:bg-surface transition-colors">{langText("Contact Support", "संपर्क साधा")}</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-emerald-950 border-t border-surface-container-highest dark:border-emerald-800/50 px-4 py-2 flex justify-around items-center z-50">
        <a className="flex flex-col items-center p-2 text-slate-500 dark:text-slate-400" href="#">
          <span className="material-symbols-outlined">dashboard</span>
        </a>
        <a className="flex flex-col items-center p-2 text-primary dark:text-emerald-400" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
        </a>
        <a className="bg-primary-container text-white w-12 h-12 rounded-full flex items-center justify-center -mt-8 shadow-lg" href="#">
          <span className="material-symbols-outlined">add</span>
        </a>
        <a className="flex flex-col items-center p-2 text-slate-500 dark:text-slate-400" href="#">
          <span className="material-symbols-outlined">payments</span>
        </a>
        <a className="flex flex-col items-center p-2 text-slate-500 dark:text-slate-400" href="#">
          <span className="material-symbols-outlined">person</span>
        </a>
      </nav>
    </div>
  );
}
