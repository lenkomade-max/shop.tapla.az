import React from 'react'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { GenerateCardsClient } from './generate-client'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function GenerateCardsPage({ params }: Props) {
  const { id } = await params

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id, name, title, slug, images')
    .eq('id', id)
    .single()

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500">Товар не найден</p>
        <Link href="/admin/products" className="text-sm text-black underline mt-2 inline-block">
          ← К списку товаров
        </Link>
      </div>
    )
  }

  const mainImage = Array.isArray(product.images) && product.images.length > 0
    ? String(product.images[0])
    : null

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="text-xs text-zinc-400 hover:text-black mb-1 inline-block"
          >
            ← Товары
          </Link>
          <h2 className="text-xl font-bold">Генерация карточек</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {product.name || product.title}
          </p>
        </div>
      </div>

      <GenerateCardsClient
        productId={product.id}
        productName={product.name || product.title || ''}
        mainImage={mainImage}
      />
    </div>
  )
}
