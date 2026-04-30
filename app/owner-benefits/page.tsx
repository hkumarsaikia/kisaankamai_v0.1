"use client";

import { useMemo, useRef, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { ContentImage } from "@/components/ContentImage";
import { useLanguage } from "@/components/LanguageContext";
import { MAHARASHTRA_DISTRICTS } from "@/lib/auth/india-districts";
import { BASE_EQUIPMENT_CATEGORIES } from "@/lib/equipment-categories";
import { assetPath } from "@/lib/site";

const categoryDetails: Record<
  string,
  {
    label: string;
    mrLabel: string;
    detail: string;
    rate: number;
    demand: string;
    mrDemand: string;
    icon: string;
  }
> = {
  tractors: {
    label: "Tractor",
    mrLabel: "ट्रॅक्टर",
    detail: "45HP+",
    rate: 3500,
    demand: "High",
    mrDemand: "उच्च",
    icon: "agriculture",
  },
  harvesters: {
    label: "Harvester",
    mrLabel: "हार्वेस्टर",
    detail: "Combine",
    rate: 7200,
    demand: "Seasonal peak",
    mrDemand: "हंगामी उच्च",
    icon: "precision_manufacturing",
  },
  implements: {
    label: "Implement",
    mrLabel: "इम्प्लिमेंट",
    detail: "Multi-use",
    rate: 2200,
    demand: "Steady",
    mrDemand: "स्थिर",
    icon: "build",
  },
  ploughs: {
    label: "Plough",
    mrLabel: "नांगर",
    detail: "Hydraulic",
    rate: 1800,
    demand: "Steady",
    mrDemand: "स्थिर",
    icon: "construction",
  },
  sprayers: {
    label: "Sprayer",
    mrLabel: "स्प्रेयर",
    detail: "Boom or orchard",
    rate: 1900,
    demand: "Crop cycle",
    mrDemand: "पीक चक्र",
    icon: "water_drop",
  },
  rotavators: {
    label: "Rotavator",
    mrLabel: "रोटाव्हेटर",
    detail: "6 ft",
    rate: 2400,
    demand: "High",
    mrDemand: "उच्च",
    icon: "settings_input_component",
  },
  seeders: {
    label: "Seed Drill",
    mrLabel: "सीड ड्रिल",
    detail: "Multi-crop",
    rate: 2100,
    demand: "Seasonal",
    mrDemand: "हंगामी",
    icon: "grass",
  },
  threshers: {
    label: "Thresher",
    mrLabel: "थ्रेशर",
    detail: "Crop processing",
    rate: 4300,
    demand: "Seasonal peak",
    mrDemand: "हंगामी उच्च",
    icon: "precision_manufacturing",
  },
  pumps: {
    label: "Pump",
    mrLabel: "पंप",
    detail: "Irrigation",
    rate: 1400,
    demand: "Crop cycle",
    mrDemand: "पीक चक्र",
    icon: "water",
  },
  balers: {
    label: "Baler",
    mrLabel: "बेलर",
    detail: "Straw baling",
    rate: 5200,
    demand: "Seasonal",
    mrDemand: "हंगामी",
    icon: "inventory_2",
  },
  trolleys: {
    label: "Trolley",
    mrLabel: "ट्रॉली",
    detail: "Farm haulage",
    rate: 1600,
    demand: "Steady",
    mrDemand: "स्थिर",
    icon: "local_shipping",
  },
  cultivators: {
    label: "Cultivator",
    mrLabel: "कल्टीवेटर",
    detail: "9 tine",
    rate: 1750,
    demand: "Steady",
    mrDemand: "स्थिर",
    icon: "agriculture",
  },
};

const ownerEarningCategories = [
  ...BASE_EQUIPMENT_CATEGORIES.map((category) => ({
    slug: category.slug,
    ...categoryDetails[category.slug],
  })),
  {
    slug: "cultivators",
    ...categoryDetails.cultivators,
  },
].filter((category) => category.label);

type OwnerEarningCategory = (typeof ownerEarningCategories)[number];

export default function OwnerBenefitsPage() {
  const { langText } = useLanguage();
  const earningsEstimateRef = useRef<HTMLElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<OwnerEarningCategory>(
    ownerEarningCategories[0]
  );
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
  const scrollToEstimate = () => {
    earningsEstimateRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <main className="pt-20">
        <section className="relative flex min-h-[704px] items-center overflow-hidden bg-primary-container">
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
              <p className="text-sm font-black uppercase tracking-[0.32em] text-amber-200">
                {langText("Owner Opportunity", "मालकांसाठी संधी")}
              </p>
              <h1 className="font-headline text-5xl font-extrabold leading-tight text-white drop-shadow-2xl md:text-7xl">
                {langText("Your Equipment, Your Growth.", "तुमची उपकरणे, तुमची वाढ.")}
              </h1>
              <p className="max-w-2xl text-lg font-semibold leading-relaxed text-white drop-shadow-lg md:text-xl">
                {langText(
                  "Turn idle farm machinery into a steady income stream with verified local rental requests and transparent owner support.",
                  "पडून असलेली शेती यंत्रे पडताळलेल्या स्थानिक भाडे विनंत्यांमधून नियमित उत्पन्नात बदला."
                )}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="kk-flow-button inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-8 py-4 text-base font-black text-primary shadow-xl transition hover:bg-amber-200"
                >
                  {langText("Start Now", "आता सुरू करा")}
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </Link>
                <button
                  type="button"
                  onClick={scrollToEstimate}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/12 px-8 py-4 text-base font-black text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  {langText("View Earnings Estimate", "कमाईचा अंदाज पहा")}
                  <span className="material-symbols-outlined text-xl">south</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
            {[
              {
                icon: "verified_user",
                title: langText("Verified renters", "पडताळलेले भाडेकरू"),
                copy: langText(
                  "Every request is reviewed before handoff so owners stay in control.",
                  "प्रत्येक विनंती हस्तांतरणापूर्वी तपासली जाते, त्यामुळे मालकाचे नियंत्रण राहते."
                ),
              },
              {
                icon: "payments",
                title: langText("Clear earning estimates", "स्पष्ट कमाई अंदाज"),
                copy: langText(
                  "Estimate monthly rental potential from local daily rates and expected usage.",
                  "स्थानिक दैनिक दर आणि अपेक्षित वापरावरून मासिक भाडे क्षमता पहा."
                ),
              },
              {
                icon: "support_agent",
                title: langText("Human coordination", "मानवी समन्वय"),
                copy: langText(
                  "The support team helps with listing, renter calls, and service-area questions.",
                  "लिस्टिंग, भाडेकरू कॉल आणि सेवा क्षेत्रासाठी सपोर्ट टीम मदत करते."
                ),
              },
            ].map((item) => (
              <article
                key={item.icon}
                className="kk-depth-tile rounded-3xl border border-outline-variant bg-surface-container-lowest p-7 shadow-sm"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-white">
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <h2 className="text-xl font-black text-primary">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section ref={earningsEstimateRef} id="earnings-estimate" className="relative overflow-hidden bg-surface py-24 scroll-mt-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-primary-container">
                {langText("Earnings calculator", "कमाई कॅल्क्युलेटर")}
              </p>
              <h2 className="font-headline text-4xl font-extrabold text-primary dark:text-emerald-50">
                {langText("Estimated Monthly Earnings", "अंदाजित मासिक कमाई")}
              </h2>
              <p className="mt-4 font-medium text-on-surface-variant">
                {langText(
                  "Select equipment, district, and expected monthly usage to estimate owner earnings.",
                  "उपकरण, जिल्हा आणि अपेक्षित मासिक वापर निवडून मालकाची अंदाजित कमाई पहा."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="kk-form-section space-y-8 p-8 lg:col-span-1">
                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-primary dark:text-emerald-400">
                    {langText("Equipment Type", "उपकरण प्रकार")}
                  </label>
                  <div className="relative">
                    <select
                      className="kk-select-control w-full appearance-none rounded-xl border border-outline-variant bg-surface-container-lowest bg-none px-4 py-3 pr-12 text-on-surface focus:border-primary focus:ring-primary"
                      value={selectedCategory.label}
                      onChange={(event) => {
                        const nextCategory = ownerEarningCategories.find(
                          (category) => category.label === event.target.value
                        );
                        if (nextCategory) {
                          setSelectedCategory(nextCategory);
                        }
                      }}
                    >
                      {ownerEarningCategories.map((category) => (
                        <option key={category.slug} value={category.label}>
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
                    {langText("Operating Districts", "कार्यरत जिल्हे")}
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
                    <p className="px-4 py-3 text-sm font-bold text-on-surface-variant">
                      {langText("More locations coming soon...", "अधिक ठिकाणे लवकरच येत आहेत...")}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-primary dark:text-emerald-400">
                    {langText("Expected Usage (Days/Month)", "अपेक्षित वापर (दिवस/महिना)")}
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
                    <span>{langText("5 Days", "५ दिवस")}</span>
                    <span>
                      {usageDays} {langText("days", "दिवस")}
                    </span>
                    <span>{langText("25 Days", "२५ दिवस")}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                <div className="kk-depth-tile relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-3xl bg-primary-container p-8 text-white md:p-10">
                  <div className="relative z-10">
                    <span className="text-sm font-bold uppercase tracking-widest text-emerald-200">
                      {langText("Estimated Monthly Earnings", "अंदाजित मासिक कमाई")}
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
                        {langText("Avg. Daily Rate", "सरासरी दैनिक दर")}
                      </span>
                      <span className="text-lg font-bold">{currency(selectedCategory.rate)}</span>
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2">
                      <span className="block text-[10px] font-bold uppercase text-emerald-200">
                        {langText("Market Demand", "बाजार मागणी")}
                      </span>
                      <span className="text-lg font-bold">
                        {langText(selectedCategory.demand, selectedCategory.mrDemand)}
                      </span>
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2">
                      <span className="block text-[10px] font-bold uppercase text-emerald-200">
                        {langText("Operational District", "कार्यरत जिल्हा")}
                      </span>
                      <span className="text-lg font-bold">{district}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[200px] text-white opacity-5">
                    {selectedCategory.icon}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
