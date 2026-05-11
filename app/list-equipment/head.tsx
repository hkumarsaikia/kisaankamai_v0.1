import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "List Farm Equipment",
    description: "Create and manage owner listings for tractors, harvesters, implements, and other farm machinery on Kisan Kamai.",
    path: "/list-equipment",
    noIndex: true,
  });
}
