'use client'

import React, { useState, useCallback, useRef, DragEvent, useEffect } from 'react'
import {
  Loader2, CheckCircle2, XCircle, Upload, RefreshCw,
  Download, X, RotateCcw, Sparkles, ShoppingBag
} from 'lucide-react'
import { createProductFromAI, publishProduct, fetchActiveCategories } from '@/lib/actions'
import type { ProductDraftData } from '@/lib/tovar-ai'

type Stage = 'idle' | 'uploading' | 'analyzing' | 'planning' | 'generating' | 'done' | 'error'
type Mode = 'test' | 'product'

interface CardData {
  index: number
  role: string
  imageBase64: string
  attempt: number
}

interface CardPromptData {
  index: number
  role: string
  prompt_en: string
  text_overlay_az: string[]
  composition: string
  needs_model: boolean
  reference_weight: number
  creative_style: string
  marketing_style: string
  visual_theme: {
    lighting: string
    background_style: string
    mood: string
    materials: string[]
    spatial_depth: string[]
    motion: string
  }
  color_palette: string[]
}

const ROLE_LABELS: Record<string, string> = {
  hero: 'Hero — Əsas örtük',
  problem: 'Problem',
  solution: 'Həll',
  benefits: 'Üstünlüklər',
  usage: 'İstifadə',
  lifestyle: 'Lifestyle',
  offer: 'Təklif',
  bundle: 'Komplekt',
  delivery: 'Çatdırılma',
  comparison: 'Müqayisə',
  quality: 'Keyfiyyət',
  materials: 'Materiallar',
  warranty: 'Zəmanət',
  accessories: 'Aksessuarlar',
  close_up: 'Makro detal',
  cta: 'CTA — Alış',
  dimensions: 'Ölçülər',
  power: 'Güc',
  premium: 'Premium',
  review: 'Rəylər',
  gift: 'Hədiyyə',
  new_arrival: 'Yeni gəlib',
  best_seller: 'Best Seller',
}

