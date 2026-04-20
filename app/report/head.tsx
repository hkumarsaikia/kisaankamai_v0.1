import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Report a Problem",
    description: "Report booking, equipment, safety, or payment issues directly to the Kisan Kamai team.",
    path: "/report",
  });
}
