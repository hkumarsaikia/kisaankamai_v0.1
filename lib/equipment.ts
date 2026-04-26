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
  hp: string;
  distanceKm: number;
  ownerName: string;
  ownerLocation: string;
  ownerVerified: boolean;
  coverImage: string;
  galleryImages: string[];
  tags: string[];
  workTypes: string[];
  operatorIncluded: boolean;
}

const DEPRECATED_EQUIPMENT_DESCRIPTION =
  "A premium tractor listing with verified operator support, strong PTO output, and regional owner coverage.";

export function sanitizeEquipmentDescription(description: string) {
  return description === DEPRECATED_EQUIPMENT_DESCRIPTION
    ? "A premium tractor listing with strong PTO output and regional owner coverage."
    : description;
}
