"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const nearbyMarkers = [
  { lat: 16.86, lng: 74.57, label: "Mahindra 575 DI", sublabel: "₹800/hr • 4.2 km away", color: "#00251a" },
  { lat: 16.84, lng: 74.52, label: "John Deere W70", sublabel: "₹2,500/hr • 8.5 km away", color: "#934a24" },
  { lat: 16.87, lng: 74.55, label: "Shaktiman Rotavator", sublabel: "₹350/hr • 1.2 km away", color: "#693c00" },
];

const equipmentCards = [
  { location: "Kalwan", cat: "Tractor • Mahindra 575", name: "Mahindra Novo 575 DI", price: "₹800", unit: "per hour", rating: "4.9", hp: "45 HP", dist: "4.2 km", owner: "Rahul P.", img: "/assets/generated/harvester_action.png", ownerImg: "/assets/generated/harvester_action.png", verified: true },
  { location: "Mukhed", cat: "Harvester • John Deere", name: "John Deere W70 Combine", price: "₹2,500", unit: "per hour", rating: "4.7", hp: "100 HP", dist: "8.5 km", owner: "Sangli Agri-Hub", img: "/assets/generated/harvester_action.png", popular: true },
  { location: "Kalwan", cat: "Implement • Shaktiman", name: "Shaktiman Regular Light", price: "₹350", unit: "per hour", rating: "5.0", hp: "6 ft width", dist: "1.2 km", owner: "Vikas G.", img: "/assets/generated/harvester_action.png", ownerImg: "/assets/generated/harvester_action.png" },
  { location: "Mukhed", cat: "Tractor • Swaraj", name: "Swaraj 744 FE", price: "₹750", unit: "per hour", rating: "4.8", hp: "48 HP", dist: "2.1 km", owner: "Suresh", img: "/assets/generated/harvester_action.png", verified: true },
];

