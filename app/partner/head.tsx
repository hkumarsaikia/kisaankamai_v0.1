import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Partner With Kisan Kamai",
    description: "Explore partnership opportunities that support farm equipment access, rural operations, and local agricultural services.",
    path: "/partner",
  });
}
