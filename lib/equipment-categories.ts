import type { EquipmentRecord } from "@/lib/equipment";

export interface EquipmentCategorySummary {
  slug: string;
  name: string;
  category: string;
  count: number;
  coverImage: string;
  sampleListingId: string;
}

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
