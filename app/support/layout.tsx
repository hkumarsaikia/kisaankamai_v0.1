import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.support;

export default function SupportLayout({ children }: { children: ReactNode }) {
  return children;
}
