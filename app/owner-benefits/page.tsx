"use client";

import { ContentImage } from "@/components/ContentImage";
import { useLanguage } from "@/components/LanguageContext";
import { assetPath } from "@/lib/site";

export default function OwnerBenefitsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-surface dark:bg-slate-950 min-h-screen">
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[716px] flex items-center overflow-hidden bg-primary-container dark:bg-slate-950">
          <div className="absolute inset-0 z-0">
            <ContentImage className="w-full h-full object-cover opacity-30 mix-blend-overlay" alt="Cinematic wide shot of a modern red tractor in a golden wheat field during sunset in rural Maharashtra" src={assetPath("/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container dark:from-emerald-950 via-primary-container/80 dark:via-emerald-950/80 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white leading-tight">
                {t("owner-benefits.maximize_your")}<br />
                <span className="text-on-secondary-container dark:text-amber-200">{t("owner-benefits.machine_s_potential")}</span>
              </h1>
              <p className="text-on-primary-container dark:text-emerald-100 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                {t("owner-benefits.turn_your_idle_farming_equipment_into_a_consistent_revenue_stream_connect_with_verified_farmers_in_sangli_satara_and_kolhapur_districts")}
              </p>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mt-12">
                <span className="material-symbols-outlined text-on-secondary-container dark:text-amber-400 text-4xl mb-4">account_balance_wallet</span>
                <h3 className="text-white font-bold text-xl mb-2">{t("owner-benefits.steady_income")}</h3>
                <p className="text-on-primary-container dark:text-emerald-100 text-sm">
                  {t("owner-benefits.supplement_your_seasonal_earnings_with_consistent_rental_requests_from_local_farmers")}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                <span className="material-symbols-outlined text-on-secondary-container dark:text-amber-400 text-4xl mb-4">verified_user</span>
                <h3 className="text-white font-bold text-xl mb-2">{t("owner-benefits.verified_renters")}</h3>
                <p className="text-on-primary-container dark:text-emerald-100 text-sm">
                  {t("owner-benefits.every_renter_is_kyc_verified_your_equipment_is_in_safe_professional_hands")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Earnings Calculator */}
        <section className="py-24 bg-surface dark:bg-slate-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="font-headline text-4xl font-extrabold text-primary dark:text-emerald-50 mb-4">{t("owner-benefits.how_much_can_you_earn")}</h2>
              <p className="text-on-surface-variant dark:text-slate-400 font-medium">
                {t("owner-benefits.select_your_equipment_type_to_see_estimated_monthly_earnings_based_on_local_market_rates_in_western_maharashtra")}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calculator Sidebar */}
              <div className="lg:col-span-1 bg-white dark:bg-slate-900/40 p-8 rounded-3xl shadow-sm border border-outline-variant/30 dark:border-slate-800/50 space-y-8">
                <div>
                  <label className="block text-sm font-bold text-primary dark:text-emerald-400 mb-4 uppercase tracking-wider">{t("owner-benefits.equipment_type")}</label>
                  <div className="space-y-3">
                    <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/20 text-primary dark:text-emerald-400 font-bold">
                      <span className="flex items-center gap-3"><span className="material-symbols-outlined">agriculture</span> {t("owner-benefits.tractor_45hp")}</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </button>
                    <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl border border-outline-variant text-on-surface-variant dark:text-slate-400 font-medium hover:border-primary/50 transition-colors">
                      <span className="flex items-center gap-3"><span className="material-symbols-outlined">settings_input_component</span> {t("owner-benefits.harvester")}</span>
                    </button>
                    <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl border border-outline-variant text-on-surface-variant dark:text-slate-400 font-medium hover:border-primary/50 transition-colors">
                      <span className="flex items-center gap-3"><span className="material-symbols-outlined">tire_repair</span> {t("owner-benefits.rotavator")}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary dark:text-emerald-400 mb-4 uppercase tracking-wider">{t("owner-benefits.operational_district")}</label>
                  <select className="w-full rounded-xl border-outline-variant bg-white dark:bg-slate-900/50 text-on-surface dark:text-emerald-50 focus:ring-primary focus:border-primary py-3">
                    <option>{t("owner-benefits.sangli")}</option>
                    <option>{t("owner-benefits.satara")}</option>
                    <option>{t("owner-benefits.kolhapur")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary dark:text-emerald-400 mb-4 uppercase tracking-wider">{t("owner-benefits.expected_usage_days_month")}</label>
                  <input className="w-full accent-primary h-2 bg-surface-container dark:bg-slate-900 rounded-lg appearance-none cursor-pointer" max="25" min="5" type="range" defaultValue="15" />
                  <div className="flex justify-between mt-2 text-xs font-bold text-on-surface-variant dark:text-slate-400">
                    <span>{t("owner-benefits.5_days")}</span>
                    <span>{t("owner-benefits.25_days")}</span>
                  </div>
                </div>
              </div>

              {/* Earnings Display */}
              <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                <div className="md:col-span-2 bg-primary-container text-white p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-on-primary-container dark:text-emerald-300 text-sm font-bold uppercase tracking-widest">{t("owner-benefits.estimated_monthly_earnings")}</span>
                    <div className="text-6xl font-extrabold mt-4 mb-2">₹45,000 - ₹62,000</div>
                    <p className="text-on-primary-container dark:text-emerald-100 max-w-sm">
                      {t("owner-benefits.based_on_typical_rental_demand_for_45hp_tractors_in_kolhapur_during_the_rabi_season")}
                    </p>
                  </div>
                  <div className="mt-8 flex gap-4 relative z-10">
                    <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                      <span className="block text-[10px] uppercase font-bold text-on-primary-container dark:text-emerald-200">{t("owner-benefits.avg_daily_rate")}</span>
                      <span className="text-lg font-bold">₹3,500</span>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                      <span className="block text-[10px] uppercase font-bold text-on-primary-container dark:text-emerald-200">{t("owner-benefits.market_demand")}</span>
                      <span className="text-lg font-bold">{t("owner-benefits.high")}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[200px] opacity-5 text-white">payments</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
