import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import EquipmentDetailClient from "./EquipmentDetailClient";
import { getEquipmentById, getEquipmentList } from "@/lib/server/equipment";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getSiteUrl } from "@/lib/runtime";
import { assetPath } from "@/lib/site";
import { getShareImageUrl, SITE_NAME } from "@/lib/site-metadata";

export const dynamicParams = true;

function buildEquipmentMetaDescription({
  name,
  description,
  locationLabel,
}: {
  name: string;
  description?: string;
  locationLabel: string;
}) {
  const cleanDescription = description?.trim();
  const baseDescription =
    cleanDescription && cleanDescription.length >= 120
      ? cleanDescription
      : `${name} farm equipment rental${locationLabel ? ` in ${locationLabel}` : ""}. Review photos, rate, owner details, availability, and booking options.`;

  if (baseDescription.length <= 130) {
    return baseDescription;
  }

  return `${baseDescription.slice(0, 127).trim()}...`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return {
      title: "Equipment Not Found",
      description: "The requested equipment listing is not available.",
    };
  }

  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/equipment/${equipment.id}`;
  const locationLabel = [equipment.location, equipment.district].filter(Boolean).join(", ");
  const listingTitle = locationLabel
    ? `${equipment.name} for Rent in ${locationLabel}`
    : `${equipment.name} for Rent`;
  const fullListingTitle = `${listingTitle} | ${SITE_NAME}`;
  const metaDescription = buildEquipmentMetaDescription({
    name: equipment.name,
    description: equipment.description,
    locationLabel,
  });
  const baseCoverImageUrl = equipment.coverImage.startsWith("http")
    ? equipment.coverImage
    : `${siteUrl}${assetPath(equipment.coverImage)}`;
  const coverImageUrl = getShareImageUrl(baseCoverImageUrl);

  return {
    title: listingTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullListingTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: coverImageUrl,
          secureUrl: coverImageUrl,
          alt: `${equipment.name} equipment photo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullListingTitle,
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
