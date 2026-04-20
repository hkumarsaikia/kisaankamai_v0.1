import type { Metadata } from "next";
import { assetPath } from "@/lib/site";

export const SITE_NAME = "Kisan Kamai";
export const SITE_DOMAIN = "https://www.kisankamai.com";
export const DEFAULT_SHARE_DESCRIPTION =
  "Rent trusted agricultural equipment, manage owner listings, and grow rural earnings with Kisan Kamai.";

export function getMetadataBaseUrl() {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || SITE_DOMAIN);
}

export function getCanonicalUrl(path = "/") {
  return new URL(path, SITE_DOMAIN).toString();
}

export function getDefaultShareImageUrl() {
  return new URL(assetPath("/assets/generated/hero_tractor.png"), getMetadataBaseUrl()).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const shareImage = getDefaultShareImageUrl();

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export function renderHeadMetadata({
  title,
  description,
  path,
}: PageMetadataInput) {
  const canonical = getCanonicalUrl(path);
  const shareImage = getDefaultShareImageUrl();

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={shareImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={shareImage} />
    </>
  );
}
