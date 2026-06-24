import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { product_slug, customer_name, phone, city, address, quantity, total, notes } = body

    if (!customer_name || !phone || !product_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let productId: string

    const { data: existing } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', product_slug)
      .maybeSingle()

    if (existing) {
      productId = existing.id
    } else {
      const { data: newProduct } = await supabaseAdmin
        .from('products')
        .insert({
          slug: product_slug,
          title: body.product_title || product_slug,
          price: total / (quantity || 1),
          status: 'active',
        })
        .select('id')
        .single()

      if (!newProduct) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
      }
      productId = newProduct.id
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        product_id: productId,
        customer_name,
        phone,
        city: city || null,
        address: address || null,
        quantity: quantity || 1,
        total: total || 0,
        notes: notes || null,
        status: 'new',
      })
      .select('id')
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    await supabaseAdmin.from('leads').insert({
      product_id: productId,
      name: customer_name,
      phone,
      source: 'essential-lash-serum',
    })

    return NextResponse.json({
      success: true,
      orderId: `TS-${String(order.id).slice(0, 6).toUpperCase()}`,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
