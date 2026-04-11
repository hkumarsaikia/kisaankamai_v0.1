"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { assetPath } from "@/lib/site";

const modelData: Record<string, { en: string, mr: string, items: { name: string, hp: string, img: string }[] }> = {
  tractors: {
    en: "Tractors", mr: "ट्रॅक्टर्स",
    items: [
      { name: "Mahindra Novo 575 DI", hp: "45 HP", img: assetPath("/assets/generated/maha_tractor.png") },
      { name: "Swaraj 744 FE", hp: "48 HP", img: assetPath("/assets/generated/hero_tractor.png") },
      { name: "John Deere 5310", hp: "55 HP", img: assetPath("/assets/generated/modern_farm_tech.png") }
    ]
  },
  harvesters: {
    en: "Harvesters", mr: "हार्वेस्टर्स",
    items: [
      { name: "John Deere W70 Combine", hp: "100 HP", img: assetPath("/assets/generated/maha_harvester.png") },
      { name: "Preet 987", hp: "76 HP", img: assetPath("/assets/generated/harvester_action.png") }
    ]
  },
  ploughs: {
    en: "Ploughs", mr: "नांगर",
    items: [
      { name: "Lemken Reversible", hp: "Suitable for 45+ HP", img: assetPath("/assets/generated/plough_4k.png") }
    ]
  },
  sprayers: {
    en: "Sprayers", mr: "फवारणी यंत्रे",
    items: [
      { name: "ASPEE Boom Sprayer", hp: "Tractor Mounted", img: assetPath("/assets/generated/sprayer.png") }
    ]
  },
  implements: {
    en: "Implements", mr: "उपकरणे",
    items: [
        { name: "Shaktiman Rotavator", hp: "6 ft width", img: assetPath("/assets/generated/maha_implement.png") }
    ]
  }
};

function ModelsInner() {
  const { langText } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryParam = searchParams.get("category") || "tractors";
  const category = modelData[categoryParam] ? modelData[categoryParam] : modelData.tractors;

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow py-16 bg-surface-container-lowest dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary font-bold mb-8 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            {langText("Back to Categories", "श्रेणींवर परत जा")}
          </button>
          
          <div className="mb-12">
            <h1 className="text-4xl font-black text-primary dark:text-emerald-50 mb-2">
              {langText(`${category.en} Models`, `${category.mr} मॉडेल्स`)}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {langText(`Select a model to view available listings and start renting.`, `उपलब्ध सूची पाहण्यासाठी आणि भाड्याने देण्यासाठी मॉडेल निवडा.`)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.items.map((item) => (
              <div key={item.name} className="bg-white dark:bg-slate-900/40 rounded-2xl overflow-hidden shadow-lg border border-outline-variant/20 dark:border-slate-800/50 hover:shadow-xl transition-all">
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary dark:text-emerald-50">{item.name}</h3>
                  <div className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 mb-4">
                    {item.hp}
                  </div>
                  <Link href={`/rent-equipment?query=${encodeURIComponent(item.name)}`} className="block w-full text-center bg-secondary text-white py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors">
                    {langText("View Listings", "सूची पहा")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Models() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ModelsInner />
    </Suspense>
  );
}

