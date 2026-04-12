"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import Link from "next/link";
import { assetPath } from "@/lib/site";

export default function Categories() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow py-24 bg-surface-container-lowest dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-black text-primary dark:text-emerald-50 mb-4 tracking-tight">{langText("All Equipment Categories", "सर्व उपकरण श्रेणी")}</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg">{langText("Browse our extensive range of agricultural equipment to find exactly what you need.", "आपल्याला नेमके काय हवे आहे हे शोधण्यासाठी आमच्या कृषी उपकरणांची विस्तृत श्रेणी ब्राउझ करा.")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: "tractors", img: assetPath("/assets/generated/hero_tractor.png"), name: "Tractors", mrName: "ट्रॅक्टर्स" },
              { id: "harvesters", img: assetPath("/assets/generated/harvester_action.png"), name: "Harvesters", mrName: "हार्वेस्टर्स" },
              { id: "implements", img: assetPath("/assets/generated/implement_4k.png"), name: "Implements", mrName: "उपकरणे" },
              { id: "ploughs", img: assetPath("/assets/generated/plough_4k.png"), name: "Ploughs", mrName: "नांगर" },
              { id: "sprayers", img: assetPath("/assets/generated/sprayer.png"), name: "Sprayers", mrName: "फवारणी यंत्रे" },
              { id: "rotavators", img: assetPath("/assets/generated/rotavator.png"), name: "Rotavators", mrName: "रोटाव्हेटर्स" },
              { id: "seeders", img: assetPath("/assets/generated/seed_drill.png"), name: "Seeders", mrName: "सीडर्स" },
              { id: "threshers", img: assetPath("/assets/generated/thresher_4k.png"), name: "Threshers", mrName: "थ्रेशर्स" },
              { id: "pumps", img: assetPath("/assets/generated/water_pump.png"), name: "Water Pumps", mrName: "पाण्याचे पंप" },
              { id: "balers", img: assetPath("/assets/generated/baler_4k.png"), name: "Balers", mrName: "बेलर्स" },
              { id: "trolleys", img: assetPath("/assets/generated/trolley.png"), name: "Trolleys & Trailers", mrName: "ट्रॉली आणि ट्रेलर्स" }
            ].map(cat => (
              <Link key={cat.id} href={`/models?category=${cat.id}`} className="group relative h-[400px] overflow-hidden rounded-3xl shadow-xl cursor-pointer block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name} src={cat.img} loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-3xl font-black text-white mb-2 tracking-wide">{langText(cat.name, cat.mrName)}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {langText("Browse Models", "मॉडेल्स पहा")} <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

