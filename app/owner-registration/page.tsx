"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

export default function OwnerRegistration() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#0f1a14] font-body text-on-background dark:text-slate-200 selection:bg-secondary-container/30">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Registration Progress Header */}
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-extrabold text-primary dark:text-emerald-50 mb-3">{langText("Partner with Kisan Kamai", "किसान कमाईसोबत भागीदारी करा")}</h1>
          <p className="text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto">{langText("Join the trusted network of equipment owners across Maharashtra. Start your journey in minutes.", "महाराष्ट्रभरातील उपकरण मालकांच्या विश्वसनीय नेटवर्कमध्ये सामील व्हा. मिनिटांत तुमचा प्रवास सुरू करा.")}</p>
        </div>

        {/* Multi-Step Stepper */}
        <div className="mb-16 flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest dark:bg-emerald-800/50 -z-10 -translate-y-1/2"></div>
          {[
            { num: "1", label: langText("Account", "खाते"), active: true },
            { num: "2", label: langText("Location", "स्थान"), active: false },
            { num: "3", label: langText("Equipment", "उपकरणे"), active: false },
            { num: "4", label: langText("Verify", "पडताळणी"), active: false },
          ].map((step) => (
            <div key={step.num} className="flex flex-col items-center gap-2 bg-surface dark:bg-[#0f1a14] px-4">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${step.active ? "border-primary dark:border-emerald-400 text-primary dark:text-emerald-400 bg-white dark:bg-emerald-900/30" : "border-surface-container-highest dark:border-emerald-800 text-outline dark:text-slate-500 bg-white dark:bg-emerald-900/20"}`}>{step.num}</div>
              <span className={`text-xs font-label font-semibold uppercase tracking-wider ${step.active ? "text-primary dark:text-emerald-400" : "text-outline dark:text-slate-500"}`}>{step.label}</span>
            </div>
          ))}
        </div>

        {/* Registration Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Main Form Card */}
          <div className="lg:col-span-7 bg-white dark:bg-emerald-900/20 p-8 md:p-10 rounded-2xl shadow-sm border border-emerald-50 dark:border-emerald-800/50">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-bold text-primary dark:text-emerald-50">{langText("Account Setup", "खाते सेटअप")}</h2>
                <span className="text-sm font-medium bg-emerald-50 dark:bg-emerald-800/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full">{langText("Step 1 of 4", "पायरी 1 / 4")}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-label font-bold text-on-surface dark:text-emerald-200">{langText("Full Name / पूर्ण नाव", "पूर्ण नाव / Full Name")}</label>
                  <input className="w-full bg-surface-container-low dark:bg-emerald-900/30 dark:text-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container/20 placeholder:text-outline-variant dark:placeholder:text-slate-500" placeholder={langText("Enter name", "नाव टाका")} type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-label font-bold text-on-surface dark:text-emerald-200">{langText("Phone Number / फोन नंबर", "फोन नंबर / Phone Number")}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400 font-medium border-r border-outline-variant dark:border-emerald-700 pr-3">+91</span>
                    <input className="w-full bg-surface-container-low dark:bg-emerald-900/30 dark:text-white border-none rounded-xl pl-16 pr-4 py-3 focus:ring-2 focus:ring-primary-container/20 placeholder:text-outline-variant dark:placeholder:text-slate-500" placeholder="9876543210" type="tel"/>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-label font-bold text-on-surface dark:text-emerald-200">{langText("Village or Town / गाव किंवा शहर", "गाव किंवा शहर / Village or Town")}</label>
                <select defaultValue="" className="w-full bg-surface-container-low dark:bg-emerald-900/30 dark:text-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container/20 appearance-none">
                  <option value="" disabled>{langText("Select District / जिल्हा निवडा", "जिल्हा निवडा / Select District")}</option>
                  <option value="sangli">{langText("Sangli / सांगली", "सांगली / Sangli")}</option>
                  <option value="satara">{langText("Satara / सातारा", "सातारा / Satara")}</option>
                  <option value="kolhapur">{langText("Kolhapur / कोल्हापूर", "कोल्हापूर / Kolhapur")}</option>
                  <option value="pune">{langText("Pune / पुणे", "पुणे / Pune")}</option>
                </select>
              </div>

              <div className="pt-6 border-t border-surface-container-highest dark:border-emerald-800/50 flex items-center justify-between">
                <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium max-w-[200px]">{langText("By continuing, you agree to our Terms of Service.", "पुढे जाऊन, तुम्ही आमच्या सेवा अटींशी सहमत आहात.")}</p>
                <button className="bg-primary-container text-white px-10 py-3.5 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 group">
                  {langText("Next Step", "पुढील पायरी")}
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-primary-container rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary-container" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-3 tracking-tight">{langText("Owner Guarantees", "मालकांची हमी")}</h3>
                <ul className="space-y-4 text-on-primary-container/90 font-medium">
                  <li className="flex gap-3"><span className="material-symbols-outlined text-on-tertiary-container">check_circle</span>{langText("Verified renters only", "केवळ सत्यापित भाडेकरू")}</li>
                  <li className="flex gap-3"><span className="material-symbols-outlined text-on-tertiary-container">check_circle</span>{langText("Secure payment protection", "सुरक्षित पेमेंट संरक्षण")}</li>
                  <li className="flex gap-3"><span className="material-symbols-outlined text-on-tertiary-container">check_circle</span>{langText("24/7 Marathi & English support", "24/7 मराठी व इंग्रजी सपोर्ट")}</li>
                </ul>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-50 dark:border-emerald-800/50 shadow-sm flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Smiling farmer" className="w-16 h-16 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe1l4Rc-GUuzR3V1QmZL3Dx_Eh9y_2-2Ccd0mq_0xQPMgDwu2zOiqPJQnhEf2bZ0dvByc_z-AH0-qrFDr2WluU5B9icN4761QJjuqgxpfWIIFXCIQh3kajZIygqwiUF6G-_-0s30ZmxEOIuuaqYpRyx7dTCb4Hb0USO5eRVw2vXAO3mxIFFErO6cWbGWwRdrxnbPpPbPFv2tX7HbEFrxHb0OSVS_C9mWbX7rbamP5SPub42ricZrVH_xMbIc3FNbi3Sv0mm2Fu6BSL"/>
              <div>
                <p className="italic text-on-surface-variant dark:text-slate-300 text-sm mb-2">{langText("\"Kisan Kamai helped me earn extra income from my rotavator when I wasn't using it. Very trustworthy.\"", "\"किसान कमाईने मला माझा रोटाव्हेटर वापरत नसताना अतिरिक्त उत्पन्न कमवण्यास मदत केली. अत्यंत विश्वासार्ह.\"")}</p>
                <p className="font-bold text-primary dark:text-emerald-400 text-sm">— Rahul P., {langText("Sangli", "सांगली")}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 py-4 px-6 border-2 border-dashed border-surface-container-highest dark:border-emerald-800/50 rounded-2xl">
              <span className="material-symbols-outlined text-outline dark:text-slate-500">help</span>
              <p className="text-sm text-outline dark:text-slate-400 font-medium">{langText("Need help registering?", "नोंदणीसाठी मदत हवी?")} <a className="text-secondary dark:text-amber-400 font-bold hover:underline" href="#">{langText("Call Support", "सपोर्ट कॉल करा")}</a></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
