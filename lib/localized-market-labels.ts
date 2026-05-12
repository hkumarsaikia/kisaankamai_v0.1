import type { Language } from "@/lib/i18n";

export const EQUIPMENT_CATEGORY_LABELS: Record<string, { en: string; mr: string }> = {
  tractor: { en: "Tractor", mr: "ट्रॅक्टर" },
  tractors: { en: "Tractors", mr: "ट्रॅक्टर्स" },
  harvester: { en: "Harvester", mr: "हार्वेस्टर" },
  harvesters: { en: "Harvesters", mr: "हार्वेस्टर्स" },
  implement: { en: "Implement", mr: "अवजार" },
  implements: { en: "Implements", mr: "अवजारे" },
  plough: { en: "Plough", mr: "नांगर" },
  ploughs: { en: "Ploughs", mr: "नांगर" },
  sprayer: { en: "Sprayer", mr: "स्प्रेयर" },
  sprayers: { en: "Sprayers", mr: "स्प्रेयर" },
  rotavator: { en: "Rotavator", mr: "रोटाव्हेटर" },
  rotavators: { en: "Rotavators", mr: "रोटाव्हेटर" },
  seeder: { en: "Seeder", mr: "सीडर" },
  seeders: { en: "Seeders", mr: "सीडर" },
  thresher: { en: "Thresher", mr: "थ्रेशर" },
  threshers: { en: "Threshers", mr: "थ्रेशर" },
  pump: { en: "Pump", mr: "पंप" },
  pumps: { en: "Pumps", mr: "पंप" },
  baler: { en: "Baler", mr: "बेलर" },
  balers: { en: "Balers", mr: "बेलर" },
  trolley: { en: "Trolley", mr: "ट्रॉली" },
  trolleys: { en: "Trolleys", mr: "ट्रॉली" },
  cultivator: { en: "Cultivator", mr: "कल्टीवेटर" },
  cultivators: { en: "Cultivators", mr: "कल्टीवेटर" },
  equipment: { en: "Equipment", mr: "उपकरण" },
};

export const MAHARASHTRA_DISTRICT_LABELS: Record<string, { en: string; mr: string }> = {
  Ahilyanagar: { en: "Ahmednagar", mr: "अहमदनगर" },
  Akola: { en: "Akola", mr: "अकोला" },
  Amravati: { en: "Amravati", mr: "अमरावती" },
  Beed: { en: "Beed", mr: "बीड" },
  Bhandara: { en: "Bhandara", mr: "भंडारा" },
  Buldhana: { en: "Buldhana", mr: "बुलढाणा" },
  Chandrapur: { en: "Chandrapur", mr: "चंद्रपूर" },
  "Chhatrapati Sambhajinagar": { en: "Chhatrapati Sambhajinagar", mr: "छत्रपती संभाजीनगर" },
  Dharashiv: { en: "Dharashiv", mr: "धाराशिव" },
  Dhule: { en: "Dhule", mr: "धुळे" },
  Gadchiroli: { en: "Gadchiroli", mr: "गडचिरोली" },
  Gondia: { en: "Gondia", mr: "गोंदिया" },
  Hingoli: { en: "Hingoli", mr: "हिंगोली" },
  Jalgaon: { en: "Jalgaon", mr: "जळगाव" },
  Jalna: { en: "Jalna", mr: "जालना" },
  Kolhapur: { en: "Kolhapur", mr: "कोल्हापूर" },
  Latur: { en: "Latur", mr: "लातूर" },
  "Mumbai City": { en: "Mumbai City", mr: "मुंबई शहर" },
  "Mumbai Suburban": { en: "Mumbai Suburban", mr: "मुंबई उपनगर" },
  Nagpur: { en: "Nagpur", mr: "नागपूर" },
  Nanded: { en: "Nanded", mr: "नांदेड" },
  Nandurbar: { en: "Nandurbar", mr: "नंदुरबार" },
  Nashik: { en: "Nashik", mr: "नाशिक" },
  Palghar: { en: "Palghar", mr: "पालघर" },
  Parbhani: { en: "Parbhani", mr: "परभणी" },
  Pune: { en: "Pune", mr: "पुणे" },
  Raigad: { en: "Raigad", mr: "रायगड" },
  Ratnagiri: { en: "Ratnagiri", mr: "रत्नागिरी" },
  Sangli: { en: "Sangli", mr: "सांगली" },
  Satara: { en: "Satara", mr: "सातारा" },
  Sindhudurg: { en: "Sindhudurg", mr: "सिंधुदुर्ग" },
  Solapur: { en: "Solapur", mr: "सोलापूर" },
  Thane: { en: "Thane", mr: "ठाणे" },
  Wardha: { en: "Wardha", mr: "वर्धा" },
  Washim: { en: "Washim", mr: "वाशिम" },
  Yavatmal: { en: "Yavatmal", mr: "यवतमाळ" },
  Maharashtra: { en: "Maharashtra", mr: "महाराष्ट्र" },
  Kalwan: { en: "Kalwan", mr: "कळवण" },
  Mukhed: { en: "Mukhed", mr: "मुखेड" },
  Wakad: { en: "Wakad", mr: "वाकड" },
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

export function getLocalizedCategoryLabel(value: string | undefined, language: Language, fallback?: string) {
  const normalizedValue = normalizeKey(value || "");
  const label = EQUIPMENT_CATEGORY_LABELS[normalizedValue];

  if (label) {
    return language === "mr" ? label.mr : label.en;
  }

  return fallback || value || EQUIPMENT_CATEGORY_LABELS.equipment[language];
}

export function getLocalizedDistrictLabel(value: string | undefined, language: Language) {
  if (!value) {
    return "";
  }

  const label = MAHARASHTRA_DISTRICT_LABELS[value] || MAHARASHTRA_DISTRICT_LABELS[normalizeDistrictAlias(value)];
  return label ? label[language] : value;
}

function normalizeDistrictAlias(value: string) {
  if (value.trim().toLowerCase() === "ahmednagar") {
    return "Ahilyanagar";
  }

  return value;
}

export function getLocalizedLocationParts(parts: Array<string | undefined>, language: Language) {
  return parts
    .filter((part): part is string => Boolean(part && part.trim()))
    .map((part) => getLocalizedDistrictLabel(part, language))
    .join(", ");
}
