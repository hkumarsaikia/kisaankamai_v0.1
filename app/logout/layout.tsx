import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.logout;

export default function LogoutLayout({ children }: { children: ReactNode }) {
  return children;
}
