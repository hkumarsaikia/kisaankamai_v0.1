"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const homepageMarkers = [
  { lat: 17.00, lng: 74.00, label: "Satara", sublabel: "Active Hub", color: "#934a24" },
  { lat: 16.85, lng: 74.57, label: "Sangli", sublabel: "HQ • Primary Hub", color: "#00251a" },
  { lat: 16.70, lng: 74.23, label: "Kolhapur", sublabel: "Active Hub", color: "#693c00" },
];

export default function Home() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#0f1a14] text-on-surface">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-full h-full object-cover" alt="Modern tractor plowing a vast golden-brown field in rural India during sunrise" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhZ6nzq8ftAMceWSrFYkP1nwSI2jAbJwA7ZWwvOf_Z9ZQdUCvUZwUYtR1yqnz9pdq72MP6BLfd1WhABoQcet8jPpzUyxcQdd6wLaENEFoGWcKF2YfFxRxGIWtUzNCJVCiAzw7923oSc8s18vysXR1cL1BsIQOWKrXHjNHlMozyqkR3hjioSQ3_AXyjeA12oP6d1gdjPieMLdlt-yyQ1X5dbVnJ6sQc6K0pW8VAgdL-pQ2brKvNmj9paok8mnQroq5W7U1lbTkysUZ3" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6">
                <span className="w-2 h-2 bg-secondary rounded-full transform dark:bg-amber-400"></span>
                <span className="text-sm font-label font-bold uppercase tracking-widest">{langText("Now Serving Western Maharashtra", "आता पश्चिम महाराष्ट्रात सेवा देत आहोत")}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                {langText("Modern Machinery for Every Farm.", "प्रत्येक शेतीसाठी आधुनिक यंत्रसामग्री.")}
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
                {langText("Rent high-quality agricultural equipment from trusted local owners. Smarter farming, powered by technology, rooted in trust.", "विश्वसनीय स्थानिक मालकांकडून उच्च दर्जाची कृषी उपकरणे भाड्याने घ्या. स्मार्ट शेती, तंत्रज्ञानाने समर्थित, विश्वासात रुजलेली.")}
              </p>
              <div className="bg-white dark:bg-emerald-950 p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl border border-transparent dark:border-emerald-800">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-emerald-800/50">
                  <span className="material-symbols-outlined text-secondary dark:text-emerald-400">location_on</span>
                  <input className="w-full border-none focus:ring-0 text-on-surface dark:text-emerald-50 placeholder:text-slate-400 dark:placeholder-slate-500 bg-transparent" placeholder={langText("Select Location (Sangli, Satara...)", "स्थान निवडा (सांगली, सातारा...)")} type="text" />
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <span className="material-symbols-outlined text-secondary dark:text-emerald-400">agriculture</span>
                  <input className="w-full border-none focus:ring-0 text-on-surface dark:text-emerald-50 placeholder:text-slate-400 dark:placeholder-slate-500 bg-transparent" placeholder={langText("Search Tractors, Harvesters...", "ट्रॅक्टर्स, हार्वेस्टर्स शोधा...")} type="text" />
                </div>
                <button className="bg-secondary dark:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-secondary/90 dark:hover:bg-emerald-600 transition-all">
                  {langText("Search Now", "आत्ताच शोधा")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-surface-container-highest/30 dark:bg-emerald-950/50 py-8 border-b border-slate-200 dark:border-emerald-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="font-black text-xl text-primary dark:text-emerald-200">Swaraj Tractors</span>
              <span className="font-black text-xl text-primary dark:text-emerald-200">Mahindra Farm</span>
              <span className="font-black text-xl text-primary dark:text-emerald-200">John Deere</span>
              <span className="font-black text-xl text-primary dark:text-emerald-200">New Holland</span>
              <span className="font-black text-xl text-primary dark:text-emerald-200">Massey Ferguson</span>
              <span className="font-black text-xl text-primary dark:text-emerald-200">Kubota</span>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-24 bg-white dark:bg-emerald-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
              <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-4 tracking-tight">{langText("Explore Equipment Categories", "उपकरण वर्गवारी शोधा")}</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl">{langText("From land preparation to harvesting, find the right tool for every stage of your farming cycle.", "जमीन तयारीपासून कापणीपर्यंत, तुमच्या शेती चक्राच्या प्रत्येक टप्प्यासाठी व्योग्य साधन शोधा.")}</p>
              </div>
              <Link className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all" href="/rent-equipment">
                {langText("View All Categories", "सर्व वर्गवारी पहा")} <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tractors */}
              <Link href="/rent-equipment" className="group relative h-[450px] overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="High-horsepower tractor parked in a vibrant green farm field" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeYZkgPtT1CB2DRr74jXatRMZxsAdZPeHXb9EZLzta1OkRzg-51UM6cU9fwtEyq1Fxe0DNDNzxhmQpzS3XT78_inszbrqKHipCjgAtAnmQHJ2DF47aaWisB0j9cg9qookoOgvlXfRMwDoATcDX2mCgHeM9s4vkJZxH3lEP2bHUGRRcl3icIHYwaaW_JRHf9_ftAKddSlqzk-_RR_vgYXT_cdFYfpbZ-_bhdehYLIjyfwKUAnU5dqvcN1Lnuv1GZqT0MDreKEDaNYQv" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wider">{langText("Heavy Duty", "जड शक्ती")}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{langText("Tractors", "ट्रॅक्टर्स")}</h3>
                  <p className="text-white/70 text-sm mb-6">{langText("45 HP to 75 HP tractors available for immediate rent.", "45 HP ते 75 HP ट्रॅक्टर तात्काळ भाड्याने उपलब्ध.")}</p>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {langText("Browse Models", "मॉडेल्स पहा")} <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
              {/* Harvesters */}
              <Link href="/rent-equipment" className="group relative h-[450px] overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Combine harvester working through a wheat field" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVmvbUiNz9Y79Yb45dHYtKeuMnBHJbbyltug7gB6AP4g77aPrvgd53M28uBrNqj3aMOSDVc7AArhGhEm1WgvEpfJrsJ52N7og-SIjmTqQvosoc6HHWBhO93tJO1TcYGg4AMunwMP4L3lNVCCxKnq9bIA44W5v82XwooWnyNy-iwGUQmTRSijWuY30IxW2ltnvhzFiDW7WREeNHUb4QETd4Z_u4t64CSreHmIK0tCFKrjDxjNyFRghffOI61VCF-YOAGZQfFfZfKpqi" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wider">{langText("Multi-Crop", "बहु-पीक")}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{langText("Harvesters", "हार्वेस्टर्स")}</h3>
                  <p className="text-white/70 text-sm mb-6">{langText("Efficiency at scale for grain, corn, and soy crops.", "धान्य, मका आणि सोयाबीन पिकांसाठी मोठ्या प्रमाणात कार्यक्षमता.")}</p>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {langText("Browse Models", "मॉडेल्स पहा")} <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
              {/* Implements */}
              <Link href="/rent-equipment" className="group relative h-[450px] overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Agricultural implements including a rotavator and seed drill" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxAyAip2db-I7yhNxtnmMQiY4x8GjoDKqNbDpry_5Otkuux9iqpLbBaKpwcvVpPlI57lOgEwpHLrmy7C9lb6YuMJAPRO9Vrrdz4uNltn7v2BQvff5nFy7RxCRDIz6cVDrZWoR_aRGlz4n5Jkzx9CkpwPJFQlZ51TmGOnlZcMDz-uoeDVYHGFKL1iO4Jaq-_0Zs9hAUu57ILEypAsIwlzR4OQFotLlKfbtGuowQ3wQLUMV5f3dJDhvQ5-lFlBa-BA5hbDOPb4hkVs7K" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wider">{langText("Specialized Tools", "विशेष साधने")}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{langText("Implements", "उपकरणे")}</h3>
                  <p className="text-white/70 text-sm mb-6">{langText("Rotavators, seed drills, and plows for precision farming.", "रोटावेटर, बीज ड्रिल आणि नांगर अचूक शेतीसाठी.")}</p>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {langText("Browse Models", "मॉडेल्स पहा")} <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 bg-surface-container-low dark:bg-emerald-950/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-4 tracking-tight">{langText("The Kisan Kamai Way", "किसान कमाई पद्धत")}</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{langText("Whether you are looking to rent or listing your own fleet, our process is built on transparency and local trust.", "तुम्ही भाडे शोधत असाल किंवा तुमची स्वतःची यंत्रसामग्री सूचीबद्ध करत असाल, आमची प्रक्रिया पारदर्शकता आणि स्थानिक विश्वासावर आधारित आहे.")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Renter Path */}
              <div className="bg-white dark:bg-emerald-900/20 p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-emerald-800/50">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-900 mb-8">
                  <span className="material-symbols-outlined text-3xl">shopping_cart</span>
                </div>
                <h3 className="text-3xl font-black text-primary dark:text-emerald-50 mb-8">{langText("Rent with Confidence", "आत्मविश्वासाने भाडे")}</h3>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1 dark:text-white">{langText("Search & Filter", "शोधा आणि फिल्टर करा")}</h4>
                      <p className="text-slate-500 dark:text-slate-400">{langText("Find equipment by type, location, and power rating across Western Maharashtra.", "पश्चिम महाराष्ट्रातील प्रकार, स्थान आणि पॉवर रेटिंगनुसार उपकरणे शोधा.")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1 dark:text-white">{langText("Secure Booking", "सुरक्षित बुकिंग")}</h4>
                      <p className="text-slate-500 dark:text-slate-400">{langText("Submit your request and get confirmation from vetted local equipment owners.", "तुमची विनंती सबमिट करा आणि सत्यापित स्थानिक उपकरण मालकांकडून पुष्टी मिळवा.")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1 dark:text-white">{langText("Harvest Success", "यशस्वी कापणी")}</h4>
                      <p className="text-slate-500 dark:text-slate-400">{langText("Equipment delivered or picked up. Pay through secure digital channels or cash.", "उपकरणे वितरित किंवा उचलली. डिजिटल किंवा रोख माध्यमातून पैसे द्या.")}</p>
                    </div>
                  </div>
                </div>
                <Link href="/renter-journey" className="block w-full mt-12 bg-primary-container text-white py-4 rounded-xl font-bold hover:bg-primary transition-all text-center">
                  {langText("Start Renting Now", "आत्ताच भाडे सुरू करा")}
                </Link>
              </div>
              {/* Owner Path */}
              <div className="bg-primary-container p-10 rounded-3xl shadow-sm text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 border border-white/20">
                    <span className="material-symbols-outlined text-3xl">currency_rupee</span>
                  </div>
                  <h3 className="text-3xl font-black mb-8">{langText("Maximize Your Fleet", "तुमच्या यंत्रसामग्रीचा जास्तीत जास्त वापर")}</h3>
                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <span className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">1</span>
                      <div>
                        <h4 className="font-bold text-lg mb-1 text-white">{langText("List Your Fleet", "तुमची यंत्रसामग्री सूचीबद्ध करा")}</h4>
                        <p className="text-white/70">{langText("Upload photos, set your rates, and specify equipment availability schedules.", "फोटो अपलोड करा, दर सेट करा आणि उपकरण उपलब्धता वेळापत्रक निर्दिष्ट करा.")}</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <span className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">2</span>
                      <div>
                        <h4 className="font-bold text-lg mb-1 text-white">{langText("Manage Bookings", "बुकिंग व्यवस्थापित करा")}</h4>
                        <p className="text-white/70">{langText("Approve rental requests and coordinate with local farmers in your area.", "भाडे विनंत्या मंजूर करा आणि तुमच्या क्षेत्रातील स्थानिक शेतकऱ्यांसोबत समन्वय करा.")}</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <span className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">3</span>
                      <div>
                        <h4 className="font-bold text-lg mb-1 text-white">{langText("Get Paid Fast", "लवकर पैसे मिळवा")}</h4>
                        <p className="text-white/70">{langText("Receive guaranteed payouts directly to your bank account after completion.", "पूर्ण झाल्यानंतर सीधे तुमच्या बँक खात्यात हमी देणे प्राप्त करा.")}</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/owner-registration" className="block w-full mt-12 bg-secondary text-white py-4 rounded-xl font-bold hover:bg-secondary/90 transition-all text-center">
                    {langText("Register as Owner", "मालक म्हणून नोंदणी करा")}
                  </Link>
                </div>
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Kisan Kamai */}
        <section className="py-24 bg-white dark:bg-emerald-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="rounded-[2.5rem] shadow-2xl relative z-10" alt="Indian farmer leaning against a tractor with pride" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDMzHO4Tio64idkoL0ZhBW4GvohrJcmuRJCPFHeWT6wxM2_KVHId_NBo0DHKJM8PxSmFyXlHJBlcJwSjZchgLdd-6BxesLYZnNmrNZJ8NLI93-sTXyoXsvYSod3MGM1MhU2Usr2TsJqydD_3Nf6y6Jk0NYDrkz2WVghU246PzwWaTi7EsKozZxUX7ggp_K3IJtMO11dpGUvRepRw6IpHK6CkgEsPBDjRvS17-UvYp-Rf0dChWpKPMJQuBozFE573rHuG-JAL-RG0fA" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full -z-0"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full -z-0"></div>
                <div className="absolute top-1/2 -right-8 bg-white dark:bg-emerald-900 p-6 rounded-2xl shadow-xl z-20 max-w-[200px] border border-slate-50 dark:border-emerald-800/50">
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                  <p className="text-xs font-bold text-primary mb-1">&quot;Best rental service in Kolhapur district.&quot;</p>
                  <p className="text-[10px] text-slate-400 font-label">Amit Patil, Sugarcane Farmer</p>
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-8 tracking-tight leading-tight">
                  {langText("Rooted in Trust,", "विश्वासात रुजलेले,")}<br />{langText("Driven by Technology.", "तंत्रज्ञानाने चालित.")}
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-primary-container dark:text-emerald-400 flex-shrink-0">
                      <span className="material-symbols-outlined">verified_user</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 dark:text-white">{langText("Vetted Equipment Owners", "सत्यापित उपकरण मालक")}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{langText("Every owner on our platform undergoes a rigorous verification process to ensure reliability and safety.", "आमच्या व्यासपीठावरील प्रत्येक मालक विश्वासार्हता आणि सुरक्षितता सुनिश्चित करण्यासाठी कठोर पडताळणी प्रक्रियेतून जातो.")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-primary-container dark:text-emerald-400 flex-shrink-0">
                      <span className="material-symbols-outlined">support_agent</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 dark:text-white">{langText("24/7 Local Support", "24/7 स्थानिक सपोर्ट")}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{langText("Our team is available round the clock to help with booking issues or equipment technicalities.", "आमची टीम बुकिंग समस्या किंवा उपकरण तांत्रिक बाबींमध्ये मदत करण्यासाठी सदैव उपलब्ध आहे.")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-primary-container dark:text-emerald-400 flex-shrink-0">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 dark:text-white">{langText("Fair Pricing Promise", "न्याय्य किंमत आश्वासन")}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{langText("Transparent rates with no hidden costs. We ensure fair value for both renters and equipment owners.", "कोणत्याही लपणार्या खर्चाशिवाय पारदर्शक दर. आम्ही भाडेकरू आणि उपकरण मालक दोघांसाठी वाजवी किंमत सुनिश्चित करतो.")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Area Map */}
        <section className="py-24 bg-surface-container-low dark:bg-emerald-950/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-4">
                <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-6 tracking-tight">{langText("Expanding Across Western Maharashtra", "पश्चिम महाराष्ट्र्यात विस्तार होत आहे")}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">{langText("We are currently focused on providing the best service within these three core districts, ensuring fast delivery and local support.", "आम्ही सध्या या तीन मुख्य जिल्ह्यांमध्ये सर्वोत्तम सेवा प्रदान करण्यावर लक्ष केंद्रित आहोत.")}</p>
                <ul className="space-y-4">
                  {[langText("Sangli District", "सांगली जिल्हा"), langText("Satara District", "सातारा जिल्हा"), langText("Kolhapur District", "कोल्हापूर जिल्हा")].map((d) => (
                    <li key={d} className="flex items-center gap-3 font-bold text-lg text-primary dark:text-emerald-50">
                      <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs">✓</span> {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-12 p-6 bg-white dark:bg-emerald-900/20 rounded-2xl shadow-sm border border-slate-100 dark:border-emerald-800/50">
                  <p className="text-sm font-label text-slate-500 dark:text-slate-400 mb-2">{langText("Are you from another district?", "तुम्ही दुसऱ्या जिल्ह्यातून आहात?")}</p>
                  <a className="text-secondary dark:text-amber-400 font-bold underline underline-offset-4" href="#">{langText("Notify me when you launch nearby", "जवळ लॉन्च होईल तेव्हा मला कळवा")}</a>
                </div>
              </div>
              <div className="md:col-span-8">
                <div className="bg-white dark:bg-emerald-900/20 p-4 rounded-[2rem] shadow-xl border border-white dark:border-emerald-800/50">
                  <div className="w-full h-[500px] rounded-[1.5rem] overflow-hidden">
                    <MapComponent
                      center={[16.85, 74.27]}
                      zoom={9}
                      markers={homepageMarkers}
                      height="100%"
                      showControls={true}
                      className="rounded-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Farmer Stories */}
        <section className="py-24 bg-white dark:bg-emerald-950">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black text-primary dark:text-emerald-50 text-center mb-16 tracking-tight">{langText("Rooted Success Stories", "यशस्वी शेतकरी कथा")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-surface-container-low dark:bg-emerald-900/20 p-8 rounded-3xl border border-slate-100 dark:border-emerald-800/50">
                <div className="flex gap-1 text-amber-500 mb-6">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-8 italic leading-relaxed">&quot;Renting a harvester through Kisan Kamai saved me 4 days of labor costs during the last peak season. The process was seamless.&quot;</p>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-12 h-12 rounded-full object-cover" alt="Rajesh Deshmukh" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBECQPldXwQfgHLF5Bff3yr6CBOMqRm2HEbEw0Pv5jwQ5npz5TvXhDFr6UquZg6hSkf7qG-DXCPLXxQ07Skxj8AMimnuORjPBtKW2y9aS-EzXty8rGctvza0VjhaJ5SdyZ2bbY3xD_z9jFq93Y6jcA-mgWcMp4ehtbWKsRYi1XTIYkIuVRjUoRPw-N1wVQclG4B3zh_MToBMPpq9za_nGVXbDG_6599TyG8bOmobskoTJHgvsZR3B-zwOfZd5jXG8tBOdlfW9FiFCc_" />
                  <div>
                    <h5 className="font-bold text-primary dark:text-emerald-50">Rajesh Deshmukh</h5>
                    <p className="text-xs font-label text-slate-400">Sangli District</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-low dark:bg-emerald-900/20 p-8 rounded-3xl border border-slate-100 dark:border-emerald-800/50">
                <div className="flex gap-1 text-amber-500 mb-6">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-8 italic leading-relaxed">&quot;As a tractor owner, I was worried about utilization. Kisan Kamai helped me find local farmers who needed my equipment exactly when it was idle.&quot;</p>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-12 h-12 rounded-full object-cover" alt="Sanjay Kulkarni" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeYUy0W6eRy965-Z4qGpnFDcDUxYXNdsInKsHc1CsNfvydqHWJIJtG7PYMgJatPXtl_90047dgJyHHh6mzISoeD1rFr09_xXwyrcRPoEAdhqTcVfxRRJ8xiwuAqXsSrR3YdmtwxWPm_qn-e8Z-4TEdR1iWPD8LpCtbY7UQ7-1oNHL6xKiaDviqU_1LN_vQPFJtCkaOMGwqfN6QmhfW-wkC9zHl1dFbZsbMK21FBTUz69cNb1evA_9bYIA3pC9v8QmL_9wH9ygqNBsu" />
                  <div>
                    <h5 className="font-bold text-primary dark:text-emerald-50">Sanjay Kulkarni</h5>
                    <p className="text-xs font-label text-slate-400">Satara District</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-low dark:bg-emerald-900/20 p-8 rounded-3xl border border-slate-100 dark:border-emerald-800/50">
                <div className="flex gap-1 text-amber-500 mb-6">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-8 italic leading-relaxed">&quot;The verification process for equipment is what makes me trust this platform. I know I&apos;m getting high-quality machinery every time.&quot;</p>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-12 h-12 rounded-full object-cover" alt="Vikas More" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdU-7cynwqVi0SfINCsm0g4VhZFfVTxlwL7LFVWZFyeU_D5njgt9z60E80g6aOwdupTyTbFJkfwr1Mf_YaXGQ9c4Pcp-_tebRONcHti4XRui5PI0GZgkiNqCzgoGbneLR4J_sE-8l-J52g6xpPNCkYxUKnpl3jah87qoBDAL-wiSNH0vhWTgc_UGaKERzyRV2RDBSZyT53tL-0T_9qhFIUo_xBQ15VculnMzh73K8OVXS6iR7IgiuHLYF0ZDl4nem0CfLjjHKNBfRc" />
                  <div>
                    <h5 className="font-bold text-primary dark:text-emerald-50">Vikas More</h5>
                    <p className="text-xs font-label text-slate-400">Kolhapur District</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-surface-container-low dark:bg-emerald-950/50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-black text-primary dark:text-emerald-50 text-center mb-16 tracking-tight">{langText("Frequently Asked Questions", "वारंवार विचारले जाणारे प्रश्न")}</h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-emerald-900/20 rounded-2xl shadow-sm border border-slate-100 dark:border-emerald-800/50 p-6 cursor-pointer group">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-primary dark:text-emerald-50">How do I verify the condition of the equipment?</h4>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add</span>
                </div>
                <p className="mt-4 text-slate-600 dark:text-slate-400 hidden group-hover:block">All equipment listed undergoes a preliminary verification. We also encourage renters to inspect the machinery upon delivery before signing off on the rental period.</p>
              </div>
              <div className="bg-white dark:bg-emerald-900/20 rounded-2xl shadow-sm border border-slate-100 dark:border-emerald-800/50 p-6 cursor-pointer group">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-primary dark:text-emerald-50">What happens if the equipment breaks down during work?</h4>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add</span>
                </div>
              </div>
              <div className="bg-white dark:bg-emerald-900/20 rounded-2xl shadow-sm border border-slate-100 dark:border-emerald-800/50 p-6 cursor-pointer group">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-primary dark:text-emerald-50">Are there any hidden service charges?</h4>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add</span>
                </div>
              </div>
              <div className="bg-white dark:bg-emerald-900/20 rounded-2xl shadow-sm border border-slate-100 dark:border-emerald-800/50 p-6 cursor-pointer group">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-primary dark:text-emerald-50">How can I pay for my rental?</h4>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-full h-full object-cover opacity-20 grayscale" alt="Tractors parked in a rural equipment yard at dusk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzruxyY8zMMkzC_4EGzGBHlnuqZcz-3msOCewvl5pkEJasNFAsLSWTRb2MlAaBpZrewD8EjbwB20KHw7NegfKhVvOzUAHZeH89O3YaUDELSr4vnmxchfMWt7UGR_xN5KV7GnI8rJxP7YyJ1DglyD3cqLmRYXIMfn5kO5Vlguzjmz54j9mQvGroDs0Tc6ey4V1cy5nfKTRB6JCp8zWcbV9BHfDnNVyJ7oVNOXvFjZljfLCXvulUs7G4p-080mK4lGYPdg6kT2DR0_e4" />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl font-black mb-8 leading-tight">{langText("Ready to Transform Your Farming Journey?", "तुमच्या शेतीचा प्रवास बदलायला तयार आहात?")}</h2>
            <p className="text-xl text-white/70 mb-12">{langText("Join thousands of farmers in Western Maharashtra using Kisan Kamai to access world-class machinery today.", "आज जागतिक दर्जाची यंत्रसामग्री मिळवण्यासाठी किसान कमाई वापरणाऱ्या पश्चिम महाराष्ट्रातील हजारो शेतकऱ्यांमध्ये सामील व्हा.")}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/rent-equipment" className="bg-secondary text-white px-10 py-5 rounded-xl text-lg font-black hover:bg-secondary/90 shadow-xl transition-all text-center">
                {langText("Browse Equipment", "उपकरणे शोधा")}
              </Link>
              <Link href="/list-equipment" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-xl text-lg font-black hover:bg-white/20 transition-all text-center">
                {langText("Register Your Fleet", "तुमची यंत्रसामग्री नोंदणी करा")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
