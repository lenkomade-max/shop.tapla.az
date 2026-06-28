import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import OrdersClient from './orders-client';

export default async function OrdersPage() {
  // Fetch orders
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Admin orders fetch error:', error);

  // Fetch products (names + first image)
  const productIds = [...new Set((orders ?? []).map(o => o.product_id).filter(Boolean))] as string[];
  const { data: products } = productIds.length > 0
    ? await supabaseAdmin.from('products').select('id, name, title, images').in('id', productIds)
    : { data: [] };

  const productMap = new Map<string, string>();
  const productImages = new Map<string, string>();
  for (const p of (products ?? [])) {
    productMap.set(p.id, p.name || p.title);
    const imgs = (p.images as string[]) || [];
    if (imgs.length > 0) productImages.set(p.id, imgs[0]);
  }

  // Fetch activity logs for all orders
  const orderIds = (orders ?? []).map(o => o.id);
  const { data: logs } = orderIds.length > 0
    ? await supabaseAdmin
        .from('order_activity_log')
        .select('*')
        .in('order_id', orderIds)
        .order('created_at', { ascending: false })
        .limit(50)
    : { data: [] };

  const activityLogs = new Map<string, typeof logs>();
  for (const log of (logs ?? [])) {
    const existing = activityLogs.get(log.order_id) || [];
    existing.push(log);
    activityLogs.set(log.order_id, existing);
  }

  return (
    <OrdersClient
      orders={(orders ?? []) as any}
      productMap={productMap}
      productImages={productImages}
      activityLogs={activityLogs as any}
    />
  );
}
