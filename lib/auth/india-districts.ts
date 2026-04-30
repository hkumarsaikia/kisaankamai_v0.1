export const MAHARASHTRA_DISTRICTS = [
  "Ahilyanagar",
  "Akola",
  "Amravati",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Chhatrapati Sambhajinagar",
  "Dharashiv",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal",
] as const;

export const INDIA_DISTRICT_OPTIONS = [...MAHARASHTRA_DISTRICTS];

export function normalizeDistrictSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getIndiaDistrictSuggestions(query: string, limit = 10) {
  const normalizedQuery = normalizeDistrictSearchValue(query);

  if (!normalizedQuery) {
    return INDIA_DISTRICT_OPTIONS.slice(0, limit);
  }

  return INDIA_DISTRICT_OPTIONS.filter((district) =>
    normalizeDistrictSearchValue(district).includes(normalizedQuery)
  ).slice(0, limit);
}
