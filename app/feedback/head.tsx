import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Send Kisan Kamai Feedback",
    description: "Share practical feedback about Kisan Kamai so the owner and renter experience can keep improving.",
    path: "/feedback",
    noIndex: true,
  });
}
