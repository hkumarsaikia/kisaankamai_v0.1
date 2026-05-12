import type { Metadata } from "next";

export const SITE_NAME = "Kisan Kamai";
export const SITE_DOMAIN = "https://www.kisankamai.com";
export const DEFAULT_SHARE_IMAGE_PATH = "/assets/share/kisan-kamai-og.jpg";
export const DEFAULT_SHARE_DESCRIPTION =
  "Rent and list farm equipment across Northern Maharashtra with Kisan Kamai. Browse machinery, manage bookings, and coordinate directly with local owners and renters.";

export function getMetadataBaseUrl() {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || SITE_DOMAIN);
}

export function getCanonicalUrl(path = "/") {
  return new URL(path, SITE_DOMAIN).toString();
}

export function getDefaultShareImageUrl() {
  return new URL(DEFAULT_SHARE_IMAGE_PATH, getMetadataBaseUrl()).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

function normalizeTitle(title: string) {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const shareImage = getDefaultShareImageUrl();
  const fullTitle = normalizeTitle(title);

  return {
    title: fullTitle,
    description,
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : undefined,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: shareImage,
          secureUrl: shareImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [
        {
          url: shareImage,
          alt: fullTitle,
        },
      ],
    },
  };
}

export function renderHeadMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput) {
  const canonical = getCanonicalUrl(path);
  const shareImage = getDefaultShareImageUrl();
  const fullTitle = normalizeTitle(title);

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex ? <meta name="robots" content="noindex,follow" /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:image:secure_url" content={shareImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={shareImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
    </>
  );
}
