import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Create a Kisan Kamai Account",
    description: "Create a Kisan Kamai account with your mobile number and complete the profile needed to rent or list equipment.",
    path: "/register",
    noIndex: true,
  });
}
