'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User, Package, Phone, Mail, LogOut, ArrowLeft, Clock, CheckCircle2, Truck, XCircle, ShoppingBag, ChevronRight } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthContext'
import { Container } from '@/components/ui/Container'
import { getMyOrders } from '@/lib/actions'
import Link from 'next/link'

interface OrderItem {
  id: string
  created_at: string
  status: string
  payment_status: string
  payment_method: string | null
  total: number
  quantity: number
  city: string | null
  address: string | null
  product_id: string | null
  product_name?: string
  product_image?: string
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  new: <ShoppingBag className="h-3.5 w-3.5" />,
  paid: <CheckCircle2 className="h-3.5 w-3.5" />,
  confirmed: <CheckCircle2 className="h-3.5 w-3.5" />,
  shipped: <Truck className="h-3.5 w-3.5" />,
  delivered: <Package className="h-3.5 w-3.5" />,
  cancelled: <XCircle className="h-3.5 w-3.5" />,
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Yeni',
  paid: 'Ödənildi',
  confirmed: 'Təsdiqləndi',
  shipped: 'Göndərildi',
  delivered: 'Çatdırıldı',
  cancelled: 'Ləğv edildi',
}

const STATUS_CLASSES: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  paid: 'bg-emerald-50 text-emerald-700',
  confirmed: 'bg-amber-50 text-amber-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash_delivery: 'Qapıda nağd',
  card_delivery: 'Qapıda kart',
  online_card: 'Onlayn kart',
}

export default function ProfilePage() {
  const { user, profile, isLoading, isAuthenticated, signOut } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  const fetchOrders = useCallback(async () => {
    if (!profile) return
    setOrdersLoading(true)

    const result = await getMyOrders(profile.id, profile.phone, user?.id || null)
    setOrders(result)
    setOrdersLoading(false)
  }, [profile, user?.id])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (profile) fetchOrders()
  }, [profile, fetchOrders])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 bg-[#FAF9F6]">
        <Container>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-neutral-200 rounded" />
            <div className="h-64 bg-neutral-100 rounded" />
          </div>
        </Container>
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <div className="pt-32 pb-20 bg-[#FAF9F6] min-h-screen">
      <Container>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-[10px] tracking-widest text-neutral-400 hover:text-neutral-900 uppercase font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>GERİ QAYIT</span>
        </Link>

        <h1 className="text-xl font-bold tracking-widest uppercase text-neutral-900 mb-10">
          Mənim Profilim
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-100 p-6 space-y-5 rounded-xl">
              <div className="flex items-center space-x-4">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-neutral-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">
                    {[profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'İstifadəçi'}
                  </h2>
                  <p className="text-[10px] text-neutral-500">{profile.email || 'Email yoxdur'}</p>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <div className="flex items-center space-x-3 text-xs text-neutral-600">
                  <Phone className="h-3.5 w-3.5 text-neutral-400" />
                  <span>{profile.phone || 'Nömrə yoxdur'}</span>
                </div>
                {profile.email && (
                  <div className="flex items-center space-x-3 text-xs text-neutral-600">
                    <Mail className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <button
                onClick={signOut}
                className="w-full flex items-center justify-center space-x-2 border border-red-200 py-3 text-[10px] font-bold tracking-widest uppercase text-red-500 hover:bg-red-50 transition-colors cursor-pointer rounded-xl"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Çıxış</span>
              </button>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-neutral-100 p-6 rounded-xl">
              <div className="flex items-center space-x-2 border-b border-neutral-100 pb-3 mb-5">
                <Package className="h-4 w-4 text-neutral-800" />
                <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-900">Mənim Sifarişlərim</h2>
                {orders.length > 0 && (
                  <span className="text-[10px] text-neutral-400 font-mono ml-auto">{orders.length} sifariş</span>
                )}
              </div>

              {ordersLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-neutral-50 rounded-lg" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="h-10 w-10 text-neutral-200 mx-auto" />
                  <p className="text-xs text-neutral-400">Hələ ki, sifarişiniz yoxdur.</p>
                  <Link
                    href="/products"
                    className="inline-block text-[10px] font-bold tracking-widest uppercase text-neutral-900 underline hover:text-neutral-600"
                  >
                    Məhsullara bax
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map(o => (
                    <Link
                      key={o.id}
                      href={`/products/${o.product_id || '#'}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50 transition-all group"
                    >
                      {/* Product image */}
                      <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden">
                        {o.product_image ? (
                          <img src={o.product_image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-6 w-6 text-neutral-300 m-4" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-neutral-900 truncate">
                            {o.product_name || 'Məhsul'}
                          </span>
                          <span className="text-[10px] text-neutral-300">×{o.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_CLASSES[o.status] || 'bg-zinc-50 text-zinc-500'}`}>
                            {STATUS_ICONS[o.status]}
                            {STATUS_LABELS[o.status] || o.status}
                          </span>
                          {o.payment_status === 'paid' && (
                            <span className="text-[10px] text-emerald-600 font-medium">✓ Ödənildi</span>
                          )}
                          {o.payment_status === 'pending' && (
                            <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5">
                              <Clock className="h-3 w-3" /> Gözləyir
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-neutral-400">
                          <span>{new Date(o.created_at).toLocaleDateString('az', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>·</span>
                          <span>{o.payment_method ? PAYMENT_METHOD_LABELS[o.payment_method] || o.payment_method : '—'}</span>
                          <span>·</span>
                          <span className="font-medium text-neutral-700">{Number(o.total).toLocaleString()} ₼</span>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-600 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
