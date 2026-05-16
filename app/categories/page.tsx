import { AppLink as Link } from "@/components/AppLink";
import { ContentImage } from "@/components/ContentImage";
import { LocalizedText } from "@/components/LocalizedText";
import { getMergedCategorySummariesFromEquipment } from "@/lib/equipment-categories";
import { buildProgrammaticCategoryPath } from "@/lib/programmatic-seo";
import { getEquipmentList } from "@/lib/server/equipment";
import { assetPath } from "@/lib/site";

const categoryMarathiNames: Record<string, string> = {
  balers: "बेलर्स",
  harvesters: "हार्वेस्टर्स",
  implements: "अवजारे",
  ploughs: "नांगर",
  pumps: "पंप",
  rotavators: "रोटाव्हेटर",
  seeders: "सीडर्स",
  sprayers: "स्प्रेअर्स",
  threshers: "थ्रेशर्स",
  tractors: "ट्रॅक्टर्स",
  trolleys: "ट्रॉली",
};

export default async function Categories() {
  const equipment = await getEquipmentList();
  const categories = getMergedCategorySummariesFromEquipment(equipment);

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <main className="flex-grow py-24 bg-surface-container-lowest dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-black text-primary dark:text-emerald-50 mb-4 tracking-tight">
              <LocalizedText en="Equipment categories" mr="उपकरण श्रेणी" />
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg">
              <LocalizedText
                en="Browse live agricultural equipment categories published by owners on Kisan Kamai."
                mr="किसान कमाईवर मालकांनी प्रकाशित केलेल्या कृषी उपकरणांच्या श्रेणी पहा."
              />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={buildProgrammaticCategoryPath(category.slug)}
                className="group relative aspect-square overflow-hidden rounded-3xl border border-outline-variant bg-surface-container shadow-xl cursor-pointer block"
              >
                {category.coverImage ? (
                  <ContentImage
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={category.name}
                    src={assetPath(category.coverImage)}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary-container/10">
                    <span className="material-symbols-outlined text-7xl text-primary-container/50">
                      agriculture
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/92 via-primary/25 to-transparent dark:from-slate-950/95 dark:via-slate-950/35"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-3xl font-black text-white mb-2 tracking-wide">
                    <LocalizedText en={category.name} mr={categoryMarathiNames[category.slug] || category.name} />
                  </h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <LocalizedText
                      en={`${category.count} ${category.count === 1 ? "listing" : "listings"}`}
                      mr={`${category.count} लिस्टिंग`}
                    />{" "}
                    <span className="material-symbols-outlined">chevron_right</span>
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
