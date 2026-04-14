import path from "node:path";

const buildTarget = process.env.BUILD_TARGET === "pages" ? "pages" : "server";
const isPagesBuild = buildTarget === "pages";
const isDev = process.env.NODE_ENV !== "production";
const pagesBasePath = "/kisaankamai_v0.1";

function asOrigin(value) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function joinSources(values) {
  return values.filter(Boolean).join(" ");
}

function buildCsp() {
  const appwriteOrigin = asOrigin(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1");

  return [
    "default-src 'self'",
    `script-src ${joinSources([
      "'self'",
      "'unsafe-inline'",
      isDev ? "'unsafe-eval'" : null,
      "https://www.gstatic.com",
      "https://www.google.com",
      "https://maps.googleapis.com",
    ])}`,
    `style-src ${joinSources([
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
    ])}`,
    `img-src ${joinSources([
      "'self'",
      "data:",
      "blob:",
      "https://lh3.googleusercontent.com",
      "https://*.googleusercontent.com",
      "https://*.tile.openstreetmap.org",
      "https://*.basemaps.cartocdn.com",
      "https://www.gstatic.com",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
      "https://www.google.com",
    ])}`,
    `font-src ${joinSources([
      "'self'",
      "data:",
      "https://fonts.gstatic.com",
    ])}`,
    `connect-src ${joinSources([
      "'self'",
      appwriteOrigin,
      "https://identitytoolkit.googleapis.com",
      "https://securetoken.googleapis.com",
      "https://firebase.googleapis.com",
      "https://www.googleapis.com",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
      "https://www.google.com",
      "https://www.gstatic.com",
    ])}`,
    `frame-src ${joinSources([
      "'self'",
      "https://www.google.com",
      "https://www.gstatic.com",
    ])}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    isDev ? null : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildCsp() },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],
  ...(isPagesBuild ? { output: "export" } : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BUILD_TARGET: buildTarget,
    NEXT_PUBLIC_BASE_PATH: isPagesBuild ? pagesBasePath : "",
  },
  basePath: isPagesBuild ? pagesBasePath : "",
  assetPrefix: isPagesBuild ? `${pagesBasePath}/` : "",
  webpack(config) {
    if (isPagesBuild) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@/lib/actions/local-data": path.resolve("./lib/actions/local-data.pages.ts"),
      };
    }

    return config;
  },
  ...(!isPagesBuild
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: securityHeaders,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;


