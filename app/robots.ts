import type { MetadataRoute } from "next";
import { SITE_DOMAIN } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/list-equipment",
          "/logout",
          "/owner-experience",
          "/owner-profile/",
          "/profile-selection",
          "/register/google-email",
          "/renter-profile/",
          "/verify-contact",
        ],
      },
    ],
    sitemap: `${SITE_DOMAIN}/sitemap.xml`,
    host: SITE_DOMAIN,
  };
}
