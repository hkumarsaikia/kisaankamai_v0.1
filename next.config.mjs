import { withSentryConfig } from "@sentry/nextjs";

const isDev = process.env.NODE_ENV !== "production";
const sentryBuildConfigured = Boolean(
  process.env.SENTRY_AUTH_TOKEN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT
);
const googleAccountsOrigin = "https://accounts.google.com";
const googleApisOrigin = "https://apis.google.com";
const firebaseAuthOrigin = "https://gokisaan.firebaseapp.com";

function joinSources(values) {
  return values.filter(Boolean).join(" ");
}

function buildCsp() {
  return [
    "default-src 'self'",
    `script-src ${joinSources([
      "'self'",
      "'unsafe-inline'",
      isDev ? "'unsafe-eval'" : null,
      "https://www.gstatic.com",
      "https://www.google.com",
      googleAccountsOrigin,
      googleApisOrigin,
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
      "https://placehold.co",
      "https://firebasestorage.googleapis.com",
      "https://storage.googleapis.com",
    ])}`,
    `font-src ${joinSources([
      "'self'",
      "data:",
      "https://fonts.gstatic.com",
    ])}`,
    `connect-src ${joinSources([
      "'self'",
      "https://identitytoolkit.googleapis.com",
      "https://securetoken.googleapis.com",
      "https://firebase.googleapis.com",
      "https://www.googleapis.com",
      "https://firebasestorage.googleapis.com",
      "https://storage.googleapis.com",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
      "https://www.google.com",
      "https://www.gstatic.com",
      googleAccountsOrigin,
      googleApisOrigin,
      firebaseAuthOrigin,
      "https://*.sentry.io",
      "https://*.ingest.sentry.io",
    ])}`,
    `frame-src ${joinSources([
      "'self'",
      "https://www.google.com",
      "https://www.gstatic.com",
      googleAccountsOrigin,
      googleApisOrigin,
      firebaseAuthOrigin,
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
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]),
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const htmlFreshnessHeaders = [
  {
    key: "Cache-Control",
    value: "private, no-cache, no-store, max-age=0, must-revalidate",
  },
  { key: "CDN-Cache-Control", value: "no-store" },
];

const sharePreviewHeaders = [
  { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],
  experimental: {
    viewTransition: true,
  },
  images: {
    qualities: [72, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source:
          "/:path((?!_next/static|_next/image|assets|brand|fonts|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml).*)",
        headers: [...securityHeaders, ...htmlFreshnessHeaders],
      },
      {
        source: "/assets/share/:path*",
        headers: [...securityHeaders, ...sharePreviewHeaders],
      },
      {
        source: "/brand/:path*",
        headers: [...securityHeaders, ...sharePreviewHeaders],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/@opentelemetry/ },
      { module: /node_modules\/require-in-the-middle/ },
    ];
    return config;
  },
};

const sentryOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  telemetry: false,
  sourcemaps: {
    disable: !sentryBuildConfigured,
  },
};

export default withSentryConfig(nextConfig, sentryOptions);
