/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    ...(isProd ? { output: 'export' } : {}),
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            }
        ]
    },
    env: {
        NEXT_PUBLIC_BASE_PATH: isProd ? '/kisaankamai_v0.1' : '',
    },
    basePath: isProd ? '/kisaankamai_v0.1' : '',
    assetPrefix: isProd ? '/kisaankamai_v0.1/' : '',
};

export default nextConfig;

