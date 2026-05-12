import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.register;

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
