const isDev = process.env.NODE_ENV !== "production";

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
  images: {
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
  experimental: {
    workerThreads: true,
    cpus: 12,
  },
};

export default nextConfig;


