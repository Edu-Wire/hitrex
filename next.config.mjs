import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set root to silence Turbopack workspace-root warning
  turbopack: {
    root: path.join(process.cwd()),
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

export default nextConfig;
