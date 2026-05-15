import type { Metadata } from "next";
import { buildPageMetadata, type PageMetadataInput } from "@/lib/site-metadata";

export const publicPageMetadataInputs = {
  about: {
    title: "About Our Farm Equipment Marketplace",
    description:
      "Learn how Kisan Kamai connects farm equipment owners and renters across Northern Maharashtra through direct, local coordination.",
    path: "/about",
    imagePath: "/assets/share/pages/about.jpg",
  },
  categories: {
    title: "Farm Equipment Categories",
    description:
      "Browse tractor, harvester, implement, sprayer, pump, baler, trolley, and seeder categories available through Kisan Kamai.",
    path: "/categories",
    imagePath: "/assets/share/pages/categories.jpg",
  },
  comingSoon: {
    title: "Kisan Kamai Expansion Updates",
    description:
      "Track where Kisan Kamai is expanding next and request updates when farm equipment access becomes available near your area.",
    path: "/coming-soon",
    imagePath: "/assets/share/pages/coming-soon.jpg",
  },
  faq: {
    title: "Farm Equipment Rental FAQ",
    description:
      "Find clear answers about renting equipment, listing machinery, direct settlement, local support, account access, and trust on Kisan Kamai.",
    path: "/faq",
    imagePath: "/assets/share/pages/faq.jpg",
  },
  featureRequest: {
    title: "Share Product Feedback",
    description:
      "Send product ideas, workflow requests, and practical improvements that help Kisan Kamai serve equipment owners and renters more clearly.",
    path: "/feature-request",
    imagePath: "/assets/share/pages/feature-request.jpg",
    noIndex: true,
  },
  feedback: {
    title: "Send Kisan Kamai Feedback",
    description:
      "Share practical feedback about Kisan Kamai so the owner, renter, listing, booking, and support experience can keep improving.",
    path: "/feedback",
    imagePath: "/assets/share/pages/feedback.jpg",
    noIndex: true,
  },
  forgotPassword: {
    title: "Reset Your Password",
    description: "Reset your Kisan Kamai account password securely using the registered mobile number linked to your owner or renter profile.",
    path: "/forgot-password",
    imagePath: "/assets/share/pages/forgot-password.jpg",
    noIndex: true,
  },
  forgotPasswordVerifyOtp: {
    title: "Verify Password Reset",
    description:
      "Verify the password reset step for the registered mobile number on your Kisan Kamai account before creating a new password.",
    path: "/forgot-password/verify-otp",
    imagePath: "/assets/share/pages/forgot-password.jpg",
    noIndex: true,
  },
  forgotPasswordNewPassword: {
    title: "Create a New Password",
    description:
      "Set a new password for your Kisan Kamai account after completing secure mobile-number password reset verification and return to login.",
    path: "/forgot-password/new-password",
    imagePath: "/assets/share/pages/forgot-password.jpg",
    noIndex: true,
  },
  forgotPasswordSuccess: {
    title: "Password Reset Complete",
    description:
      "Confirm that your Kisan Kamai password reset steps are complete and return to the login page to access your workspace securely.",
    path: "/forgot-password/success",
    imagePath: "/assets/share/pages/forgot-password.jpg",
    noIndex: true,
  },
  howItWorks: {
    title: "How Farm Equipment Renting Works",
    description:
      "See how renters and owners use Kisan Kamai to find equipment, review details, contact each other, and coordinate work directly.",
    path: "/how-it-works",
    imagePath: "/assets/share/pages/how-it-works.jpg",
  },
  legal: {
    title: "Legal Policies",
    description:
      "Review Kisan Kamai legal policies, marketplace responsibilities, direct coordination rules, and safe farm equipment usage guidance.",
    path: "/legal",
    imagePath: "/assets/share/pages/terms.jpg",
  },
  listEquipment: {
    title: "List Farm Equipment",
    description:
      "Create and manage owner listings for tractors, harvesters, implements, and other farm machinery with photos, rates, and availability.",
    path: "/list-equipment",
    imagePath: "/assets/share/pages/list-equipment.jpg",
    noIndex: true,
  },
  login: {
    title: "Kisan Kamai Account Login",
    description:
      "Sign in to manage equipment listings, booking requests, saved machines, and profile settings with your registered mobile number.",
    path: "/login",
    imagePath: "/assets/share/pages/login.jpg",
    noIndex: true,
  },
  logout: {
    title: "Sign Out",
    description:
      "Sign out of your Kisan Kamai owner or renter account and return to the public farm equipment marketplace safely from this device.",
    path: "/logout",
    imagePath: "/assets/share/pages/login.jpg",
    noIndex: true,
  },
  ownerBenefits: {
    title: "Benefits for Equipment Owners",
    description:
      "See how Kisan Kamai helps equipment owners list machinery, receive booking requests, set availability, and coordinate rentals directly.",
    path: "/owner-benefits",
    imagePath: "/assets/share/pages/owner-benefits.jpg",
  },
  ownerExperience: {
    title: "Owner Experience",
    description:
      "Review the owner-side equipment listing, booking request, availability, and direct renter coordination workflow on Kisan Kamai.",
    path: "/owner-experience",
    imagePath: "/assets/share/pages/owner-experience.jpg",
    noIndex: true,
  },
  partner: {
    title: "Partner With Kisan Kamai",
    description:
      "Explore partnership opportunities that support farm equipment access, rural operations, and local agricultural services.",
    path: "/partner",
    imagePath: "/assets/share/pages/partner.jpg",
  },
  profileSelection: {
    title: "Choose Your Workspace",
    description:
      "Select the owner or renter workspace for your signed-in Kisan Kamai account and continue to the right equipment workflow.",
    path: "/profile-selection",
    imagePath: "/assets/share/pages/profile-selection.jpg",
    noIndex: true,
  },
  register: {
    title: "Create a Kisan Kamai Account",
    description:
      "Create a Kisan Kamai account with your mobile number and complete the profile needed to rent, list, or manage farm equipment.",
    path: "/register",
    imagePath: "/assets/share/pages/register.jpg",
    noIndex: true,
  },
  rentEquipment: {
    title: "Rent Farm Equipment in Maharashtra",
    description:
      "Browse available farm equipment across Maharashtra, including tractors, implements, harvesters, pumps, seeders, and local owner listings.",
    path: "/rent-equipment",
    imagePath: "/assets/share/pages/rent-equipment.jpg",
  },
  support: {
    title: "Kisan Kamai Support",
    description:
      "Contact Kisan Kamai support for help with equipment listings, booking requests, account access, direct coordination, and platform questions.",
    path: "/support",
    imagePath: "/assets/share/pages/support.jpg",
  },
  terms: {
    title: "Terms and Safety Guidelines",
    description:
      "Review Kisan Kamai terms, direct-dealing guidelines, safety rules, and practical responsibilities for farm equipment owners and renters.",
    path: "/terms",
    imagePath: "/assets/share/pages/terms.jpg",
  },
  trustSafety: {
    title: "Trust and Safety for Equipment Rentals",
    description:
      "Review practical trust and safety guidance for using Kisan Kamai to rent, list, inspect, and coordinate farm equipment directly.",
    path: "/trust-safety",
    imagePath: "/assets/share/pages/trust-safety.jpg",
  },
  verifyContact: {
    title: "Review Contact Details",
    description:
      "Review your saved contact details before continuing into Kisan Kamai owner or renter account workflows and direct equipment coordination.",
    path: "/verify-contact",
    imagePath: "/assets/share/pages/verify-contact.jpg",
    noIndex: true,
  },
} satisfies Record<string, PageMetadataInput>;

export const publicPageMetadata = Object.fromEntries(
  Object.entries(publicPageMetadataInputs).map(([key, value]) => [key, buildPageMetadata(value)])
) as { [K in keyof typeof publicPageMetadataInputs]: Metadata };
