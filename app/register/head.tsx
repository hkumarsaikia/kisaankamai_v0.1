import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Create Account",
    description: "Create your Kisan Kamai account and complete your renter or owner profile.",
    path: "/register",
  });
}
