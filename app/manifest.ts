import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kisan Kamai",
    short_name: "Kisan Kamai",
    description:
      "Rent trusted agricultural equipment, manage listings, and grow rural earnings across Maharashtra.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe7",
    theme_color: "#143b2e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/kisan-kamai-tractor-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/kisan-kamai-tractor-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
