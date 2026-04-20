import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "List Equipment",
    description: "Create and manage owner listings for tractors, harvesters, and implements on Kisan Kamai.",
    path: "/list-equipment",
  });
}
