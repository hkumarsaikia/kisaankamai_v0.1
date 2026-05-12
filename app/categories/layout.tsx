import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.categories;

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  return children;
}
