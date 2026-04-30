"use client";

import { useMemo, useState } from "react";
import { ContentImage } from "@/components/ContentImage";
import { useLanguage } from "@/components/LanguageContext";
import { MAHARASHTRA_DISTRICTS } from "@/lib/auth/india-districts";
import { assetPath } from "@/lib/site";

const ownerEarningCategories = [
  {
    label: "Tractor",
    mrLabel: "ट्रॅक्टर",
    detail: "45HP+",
    icon: "agriculture",
    rate: 3500,
    demand: "High",
    mrDemand: "उच्च",
  },
  {
    label: "Harvester",
    mrLabel: "हार्वेस्टर",
    detail: "Combine",
    icon: "settings_input_component",
    rate: 7200,
    demand: "Seasonal peak",
    mrDemand: "हंगामी उच्च",
  },
  {
    label: "Rotavator",
    mrLabel: "रोटाव्हेटर",
    detail: "6 ft",
    icon: "tire_repair",
    rate: 2400,
    demand: "High",
    mrDemand: "उच्च",
  },
  {
    label: "Seed Drill",
    mrLabel: "सीड ड्रिल",
    detail: "Multi-crop",
    icon: "grass",
    rate: 2100,
    demand: "Seasonal",
    mrDemand: "हंगामी",
  },
  {
    label: "Plough",
    mrLabel: "नांगर",
    detail: "Hydraulic",
    icon: "construction",
    rate: 1800,
    demand: "Steady",
    mrDemand: "स्थिर",
  },
  {
    label: "Trolley",
    mrLabel: "ट्रॉली",
    detail: "Farm haulage",
    icon: "local_shipping",
    rate: 1600,
    demand: "Steady",
    mrDemand: "स्थिर",
  },
  {
    label: "Sprayer",
    mrLabel: "स्प्रेयर",
    detail: "Boom or orchard",
    icon: "water_drop",
    rate: 1900,
    demand: "Crop cycle",
    mrDemand: "पीक चक्र",
  },
  {
    label: "Cultivator",
    mrLabel: "कल्टीवेटर",
    detail: "9 tine",
    icon: "agriculture",
    rate: 1750,
    demand: "Steady",
    mrDemand: "स्थिर",
  },
] as const;

type OwnerEarningCategory = (typeof ownerEarningCategories)[number];

