(function (root) {
  const data = {
  "generatedAt": "2026-04-12T16:10:40.703Z",
  "rootDir": "C:/Users/hkuma/OneDrive/Desktop/Work/kisan_kamai_v1",
  "defaultBaseUrl": "http://localhost:3000",
  "stats": {
    "pages": 44,
    "components": 14,
    "flowNodes": 6,
    "missingRoutes": 2,
    "externalDestinations": 11,
    "edges": 217
  },
  "nodes": [
    {
      "id": "route:/about",
      "type": "page",
      "group": "public",
      "label": "About",
      "route": "/about",
      "status": "implemented",
      "files": [
        "app/about/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:AuthContext",
      "type": "shared-component",
      "group": "components",
      "label": "AuthContext",
      "status": "shared",
      "files": [
        "components/AuthContext.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:BackToTop",
      "type": "shared-component",
      "group": "components",
      "label": "BackToTop",
      "status": "shared",
      "files": [
        "components/BackToTop.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/booking",
      "type": "page",
      "group": "discovery",
      "label": "Booking",
      "route": "/booking",
      "status": "implemented",
      "files": [
        "app/booking/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/booking/[equipmentId]",
      "type": "page",
      "group": "discovery",
      "label": "Booking / EquipmentId",
      "route": "/booking/[equipmentId]",
      "status": "implemented",
      "files": [
        "app/booking/[equipmentId]/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "external:tel:+",
      "label": "Call: +",
      "type": "external-destination",
      "group": "external",
      "status": "placeholder",
      "target": "tel:+",
      "files": [],
      "notes": []
    },
    {
      "id": "external:tel:+9118005472652624",
      "label": "Call: +9118005472652624",
      "type": "external-destination",
      "group": "external",
      "status": "external",
      "target": "tel:+9118005472652624",
      "files": [],
      "notes": []
    },
    {
      "id": "external:tel:+918001234567",
      "label": "Call: +918001234567",
      "type": "external-destination",
      "group": "external",
      "status": "external",
      "target": "tel:+918001234567",
      "files": [],
      "notes": []
    },
    {
      "id": "route:/catalog/[slug]",
      "type": "page",
      "group": "discovery",
      "label": "Catalog / Slug",
      "route": "/catalog/[slug]",
      "status": "implemented",
      "files": [
        "app/catalog/[slug]/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/catalog/[slug]/gallery",
      "type": "page",
      "group": "discovery",
      "label": "Catalog / Slug / Gallery",
      "route": "/catalog/[slug]/gallery",
      "status": "implemented",
      "files": [
        "app/catalog/[slug]/gallery/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/categories",
      "type": "page",
      "group": "discovery",
      "label": "Categories",
      "route": "/categories",
      "status": "implemented",
      "files": [
        "app/categories/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/complete-profile",
      "type": "page",
      "group": "auth",
      "label": "Complete Profile",
      "route": "/complete-profile",
      "status": "implemented",
      "files": [
        "app/complete-profile/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "flow:demo-mode",
      "type": "flow-node",
      "group": "auth",
      "label": "Demo Auth Mode",
      "status": "inferred",
      "description": "Browser-local demo mode that bypasses backend auth and OTP for the shared demo credentials.",
      "files": [],
      "notes": []
    },
    {
      "id": "external:mailto:partners@kisankamai.com",
      "label": "Email: partners@kisankamai.com",
      "type": "external-destination",
      "group": "external",
      "status": "external",
      "target": "mailto:partners@kisankamai.com",
      "files": [],
      "notes": []
    },
    {
      "id": "external:mailto:support@kisankamai.com",
      "label": "Email: support@kisankamai.com",
      "type": "external-destination",
      "group": "external",
      "status": "external",
      "target": "mailto:support@kisankamai.com",
      "files": [],
      "notes": []
    },
    {
      "id": "external:mailto:support@kisankamai.in",
      "label": "Email: support@kisankamai.in",
      "type": "external-destination",
      "group": "external",
      "status": "external",
      "target": "mailto:support@kisankamai.in",
      "files": [],
      "notes": []
    },
    {
      "id": "external:mailto:Support@krishiseva.in",
      "label": "Email: Support@krishiseva.in",
      "type": "external-destination",
      "group": "external",
      "status": "external",
      "target": "mailto:Support@krishiseva.in",
      "files": [],
      "notes": []
    },
    {
      "id": "route:/equipment/[id]",
      "type": "page",
      "group": "discovery",
      "label": "Equipment / Id",
      "route": "/equipment/[id]",
      "status": "implemented",
      "files": [
        "app/equipment/[id]/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/faq",
      "type": "page",
      "group": "support",
      "label": "Faq",
      "route": "/faq",
      "status": "implemented",
      "files": [
        "app/faq/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/feedback",
      "type": "page",
      "group": "support",
      "label": "Feedback",
      "route": "/feedback",
      "status": "implemented",
      "files": [
        "app/feedback/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/feedback/success",
      "type": "page",
      "group": "support",
      "label": "Feedback / Success",
      "route": "/feedback/success",
      "status": "implemented",
      "files": [
        "app/feedback/success/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:Footer",
      "type": "shared-component",
      "group": "components",
      "label": "Footer",
      "status": "shared",
      "files": [
        "components/Footer.tsx"
      ],
      "notes": [
        "Footer includes a mix of real routes, a missing renter-journey route, and external social destinations."
      ]
    },
    {
      "id": "route:/forgot-password",
      "type": "page",
      "group": "auth",
      "label": "Forgot Password",
      "route": "/forgot-password",
      "status": "implemented",
      "files": [
        "app/forgot-password/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "flow:oauth-return",
      "type": "flow-node",
      "group": "auth",
      "label": "Google OAuth Return",
      "status": "inferred",
      "description": "Represents Google OAuth success and failure return paths configured on login and registration.",
      "files": [],
      "notes": []
    },
    {
      "id": "component:Header",
      "type": "shared-component",
      "group": "components",
      "label": "Header",
      "status": "shared",
      "files": [
        "components/Header.tsx"
      ],
      "notes": [
        "Header navigation is conditional: guests see login/register, authenticated users see profile shortcuts and account actions."
      ]
    },
    {
      "id": "route:/",
      "type": "page",
      "group": "public",
      "label": "Home",
      "route": "/",
      "status": "implemented",
      "files": [
        "app/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "external:https://linkedin.com/company/kisankamai",
      "label": "https://linkedin.com/company/kisankamai",
      "type": "external-destination",
      "group": "external",
      "status": "external",
      "target": "https://linkedin.com/company/kisankamai",
      "files": [],
      "notes": []
    },
    {
      "id": "external:https://wa.me/#",
      "label": "https://wa.me/#",
      "type": "external-destination",
      "group": "external",
      "status": "placeholder",
      "target": "https://wa.me/#",
      "files": [],
      "notes": []
    },
    {
      "id": "external:https://x.com/kisankamai",
      "label": "https://x.com/kisankamai",
      "type": "external-destination",
      "group": "external",
      "status": "external",
      "target": "https://x.com/kisankamai",
      "files": [],
      "notes": []
    },
    {
      "id": "external:https://youtube.com/@kisankamai",
      "label": "https://youtube.com/@kisankamai",
      "type": "external-destination",
      "group": "external",
      "status": "external",
      "target": "https://youtube.com/@kisankamai",
      "files": [],
      "notes": []
    },
    {
      "id": "component:LanguageContext",
      "type": "shared-component",
      "group": "components",
      "label": "LanguageContext",
      "status": "shared",
      "files": [
        "components/LanguageContext.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:LanguageToggle",
      "type": "shared-component",
      "group": "components",
      "label": "LanguageToggle",
      "status": "shared",
      "files": [
        "components/LanguageToggle.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:LegacyRouteRedirect",
      "type": "shared-component",
      "group": "components",
      "label": "LegacyRouteRedirect",
      "status": "shared",
      "files": [
        "components/LegacyRouteRedirect.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/legal",
      "type": "page",
      "group": "support",
      "label": "Legal",
      "route": "/legal",
      "status": "implemented",
      "files": [
        "app/legal/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/list-equipment",
      "type": "page",
      "group": "public",
      "label": "List Equipment",
      "route": "/list-equipment",
      "status": "implemented",
      "files": [
        "app/list-equipment/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/locations",
      "type": "page",
      "group": "discovery",
      "label": "Locations",
      "route": "/locations",
      "status": "implemented",
      "files": [
        "app/locations/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/locations/[city]",
      "type": "page",
      "group": "discovery",
      "label": "Locations / City",
      "route": "/locations/[city]",
      "status": "implemented",
      "files": [
        "app/locations/[city]/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/locations/[city]/no-results",
      "type": "page",
      "group": "discovery",
      "label": "Locations / City / No Results",
      "route": "/locations/[city]/no-results",
      "status": "implemented",
      "files": [
        "app/locations/[city]/no-results/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/login",
      "type": "page",
      "group": "auth",
      "label": "Login",
      "route": "/login",
      "status": "implemented",
      "files": [
        "app/login/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:MapComponent",
      "type": "shared-component",
      "group": "components",
      "label": "MapComponent",
      "status": "shared",
      "files": [
        "components/MapComponent.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/models",
      "type": "page",
      "group": "discovery",
      "label": "Models",
      "route": "/models",
      "status": "implemented",
      "files": [
        "app/models/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-benefits",
      "type": "page",
      "group": "public",
      "label": "Owner Benefits",
      "route": "/owner-benefits",
      "status": "implemented",
      "files": [
        "app/owner-benefits/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-experience",
      "type": "page",
      "group": "public",
      "label": "Owner Experience",
      "route": "/owner-experience",
      "status": "implemented",
      "files": [
        "app/owner-experience/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-profile",
      "type": "page",
      "group": "owner",
      "label": "Owner Profile",
      "route": "/owner-profile",
      "status": "implemented",
      "files": [
        "app/owner-profile/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-profile/add-listing",
      "type": "page",
      "group": "owner",
      "label": "Owner Profile / Add Listing",
      "route": "/owner-profile/add-listing",
      "status": "implemented",
      "files": [
        "app/owner-profile/add-listing/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-profile/bookings",
      "type": "page",
      "group": "owner",
      "label": "Owner Profile / Bookings",
      "route": "/owner-profile/bookings",
      "status": "implemented",
      "files": [
        "app/owner-profile/bookings/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-profile/equipment",
      "type": "page",
      "group": "owner",
      "label": "Owner Profile / Equipment",
      "route": "/owner-profile/equipment",
      "status": "implemented",
      "files": [
        "app/owner-profile/equipment/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-profile/revenue",
      "type": "page",
      "group": "owner",
      "label": "Owner Profile / Revenue",
      "route": "/owner-profile/revenue",
      "status": "implemented",
      "files": [
        "app/owner-profile/revenue/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-profile/settings",
      "type": "page",
      "group": "owner",
      "label": "Owner Profile / Settings",
      "route": "/owner-profile/settings",
      "status": "implemented",
      "files": [
        "app/owner-profile/settings/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-profile/support",
      "type": "page",
      "group": "owner",
      "label": "Owner Profile / Support",
      "route": "/owner-profile/support",
      "status": "implemented",
      "files": [
        "app/owner-profile/support/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "layout:/owner-profile",
      "type": "flow-node",
      "group": "owner",
      "label": "Owner Profile Layout",
      "route": "/owner-profile",
      "status": "inferred",
      "files": [
        "app/owner-profile/layout.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/owner-registration",
      "type": "page",
      "group": "owner",
      "label": "Owner Registration",
      "route": "/owner-registration",
      "status": "implemented",
      "files": [
        "app/owner-registration/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:OwnerSidebar",
      "type": "shared-component",
      "group": "components",
      "label": "OwnerSidebar",
      "status": "shared",
      "files": [
        "components/OwnerSidebar.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:OwnerTopBar",
      "type": "shared-component",
      "group": "components",
      "label": "OwnerTopBar",
      "status": "shared",
      "files": [
        "components/OwnerTopBar.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/partner",
      "type": "page",
      "group": "public",
      "label": "Partner",
      "route": "/partner",
      "status": "implemented",
      "files": [
        "app/partner/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:PerformanceMonitor",
      "type": "shared-component",
      "group": "components",
      "label": "PerformanceMonitor",
      "status": "shared",
      "files": [
        "components/PerformanceMonitor.tsx"
      ],
      "notes": []
    },
    {
      "id": "missing:#",
      "label": "Placeholder Target (#)",
      "type": "missing-route",
      "group": "missing",
      "status": "placeholder",
      "target": "#",
      "files": [],
      "notes": []
    },
    {
      "id": "route:/profile-selection",
      "type": "page",
      "group": "auth",
      "label": "Profile Selection",
      "route": "/profile-selection",
      "status": "implemented",
      "files": [
        "app/profile-selection/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/register",
      "type": "page",
      "group": "auth",
      "label": "Register",
      "route": "/register",
      "status": "implemented",
      "files": [
        "app/register/page.tsx"
      ],
      "notes": [
        "Phone verification is handled through Firebase OTP in the standard flow, but demo mode and team-review shortcuts branch around it."
      ]
    },
    {
      "id": "flow:register-outcomes",
      "type": "flow-node",
      "group": "auth",
      "label": "Registration Outcomes",
      "status": "inferred",
      "description": "Represents the different outcomes of registration: normal account creation, demo shortcut, and post-registration login routing.",
      "files": [],
      "notes": []
    },
    {
      "id": "route:/rent-equipment",
      "type": "page",
      "group": "discovery",
      "label": "Rent Equipment",
      "route": "/rent-equipment",
      "status": "implemented",
      "files": [
        "app/rent-equipment/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "missing:/renter-journey",
      "label": "Renter Journey",
      "type": "missing-route",
      "group": "missing",
      "status": "missing",
      "route": "/renter-journey",
      "files": [],
      "notes": [
        "This route is linked from the footer but no matching page exists in the app directory."
      ]
    },
    {
      "id": "route:/renter-profile",
      "type": "page",
      "group": "renter",
      "label": "Renter Profile",
      "route": "/renter-profile",
      "status": "implemented",
      "files": [
        "app/renter-profile/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/renter-profile/bookings",
      "type": "page",
      "group": "renter",
      "label": "Renter Profile / Bookings",
      "route": "/renter-profile/bookings",
      "status": "implemented",
      "files": [
        "app/renter-profile/bookings/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/renter-profile/browse",
      "type": "page",
      "group": "renter",
      "label": "Renter Profile / Browse",
      "route": "/renter-profile/browse",
      "status": "implemented",
      "files": [
        "app/renter-profile/browse/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/renter-profile/payments",
      "type": "page",
      "group": "renter",
      "label": "Renter Profile / Payments",
      "route": "/renter-profile/payments",
      "status": "implemented",
      "files": [
        "app/renter-profile/payments/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/renter-profile/saved",
      "type": "page",
      "group": "renter",
      "label": "Renter Profile / Saved",
      "route": "/renter-profile/saved",
      "status": "implemented",
      "files": [
        "app/renter-profile/saved/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/renter-profile/settings",
      "type": "page",
      "group": "renter",
      "label": "Renter Profile / Settings",
      "route": "/renter-profile/settings",
      "status": "implemented",
      "files": [
        "app/renter-profile/settings/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/renter-profile/switch-profile",
      "type": "page",
      "group": "renter",
      "label": "Renter Profile / Switch Profile",
      "route": "/renter-profile/switch-profile",
      "status": "implemented",
      "files": [
        "app/renter-profile/switch-profile/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "layout:/renter-profile",
      "type": "flow-node",
      "group": "renter",
      "label": "Renter Profile Layout",
      "route": "/renter-profile",
      "status": "inferred",
      "files": [
        "app/renter-profile/layout.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:RenterSidebar",
      "type": "shared-component",
      "group": "components",
      "label": "RenterSidebar",
      "status": "shared",
      "files": [
        "components/RenterSidebar.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:RenterTopBar",
      "type": "shared-component",
      "group": "components",
      "label": "RenterTopBar",
      "status": "shared",
      "files": [
        "components/RenterTopBar.tsx"
      ],
      "notes": []
    },
    {
      "id": "flow:role-router",
      "type": "flow-node",
      "group": "auth",
      "label": "Role-Based Redirect",
      "status": "inferred",
      "description": "Decides whether an authenticated user should land in the owner workspace, renter workspace, or profile selection.",
      "files": [],
      "notes": []
    },
    {
      "id": "route:/support",
      "type": "page",
      "group": "support",
      "label": "Support",
      "route": "/support",
      "status": "implemented",
      "files": [
        "app/support/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "component:ThemeToggle",
      "type": "shared-component",
      "group": "components",
      "label": "ThemeToggle",
      "status": "shared",
      "files": [
        "components/ThemeToggle.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/trust-safety",
      "type": "page",
      "group": "support",
      "label": "Trust Safety",
      "route": "/trust-safety",
      "status": "implemented",
      "files": [
        "app/trust-safety/page.tsx"
      ],
      "notes": []
    },
    {
      "id": "route:/verify-contact",
      "type": "page",
      "group": "auth",
      "label": "Verify Contact",
      "route": "/verify-contact",
      "status": "implemented",
      "files": [
        "app/verify-contact/page.tsx"
      ],
      "notes": [
        "This page represents a legacy Appwrite phone verification flow and still contains conditional/demo-only behavior."
      ]
    }
  ],
  "edges": [
    {
      "id": "edge-144",
      "source": "component:Footer",
      "target": "external:https://linkedin.com/company/kisankamai",
      "type": "external-link",
      "label": "https://linkedin.com/company/kisankamai",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 50,
          "raw": "https://linkedin.com/company/kisankamai",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-143",
      "source": "component:Footer",
      "target": "external:https://x.com/kisankamai",
      "type": "external-link",
      "label": "https://x.com/kisankamai",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 47,
          "raw": "https://x.com/kisankamai",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-145",
      "source": "component:Footer",
      "target": "external:https://youtube.com/@kisankamai",
      "type": "external-link",
      "label": "https://youtube.com/@kisankamai",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 53,
          "raw": "https://youtube.com/@kisankamai",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-148",
      "source": "component:Footer",
      "target": "missing:/renter-journey",
      "type": "internal-link",
      "label": "/renter-journey",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 63,
          "raw": "/renter-journey",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-142",
      "source": "component:Footer",
      "target": "route:/",
      "type": "internal-link",
      "label": "/",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 14,
          "raw": "/",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-156",
      "source": "component:Footer",
      "target": "route:/about",
      "type": "internal-link",
      "label": "/about",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 80,
          "raw": "/about",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-149",
      "source": "component:Footer",
      "target": "route:/booking",
      "type": "internal-link",
      "label": "/booking",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 64,
          "raw": "/booking",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-151",
      "source": "component:Footer",
      "target": "route:/faq",
      "type": "internal-link",
      "label": "/faq",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 66,
          "raw": "/faq",
          "context": "href-attribute"
        },
        {
          "file": "components/Footer.tsx",
          "line": 95,
          "raw": "/faq",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-161",
      "source": "component:Footer",
      "target": "route:/feedback",
      "type": "internal-link",
      "label": "/feedback",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 98,
          "raw": "/feedback",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-158",
      "source": "component:Footer",
      "target": "route:/legal",
      "type": "internal-link",
      "label": "/legal",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 92,
          "raw": "/legal",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-147",
      "source": "component:Footer",
      "target": "route:/list-equipment",
      "type": "internal-link",
      "label": "/list-equipment",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 62,
          "raw": "/list-equipment",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-160",
      "source": "component:Footer",
      "target": "route:/locations",
      "type": "internal-link",
      "label": "/locations",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 97,
          "raw": "/locations",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-153",
      "source": "component:Footer",
      "target": "route:/owner-benefits",
      "type": "internal-link",
      "label": "/owner-benefits",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 73,
          "raw": "/owner-benefits",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-154",
      "source": "component:Footer",
      "target": "route:/owner-experience",
      "type": "internal-link",
      "label": "/owner-experience",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 74,
          "raw": "/owner-experience",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-155",
      "source": "component:Footer",
      "target": "route:/owner-profile",
      "type": "internal-link",
      "label": "/owner-profile",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 75,
          "raw": "/owner-profile",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-152",
      "source": "component:Footer",
      "target": "route:/owner-registration",
      "type": "internal-link",
      "label": "/owner-registration",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 72,
          "raw": "/owner-registration",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-157",
      "source": "component:Footer",
      "target": "route:/partner",
      "type": "internal-link",
      "label": "/partner",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 84,
          "raw": "/partner",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-146",
      "source": "component:Footer",
      "target": "route:/rent-equipment",
      "type": "internal-link",
      "label": "/rent-equipment",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 61,
          "raw": "/rent-equipment",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-159",
      "source": "component:Footer",
      "target": "route:/support",
      "type": "internal-link",
      "label": "/support",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 96,
          "raw": "/support",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-150",
      "source": "component:Footer",
      "target": "route:/trust-safety",
      "type": "internal-link",
      "label": "/trust-safety",
      "origins": [
        {
          "file": "components/Footer.tsx",
          "line": 65,
          "raw": "/trust-safety",
          "context": "href-attribute"
        },
        {
          "file": "components/Footer.tsx",
          "line": 88,
          "raw": "/trust-safety",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-171",
      "source": "component:Header",
      "target": "route:/",
      "type": "internal-link",
      "label": "/",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 57,
          "raw": "/",
          "context": "href-attribute"
        },
        {
          "file": "components/Header.tsx",
          "line": 67,
          "raw": "/",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-178",
      "source": "component:Header",
      "target": "route:/",
      "type": "redirect",
      "label": "/",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 57,
          "raw": "/",
          "context": "window-location"
        }
      ]
    },
    {
      "id": "edge-164",
      "source": "component:Header",
      "target": "route:/categories",
      "type": "internal-link",
      "label": "/categories",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 16,
          "raw": "/categories",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-177",
      "source": "component:Header",
      "target": "route:/legal",
      "type": "internal-link",
      "label": "/legal",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 322,
          "raw": "/legal",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-166",
      "source": "component:Header",
      "target": "route:/list-equipment",
      "type": "internal-link",
      "label": "/list-equipment",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 22,
          "raw": "/list-equipment",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-165",
      "source": "component:Header",
      "target": "route:/locations",
      "type": "internal-link",
      "label": "/locations",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 18,
          "raw": "/locations",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-172",
      "source": "component:Header",
      "target": "route:/login",
      "type": "internal-link",
      "label": "/login",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 157,
          "raw": "/login",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-163",
      "source": "component:Header",
      "target": "route:/models",
      "type": "internal-link",
      "label": "/models",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 14,
          "raw": "/models",
          "context": "object-property"
        },
        {
          "file": "components/Header.tsx",
          "line": 17,
          "raw": "/models",
          "context": "object-property"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-167",
      "source": "component:Header",
      "target": "route:/owner-benefits",
      "type": "internal-link",
      "label": "/owner-benefits",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 23,
          "raw": "/owner-benefits",
          "context": "object-property"
        },
        {
          "file": "components/Header.tsx",
          "line": 26,
          "raw": "/owner-benefits",
          "context": "object-property"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-169",
      "source": "component:Header",
      "target": "route:/owner-profile",
      "type": "internal-link",
      "label": "/owner-profile",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 27,
          "raw": "/owner-profile",
          "context": "object-property"
        },
        {
          "file": "components/Header.tsx",
          "line": 205,
          "raw": "/owner-profile",
          "context": "href-attribute"
        },
        {
          "file": "components/Header.tsx",
          "line": 304,
          "raw": "/owner-profile",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-175",
      "source": "component:Header",
      "target": "route:/owner-profile/settings",
      "type": "internal-link",
      "label": "/owner-profile/settings",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 236,
          "raw": "/owner-profile/settings",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-168",
      "source": "component:Header",
      "target": "route:/owner-registration",
      "type": "internal-link",
      "label": "/owner-registration",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 25,
          "raw": "/owner-registration",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-176",
      "source": "component:Header",
      "target": "route:/partner",
      "type": "internal-link",
      "label": "/partner",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 319,
          "raw": "/partner",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-173",
      "source": "component:Header",
      "target": "route:/register",
      "type": "internal-link",
      "label": "/register",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 163,
          "raw": "/register",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-162",
      "source": "component:Header",
      "target": "route:/rent-equipment",
      "type": "internal-link",
      "label": "/rent-equipment",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 13,
          "raw": "/rent-equipment",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-174",
      "source": "component:Header",
      "target": "route:/renter-profile",
      "type": "internal-link",
      "label": "/renter-profile",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 218,
          "raw": "/renter-profile",
          "context": "href-attribute"
        },
        {
          "file": "components/Header.tsx",
          "line": 308,
          "raw": "/renter-profile",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-170",
      "source": "component:Header",
      "target": "route:/support",
      "type": "internal-link",
      "label": "/support",
      "origins": [
        {
          "file": "components/Header.tsx",
          "line": 30,
          "raw": "/support",
          "context": "object-property"
        },
        {
          "file": "components/Header.tsx",
          "line": 244,
          "raw": "/support",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-184",
      "source": "component:OwnerSidebar",
      "target": "route:/login",
      "type": "internal-link",
      "label": "/login",
      "origins": [
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 16,
          "raw": "/login",
          "context": "href-attribute"
        },
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 20,
          "raw": "/login",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-187",
      "source": "component:OwnerSidebar",
      "target": "route:/login",
      "type": "redirect",
      "label": "/login",
      "origins": [
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 16,
          "raw": "/login",
          "context": "window-location"
        },
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 20,
          "raw": "/login",
          "context": "window-location"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-179",
      "source": "component:OwnerSidebar",
      "target": "route:/owner-profile",
      "type": "internal-link",
      "label": "/owner-profile",
      "origins": [
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 25,
          "raw": "/owner-profile",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-185",
      "source": "component:OwnerSidebar",
      "target": "route:/owner-profile/add-listing",
      "type": "internal-link",
      "label": "/owner-profile/add-listing",
      "origins": [
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 82,
          "raw": "/owner-profile/add-listing",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-181",
      "source": "component:OwnerSidebar",
      "target": "route:/owner-profile/bookings",
      "type": "internal-link",
      "label": "/owner-profile/bookings",
      "origins": [
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 27,
          "raw": "/owner-profile/bookings",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-180",
      "source": "component:OwnerSidebar",
      "target": "route:/owner-profile/equipment",
      "type": "internal-link",
      "label": "/owner-profile/equipment",
      "origins": [
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 26,
          "raw": "/owner-profile/equipment",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-182",
      "source": "component:OwnerSidebar",
      "target": "route:/owner-profile/revenue",
      "type": "internal-link",
      "label": "/owner-profile/revenue",
      "origins": [
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 28,
          "raw": "/owner-profile/revenue",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-183",
      "source": "component:OwnerSidebar",
      "target": "route:/owner-profile/settings",
      "type": "internal-link",
      "label": "/owner-profile/settings",
      "origins": [
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 29,
          "raw": "/owner-profile/settings",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-186",
      "source": "component:OwnerSidebar",
      "target": "route:/owner-profile/support",
      "type": "internal-link",
      "label": "/owner-profile/support",
      "origins": [
        {
          "file": "components/OwnerSidebar.tsx",
          "line": 90,
          "raw": "/owner-profile/support",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-188",
      "source": "component:OwnerTopBar",
      "target": "route:/",
      "type": "internal-link",
      "label": "/",
      "origins": [
        {
          "file": "components/OwnerTopBar.tsx",
          "line": 21,
          "raw": "/",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-189",
      "source": "component:OwnerTopBar",
      "target": "route:/renter-profile",
      "type": "internal-link",
      "label": "/renter-profile",
      "origins": [
        {
          "file": "components/OwnerTopBar.tsx",
          "line": 32,
          "raw": "/renter-profile",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-196",
      "source": "component:RenterSidebar",
      "target": "route:/login",
      "type": "internal-link",
      "label": "/login",
      "origins": [
        {
          "file": "components/RenterSidebar.tsx",
          "line": 19,
          "raw": "/login",
          "context": "href-attribute"
        },
        {
          "file": "components/RenterSidebar.tsx",
          "line": 21,
          "raw": "/login",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-198",
      "source": "component:RenterSidebar",
      "target": "route:/login",
      "type": "redirect",
      "label": "/login",
      "origins": [
        {
          "file": "components/RenterSidebar.tsx",
          "line": 19,
          "raw": "/login",
          "context": "window-location"
        },
        {
          "file": "components/RenterSidebar.tsx",
          "line": 21,
          "raw": "/login",
          "context": "window-location"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-190",
      "source": "component:RenterSidebar",
      "target": "route:/renter-profile",
      "type": "internal-link",
      "label": "/renter-profile",
      "origins": [
        {
          "file": "components/RenterSidebar.tsx",
          "line": 26,
          "raw": "/renter-profile",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-192",
      "source": "component:RenterSidebar",
      "target": "route:/renter-profile/bookings",
      "type": "internal-link",
      "label": "/renter-profile/bookings",
      "origins": [
        {
          "file": "components/RenterSidebar.tsx",
          "line": 28,
          "raw": "/renter-profile/bookings",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-191",
      "source": "component:RenterSidebar",
      "target": "route:/renter-profile/browse",
      "type": "internal-link",
      "label": "/renter-profile/browse",
      "origins": [
        {
          "file": "components/RenterSidebar.tsx",
          "line": 27,
          "raw": "/renter-profile/browse",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-194",
      "source": "component:RenterSidebar",
      "target": "route:/renter-profile/payments",
      "type": "internal-link",
      "label": "/renter-profile/payments",
      "origins": [
        {
          "file": "components/RenterSidebar.tsx",
          "line": 30,
          "raw": "/renter-profile/payments",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-193",
      "source": "component:RenterSidebar",
      "target": "route:/renter-profile/saved",
      "type": "internal-link",
      "label": "/renter-profile/saved",
      "origins": [
        {
          "file": "components/RenterSidebar.tsx",
          "line": 29,
          "raw": "/renter-profile/saved",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-195",
      "source": "component:RenterSidebar",
      "target": "route:/renter-profile/settings",
      "type": "internal-link",
      "label": "/renter-profile/settings",
      "origins": [
        {
          "file": "components/RenterSidebar.tsx",
          "line": 31,
          "raw": "/renter-profile/settings",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-197",
      "source": "component:RenterSidebar",
      "target": "route:/renter-profile/switch-profile",
      "type": "internal-link",
      "label": "/renter-profile/switch-profile",
      "origins": [
        {
          "file": "components/RenterSidebar.tsx",
          "line": 97,
          "raw": "/renter-profile/switch-profile",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-199",
      "source": "component:RenterTopBar",
      "target": "route:/",
      "type": "internal-link",
      "label": "/",
      "origins": [
        {
          "file": "components/RenterTopBar.tsx",
          "line": 19,
          "raw": "/",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-200",
      "source": "component:RenterTopBar",
      "target": "route:/rent-equipment",
      "type": "internal-link",
      "label": "/rent-equipment",
      "origins": [
        {
          "file": "components/RenterTopBar.tsx",
          "line": 37,
          "raw": "/rent-equipment",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-209",
      "source": "flow:demo-mode",
      "target": "route:/profile-selection",
      "type": "conditional",
      "label": "continue demo",
      "description": "Demo users are routed directly to profile selection.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "continue demo",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-216",
      "source": "flow:oauth-return",
      "target": "route:/login",
      "type": "conditional",
      "label": "login failure return",
      "description": "Login OAuth failure returns to the login page.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "login failure return",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-217",
      "source": "flow:oauth-return",
      "target": "route:/register",
      "type": "conditional",
      "label": "register failure return",
      "description": "Registration OAuth failure returns to the register page.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "register failure return",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-215",
      "source": "flow:oauth-return",
      "target": "route:/verify-contact",
      "type": "conditional",
      "label": "OAuth success",
      "description": "Successful Google OAuth is configured to continue at verify-contact.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "OAuth success",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-211",
      "source": "flow:register-outcomes",
      "target": "route:/login",
      "type": "conditional",
      "label": "standard registration success",
      "description": "Standard registration shows the success popup and returns the user to login.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "standard registration success",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-212",
      "source": "flow:register-outcomes",
      "target": "route:/profile-selection",
      "type": "conditional",
      "label": "demo or shared account branch",
      "description": "In demo or pre-seeded shared-account branches, registration can go straight into the session flow.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "demo or shared account branch",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-202",
      "source": "flow:role-router",
      "target": "route:/owner-profile",
      "type": "conditional",
      "label": "owner role",
      "description": "Authenticated users with owner role are routed into the owner profile.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "owner role",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-204",
      "source": "flow:role-router",
      "target": "route:/profile-selection",
      "type": "conditional",
      "label": "both or missing role",
      "description": "Users with both roles or an incomplete profile path are routed to profile selection.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "both or missing role",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-203",
      "source": "flow:role-router",
      "target": "route:/renter-profile",
      "type": "conditional",
      "label": "renter role",
      "description": "Authenticated users with renter role are routed into the renter profile.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "renter role",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-61",
      "source": "layout:/owner-profile",
      "target": "component:OwnerSidebar",
      "type": "surface",
      "label": "composes",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 1,
          "raw": "OwnerSidebar",
          "context": "layout-import"
        }
      ]
    },
    {
      "id": "edge-62",
      "source": "layout:/owner-profile",
      "target": "component:OwnerTopBar",
      "type": "surface",
      "label": "composes",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 1,
          "raw": "OwnerTopBar",
          "context": "layout-import"
        }
      ]
    },
    {
      "id": "edge-70",
      "source": "layout:/owner-profile",
      "target": "route:/login",
      "type": "redirect",
      "label": "/login",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 26,
          "raw": "/login",
          "context": "router-navigation"
        }
      ]
    },
    {
      "id": "edge-112",
      "source": "layout:/renter-profile",
      "target": "component:RenterSidebar",
      "type": "surface",
      "label": "composes",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 1,
          "raw": "RenterSidebar",
          "context": "layout-import"
        }
      ]
    },
    {
      "id": "edge-113",
      "source": "layout:/renter-profile",
      "target": "component:RenterTopBar",
      "type": "surface",
      "label": "composes",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 1,
          "raw": "RenterTopBar",
          "context": "layout-import"
        }
      ]
    },
    {
      "id": "edge-121",
      "source": "layout:/renter-profile",
      "target": "route:/login",
      "type": "redirect",
      "label": "/login",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 26,
          "raw": "/login",
          "context": "router-navigation"
        }
      ]
    },
    {
      "id": "edge-81",
      "source": "route:/",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-80",
      "source": "route:/",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-84",
      "source": "route:/",
      "target": "route:/categories",
      "type": "internal-link",
      "label": "/categories",
      "origins": [
        {
          "file": "app/page.tsx",
          "line": 209,
          "raw": "/categories",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-87",
      "source": "route:/",
      "target": "route:/list-equipment",
      "type": "internal-link",
      "label": "/list-equipment",
      "origins": [
        {
          "file": "app/page.tsx",
          "line": 488,
          "raw": "/list-equipment",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-85",
      "source": "route:/",
      "target": "route:/models",
      "type": "internal-link",
      "label": "/models",
      "origins": [
        {
          "file": "app/page.tsx",
          "line": 215,
          "raw": "/models",
          "context": "href-attribute"
        },
        {
          "file": "app/page.tsx",
          "line": 227,
          "raw": "/models",
          "context": "href-attribute"
        },
        {
          "file": "app/page.tsx",
          "line": 239,
          "raw": "/models",
          "context": "href-attribute"
        },
        {
          "file": "app/page.tsx",
          "line": 251,
          "raw": "/models",
          "context": "href-attribute"
        },
        {
          "file": "app/page.tsx",
          "line": 263,
          "raw": "/models",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-83",
      "source": "route:/",
      "target": "route:/owner-registration",
      "type": "internal-link",
      "label": "/owner-registration",
      "origins": [
        {
          "file": "app/page.tsx",
          "line": 192,
          "raw": "/owner-registration",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-82",
      "source": "route:/",
      "target": "route:/rent-equipment",
      "type": "internal-link",
      "label": "/rent-equipment",
      "origins": [
        {
          "file": "app/page.tsx",
          "line": 158,
          "raw": "/rent-equipment",
          "context": "href-attribute"
        },
        {
          "file": "app/page.tsx",
          "line": 485,
          "raw": "/rent-equipment",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-88",
      "source": "route:/",
      "target": "route:/rent-equipment",
      "type": "redirect",
      "label": "/rent-equipment",
      "origins": [
        {
          "file": "app/page.tsx",
          "line": 43,
          "raw": "/rent-equipment?location=${encodeURIComponent(searchLocation)}&query=${encodeURIComponent(searchQuery)}",
          "context": "router-navigation"
        }
      ]
    },
    {
      "id": "edge-86",
      "source": "route:/",
      "target": "route:/support",
      "type": "internal-link",
      "label": "/support",
      "origins": [
        {
          "file": "app/page.tsx",
          "line": 353,
          "raw": "/support",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-2",
      "source": "route:/about",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/about/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-1",
      "source": "route:/about",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/about/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-4",
      "source": "route:/booking",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/booking/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-3",
      "source": "route:/booking",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/booking/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-6",
      "source": "route:/booking/[equipmentId]",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/booking/[equipmentId]/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-5",
      "source": "route:/booking/[equipmentId]",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/booking/[equipmentId]/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-11",
      "source": "route:/catalog/[slug]",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/catalog/[slug]/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-10",
      "source": "route:/catalog/[slug]",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/catalog/[slug]/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-8",
      "source": "route:/catalog/[slug]/gallery",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/catalog/[slug]/gallery/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-7",
      "source": "route:/catalog/[slug]/gallery",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/catalog/[slug]/gallery/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-9",
      "source": "route:/catalog/[slug]/gallery",
      "target": "missing:#",
      "type": "placeholder",
      "label": "#",
      "origins": [
        {
          "file": "app/catalog/[slug]/gallery/page.tsx",
          "line": 209,
          "raw": "#",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-13",
      "source": "route:/categories",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/categories/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-12",
      "source": "route:/categories",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/categories/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-14",
      "source": "route:/categories",
      "target": "route:/models",
      "type": "internal-link",
      "label": "/models",
      "origins": [
        {
          "file": "app/categories/page.tsx",
          "line": 35,
          "raw": "/models?category=${cat.id}",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-16",
      "source": "route:/complete-profile",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/complete-profile/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-15",
      "source": "route:/complete-profile",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/complete-profile/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-207",
      "source": "route:/complete-profile",
      "target": "flow:demo-mode",
      "type": "conditional",
      "label": "demo shortcut",
      "description": "Profile completion is skipped in demo mode.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "demo shortcut",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-17",
      "source": "route:/complete-profile",
      "target": "route:/login",
      "type": "redirect",
      "label": "/login",
      "origins": [
        {
          "file": "app/complete-profile/page.tsx",
          "line": 24,
          "raw": "/login",
          "context": "router-navigation"
        },
        {
          "file": "app/complete-profile/page.tsx",
          "line": 102,
          "raw": "/login",
          "context": "router-navigation"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-18",
      "source": "route:/complete-profile",
      "target": "route:/profile-selection",
      "type": "redirect",
      "label": "/profile-selection",
      "origins": [
        {
          "file": "app/complete-profile/page.tsx",
          "line": 27,
          "raw": "/profile-selection",
          "context": "router-navigation"
        },
        {
          "file": "app/complete-profile/page.tsx",
          "line": 70,
          "raw": "/profile-selection",
          "context": "router-navigation"
        },
        {
          "file": "app/complete-profile/page.tsx",
          "line": 102,
          "raw": "/profile-selection",
          "context": "router-navigation"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-20",
      "source": "route:/faq",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/faq/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-19",
      "source": "route:/faq",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/faq/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-22",
      "source": "route:/feedback",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/feedback/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-21",
      "source": "route:/feedback",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/feedback/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-23",
      "source": "route:/feedback",
      "target": "route:/feedback/success",
      "type": "redirect",
      "label": "/feedback/success",
      "origins": [
        {
          "file": "app/feedback/page.tsx",
          "line": 14,
          "raw": "/feedback/success",
          "context": "router-navigation"
        }
      ]
    },
    {
      "id": "edge-25",
      "source": "route:/feedback/success",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/feedback/success/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-24",
      "source": "route:/feedback/success",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/feedback/success/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-26",
      "source": "route:/feedback/success",
      "target": "route:/",
      "type": "internal-link",
      "label": "/",
      "origins": [
        {
          "file": "app/feedback/success/page.tsx",
          "line": 45,
          "raw": "/",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-27",
      "source": "route:/feedback/success",
      "target": "route:/rent-equipment",
      "type": "internal-link",
      "label": "/rent-equipment",
      "origins": [
        {
          "file": "app/feedback/success/page.tsx",
          "line": 52,
          "raw": "/rent-equipment",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-28",
      "source": "route:/feedback/success",
      "target": "route:/support",
      "type": "internal-link",
      "label": "/support",
      "origins": [
        {
          "file": "app/feedback/success/page.tsx",
          "line": 59,
          "raw": "/support",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-29",
      "source": "route:/forgot-password",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/forgot-password/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-30",
      "source": "route:/forgot-password",
      "target": "route:/login",
      "type": "redirect",
      "label": "/login",
      "origins": [
        {
          "file": "app/forgot-password/page.tsx",
          "line": 135,
          "raw": "/login",
          "context": "router-navigation"
        },
        {
          "file": "app/forgot-password/page.tsx",
          "line": 154,
          "raw": "/login",
          "context": "router-navigation"
        },
        {
          "file": "app/forgot-password/page.tsx",
          "line": 231,
          "raw": "/login",
          "context": "router-navigation"
        },
        {
          "file": "app/forgot-password/page.tsx",
          "line": 403,
          "raw": "/login",
          "context": "router-navigation"
        },
        {
          "file": "app/forgot-password/page.tsx",
          "line": 436,
          "raw": "/login",
          "context": "router-navigation"
        },
        {
          "file": "app/forgot-password/page.tsx",
          "line": 455,
          "raw": "/login",
          "context": "router-navigation"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-32",
      "source": "route:/legal",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/legal/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-31",
      "source": "route:/legal",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/legal/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-33",
      "source": "route:/legal",
      "target": "missing:#",
      "type": "placeholder",
      "label": "#",
      "origins": [
        {
          "file": "app/legal/page.tsx",
          "line": 52,
          "raw": "#",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-35",
      "source": "route:/list-equipment",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/list-equipment/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-34",
      "source": "route:/list-equipment",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/list-equipment/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-37",
      "source": "route:/locations",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/locations/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-36",
      "source": "route:/locations",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/locations/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-41",
      "source": "route:/locations/[city]",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/locations/[city]/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-40",
      "source": "route:/locations/[city]",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/locations/[city]/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-39",
      "source": "route:/locations/[city]/no-results",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/locations/[city]/no-results/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-38",
      "source": "route:/locations/[city]/no-results",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/locations/[city]/no-results/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-43",
      "source": "route:/login",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-42",
      "source": "route:/login",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-205",
      "source": "route:/login",
      "target": "flow:demo-mode",
      "type": "conditional",
      "label": "demo credentials",
      "description": "Demo mode intercepts normal login and starts a browser-local session.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "demo credentials",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-213",
      "source": "route:/login",
      "target": "flow:oauth-return",
      "type": "inferred",
      "label": "Google OAuth",
      "description": "Google login sends the user to verify-contact on success and back to login on failure.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "Google OAuth",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-201",
      "source": "route:/login",
      "target": "flow:role-router",
      "type": "inferred",
      "label": "session created",
      "description": "After Appwrite session creation, login fetches the profile and routes based on the saved role.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "session created",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-49",
      "source": "route:/login",
      "target": "route:/forgot-password",
      "type": "redirect",
      "label": "/forgot-password",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 178,
          "raw": "/forgot-password",
          "context": "router-navigation"
        }
      ]
    },
    {
      "id": "edge-51",
      "source": "route:/login",
      "target": "route:/login",
      "type": "redirect",
      "label": "/login",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 99,
          "raw": "${window.location.origin}/login",
          "context": "oauth-return"
        }
      ]
    },
    {
      "id": "edge-46",
      "source": "route:/login",
      "target": "route:/owner-profile",
      "type": "redirect",
      "label": "/owner-profile",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 70,
          "raw": "/owner-profile",
          "context": "router-navigation"
        }
      ]
    },
    {
      "id": "edge-44",
      "source": "route:/login",
      "target": "route:/profile-selection",
      "type": "internal-link",
      "label": "/profile-selection",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 51,
          "raw": "/profile-selection",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-48",
      "source": "route:/login",
      "target": "route:/profile-selection",
      "type": "redirect",
      "label": "/profile-selection",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 51,
          "raw": "/profile-selection",
          "context": "window-location"
        },
        {
          "file": "app/login/page.tsx",
          "line": 74,
          "raw": "/profile-selection",
          "context": "router-navigation"
        },
        {
          "file": "app/login/page.tsx",
          "line": 78,
          "raw": "/profile-selection",
          "context": "router-navigation"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-45",
      "source": "route:/login",
      "target": "route:/register",
      "type": "internal-link",
      "label": "/register",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 238,
          "raw": "/register",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-47",
      "source": "route:/login",
      "target": "route:/renter-profile",
      "type": "redirect",
      "label": "/renter-profile",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 72,
          "raw": "/renter-profile",
          "context": "router-navigation"
        }
      ]
    },
    {
      "id": "edge-50",
      "source": "route:/login",
      "target": "route:/verify-contact",
      "type": "redirect",
      "label": "/verify-contact",
      "origins": [
        {
          "file": "app/login/page.tsx",
          "line": 99,
          "raw": "${window.location.origin}/verify-contact",
          "context": "oauth-return"
        }
      ]
    },
    {
      "id": "edge-53",
      "source": "route:/models",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/models/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-52",
      "source": "route:/models",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/models/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-54",
      "source": "route:/models",
      "target": "route:/rent-equipment",
      "type": "internal-link",
      "label": "/rent-equipment",
      "origins": [
        {
          "file": "app/models/page.tsx",
          "line": 89,
          "raw": "/rent-equipment?query=${encodeURIComponent(item.name)}",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-56",
      "source": "route:/owner-benefits",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/owner-benefits/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-55",
      "source": "route:/owner-benefits",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/owner-benefits/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-58",
      "source": "route:/owner-experience",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/owner-experience/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-57",
      "source": "route:/owner-experience",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/owner-experience/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-66",
      "source": "route:/owner-profile",
      "target": "layout:/owner-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 1,
          "raw": "/owner-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-71",
      "source": "route:/owner-profile",
      "target": "route:/owner-profile/add-listing",
      "type": "internal-link",
      "label": "/owner-profile/add-listing",
      "origins": [
        {
          "file": "app/owner-profile/page.tsx",
          "line": 21,
          "raw": "/owner-profile/add-listing",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-72",
      "source": "route:/owner-profile",
      "target": "route:/owner-profile/bookings",
      "type": "internal-link",
      "label": "/owner-profile/bookings",
      "origins": [
        {
          "file": "app/owner-profile/page.tsx",
          "line": 25,
          "raw": "/owner-profile/bookings",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-63",
      "source": "route:/owner-profile/add-listing",
      "target": "layout:/owner-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 1,
          "raw": "/owner-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-64",
      "source": "route:/owner-profile/bookings",
      "target": "layout:/owner-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 1,
          "raw": "/owner-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-59",
      "source": "route:/owner-profile/bookings",
      "target": "route:/owner-profile/revenue",
      "type": "internal-link",
      "label": "/owner-profile/revenue",
      "origins": [
        {
          "file": "app/owner-profile/bookings/page.tsx",
          "line": 214,
          "raw": "/owner-profile/revenue",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-65",
      "source": "route:/owner-profile/equipment",
      "target": "layout:/owner-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 1,
          "raw": "/owner-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-60",
      "source": "route:/owner-profile/equipment",
      "target": "route:/owner-profile/add-listing",
      "type": "internal-link",
      "label": "/owner-profile/add-listing",
      "origins": [
        {
          "file": "app/owner-profile/equipment/page.tsx",
          "line": 10,
          "raw": "/owner-profile/add-listing",
          "context": "href-attribute"
        },
        {
          "file": "app/owner-profile/equipment/page.tsx",
          "line": 89,
          "raw": "/owner-profile/add-listing",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-67",
      "source": "route:/owner-profile/revenue",
      "target": "layout:/owner-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 1,
          "raw": "/owner-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-68",
      "source": "route:/owner-profile/settings",
      "target": "layout:/owner-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 1,
          "raw": "/owner-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-73",
      "source": "route:/owner-profile/support",
      "target": "external:https://wa.me/#",
      "type": "placeholder",
      "label": "https://wa.me/#",
      "origins": [
        {
          "file": "app/owner-profile/support/page.tsx",
          "line": 155,
          "raw": "https://wa.me/#",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-75",
      "source": "route:/owner-profile/support",
      "target": "external:mailto:support@kisankamai.in",
      "type": "external-link",
      "label": "mailto:support@kisankamai.in",
      "origins": [
        {
          "file": "app/owner-profile/support/page.tsx",
          "line": 173,
          "raw": "mailto:support@kisankamai.in",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-74",
      "source": "route:/owner-profile/support",
      "target": "external:tel:+",
      "type": "placeholder",
      "label": "tel:+",
      "origins": [
        {
          "file": "app/owner-profile/support/page.tsx",
          "line": 164,
          "raw": "tel:+",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-69",
      "source": "route:/owner-profile/support",
      "target": "layout:/owner-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/owner-profile/layout.tsx",
          "line": 1,
          "raw": "/owner-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-76",
      "source": "route:/owner-profile/support",
      "target": "route:/faq",
      "type": "internal-link",
      "label": "/faq",
      "origins": [
        {
          "file": "app/owner-profile/support/page.tsx",
          "line": 187,
          "raw": "/faq",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-78",
      "source": "route:/owner-registration",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/owner-registration/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-77",
      "source": "route:/owner-registration",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/owner-registration/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-79",
      "source": "route:/owner-registration",
      "target": "route:/owner-profile",
      "type": "internal-link",
      "label": "/owner-profile",
      "origins": [
        {
          "file": "app/owner-registration/page.tsx",
          "line": 171,
          "raw": "/owner-profile",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-90",
      "source": "route:/partner",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/partner/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-89",
      "source": "route:/partner",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/partner/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-91",
      "source": "route:/partner",
      "target": "external:mailto:partners@kisankamai.com",
      "type": "external-link",
      "label": "mailto:partners@kisankamai.com",
      "origins": [
        {
          "file": "app/partner/page.tsx",
          "line": 235,
          "raw": "mailto:partners@kisankamai.com",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-92",
      "source": "route:/profile-selection",
      "target": "component:LanguageToggle",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/profile-selection/page.tsx",
          "line": 1,
          "raw": "LanguageToggle",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-93",
      "source": "route:/profile-selection",
      "target": "component:ThemeToggle",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/profile-selection/page.tsx",
          "line": 1,
          "raw": "ThemeToggle",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-96",
      "source": "route:/profile-selection",
      "target": "route:/",
      "type": "internal-link",
      "label": "/",
      "origins": [
        {
          "file": "app/profile-selection/page.tsx",
          "line": 57,
          "raw": "/",
          "context": "href-attribute"
        },
        {
          "file": "app/profile-selection/page.tsx",
          "line": 63,
          "raw": "/",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-98",
      "source": "route:/profile-selection",
      "target": "route:/legal",
      "type": "internal-link",
      "label": "/legal",
      "origins": [
        {
          "file": "app/profile-selection/page.tsx",
          "line": 149,
          "raw": "/legal",
          "context": "href-attribute"
        },
        {
          "file": "app/profile-selection/page.tsx",
          "line": 152,
          "raw": "/legal",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-94",
      "source": "route:/profile-selection",
      "target": "route:/owner-profile",
      "type": "internal-link",
      "label": "/owner-profile",
      "origins": [
        {
          "file": "app/profile-selection/page.tsx",
          "line": 12,
          "raw": "/owner-profile",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-95",
      "source": "route:/profile-selection",
      "target": "route:/renter-profile",
      "type": "internal-link",
      "label": "/renter-profile",
      "origins": [
        {
          "file": "app/profile-selection/page.tsx",
          "line": 28,
          "raw": "/renter-profile",
          "context": "object-property"
        }
      ]
    },
    {
      "id": "edge-97",
      "source": "route:/profile-selection",
      "target": "route:/support",
      "type": "internal-link",
      "label": "/support",
      "origins": [
        {
          "file": "app/profile-selection/page.tsx",
          "line": 136,
          "raw": "/support",
          "context": "href-attribute"
        },
        {
          "file": "app/profile-selection/page.tsx",
          "line": 155,
          "raw": "/support",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-100",
      "source": "route:/register",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-99",
      "source": "route:/register",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-206",
      "source": "route:/register",
      "target": "flow:demo-mode",
      "type": "conditional",
      "label": "demo credentials",
      "description": "Demo mode bypasses OTP and starts a browser-local session for the shared credentials.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "demo credentials",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-214",
      "source": "route:/register",
      "target": "flow:oauth-return",
      "type": "inferred",
      "label": "Google OAuth",
      "description": "Google registration returns to verify-contact on success and back to register on failure.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "Google OAuth",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-210",
      "source": "route:/register",
      "target": "flow:register-outcomes",
      "type": "inferred",
      "label": "submit registration",
      "description": "Registration has multiple branches: OTP-gated creation, team-review shortcut, and demo shortcut.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "submit registration",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-102",
      "source": "route:/register",
      "target": "route:/login",
      "type": "internal-link",
      "label": "/login",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 670,
          "raw": "/login",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-106",
      "source": "route:/register",
      "target": "route:/login",
      "type": "redirect",
      "label": "/login",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 468,
          "raw": "/login",
          "context": "router-navigation"
        },
        {
          "file": "app/register/page.tsx",
          "line": 687,
          "raw": "/login",
          "context": "router-navigation"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-103",
      "source": "route:/register",
      "target": "route:/owner-profile",
      "type": "redirect",
      "label": "/owner-profile",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 29,
          "raw": "/owner-profile",
          "context": "router-navigation"
        },
        {
          "file": "app/register/page.tsx",
          "line": 266,
          "raw": "/owner-profile",
          "context": "router-navigation"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-101",
      "source": "route:/register",
      "target": "route:/profile-selection",
      "type": "internal-link",
      "label": "/profile-selection",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 398,
          "raw": "/profile-selection",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-105",
      "source": "route:/register",
      "target": "route:/profile-selection",
      "type": "redirect",
      "label": "/profile-selection",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 270,
          "raw": "/profile-selection",
          "context": "router-navigation"
        },
        {
          "file": "app/register/page.tsx",
          "line": 273,
          "raw": "/profile-selection",
          "context": "router-navigation"
        },
        {
          "file": "app/register/page.tsx",
          "line": 398,
          "raw": "/profile-selection",
          "context": "window-location"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-108",
      "source": "route:/register",
      "target": "route:/register",
      "type": "redirect",
      "label": "/register",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 489,
          "raw": "${window.location.origin}/register",
          "context": "oauth-return"
        }
      ]
    },
    {
      "id": "edge-104",
      "source": "route:/register",
      "target": "route:/renter-profile",
      "type": "redirect",
      "label": "/renter-profile",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 268,
          "raw": "/renter-profile",
          "context": "router-navigation"
        }
      ]
    },
    {
      "id": "edge-107",
      "source": "route:/register",
      "target": "route:/verify-contact",
      "type": "redirect",
      "label": "/verify-contact",
      "origins": [
        {
          "file": "app/register/page.tsx",
          "line": 489,
          "raw": "${window.location.origin}/verify-contact",
          "context": "oauth-return"
        }
      ]
    },
    {
      "id": "edge-110",
      "source": "route:/rent-equipment",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/rent-equipment/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-109",
      "source": "route:/rent-equipment",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/rent-equipment/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-116",
      "source": "route:/renter-profile",
      "target": "layout:/renter-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 1,
          "raw": "/renter-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-122",
      "source": "route:/renter-profile",
      "target": "route:/renter-profile/bookings",
      "type": "internal-link",
      "label": "/renter-profile/bookings",
      "origins": [
        {
          "file": "app/renter-profile/page.tsx",
          "line": 48,
          "raw": "/renter-profile/bookings",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-123",
      "source": "route:/renter-profile",
      "target": "route:/support",
      "type": "internal-link",
      "label": "/support",
      "origins": [
        {
          "file": "app/renter-profile/page.tsx",
          "line": 246,
          "raw": "/support",
          "context": "href-attribute"
        },
        {
          "file": "app/renter-profile/page.tsx",
          "line": 249,
          "raw": "/support",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-114",
      "source": "route:/renter-profile/bookings",
      "target": "layout:/renter-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 1,
          "raw": "/renter-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-115",
      "source": "route:/renter-profile/browse",
      "target": "layout:/renter-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 1,
          "raw": "/renter-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-111",
      "source": "route:/renter-profile/browse",
      "target": "route:/rent-equipment",
      "type": "internal-link",
      "label": "/rent-equipment",
      "origins": [
        {
          "file": "app/renter-profile/browse/page.tsx",
          "line": 89,
          "raw": "/rent-equipment",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-117",
      "source": "route:/renter-profile/payments",
      "target": "layout:/renter-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 1,
          "raw": "/renter-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-118",
      "source": "route:/renter-profile/saved",
      "target": "layout:/renter-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 1,
          "raw": "/renter-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-124",
      "source": "route:/renter-profile/saved",
      "target": "route:/rent-equipment",
      "type": "internal-link",
      "label": "/rent-equipment",
      "origins": [
        {
          "file": "app/renter-profile/saved/page.tsx",
          "line": 45,
          "raw": "/rent-equipment",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-125",
      "source": "route:/renter-profile/saved",
      "target": "route:/renter-profile/browse",
      "type": "internal-link",
      "label": "/renter-profile/browse",
      "origins": [
        {
          "file": "app/renter-profile/saved/page.tsx",
          "line": 61,
          "raw": "/renter-profile/browse",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-119",
      "source": "route:/renter-profile/settings",
      "target": "layout:/renter-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 1,
          "raw": "/renter-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-120",
      "source": "route:/renter-profile/switch-profile",
      "target": "layout:/renter-profile",
      "type": "surface",
      "label": "wrapped by layout",
      "origins": [
        {
          "file": "app/renter-profile/layout.tsx",
          "line": 1,
          "raw": "/renter-profile",
          "context": "layout-scope"
        }
      ]
    },
    {
      "id": "edge-126",
      "source": "route:/renter-profile/switch-profile",
      "target": "route:/owner-profile",
      "type": "internal-link",
      "label": "/owner-profile",
      "origins": [
        {
          "file": "app/renter-profile/switch-profile/page.tsx",
          "line": 46,
          "raw": "/owner-profile",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-128",
      "source": "route:/support",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/support/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-127",
      "source": "route:/support",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/support/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-130",
      "source": "route:/support",
      "target": "external:mailto:support@kisankamai.com",
      "type": "external-link",
      "label": "mailto:support@kisankamai.com",
      "origins": [
        {
          "file": "app/support/page.tsx",
          "line": 69,
          "raw": "mailto:support@kisankamai.com",
          "context": "href-attribute"
        },
        {
          "file": "app/support/page.tsx",
          "line": 79,
          "raw": "mailto:support@kisankamai.com",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-129",
      "source": "route:/support",
      "target": "external:tel:+9118005472652624",
      "type": "external-link",
      "label": "tel:+9118005472652624",
      "origins": [
        {
          "file": "app/support/page.tsx",
          "line": 59,
          "raw": "tel:+9118005472652624",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-131",
      "source": "route:/support",
      "target": "route:/faq",
      "type": "internal-link",
      "label": "/faq",
      "origins": [
        {
          "file": "app/support/page.tsx",
          "line": 93,
          "raw": "/faq",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-132",
      "source": "route:/support",
      "target": "route:/list-equipment",
      "type": "internal-link",
      "label": "/list-equipment",
      "origins": [
        {
          "file": "app/support/page.tsx",
          "line": 98,
          "raw": "/list-equipment",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-134",
      "source": "route:/trust-safety",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/trust-safety/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-133",
      "source": "route:/trust-safety",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/trust-safety/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-135",
      "source": "route:/trust-safety",
      "target": "external:mailto:Support@krishiseva.in",
      "type": "external-link",
      "label": "mailto:Support@krishiseva.in",
      "origins": [
        {
          "file": "app/trust-safety/page.tsx",
          "line": 98,
          "raw": "mailto:Support@krishiseva.in",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-136",
      "source": "route:/trust-safety",
      "target": "external:tel:+918001234567",
      "type": "external-link",
      "label": "tel:+918001234567",
      "origins": [
        {
          "file": "app/trust-safety/page.tsx",
          "line": 102,
          "raw": "tel:+918001234567",
          "context": "href-attribute"
        }
      ]
    },
    {
      "id": "edge-138",
      "source": "route:/verify-contact",
      "target": "component:Footer",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/verify-contact/page.tsx",
          "line": 1,
          "raw": "Footer",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-137",
      "source": "route:/verify-contact",
      "target": "component:Header",
      "type": "surface",
      "label": "renders",
      "origins": [
        {
          "file": "app/verify-contact/page.tsx",
          "line": 1,
          "raw": "Header",
          "context": "component-import"
        }
      ]
    },
    {
      "id": "edge-208",
      "source": "route:/verify-contact",
      "target": "flow:demo-mode",
      "type": "conditional",
      "label": "demo shortcut",
      "description": "Contact verification is skipped in demo mode.",
      "origins": [
        {
          "file": "docs/site-map/annotations.js",
          "line": 1,
          "raw": "demo shortcut",
          "context": "annotation"
        }
      ]
    },
    {
      "id": "edge-141",
      "source": "route:/verify-contact",
      "target": "route:/login",
      "type": "redirect",
      "label": "/login",
      "origins": [
        {
          "file": "app/verify-contact/page.tsx",
          "line": 79,
          "raw": "/login",
          "context": "router-navigation"
        },
        {
          "file": "app/verify-contact/page.tsx",
          "line": 281,
          "raw": "/login",
          "context": "router-navigation"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-139",
      "source": "route:/verify-contact",
      "target": "route:/profile-selection",
      "type": "internal-link",
      "label": "/profile-selection",
      "origins": [
        {
          "file": "app/verify-contact/page.tsx",
          "line": 225,
          "raw": "/profile-selection",
          "context": "href-attribute"
        },
        {
          "file": "app/verify-contact/page.tsx",
          "line": 246,
          "raw": "/profile-selection",
          "context": "href-attribute"
        }
      ],
      "description": ""
    },
    {
      "id": "edge-140",
      "source": "route:/verify-contact",
      "target": "route:/profile-selection",
      "type": "redirect",
      "label": "/profile-selection",
      "origins": [
        {
          "file": "app/verify-contact/page.tsx",
          "line": 62,
          "raw": "/profile-selection",
          "context": "router-navigation"
        },
        {
          "file": "app/verify-contact/page.tsx",
          "line": 225,
          "raw": "/profile-selection",
          "context": "window-location"
        },
        {
          "file": "app/verify-contact/page.tsx",
          "line": 246,
          "raw": "/profile-selection",
          "context": "window-location"
        },
        {
          "file": "app/verify-contact/page.tsx",
          "line": 281,
          "raw": "/profile-selection",
          "context": "router-navigation"
        }
      ],
      "description": ""
    }
  ]
};

  if (typeof module === "object" && module.exports) {
    module.exports = data;
  }

  root.SITE_MAP_DATA = data;
})(typeof globalThis !== "undefined" ? globalThis : this);
