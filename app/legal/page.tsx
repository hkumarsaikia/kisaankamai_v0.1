"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";

const docTabs = [
  { id: "privacy", label: "Privacy Policy", icon: "policy" },
  { id: "terms", label: "Terms of Service", icon: "gavel" },
  { id: "cancellation", label: "Cancellation Policy", icon: "event_busy" },
  { id: "refund", label: "Refund Policy", icon: "payments" },
];

export default function LegalPage() {
  const [activeDoc, setActiveDoc] = useState("privacy");
  const { language, langText } = useLanguage();

  return (
    <main className="bg-surface dark:bg-[#0f1a14] min-h-screen">
      <Header />

      {/* Header Section */}
      <header className="pt-32 pb-12 bg-surface-container-low dark:bg-emerald-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-2 text-sm text-on-surface-variant dark:text-slate-400 mb-4 font-label">
            <Link className="hover:text-primary dark:hover:text-emerald-400 transition-colors" href="/">Home</Link>
            <span>/</span>
            <span className="text-primary dark:text-emerald-400 font-medium">Legal & Policy</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-primary dark:text-emerald-50 tracking-tight mb-4">{langText("Legal Center", "कायदेशीर केंद्र")}</h1>
              <p className="text-lg text-on-surface-variant dark:text-slate-400 max-w-2xl">{langText("Transparency is the root of our trust. Here you can find all the legal documents governing your use of the Kisan Kamai marketplace.", "पारदर्शकता ही आमच्या विश्वासाचे मूळ आहे. किसान कमाई बाजारपेठेच्या तुमच्या वापराशी संबंधित सर्व कायदेशीर दस्तएवज येथे मिळू शकतात.")}</p>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 text-sm font-label bg-white dark:bg-emerald-900/30 px-4 py-2 rounded-full shadow-sm border border-emerald-100 dark:border-emerald-800/50">
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-base">verified</span>
              Last Updated: March 15, 2024
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Side Navigation */}
          <aside className="lg:w-1/4 space-y-4">
            <div className="sticky top-28 space-y-2">
              <h4 className="px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-slate-500 mb-4">Documents</h4>
              {docTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDoc(tab.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    activeDoc === tab.id
                      ? "bg-primary-container text-on-primary"
                      : "hover:bg-surface-container-high dark:hover:bg-emerald-900/30 text-on-surface dark:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">{tab.icon}</span>
                    <span className="font-semibold">{tab.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              ))}
              <div className="mt-8 p-6 rounded-2xl bg-secondary-container/10 border border-secondary-container/20 dark:border-amber-800/30">
                <span className="material-symbols-outlined text-secondary dark:text-amber-400 text-3xl mb-3">help_center</span>
                <h5 className="font-bold text-on-surface dark:text-white mb-2">Need clarification?</h5>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-4">Our support team is available to help you understand our policies.</p>
                <Link className="inline-flex items-center gap-2 text-sm font-bold text-secondary dark:text-amber-400 hover:underline" href="/support">
                  Contact Support
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white dark:bg-emerald-900/20 rounded-3xl p-8 md:p-12 card-shadow border border-surface-container dark:border-emerald-800/50">
              {/* Language Toggle - removed since global context manages this */}

              {/* Policy Content */}
              <div className="legal-content text-on-surface-variant dark:text-slate-400">
                <h2 className="!mt-0 text-on-surface dark:text-white">1. Introduction / प्रस्तावना</h2>
                <p>
                  {language === "en"
                    ? "Welcome to Kisan Kamai. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website."
                    : "Kisan Kamai मध्ये आपले स्वागत आहे. आम्ही तुमच्या गोपनीयतेचा आदर करतो आणि तुमच्या वैयक्तिक डेटाचे संरक्षण करण्यासाठी वचनबद्ध आहोत."}
                </p>

                <h2 className="text-on-surface dark:text-white">2. Data Collection / डेटा संकलन</h2>
                <p>
                  {language === "en"
                    ? "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:"
                    : "आम्ही तुमच्याबद्दल विविध प्रकारचा वैयक्तिक डेटा गोळा करू शकतो, वापरू शकतो, साठवू शकतो आणि हस्तांतरित करू शकतो:"}
                </p>
                <ul>
                  <li><strong>{language === "en" ? "Identity Data:" : "ओळख डेटा:"}</strong> {language === "en" ? "includes first name, last name, username or similar identifier." : "पहिले नाव, आडनाव, वापरकर्तानाव समाविष्ट आहे."}</li>
                  <li><strong>{language === "en" ? "Contact Data:" : "संपर्क डेटा:"}</strong> {language === "en" ? "includes billing address, delivery address, email address and telephone numbers." : "बिलिंग पत्ता, ईमेल पत्ता आणि दूरध्वनी क्रमांक समाविष्ट आहे."}</li>
                  <li><strong>{language === "en" ? "Financial Data:" : "आर्थिक डेटा:"}</strong> {language === "en" ? "includes bank account and payment card details." : "बँक खाते आणि पेमेंट कार्ड तपशील समाविष्ट आहे."}</li>
                  <li><strong>{language === "en" ? "Transaction Data:" : "व्यवहार डेटा:"}</strong> {language === "en" ? "includes details about payments to and from you." : "तुमच्याकडून आणि तुमच्याकडे पेमेंटचे तपशील समाविष्ट आहे."}</li>
                </ul>

                <h2 className="text-on-surface dark:text-white">3. How We Use Your Data / आम्ही तुमचा डेटा कसा वापरतो</h2>
                <p>{language === "en" ? "We will only use your personal data when the law allows us to." : "कायदा परवानगी देत ​​असेल तेव्हाच आम्ही तुमचा वैयक्तिक डेटा वापरू."}</p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="p-5 rounded-2xl bg-surface-container-low dark:bg-emerald-900/10 border border-outline-variant/30 dark:border-emerald-800/50">
                    <h4 className="font-bold text-primary dark:text-emerald-50 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">contract</span>
                      {language === "en" ? "Contract Fulfillment" : "करार पूर्तता"}
                    </h4>
                    <p className="text-sm !mb-0">{language === "en" ? "To facilitate the rental agreement between equipment owners and renters." : "उपकरण मालक आणि भाडेकरू यांच्यातील भाडे करार सुलभ करण्यासाठी."}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-container-low dark:bg-emerald-900/10 border border-outline-variant/30 dark:border-emerald-800/50">
                    <h4 className="font-bold text-primary dark:text-emerald-50 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">security</span>
                      {language === "en" ? "Security & Safety" : "सुरक्षा आणि संरक्षण"}
                    </h4>
                    <p className="text-sm !mb-0">{language === "en" ? "To verify identities and maintain the integrity of our marketplace." : "ओळख सत्यापित करण्यासाठी आणि आमच्या बाजारपेठेची सचोटी राखण्यासाठी."}</p>
                  </div>
                </div>

                <h2 className="text-on-surface dark:text-white">4. Data Sharing / डेटा शेअरिंग</h2>
                <p>{language === "en" ? "We may share your personal data with the following parties:" : "आम्ही खालील पक्षांसह तुमचा वैयक्तिक डेटा शेअर करू शकतो:"}</p>
                <ul>
                  <li>{language === "en" ? "Equipment Owners: When you book equipment, your contact details are shared." : "उपकरण मालक: तुम्ही उपकरणे बुक केल्यावर तुमचे संपर्क तपशील शेअर केले जातात."}</li>
                  <li>{language === "en" ? "Payment Processors: To handle secure financial transactions." : "पेमेंट प्रोसेसर: सुरक्षित आर्थिक व्यवहार हाताळण्यासाठी."}</li>
                  <li>{language === "en" ? "Logistics Partners: To coordinate equipment transport." : "लॉजिस्टिक्स भागीदार: उपकरण वाहतूक समन्वय साधण्यासाठी."}</li>
                </ul>

                <div className="mt-12 p-8 rounded-3xl bg-primary dark:bg-emerald-800 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="!mt-0 text-white">{language === "en" ? "Commitment to Indian Farmers" : "भारतीय शेतकऱ्यांप्रती बांधिलकी"}</h3>
                    <p className="text-emerald-100 !mb-0">{language === "en" ? "Your data is never sold to third-party marketing agencies. Our platform is built to empower Indian agriculture, not exploit it." : "तुमचा डेटा कधीही तृतीय-पक्ष मार्केटिंग एजन्सींना विकला जात नाही. आमचे व्यासपीठ भारतीय शेतीला सशक्त करण्यासाठी बनवले आहे."}</p>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 bg-emerald-800/30 rounded-full blur-3xl" />
                </div>

                <h2 className="text-on-surface dark:text-white">5. Cancellation Policy / रद्द करण्याचे धोरण</h2>
                <ul className="list-none !pl-0 space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">01</div>
                    <div>
                      <p className="font-bold text-on-surface dark:text-white !mb-1">{language === "en" ? "24-Hour Free Cancellation" : "२४-तास मोफत रद्द"}</p>
                      <p className="text-sm !mb-0">{language === "en" ? "Bookings cancelled within 24 hours of booking (and at least 48 hours before the start date) receive a full refund." : "बुकिंगच्या 24 तासांच्या आत (आणि सुरुवातीच्या तारखेपूर्वी किमान 48 तास) रद्द केलेल्या बुकिंगला पूर्ण परतावा मिळतो."}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">02</div>
                    <div>
                      <p className="font-bold text-on-surface dark:text-white !mb-1">{language === "en" ? "Late Cancellations" : "उशीरा रद्दीकरण"}</p>
                      <p className="text-sm !mb-0">{language === "en" ? "Cancellations made less than 48 hours before the start date may incur a 15% service fee." : "सुरुवातीच्या तारखेपूर्वी 48 तासांपेक्षा कमी कालावधीत केलेल्या रद्दीकरणांवर 15% सेवा शुल्क लागू शकते."}</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Download + Related */}
              <div className="mt-12 pt-8 border-t border-surface-container dark:border-emerald-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-on-surface-variant dark:text-slate-400 text-sm">Need a PDF copy?</div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 border border-outline dark:border-emerald-700 rounded-lg text-sm font-semibold hover:bg-surface-container-low dark:hover:bg-emerald-900/30 transition-colors text-on-surface dark:text-white">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Download English (PDF)
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-outline dark:border-emerald-700 rounded-lg text-sm font-semibold hover:bg-surface-container-low dark:hover:bg-emerald-900/30 transition-colors text-on-surface dark:text-white font-mukta">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Download मराठी (PDF)
                  </button>
                </div>
              </div>

              {/* Related Links */}
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Link href="/faq" className="group p-6 bg-white dark:bg-emerald-900/10 rounded-2xl border border-surface-container dark:border-emerald-800/50 hover:shadow-lg transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">help</span>
                  </div>
                  <h4 className="font-bold text-on-surface dark:text-white mb-2">FAQs</h4>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400">Frequently asked questions about our terms and usage.</p>
                </Link>
                <Link href="/support" className="group p-6 bg-white dark:bg-emerald-900/10 rounded-2xl border border-surface-container dark:border-emerald-800/50 hover:shadow-lg transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">contact_support</span>
                  </div>
                  <h4 className="font-bold text-on-surface dark:text-white mb-2">Legal Contact</h4>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400">Reach out directly to our legal compliance team.</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
