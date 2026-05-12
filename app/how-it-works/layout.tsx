import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.howItWorks;

export default function HowItWorksLayout({ children }: { children: ReactNode }) {
  return children;
}
