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

export const MOCK_EQUIPMENT: EquipmentRecord[] = [
  {
    id: "1",
    slug: "mahindra-novo-575-di",
    name: "Mahindra Novo 575 DI",
    category: "tractor",
    categoryLabel: "Tractor • Mahindra",
    location: "Kalwan Area",
    district: "Nashik",
    state: "Maharashtra",
    description:
      "A reliable mid-range tractor suited for ploughing, sowing, and transport with strong local support coverage.",
    pricePerHour: 800,
    unitLabel: "per hour",
    rating: 4.9,
    hp: "45 HP",
    distanceKm: 4.2,
    ownerName: "Rahul Patil",
    ownerLocation: "Kalwan, Nashik",
    ownerVerified: true,
    coverImage: "/assets/generated/maha_tractor.png",
    galleryImages: [
      "/assets/generated/maha_tractor.png",
      "/assets/generated/hero_tractor.png",
      "/assets/generated/modern_farm_tech.png",
    ],
    tags: ["Power Steering", "2022 Model", "Verified"],
    workTypes: ["Ploughing", "Transport", "Rotavator"],
    operatorIncluded: true,
  },
  {
    id: "2",
    slug: "john-deere-w70-combine",
    name: "John Deere W70 Combine",
    category: "harvester",
    categoryLabel: "Harvester • John Deere",
    location: "Mukhed Area",
    district: "Nanded",
    state: "Maharashtra",
    description:
      "A high-capacity combine harvester ideal for peak harvest windows where fast turnaround matters.",
    pricePerHour: 2500,
    unitLabel: "per hour",
    rating: 4.7,
    hp: "100 HP",
    distanceKm: 8.5,
    ownerName: "Sangli Agri-Hub",
    ownerLocation: "Mukhed, Nanded",
    ownerVerified: true,
    coverImage: "/assets/generated/maha_harvester.png",
    galleryImages: [
      "/assets/generated/maha_harvester.png",
      "/assets/generated/harvester_action.png",
      "/assets/generated/farm_yard.png",
    ],
    tags: ["Popular Choice", "Operator Included", "High Capacity"],
    workTypes: ["Harvesting"],
    operatorIncluded: true,
  },
  {
    id: "3",
    slug: "shaktiman-regular-light",
    name: "Shaktiman Regular Light",
    category: "implement",
    categoryLabel: "Implement • Shaktiman",
    location: "Kalwan Area",
    district: "Nashik",
    state: "Maharashtra",
    description:
      "A field-ready rotavator attachment suited for fast soil preparation across small and medium farms.",
    pricePerHour: 350,
    unitLabel: "per hour",
    rating: 5.0,
    hp: "6 ft width",
    distanceKm: 1.2,
    ownerName: "Vikas Gaikwad",
    ownerLocation: "Kalwan, Nashik",
    ownerVerified: true,
    coverImage: "/assets/generated/maha_implement.png",
    galleryImages: [
      "/assets/generated/maha_implement.png",
      "/assets/generated/rotavator.png",
      "/assets/generated/seed_drill.png",
    ],
    tags: ["Light Duty", "Fast Setup", "Verified"],
    workTypes: ["Rotavator", "Soil Prep"],
    operatorIncluded: false,
  },
  {
    id: "4",
    slug: "swaraj-744-fe",
    name: "Swaraj 744 FE",
    category: "tractor",
    categoryLabel: "Tractor • Swaraj",
    location: "Mukhed Area",
    district: "Nanded",
    state: "Maharashtra",
    description:
      "A dependable tractor for daily field work with good fuel efficiency and strong pulling power.",
    pricePerHour: 750,
    unitLabel: "per hour",
    rating: 4.8,
    hp: "48 HP",
    distanceKm: 2.1,
    ownerName: "Suresh Jadhav",
    ownerLocation: "Mukhed, Nanded",
    ownerVerified: true,
    coverImage: "/assets/generated/hero_tractor.png",
    galleryImages: [
      "/assets/generated/hero_tractor.png",
      "/assets/generated/farm_yard.png",
      "/assets/generated/modern_farm_tech.png",
    ],
    tags: ["Verified", "Fuel Efficient"],
    workTypes: ["Ploughing", "Transport", "Sowing"],
    operatorIncluded: true,
  },
  {
    id: "5",
    slug: "john-deere-5310-performer",
    name: "John Deere 5310 Performer",
    category: "tractor",
    categoryLabel: "Tractor • John Deere",
    location: "Kavathe Mahankal",
    district: "Sangli",
    state: "Maharashtra",
    description:
      sanitizeEquipmentDescription(
        "A premium tractor listing with strong PTO output and regional owner coverage."
      ),
    pricePerHour: 850,
    unitLabel: "per hour",
    rating: 4.9,
    hp: "55 HP",
    distanceKm: 15,
    ownerName: "Sanjay Patil",
    ownerLocation: "Sangli",
    ownerVerified: true,
    coverImage: "/assets/generated/hero_tractor.png",
    galleryImages: [
      "/assets/generated/hero_tractor.png",
      "/assets/generated/rotavator.png",
      "/assets/generated/seed_drill.png",
    ],
    tags: ["Premium Listing", "Operator Included", "Verified"],
    workTypes: ["Ploughing", "Sowing", "Transport", "Harrowing"],
    operatorIncluded: true,
  },
];

export function getMockEquipmentList() {
  return MOCK_EQUIPMENT;
}

export function getMockEquipmentById(id: string) {
  return MOCK_EQUIPMENT.find((item) => item.id === id) || null;
}
