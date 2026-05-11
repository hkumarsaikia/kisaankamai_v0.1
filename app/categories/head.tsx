import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Farm Equipment Categories",
    description: "Browse tractor, harvester, implement, sprayer, pump, baler, trolley, and seeder categories available through Kisan Kamai.",
    path: "/categories",
  });
}
