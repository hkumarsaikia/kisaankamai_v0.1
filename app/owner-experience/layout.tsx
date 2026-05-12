import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.ownerExperience;

export default function OwnerExperienceLayout({ children }: { children: ReactNode }) {
  return children;
}
