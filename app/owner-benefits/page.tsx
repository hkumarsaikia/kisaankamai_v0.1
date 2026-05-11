"use client";

import { useMemo, useRef, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { MAHARASHTRA_DISTRICTS } from "@/lib/auth/india-districts";
import { BASE_EQUIPMENT_CATEGORIES } from "@/lib/equipment-categories";
import { assetPath } from "@/lib/site";

const ownerHeroImage = assetPath("/assets/generated/farm_yard.png");
const ownerMachineImage = assetPath("/assets/generated/hero_tractor.png");

const categoryDetails: Record<
  string,
  {
    label: string;
    mrLabel: string;
    detail: string;
    rate: number;
    demand: string;
    mrDemand: string;
  }
> = {
  tractors: { label: "Tractor", mrLabel: "ट्रॅक्टर", detail: "45HP+", rate: 3500, demand: "High", mrDemand: "उच्च" },
  harvesters: { label: "Harvester", mrLabel: "हार्वेस्टर", detail: "Combine", rate: 7200, demand: "Seasonal peak", mrDemand: "हंगामी उच्च" },
  implements: { label: "Implement", mrLabel: "इम्प्लिमेंट", detail: "Multi-use", rate: 2200, demand: "Steady", mrDemand: "स्थिर" },
  ploughs: { label: "Plough", mrLabel: "नांगर", detail: "Hydraulic", rate: 1800, demand: "Steady", mrDemand: "स्थिर" },
  sprayers: { label: "Sprayer", mrLabel: "स्प्रेयर", detail: "Boom or orchard", rate: 1900, demand: "Crop cycle", mrDemand: "पीक चक्र" },
  rotavators: { label: "Rotavator", mrLabel: "रोटाव्हेटर", detail: "6 ft", rate: 2400, demand: "High", mrDemand: "उच्च" },
  seeders: { label: "Seed Drill", mrLabel: "सीड ड्रिल", detail: "Multi-crop", rate: 2100, demand: "Seasonal", mrDemand: "हंगामी" },
  threshers: { label: "Thresher", mrLabel: "थ्रेशर", detail: "Crop processing", rate: 4300, demand: "Seasonal peak", mrDemand: "हंगामी उच्च" },
  pumps: { label: "Pump", mrLabel: "पंप", detail: "Irrigation", rate: 1400, demand: "Crop cycle", mrDemand: "पीक चक्र" },
  balers: { label: "Baler", mrLabel: "बेलर", detail: "Straw baling", rate: 5200, demand: "Seasonal", mrDemand: "हंगामी" },
  trolleys: { label: "Trolley", mrLabel: "ट्रॉली", detail: "Farm haulage", rate: 1600, demand: "Steady", mrDemand: "स्थिर" },
  cultivators: { label: "Cultivator", mrLabel: "कल्टीवेटर", detail: "9 tine", rate: 1750, demand: "Steady", mrDemand: "स्थिर" },
};

const ownerEarningCategories = [
  ...BASE_EQUIPMENT_CATEGORIES.map((category) => ({
    slug: category.slug,
    ...categoryDetails[category.slug],
  })),
  { slug: "cultivators", ...categoryDetails.cultivators },
].filter((category) => category.label);

type OwnerEarningCategory = (typeof ownerEarningCategories)[number];

const ownerBenefitsSelectStyle = {
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundImage: "none",
} as const;

export default function OwnerBenefitsPage() {
  const { langText } = useLanguage();
  const earningsEstimateRef = useRef<HTMLDivElement | null>(null);
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
  const scrollToEstimate = () => earningsEstimateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  const visibleDistrict = district === "Ahilyanagar" ? "Ahmednagar" : district;

  return (
    <div className="min-h-screen bg-[#fafafa] font-body text-[#1a1a1a] dark:bg-slate-950 dark:text-slate-100">
      <main className="pt-20">
        <section className="relative overflow-hidden bg-gray-900 pb-28 pt-24">
          <div className="absolute inset-0 z-0">
            <img
              alt="Tractor at sunset"
              className="h-full w-full object-cover"
              src={ownerHeroImage}
            />
            <div className="kk-banner-image-overlay" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="max-w-2xl text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#265f4d] bg-[#1c4036] px-3 py-1.5 text-sm font-semibold text-[#90cab4]">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  {langText("Maximize Your Profits", "तुमचा नफा वाढवा")}
                </div>
                <h1
                  aria-label={langText("Your Equipment, Your Growth.", "तुमची उपकरणे, तुमची वाढ.")}
                  className="mb-6 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight tracking-tight text-white"
                >
                  {langText("Your Equipment,", "तुमची उपकरणे,")}
                  <br />
                  <span className="text-[#60b194]">{langText("Your Growth.", "तुमची वाढ.")}</span>
                </h1>
                <p className="mb-8 text-lg leading-relaxed text-gray-300">
                  {langText(
                    "Turn your unused agricultural equipment into a consistent stream of income. Secure platform, verified farmers, and direct support.",
                    "न वापरलेली शेती उपकरणे नियमित उत्पन्नात बदला. सुरक्षित प्लॅटफॉर्म, पडताळलेले शेतकरी आणि थेट सपोर्ट."
                  )}
                </p>
                <div className="flex flex-col justify-start gap-4 sm:flex-row">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#143B2E] px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-[#143B2E]/30 transition-all hover:-translate-y-0.5 hover:bg-[#0e231e]"
                  >
                    {langText("Start Now", "आता सुरू करा")}
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </Link>
                  <button
                    type="button"
                    onClick={scrollToEstimate}
                    className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-center text-lg font-semibold text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    {langText("View Earnings Estimate", "कमाईचा अंदाज पहा")}
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center lg:h-[600px]">
                <div className="absolute inset-0 rounded-full bg-[#143B2E]/20 blur-3xl" />
                <div className="glass-card relative z-10 w-full max-w-md rotate-2 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-500 hover:rotate-0">
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <img alt="Modern tractor" className="h-48 w-full object-cover" src={ownerMachineImage} />
                    <div className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">Mahindra 575 DI XP Plus</h3>
                          <p className="text-sm text-gray-500 dark:text-slate-400">{langText("47 HP Tractor", "४७ HP ट्रॅक्टर")}</p>
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          {langText("Verified", "पडताळलेले")}
                        </span>
                      </div>
                      <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-slate-800">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-slate-400">{langText("Estimated Monthly Earnings", "अंदाजित मासिक कमाई")}</span>
                          <span className="font-bold text-gray-900 dark:text-slate-100">₹45,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-slate-400">{langText("Average Bookings", "सरासरी बुकिंग")}</span>
                          <span className="font-semibold text-gray-700 dark:text-slate-200">{langText("12 Days/Month", "दर महिन्याला १२ दिवस")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 left-4 flex max-w-[calc(100%-2rem)] items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950 sm:-left-6 sm:max-w-none">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-slate-400">{langText("Last Month's Earnings", "मागील महिन्याची कमाई")}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-slate-100">₹52,400</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white relative dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">How Much Could You Earn?</h2>
              <p className="text-lg text-gray-600 dark:text-slate-300">Select your equipment type and see an estimate based on the local market in Maharashtra.</p>
            </div>

            <div className="glass-card rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-xl max-w-5xl mx-auto dark:border-slate-800 dark:bg-slate-900/80">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <label className="block text-base font-bold text-gray-700 dark:text-slate-200 mb-2">Equipment Type</label>
                    <div className="relative">
                      <select
                        className="kk-owner-benefits-select block w-full pl-4 pr-10 py-3 text-base border-gray-200 focus:outline-none focus:ring-brand focus:border-brand rounded-xl bg-gray-50 appearance-none font-medium dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        style={ownerBenefitsSelectStyle}
                        value={selectedCategory.slug}
                        onChange={(event) => {
                          const next = ownerEarningCategories.find((category) => category.slug === event.target.value);
                          if (next) setSelectedCategory(next);
                        }}
                      >
                        {ownerEarningCategories.map((category) => (
                          <option key={category.slug} value={category.slug}>
                            {langText(category.label, category.mrLabel)} - {category.detail}
                          </option>
                        ))}
                      </select>
                      <div className="kk-owner-benefits-select-arrow pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-700 dark:text-slate-200 mb-2">Operating District</label>
                    <div className="relative">
                      <select
                        className="kk-owner-benefits-select max-h-64 block w-full pl-4 pr-10 py-3 text-base border-gray-200 focus:outline-none focus:ring-brand focus:border-brand rounded-xl bg-gray-50 appearance-none font-medium dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        style={ownerBenefitsSelectStyle}
                        value={district}
                        onChange={(event) => setDistrict(event.target.value)}
                      >
                        {MAHARASHTRA_DISTRICTS.map((districtName) => (
                          <option key={districtName} value={districtName}>
                            {districtName === "Ahilyanagar" ? "Ahmednagar" : districtName}
                          </option>
                        ))}
                      </select>
                      <div className="kk-owner-benefits-select-arrow pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-slate-400">
                      {langText("More locations coming soon...", "लवकरच आणखी ठिकाणे उपलब्ध होतील...")}
                    </p>
                  </div>

                  <div>
                    <label className="flex justify-between text-base font-bold text-gray-700 dark:text-slate-200 mb-4">
                      <span>Expected Usage</span>
                      <span className="text-brand dark:text-primary-fixed">{usageDays} Days/Month</span>
                    </label>
                    <input
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand dark:bg-slate-700"
                      max={25}
                      min={5}
                      type="range"
                      value={usageDays}
                      onChange={(event) => setUsageDays(Number(event.target.value))}
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium">
                      <span>5 Days</span>
                      <span>25 Days</span>
                    </div>
                  </div>
                </div>

                <div
                  ref={earningsEstimateRef}
                  id="earnings-estimate"
                  className="bg-gradient-brand rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center"
                >
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl" />
                  <p className="text-brand-100 font-medium mb-2 uppercase tracking-wide text-sm">Estimated Monthly Earnings</p>
                  <h3 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
                    {currency(monthlyEstimate.low)} - {currency(monthlyEstimate.high)}
                  </h3>
                  <p className="text-brand-50/80 text-sm leading-relaxed mb-8">
                    {langText(selectedCategory.label, selectedCategory.mrLabel)} estimate based on {usageDays} rental days for {visibleDistrict}. Final rates depend on machine condition, operator, and local demand.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                      <p className="text-brand-100 text-xs mb-1">Average Daily Rate</p>
                      <p className="font-bold text-xl">{currency(selectedCategory.rate)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                      <p className="text-brand-100 text-xs mb-1">Market Demand</p>
                      <p className="font-bold text-xl flex items-center gap-1">
                        {langText(selectedCategory.demand, selectedCategory.mrDemand)}
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
