import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.login;

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
