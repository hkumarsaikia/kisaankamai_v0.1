import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Feedback",
    description: "Send feedback about Kisan Kamai so the owner and renter experience keeps improving.",
    path: "/feedback",
  });
}
