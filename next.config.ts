import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'e-book-store-tau.vercel.app' }],
        destination: 'https://ebook.adriankukla.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;