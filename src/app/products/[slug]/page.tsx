import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dbService } from '@/services/db';
import { ProductClient } from './ProductClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await dbService.getProducts();
  const relatedProducts = allProducts.filter(p => p.id !== slug).slice(0, 4);

  return (
    <ProductClient product={product} relatedProducts={relatedProducts} />
  );
}
