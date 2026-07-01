'use client';

import React, { useState, useMemo } from 'react';
import { OrderStatusSelect, PaymentStatusSelect, DepositStatusSelect } from './status-select';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Hash,
  History,
  User,
  Filter,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';

// --- types ---

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  address: string | null;
  payment_method: string | null;
  deposit_method: string | null;
  deposit_status: string | null;
  product_id: string | null;
  items: Array<{ name: string; price: number; quantity: number; shade?: string }>;
  quantity: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  delivery_method: string | null;
  delivery_cost: number | null;
  metro_station: string | null;
  postal_code: string | null;
}

interface ActivityLogEntry {
  id: string;
  order_id: string;
  field: string;
  old_value: string | null;
  new_value: string;
  changed_by: string;
  created_at: string;
}

// --- constants ---

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash_delivery: 'Наличные',
  card_delivery: 'Карта курьеру',
  online_card: 'Pasha Bank',
};

const DELIVERY_METHOD_LABELS: Record<string, string> = {
  courier_center: 'Курьер (центр)',
  courier_outskirts: 'Курьер (окраина)',
  metro: 'Метро',
  post: 'Почта (Azərpoçt)',
};

const DEPOSIT_METHOD_LABELS: Record<string, string> = {
  pasha_bank: 'Pasha Bank (5 AZN)',
  whatsapp: 'WhatsApp (менеджер)',
};

const DEPOSIT_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  paid: 'Оплачен',
  refunded: 'Возврат',
};

