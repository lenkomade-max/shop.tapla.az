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

  // SEO: азербайджанские публичные URL → внутренний rewrite на английские файлы
  async rewrites() {
    return [
      { source: '/haqqimizda', destination: '/about' },
      { source: '/mehsullar', destination: '/products' },
      { source: '/mehsullar/:slug', destination: '/products/:slug' },
      { source: '/sifaris', destination: '/checkout' },
      { source: '/koleksiyalar', destination: '/collections' },
      { source: '/kateqoriya/:slug', destination: '/category/:slug' },
      { source: '/profil', destination: '/profile' },
    ];
  },

  // SEO: английские URL → 301 редирект на азербайджанские каноникалы
  async redirects() {
    return [
      // Основные страницы
      { source: '/about', destination: '/haqqimizda', permanent: true },
      { source: '/products', destination: '/mehsullar', permanent: true },
      { source: '/products/:slug', destination: '/mehsullar/:slug', permanent: true },
      { source: '/checkout', destination: '/sifaris', permanent: true },
      { source: '/collections', destination: '/koleksiyalar', permanent: true },
      { source: '/category/:slug', destination: '/kateqoriya/:slug', permanent: true },
      { source: '/profile', destination: '/profil', permanent: true },
      // Legal pages: английские алиасы → азербайджанские
      { source: '/return-policy', destination: '/qaytarma-siyaseti', permanent: true },
      { source: '/privacy-policy', destination: '/mexfilik-siyaseti', permanent: true },
      { source: '/privacy', destination: '/mexfilik-siyaseti', permanent: true },
      { source: '/terms', destination: '/istifade-sertleri', permanent: true },
      { source: '/terms-of-use', destination: '/istifade-sertleri', permanent: true },
      { source: '/cookie-policy', destination: '/kuki-siyaseti', permanent: true },
      { source: '/cookies', destination: '/kuki-siyaseti', permanent: true },
      { source: '/seller-agreement', destination: '/satici-muqavilesi', permanent: true },
      { source: '/legal-info', destination: '/huquqi-melumat', permanent: true },
      { source: '/legal-information', destination: '/huquqi-melumat', permanent: true },
      { source: '/legal', destination: '/huquqi-melumat', permanent: true },
    ];
  },
};

export default nextConfig;
