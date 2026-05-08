export interface EquipmentRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  location: string;
  district: string;
  state: string;
  description: string;
  pricePerHour: number;
  unitLabel: string;
  rating: number;
  ratingCount: number;
  hp: string;
  distanceKm: number;
  ownerName: string;
  ownerLocation: string;
  ownerVerified: boolean;
  ownerPhotoUrl?: string;
  coverImage: string;
  galleryImages: string[];
  tags: string[];
  workTypes: string[];
  operatorIncluded: boolean;
}

export type EquipmentRatingSource = {
  rating?: number | null;
  ratingCount?: number | null;
  reviewCount?: number | null;
  ratingsCount?: number | null;
};

function normalizeRatingNumber(value: number | null | undefined) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

export function getEquipmentRatingCount(source: EquipmentRatingSource) {
  return Math.max(
    0,
    normalizeRatingNumber(source.ratingCount),
    normalizeRatingNumber(source.reviewCount),
    normalizeRatingNumber(source.ratingsCount)
  );
}

export function getVisibleEquipmentRating(source: EquipmentRatingSource) {
  const rating = normalizeRatingNumber(source.rating);
  const ratingCount = getEquipmentRatingCount(source);

  if (rating <= 0 || ratingCount <= 0) {
    return null;
  }

  return {
    value: Math.min(5, rating),
    count: ratingCount,
  };
}

const DEPRECATED_EQUIPMENT_DESCRIPTION =
  "A premium tractor listing with verified operator support, strong PTO output, and regional owner coverage.";

export function sanitizeEquipmentDescription(description: string) {
  return description === DEPRECATED_EQUIPMENT_DESCRIPTION
    ? "A premium tractor listing with strong PTO output and regional owner coverage."
    : description;
}