function RentEquipmentInner() {
  const { langText } = useLanguage();
  const searchParams = useSearchParams();
  
  const initialLoc = searchParams.get("location") || "";
  const initialQuery = searchParams.get("query") || "";

  const [activeLocation, setActiveLocation] = useState(initialLoc);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [suggestionMsg, setSuggestionMsg] = useState("");

  const handlePincodeSearch = (val: string) => {
    setActiveLocation(val);
    if (val === "423501" || val.toLowerCase() === "kalwan") {
      setActiveLocation("Kalwan");
      setSuggestionMsg("");
    } else if (val === "431715" || val.toLowerCase() === "mukhed") {
      setActiveLocation("Mukhed");
      setSuggestionMsg("");
    } else if (/^\d{6}$/.test(val)) {
      setSuggestionMsg(langText("Location not found in our system. Suggesting nearby available locations.", "आमच्या सिस्टममध्ये स्थान आढळले नाही. जवळपासच्या उपलब्ध स्थानांची सूचना देत आहोत."));
      setActiveLocation("Kalwan");
    } else {
      setSuggestionMsg("");
    }
  };

  useEffect(() => {
    if (initialLoc) {
      handlePincodeSearch(initialLoc);
    }
  }, [initialLoc]);

  const filteredCards = equipmentCards.filter(eq => {
    const locMatch = (activeLocation === "Kalwan" || activeLocation === "Mukhed") ? eq.location === activeLocation : true;
    const queryMatch = activeQuery === "" || eq.cat.toLowerCase().includes(activeQuery.toLowerCase()) || eq.name.toLowerCase().includes(activeQuery.toLowerCase());
    return locMatch && queryMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">
        {/* Search & Discovery */}
        <section className="bg-white dark:bg-slate-950 border-b border-outline-variant/30 dark:border-slate-800/50 sticky top-[72px] z-40">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-1/3 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline dark:text-slate-400">location_on</span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low dark:bg-slate-900/50 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-primary-container font-medium" 
                  placeholder={langText("Enter Location or Pincode", "स्थान किंवा पिनकोड टाका")} 
                  type="text" 
                  value={activeLocation}
                  onChange={(e) => setActiveLocation(e.target.value)}
                  onBlur={(e) => handlePincodeSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePincodeSearch(activeLocation)}
                />
              </div>
              <div className="w-full md:w-1/2 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline dark:text-slate-400">search</span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low dark:bg-slate-900/50 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-primary-container font-medium" 
                  placeholder={langText("Search for Tractors, Harvesters...", "ट्रॅक्टर, हार्वेस्टर शोधा...")} 
                  type="text"
                  value={activeQuery}
                  onChange={(e) => setActiveQuery(e.target.value)}
                />
              </div>
              <div className="flex bg-surface-container-low dark:bg-slate-900/50 p-1 rounded-xl w-full md:w-auto">
                <button className="flex-1 md:w-12 h-10 flex items-center justify-center bg-white dark:bg-emerald-800 rounded-lg shadow-sm text-primary-container dark:text-emerald-400"><span className="material-symbols-outlined">grid_view</span></button>
                <button className="flex-1 md:w-12 h-10 flex items-center justify-center text-outline dark:text-slate-400 hover:text-primary-container"><span className="material-symbols-outlined">map</span></button>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 overflow-x-auto pb-2">
              <button className="px-5 py-2 bg-primary-container text-white rounded-full font-label text-sm font-semibold whitespace-nowrap">{langText("All Equipment", "सर्व उपकरणे")}</button>
              {[langText("Tractors","ट्रॅक्टर"), langText("Harvesters","हार्वेस्टर"), langText("Rotavators","रोटाव्हेटर"), langText("Seeders","सीडर"), langText("Sprayers","फवारणी यंत्र"), langText("Ploughs","नांगर")].map((cat) => (
                <button key={cat} className="px-5 py-2 bg-surface-container-highest dark:bg-slate-900/50 text-on-surface dark:text-slate-300 rounded-full font-label text-sm font-medium whitespace-nowrap hover:bg-outline-variant/30 transition-colors">{cat}</button>
              ))}
              <div className="h-6 w-px bg-outline-variant/50 mx-2"></div>
              <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant dark:border-slate-700 rounded-full font-label text-sm font-semibold hover:bg-surface-container dark:hover:bg-slate-900/50 transition-colors text-on-surface dark:text-slate-300">
                <span className="material-symbols-outlined text-sm">tune</span>{langText("More Filters", "अधिक फिल्टर")}
              </button>
            </div>
          </div>
          {suggestionMsg && (
            <div className="max-w-7xl mx-auto px-6 pb-4">
              <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-semibold">
                <span className="material-symbols-outlined text-sm">info</span>
                {suggestionMsg}
              </div>
            </div>
          )}
        </section>

        {/* Main Discovery Area */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-primary dark:text-emerald-50">{langText(`Available Equipment${activeLocation ? ' in ' + activeLocation : ''}`, `${activeLocation ? activeLocation + ' मधील ' : ''}उपलब्ध उपकरणे`)}</h1>
              <p className="text-on-surface-variant dark:text-slate-400 font-medium mt-1">{langText(`Found ${filteredCards.length} premium machines ready for your field`, `तुमच्या शेतासाठी ${filteredCards.length} प्रीमियम मशीन तयार आढळल्या`)}</p>

            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-outline dark:text-slate-400">
              <span>{langText("Sort by:", "क्रमवारी:")}</span>
              <button className="flex items-center gap-1 text-primary dark:text-emerald-400">{langText("Popularity", "लोकप्रियता")} <span className="material-symbols-outlined">expand_more</span></button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCards.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                {langText("No equipment found matching your criteria.", "तुमच्या निकषांशी जुळणारे कोणतेही उपकरण आढळले नाही.")}
              </div>
            ) : filteredCards.map((eq) => (
              <div key={eq.name} className="group bg-white dark:bg-slate-900/40 rounded-2xl overflow-hidden border border-outline-variant/20 dark:border-slate-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={eq.name} src={eq.img} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="font-bold text-xs">{eq.rating}</span>
                  </div>
                  {eq.popular && <span className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-lg font-black text-[10px] tracking-widest uppercase">{langText("Popular Choice", "लोकप्रिय")}</span>}
                  {!eq.popular && <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all"><span className="material-symbols-outlined">favorite</span></button>}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1 block">{eq.cat}</span>
                      <h3 className="text-lg font-extrabold text-primary dark:text-emerald-50 leading-tight">{eq.name}</h3>
                    </div>
                    <div className="text-right">
                      <span className="block text-xl font-black text-emerald-900 dark:text-emerald-300">{eq.price}</span>
                      <span className="text-[10px] font-bold text-outline-variant dark:text-slate-400 uppercase">{langText(eq.unit || "per hour", "प्रति तास")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-800/50 mb-4">
                    <div className="flex items-center gap-1.5 text-on-surface-variant dark:text-slate-400"><span className="material-symbols-outlined text-lg">settings_suggest</span><span className="text-xs font-semibold">{eq.hp}</span></div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant dark:text-slate-400"><span className="material-symbols-outlined text-lg">distance</span><span className="text-xs font-semibold">{langText(eq.dist + " away", eq.dist + " दूर")}</span></div>
                    {eq.verified && <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400"><span className="material-symbols-outlined text-lg">verified</span><span className="text-xs font-semibold">{langText("Verified", "सत्यापित")}</span></div>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-900/70 overflow-hidden flex items-center justify-center">
                        {eq.ownerImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt="Owner" className="w-full h-full object-cover" src={eq.ownerImg} />
                        ) : (
                          <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400">{langText("Owned by", "मालक")} {eq.owner}</span>
                    </div>
                    <button className="bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary transition-colors">{langText("Book Now", "आता बुक करा")}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Callback CTA */}
          <div className="mt-20 p-1 bg-gradient-to-r from-emerald-100 to-amber-50 dark:from-emerald-900/50 dark:to-amber-900/20 rounded-3xl">
            <div className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-black text-primary dark:text-emerald-50 leading-tight mb-4">{langText("Can't find the specific equipment you're looking for?", "तुम्ही शोधत असलेले विशिष्ट उपकरण सापडत नाही?")}</h2>
                <p className="text-on-surface-variant dark:text-slate-400 text-lg font-medium">{langText("Our fleet is growing daily. Tell us your requirements and our local coordinator will find the best match for your field within 2 hours.", "आमचा ताफा दररोज वाढत आहे. आम्हाला तुमच्या गरजा सांगा आणि आमचा स्थानिक समन्वयक 2 तासांत तुमच्या शेतासाठी सर्वोत्तम जुळणी शोधेल.")}</p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-900/60 rounded-xl shadow-sm border border-emerald-100 dark:border-slate-800/50">
                    <span className="material-symbols-outlined text-emerald-700 dark:text-emerald-400">support_agent</span>
                    <span className="text-sm font-bold dark:text-emerald-50">{langText("24/7 Field Support", "24/7 फील्ड सपोर्ट")}</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-900/60 rounded-xl shadow-sm border border-emerald-100 dark:border-slate-800/50">
                    <span className="material-symbols-outlined text-emerald-700 dark:text-emerald-400">verified_user</span>
                    <span className="text-sm font-bold dark:text-emerald-50">{langText("Guaranteed Delivery", "हमखास डिलिव्हरी")}</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-96 bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-xl shadow-emerald-900/5 border border-outline-variant/20 dark:border-slate-800/50">
                <h4 className="font-black text-lg mb-6 dark:text-emerald-50">{langText("Request Callback", "कॉलबॅक विनंती")}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-outline dark:text-slate-400 mb-1.5">{langText("Full Name", "पूर्ण नाव")}</label>
                    <input className="w-full px-4 py-3 bg-surface-container-low dark:bg-slate-900/50 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-primary-container font-medium" placeholder={langText("e.g. Ramesh Patil", "उदा. रमेश पाटील")} type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-outline dark:text-slate-400 mb-1.5">{langText("Phone Number", "फोन नंबर")}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-outline dark:text-slate-400">+91</span>
                      <input className="w-full pl-12 pr-4 py-3 bg-surface-container-low dark:bg-slate-900/50 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-primary-container font-medium" placeholder={langText("Enter 10 digit number", "10 अंकी क्रमांक टाका")} type="tel" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-outline dark:text-slate-400 mb-1.5">{langText("Equipment Needed", "आवश्यक उपकरणे")}</label>
                    <input className="w-full px-4 py-3 bg-surface-container-low dark:bg-slate-900/50 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-primary-container font-medium" placeholder={langText("e.g. Laser Leveler", "उदा. लेसर लेव्हलर")} type="text" />
                  </div>
                  <button className="w-full py-4 bg-secondary text-white rounded-xl font-black tracking-wide uppercase hover:scale-[0.98] transition-transform mt-2">{langText("Get Free Callback", "विनामूल्य कॉलबॅक मिळवा")}</button>
                  <p className="text-[10px] text-center text-outline dark:text-slate-500 font-medium">{langText("Our experts typically respond within 15 minutes", "आमचे तज्ञ सामान्यतः 15 मिनिटांत प्रतिसाद देतात")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety with Interactive Map */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden h-[400px] border-4 border-white dark:border-slate-800 shadow-2xl">
              <MapComponent
                center={[16.855, 74.56]}
                zoom={12}
                markers={nearbyMarkers}
                circles={[
                  { lat: 16.855, lng: 74.56, radius: 4000, color: "#10b981" }
                ]}
                height="100%"
                showControls={true}
                className="rounded-none"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="font-label text-secondary dark:text-amber-400 font-black uppercase tracking-[0.2em] text-xs">{langText("Trust & Safety", "विश्वास व सुरक्षा")}</span>
              <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mt-4 mb-6 leading-tight">{langText("Every machine is verified for performance", "प्रत्येक मशीन कार्यक्षमतेसाठी सत्यापित")}</h2>
              <div className="space-y-6">
                {[
                  { icon: "task_alt", title: langText("Mechanical Inspection", "यांत्रिक तपासणी"), desc: langText("All equipment listed on Kisan Kamai undergoes a 24-point performance check before being verified.", "किसान कमाईवर सूचीबद्ध सर्व उपकरणे सत्यापित होण्यापूर्वी 24-पॉइंट कार्यप्रदर्शन तपासणी करतात.") },
                  { icon: "receipt_long", title: langText("Transparent Pricing", "पारदर्शक किंमत"), desc: langText("No hidden costs. The price you see includes operator charges and basic fuel estimates.", "कोणतेही छुपे शुल्क नाहीत. तुम्ही पाहत असलेल्या किंमतीत ऑपरेटर शुल्क आणि मूलभूत इंधन अंदाज समाविष्ट आहेत.") },
                  { icon: "person_celebrate", title: langText("Local Support", "स्थानिक सपोर्ट"), desc: langText("Dedicated support hubs in Sangli, Satara, and Kolhapur to ensure your farming never stops.", "तुमची शेती कधीही थांबणार नाही याची खात्री करण्यासाठी सांगली, सातारा आणि कोल्हापूरमध्ये समर्पित सपोर्ट हब.") },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-emerald-100 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-900 dark:text-emerald-400">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-primary dark:text-emerald-50">{item.title}</h4>
                      <p className="text-on-surface-variant dark:text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <button className="fixed bottom-8 right-8 bg-secondary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50"><span className="material-symbols-outlined">chat_bubble</span></button>
      <Footer />
    </div>
  );
}

export default function RentEquipment() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RentEquipmentInner />
    </Suspense>
  );
}
