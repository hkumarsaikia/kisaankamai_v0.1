import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Verify Reset Contact",
    description: "Verify the secure password reset step for your Kisan Kamai account.",
    path: "/forgot-password/verify-otp",
  });
}
