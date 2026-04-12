"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

export const Footer = () => {
  const { langText } = useLanguage();

  return (
    <footer className="bg-slate-900 dark:bg-black w-full py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        <div className="col-span-1 md:col-span-1">
          <Link 
            href="/" 
            className="block mb-8 transition-transform hover:-translate-y-1"
            aria-label="Kisan Kamai"
          >
            <svg viewBox="0 0 350 80" className="w-full max-w-[280px] h-auto pointer-events-none select-none">
              <defs>
                <linearGradient id="cropin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <text 
                x="0" 
                y="60" 
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                fontSize="64" 
                fontWeight="200" 
                fill="none" 
                stroke="url(#cropin-grad)" 
                strokeWidth="1.5"
                letterSpacing="-1.5"
              >
                Kisan Kamai
              </text>
            </svg>
          </Link>
          <p className="text-slate-400 leading-relaxed mb-6">
            {langText(
              "Empowering Indian farmers through shared technology and machinery access. Rooted in Trust.",
              "सामायिक तंत्रज्ञान आणि यंत्रसामग्रीच्या प्रवेशाद्वारे भारतीय शेतकऱ्यांना सक्षम करणे. विश्वासात रुजलेले."
            )}
          </p>
          <div className="flex gap-4">
            <a href="https://x.com/kisankamai" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors">
              <span className="font-black text-lg">X</span>
            </a>
            <a href="https://linkedin.com/company/kisankamai" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-[#0077b5] transition-colors">
              <span className="font-black text-lg">in</span>
            </a>
            <a href="https://youtube.com/@kisankamai" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-[#ff0000] transition-colors">
              <span className="material-symbols-outlined text-[24px]">smart_display</span>
            </a>
          </div>
        </div>
        <div>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6">{langText("Marketplace", "बाजारपेठ")}</h5>
          <ul className="space-y-4">
            <li><Link href="/rent-equipment" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Find Equipment", "उपकरणे शोधा")}</Link></li>
            <li><Link href="/list-equipment" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("List Equipment", "उपकरणे सूचीबद्ध करा")}</Link></li>
            <li><Link href="/renter-journey" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Renter Journey", "भाडेकरू प्रवास")}</Link></li>
            <li><Link href="/booking" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Booking", "बुकिंग")}</Link></li>
            <li><Link href="/trust-safety" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Trust & Safety", "विश्वास आणि सुरक्षा")}</Link></li>
            <li><Link href="/faq" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("How it Works", "कसे कार्य करते")}</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6">{langText("For Owners", "मालकांसाठी")}</h5>
          <ul className="space-y-4">
            <li><Link href="/owner-registration" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Register Equipment", "उपकरणे नोंदणी करा")}</Link></li>
            <li><Link href="/owner-benefits" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Owner Benefits", "मालक फायदे")}</Link></li>
            <li><Link href="/owner-experience" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Owner Experience", "मालक अनुभव")}</Link></li>
            <li><Link href="/owner-profile" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Owner Profile", "मालक प्रोफाइल")}</Link></li>
          </ul>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6 mt-8">{langText("Trust & Company", "विश्वास आणि कंपनी")}</h5>
          <ul className="space-y-4">
            <li>
              <Link href="/about" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300 block font-bold">{langText("About Us", "आमच्याबद्दल")}</Link>
              <span className="text-[10px] text-slate-500 block -mt-1">{langText("Trust in Agriculture", "कृषी मध्ये विश्वास")}</span>
            </li>
            <li>
              <Link href="/partner" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300 block font-bold">{langText("Partner with Us", "आमच्यासोबत भागीदारी")}</Link>
              <span className="text-[10px] text-slate-500 block -mt-1">{langText("Join our network", "आमच्या नेटवर्कमध्ये सामील व्हा")}</span>
            </li>
            <li>
              <Link href="/trust-safety" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300 block font-bold">{langText("Trust & Safety", "विश्वास आणि सुरक्षा")}</Link>
              <span className="text-[10px] text-slate-500 block -mt-1">{langText("Our guarantee", "आमची खात्री")}</span>
            </li>
            <li>
              <Link href="/legal" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300 block font-bold">{langText("Legal & Policies", "कायदेशीर आणि धोरणे")}</Link>
              <span className="text-[10px] text-slate-500 block -mt-1">{langText("Terms of service", "सेवा अटी")}</span>
            </li>
            <li><Link href="/faq" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("FAQ", "वारंवार विचारले जाणारे प्रश्न")}</Link></li>
            <li><Link href="/support" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Contact Support", "मदत संपर्क")}</Link></li>
            <li><Link href="/locations" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Locations", "स्थाने")}</Link></li>
            <li><Link href="/feedback" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{langText("Share Feedback", "अभिप्राय द्या")}</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6">{langText("Newsletter", "वृत्तपत्र")}</h5>
          <p className="text-slate-400 mb-4">{langText("Stay updated on agricultural trends and new equipment listings.", "कृषी ट्रेंड आणि नवीन उपकरण सूचींवर अद्ययावत रहा.")}</p>
          <div className="flex gap-2">
            <input
              className="bg-slate-800 border-none rounded-lg px-4 py-2 text-white w-full focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-500"
              placeholder={langText("Email", "ईमेल")}
              type="email"
            />
            <button className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-500 transition-colors">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
          <div className="mt-6">
            <p className="text-slate-500 text-xs">{langText("Operating in:", "कार्यरत:")}</p>
            <p className="text-white font-medium text-sm flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-emerald-400 text-sm">location_on</span>
              {langText("Maharashtra, India", "महाराष्ट्र, भारत")}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-sm">{langText("© 2026 Kisan Kamai. Rooted in Trust. Serving Indian Agriculture.", "© 2026 किसान कमाई. विश्वासात रुजलेले. भारतीय शेतीची सेवा.")}</p>
        <p className="text-slate-500 italic text-sm">{langText("Built for the hard-working farmers of India.", "भारताच्या कष्टकरी शेतकऱ्यांसाठी बनवलेले.")}</p>
      </div>
    </footer>
  );
};
