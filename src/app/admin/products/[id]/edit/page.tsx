import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ProductForm } from '../../product-form';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
  if (!product) notFound();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold">Редактировать: {product.name || product.title}</h2>
      <ProductForm product={product} />
    </div>
  );
}
