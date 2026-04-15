"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

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
            {t("Footer.empowering_indian_farmers_through_shared_technology_and_machinery_access_rooted_in_trust")}
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
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6">{t("Footer.marketplace")}</h5>
          <ul className="space-y-4">
            <li><Link href="/rent-equipment" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.find_equipment")}</Link></li>
            <li><Link href="/list-equipment" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.list_equipment")}</Link></li>
            <li><Link href="/renter-profile" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.renter_journey")}</Link></li>
            <li><Link href="/booking" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.booking")}</Link></li>
            <li><Link href="/trust-safety" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.trust_and_safety")}</Link></li>
            <li><Link href="/faq" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.how_it_works")}</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6">{t("Footer.for_owners")}</h5>
          <ul className="space-y-4">
            <li><Link href="/profile-selection" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.register_equipment")}</Link></li>
            <li><Link href="/owner-benefits" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.owner_benefits")}</Link></li>
            <li><Link href="/owner-experience" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.owner_experience")}</Link></li>
            <li><Link href="/owner-profile" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.owner_profile")}</Link></li>
          </ul>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6 mt-8">{t("Footer.trust_and_company")}</h5>
          <ul className="space-y-4">
            <li>
              <Link href="/about" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300 block font-bold">{t("Footer.about_us")}</Link>
              <span className="text-[10px] text-slate-500 block -mt-1">{t("Footer.trust_in_agriculture")}</span>
            </li>
            <li>
              <Link href="/partner" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300 block font-bold">{t("Footer.partner_with_us")}</Link>
              <span className="text-[10px] text-slate-500 block -mt-1">{t("Footer.join_our_network")}</span>
            </li>
            <li>
              <Link href="/trust-safety" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300 block font-bold">{t("Footer.trust_and_safety")}</Link>
              <span className="text-[10px] text-slate-500 block -mt-1">{t("Footer.our_guarantee")}</span>
            </li>
            <li>
              <Link href="/legal" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300 block font-bold">{t("Footer.legal_and_policies")}</Link>
              <span className="text-[10px] text-slate-500 block -mt-1">{t("Footer.terms_of_service")}</span>
            </li>
            <li><Link href="/faq" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.faq")}</Link></li>
            <li><Link href="/support" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.contact_support")}</Link></li>
            <li><Link href="/locations" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.locations")}</Link></li>
            <li><Link href="/feedback" className="text-slate-400 hover:text-emerald-400 hover:underline underline-offset-4 transition-all duration-300">{t("Footer.share_feedback")}</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-6">{t("Footer.newsletter")}</h5>
          <p className="text-slate-400 mb-4">{t("Footer.stay_updated_on_agricultural_trends_and_new_equipment_listings")}</p>
          <div className="flex gap-2">
            <input
              className="bg-slate-800 border-none rounded-lg px-4 py-2 text-white w-full focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-500"
              placeholder={t("Footer.email")}
              type="email"
            />
            <button className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-500 transition-colors">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
          <div className="mt-6">
            <p className="text-slate-500 text-xs">{t("Footer.operating_in")}</p>
            <p className="text-white font-medium text-sm flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-emerald-400 text-sm">location_on</span>
              {t("Footer.maharashtra_india")}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-sm">{t("Footer.2026_kisan_kamai_rooted_in_trust_serving_indian_agriculture")}</p>
        <p className="text-slate-500 italic text-sm">{t("Footer.built_for_the_hard_working_farmers_of_india")}</p>
      </div>
    </footer>
  );
};
