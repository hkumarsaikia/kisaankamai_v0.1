import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.profileSelection;

export default function ProfileSelectionLayout({ children }: { children: ReactNode }) {
  return children;
}
