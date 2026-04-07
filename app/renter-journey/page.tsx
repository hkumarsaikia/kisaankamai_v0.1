"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

export default function RenterJourneyPage() {
  const { langText } = useLanguage();

  return (
    <main className="bg-background dark:bg-[#0f1a14] min-h-screen pt-32 pb-24 text-on-surface">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-20">
        
        {/* Journey Map Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed dark:bg-emerald-900 dark:text-emerald-300 text-sm font-bold tracking-widest uppercase mb-4">
            {langText("Discovery Flow", "डिस्कव्हरी फ्लो")}
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-primary dark:text-emerald-50 tracking-tight mb-6 leading-tight">
            {langText("The Renter's Journey", "भाडेकरूचा प्रवास")}
          </h1>
          <p className="max-w-2xl mx-auto text-on-surface-variant dark:text-slate-400 text-lg">
            {langText(
              "A cinematic walkthrough of how farmers discover, choose, and book premium agricultural equipment on Kisan Kamai.",
              "शेतकरी कशाप्रकारे प्रीमियम कृषी उपकरणे शोधतात, निवडतात आणि बुक करतात याचे प्रात्यक्षिक."
            )}
          </p>
        </div>

        {/* Visual Flow Connector (Desktop) */}
        <div className="relative">
          <div className="hidden xl:block absolute top-1/2 left-0 w-full h-px border-t-2 border-dashed border-emerald-900/20 dark:border-emerald-500/20 opacity-50 -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 xl:grid-cols-6 gap-12 relative z-10">
            {/* Step 1: Home */}
            <div className="xl:col-span-1 group">
              <div className="relative mb-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-surface-variant dark:border-emerald-800 group-hover:border-primary-container dark:group-hover:border-emerald-400 transition-colors duration-500">
                  <img className="w-full h-full object-cover" alt="Home" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTuNDLmOL-OKGKaMB3dozyTNgObXzlEjh7ZUMFw_sjP_fWHLSxvovTx14ozKhGfw1rH5rVCNs8QSkSDgA84sRkA224iihoCr8eOmhHoMH38TBLeXMFBLtect1yCoUDPpCebeIHJqtVazrSXXI6gknpO0PNNAhiYUSt1lU-Bb90PgUSWB-cqSrc29unqLDOSCBBzNn_9xo_FByFbwM_J8Yq-FIfjnRAKS9Ghgr0pt1p2vUGwcXzRDxvQz3JLriMaWcmPmdybnn5V_b4" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Step 01</p>
                    <p className="text-lg font-bold">{langText("Home", "मुख्यपृष्ठ")}</p>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-emerald-600 text-white shadow-lg z-20">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {langText("Farmer arrives at the landing page, greeting them in English or Marathi with high-trust visuals.", "शेतकरी मुख्य पानावर येतो, जिथे इंग्रजी किंवा मराठीमध्ये त्यांचे स्वागत केले जाते.")}
              </p>
            </div>

            {/* Step 2: Rent Equipment */}
            <div className="xl:col-span-1 group">
              <div className="relative mb-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-surface-variant dark:border-emerald-800 group-hover:border-primary-container dark:group-hover:border-emerald-400 transition-colors duration-500">
                  <img className="w-full h-full object-cover" alt="Rent Equipment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ2h2wuahxUN_si41VChBhAxKTSOK4RivgKB3lLoqClk_HQJGmY66KPe1r1MXjcl5J8g5q-kNElLqEWMMqDD-USw3BSby7_ZYYPc2gaZrA4-Yz7ul7L19V8LiNhm75tq6IsSO5ucm2OWAXf8JSNiTxvyqz2MjTHtsxkOOpUxQXnmJvtwe_YGt5s-0juuFPZhv1rGAgFnfwyOzW23EHMaK0WgPTzlNmC0BtJIZcMxXsVNoiMMI9ZqIq2yhm2x49pCRgQXdBHPWBDmfZ" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Step 02</p>
                    <p className="text-lg font-bold">{langText("Rent", "भाड्याने घ्या")}</p>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-emerald-600 text-white shadow-lg z-20">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {langText("Direct entry into the renting ecosystem, choosing location and equipment categories.", "भाड्याच्या इकोसिस्टममध्ये थेट प्रवेश, स्थान आणि उपकरणे निवडणे.")}
              </p>
            </div>

            {/* Step 3: Browse */}
            <div className="xl:col-span-1 group">
              <div className="relative mb-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-surface-variant dark:border-emerald-800 group-hover:border-primary-container dark:group-hover:border-emerald-400 transition-colors duration-500">
                  <img className="w-full h-full object-cover" alt="Browse" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDffvwuy-mpD9oyjT-1SkvN48hIHCduf2YMCPOHOLR5SYxM8t9ZGhc2htpc7u_deehA0o_sUdOW3e7R9lnf1mx3t6geZxyKo6uEjPyYy-Ji2iXHEkFCRf3IUBWGPrPXrcT4jTsxoBeDF9eu7UyV5FxsCxGof3fK1_2cSvNSAIsEd4ykMe1F73DgHOQLH0h0ohFITvi2o98VxM8D5WvuttUUSbWfHJ5lrPbXgde9cFDYal6JJN0cJKjaMwzhgtgE2DBPbp1HAq93WSfV" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Step 03</p>
                    <p className="text-lg font-bold">{langText("Browse", "शोधा")}</p>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-emerald-600 text-white shadow-lg z-20">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {langText("Filtering by proximity, price, and equipment power. Seeing real-world availability.", "जवळपास, किंमत आणि हवीतर्फे फिल्टर करणे. वास्तविक उपलब्धता पाहणे.")}
              </p>
            </div>

            {/* Step 4: Details */}
            <div className="xl:col-span-1 group">
              <div className="relative mb-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-surface-variant dark:border-emerald-800 group-hover:border-primary-container dark:group-hover:border-emerald-400 transition-colors duration-500">
                  <img className="w-full h-full object-cover" alt="Details" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArQS4Sxe9bro7wD6ErKQkRbsgSN5evUZkXrd3gcPdSSSXlPu7NsRML_mtnZGbb8uDKgpMf_SCC-eY0ungAQ8j-Qre50Y349YTLdxQYGmk31OIwzmDa1ThIVJIFFlNbtNiUK4aIUhLVRU1wyN5vvtzyfv8vNyQOL-4qW5q5c4yfODt3MKx-VE7ROoM5_YeILtu-Bv-7qzx5mIeHyJXzfhMSpLAn65VFRCdSMnX9uwAI9vmsEdrCxV3JHORv-4ixJepYxCBpJ-cOgT2e" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Step 04</p>
                    <p className="text-lg font-bold">{langText("Details", "तपशील")}</p>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-emerald-600 text-white shadow-lg z-20">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {langText("Deep dive into specifications, operator status, and clear rental terms.", "स्पष्टीकरणे, ऑपरेटर स्थिती आणि स्पष्ट भाडे अटींवर सखोल माहिती.")}
              </p>
            </div>

            {/* Step 5: Booking */}
            <div className="xl:col-span-1 group">
              <div className="relative mb-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-surface-variant dark:border-emerald-800 group-hover:border-primary-container dark:group-hover:border-emerald-400 transition-colors duration-500">
                  <img className="w-full h-full object-cover" alt="Booking" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSN9cdW9Wb2t_X0c-wxCh3D7ueulzds8bxArtQqHMraQF56toaLjwrCjwbI0_Q38DmZny2H9e3ckNA1VEzgCjGMPXlId4fFs9sRllNgfNHpMQ9h3MAI2zq16Z0h0XPvwIdcii-5VKGwfTpclbR_OGOaJ9DOM2dq93XulIT7bdAo-KQggu2UvR_7H3P9cCe1R40zdjS08mui1roAcDTax8FhLjp0KCP8uniHOJzIwhC-CvIMcpkFUPW0bEjmwHmxoLCukQtskKEAEIP" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Step 05</p>
                    <p className="text-lg font-bold">{langText("Booking", "बुकिंग")}</p>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-emerald-600 text-white shadow-lg z-20">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {langText("Selecting dates and confirming the service location for the owner's log.", "तारखा निवडणे आणि मालकाच्या नोंदीसाठी सेवा स्थानाची पुष्टी करणे.")}
              </p>
            </div>

            {/* Step 6: Success */}
            <div className="xl:col-span-1 group">
              <div className="relative mb-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-surface-variant dark:border-emerald-800 group-hover:border-primary-container dark:group-hover:border-emerald-400 transition-colors duration-500">
                  <img className="w-full h-full object-cover" alt="Success" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApSQG-UEKOa-m5Y3MRYffOda1mcyMpq0iOMspsoGgf-qamd59mTHkN34yActuhKiEGupFC1bqOu1KqoNvBHVTy42pkmwln0yXnaGixqu_WEIfLFVn22jBPDtsZ_XgaYaTsbPuIrMp49pLPCcRsD-yyQvKo3gFCxXEtZaSrap1XwCGf-LoqF1nC7AqMnlXhnu3D3WXg70cguppaQvK8JCBr1XRxT-THmmiwyM1eB1gU7BcOyX4N1IyBb94MSXfVNRP86NEsv1Tx6iOh" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Step 06</p>
                    <p className="text-lg font-bold">{langText("Success", "यश")}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {langText("Booking request received. Support agent coordinates the owner/operator dispatch.", "बुकिंग विनंती प्राप्त झाली. सपोर्ट एजंट मालक/ऑपरेटरच्या प्रेषणासाठी समन्वय साधतो.")}
              </p>
            </div>
          </div>
        </div>

        {/* Featured Renter UX Principles */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[2rem] bg-white dark:bg-emerald-900/20 border border-surface-variant dark:border-emerald-800 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed dark:bg-emerald-800 flex items-center justify-center text-primary-container dark:text-emerald-300 mb-6">
              <span className="material-symbols-outlined">explore</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary dark:text-emerald-50">{langText("Contextual Discovery", "संदर्भित शोध")}</h3>
            <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">
              {langText("The search adjusts based on current season and local farming cycles to show relevant equipment first.", "सर्च सध्याच्या हंगामावर आणि स्थानिक शेतीच्या चक्रावर आधारित समायोजित करते जेणेकरून संबंधित उपकरणे प्रथम दिसतील.")}
            </p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white dark:bg-emerald-900/20 border border-surface-variant dark:border-emerald-800 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-secondary-fixed dark:bg-amber-900/50 flex items-center justify-center text-on-secondary-fixed dark:text-amber-400 mb-6">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary dark:text-emerald-50">{langText("High-Trust Details", "उच्च-विश्वासाची माहिती")}</h3>
            <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">
              {langText("Every listing features verified photographs, transparent per-hour pricing, and maintenance history.", "प्रत्येक सूचीमध्ये सत्यापित छायाचित्रे, पारदर्शक प्रति-तास किंमत आणि देखभालीचा इतिहास असतो.")}
            </p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white dark:bg-emerald-900/20 border border-surface-variant dark:border-emerald-800 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed dark:bg-emerald-900/50 flex items-center justify-center text-on-tertiary-fixed dark:text-emerald-400 mb-6">
              <span className="material-symbols-outlined">support_agent</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary dark:text-emerald-50">{langText("Assisted Booking", "सहाय्यक बुकिंग")}</h3>
            <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">
              {langText("A dedicated Kisan Kamai advisor oversees every booking to ensure smooth coordination between parties.", "एक समर्पित किसान कमाई सल्लागार दोन्ही बाजूंमध्ये सुरळीत समन्वय सुनिश्चित करण्यासाठी प्रत्येक बुकिंगवर लक्ष ठेवतो.")}
            </p>
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
