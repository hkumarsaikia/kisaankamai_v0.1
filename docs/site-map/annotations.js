(function (root, factory) {
  const value = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = value;
  }

  root.SITE_MAP_ANNOTATIONS = value;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  return {
    extraNodes: [
      {
        id: "flow:role-router",
        type: "flow-node",
        group: "auth",
        label: "Role-Based Redirect",
        status: "inferred",
        description:
          "Decides whether an authenticated user should land in the owner workspace, renter workspace, or profile selection."
      },
      {
        id: "flow:register-outcomes",
        type: "flow-node",
        group: "auth",
        label: "Registration Outcomes",
        status: "inferred",
        description:
          "Represents the different outcomes of registration: normal account creation, demo shortcut, and post-registration login routing."
      },
      {
        id: "flow:demo-mode",
        type: "flow-node",
        group: "auth",
        label: "Demo Auth Mode",
        status: "inferred",
        description:
          "Browser-local demo mode that bypasses backend auth and OTP for the shared demo credentials."
      },
      {
        id: "flow:oauth-return",
        type: "flow-node",
        group: "auth",
        label: "Google OAuth Return",
        status: "inferred",
        description:
          "Represents Google OAuth success and failure return paths configured on login and registration."
      }
    ],
    extraEdges: [
      {
        source: "route:/login",
        target: "flow:role-router",
        type: "inferred",
        label: "session created",
        description:
          "After Appwrite session creation, login fetches the profile and routes based on the saved role."
      },
      {
        source: "flow:role-router",
        target: "route:/owner-profile",
        type: "conditional",
        label: "owner role",
        description: "Authenticated users with owner role are routed into the owner profile."
      },
      {
        source: "flow:role-router",
        target: "route:/renter-profile",
        type: "conditional",
        label: "renter role",
        description: "Authenticated users with renter role are routed into the renter profile."
      },
      {
        source: "flow:role-router",
        target: "route:/profile-selection",
        type: "conditional",
        label: "both or missing role",
        description:
          "Users with both roles or an incomplete profile path are routed to profile selection."
      },
      {
        source: "route:/login",
        target: "flow:demo-mode",
        type: "conditional",
        label: "demo credentials",
        description: "Demo mode intercepts normal login and starts a browser-local session."
      },
      {
        source: "route:/register",
        target: "flow:demo-mode",
        type: "conditional",
        label: "demo credentials",
        description: "Demo mode bypasses OTP and starts a browser-local session for the shared credentials."
      },
      {
        source: "route:/complete-profile",
        target: "flow:demo-mode",
        type: "conditional",
        label: "demo shortcut",
        description: "Profile completion is skipped in demo mode."
      },
      {
        source: "route:/verify-contact",
        target: "flow:demo-mode",
        type: "conditional",
        label: "demo shortcut",
        description: "Contact verification is skipped in demo mode."
      },
      {
        source: "flow:demo-mode",
        target: "route:/profile-selection",
        type: "conditional",
        label: "continue demo",
        description: "Demo users are routed directly to profile selection."
      },
      {
        source: "route:/register",
        target: "flow:register-outcomes",
        type: "inferred",
        label: "submit registration",
        description:
          "Registration has multiple branches: OTP-gated creation, team-review shortcut, and demo shortcut."
      },
      {
        source: "flow:register-outcomes",
        target: "route:/login",
        type: "conditional",
        label: "standard registration success",
        description: "Standard registration shows the success popup and returns the user to login."
      },
      {
        source: "flow:register-outcomes",
        target: "route:/profile-selection",
        type: "conditional",
        label: "demo or shared account branch",
        description:
          "In demo or pre-seeded shared-account branches, registration can go straight into the session flow."
      },
      {
        source: "route:/login",
        target: "flow:oauth-return",
        type: "inferred",
        label: "Google OAuth",
        description: "Google login sends the user to verify-contact on success and back to login on failure."
      },
      {
        source: "route:/register",
        target: "flow:oauth-return",
        type: "inferred",
        label: "Google OAuth",
        description: "Google registration returns to verify-contact on success and back to register on failure."
      },
      {
        source: "flow:oauth-return",
        target: "route:/verify-contact",
        type: "conditional",
        label: "OAuth success",
        description: "Successful Google OAuth is configured to continue at verify-contact."
      },
      {
        source: "flow:oauth-return",
        target: "route:/login",
        type: "conditional",
        label: "login failure return",
        description: "Login OAuth failure returns to the login page."
      },
      {
        source: "flow:oauth-return",
        target: "route:/register",
        type: "conditional",
        label: "register failure return",
        description: "Registration OAuth failure returns to the register page."
      }
    ],
    journeyLenses: {
      renterBooking: {
        label: "Renter Booking",
        description:
          "Shows how a renter moves from the home page into equipment discovery, booking submission, and booking follow-up.",
        stages: [
          {
            id: "entry",
            label: "Entry",
            nodeIds: ["route:/", "route:/rent-equipment", "route:/categories", "route:/models", "route:/locations"]
          },
          {
            id: "discovery",
            label: "Discovery",
            nodeIds: [
              "route:/catalog/[slug]",
              "route:/catalog/[slug]/gallery",
              "route:/equipment/[id]",
              "route:/locations/[city]",
              "route:/locations/[city]/no-results"
            ]
          },
          {
            id: "access",
            label: "Access",
            nodeIds: [
              "route:/login",
              "route:/register",
              "route:/verify-contact",
              "route:/complete-profile",
              "route:/profile-selection",
              "flow:role-router",
              "flow:register-outcomes",
              "flow:oauth-return",
              "flow:demo-mode"
            ]
          },
          {
            id: "action",
            label: "Action",
            nodeIds: [
              "route:/booking",
              "route:/booking/[equipmentId]",
              "route:/renter-profile",
              "route:/renter-profile/browse",
              "route:/renter-profile/bookings",
              "route:/renter-profile/saved"
            ]
          },
          {
            id: "goal",
            label: "Goal",
            nodes: [
              {
                id: "journey:renter:booking-submitted",
                type: "flow-node",
                group: "goal",
                label: "Booking Submitted",
                status: "inferred",
                description: "Represents the renter successfully sending a booking request."
              },
              {
                id: "journey:renter:owner-confirmation",
                type: "flow-node",
                group: "goal",
                label: "Owner Confirmation Pending",
                status: "inferred",
                description: "Represents the waiting state before the equipment owner confirms the request."
              },
              {
                id: "journey:renter:track-booking",
                type: "flow-node",
                group: "goal",
                label: "Track Booking",
                status: "inferred",
                description: "Represents the renter monitoring status from the bookings area."
              }
            ]
          }
        ],
        extraEdges: [
          {
            source: "route:/",
            target: "route:/rent-equipment",
            type: "journey",
            label: "Start renting",
            description: "Primary home-page CTA into the renter journey."
          },
          {
            source: "route:/",
            target: "route:/models",
            type: "journey",
            label: "Explore models",
            description: "Home-page category exploration path."
          },
          {
            source: "route:/",
            target: "route:/locations",
            type: "journey",
            label: "Explore by location",
            description: "Home-page location-driven discovery path."
          },
          {
            source: "route:/models",
            target: "route:/catalog/[slug]",
            type: "journey",
            label: "Choose model family",
            description: "Model browsing feeds into the catalog detail path."
          },
          {
            source: "route:/catalog/[slug]",
            target: "route:/equipment/[id]",
            type: "journey",
            label: "Inspect equipment",
            description: "Catalog exploration narrows into an equipment-specific detail view."
          },
          {
            source: "route:/equipment/[id]",
            target: "route:/booking/[equipmentId]",
            type: "journey",
            label: "Book selected equipment",
            description: "Equipment detail ultimately drives into the equipment-specific booking flow."
          },
          {
            source: "route:/rent-equipment",
            target: "route:/booking/[equipmentId]",
            type: "journey",
            label: "Book now",
            description: "Discovery cards and booking CTAs imply this transition."
          },
          {
            source: "route:/locations/[city]",
            target: "route:/booking/[equipmentId]",
            type: "journey",
            label: "Book nearby machine",
            description: "City listing cards imply the next step into booking."
          },
          {
            source: "route:/booking",
            target: "journey:renter:booking-submitted",
            type: "journey",
            label: "Submit request",
            description: "The general booking page represents the staged request flow."
          },
          {
            source: "route:/booking/[equipmentId]",
            target: "journey:renter:booking-submitted",
            type: "journey",
            label: "Submit request",
            description: "Equipment-specific booking continues to the submitted request state."
          },
          {
            source: "journey:renter:booking-submitted",
            target: "journey:renter:owner-confirmation",
            type: "journey",
            label: "Await owner approval",
            description: "Booking success leads into owner confirmation."
          },
          {
            source: "journey:renter:owner-confirmation",
            target: "journey:renter:track-booking",
            type: "journey",
            label: "Monitor booking",
            description: "After submission, the renter follows status and fulfillment."
          },
          {
            source: "route:/renter-profile/bookings",
            target: "journey:renter:track-booking",
            type: "journey",
            label: "View status",
            description: "The bookings area is the operational endpoint for tracking."
          }
        ]
      },
      ownerListing: {
        label: "Owner Listing",
        description:
          "Shows how an owner moves from awareness and value pages into registration, listing creation, and live inventory management.",
        stages: [
          {
            id: "entry",
            label: "Entry",
            nodeIds: ["route:/", "route:/list-equipment", "route:/owner-benefits", "route:/owner-experience", "route:/partner"]
          },
          {
            id: "setup",
            label: "Setup",
            nodeIds: ["route:/login", "route:/register", "route:/owner-registration", "route:/profile-selection"]
          },
          {
            id: "workspace",
            label: "Workspace",
            nodeIds: [
              "route:/owner-profile",
              "route:/owner-profile/add-listing",
              "route:/owner-profile/equipment",
              "route:/owner-profile/bookings",
              "route:/owner-profile/revenue"
            ]
          },
          {
            id: "goal",
            label: "Goal",
            nodes: [
              {
                id: "journey:owner:draft-saved",
                type: "flow-node",
                group: "goal",
                label: "Listing Draft Saved",
                status: "inferred",
                description: "Represents saving listing data before publication."
              },
              {
                id: "journey:owner:listing-submitted",
                type: "flow-node",
                group: "goal",
                label: "Listing Submitted",
                status: "inferred",
                description: "Represents the owner finishing the listing submission flow."
              },
              {
                id: "journey:owner:listing-live",
                type: "flow-node",
                group: "goal",
                label: "Listing Goes Live",
                status: "inferred",
                description: "Represents the listing becoming active and available to renters."
              }
            ]
          }
        ],
        extraEdges: [
          {
            source: "route:/",
            target: "route:/list-equipment",
            type: "journey",
            label: "List and earn",
            description: "Owner acquisition path from the home page."
          },
          {
            source: "route:/",
            target: "route:/owner-registration",
            type: "journey",
            label: "Register as owner",
            description: "Home-page owner CTA path."
          },
          {
            source: "route:/list-equipment",
            target: "route:/owner-registration",
            type: "journey",
            label: "Continue to owner setup",
            description: "List-equipment CTAs imply continuation into the registration flow."
          },
          {
            source: "route:/owner-benefits",
            target: "route:/list-equipment",
            type: "journey",
            label: "Start listing",
            description: "Benefits content funnels owners toward the listing journey."
          },
          {
            source: "route:/owner-experience",
            target: "route:/list-equipment",
            type: "journey",
            label: "Start listing",
            description: "Owner-experience CTAs imply continuation into the listing funnel."
          },
          {
            source: "route:/partner",
            target: "route:/list-equipment",
            type: "journey",
            label: "Partner to listing flow",
            description: "Partner CTA feeds into the owner acquisition path."
          },
          {
            source: "route:/owner-registration",
            target: "route:/owner-profile",
            type: "journey",
            label: "Continue to owner profile",
            description: "Owner registration mock flow ultimately routes into the owner workspace."
          },
          {
            source: "route:/owner-profile",
            target: "route:/owner-profile/add-listing",
            type: "journey",
            label: "Add new listing",
            description: "Owner profile is the operational starting point for adding equipment."
          },
          {
            source: "route:/owner-profile/equipment",
            target: "route:/owner-profile/add-listing",
            type: "journey",
            label: "Add another listing",
            description: "Equipment management encourages additional listings."
          },
          {
            source: "route:/owner-profile/add-listing",
            target: "journey:owner:draft-saved",
            type: "journey",
            label: "Save draft",
            description: "Listing editor supports draft-like progression."
          },
          {
            source: "journey:owner:draft-saved",
            target: "journey:owner:listing-submitted",
            type: "journey",
            label: "Submit listing",
            description: "Completing the listing form advances toward submission."
          },
          {
            source: "journey:owner:listing-submitted",
            target: "journey:owner:listing-live",
            type: "journey",
            label: "Verification and go-live",
            description: "Operational review leads into the active listing state."
          },
          {
            source: "journey:owner:listing-live",
            target: "route:/owner-profile/equipment",
            type: "journey",
            label: "Manage active inventory",
            description: "Once live, the listing belongs to the owner equipment workspace."
          }
        ]
      },
      authProfileSetup: {
        label: "Auth & Profile Setup",
        description:
          "Shows how users enter through login or registration, complete required gating, and arrive in renter, owner, or dual-role workspace entry states.",
        stages: [
          {
            id: "entry",
            label: "Entry",
            nodeIds: ["route:/", "route:/login", "route:/register"]
          },
          {
            id: "verification",
            label: "Verification",
            nodeIds: [
              "flow:oauth-return",
              "flow:register-outcomes",
              "flow:demo-mode",
              "route:/verify-contact",
              "route:/complete-profile",
              "flow:role-router"
            ]
          },
          {
            id: "routing",
            label: "Routing",
            nodeIds: ["route:/profile-selection", "route:/renter-profile", "route:/owner-profile"]
          },
          {
            id: "goal",
            label: "Goal",
            nodes: [
              {
                id: "journey:auth:renter-ready",
                type: "flow-node",
                group: "goal",
                label: "Renter Workspace Ready",
                status: "inferred",
                description: "Represents a successful auth path ending in renter access."
              },
              {
                id: "journey:auth:owner-ready",
                type: "flow-node",
                group: "goal",
                label: "Owner Workspace Ready",
                status: "inferred",
                description: "Represents a successful auth path ending in owner access."
              },
              {
                id: "journey:auth:both-ready",
                type: "flow-node",
                group: "goal",
                label: "Both Roles Ready",
                status: "inferred",
                description: "Represents a dual-role account reaching profile selection."
              }
            ]
          }
        ],
        extraEdges: [
          {
            source: "route:/",
            target: "route:/login",
            type: "journey",
            label: "Existing user entry",
            description: "Home page login path."
          },
          {
            source: "route:/",
            target: "route:/register",
            type: "journey",
            label: "New user entry",
            description: "Home page registration path."
          },
          {
            source: "route:/verify-contact",
            target: "route:/profile-selection",
            type: "journey",
            label: "Verified profile",
            description: "Verification completion feeds into profile selection."
          },
          {
            source: "route:/complete-profile",
            target: "route:/profile-selection",
            type: "journey",
            label: "Profile completed",
            description: "Profile completion ends at profile selection."
          },
          {
            source: "route:/renter-profile",
            target: "journey:auth:renter-ready",
            type: "journey",
            label: "Renter access ready",
            description: "The renter profile represents successful renter entry."
          },
          {
            source: "route:/owner-profile",
            target: "journey:auth:owner-ready",
            type: "journey",
            label: "Owner access ready",
            description: "The owner profile represents successful owner entry."
          },
          {
            source: "route:/profile-selection",
            target: "journey:auth:both-ready",
            type: "journey",
            label: "Choose workspace",
            description: "Profile selection represents successful dual-role readiness."
          }
        ]
      }
    },
    nodeNotes: {
      "missing:/renter-journey":
        "This route is linked from the footer but no matching page exists in the app directory.",
      "route:/register":
        "Phone verification is handled through Firebase OTP in the standard flow, but demo mode and team-review shortcuts branch around it.",
      "route:/verify-contact":
        "This page represents a legacy Appwrite phone verification flow and still contains conditional/demo-only behavior.",
      "component:Header":
        "Header navigation is conditional: guests see login/register, authenticated users see profile shortcuts and account actions.",
      "component:Footer":
        "Footer includes a mix of real routes, a missing renter-journey route, and external social destinations."
    }
  };
});
