"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { FOOTER_MARKETPLACE_LINKS, FOOTER_TRUST_LINKS } from "@/lib/site-navigation.js";
import { SharedIcon } from "@/components/SharedIcon";

export const Footer = () => {
  const { t, langText } = useLanguage();
  const renderLabel = (link: { labelKey?: string; enLabel?: string; mrLabel?: string }) => {
    if (link.labelKey) {
      return t(link.labelKey as never);
    }

    return langText(link.enLabel || "", link.mrLabel || link.enLabel || "");
  };

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
                <linearGradient id="cropin-grad-footer" x1="0%" y1="0%" x2="100%" y2="0%">
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
                stroke="url(#cropin-grad-footer)" 
                strokeWidth="1.5"
                letterSpacing="-1.5"
              >
                Kisan Kamai
              </text>
            </svg>
          </Link>
          <p className="text-slate-400 leading-relaxed mb-6 font-normal">
            {t("Footer.empowering_indian_farmers_through_shared_technology_and_machinery_access_rooted_in_trust")}
          </p>
          <div className="flex gap-4">
            <a
              href="https://x.com/kisankamai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={langText("Follow Kisan Kamai on X", "Kisan Kamai ला X वर फॉलो करा")}
              className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors"
            >
              <span className="font-black text-lg">X</span>
            </a>
            <a
              href="https://linkedin.com/company/kisankamai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={langText("Follow Kisan Kamai on LinkedIn", "Kisan Kamai ला LinkedIn वर फॉलो करा")}
              className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-[#0077b5] transition-colors"
            >
              <span className="font-black text-lg">in</span>
            </a>
            <a
              href="https://youtube.com/@kisankamai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={langText("Watch Kisan Kamai on YouTube", "Kisan Kamai ला YouTube वर पहा")}
              className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-[#ff0000] transition-colors"
            >
              <SharedIcon name="youtube" className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6">{t("Footer.marketplace")}</h5>
          <ul className="space-y-4">
            {FOOTER_MARKETPLACE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-slate-400 hover:text-emerald-400 font-normal hover:underline underline-offset-4 transition-all duration-300">
                  {renderLabel(link)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6">{t("Footer.trust_and_company")}</h5>
          <ul className="space-y-4">
            {FOOTER_TRUST_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-slate-400 hover:text-emerald-400 font-normal hover:underline underline-offset-4 transition-all duration-300">
                  {renderLabel(link)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6">{t("Footer.newsletter")}</h5>
          <p className="text-slate-400 mb-4 font-normal">{t("Footer.stay_updated_on_agricultural_trends_and_new_equipment_listings")}</p>
          <div className="flex gap-2">
            <input
              className="bg-slate-800 border-none rounded-lg px-4 py-2 text-white w-full focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-500 font-normal"
              placeholder={t("Footer.email")}
              type="email"
            />
            <button
              type="button"
              aria-label={langText("Subscribe to the newsletter", "न्यूजलेटरसाठी सदस्य व्हा")}
              title={langText("Subscribe to the newsletter", "न्यूजलेटरसाठी सदस्य व्हा")}
              className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-500 transition-colors"
            >
              <SharedIcon name="send" className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-6">
            <p className="text-slate-500 text-xs font-normal">{t("Footer.operating_in")}</p>
            <p className="text-white font-medium text-sm flex items-center gap-1 mt-1">
              <SharedIcon name="location" className="h-4 w-4 text-emerald-400" />
              {t("Footer.maharashtra_india")}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center">
        <p className="text-slate-400 text-sm font-normal">
          {langText(
            "© 2026 Kisan Kamai. All rights reserved. Built with care for Bharat.",
            "© २०२६ किसान कमाई. सर्व हक्क राखीव. भारतासाठी जपून तयार केले."
          )}
        </p>
      </div>
    </footer>
  );
};
