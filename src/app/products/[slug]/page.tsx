import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dbService } from '@/services/db';
import { ProductClient } from './ProductClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getProductSchema } from '@/lib/seo/schemas/product-schema';
import { getBreadcrumbSchema } from '@/lib/seo/schemas/breadcrumb-schema';
import { getFAQSchema } from '@/lib/seo/schemas/faq-schema';
import { generateSEOMeta } from '@/lib/seo/meta-generator';

export const revalidate = 3600;

const SITE_URL = 'https://shop.tapla.az';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await dbService.getProducts();
    return products.slice(0, 200).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);
  if (!product) return {};

  const title = product.name;
  const description = product.description?.substring(0, 160) || title;
  const ogImage = product.images?.[0];

  return generateSEOMeta({
    title,
    description,
    canonical: `${SITE_URL}/mehsullar/${slug}`,
    ogImage,
    keywords: product.searchKeywords,
    type: 'product',
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await dbService.getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== slug).slice(0, 4);

  // JSON-LD schemas
  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Ana Səhifə', url: SITE_URL },
    { name: 'Məhsullar', url: `${SITE_URL}/mehsullar` },
    ...(product.category
      ? [{ name: product.category, url: `${SITE_URL}/kateqoriya/${product.category}` }]
      : []),
    { name: product.name, url: `${SITE_URL}/mehsullar/${slug}` },
  ]);
  const faqSchema = product.faq ? getFAQSchema(product.faq) : null;

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <ProductClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
