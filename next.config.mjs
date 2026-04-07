/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            }
        ]
    },
    basePath: '/kisaankamai_v0.1',
    assetPrefix: '/kisaankamai_v0.1',
};

export default nextConfig;

