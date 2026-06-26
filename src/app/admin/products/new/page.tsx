import React from 'react';
import { ProductForm } from '../product-form';

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewProductPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold">Новый товар</h2>
      <ProductForm error={error} />
    </div>
  );
}
