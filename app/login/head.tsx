import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Login",
    description: "Sign in to your Kisan Kamai owner or renter account.",
    path: "/login",
  });
}
