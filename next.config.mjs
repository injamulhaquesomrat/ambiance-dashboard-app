/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'ambiancedesigns.biz',
      },
      {
        protocol: 'https',
        hostname: 'api.ambiancedesigns.biz',
      },
      {
        protocol: 'https',
        hostname: 'edit.ambiancedesigns.biz',
      },
      {
        protocol: 'https',
        hostname: 'beta.ambiancedesigns.biz',
      },
    ],
  },
};

export default nextConfig;