const PAYMENT_STATUS_ICON: Record<string, { icon: React.ReactNode; cls: string }> = {
  pending: { icon: <Clock className="h-3.5 w-3.5" />, cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  paid: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  failed: { icon: <XCircle className="h-3.5 w-3.5" />, cls: 'bg-red-50 text-red-700 border-red-200' },
  refunded: { icon: <XCircle className="h-3.5 w-3.5" />, cls: 'bg-zinc-50 text-zinc-500 border-zinc-200' },
};

const ORDER_STATUS_ICON: Record<string, { icon: React.ReactNode; cls: string }> = {
  new: { icon: <ShoppingBag className="h-3.5 w-3.5" />, cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  paid: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  confirmed: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  shipped: { icon: <Truck className="h-3.5 w-3.5" />, cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  delivered: { icon: <Package className="h-3.5 w-3.5" />, cls: 'bg-green-50 text-green-700 border-green-200' },
  cancelled: { icon: <XCircle className="h-3.5 w-3.5" />, cls: 'bg-red-50 text-red-700 border-red-200' },
};

const FIELD_LABELS: Record<string, string> = {
  status: 'Статус заказа',
  payment_status: 'Статус оплаты',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  paid: 'Оплачен',
  confirmed: 'Подтверждён',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const PAYMENT_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  paid: 'Оплачено',
  failed: 'Ошибка',
  refunded: 'Возврат',
};

// --- component ---

interface ProductInfo {
  name: string;
  slug: string;
  images: string[];
}

interface Props {
  orders: Order[];
  productData: Map<string, ProductInfo>;
  activityLogs: Map<string, ActivityLogEntry[]>;
}

export default function OrdersClient({ orders, productData, activityLogs }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const [previewProduct, setPreviewProduct] = useState<ProductInfo | null>(null);
  const [previewImageIdx, setPreviewImageIdx] = useState(0);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    if (filter === 'pending_payment') return orders.filter(o => o.payment_status === 'pending');
    if (filter === 'paid') return orders.filter(o => o.payment_status === 'paid' || o.status === 'paid');
    return orders.filter(o => o.status === filter);
  }, [orders, filter]);

  // Summary stats
  const stats = useMemo(() => ({
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    paid: orders.filter(o => o.payment_status === 'paid' || o.status === 'paid').length,
    pendingPayment: orders.filter(o => o.payment_status === 'pending').length,
    inProgress: orders.filter(o => ['confirmed', 'shipped'].includes(o.status)).length,
    done: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }), [orders]);

  const FILTERS = [
    { key: 'all', label: 'Все', count: stats.total },
    { key: 'pending_payment', label: 'Ждут оплаты', count: stats.pendingPayment },
    { key: 'paid', label: 'Оплачены', count: stats.paid },
    { key: 'new', label: 'Новые', count: stats.new },
    { key: 'confirmed', label: 'В работе', count: stats.inProgress },
    { key: 'delivered', label: 'Завершены', count: stats.done },
    { key: 'cancelled', label: 'Отменены', count: stats.cancelled },
  ];

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="mb-2 text-xl font-bold tracking-tight">Заказы</h2>
        <div className="rounded-xl border bg-white p-16 text-center">
          <ShoppingBag className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Нет заказов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Заказы</h2>
        <span className="text-xs text-zinc-400 font-mono">{stats.total} всего</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-xl border p-3 text-left transition-all ${filter === 'all' ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900/10' : 'border-zinc-100 hover:border-zinc-200'}`}
        >
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Всего</div>
        </button>
        <button
          onClick={() => setFilter('pending_payment')}
          className={`rounded-xl border p-3 text-left transition-all ${filter === 'pending_payment' ? 'border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400/20' : 'border-zinc-100 hover:border-yellow-200'}`}
        >
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayment}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Ждут оплаты</div>
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`rounded-xl border p-3 text-left transition-all ${filter === 'paid' ? 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400/20' : 'border-zinc-100 hover:border-emerald-200'}`}
        >
          <div className="text-2xl font-bold text-emerald-600">{stats.paid}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Оплачены</div>
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`rounded-xl border p-3 text-left transition-all ${filter === 'new' ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-400/20' : 'border-zinc-100 hover:border-blue-200'}`}
        >
          <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Новые</div>
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`rounded-xl border p-3 text-left transition-all ${filter === 'confirmed' ? 'border-purple-400 bg-purple-50 ring-1 ring-purple-400/20' : 'border-zinc-100 hover:border-purple-200'}`}
        >
          <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium mt-0.5">В работе</div>
        </button>
        <button
          onClick={() => setFilter('delivered')}
          className={`rounded-xl border p-3 text-left transition-all ${filter === 'delivered' ? 'border-green-400 bg-green-50 ring-1 ring-green-400/20' : 'border-zinc-100 hover:border-green-200'}`}
        >
          <div className="text-2xl font-bold text-green-600">{stats.done}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Завершены</div>
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`rounded-xl border p-3 text-left transition-all ${filter === 'cancelled' ? 'border-red-400 bg-red-50 ring-1 ring-red-400/20' : 'border-zinc-100 hover:border-red-200'}`}
        >
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Отменены</div>
        </button>
      </div>

      {/* Active filter indicator */}
      {filter !== 'all' && (
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-3 w-3 text-zinc-400" />
          <span className="text-zinc-500">Фильтр:</span>
          <span className="font-medium text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-full">
            {FILTERS.find(f => f.key === filter)?.label}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-zinc-400">{filtered.length} заказов</span>
          <button onClick={() => setFilter('all')} className="text-zinc-400 hover:text-zinc-600 underline ml-1">
            Сбросить
          </button>
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-2">
        {filtered.map(o => {
          const isExpanded = expanded.has(o.id);
          const logs = activityLogs.get(o.id) || [];
          const prodInfo = o.product_id ? productData.get(o.product_id) : undefined;
          const productName = prodInfo?.name || '—';

          return (
            <div key={o.id} className="rounded-xl border bg-white shadow-sm overflow-hidden transition-all">
              {/* Main row */}
              <div
                onClick={() => toggle(o.id)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-50/50"
              >
                {/* Expand toggle */}
                <button className="flex-shrink-0 p-1 rounded hover:bg-zinc-100">
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4 text-zinc-400" />
                    : <ChevronRight className="h-4 w-4 text-zinc-400" />
                  }
                </button>

                {/* Product image */}
                <div
                  className="flex-shrink-0 h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden cursor-pointer"
                  onClick={e => { e.stopPropagation(); if (prodInfo) { setPreviewProduct(prodInfo); setPreviewImageIdx(0); } }}
                >
                  {prodInfo?.images[0] ? (
                    <img src={prodInfo.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-5 w-5 text-zinc-300 m-2.5" />
                  )}
                </div>

                {/* Customer + product info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{o.customer_name}</span>
                    <span className="text-xs text-zinc-400 font-mono whitespace-nowrap">{o.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button
                      onClick={e => { e.stopPropagation(); if (prodInfo) { setPreviewProduct(prodInfo); setPreviewImageIdx(0); } }}
                      className="text-xs text-zinc-500 truncate max-w-[180px] hover:text-blue-600 hover:underline text-left cursor-pointer"
                    >
                      {productName}
                    </button>
                    {prodInfo?.slug && (
                      <a
                        href={`/products/${prodInfo.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex-shrink-0 text-zinc-300 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <span className="text-[10px] text-zinc-300">×{o.quantity}</span>
                    <span className="text-xs font-medium text-zinc-700 ml-auto">{Number(o.total).toLocaleString()} ₼</span>
                  </div>
                </div>

                {/* Payment status badge */}
                <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <PaymentStatusSelect id={o.id} currentStatus={o.payment_status} />
                </div>

                {/* Order status badge */}
                <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <OrderStatusSelect id={o.id} currentStatus={o.status} />
                </div>

                {/* Date */}
                <span className="flex-shrink-0 text-[10px] text-zinc-400 font-mono whitespace-nowrap">
                  {new Date(o.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Expanded detail panel */}
              {isExpanded && (
                <div className="border-t bg-zinc-50/50 px-6 py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                  {/* Contact details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-500">Клиент:</span>
                      <span className="font-medium">{o.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Phone className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-500">Тел:</span>
                      <a href={`tel:${o.phone}`} className="font-medium text-blue-600 hover:underline">{o.phone}</a>
                      <a
                        href={`https://wa.me/${o.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full hover:bg-green-200"
                      >
                        WA
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-500">Email:</span>
                      <span className={o.email ? 'font-medium' : 'text-zinc-300'}>{o.email || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-500">Город:</span>
                      <span className="font-medium">{o.city || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:col-span-2">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-500">Адрес:</span>
                      <span className={o.address ? 'font-medium' : 'text-zinc-300'}>{o.address || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CreditCard className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-500">Оплата:</span>
                      <span className="font-medium">{o.payment_method ? (PAYMENT_METHOD_LABELS[o.payment_method] || o.payment_method) : '—'}</span>
                    </div>
                    {o.deposit_method && (
                      <div className="flex items-center gap-2 text-xs">
                        <CreditCard className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                        <span className="text-zinc-500">Депозит (5 AZN):</span>
                        <span className="font-medium">{DEPOSIT_METHOD_LABELS[o.deposit_method] || o.deposit_method}</span>
                      </div>
                    )}
                    {o.delivery_method && (
                      <div className="flex items-center gap-2 text-xs">
                        <Truck className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                        <span className="text-zinc-500">Доставка:</span>
                        <span className="font-medium">{DELIVERY_METHOD_LABELS[o.delivery_method] || o.delivery_method}</span>
                      </div>
                    )}
                    {o.delivery_cost != null && o.delivery_cost > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-zinc-500">Стоимость доставки:</span>
                        <span className="font-medium">{Number(o.delivery_cost).toFixed(2)} ₼</span>
                      </div>
                    )}
                    {o.metro_station && (
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                        <span className="text-zinc-500">Станция метро:</span>
                        <span className="font-medium">{o.metro_station}</span>
                      </div>
                    )}
                    {o.postal_code && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-zinc-500">Почтовый индекс:</span>
                        <span className="font-medium">{o.postal_code}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <Hash className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-500">Заказ:</span>
                      <span className="font-mono text-[10px]">TPL-{o.id.slice(0, 6).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Items list */}
                  {o.items && o.items.length > 0 && (
                    <div className="border-t border-zinc-100 pt-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <ShoppingBag className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Товары в заказе</span>
                      </div>
                      <div className="space-y-1.5">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-zinc-100">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-medium text-zinc-800 truncate">{item.name}</span>
                              {item.shade && <span className="text-[9px] text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded-full">{item.shade}</span>}
                            </div>
                            <span className="text-zinc-500 font-mono text-[10px] flex-shrink-0 ml-2">{item.quantity} × {Number(item.price).toFixed(2)} ₼</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deposit status select */}
                  {o.deposit_method && (
                    <div className="border-t border-zinc-100 pt-3 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Статус депозита (5 AZN):</span>
                      <div onClick={e => e.stopPropagation()}>
                        <DepositStatusSelect id={o.id} currentStatus={o.deposit_status} />
                      </div>
                    </div>
                  )}

                  {/* Activity log */}
                  {logs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <History className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">История изменений</span>
                      </div>
                      <div className="space-y-1">
                        {logs.map(log => (
                          <div key={log.id} className="flex items-center gap-2 text-[10px] text-zinc-500">
                            <span className="font-mono text-zinc-300 w-[60px] flex-shrink-0">
                              {new Date(log.created_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="font-medium text-zinc-600">{FIELD_LABELS[log.field] || log.field}:</span>
                            <span className="bg-zinc-100 px-1 rounded text-zinc-400 line-through">
                              {log.field === 'status' ? STATUS_LABELS[log.old_value || ''] || log.old_value : PAYMENT_LABELS[log.old_value || ''] || log.old_value}
                            </span>
                            <span className="text-zinc-300">→</span>
                            <span className="bg-zinc-900 text-white px-1.5 py-0.5 rounded font-medium">
                              {log.field === 'status' ? STATUS_LABELS[log.new_value] || log.new_value : PAYMENT_LABELS[log.new_value] || log.new_value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {logs.length === 0 && (
                    <div className="flex items-center gap-1.5">
                      <History className="h-3 w-3 text-zinc-300" />
                      <span className="text-[10px] text-zinc-300">Нет истории изменений</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && filter !== 'all' && (
        <div className="text-center py-12 text-zinc-400 text-sm">
          Нет заказов по выбранному фильтру
        </div>
      )}

      {/* Product Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreviewProduct(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
              <h3 className="text-sm font-semibold text-zinc-900 truncate pr-2">{previewProduct.name}</h3>
              <button onClick={() => setPreviewProduct(null)} className="flex-shrink-0 p-1 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer">
                <X className="h-4 w-4 text-zinc-400" />
              </button>
            </div>

            {/* Image gallery */}
            {previewProduct.images.length > 0 && (
              <div className="relative bg-zinc-50">
                <img
                  src={previewProduct.images[previewImageIdx]}
                  alt={previewProduct.name}
                  className="w-full h-72 object-contain"
                />
                {previewProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setPreviewImageIdx(prev => (prev - 1 + previewProduct.images.length) % previewProduct.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4 text-zinc-600" />
                    </button>
                    <button
                      onClick={() => setPreviewImageIdx(prev => (prev + 1) % previewProduct.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <ChevronRightIcon className="h-4 w-4 text-zinc-600" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {previewProduct.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPreviewImageIdx(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === previewImageIdx ? 'w-4 bg-zinc-800' : 'w-1.5 bg-zinc-300'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="px-5 py-4">
              <a
                href={`/products/${previewProduct.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Открыть товар на сайте
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
