import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Account Login",
    description: "Sign in to your Kisan Kamai owner or renter account with your registered mobile number.",
    path: "/login",
    noIndex: true,
  });
}
