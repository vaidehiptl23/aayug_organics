import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "**.onrender.com", pathname: "/**" },
      { protocol: "https", hostname: "**.vercel.app", pathname: "/**" },
    ],
  },
};
export default nextConfig;
