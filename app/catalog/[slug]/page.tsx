import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppLink as Link } from "@/components/AppLink";
import { ContentImage } from "@/components/ContentImage";
import {
  buildProgrammaticCategoryPath,
  getIndexableProgrammaticCategoryPages,
  getProgrammaticCategoryPage,
  type ProgrammaticCategoryPage,
} from "@/lib/programmatic-seo";
import { normalizeCategorySlug } from "@/lib/equipment-categories";
import { getEquipmentList } from "@/lib/server/equipment";
import { buildPageMetadata, SITE_DOMAIN } from "@/lib/site-metadata";
import { assetPath } from "@/lib/site";
import { DETAIL_ROUTE_TEMPLATE } from "@/lib/discovery-routes";
import type { EquipmentRecord } from "@/lib/equipment";

export function generateStaticParams() {
  return getIndexableProgrammaticCategoryPages().map((category) => ({ slug: category.slug }));
}

type CatalogPageProps = {
  params: Promise<{ slug: string }>;
};

function categoryMatches(item: EquipmentRecord, category: ProgrammaticCategoryPage) {
  const itemSlugs = new Set([
    normalizeCategorySlug(item.category),
    normalizeCategorySlug(`${item.category}s`),
    normalizeCategorySlug(item.categoryLabel.split("•")[0] || item.category),
  ]);

  return itemSlugs.has(category.slug) || item.category === category.category;
}

function buildCategoryJsonLd(category: ProgrammaticCategoryPage, listings: EquipmentRecord[]) {
  const url = `${SITE_DOMAIN}${buildProgrammaticCategoryPath(category.slug)}`;
  const itemList = listings.slice(0, 6).map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_DOMAIN}${DETAIL_ROUTE_TEMPLATE(item.id)}`,
    name: item.name,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: category.title,
        description: category.metaDescription,
        url,
        isPartOf: {
          "@id": `${SITE_DOMAIN}/#website`,
        },
        about: {
          "@type": "Thing",
          name: category.name,
        },
        mainEntity:
          itemList.length > 0
            ? {
                "@type": "ItemList",
                itemListElement: itemList,
              }
            : undefined,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_DOMAIN,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Equipment categories",
            item: `${SITE_DOMAIN}/categories`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.name,
            item: url,
          },
        ],
      },
    ],
  };
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getProgrammaticCategoryPage(slug);

  if (!category) {
    notFound();
  }

  return buildPageMetadata({
    title: category.title,
    description: category.metaDescription,
    path: buildProgrammaticCategoryPath(category.slug),
    imagePath: "/assets/share/pages/categories.jpg",
    imageAlt: `${category.name} on Kisan Kamai`,
  });
}

export default async function CatalogCategoryPage({ params }: CatalogPageProps) {
  const { slug } = await params;
  const category = getProgrammaticCategoryPage(slug);

  if (!category) {
    notFound();
  }

  const equipment = await getEquipmentList();
  const categoryListings = equipment.filter((item) => categoryMatches(item, category));
  const relatedCategories = category.relatedCategorySlugs
    .map((relatedSlug) => getProgrammaticCategoryPage(relatedSlug))
    .filter(Boolean) as ProgrammaticCategoryPage[];
  const liveInventoryHref = `/rent-equipment?query=${encodeURIComponent(category.slug)}`;
  const jsonLd = buildCategoryJsonLd(category, categoryListings);

  return (
    <main className="min-h-screen bg-background text-on-background dark:bg-slate-950 dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-12 pt-28 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-secondary dark:text-emerald-300">
            Kisan Kamai equipment guide
          </p>
          <h1 className="max-w-4xl font-headline text-4xl font-black leading-tight tracking-tight text-primary dark:text-emerald-50 md:text-6xl">
            {category.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-on-surface-variant dark:text-slate-300">
            {category.intro}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={liveInventoryHref}
              className="inline-flex items-center justify-center rounded-xl bg-primary-container px-6 py-3 text-sm font-black text-white transition-colors hover:bg-primary dark:text-primary-fixed"
            >
              View live {category.name.toLowerCase()}
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest px-6 py-3 text-sm font-black text-primary transition-colors hover:bg-surface-container dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-100"
            >
              Browse all categories
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <ContentImage
            alt={`${category.name} equipment`}
            className="h-72 w-full object-cover"
            src={assetPath(category.coverImage)}
            sizes="(max-width: 1024px) 100vw, 400px"
            priority
          />
          <div className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">
              Live inventory signal
            </p>
            <p className="mt-2 text-3xl font-black text-primary dark:text-emerald-50">
              {categoryListings.length.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">
              {categoryListings.length === 1 ? "published listing" : "published listings"} in this category right now.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 md:grid-cols-3">
        <article className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-headline text-2xl font-black text-primary dark:text-emerald-50">Best for</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-on-surface-variant dark:text-slate-300">
            {category.bestFor.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-2">
          <h2 className="font-headline text-2xl font-black text-primary dark:text-emerald-50">How to choose</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {category.selectionTips.map((tip) => (
              <div key={tip} className="rounded-xl bg-surface-container-low p-4 text-sm leading-6 text-on-surface-variant dark:bg-slate-950 dark:text-slate-300">
                {tip}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">
                Safety note
              </p>
              <p className="mt-2 max-w-3xl text-base leading-7 text-on-surface-variant dark:text-slate-300">
                {category.safetyNote}
              </p>
            </div>
            <Link
              href="/terms"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-outline-variant px-5 py-3 text-sm font-black text-primary hover:bg-surface-container dark:border-slate-700 dark:text-emerald-100"
            >
              Read safety guidelines
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-3xl font-black text-primary dark:text-emerald-50">
              Live {category.name.toLowerCase()} listings
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
              Listings shown here come from currently public owner-published equipment.
            </p>
          </div>
          <Link href={liveInventoryHref} className="text-sm font-black text-primary hover:underline dark:text-emerald-200">
            Open full live search
          </Link>
        </div>
        {categoryListings.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categoryListings.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                href={DETAIL_ROUTE_TEMPLATE(item.id)}
                className="group overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <ContentImage
                  alt={item.name}
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  src={assetPath(item.coverImage)}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="p-5">
                  <h3 className="font-headline text-xl font-black text-primary dark:text-emerald-50">{item.name}</h3>
                  <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
                    {item.location}, {item.district}, {item.state}
                  </p>
                  <p className="mt-3 text-lg font-black text-primary dark:text-emerald-100">
                    ₹{item.pricePerHour.toLocaleString("en-IN")}{" "}
                    <span className="text-sm font-medium text-on-surface-variant dark:text-slate-400">/ hour</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-headline text-2xl font-black text-primary dark:text-emerald-50">
              No live {category.name.toLowerCase()} listings are published right now
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant dark:text-slate-400">
              The category page remains available as a guide, and new public listings will appear here automatically after owners publish them.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8">
        <h2 className="font-headline text-3xl font-black text-primary dark:text-emerald-50">Related equipment categories</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {relatedCategories.map((relatedCategory) => (
            <Link
              key={relatedCategory.slug}
              href={buildProgrammaticCategoryPath(relatedCategory.slug)}
              className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm transition-colors hover:bg-surface-container dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">
                Related guide
              </p>
              <h3 className="mt-2 font-headline text-xl font-black text-primary dark:text-emerald-50">
                {relatedCategory.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant dark:text-slate-400">
                {relatedCategory.metaDescription}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
