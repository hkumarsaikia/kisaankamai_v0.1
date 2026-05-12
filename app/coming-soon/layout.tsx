import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.comingSoon;

export default function ComingSoonLayout({ children }: { children: ReactNode }) {
  return children;
}
