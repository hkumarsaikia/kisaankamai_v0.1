import type { EquipmentRecord } from "@/lib/equipment";

export interface EquipmentCategorySummary {
  slug: string;
  name: string;
  category: string;
  count: number;
  coverImage: string;
  sampleListingId: string;
}

export const BASE_EQUIPMENT_CATEGORIES: EquipmentCategorySummary[] = [
  {
    slug: "tractors",
    name: "Tractors",
    category: "tractor",
    count: 0,
    coverImage: "/assets/generated/hero_tractor.webp",
    sampleListingId: "",
  },
  {
    slug: "harvesters",
    name: "Harvesters",
    category: "harvester",
    count: 0,
    coverImage: "/assets/generated/harvester_action.webp",
    sampleListingId: "",
  },
  {
    slug: "implements",
    name: "Implements",
    category: "implement",
    count: 0,
    coverImage: "/assets/generated/implement_4k.webp",
    sampleListingId: "",
  },
  {
    slug: "ploughs",
    name: "Ploughs",
    category: "plough",
    count: 0,
    coverImage: "/assets/generated/plough_4k.webp",
    sampleListingId: "",
  },
  {
    slug: "sprayers",
    name: "Sprayers",
    category: "sprayer",
    count: 0,
    coverImage: "/assets/generated/sprayer.webp",
    sampleListingId: "",
  },
  {
    slug: "rotavators",
    name: "Rotavators",
    category: "rotavator",
    count: 0,
    coverImage: "/assets/generated/rotavator.webp",
    sampleListingId: "",
  },
  {
    slug: "seeders",
    name: "Seeders",
    category: "seeder",
    count: 0,
    coverImage: "/assets/generated/seed_drill.webp",
    sampleListingId: "",
  },
  {
    slug: "threshers",
    name: "Threshers",
    category: "thresher",
    count: 0,
    coverImage: "/assets/generated/thresher_4k.webp",
    sampleListingId: "",
  },
  {
    slug: "pumps",
    name: "Pumps",
    category: "pump",
    count: 0,
    coverImage: "/assets/generated/water_pump.webp",
    sampleListingId: "",
  },
  {
    slug: "balers",
    name: "Balers",
    category: "baler",
    count: 0,
    coverImage: "/assets/generated/baler_4k.webp",
    sampleListingId: "",
  },
  {
    slug: "trolleys",
    name: "Trolleys",
    category: "trolley",
    count: 0,
    coverImage: "/assets/generated/trolley.webp",
    sampleListingId: "",
  },
];

export function normalizeCategorySlug(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "equipment"
  );
}

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getCategoryDisplayName(item: EquipmentRecord) {
  const categoryLabelName = item.categoryLabel.split("•")[0]?.trim();
  return categoryLabelName || toTitleCase(item.category || "equipment");
}

function preserveBaseCoverImage(existing: EquipmentCategorySummary) {
  return {
    coverImage: existing.coverImage,
  };
}

export function getCategorySummariesFromEquipment(items: EquipmentRecord[]) {
  const summaries = new Map<string, EquipmentCategorySummary>();

  for (const item of items) {
    const category = item.category.trim().toLowerCase() || "equipment";
    const slug = normalizeCategorySlug(category);
    const current = summaries.get(slug);

    if (current) {
      current.count += 1;
      if (!current.coverImage && item.coverImage) {
        current.coverImage = item.coverImage;
      }
      continue;
    }

    summaries.set(slug, {
      slug,
      name: getCategoryDisplayName(item),
      category,
      count: 1,
      coverImage: item.coverImage,
      sampleListingId: item.id,
    });
  }

  return Array.from(summaries.values()).sort(
    (left, right) => right.count - left.count || left.name.localeCompare(right.name)
  );
}

export function getMergedCategorySummariesFromEquipment(items: EquipmentRecord[]) {
  const summaries = new Map<string, EquipmentCategorySummary>();

  for (const category of BASE_EQUIPMENT_CATEGORIES) {
    summaries.set(category.slug, { ...category });
  }

  for (const liveCategory of getCategorySummariesFromEquipment(items)) {
    const baseSlug = normalizeCategorySlug(`${liveCategory.slug}s`);
    const existing =
      summaries.get(liveCategory.slug) ||
      summaries.get(baseSlug) ||
      summaries.get(normalizeCategorySlug(liveCategory.category));

    if (existing) {
      const nextSlug = existing.slug;
      summaries.set(nextSlug, {
        ...existing,
        name: existing.name || liveCategory.name,
        category: liveCategory.category || existing.category,
        count: liveCategory.count,
        ...preserveBaseCoverImage(existing),
        sampleListingId: liveCategory.sampleListingId,
      });
      continue;
    }

    summaries.set(liveCategory.slug, liveCategory);
  }

  return Array.from(summaries.values()).sort(
    (left, right) => right.count - left.count || left.name.localeCompare(right.name)
  );
}
