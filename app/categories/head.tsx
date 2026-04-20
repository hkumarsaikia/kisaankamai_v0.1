import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Equipment Categories",
    description: "Browse Kisan Kamai equipment categories across tractors, harvesters, implements, and more.",
    path: "/categories",
  });
}
