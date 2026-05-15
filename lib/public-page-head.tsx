import { publicPageMetadataInputs } from "@/lib/public-page-metadata";
import { renderHeadMetadata } from "@/lib/site-metadata";

type PublicPageMetadataKey = keyof typeof publicPageMetadataInputs;

export function renderPublicPageHead(key: PublicPageMetadataKey) {
  return renderHeadMetadata(publicPageMetadataInputs[key]);
}
