import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.featureRequest;

export default function FeatureRequestLayout({ children }: { children: ReactNode }) {
  return children;
}
