"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const locationMarkers = [
  { lat: 17.6805, lng: 74.0183, label: "Satara Hub", sublabel: "12 Active Harvesters • Karad, Phaltan, Wai", color: "#934a24" },
  { lat: 16.8547, lng: 74.5643, label: "Sangli Cluster", sublabel: "24 Active Tractors • Miraj, Tasgaon, Walwa", color: "#00251a" },
  { lat: 16.7050, lng: 74.2433, label: "Kolhapur Hub", sublabel: "8 Sugarcane Loaders • Hatkanangale, Shirol, Panhala", color: "#693c00" },
];

export default function Locations() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#0f1a14] text-on-surface dark:text-slate-200">
      <Header />
      <main className="flex-grow pt-20">

        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Expansive green sugarcane fields in Western Maharashtra" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrSpZOMk74aBsSIese2JWI0cHKeiaZObCNMRdhtYhkXOrrPS9QzTvPz2EIGQpSNPJtnZDKU-JA8YEgSIrUPakgZ-KJTyWZ7xWSPn_Veki49pHC2NCiEVFBDSjKLvJbRXXov-hx9BUF1gYISDkDtFiDNHPDNZhV4xRd6yViNV5bNTUlybVsxBTolfJGEjFMhFq_EKr8YjUmhfS49tYOgQjELe3e5s_soLwqjfNHTo96lgGbkHo1J434kxWHKuqozZ_lB_Q6bWCdn2q6"/>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/80 to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="max-w-2xl">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">{langText("Western Maharashtra", "पश्चिम महाराष्ट्र")}</span>
              <h1 className="text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">{langText("Serving the heart of Indian Agriculture.", "भारतीय शेतीच्या हृदयात सेवा देत आहोत.")}</h1>
              <p className="text-xl text-emerald-50/90 font-medium">{langText("Currently active across Sangli, Satara, and Kolhapur districts, bringing modern mechanization to every field.", "सध्या सांगली, सातारा आणि कोल्हापूर जिल्ह्यांमध्ये सक्रिय, प्रत्येक शेतात आधुनिक यांत्रिकीकरण आणत आहोत.")}</p>
            </div>
          </div>
        </section>

        {/* Interactive Map & Coverage Details */}
        <section className="py-24 bg-surface-container-low dark:bg-emerald-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              <div className="lg:col-span-8 space-y-8">
                {/* Real Interactive Map */}
                <div className="bg-white dark:bg-emerald-900/30 rounded-2xl shadow-xl shadow-emerald-900/5 dark:shadow-none p-4 border border-emerald-100 dark:border-emerald-800/50 overflow-hidden">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-primary dark:text-emerald-50">{langText("Interactive Service Map", "इंटरॅक्टिव्ह सेवा नकाशा")}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{langText("Explore active clusters and equipment hubs.", "सक्रिय क्लस्टर आणि उपकरण हब शोधा.")}</p>
                  </div>
                  <MapComponent
                    center={[17.05, 74.40]}
                    zoom={9}
                    markers={locationMarkers}
                    height="550px"
                    className="border border-emerald-100 dark:border-emerald-800/50"
                  />
                </div>

                {/* District Coverage Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: langText("Satara", "सातारा"), areas: [langText("Karad Cluster", "कराड क्लस्टर"), langText("Phaltan Hub", "फलटण हब"), langText("Wai Region", "वाई प्रदेश")] },
                    { name: langText("Sangli", "सांगली"), areas: [langText("Miraj Cluster", "मिरज क्लस्टर"), langText("Tasgaon Hub", "तासगाव हब"), langText("Walwa Region", "वाळवा प्रदेश")] },
                    { name: langText("Kolhapur", "कोल्हापूर"), areas: [langText("Hatkanangale Hub", "हातकणंगले हब"), langText("Shirol Cluster", "शिरोळ क्लस्टर"), langText("Panhala Region", "पन्हाळा प्रदेश")] },
                  ].map((district) => (
                    <div key={district.name} className="bg-white dark:bg-emerald-900/20 p-8 rounded-2xl border border-emerald-50 dark:border-emerald-800/50 shadow-sm">
                      <h3 className="text-3xl font-extrabold text-primary dark:text-emerald-50 mb-1">{district.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">{langText("District Coverage", "जिल्हा कव्हरेज")}</p>
                      <ul className="space-y-2 text-on-surface-variant dark:text-slate-300 font-medium">
                        {district.areas.map((area) => (
                          <li key={area} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {area}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expansion Request Form Sidebar */}
              <div className="lg:col-span-4 sticky top-28">
                <div className="bg-primary-container text-white p-8 rounded-3xl shadow-2xl">
                  <h2 className="text-2xl font-bold mb-2">{langText("Expanding Soon?", "लवकरच विस्तार?")}</h2>
                  <p className="text-emerald-50/70 text-sm mb-8">{langText("Not in your area yet? Submit a request and we'll prioritize your cluster for our next expansion phase.", "तुमच्या भागात अजून नाही? विनंती सबमिट करा आणि आम्ही तुमच्या क्लस्टरला प्राधान्य देऊ.")}</p>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1.5">{langText("Full Name", "पूर्ण नाव")}</label>
                      <input className="w-full bg-emerald-900/50 border border-emerald-800 rounded-xl px-4 py-3 text-white placeholder-emerald-700 focus:ring-secondary focus:border-secondary" placeholder={langText("Enter your name", "तुमचे नाव टाका")} type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1.5">{langText("WhatsApp Number", "व्हॉट्सअ‍ॅप नंबर")}</label>
                      <input className="w-full bg-emerald-900/50 border border-emerald-800 rounded-xl px-4 py-3 text-white placeholder-emerald-700 focus:ring-secondary focus:border-secondary" placeholder="+91 00000 00000" type="tel" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1.5">{langText("Your Village / Taluka", "तुमचे गाव / तालुका")}</label>
                      <input className="w-full bg-emerald-900/50 border border-emerald-800 rounded-xl px-4 py-3 text-white placeholder-emerald-700 focus:ring-secondary focus:border-secondary" placeholder={langText("e.g. Vita, Khanapur", "उदा. विटा, खानापूर")} type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1.5">{langText("Primary Equipment Needed", "प्राथमिक उपकरण आवश्यक")}</label>
                      <select className="flex-1 w-full bg-emerald-900/50 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-secondary focus:border-secondary">
                        <option>{langText("Tractors & Implements", "ट्रॅक्टर व उपकरणे")}</option>
                        <option>{langText("Sugarcane Harvesters", "ऊस कापणी यंत्र")}</option>
                        <option>{langText("Rotavators", "रोटाव्हेटर")}</option>
                        <option>{langText("Drone Spraying", "ड्रोन फवारणी")}</option>
                      </select>
                    </div>
                    <button className="w-full bg-secondary text-white font-bold py-4 rounded-xl hover:bg-on-secondary-container transition-colors shadow-lg mt-4" type="submit">
                      {langText("Submit Request", "विनंती सबमिट करा")}
                    </button>
                  </form>
                  <p className="mt-6 text-[10px] text-emerald-50/50 text-center leading-relaxed">{langText("By submitting, you agree to receive updates about service availability in your area via WhatsApp/SMS.", "सबमिट करून, तुम्ही तुमच्या भागातील सेवा उपलब्धतेबद्दल WhatsApp/SMS द्वारे अपडेट्स प्राप्त करण्यास सहमत आहात.")}</p>
                </div>

                <div className="mt-8 bg-tertiary-container text-on-tertiary-container p-6 rounded-2xl flex items-center gap-4">
                  <span className="material-symbols-outlined text-4xl text-on-tertiary-container">support_agent</span>
                  <div>
                    <h4 className="font-bold">{langText("Need Direct Help?", "थेट मदत हवी?")}</h4>
                    <p className="text-sm opacity-90">{langText("Call our field support at +91 98765 43210", "आमच्या फील्ड सपोर्टला कॉल करा +91 98765 43210")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="bg-white dark:bg-emerald-900/20 p-12 rounded-[40px] border border-emerald-50 dark:border-emerald-800/50 shadow-sm">
            <div className="max-w-3xl mb-16">
              <h2 className="text-4xl font-extrabold text-primary dark:text-emerald-50 tracking-tight mb-6">{langText("Empowering Maharashtra's Farmers through Modern Mechanisation.", "आधुनिक यांत्रिकीकरणाद्वारे महाराष्ट्रातील शेतकऱ्यांना सक्षम करणे.")}</h2>
              <p className="text-lg text-on-surface-variant dark:text-slate-400 leading-relaxed">{langText("At Kisan Kamai, we understand that timely access to the right equipment is the difference between a successful harvest and a lost season. By digitizing equipment rental across Sangli, Satara, and Kolhapur, we are reducing costs and increasing efficiency for thousands of local growers.", "किसान कमाईमध्ये, आम्हाला समजते की योग्य उपकरणांचा वेळीच प्रवेश हा यशस्वी कापणी आणि हरवलेला हंगाम यातील फरक आहे. सांगली, सातारा आणि कोल्हापूरमध्ये उपकरण भाडे डिजिटल करून, आम्ही हजारो स्थानिक शेतकऱ्यांसाठी खर्च कमी करत आहोत आणि कार्यक्षमता वाढवत आहोत.")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: "precision_manufacturing", title: langText("Advanced Implements", "प्रगत उपकरणे"), desc: langText("Access the latest laser levelers, power tillers, and specialized sugarcane harvesters that were previously unaffordable for individual farmers.", "नवीनतम लेसर लेव्हलर, पॉवर टिलर, आणि विशेष ऊस कापणी यंत्रे मिळवा जी आधी एकट्या शेतकऱ्यांसाठी परवडणारी नव्हती.") },
                { icon: "speed", title: langText("Timely Operations", "वेळेवर कामे"), desc: langText("Our local hub strategy ensures that equipment reaches your field exactly when the soil and weather conditions are optimal for sowing or harvest.", "आमची स्थानिक हब धोरण सुनिश्चित करते की पेरणी किंवा कापणीसाठी माती आणि हवामान अनुकूल असताना उपकरणे तुमच्या शेतात पोहोचतात.") },
                { icon: "payments", title: langText("Cost Efficiency", "खर्च कार्यक्षमता"), desc: langText("Pay only for what you use. Avoid heavy EMIs and maintenance costs of owning large machinery while benefiting from modern technology.", "तुम्ही जे वापरता तेवढेच भरा. आधुनिक तंत्रज्ञानाचा फायदा घेत मोठ्या यंत्रसामग्रीच्या भारी EMI आणि देखभाल खर्च टाळा.") },
              ].map((feature) => (
                <div key={feature.title} className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800/30 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-800 dark:text-emerald-400" style={{fontVariationSettings: "'FILL' 1"}}>{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary dark:text-emerald-50">{feature.title}</h3>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Banner Call To Action */}
        <section className="mb-24 px-6">
          <div className="max-w-7xl mx-auto rounded-[40px] h-[500px] overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Close up of a large modern orange tractor tyre" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKZC6B7aV2-8Ka9mee1ZzwnZknocKwMstNFKqdI5VdFgsEv7OEScTd_0nxSJ6PdwftGGGCIuUlukLZKyXDe8A3pLtMEOhRvRRujpMxR4-zjp_DRGqdtBZbo2ESf7qLwNOBZfFtHzOykNve4CfJiYPxHWKZayfNjEHubp01zEBp6tEb3AaIUhEboTWBBdBCzny9FFiQOPivIHi_i06-UZnOamQm8h4rNnAcrI34PRNhBIIeXWkPo5m0aTw3lBuijXENUoHQ-IiGYjb_"/>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-12">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-extrabold text-white mb-6">{langText("Rooted in Trust.", "विश्वासात रुजलेले.")} <br/>{langText("Serving Indian Agriculture.", "भारतीय शेतीची सेवा.")}</h2>
                <div className="flex gap-4">
                  <button className="bg-secondary text-white px-8 py-4 rounded-xl font-extrabold hover:opacity-90 transition-opacity">{langText("Find Equipment in My Area", "माझ्या भागातील उपकरणे शोधा")}</button>
                  <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-extrabold hover:bg-white/20 transition-all">{langText("Contact Us", "संपर्क करा")}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
