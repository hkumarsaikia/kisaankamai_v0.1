import { buildPageMetadata } from "@/lib/site-metadata";

export const publicPageMetadata = {
  about: buildPageMetadata({
    title: "About Our Farm Equipment Marketplace",
    description:
      "Learn how Kisan Kamai connects farm equipment owners and renters across Northern Maharashtra through direct, local coordination.",
    path: "/about",
    imagePath: "/assets/share/pages/about.jpg",
  }),
  categories: buildPageMetadata({
    title: "Farm Equipment Categories",
    description:
      "Browse tractor, harvester, implement, sprayer, pump, baler, trolley, and seeder categories available through Kisan Kamai.",
    path: "/categories",
    imagePath: "/assets/share/pages/categories.jpg",
  }),
  comingSoon: buildPageMetadata({
    title: "Kisan Kamai Expansion Updates",
    description:
      "Track where Kisan Kamai is expanding next and request updates when farm equipment access launches near your area.",
    path: "/coming-soon",
    imagePath: "/assets/share/pages/coming-soon.jpg",
  }),
  faq: buildPageMetadata({
    title: "Farm Equipment Rental FAQ",
    description:
      "Find clear answers about renting equipment, listing machinery, direct settlement, support, and trust on Kisan Kamai.",
    path: "/faq",
    imagePath: "/assets/share/pages/faq.jpg",
  }),
  featureRequest: buildPageMetadata({
    title: "Share Product Feedback",
    description:
      "Send product ideas and workflow improvements that can help Kisan Kamai serve equipment owners and renters more clearly.",
    path: "/feature-request",
    imagePath: "/assets/share/pages/feature-request.jpg",
    noIndex: true,
  }),
  feedback: buildPageMetadata({
    title: "Send Kisan Kamai Feedback",
    description: "Share practical feedback about Kisan Kamai so the owner and renter experience can keep improving.",
    path: "/feedback",
    imagePath: "/assets/share/pages/feedback.jpg",
    noIndex: true,
  }),
  forgotPassword: buildPageMetadata({
    title: "Reset Your Password",
    description: "Reset a Kisan Kamai account password using the registered mobile number linked to your profile.",
    path: "/forgot-password",
    imagePath: "/assets/share/pages/forgot-password.jpg",
    noIndex: true,
  }),
  forgotPasswordVerifyOtp: buildPageMetadata({
    title: "Verify Password Reset",
    description: "Verify the password reset step for the registered mobile number on your Kisan Kamai account.",
    path: "/forgot-password/verify-otp",
    imagePath: "/assets/share/pages/forgot-password.jpg",
    noIndex: true,
  }),
  forgotPasswordNewPassword: buildPageMetadata({
    title: "Create a New Password",
    description: "Set a new password for your Kisan Kamai account.",
    path: "/forgot-password/new-password",
    imagePath: "/assets/share/pages/forgot-password.jpg",
    noIndex: true,
  }),
  forgotPasswordSuccess: buildPageMetadata({
    title: "Password Reset Complete",
    description: "Your Kisan Kamai password reset steps are complete.",
    path: "/forgot-password/success",
    imagePath: "/assets/share/pages/forgot-password.jpg",
    noIndex: true,
  }),
  howItWorks: buildPageMetadata({
    title: "How Farm Equipment Renting Works",
    description:
      "See how renters and owners use Kisan Kamai to find equipment, review details, contact each other, and coordinate work directly.",
    path: "/how-it-works",
    imagePath: "/assets/share/pages/how-it-works.jpg",
  }),
  legal: buildPageMetadata({
    title: "Legal Policies",
    description: "Review Kisan Kamai legal policies for using the farm equipment marketplace.",
    path: "/legal",
    imagePath: "/assets/share/pages/terms.jpg",
  }),
  listEquipment: buildPageMetadata({
    title: "List Farm Equipment",
    description: "Create and manage owner listings for tractors, harvesters, implements, and other farm machinery on Kisan Kamai.",
    path: "/list-equipment",
    imagePath: "/assets/share/pages/list-equipment.jpg",
    noIndex: true,
  }),
  login: buildPageMetadata({
    title: "Account Login",
    description: "Sign in to your Kisan Kamai owner or renter account with your registered mobile number.",
    path: "/login",
    imagePath: "/assets/share/pages/login.jpg",
    noIndex: true,
  }),
  logout: buildPageMetadata({
    title: "Sign Out",
    description: "Sign out of your Kisan Kamai account.",
    path: "/logout",
    imagePath: "/assets/share/pages/login.jpg",
    noIndex: true,
  }),
  ownerBenefits: buildPageMetadata({
    title: "Benefits for Equipment Owners",
    description:
      "See how Kisan Kamai helps equipment owners list machinery, receive booking requests, and coordinate rentals directly.",
    path: "/owner-benefits",
    imagePath: "/assets/share/pages/owner-benefits.jpg",
  }),
  ownerExperience: buildPageMetadata({
    title: "Owner Experience",
    description: "Review the owner-side equipment listing and booking workflow on Kisan Kamai.",
    path: "/owner-experience",
    imagePath: "/assets/share/pages/owner-experience.jpg",
    noIndex: true,
  }),
  partner: buildPageMetadata({
    title: "Partner With Kisan Kamai",
    description:
      "Explore partnership opportunities that support farm equipment access, rural operations, and local agricultural services.",
    path: "/partner",
    imagePath: "/assets/share/pages/partner.jpg",
  }),
  profileSelection: buildPageMetadata({
    title: "Choose Your Workspace",
    description: "Select the owner or renter workspace for your signed-in Kisan Kamai account.",
    path: "/profile-selection",
    imagePath: "/assets/share/pages/profile-selection.jpg",
    noIndex: true,
  }),
  register: buildPageMetadata({
    title: "Create a Kisan Kamai Account",
    description: "Create a Kisan Kamai account with your mobile number and complete the profile needed to rent or list equipment.",
    path: "/register",
    imagePath: "/assets/share/pages/register.jpg",
    noIndex: true,
  }),
  support: buildPageMetadata({
    title: "Kisan Kamai Support",
    description:
      "Contact Kisan Kamai support for help with equipment listings, booking requests, account access, and platform questions.",
    path: "/support",
    imagePath: "/assets/share/pages/support.jpg",
  }),
  terms: buildPageMetadata({
    title: "Terms and Safety Guidelines",
    description:
      "Review Kisan Kamai terms, direct-dealing guidelines, and safety rules for farm equipment owners and renters.",
    path: "/terms",
    imagePath: "/assets/share/pages/terms.jpg",
  }),
  trustSafety: buildPageMetadata({
    title: "Trust and Safety for Equipment Rentals",
    description: "Review practical trust and safety guidance for using Kisan Kamai to rent or list farm equipment.",
    path: "/trust-safety",
    imagePath: "/assets/share/pages/trust-safety.jpg",
  }),
  verifyContact: buildPageMetadata({
    title: "Review Contact Details",
    description: "Review your saved contact details before continuing into Kisan Kamai.",
    path: "/verify-contact",
    imagePath: "/assets/share/pages/verify-contact.jpg",
    noIndex: true,
  }),
};
