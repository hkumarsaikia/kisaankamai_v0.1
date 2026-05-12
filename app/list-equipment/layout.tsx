import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.listEquipment;

export default function ListEquipmentLayout({ children }: { children: ReactNode }) {
  return children;
}
