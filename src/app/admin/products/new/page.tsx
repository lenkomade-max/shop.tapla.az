import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { ProductForm } from '../product-form';

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewProductPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Новый товар</h2>
        <Link
          href="/admin/tovar-ai?mode=product"
          className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          AI ilə yarat
        </Link>
      </div>
      <ProductForm error={error} />
    </div>
  );
}
