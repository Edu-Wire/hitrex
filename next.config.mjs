/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
