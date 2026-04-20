import type { MetadataRoute } from "next";
import { SITE_DOMAIN } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_DOMAIN}/sitemap.xml`,
    host: SITE_DOMAIN,
  };
}
