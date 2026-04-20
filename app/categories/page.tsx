"use client";

import { ContentImage } from "@/components/ContentImage";
import { useLanguage } from "@/components/LanguageContext";
import { AppLink as Link } from "@/components/AppLink";
import { assetPath } from "@/lib/site";

export default function Categories() {
  const { t } = useLanguage();

  const categories = [
    { id: "tractors", img: assetPath("/assets/generated/hero_tractor.png"), nameKey: "categories.tractors" },
    { id: "harvesters", img: assetPath("/assets/generated/harvester_action.png"), nameKey: "categories.harvesters" },
    { id: "implements", img: assetPath("/assets/generated/implement_4k.png"), nameKey: "categories.implements" },
    { id: "ploughs", img: assetPath("/assets/generated/plough_4k.png"), nameKey: "categories.ploughs" },
    { id: "sprayers", img: assetPath("/assets/generated/sprayer.png"), nameKey: "categories.sprayers" },
    { id: "rotavators", img: assetPath("/assets/generated/rotavator.png"), nameKey: "categories.rotavators" },
    { id: "seeders", img: assetPath("/assets/generated/seed_drill.png"), nameKey: "categories.seeders" },
    { id: "threshers", img: assetPath("/assets/generated/thresher_4k.png"), nameKey: "categories.threshers" },
    { id: "pumps", img: assetPath("/assets/generated/water_pump.png"), nameKey: "categories.water_pumps" },
    { id: "balers", img: assetPath("/assets/generated/baler_4k.png"), nameKey: "categories.balers" },
    { id: "trolleys", img: assetPath("/assets/generated/trolley.png"), nameKey: "categories.trolleys_trailers" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <main className="flex-grow py-24 bg-surface-container-lowest dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-black text-primary dark:text-emerald-50 mb-4 tracking-tight">{t("categories.all_equipment_categories")}</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg">{t("categories.browse_our_extensive_range_of_agricultural_equipment_to_find_exactly_what_you_need")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/rent-equipment?query=${cat.id}`} className="group relative aspect-square overflow-hidden rounded-3xl shadow-xl cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={t(cat.nameKey)} src={cat.img} loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-3xl font-black text-white mb-2 tracking-wide">{t(cat.nameKey)}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("categories.browse_models")} <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
