import { AppLink as Link } from "@/components/AppLink";
import { ContentImage } from "@/components/ContentImage";
import { getCategorySummariesFromEquipment } from "@/lib/equipment-categories";
import { getEquipmentList } from "@/lib/server/equipment";
import { assetPath } from "@/lib/site";

export default async function Categories() {
  const equipment = await getEquipmentList();
  const categories = getCategorySummariesFromEquipment(equipment);

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <main className="flex-grow py-24 bg-surface-container-lowest dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-black text-primary dark:text-emerald-50 mb-4 tracking-tight">
              Equipment categories
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg">
              Browse live agricultural equipment categories published by owners on Kisan Kamai.
            </p>
          </div>

          {categories.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/rent-equipment?query=${category.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-3xl shadow-xl cursor-pointer block bg-surface-container"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-3xl font-black text-white mb-2 tracking-wide">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {category.count} {category.count === 1 ? "listing" : "listings"}{" "}
                      <span className="material-symbols-outlined">chevron_right</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <section className="rounded-3xl border border-outline-variant bg-white px-6 py-16 text-center shadow-sm dark:bg-slate-900">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-container/10">
                <span className="material-symbols-outlined text-5xl text-primary-container">
                  category
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-primary dark:text-emerald-50">
                No live categories yet
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
                Categories appear here automatically when owners publish complete live listings.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/list-equipment"
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white"
                >
                  List equipment
                </Link>
                <Link
                  href="/rent-equipment"
                  className="rounded-xl border border-outline-variant px-6 py-3 text-sm font-bold text-primary"
                >
                  Search equipment
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
