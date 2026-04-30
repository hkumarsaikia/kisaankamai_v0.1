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

export default function OwnerBenefitsPage() {
  const { langText } = useLanguage();
  const earningsEstimateRef = useRef<HTMLElement | null>(null);
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
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <img alt="Modern tractor" className="h-48 w-full object-cover" src={ownerMachineImage} />
                    <div className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Mahindra 575 DI XP Plus</h3>
                          <p className="text-sm text-gray-500">{langText("47 HP Tractor", "४७ HP ट्रॅक्टर")}</p>
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          {langText("Verified", "पडताळलेले")}
                        </span>
                      </div>
                      <div className="space-y-3 border-t border-gray-100 pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{langText("Estimated Monthly Earnings", "अंदाजित मासिक कमाई")}</span>
                          <span className="font-bold text-gray-900">₹45,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{langText("Average Bookings", "सरासरी बुकिंग")}</span>
                          <span className="font-semibold text-gray-700">{langText("12 Days/Month", "दर महिन्याला १२ दिवस")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">{langText("Last Month's Earnings", "मागील महिन्याची कमाई")}</p>
                      <p className="text-lg font-bold text-gray-900">₹52,400</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                {langText("How Much Could You Earn?", "तुम्ही किती कमवू शकता?")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-300">
                {langText(
                  "Select your equipment type and see an estimate based on the local market in Maharashtra.",
                  "उपकरणाचा प्रकार निवडा आणि महाराष्ट्रातील स्थानिक बाजारावर आधारित अंदाज पहा."
                )}
              </p>
            </div>

            <div className="kk-form-section glass-card mx-auto max-w-5xl rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 lg:p-12">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div className="space-y-8">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-200">
                      {langText("Equipment Type", "उपकरणाचा प्रकार")}
                    </label>
                    <div className="relative">
                      <select
                        className="block w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-10 text-base font-medium text-gray-900 focus:border-[#143B2E] focus:outline-none focus:ring-[#143B2E] dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:text-sm"
                        value={selectedCategory.slug}
                        onChange={(event) => {
                          const next = ownerEarningCategories.find((category) => category.slug === event.target.value);
                          if (next) setSelectedCategory(next);
                        }}
                      >
                        {ownerEarningCategories.map((category) => (
                          <option key={category.slug} value={category.slug}>
                            {langText(`${category.label} - ${category.detail}`, `${category.mrLabel} - ${category.detail}`)}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <span className="material-symbols-outlined text-lg">expand_more</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-200">
                      {langText("Operating District", "कार्यरत जिल्हा")}
                    </label>
                    <div className="relative">
                      <select
                        className="max-h-64 block w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-10 text-base font-medium text-gray-900 focus:border-[#143B2E] focus:outline-none focus:ring-[#143B2E] dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:text-sm"
                        value={district}
                        onChange={(event) => setDistrict(event.target.value)}
                      >
                        {MAHARASHTRA_DISTRICTS.map((districtName) => (
                          <option key={districtName} value={districtName}>
                            {districtName}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <span className="material-symbols-outlined text-lg">expand_more</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#2d775f]">
                      {langText("More locations coming soon...", "अधिक ठिकाणे लवकरच येत आहेत...")}
                    </p>
                  </div>

                  <div>
                    <label className="mb-4 flex justify-between text-sm font-bold text-gray-700 dark:text-slate-200">
                      <span>{langText("Expected Usage", "अपेक्षित वापर")}</span>
                      <span className="text-[#143B2E] dark:text-[#a6cfbd]">
                        {usageDays} {langText("Days/Month", "दर महिन्याचे दिवस")}
                      </span>
                    </label>
                    <input
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#143B2E]"
                      max={25}
                      min={5}
                      type="range"
                      value={usageDays}
                      onChange={(event) => setUsageDays(Number(event.target.value))}
                    />
                    <div className="mt-2 flex justify-between text-xs font-medium text-gray-500">
                      <span>{langText("5 Days", "५ दिवस")}</span>
                      <span>{langText("25 Days", "२५ दिवस")}</span>
                    </div>
                  </div>
                </div>

                <section
                  ref={earningsEstimateRef}
                  id="earnings-estimate"
                  className="bg-gradient-brand relative flex flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#143B2E] to-[#265f4d] p-8 text-white scroll-mt-28"
                >
                  <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white opacity-5 blur-2xl" />
                  <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[#c2ecd9]">
                    {langText("Estimated Monthly Earnings", "अंदाजित मासिक कमाई")}
                  </p>
                  <h3 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {currency(monthlyEstimate.low)} - {currency(monthlyEstimate.high)}
                  </h3>
                  <p className="mb-8 text-sm leading-relaxed text-[#f0f5f3]/80">
                    {langText(
                      `${selectedCategory.label} estimate based on ${usageDays} rental days for ${district}. Final rates depend on machine condition, operator, and local demand.`,
                      `${district} जिल्ह्यात ${usageDays} भाडे दिवसांवर आधारित ${selectedCategory.mrLabel} अंदाज. अंतिम दर मशीनची स्थिती, ऑपरेटर आणि स्थानिक मागणीवर अवलंबून असतात.`
                    )}
                  </p>
                  <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="mb-1 text-xs text-[#c2ecd9]">{langText("Average Daily Rate", "सरासरी दैनिक दर")}</p>
                      <p className="text-xl font-bold">{currency(selectedCategory.rate)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="mb-1 text-xs text-[#c2ecd9]">{langText("Market Demand", "बाजार मागणी")}</p>
                      <p className="flex items-center gap-1 text-xl font-bold">
                        {langText(selectedCategory.demand, selectedCategory.mrDemand)}
                        <span className="material-symbols-outlined text-base text-green-400">trending_up</span>
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
