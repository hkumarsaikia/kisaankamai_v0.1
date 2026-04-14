import type { Locale } from "@/lib/types";

export interface CoverageHub {
  slug: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  description: string;
}

export const coverageHubs: CoverageHub[] = [
  {
    slug: "sangli",
    name: "Sangli Hub",
    district: "Sangli",
    lat: 16.8547,
    lng: 74.5643,
    description: "Primary operating hub for tractors, tillers, and harvesting support.",
  },
  {
    slug: "satara",
    name: "Satara Hub",
    district: "Satara",
    lat: 17.6805,
    lng: 74.0183,
    description: "Regional coordination for planting and seasonal harvesting demand.",
  },
  {
    slug: "kolhapur",
    name: "Kolhapur Hub",
    district: "Kolhapur",
    lat: 16.705,
    lng: 74.2433,
    description: "Sugarcane-belt service hub with owner onboarding and renter support.",
  },
];

export function getMarketingCopy(locale: Locale) {
  if (locale === "mr") {
    return {
      brand: "किसान कमाई",
      heroTitle: "शेती यंत्रसामग्री भाड्याने देण्यासाठी आणि घेण्यासाठी विश्वसनीय बाजारपेठ",
      heroBody:
        "महाराष्ट्रातील शेतकरी आणि यंत्रमालकांना फोन-प्रथम नोंदणी, स्पष्ट बुकिंग प्रवाह आणि सुरक्षित खाते व्यवस्थापनासह एकत्र आणणारे उत्पादन-तयार प्लॅटफॉर्म.",
      browse: "उपकरणे पाहा",
      list: "उपकरण नोंदवा",
      support: "सपोर्ट",
      login: "लॉग इन",
      register: "नोंदणी",
      owner: "मालक",
      renter: "भाडेकरू",
      profileSelectionTitle: "तुमचा कार्यक्षेत्र निवडा",
      rentTitle: "उपलब्ध उपकरणे",
      ownerDashboardTitle: "मालक डॅशबोर्ड",
      renterDashboardTitle: "भाडेकरू डॅशबोर्ड",
      supportTitle: "सपोर्टशी संपर्क करा",
      areasTitle: "महाराष्ट्रातील सेवा क्षेत्र",
      authPhone: "फोन OTP",
      authEmail: "ईमेल आणि पासवर्ड",
      footer: "भारतीय शेतीसाठी विश्वासावर आधारित तंत्रज्ञान.",
    };
  }

  return {
    brand: "Kisan Kamai",
    heroTitle: "A trusted marketplace for renting and listing agricultural equipment",
    heroBody:
      "A production-focused platform for Maharashtra farmers and equipment owners with phone-first onboarding, clear booking flows, and secure account management.",
    browse: "Browse Equipment",
    list: "List Equipment",
    support: "Support",
    login: "Log In",
    register: "Register",
    owner: "Owner",
    renter: "Renter",
    profileSelectionTitle: "Choose your workspace",
    rentTitle: "Available equipment",
    ownerDashboardTitle: "Owner dashboard",
    renterDashboardTitle: "Renter dashboard",
    supportTitle: "Contact support",
    areasTitle: "Service coverage across Maharashtra",
    authPhone: "Phone OTP",
    authEmail: "Email and password",
    footer: "Technology rooted in trust for Indian agriculture.",
  };
}