export default function OwnerBenefitsPage() {
  const { t, langText } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<OwnerEarningCategory>(ownerEarningCategories[0]);
  const [usageDays, setUsageDays] = useState(15);
  const [district, setDistrict] = useState<string>(MAHARASHTRA_DISTRICTS[0]);

  const monthlyEstimate = useMemo(() => {
    const base = selectedCategory.rate * usageDays;
    return {
      low: Math.round(base * 0.9),
      high: Math.round(base * 1.15),
    };
  }, [selectedCategory, usageDays]);

  const currency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="pt-20">
        <section className="relative flex min-h-[716px] items-center overflow-hidden bg-primary-container">
          <div className="absolute inset-0 z-0">
            <ContentImage
              className="h-full w-full object-cover"
              alt="Modern tractor in a golden wheat field during sunset in rural Maharashtra"
              src={assetPath("/assets/generated/hero_tractor.png")}
              loading="lazy"
              decoding="async"
            />
            <div className="kk-banner-image-overlay" />
          </div>
          <div className="relative z-10 flex w-full justify-start px-6 text-left sm:px-10 lg:px-16 xl:px-24">
            <div className="max-w-3xl space-y-8">
              <h1 className="font-headline text-5xl font-extrabold leading-tight text-white drop-shadow-2xl md:text-7xl">
                {t("owner-benefits.maximize_your")}
                <br />
                <span className="text-amber-200">{t("owner-benefits.machine_s_potential")}</span>
              </h1>
              <p className="max-w-xl text-lg font-semibold leading-relaxed text-white drop-shadow-lg md:text-xl">
                {t("owner-benefits.turn_your_idle_farming_equipment_into_a_consistent_revenue_stream_connect_with_verified_farmers_in_sangli_satara_and_kolhapur_districts")}
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-surface py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 font-headline text-4xl font-extrabold text-primary dark:text-emerald-50">
                {t("owner-benefits.how_much_can_you_earn")}
              </h2>
              <p className="font-medium text-on-surface-variant">
                {langText(
                  "Select your equipment type to see estimated monthly earnings based on local market rates across Maharashtra.",
                  "महाराष्ट्रातील स्थानिक बाजार दरांवर आधारित अंदाजित मासिक कमाई पाहण्यासाठी तुमचा उपकरण प्रकार निवडा."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="kk-form-section space-y-8 p-8 lg:col-span-1">
                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-primary dark:text-emerald-400">
                    {t("owner-benefits.equipment_type")}
                  </label>
                  <div className="relative">
                    <select
                      className="kk-select-control w-full appearance-none rounded-xl border border-outline-variant bg-surface-container-lowest bg-none px-4 py-3 pr-12 text-on-surface focus:border-primary focus:ring-primary"
                      value={selectedCategory.label}
                      onChange={(event) => {
                        const nextCategory = ownerEarningCategories.find((category) => category.label === event.target.value);
                        if (nextCategory) {
                          setSelectedCategory(nextCategory);
                        }
                      }}
                    >
                      {ownerEarningCategories.map((category) => (
                        <option key={category.label} value={category.label}>
                          {langText(category.label, category.mrLabel)} - {category.detail}
                        </option>
                      ))}
                    </select>
                    <span className="kk-select-arrow material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                      expand_more
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-primary dark:text-emerald-400">
                    {t("owner-benefits.operational_district")}
                  </label>
                  <div className="max-h-64 overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-lowest p-2">
                    {MAHARASHTRA_DISTRICTS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setDistrict(item)}
                        className={`block w-full rounded-lg px-4 py-2 text-left text-sm font-bold transition-colors ${
                          district === item
                            ? "bg-primary text-white"
                            : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-primary dark:text-emerald-400">
                    {t("owner-benefits.expected_usage_days_month")}
                  </label>
                  <input
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container accent-primary"
                    max="25"
                    min="5"
                    type="range"
                    value={usageDays}
                    onChange={(event) => setUsageDays(Number(event.target.value))}
                  />
                  <div className="mt-2 flex justify-between text-xs font-bold text-on-surface-variant">
                    <span>{t("owner-benefits.5_days")}</span>
                    <span>{usageDays} {langText("days", "दिवस")}</span>
                    <span>{t("owner-benefits.25_days")}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                <div className="kk-depth-tile relative flex flex-col justify-between overflow-hidden rounded-3xl bg-primary-container p-8 text-white md:p-10">
                  <div className="relative z-10">
                    <span className="text-sm font-bold uppercase tracking-widest text-emerald-200">
                      {t("owner-benefits.estimated_monthly_earnings")}
                    </span>
                    <div className="mb-2 mt-4 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight">
                      {currency(monthlyEstimate.low)} - {currency(monthlyEstimate.high)}
                    </div>
                    <p className="max-w-xl text-emerald-100">
                      {langText(
                        `${selectedCategory.label} estimates for ${district} using ${usageDays} rental days per month. Final rates depend on machine condition, operator inclusion, fuel, and local demand.`,
                        `${district} साठी ${usageDays} भाडे दिवसांवर आधारित ${selectedCategory.mrLabel} अंदाज. अंतिम दर मशीनची स्थिती, ऑपरेटर, इंधन आणि स्थानिक मागणीवर अवलंबून असतात.`
                      )}
                    </p>
                  </div>
                  <div className="relative z-10 mt-8 flex flex-wrap gap-4">
                    <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2">
                      <span className="block text-[10px] font-bold uppercase text-emerald-200">
                        {t("owner-benefits.avg_daily_rate")}
                      </span>
                      <span className="text-lg font-bold">{currency(selectedCategory.rate)}</span>
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2">
                      <span className="block text-[10px] font-bold uppercase text-emerald-200">
                        {t("owner-benefits.market_demand")}
                      </span>
                      <span className="text-lg font-bold">{langText(selectedCategory.demand, selectedCategory.mrDemand)}</span>
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2">
                      <span className="block text-[10px] font-bold uppercase text-emerald-200">
                        {t("owner-benefits.operational_district")}
                      </span>
                      <span className="text-lg font-bold">{district}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[200px] text-white opacity-5">
                    payments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
