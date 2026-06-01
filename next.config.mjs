/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.contentstack.io' },
      { protocol: 'https', hostname: 'assets.contentstack.io' },
      { protocol: 'https', hostname: 'images.contentstack.com' },
      { protocol: 'https', hostname: 'assets.contentstack.com' },
    ],
  },
};

export default nextConfig;
