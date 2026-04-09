"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const hubMarkers = [
  { lat: 16.8547, lng: 74.5643, label: "Sangli Hub", sublabel: "Market Yard Road, Sangli 416416", color: "#00251a" },
  { lat: 17.6805, lng: 74.0183, label: "Satara Hub", sublabel: "Bombay Restaurant Chowk, Satara 415001", color: "#934a24" },
  { lat: 16.7050, lng: 74.2433, label: "Kolhapur Hub", sublabel: "Shiroli Pulachi, Kolhapur 416122", color: "#693c00" },
  { lat: 20.48, lng: 73.80, label: "Kalwan Area Hub", sublabel: "Active Hub - Nashik Region", color: "#934a24" },
  { lat: 18.77, lng: 77.36, label: "Mukhed Area Hub", sublabel: "HQ • Primary Hub - Nanded Region", color: "#00251a" },
];

export default function Support() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow pt-12 pb-20">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="relative overflow-hidden rounded-xl bg-primary-container p-8 md:p-16 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-4 py-1.5 bg-on-tertiary-container/20 text-on-tertiary-container rounded-full text-sm font-bold tracking-wide uppercase mb-6">{langText("Contact Us", "आमच्याशी संपर्क साधा")}</span>
              <h1 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight mb-6 tracking-tight">
                {langText("We are here to help.", "आम्ही मदतीसाठी येथे आहोत.")} <br />
                <span className="text-on-primary-container font-mukta">{langText("आम्ही मदतीसाठी येथे आहोत.", "We are here to help.")}</span>
              </h1>
              <p className="text-lg md:text-xl text-on-primary-fixed-variant max-w-xl font-medium leading-relaxed opacity-90">
                {langText("Reach out to our team in Sangli, Satara, or Kolhapur for any equipment rental or listing support.", "कोणत्याही उपकरण भाड्याने किंवा सूचीबद्ध करण्याच्या सहाय्यासाठी सांगली, सातारा किंवा कोल्हापुरातील आमच्या टीमशी संपर्क साधा.")}
              </p>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none hidden lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Farmer with phone" className="object-cover h-full w-full" src="/assets/generated/hero_tractor.png" />
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900/40 p-8 rounded-xl shadow-sm border border-emerald-50 dark:border-slate-800/50">
              <h2 className="text-xl font-bold font-headline mb-6 text-emerald-900 dark:text-emerald-50">{langText("Direct Support Channels", "थेट सपोर्ट चॅनेल")}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-800/30 flex items-center justify-center text-emerald-900 dark:text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{langText("Call Us", "कॉल करा")}</p>
                    <a className="text-lg font-bold text-emerald-900 dark:text-emerald-50 hover:text-secondary transition-colors" href="tel:+9118005472652624">+91 1800-KISAN-KAMAI</a>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{langText("Free for all Indian networks", "सर्व भारतीय नेटवर्कसाठी विनामूल्य")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-800/30 flex items-center justify-center text-emerald-900 dark:text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{langText("WhatsApp", "व्हॉट्सअ‍ॅप")}</p>
                    <a className="text-lg font-bold text-emerald-900 dark:text-emerald-50 hover:text-secondary transition-colors" href="mailto:support@kisankamai.com">{langText("Chat with Support", "सपोर्टशी चॅट करा")}</a>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{langText("Average response: 15 mins", "सरासरी प्रतिसाद: 15 मिनिटे")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-800/30 flex items-center justify-center text-emerald-900 dark:text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{langText("Email", "ईमेल")}</p>
                    <a className="text-lg font-bold text-emerald-900 dark:text-emerald-50 hover:text-secondary transition-colors" href="mailto:support@kisankamai.com">support@kisankamai.com</a>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{langText("Official correspondence", "अधिकृत पत्रव्यवहार")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low dark:bg-slate-900/50 p-8 rounded-xl border border-surface-container-highest dark:border-slate-800/50">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-on-surface dark:text-emerald-50">
                <span className="material-symbols-outlined text-secondary">schedule</span>
                {langText("Service Hours", "सेवा वेळ")}
              </h3>
              <p className="text-on-surface-variant dark:text-slate-300 font-medium">{langText("Daily: 8 AM to 8 PM", "दररोज: सकाळी ८ ते रात्री ८")}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <a className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-emerald-100 dark:border-slate-800/50 hover:border-emerald-500 hover:shadow-md transition-all" href="/faq">
                <span className="material-symbols-outlined text-secondary mb-3 block">menu_book</span>
                <span className="font-bold block text-emerald-900 dark:text-emerald-50">{langText("How to Rent", "कसे भाड्याने घ्यावे")}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-tighter">{langText("Guide", "मार्गदर्शक")}</span>
              </a>
              <a className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-emerald-100 dark:border-slate-800/50 hover:border-emerald-500 hover:shadow-md transition-all" href="/list-equipment">
                <span className="material-symbols-outlined text-secondary mb-3 block">handyman</span>
                <span className="font-bold block text-emerald-900 dark:text-emerald-50">{langText("Owner Guide", "मालक मार्गदर्शक")}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-tighter">{langText("Help", "मदत")}</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900/40 p-8 md:p-12 rounded-xl shadow-sm border border-emerald-50 dark:border-slate-800/50">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold font-headline text-emerald-900 dark:text-emerald-50 mb-2">{langText("Send a Message", "संदेश पाठवा")}</h2>
                <p className="text-slate-500 dark:text-slate-400">{langText("Fill out the form below and our team will get back to you within 2-4 business hours.", "खालील फॉर्म भरा आणि आमची टीम 2-4 व्यावसायिक तासांत तुम्हाला प्रतिसाद देईल.")}</p>
              </div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-200 tracking-wide">{langText("FULL NAME / पूर्ण नाव", "पूर्ण नाव / FULL NAME")}</label>
                    <input className="w-full bg-surface-container-lowest dark:bg-slate-900/50 dark:text-white border-outline-variant dark:border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none" placeholder={langText("Enter your name", "तुमचे नाव टाका")} type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-200 tracking-wide">{langText("PHONE NUMBER / फोन नंबर", "फोन नंबर / PHONE NUMBER")}</label>
                    <input className="w-full bg-surface-container-lowest dark:bg-slate-900/50 dark:text-white border-outline-variant dark:border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none" placeholder="+91 00000 00000" type="tel" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-200 tracking-wide">{langText("EMAIL ADDRESS (OPTIONAL)", "ईमेल पत्ता (ऐच्छिक)")}</label>
                    <input className="w-full bg-surface-container-lowest dark:bg-slate-900/50 dark:text-white border-outline-variant dark:border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none" placeholder="email@example.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-200 tracking-wide">{langText("CATEGORY / श्रेणी", "श्रेणी / CATEGORY")}</label>
                    <select className="w-full bg-surface-container-lowest dark:bg-slate-900/50 dark:text-white border-outline-variant dark:border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none appearance-none">
                      <option>{langText("I want to Rent (भाड्याने घेणे)", "मला भाड्याने घ्यायचे आहे")}</option>
                      <option>{langText("I want to List (उपकरणे जोडणे)", "मला सूचीबद्ध करायचे आहे")}</option>
                      <option>{langText("Payment Issue (पेमेंट समस्या)", "पेमेंट समस्या")}</option>
                      <option>{langText("General Support (सामान्य मदत)", "सामान्य मदत")}</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900 dark:text-emerald-200 tracking-wide">{langText("MESSAGE / संदेश", "संदेश / MESSAGE")}</label>
                  <textarea className="w-full bg-surface-container-lowest dark:bg-slate-900/50 dark:text-white border-outline-variant dark:border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none" placeholder={langText("How can we help you today?", "आम्ही आज तुम्हाला कशी मदत करू शकतो?")} rows={5}></textarea>
                </div>
                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <button className="flex-1 bg-primary-container text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl active:scale-[0.98] transition-all" type="submit">
                    {langText("Send Message", "संदेश पाठवा")}
                  </button>
                  <button className="flex-1 bg-white dark:bg-transparent border-2 border-primary-container text-primary-container dark:text-emerald-400 py-4 rounded-lg font-bold text-lg hover:bg-emerald-50 dark:hover:bg-slate-900/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="button">
                    <span className="material-symbols-outlined">phone_callback</span>
                    {langText("Request Callback", "कॉलबॅक विनंती")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Regional Hubs with Real Map */}
        <section className="max-w-7xl mx-auto px-6 mt-20">
          <div className="bg-white dark:bg-slate-900/40 rounded-xl shadow-sm border border-emerald-50 dark:border-slate-800/50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold font-headline text-emerald-900 dark:text-emerald-50 mb-4">{langText("Visit our Regional Hubs", "आमच्या प्रादेशिक हबला भेट द्या")}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">{langText("Direct support is available at our partner centers across Southern Maharashtra.", "दक्षिण महाराष्ट्रातील आमच्या भागीदार केंद्रांवर थेट सहाय्य उपलब्ध आहे.")}</p>
                <div className="space-y-6">
                  {[
                    { name: langText("Sangli District Hub", "सांगली जिल्हा हब"), addr: "Market Yard Road, Sangli, Maharashtra 416416" },
                    { name: langText("Satara District Hub", "सातारा जिल्हा हब"), addr: "Bombay Restaurant Chowk, Satara, Maharashtra 415001" },
                    { name: langText("Kolhapur Regional Hub", "कोल्हापूर प्रादेशिक हब"), addr: "Shiroli Pulachi, Kolhapur, Maharashtra 416122" },
                    { name: langText("Kalwan Area Hub", "कळवण परिसर हब"), addr: "Nashik Region, Maharashtra 423501" },
                    { name: langText("Mukhed Area Hub", "मुखेड परिसर हब"), addr: "Nanded Region, Maharashtra 431715" },
                  ].map((hub) => (
                    <div key={hub.name} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-secondary">location_on</span>
                      <div>
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-50">{hub.name}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{hub.addr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-64 lg:h-auto min-h-[400px] relative">
                <MapComponent
                  center={[17.05, 74.40]}
                  zoom={9}
                  markers={hubMarkers}
                  height="100%"
                  showControls={false}
                  className="rounded-none"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
