"use client";

import { useMemo, useState } from "react";
import { ContentImage } from "@/components/ContentImage";
import { useLanguage } from "@/components/LanguageContext";
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

const ownerDistricts = [
  "Nashik",
  "Jalgaon",
  "Dhule",
  "Nandurbar",
  "Ahmednagar",
  "Chhatrapati Sambhajinagar",
  "Pune",
  "Satara",
  "Sangli",
  "Kolhapur",
] as const;

type OwnerEarningCategory = (typeof ownerEarningCategories)[number];

export default function OwnerBenefitsPage() {
  const { t, langText } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<OwnerEarningCategory>(ownerEarningCategories[0]);
  const [usageDays, setUsageDays] = useState(15);
  const [district, setDistrict] = useState<string>(ownerDistricts[0]);

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
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
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
              <div className="space-y-8 rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm lg:col-span-1">
                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-primary dark:text-emerald-400">
                    {t("owner-benefits.equipment_type")}
                  </label>
                  <div className="space-y-3">
                    {ownerEarningCategories.map((category) => {
                      const active = category.label === selectedCategory.label;
                      return (
                        <button
                          key={category.label}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                            active
                              ? "border-primary bg-primary text-white"
                              : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/60 hover:text-primary"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="material-symbols-outlined">{category.icon}</span>
                            <span>
                              <span className="block font-bold">{langText(category.label, category.mrLabel)}</span>
                              <span className={`text-xs ${active ? "text-white/75" : "text-on-surface-variant"}`}>
                                {category.detail}
                              </span>
                            </span>
                          </span>
                          {active ? (
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-primary dark:text-emerald-400">
                    {t("owner-benefits.operational_district")}
                  </label>
                  <select
                    className="w-full rounded-xl border-outline-variant bg-surface-container-lowest py-3 text-on-surface focus:border-primary focus:ring-primary"
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                  >
                    {ownerDistricts.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
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
                <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-primary-container p-10 text-white">
                  <div className="relative z-10">
                    <span className="text-sm font-bold uppercase tracking-widest text-emerald-200">
                      {t("owner-benefits.estimated_monthly_earnings")}
                    </span>
                    <div className="mb-2 mt-4 text-5xl font-extrabold md:text-6xl">
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

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    [t("owner-benefits.platform_fee"), t("owner-benefits.transparent_10_commission_only_when_you_earn_no_hidden_listing_charges")],
                    [t("owner-benefits.safe_handoff_protocol"), t("owner-benefits.digital_checklist_and_photo_verification_at_both_pickup_and_return_ensures_your_equipment_s_condition_is_documented")],
                    [t("owner-benefits.your_machine_is_our_priority"), langText("Owner-managed terms keep pricing, availability, and machine use clear before every rental.", "प्रत्येक भाड्यापूर्वी दर, उपलब्धता आणि मशीनचा वापर स्पष्ट राहतो.")],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
                      <h3 className="font-headline text-lg font-bold text-primary dark:text-emerald-50">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-on-surface-variant">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
