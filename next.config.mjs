import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable lightningcss to avoid native binary requirement on Render
    optimizeCss: false,
  },
  images: {
    unoptimized: true, // ✅ Fix logo issue on Render (serves directly from /public)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // ✅ replaces "domains" setting
      },
    ],
  },
};

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.js');

export default withNextIntl(nextConfig);
