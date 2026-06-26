import React from 'react';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ProductForm } from '../../product-form';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;
  const { data: product } = await supabaseAdmin.from('products').select('*').eq('id', id).single();
  if (!product) notFound();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold">Редактировать: {product.name || product.title}</h2>
      <ProductForm product={product} error={error} />
    </div>
  );
}