const ROLE_DESC: Record<string, string> = {
  hero: 'Məhsul iri planda, scroll-stopper, başlıq',
  problem: 'Problemi göstərir, məhsul cavabdır',
  solution: 'Məhsul həll kimi, transformasiya',
  benefits: 'Üstünlük kartları məhsul ətrafında',
  usage: 'Real istifadə səhnəsi, insanla',
  lifestyle: 'Gözəl mühit, jurnal keyfiyyəti',
  offer: 'Promo kart, təcililik, endirim',
  bundle: 'Bütün aksessuarlar, tam komplekt',
  delivery: 'Sürətli çatdırılma mesajı',
  comparison: 'Məhsul alternativlə müqayisədə',
  quality: 'Material və işlənmə keyfiyyəti',
  materials: 'Materiallar: metal, şüşə, dəri, ağac',
  warranty: 'Zəmanət və etibarlılıq',
  accessories: 'Aksessuarlar düzülmüş',
  close_up: 'Ekstrem makro, detal, tekstura',
  cta: 'Böyük CTA, alışa yönləndirən',
  dimensions: 'Ölçü və miqyas, portativlik',
  power: 'Güc, sürət, performans',
  premium: 'Lüks mövqe, bahalı hiss',
  review: 'Rəy və sosial sübut',
  gift: 'Hədiyyə təqdimatı, qablaşdırma',
  new_arrival: 'Yeni gəlib, təzə, müasir',
  best_seller: 'Populyar seçim, bestseller',
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function TovarAIPage() {
  // ─── Общие состояния ──────────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>('test')
  const [stage, setStage] = useState<Stage>('idle')
  const [cards, setCards] = useState<CardData[]>([])
  const [cardPrompts, setCardPrompts] = useState<CardPromptData[]>([])
  const [error, setError] = useState('')
  const [cost, setCost] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)

  // Фото
  const [photo, setPhoto] = useState<{ base64: string; name: string; size: number } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Описание + цена + supplier URL
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [supplierUrl, setSupplierUrl] = useState('')

  // ─── Product mode — данные товара ─────────────────────────────────────
  const [productData, setProductData] = useState<ProductDraftData | null>(null)
  const [imageUrls, setImageUrls] = useState<string[] | null>(null)
  const [savedProductId, setSavedProductId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; slug: string; title: string; parent_id: string | null }>>([])

  // Загружаем категории при монтировании
  useEffect(() => {
    fetchActiveCategories().then(setCategories).catch(() => {})
  }, [])

  // ─── Drag & Drop ──────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Yalnız şəkil faylları qəbul edilir')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Fayl 20 MB-dan kiçik olmalıdır')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      setPhoto({ base64, name: file.name, size: file.size })
    }
    reader.readAsDataURL(file)
  }, [])

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = (e: DragEvent) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)

  const removePhoto = () => {
    setPhoto(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  // ─── Генерация ────────────────────────────────────────────────────────

  const generate = useCallback(async () => {
    if (!photo) {
      setError('Əvvəlcə məhsul şəklini yükləyin')
      return
    }

    setStage('analyzing')
    setError('')
    setCards([])
    setCardPrompts([])
    setProductData(null)
    setImageUrls(null)
    setSavedProductId(null)
    const start = Date.now()

    try {
      const resp = await fetch('/api/tovar-ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoBase64: photo.base64,
          providerDescription: description.trim() || undefined,
          priceAz: price.trim() || undefined,
          mode: mode,
          supplierUrl: supplierUrl.trim() || undefined,
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'API error' }))
        throw new Error(err.error || `API ${resp.status}`)
      }

      const data = await resp.json()
      setCards(data.cards || [])
      setCardPrompts(data.cardPrompts || [])
      setCost(data.cost || 0)
      setElapsed(((Date.now() - start) / 1000))

      if (data.productData) {
        setProductData(data.productData)
      }
      if (data.imageUrls) {
        setImageUrls(data.imageUrls)
      }

      setStage(data.success ? 'done' : 'error')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Naməlum xəta')
      setStage('error')
      setElapsed(((Date.now() - start) / 1000))
    }
  }, [photo, description, price, mode, supplierUrl])

  // ─── Регенерация одной карточки ───────────────────────────────────────

  const regenerateCard = useCallback(async (index: number) => {
    if (!photo || regeneratingIndex !== null) return

    const promptData = cardPrompts.find(p => p.index === index)
    if (!promptData) {
      setError(`Промпт для карточки ${index} не найден`)
      return
    }

    setRegeneratingIndex(index)
    setError('')

    try {
      const resp = await fetch('/api/tovar-ai/regenerate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoBase64: photo.base64,
          cardPrompt: promptData,
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'API error' }))
        throw new Error(err.error || `API ${resp.status}`)
      }

      const data = await resp.json()
      if (data.success && data.card) {
        setCards(prev =>
          prev.map(c => c.index === index ? { ...data.card } : c),
        )
      } else {
        throw new Error('No card in response')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Naməlum xəta')
    } finally {
      setRegeneratingIndex(null)
    }
  }, [photo, cardPrompts, regeneratingIndex])

  // ─── Сохранение товара (product mode) ─────────────────────────────────

  const handleSaveDraft = useCallback(async () => {
    if (!productData || saving) return
    setSaving(true)
    setError('')
    try {
      const finalData = { ...productData, images: imageUrls || [] }
      const id = await createProductFromAI(finalData, 'draft')
      if (id) {
        setSavedProductId(id)
      } else {
        setError('Məhsul yaradıla bilmədi')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta')
    } finally {
      setSaving(false)
    }
  }, [productData, imageUrls, saving])

  const handlePublish = useCallback(async () => {
    if (!productData || saving) return
    setSaving(true)
    setError('')
    try {
      const finalData = { ...productData, images: imageUrls || [] }
      const id = await createProductFromAI(finalData, 'active')
      if (id) {
        setSavedProductId(id)
      } else {
        setError('Məhsul yaradıla bilmədi')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta')
    } finally {
      setSaving(false)
    }
  }, [productData, imageUrls, saving])

  // ─── Скачать всё ──────────────────────────────────────────────────────

  const downloadAll = () => {
    cards.forEach(card => {
      const a = document.createElement('a')
      a.href = `data:image/png;base64,${card.imageBase64}`
      a.download = `tapla_card_${card.index}_${card.role}.png`
      a.click()
    })
  }

  // ─── Обновление полей productData ─────────────────────────────────────

  const updateProductField = <K extends keyof ProductDraftData>(
    key: K,
    value: ProductDraftData[K],
  ) => {
    setProductData(prev => prev ? { ...prev, [key]: value } : prev)
    // Авто-slug при изменении названия
    if (key === 'name' && typeof value === 'string') {
      setProductData(prev => prev ? { ...prev, slug: slugify(value) } : prev)
    }
  }

  const isBusy = stage === 'analyzing' || stage === 'planning' || stage === 'generating' || stage === 'uploading'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Tovar.AI</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
          {mode === 'test'
            ? 'Bir foto → 3 professional kart şəkli'
            : 'Foto + AI → hazır məhsul kartı'}
        </p>

        {/* ─── Табы режимов ──────────────────────────────────────── */}
        <div className="mt-4 flex gap-1 rounded-lg bg-zinc-100 p-1 w-fit">
          <button
            onClick={() => setMode('test')}
            className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'test'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Test
          </button>
          <button
            onClick={() => setMode('product')}
            className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'product'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Məhsul
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* ══════════════════════════════════════════════════════════════════
            ЛЕВАЯ КОЛОНКА: загрузка + параметры
           ══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Drag & Drop фото */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
              1. Məhsul şəkli *
            </h3>

            {photo ? (
              <div className="relative">
                <img
                  src={`data:image/jpeg;base64,${photo.base64}`}
                  alt={photo.name}
                  className="w-full rounded-lg border object-cover aspect-square"
                />
                <button
                  onClick={removePhoto}
                  disabled={isBusy}
                  className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white disabled:opacity-50"
                >
                  <X className="h-4 w-4 text-zinc-600" />
                </button>
                <p className="mt-2 text-xs text-zinc-400 text-center">
                  {photo.name} • {(photo.size / 1024).toFixed(0)} KB
                </p>
              </div>
            ) : (
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 cursor-pointer transition ${
                  dragOver
                    ? 'border-black bg-zinc-50'
                    : 'border-zinc-300 hover:border-zinc-400'
                }`}
              >
                <Upload className={`h-8 w-8 mb-3 ${dragOver ? 'text-black' : 'text-zinc-300'}`} />
                <p className="text-sm font-medium text-zinc-600">
                  Şəkili buraxın və ya klikləyin
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  JPG, PNG, WebP • max 20 MB
                </p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              className="hidden"
            />
          </div>

          {/* Описание поставщика */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
              2. Təchizatçı təsviri
            </h3>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Məsələn: Peşəkar fen 2000W, 3 rejim, ionizasiya, qatlanan tutacaq..."
              rows={6}
              disabled={isBusy}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black resize-none disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Məcburi deyil. Nə qədər çox detal — bir o qədər dəqiq kartlar.
            </p>
          </div>

          {/* Цена */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
              3. Qiymət (ixtiyari)
            </h3>
            <input
              type="text"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Məsələn: 29 AZN"
              disabled={isBusy}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Yalnız real qiymət varsa yazın. Boş qoysanız — qiymət göstərilməyəcək.
            </p>
          </div>

          {/* Supplier URL (всегда показываем, но особенно важно для product mode) */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
              4. Təchizatçı linki (URL)
            </h3>
            <input
              type="url"
              value={supplierUrl}
              onChange={e => setSupplierUrl(e.target.value)}
              placeholder="https://..."
              disabled={isBusy}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Link saxlanılır, AI analiz etmir. Əl ilə əlavə edirsiniz.
            </p>
          </div>

          {/* Кнопка генерации */}
          <button
            onClick={generate}
            disabled={!photo || isBusy}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-8 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center"
          >
            {isBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : stage === 'done' ? (
              <RefreshCw className="h-4 w-4" />
            ) : mode === 'product' ? (
              <Sparkles className="h-4 w-4" />
            ) : null}
            {isBusy ? (
              stage === 'analyzing' ? 'Analiz edilir...' :
              stage === 'planning' ? 'Promtlar hazırlanır...' :
              'Şəkillər yaradılır...'
            ) : stage === 'done' ? 'Yenidən yarat' : (
              mode === 'product' ? 'Məhsul yarat' : '3 kart şəkli yarat'
            )}
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ПРАВАЯ КОЛОНКА: результат
           ══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Статус */}
          {isBusy && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
                Proses
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'analyzing', label: 'Foto analizi (Vision)', stage: 'analyzing' as Stage },
                  { key: 'planning', label: 'Promtların hazırlanması', stage: 'planning' as Stage },
                  { key: 'generating', label: '3 şəkil generasiyası (paralel)', stage: 'generating' as Stage },
                ].map(s => {
                  const done = stage !== s.stage && (
                    (stage === 'generating' && (s.stage === 'analyzing' || s.stage === 'planning')) ||
                    (stage === 'planning' && s.stage === 'analyzing')
                  )
                  const active = stage === s.stage
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 animate-spin text-black shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-zinc-200 shrink-0" />
                      )}
                      <span className={`text-sm ${active ? 'text-black font-medium' : done ? 'text-zinc-400' : 'text-zinc-300'}`}>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Ошибка */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 flex items-start gap-2">
              <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Успешно сохранён */}
          {savedProductId && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Məhsul yaradıldı!{' '}
              <a href={`/admin/products/${savedProductId}/edit`} className="underline font-medium">
                Redaktə et →
              </a>
            </div>
          )}

          {/* Карточки */}
          {cards.length > 0 && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                  Nəticə — {cards.length} kart
                </h3>
                <button
                  onClick={downloadAll}
                  className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-black"
                >
                  <Download className="h-3 w-3" />
                  Hamısını yüklə
                </button>
              </div>

              <div className="space-y-4">
                {cards.map(card => {
                  const isRegenerating = regeneratingIndex === card.index
                  const imgSrc = (imageUrls && imageUrls[card.index - 1])
                    ? imageUrls[card.index - 1]
                    : `data:image/png;base64,${card.imageBase64}`
                  return (
                    <div key={card.index} className="relative flex gap-4 rounded-lg border bg-zinc-50 overflow-hidden p-3">
                      {/* Картинка */}
                      <div className="relative w-28 h-28 shrink-0">
                        <img
                          src={imgSrc}
                          alt={`Kart ${card.index}`}
                          className="w-full h-full rounded-md object-cover border"
                        />
                        {isRegenerating && (
                          <div className="absolute inset-0 rounded-md bg-white/70 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-black" />
                          </div>
                        )}
                      </div>

                      {/* Информация */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-800">
                          Kart {card.index}: {ROLE_LABELS[card.role] || card.role}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {ROLE_DESC[card.role] || ''}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          Cəhd {card.attempt} • 1K (1024×1024)
                          {imageUrls && imageUrls[card.index - 1] && (
                            <span className="ml-2 text-green-600">• R2-da</span>
                          )}
                        </p>

                        {/* Кнопка регенерации */}
                        <button
                          onClick={() => regenerateCard(card.index)}
                          disabled={isRegenerating || isBusy}
                          className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-zinc-600 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <RotateCcw className={`h-3 w-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                          {isRegenerating ? 'Yenilənir...' : 'Təkrar yarat'}
                        </button>
                      </div>

                      {/* Кнопка скачать */}
                      <a
                        href={imgSrc}
                        download={`tapla_card_${card.index}_${card.role}.png`}
                        className="absolute bottom-3 right-3 text-xs text-black underline"
                      >
                        Yüklə
                      </a>
                    </div>
                  )
                })}
              </div>

              {stage === 'done' && (
                <p className="mt-4 text-xs text-zinc-400 text-center">
                  {elapsed.toFixed(0)} saniyə • ~${cost.toFixed(3)}
                </p>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              PRODUCT MODE: Форма редактирования данных товара
             ════════════════════════════════════════════════════════════════ */}
          {mode === 'product' && productData && stage === 'done' && !savedProductId && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
                Məhsul məlumatları (AI-dən)
              </h3>
              <p className="mb-4 text-xs text-zinc-400">
                AI məhsul şəklindən bu məlumatları çıxardı. Redaktə edib yayımlaya bilərsiniz.
              </p>

              <div className="space-y-4">
                {/* Название */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Ad</label>
                  <input
                    value={productData.name}
                    onChange={e => updateProductField('name', e.target.value)}
                    className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Slug</label>
                  <input
                    value={productData.slug}
                    onChange={e => updateProductField('slug', e.target.value)}
                    className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono outline-none focus:border-black"
                  />
                </div>

                {/* Подзаголовок */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Alt başlıq</label>
                  <input
                    value={productData.subtitle}
                    onChange={e => updateProductField('subtitle', e.target.value)}
                    className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* Категория */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Kateqoriya</label>
                  {categories.length > 0 ? (
                    <select
                      value={productData.category_id || productData.category}
                      onChange={e => {
                        const selected = categories.find(c => c.id === e.target.value || c.slug === e.target.value)
                        if (selected) {
                          updateProductField('category_id', selected.id)
                          updateProductField('category', selected.title)
                          updateProductField('category_slug', selected.slug)
                        } else {
                          updateProductField('category', e.target.value)
                        }
                      }}
                      className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black bg-white"
                    >
                      <option value="">— Kateqoriya seçin —</option>
                      {categories.filter(c => !c.parent_id).map(root => (
                        <optgroup key={root.id} label={root.title}>
                          <option value={root.id}>{root.title} (ümumi)</option>
                          {categories.filter(c => c.parent_id === root.id).map(sub => (
                            <option key={sub.id} value={sub.id}>
                              &nbsp;&nbsp;└ {sub.title}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={productData.category}
                      onChange={e => updateProductField('category', e.target.value)}
                      placeholder={productData.category}
                      className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                    />
                  )}
                  {productData.category_id && categories.length > 0 && (
                    <p className="mt-1 text-xs text-green-600">
                      ✓ {categories.find(c => c.id === productData.category_id)?.title || 'Kateqoriya seçildi'}
                    </p>
                  )}
                  {!productData.category_id && categories.length > 0 && (
                    <p className="mt-1 text-xs text-amber-600">
                      ⚠ AI kateqoriyanı tapa bilmədi, əl ilə seçin
                    </p>
                  )}
                </div>

                {/* Описание */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Təsvir</label>
                  <textarea
                    value={productData.description}
                    onChange={e => updateProductField('description', e.target.value)}
                    rows={5}
                    className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black resize-none"
                  />
                </div>

                {/* Цена */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Qiymət (AZN)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productData.price}
                    onChange={e => updateProductField('price', parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* Преимущества */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">
                    Üstünlüklər{' '}
                    <button
                      type="button"
                      onClick={() => updateProductField('benefits', [...productData.benefits, ''])}
                      className="ml-2 text-xs font-normal text-zinc-400 hover:text-black"
                    >
                      + Əlavə et
                    </button>
                  </label>
                  {productData.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 mt-1">
                      <input
                        value={b}
                        onChange={e => {
                          const next = [...productData.benefits]
                          next[i] = e.target.value
                          updateProductField('benefits', next)
                        }}
                        placeholder="Üstünlük"
                        className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => updateProductField('benefits', productData.benefits.filter((_, j) => j !== i))}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Как использовать */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">İstifadə qaydası</label>
                  <textarea
                    value={productData.how_to_use}
                    onChange={e => updateProductField('how_to_use', e.target.value)}
                    rows={3}
                    className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black resize-none"
                  />
                </div>

                {/* Ингредиенты (для косметики) */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Tərkibi</label>
                  <textarea
                    value={productData.ingredients || ''}
                    onChange={e => updateProductField('ingredients', e.target.value || null)}
                    rows={2}
                    className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black resize-none"
                  />
                </div>

                {/* Теги */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">
                    Teqlər{' '}
                    <button
                      type="button"
                      onClick={() => updateProductField('tags', [...productData.tags, ''])}
                      className="ml-2 text-xs font-normal text-zinc-400 hover:text-black"
                    >
                      + Əlavə et
                    </button>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {productData.tags.map((t, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <input
                          value={t}
                          onChange={e => {
                            const next = [...productData.tags]
                            next[i] = e.target.value
                            updateProductField('tags', next)
                          }}
                          placeholder="Teq"
                          className="w-36 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={() => updateProductField('tags', productData.tags.filter((_, j) => j !== i))}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <button
                    onClick={handlePublish}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Dərc et
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                  >
                    Qaralama saxla
                  </button>
                  {elapsed > 0 && (
                    <span className="text-xs text-zinc-400 ml-auto">
                      {elapsed.toFixed(0)}s • ~${cost.toFixed(3)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
