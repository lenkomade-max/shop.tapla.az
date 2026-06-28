import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Sharp — нативный модуль, не бандлить (Vercel serverless)
  serverExternalPackages: ['sharp'],
  // Исключаем musl-бинарники из трейсинга (экономия ~45MB на Vercel)
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@img/sharp-libvips*musl*',
      'node_modules/@img/sharp-linuxmusl*',
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
