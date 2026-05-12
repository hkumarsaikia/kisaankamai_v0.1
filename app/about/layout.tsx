import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.about;

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
