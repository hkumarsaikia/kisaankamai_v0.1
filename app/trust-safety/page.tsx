"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

export default function TrustSafetyPage() {
  const { langText } = useLanguage();
  return (
    <main className="bg-surface dark:bg-[#0f1a14] min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-10 grayscale-[20%]" alt="Golden wheat field at dawn" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTWM31F1E_cbJ6cbeeTDcopE1h0EOjBbzxdPy1RmkDQK2JaErxeBiZOZi0InJdTCkL17CbLqPLbMQ3EXa59JNpjHFqVE92ULehdl1sAzK4N9_ZKAJ9AeSCHugIa_eO9-G_XDtzFSL-3kt_jkk1f4TPKPFAJkJtf7Gr0rAb0fCtRvnuIpXPhnbjnAmvQyq005RGDhQdBDzSQeqhMNX_5hf5ghxWz48WjDYA01AdWnbDWDSaPrhyUdDxqF72U3yaxTDAwhJl55f5JBhB" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface dark:from-[#0f1a14] via-transparent to-surface dark:to-[#0f1a14]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container dark:text-emerald-400 mb-6">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="text-xs font-bold tracking-widest uppercase font-label">{langText("Safety First Policy", "सुरक्षा प्रथम धोरण")}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary dark:text-emerald-50 mb-6 leading-[1.1]">
            {langText("Grounded in Trust,", "विश्वासावर आधारित,")}<br />{langText("Rooted in Safety.", "सुरक्षेत रुजलेले.")}
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {langText("Building the most reliable agritech marketplace for the farmers of Sangli and beyond. Our platform ensures every transaction is secure and every handoff is verified.", "सांगली आणि परिसरातील शेतकऱ्यांसाठी सर्वात विश्वसनीय कृषी तंत्रज्ञान बाजारपेठ तयार करत आहोत. आमचे व्यासपीठ प्रत्येक व्यवहार सुरक्षित आणि प्रत्येक हस्तांतरण सत्यापित असल्याची खात्री करते.")}
          </p>
          <div className="mt-4 text-secondary dark:text-amber-400 font-bold text-sm tracking-wide font-mukta">
            सांगली आणि परिसरातील शेतकऱ्यांसाठी विश्वसनीय व्यासपीठ.
          </div>
        </div>
      </section>

      {/* Core Pillars Bento Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Escrow Payment Card */}
          <div className="md:col-span-8 bg-white dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-3xl p-10 card-shadow hover:card-shadow-lg transition-shadow relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-tertiary-fixed dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-3xl text-on-tertiary-fixed-variant dark:text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h3 className="text-3xl font-extrabold text-primary dark:text-emerald-50 mb-4 leading-tight">{langText("Secure Payments (Escrow)", "सुरक्षित पेमेंट (एस्क्रो)")}</h3>
                  <p className="text-on-surface-variant dark:text-slate-400 font-medium mb-6 leading-relaxed">
                    {langText("Your money is held in a secure digital vault. The owner only receives payment after you confirm the equipment is functional and the job has started.", "तुमचे पैसे सुरक्षित डिजिटल व्हॉल्टमध्ये ठेवले जातात. उपकरणे कार्यरत आहेत आणि काम सुरू झाले आहे हे तुम्ही पुष्टी केल्यानंतरच मालकाला पेमेंट मिळते.")}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">check_circle</span>
                      {langText("No direct cash risks", "थेट रोख जोखीम नाही")}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">check_circle</span>
                      {langText("Automated refund if equipment fails", "उपकरणे अयशस्वी झाल्यास स्वयंचलित परतावा")}
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50">
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">Marathi Guide / मराठी</div>
                    <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed font-semibold font-mukta">
                      सुरक्षित पेमेंट (एस्क्रो): तुमचे पैसे सुरक्षित राहतील. काम सुरू झाल्यावरच मालकाला पैसे मिळतील.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/4 translate-y-1/4 scale-150">
              <span className="material-symbols-outlined text-[300px]">shield_lock</span>
            </div>
          </div>

          {/* Support Card */}
          <div className="md:col-span-4 bg-primary-container text-on-primary-container rounded-3xl p-10 card-shadow flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-3xl text-white">support_agent</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-white">{langText("Support 24/7", "24/7 सपोर्ट")}</h3>
              <p className="text-on-primary-container/80 font-medium mb-8 leading-relaxed">
                {langText("Dedicated team for Sangli and surrounding districts. Help is always a phone call away in Marathi or English.", "सांगली आणि आसपासच्या जिल्ह्यांसाठी समर्पित टीम. मराठी किंवा इंग्रजीमध्ये मदत नेहमी एका फोन कॉलवर उपलब्ध.")}
              </p>
            </div>
            <div className="space-y-4">
              <a className="block w-full bg-white text-primary text-center py-4 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors" href="tel:+910000000000">
                {langText("Call Support Now", "आता सपोर्ट कॉल करा")}
              </a>
              <div className="text-center text-xs font-bold tracking-widest text-on-primary-container/60 font-mukta">
                २४/७ मराठी मदत उपलब्ध
              </div>
            </div>
          </div>

          {/* Verification Steps */}
          <div className="md:col-span-5 bg-surface-container-low dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-3xl p-10 card-shadow">
            <div className="w-14 h-14 bg-secondary-fixed dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-3xl text-on-secondary-fixed-variant dark:text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
            </div>
            <h3 className="text-2xl font-extrabold text-primary dark:text-emerald-50 mb-4">{langText("Verification Steps", "पडताळणी पायऱ्या")}</h3>
            <p className="text-on-surface-variant dark:text-slate-400 font-medium mb-6 leading-relaxed">
              {langText("We manually verify every owner's KYC and equipment ownership before they can list on Kisan Kamai.", "किसान कमाईवर सूचीबद्ध करण्यापूर्वी आम्ही प्रत्येक मालकाची KYC आणि उपकरण मालकी मॅन्युअली सत्यापित करतो.")}
            </p>
            <ul className="space-y-4 text-sm font-bold text-on-surface dark:text-white">
              {[langText("Aadhar/PAN Identity Check", "आधार/पॅन ओळख तपासणी"), langText("Equipment Photo Verification", "उपकरण फोटो पडताळणी"), langText("Past Performance Review", "मागील कार्यप्रदर्शन पुनरावलोकन")].map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-container text-white rounded-full flex items-center justify-center text-[10px]">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Safe Handoff */}
          <div className="md:col-span-7 bg-white dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-3xl p-10 card-shadow relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 h-full items-center">
              <div className="flex-1">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-3xl text-emerald-800 dark:text-emerald-400">handshake</span>
                </div>
                <h3 className="text-2xl font-extrabold text-primary dark:text-emerald-50 mb-4">{langText("Safe Handoff Process", "सुरक्षित हस्तांतरण प्रक्रिया")}</h3>
                <p className="text-on-surface-variant dark:text-slate-400 font-medium mb-4 leading-relaxed">
                  {langText("Every rental involves a digital handoff checklist. Inspections happen before and after use to protect both parties.", "प्रत्येक भाड्यामध्ये डिजिटल हस्तांतरण चेकलिस्ट समाविष्ट असते. दोन्ही पक्षांच्या संरक्षणासाठी वापरापूर्वी आणि नंतर तपासणी होते.")}
                </p>
                <p className="text-sm italic text-secondary dark:text-amber-400 font-bold font-mukta">
                  हस्तांतरण प्रक्रिया: उपकरणाची तपासणी डिजिटल चेकलिस्टद्वारे केली जाते.
                </p>
              </div>
              <div className="flex-1 w-full h-full min-h-[200px]">
                <img className="w-full h-full object-cover rounded-2xl" alt="Farmers shaking hands" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3CfwCfdoo9R4i9-naQlu13L76vvFrD-XTy83PJYxCRcmp8F8yo4Vkiul2lv0cXx7zZ3FnTRo64HjiTsWTuuPEeO2RKdohyCOSkA-7EmmQRb5KNlP6UIr7PiVyKrL5nF7v8L9byFQa1_CX9PfblY-FWO88bSthLzY8t_B-aGfA6lcd_Q-ACYwfV_uODBevo3QWUw8nuxyiiKoOFD426hmolI5O2cFpvftQ2wqdYHeycqMTeeXShGTi079CmwtbSEzhNv0FYCEFYLTQ" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Badge Section */}
      <section className="bg-primary-container py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <img className="rounded-3xl shadow-2xl w-full aspect-video object-cover" alt="Heavy duty agricultural machine" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADUxXc-VpAgim4vix196IGrtnBqAh8e-EV3wE75jU3ND3nBucY--_jy2mcqyO1Ke8ACyOSOazHRU2WMcZSUxTxLdQ0CUzQ4oiqAwBoUTueOMYsPOyodabrDTlr6EGoZ_e7s0AK54HH3q5VtowsVXRM2Qy7l-tii0XQKLn4VS830hrtggcQKEKqbmNkRUlQE7DRIAD_LwjN67Duvjjrnjg0kjMQ1CvG15EF8cba1GzZBvQiiGjVyea4rMSkcucu7ry623HPsh4SJJcp" />
          </div>
          <div className="w-full md:w-1/2 text-white">
            <h2 className="text-4xl font-extrabold mb-8 leading-tight">{langText("Every Machine is Inspected. Every Owner is Known.", "प्रत्येक मशीनची तपासणी होते. प्रत्येक मालक ओळखला जातो.")}</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-300">verified</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Verified Equipment / पडताळलेली यंत्रसामग्री</h4>
                  <p className="text-on-primary-container leading-relaxed">We verify that the equipment is in good working condition before it reaches your farm.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-300">location_on</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Sangli Service Hub / सांगली सेवा केंद्र</h4>
                  <p className="text-on-primary-container leading-relaxed">Local presence in Sangli district means we can intervene quickly if any issues arise.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Style Trust Section */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-primary dark:text-emerald-50 text-center mb-16">{langText("Common Questions on Safety", "सुरक्षेवरील सामान्य प्रश्न")}</h2>
        <div className="space-y-6">
          {[
            { q: langText("What happens if the equipment breaks down?", "उपकरणे बिघडल्यास काय होते?"), a: langText("If a mechanical failure occurs that isn't due to operator error, our support team mediates the cost. You only pay for the work actually completed.", "ऑपरेटर चुकीमुळे नसलेली यांत्रिक बिघाड झाल्यास, आमची सपोर्ट टीम खर्चाचे मध्यस्थी करते. तुम्ही फक्त प्रत्यक्ष पूर्ण झालेल्या कामासाठी पैसे देता.") },
            { q: langText("Is my payment secure?", "माझे पेमेंट सुरक्षित आहे का?"), a: langText("Absolutely. We use bank-grade encryption for all transactions. Funds are held in a separate account until the job is verified.", "निश्चितच. आम्ही सर्व व्यवहारांसाठी बँक-स्तरीय एन्क्रिप्शन वापरतो. काम सत्यापित होईपर्यंत रक्कम वेगळ्या खात्यात ठेवली जाते.") },
            { q: langText("How do I know the owner is reliable?", "मालक विश्वासार्ह आहे हे मला कसे कळेल?"), a: langText("Check the 'Partner' badge on listings. This means the owner has completed multiple successful rentals with high ratings.", "सूचींवरील 'भागीदार' बॅज तपासा. यांचा अर्थ मालकाने उच्च रेटिंगसह अनेक यशस्वी भाडे पूर्ण केले आहेत.") },
          ].map((faq) => (
            <div key={faq.q} className="p-8 bg-white dark:bg-emerald-900/20 border border-emerald-50 dark:border-emerald-800/50 rounded-2xl card-shadow">
              <h4 className="text-lg font-extrabold text-primary dark:text-emerald-50 mb-3">{faq.q}</h4>
              <p className="text-on-surface-variant dark:text-slate-400 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
