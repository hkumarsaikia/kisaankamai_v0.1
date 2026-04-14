import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EquipmentDetailClient from "./EquipmentDetailClient";
import { getEquipmentById, getEquipmentList, getEquipmentStaticParams } from "@/lib/server/equipment";
import { getSiteUrl, IS_PAGES_BUILD } from "@/lib/runtime";

export const dynamicParams = true;

export async function generateStaticParams() {
  return IS_PAGES_BUILD ? await getEquipmentStaticParams() : [];
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const equipment = await getEquipmentById(params.id);

  if (!equipment) {
    return {
      title: "Equipment Not Found | Kisan Kamai",
      description: "The requested equipment listing is not available.",
    };
  }

  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/equipment/${equipment.id}`;

  return {
    title: `${equipment.name} | Kisan Kamai`,
    description: equipment.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${equipment.name} | Kisan Kamai`,
      description: equipment.description,
      url: canonicalUrl,
      images: [
        {
          url: equipment.coverImage.startsWith("http")
            ? equipment.coverImage
            : `${siteUrl}${equipment.coverImage}`,
          alt: equipment.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${equipment.name} | Kisan Kamai`,
      description: equipment.description,
      images: [
        equipment.coverImage.startsWith("http")
          ? equipment.coverImage
          : `${siteUrl}${equipment.coverImage}`,
      ],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const equipment = await getEquipmentById(params.id);

  if (!equipment) {
    notFound();
  }

  const relatedEquipment = (await getEquipmentList())
    .filter((item) => item.id !== equipment.id && item.category === equipment.category)
    .slice(0, 3);

  return <EquipmentDetailClient equipment={equipment} relatedEquipment={relatedEquipment} />;
}

