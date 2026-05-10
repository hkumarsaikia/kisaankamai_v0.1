const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const EXTERNAL_PREFIX = /^(?:[a-z]+:)?\/\//i;
const GENERATED_IMAGE_WEBP_PATTERN = /^\/assets\/generated\/([^?#]+)\.png(?=$|[?#])/;

export function withBasePath(path: string): string {
  if (
    !path ||
    EXTERNAL_PREFIX.test(path) ||
    path.startsWith("data:") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:") ||
    path.startsWith("#")
  ) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

export function assetPath(path: string): string {
  const optimizedGeneratedAsset = path.replace(GENERATED_IMAGE_WEBP_PATTERN, "/assets/generated/$1.webp");
  return withBasePath(optimizedGeneratedAsset);
}
