import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import EquipmentDetailClient from "./EquipmentDetailClient";
import { getEquipmentById, getEquipmentList } from "@/lib/server/equipment";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getSiteUrl } from "@/lib/runtime";
import { assetPath } from "@/lib/site";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return {
      title: "Equipment Not Found | Kisan Kamai",
      description: "The requested equipment listing is not available.",
    };
  }

  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/equipment/${equipment.id}`;
  const locationLabel = [equipment.location, equipment.district].filter(Boolean).join(", ");
  const listingTitle = locationLabel
    ? `${equipment.name} for Rent in ${locationLabel} | Kisan Kamai`
    : `${equipment.name} for Rent | Kisan Kamai`;
  const metaDescription =
    equipment.description?.trim() ||
    `${equipment.name} farm equipment listing on Kisan Kamai. Review the listed rate, equipment details, owner information, and booking request options.`;
  const coverImageUrl = equipment.coverImage.startsWith("http")
    ? equipment.coverImage
    : `${siteUrl}${assetPath(equipment.coverImage)}`;

  return {
    title: listingTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: listingTitle,
      description: metaDescription,
      url: canonicalUrl,
      images: [
        {
          url: coverImageUrl,
          alt: `${equipment.name} equipment photo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: listingTitle,
      description: metaDescription,
      images: [coverImageUrl],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    notFound();
  }

  const session = await getCurrentSession();
  if (session) {
    redirect(`/${session.activeWorkspace}-profile/equipment/${equipment.id}`);
  }

  const relatedEquipment = (await getEquipmentList())
    .filter((item) => item.id !== equipment.id && item.category === equipment.category)
    .slice(0, 3);

  return <EquipmentDetailClient equipment={equipment} relatedEquipment={relatedEquipment} />;
}
