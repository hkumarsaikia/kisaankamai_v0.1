import { BASE_EQUIPMENT_CATEGORIES, normalizeCategorySlug } from "@/lib/equipment-categories";

export type ProgrammaticCategoryPage = {
  slug: string;
  category: string;
  name: string;
  title: string;
  metaDescription: string;
  intro: string;
  bestFor: string[];
  selectionTips: string[];
  safetyNote: string;
  relatedCategorySlugs: string[];
  coverImage: string;
};

const baseCategoryBySlug = new Map(BASE_EQUIPMENT_CATEGORIES.map((category) => [category.slug, category]));

function baseCategory(slug: string) {
  const category = baseCategoryBySlug.get(slug);
  if (!category) {
    throw new Error(`Missing base equipment category for programmatic SEO slug: ${slug}`);
  }

  return category;
}

function page(
  slug: string,
  details: Omit<ProgrammaticCategoryPage, "slug" | "category" | "name" | "coverImage">
): ProgrammaticCategoryPage {
  const category = baseCategory(slug);
  return {
    slug,
    category: category.category,
    name: category.name,
    coverImage: category.coverImage,
    ...details,
  };
}

// No category-location pages are generated here. Location expansion stays deferred
// until there is enough first-party inventory and local editorial data for every page.
export const PROGRAMMATIC_CATEGORY_PAGES = [
  page("tractors", {
    title: "Tractor Rental in Maharashtra",
    metaDescription:
      "Compare tractor listings on Kisan Kamai with photos, hourly rates, owner details, availability, and direct booking coordination.",
    intro:
      "Tractors are the main discovery category for farm work that needs pulling power, transport support, or PTO-driven attachments. Use this page to review tractor availability before opening live listings.",
    bestFor: ["Tillage and field preparation", "Trailer and trolley movement", "PTO-driven farm attachment work"],
    selectionTips: ["Check horsepower against the attachment or field task.", "Confirm operator availability before the work date.", "Review photos and owner location before calling."],
    safetyNote: "Inspect tyres, hitch points, lights, and PTO guards before starting tractor work.",
    relatedCategorySlugs: ["ploughs", "rotavators", "trolleys"],
  }),
  page("harvesters", {
    title: "Harvester Rental in Maharashtra",
    metaDescription:
      "Find harvester listings with machine photos, listed rates, owner contact context, and availability signals for seasonal crop work.",
    intro:
      "Harvester searches are time-sensitive because crop windows are short. This page groups harvester discovery around machine details, location, and owner coordination.",
    bestFor: ["Crop harvesting windows", "Reducing manual harvest time", "Coordinating seasonal machine access"],
    selectionTips: ["Confirm crop type suitability with the owner.", "Check field access width and terrain before booking.", "Discuss timing clearly because harvest windows can change quickly."],
    safetyNote: "Keep workers away from moving headers, belts, and discharge areas during operation.",
    relatedCategorySlugs: ["threshers", "trolleys", "tractors"],
  }),
  page("implements", {
    title: "Farm Implement Rental in Maharashtra",
    metaDescription:
      "Browse farm implement discovery pages for attachment-led work, owner coordination, listed pricing, and live equipment availability.",
    intro:
      "Implements cover attachment-led farm tasks where the right tool matters as much as the power unit. Use this page to narrow the type of implement before checking live inventory.",
    bestFor: ["Attachment-based field work", "Seasonal preparation tasks", "Specialized farm operations"],
    selectionTips: ["Match the implement to tractor horsepower and hitch type.", "Ask whether the owner provides compatible tractor support.", "Confirm transport and field entry before the work date."],
    safetyNote: "Check blades, guards, pins, and hydraulic lines before using any implement.",
    relatedCategorySlugs: ["rotavators", "ploughs", "seeders"],
  }),
  page("ploughs", {
    title: "Plough Rental in Maharashtra",
    metaDescription:
      "Review plough rental options with practical selection notes, live owner listings, listed hourly rates, and direct coordination links.",
    intro:
      "Plough pages help renters prepare for soil-turning work by reviewing available machines, related tillage equipment, and owner-supplied details.",
    bestFor: ["Primary tillage", "Soil turning before sowing", "Field preparation after residue clearing"],
    selectionTips: ["Confirm soil condition and required plough depth.", "Match plough size with tractor horsepower.", "Discuss whether multiple passes are needed."],
    safetyNote: "Keep people clear of the plough path and check hitch pins before movement.",
    relatedCategorySlugs: ["tractors", "rotavators", "seeders"],
  }),
  page("sprayers", {
    title: "Sprayer Rental in Maharashtra",
    metaDescription:
      "Find sprayer equipment pages with usage guidance, live listings, owner details, availability, and clear rental coordination paths.",
    intro:
      "Sprayer searches depend on crop stage, field size, tank capacity, and timing. This page helps renters review sprayer availability and practical selection checks.",
    bestFor: ["Crop protection work", "Foliar nutrient application", "Field spraying during narrow weather windows"],
    selectionTips: ["Check tank size and nozzle condition.", "Confirm whether the owner provides operator support.", "Discuss weather, wind, and safe application timing."],
    safetyNote: "Use protective gear and follow chemical label guidance before spraying.",
    relatedCategorySlugs: ["pumps", "tractors", "implements"],
  }),
  page("rotavators", {
    title: "Rotavator Rental in Maharashtra",
    metaDescription:
      "Compare rotavator rental discovery pages for field preparation, live owner listings, hourly rates, photos, and availability.",
    intro:
      "Rotavators support seedbed preparation and residue mixing after initial field work. Use this page to compare live rotavator options and related tillage equipment.",
    bestFor: ["Seedbed preparation", "Residue mixing", "Secondary tillage after ploughing"],
    selectionTips: ["Confirm working width and blade condition.", "Match the rotavator to available tractor horsepower.", "Ask about field moisture before scheduling."],
    safetyNote: "Keep clear of rotating blades and stop the machine before inspection or cleaning.",
    relatedCategorySlugs: ["tractors", "ploughs", "seeders"],
  }),
  page("seeders", {
    title: "Seeder Rental in Maharashtra",
    metaDescription:
      "Browse seeder and seed drill rental pages with live listing links, owner contact context, rates, and practical selection guidance.",
    intro:
      "Seeder pages help renters plan sowing work where spacing, seed rate, and field preparation need to be aligned before the machine arrives.",
    bestFor: ["Seed drilling", "Uniform sowing work", "Post-tillage planting preparation"],
    selectionTips: ["Confirm row spacing and seed compatibility.", "Review whether calibration support is available.", "Check that field preparation is complete before booking."],
    safetyNote: "Stop the seeder before adjusting seed boxes, chains, or moving parts.",
    relatedCategorySlugs: ["rotavators", "ploughs", "tractors"],
  }),
  page("threshers", {
    title: "Thresher Rental in Maharashtra",
    metaDescription:
      "Review thresher rental discovery pages with live listing availability, owner coordination, photos, pricing, and safety reminders.",
    intro:
      "Threshers are used after crop cutting when timing and safe operation are critical. This page brings thresher discovery together with related harvest equipment.",
    bestFor: ["Post-harvest grain separation", "Seasonal threshing work", "Coordinated harvest support"],
    selectionTips: ["Confirm crop suitability and machine capacity.", "Plan labour and transport before the work starts.", "Discuss safe feeding practices with the owner."],
    safetyNote: "Keep hands, clothing, and loose material away from feeding and belt areas.",
    relatedCategorySlugs: ["harvesters", "trolleys", "tractors"],
  }),
  page("pumps", {
    title: "Water Pump Rental in Maharashtra",
    metaDescription:
      "Find pump rental discovery pages for irrigation support, owner details, live availability, rates, and direct coordination.",
    intro:
      "Pump rental decisions depend on water source, lift, hose requirements, and field timing. Use this page to review pump options and related support equipment.",
    bestFor: ["Irrigation support", "Water transfer", "Short-term field pumping needs"],
    selectionTips: ["Confirm fuel or power requirements.", "Check hose length and water source access.", "Discuss flow rate and expected running hours."],
    safetyNote: "Keep electrical connections dry and place pumps securely before operation.",
    relatedCategorySlugs: ["sprayers", "tractors", "implements"],
  }),
  page("balers", {
    title: "Baler Rental in Maharashtra",
    metaDescription:
      "Browse baler rental discovery pages for residue collection, owner listings, machine photos, listed rates, and availability signals.",
    intro:
      "Baler pages support renters who need to collect and handle crop residue efficiently. Review live baler availability and related transport equipment here.",
    bestFor: ["Crop residue baling", "Fodder handling", "Post-harvest field clearing"],
    selectionTips: ["Confirm bale type and field condition.", "Discuss tractor compatibility and operator support.", "Plan trolley or transport needs before booking."],
    safetyNote: "Stay clear of pickup, rollers, and bale discharge areas while the baler is running.",
    relatedCategorySlugs: ["trolleys", "tractors", "harvesters"],
  }),
  page("trolleys", {
    title: "Farm Trolley Rental in Maharashtra",
    metaDescription:
      "Review farm trolley rental pages for transport tasks, live owner listings, rates, availability, and related tractor coordination.",
    intro:
      "Trolleys support field-to-yard and yard-to-market movement. This page helps renters connect transport needs with tractor and owner coordination.",
    bestFor: ["Crop and input transport", "Field-to-yard movement", "Equipment support logistics"],
    selectionTips: ["Confirm loading capacity and tyre condition.", "Check whether tractor support is included or separate.", "Discuss route access and loading location."],
    safetyNote: "Avoid overloading and check brakes, hitch pins, and tyres before movement.",
    relatedCategorySlugs: ["tractors", "harvesters", "balers"],
  }),
] satisfies ProgrammaticCategoryPage[];

const categoryPageBySlug = new Map(
  PROGRAMMATIC_CATEGORY_PAGES.map((pageConfig) => [normalizeCategorySlug(pageConfig.slug), pageConfig])
);

export function buildProgrammaticCategoryPath(slug: string) {
  return `/catalog/${normalizeCategorySlug(slug)}`;
}

export function getProgrammaticCategoryPage(slug: string) {
  return categoryPageBySlug.get(normalizeCategorySlug(slug)) || null;
}

export function getIndexableProgrammaticCategoryPages() {
  return PROGRAMMATIC_CATEGORY_PAGES;
}
