"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function EquipmentDetailPage() {
  const { langText } = useLanguage();
  return (
    <main className="bg-surface dark:bg-[#0f1a14] min-h-screen">
      <Header />
      <div className="pt-24 pb-12 px-4 md:px-8 max-w-screen-2xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 mb-6 text-sm font-label text-outline dark:text-slate-400">
          <Link className="hover:text-primary dark:hover:text-emerald-400 transition-colors" href="/">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link className="hover:text-primary dark:hover:text-emerald-400 transition-colors" href="/rent-equipment">Rent</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface dark:text-white font-semibold">John Deere 5310 Performer</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Gallery & Details (8 Columns) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Gallery */}
            <section className="space-y-4">
              <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-surface-variant dark:bg-emerald-900/30 relative group">
                <img
                  className="w-full h-full object-cover"
                  alt="Modern John Deere tractor in Indian sugarcane field at sunrise"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSyY2H9kmQ5H_MJHOrceuJUebS7Ji01L0-gQwyB68e-c7XWXXfhkzYDyyWBZYBrMRAg1sexAjcmLl4rsCV8RP3knzPrAAOJ73B9al5H57K4KHMjynhj35aIj2UbXmoF1iZdm0AVkLKJNcSWXWFEtcL1e8sCEW0jgL6XVBESQHx7djz0eaOUHCale4bGXMqTqDgctAQZVD75FZtMTGXQbFmD4gJwPlglP6t4xN6YA4q4_wm1VPpSmoCvsG9LNyEty-MjtgEq-pSdkbf"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <span className="text-white font-headline font-medium">Main Field View - Sangli, Maharashtra</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant dark:bg-emerald-900/30">
                  <img className="w-full h-full object-cover" alt="Tractor engine close-up" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh9eiUT5qY0JurzZdIslVNqF7pZNYO1y6LAaS8RSxom-FogcaqyPRMDnW_493lmSmyl7iic7hWm1CCC2dsfXxLHqbo2XV25KP6hqSErCCSmp5ctrTUQE8MuIyejzg5rUsE9xVMm5GDcmQdpF5_Se_lsQn4zgd6loLqGeITe2o3tfmFetq9rME5454MmIiUYDmUtYhXbepoHmYtnSPjP-mxKWnWgNvik-F8yu5BMIAeJMjtYGC_y-P4CKI87wSqu-3c2rL6JLp00VQ4" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant dark:bg-emerald-900/30">
                  <img className="w-full h-full object-cover" alt="Dashboard controls" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJUayHc4m8eHQkQSlfUK-R5jvF0g5GtZfHm6Ya9vR5eq0ndLOT8pUFBV9oN8VAY2VQukqBtZVxPl70x0bq2WEj-xKWzEn6WV8D2oUu2wcP7YgdFgNRFRpM96aMZeKWonakgA2jVZHG2etfijeH4KGAwIzYzPCNL0WdHBy7hVwB7DOeSmyQ5hn5gWV_-G9YroXHNEkKCelFqHq59OIVR_3A46U4hRAast-iHSAVTlNu6C2ANbset1-ZfRNc66dpHOA7WDrs2dQvt_g6" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant dark:bg-emerald-900/30">
                  <img className="w-full h-full object-cover" alt="Rear view with rotavator" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXl4OftQjfNzN_r4M-_69LZ8nlx8tLuvc0JnRfU_q-I2u-jVTez_jgxihOCs4fcinOX5VuMj_GEBDFkirhWvRentCkYNUBzTvO1d2lVN8K3mBO7EPst1O6YcrB-CfUFt5MJd4gReaoZMezfvqLijoUaiDd61dR69AI-qXWqUI30B2pIzk2wUH3D5pcztdT7VBRyMRjDew0EUemZWAPXIAKA6R0pC5pTVoa8JKdpt9z1E0t1QJcIMII6gGsNYRqAf8_2ziCBOXl55Yx" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-variant dark:bg-emerald-900/30 relative flex items-center justify-center cursor-pointer group">
                  <div className="absolute inset-0 bg-primary-container/80 backdrop-blur-sm group-hover:bg-primary-container transition-colors" />
                  <div className="relative text-on-primary text-center">
                    <span className="material-symbols-outlined text-3xl mb-1">gallery_thumbnail</span>
                    <p className="text-xs font-bold uppercase tracking-widest">+12 Photos</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Product Intro Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant dark:border-emerald-800/50">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">Premium Listing</span>
                  <span className="flex items-center gap-1 text-on-tertiary-container font-label font-bold text-sm">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    4.9 (42 Bookings)
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-primary dark:text-emerald-50 leading-tight">{langText("John Deere 5310 Performer", "John Deere 5310 Performer")}</h1>
                <p className="text-lg text-on-surface-variant dark:text-slate-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  Kavathe Mahankal, Sangli District
                </p>
                <p className="text-sm text-secondary font-bold font-mukta">कवठे महांकाळ, सांगली जिल्हा</p>
              </div>
              <div className="bg-surface-container dark:bg-emerald-900/30 p-6 rounded-3xl border border-outline-variant/30 dark:border-emerald-800/50 card-shadow">
                <p className="text-sm font-label text-outline dark:text-slate-400 mb-1">{langText("Rental Starting at", "भाडे सुरू")}</p>
                <p className="text-3xl font-headline font-black text-primary dark:text-emerald-50">₹850 <span className="text-sm font-medium text-on-surface-variant dark:text-slate-400">/ {langText("hour", "तास")}</span></p>
              </div>
            </section>

            {/* Tech Specs */}
            <section className="space-y-6">
              <h2 className="text-2xl font-headline font-bold text-primary dark:text-emerald-50">{langText("Technical Specifications", "तांत्रिक वैशिष्ट्ये")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: "settings_input_component", label: "Engine Power", labelMr: "इंजिन पॉवर", value: "55 HP Category" },
                  { icon: "speed", label: "PTO Power", labelMr: "PTO पॉवर", value: "46.7 HP" },
                  { icon: "oil_barrel", label: "Fuel Capacity", labelMr: "इंधन क्षमता", value: "68 Liters" },
                  { icon: "weight", label: "Lift Capacity", labelMr: "उचलण्याची क्षमता", value: "2000 kgf" },
                ].map((spec) => (
                  <div key={spec.label} className="bg-white dark:bg-emerald-900/20 p-5 rounded-2xl border border-outline-variant/50 dark:border-emerald-800/50 card-shadow hover:card-shadow-lg transition-shadow">
                    <span className="material-symbols-outlined text-secondary mb-3">{spec.icon}</span>
                    <p className="text-xs font-label text-outline dark:text-slate-500 uppercase tracking-wider mb-1">{spec.label}</p>
                    <p className="font-headline font-bold text-on-surface dark:text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features & Owner */}
            <section className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-headline font-bold text-primary dark:text-emerald-50">{langText("Features & Inclusions", "वैशिष्ट्ये आणि समावेश")}</h2>
                <ul className="space-y-4">
                  {[
                    { title: "Verified Professional Operator", titleMr: "प्रमाणित व्यावसायिक ऑपरेटर", desc: "Includes a skilled operator with 5+ years experience." },
                    { title: "Regular Maintenance Log", titleMr: "नियमित देखभाल", desc: "Last serviced 15 days ago. Zero downtime guaranteed." },
                    { title: "Fuel Management", titleMr: "इंधन व्यवस्थापन", desc: "Standard pricing excluding fuel. Diesel provided by farmer." },
                  ].map((feature) => (
                    <li key={feature.title} className="flex items-start gap-4">
                      <div className="bg-primary-fixed dark:bg-emerald-800/50 p-1.5 rounded-full mt-0.5">
                        <span className="material-symbols-outlined text-primary dark:text-emerald-400 text-sm">check</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface dark:text-white">{feature.title}</p>
                        <p className="text-sm text-on-surface-variant dark:text-slate-400">{feature.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-headline font-bold text-primary dark:text-emerald-50">{langText("Owner Details", "मालक माहिती")}</h2>
                <div className="bg-surface-container-low dark:bg-emerald-900/20 p-6 rounded-3xl flex items-center gap-5 border border-outline-variant/20 dark:border-emerald-800/50 card-shadow">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-emerald-800 shadow-lg">
                    <img className="w-full h-full object-cover" alt="Owner Sanjay Patil" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx8BPkFHHBamaE-An0NzPhipkcRgYV4yxQwFlNhqIFtfQgtcYBE32I6H3zqvoMXVq98g6KnWjw_hznamk3yYw2EeQ2oYAHGvcZtqGPC-Ax0quwp2DaHiOKLFaXrT_kkZrJcnFMmVoHCNNOeJOeKtZXk1m8wkTS-F2XIbJPZz9ZsMV8gvq76TcK1ZaXxkQq7NFMG0TbSeOv2gv9lwNU4QAIHmx7Mton5nRBIInSJRHMJ9QwLIU9KirhwYAhU8bCt40CZj4ompQ4nZNp" />
                  </div>
                  <div>
                    <p className="text-xs font-label text-outline dark:text-slate-500 uppercase tracking-widest">Listing Owner</p>
                    <p className="font-headline font-extrabold text-primary dark:text-emerald-50 text-xl">Sanjay Patil</p>
                    <p className="text-sm text-on-surface-variant dark:text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-primary dark:text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Identity Verified Member
                    </p>
                  </div>
                </div>
                <button className="w-full bg-white dark:bg-emerald-900/30 border border-primary dark:border-emerald-600 text-primary dark:text-emerald-400 px-4 py-3 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-fixed dark:hover:bg-emerald-900/50 transition-colors">
                  <span className="material-symbols-outlined">chat_bubble</span>
                  Chat with Sanjay
                </button>
              </div>
            </section>
          </div>

          {/* Right: Inquiry Form & Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-emerald-900/20 rounded-3xl card-shadow-xl border border-emerald-100 dark:border-emerald-800/50 p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-extrabold text-primary dark:text-emerald-50">{langText("Reserve this Equipment", "हे उपकरण आरक्षित करा")}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400">{langText("Check availability and get a precise quote for your field.", "उपलब्धता तपासा आणि तुमच्या शेतासाठी अचूक कोटेशन मिळवा.")}</p>
                  <p className="text-xs font-mukta text-secondary font-bold">उपलब्धता तपासा आणि अचूक कोटेशन मिळवा.</p>
                </div>
                <form className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-label font-bold text-outline dark:text-slate-400 uppercase tracking-wider">Field Location</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-outline dark:text-slate-500 text-lg">location_on</span>
                      <input className="w-full pl-10 pr-4 py-3 bg-surface-container dark:bg-emerald-950/50 rounded-xl border-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 text-sm font-label text-on-surface dark:text-white" placeholder="Village / Taluka name" type="text" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-label font-bold text-outline dark:text-slate-400 uppercase tracking-wider">Work Type</label>
                      <select className="w-full px-4 py-3 bg-surface-container dark:bg-emerald-950/50 rounded-xl border-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 text-sm font-label text-on-surface dark:text-white">
                        <option>Plowing</option>
                        <option>Sowing</option>
                        <option>Transport</option>
                        <option>Harrowing</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-label font-bold text-outline dark:text-slate-400 uppercase tracking-wider">Approx Hours</label>
                      <input className="w-full px-4 py-3 bg-surface-container dark:bg-emerald-950/50 rounded-xl border-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 text-sm font-label text-on-surface dark:text-white" placeholder="8" type="number" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-label font-bold text-outline dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-outline dark:text-slate-500 text-lg">call</span>
                      <input className="w-full pl-10 pr-4 py-3 bg-surface-container dark:bg-emerald-950/50 rounded-xl border-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 text-sm font-label text-on-surface dark:text-white" placeholder="+91 00000 00000" type="tel" />
                    </div>
                  </div>
                  <button type="button" className="w-full bg-secondary text-on-secondary font-headline font-black py-4 rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    {langText("Request Booking Callback", "बुकिंग कॉलबॅक विनंती")}
                  </button>
                </form>
                <div className="flex items-center gap-3 p-4 bg-tertiary-fixed dark:bg-amber-900/20 rounded-2xl">
                  <span className="material-symbols-outlined text-on-tertiary-fixed-variant dark:text-amber-400">verified_user</span>
                  <p className="text-xs font-label text-on-tertiary-fixed dark:text-amber-200 leading-tight">Your booking is protected by <span className="font-bold">Kisan Kamai Guarantee</span>. Payment is only released after work completion.</p>
                </div>
              </div>

              {/* Map preview */}
              <div className="rounded-3xl overflow-hidden relative h-48 border border-outline-variant dark:border-emerald-800/50">
                <MapComponent
                  center={[16.86, 74.57]}
                  zoom={13}
                  markers={[{ lat: 16.86, lng: 74.57, label: langText("Equipment Location", "उपकरण स्थान"), sublabel: langText("Owner is within 15km", "मालक 15 किमी आत"), color: "#693c00" }]}
                  height="100%"
                  showControls={false}
                  className="rounded-none"
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Related Equipment */}
        <section className="mt-20 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-headline font-extrabold text-primary dark:text-emerald-50">{langText("Similar in Sangli Region", "सांगली परिसरातील समान")}</h2>
              <p className="text-on-surface-variant dark:text-slate-400">{langText("Recommended equipment based on your area and crop season.", "तुमच्या क्षेत्र आणि पीक हंगामावर आधारित शिफारस केलेली उपकरणे.")}</p>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8">
            {[
              { name: "Mahindra 575 DI", location: "Tasgaon, Sangli", hp: "45 HP", price: "₹750/hr", rating: "4.7", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8aPstg-9kV4PXknfBO-qOSkcyG7JAfRa3VhAam-Tpe4-Nf1DddIgB64mI66T79HrpdTgJwexYkRVqGCvP1A4z0nySQvwXfRxwpB5gaWL6EnppfR9l37aIPGHHdZR7YSOaSC0biV2jDSDZPuM8LiHOjPgruIl0V_IdifjgzkwW0lihQuDy2lKqmxNEh-a-_FRJHHoy18rZxgHo3rTE8MvZl0uFof2VdUVsEAq9PMhmC9ZBRuNQ3xL5ZBBDxaRk2LmzVig274QdYdbP" },
              { name: "Kubota MU5502", location: "Miraj, Sangli", hp: "50 HP", price: "₹600/hr", rating: "4.8", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzYbHMyx64YcSJD0yFY3h2oo9_8cVrZPGi3P7J8ektor0C-s3Yj3Kw6eMc7OkLtjvtX4rKhT39UJK7nGlccT0wJ2EDOx2fkrwot38DJOj6yOMYbRdr3-l6Pm77aeerwr1e42aF8qb3EeFe9R8QbmNjflFTdFclaWL5lb5YA9w3IsHlN8hsMV-auKKZYq0tVIJssocFFNeeuXM8IGYsRJMTm3POSOKFaAHLBRciptDoVVpDj7hu6FJ57sRwiwp6tWduSH_JUhO9NZ7b" },
              { name: "Swaraj 855 FE", location: "Vita, Sangli", hp: "55 HP", price: "₹800/hr", rating: "4.9", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ8KKP9IQY6iTtx_mDUut7Zwgt7dulqWr4f78pfv_Mz3YyOpjsfX_VphS6KACpflaIrGIRarva1w5pPlKs_4VUgU2qVCFcTvg9SYSr9F3FIpI0js07bOjcZd-v-H3yn077dTU2kT9qyvpkkfmUyCeEYeEG_WEMcT8oLTZas2fYmpMdyH-UomWZ-hB6d1R7KTi-NO_-6p76avaQrsizhcKjwzFYiz87Lw0u4Fo6aEDZD2VEb2gsQ_7O5JBWt73xgQYAqynwQPkIinfp" },
            ].map((eq) => (
              <Link key={eq.name} href="/equipment/1" className="min-w-[320px] bg-white dark:bg-emerald-900/20 rounded-3xl border border-outline-variant/30 dark:border-emerald-800/50 overflow-hidden group card-shadow hover:card-shadow-lg transition-all">
                <div className="h-48 overflow-hidden relative">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={eq.name} src={eq.img} />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary dark:text-emerald-50">{eq.price}</div>
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-headline font-bold text-lg group-hover:text-secondary transition-colors text-on-surface dark:text-white">{eq.name}</h4>
                  <p className="text-sm text-outline dark:text-slate-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>{eq.location}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 dark:border-emerald-800/50">
                    <span className="text-xs font-label bg-surface-container dark:bg-emerald-900/40 px-2 py-1 rounded text-on-surface dark:text-slate-300">{eq.hp}</span>
                    <span className="text-xs font-label font-bold text-on-tertiary-container dark:text-amber-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {eq.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
