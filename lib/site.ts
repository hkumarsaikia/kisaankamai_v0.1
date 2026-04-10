const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const EXTERNAL_PREFIX = /^(?:[a-z]+:)?\/\//i;

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
  return withBasePath(path);
}
