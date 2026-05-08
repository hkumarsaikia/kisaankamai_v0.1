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
  ownerUserId: string;
  ownerName: string;
  ownerLocation: string;
  ownerVerified: boolean;
  ownerPhotoUrl?: string;
  coverImage: string;
  galleryImages: string[];
  tags: string[];
  workTypes: string[];
  operatorIncluded: boolean;
  availableFrom?: string;
  status: "active" | "paused";
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

export type EquipmentAvailabilitySource = {
  status?: string | null;
  availableFrom?: string | null;
};

export type EquipmentAvailabilityState = {
  available: boolean;
  label: string;
  tone: "available" | "unavailable";
};

function todayIsoDate(referenceDate = new Date()) {
  return referenceDate.toISOString().slice(0, 10);
}

function normalizeAvailabilityDate(value?: string | null) {
  const candidate = typeof value === "string" ? value.trim().slice(0, 10) : "";
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : "";
}

export function isEquipmentCurrentlyAvailable(
  source: EquipmentAvailabilitySource,
  referenceDate = new Date()
) {
  if (source.status && source.status !== "active") {
    return false;
  }

  const availableFrom = normalizeAvailabilityDate(source.availableFrom);
  if (!availableFrom) {
    return true;
  }

  return availableFrom <= todayIsoDate(referenceDate);
}

export function getEquipmentAvailability(
  source: EquipmentAvailabilitySource,
  referenceDate = new Date()
): EquipmentAvailabilityState {
  const availableFrom = normalizeAvailabilityDate(source.availableFrom);
  const available = isEquipmentCurrentlyAvailable(source, referenceDate);

  if (available) {
    return {
      available: true,
      label: "Available",
      tone: "available",
    };
  }

  return {
    available: false,
    label: availableFrom ? `Available from ${availableFrom}` : "Not available",
    tone: "unavailable",
  };
}

export function sortEquipmentByAvailabilityPriceDistance<T extends EquipmentAvailabilitySource & {
  pricePerHour: number;
  distanceKm: number;
}>(items: T[], sortBy: "availability" | "price-asc" | "distance") {
  return [...items].sort((left, right) => {
    if (sortBy === "price-asc") {
      return left.pricePerHour - right.pricePerHour || left.distanceKm - right.distanceKm;
    }

    if (sortBy === "distance") {
      return left.distanceKm - right.distanceKm || left.pricePerHour - right.pricePerHour;
    }

    return (
      Number(isEquipmentCurrentlyAvailable(right)) -
        Number(isEquipmentCurrentlyAvailable(left)) ||
      left.pricePerHour - right.pricePerHour ||
      left.distanceKm - right.distanceKm
    );
  });
}

const DEPRECATED_EQUIPMENT_DESCRIPTION =
  "A premium tractor listing with verified operator support, strong PTO output, and regional owner coverage.";

export function sanitizeEquipmentDescription(description: string) {
  return description === DEPRECATED_EQUIPMENT_DESCRIPTION
    ? "A premium tractor listing with strong PTO output and regional owner coverage."
    : description;
}
