import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Verify Password Reset",
    description: "Verify the password reset step for the registered mobile number on your Kisan Kamai account.",
    path: "/forgot-password/verify-otp",
    noIndex: true,
  });
}
