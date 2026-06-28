'use client'

import React, { useState, useCallback, useRef, DragEvent } from 'react'
import { Loader2, CheckCircle2, XCircle, Upload, RefreshCw, Download, X } from 'lucide-react'

type Stage = 'idle' | 'uploading' | 'analyzing' | 'planning' | 'generating' | 'done' | 'error'

interface CardData {
  index: number
  role: string
  imageBase64: string
  attempt: number
}

const ROLE_LABELS: Record<string, string> = {
  hero: 'Hero — Əsas örtük',
  price: 'Qiymət',
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
  price: 'Qiymət əsasdır, aksiya, endirim',
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

export default function TovarAIPage() {
  const [stage, setStage] = useState<Stage>('idle')
  const [cards, setCards] = useState<CardData[]>([])
  const [error, setError] = useState('')
  const [cost, setCost] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  // Фото
  const [photo, setPhoto] = useState<{ base64: string; name: string; size: number } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Описание
  const [description, setDescription] = useState('')

  // ─── Drag & Drop ────────────────────────────────────────────────────────

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

  // ─── Генерация ──────────────────────────────────────────────────────────

  const generate = useCallback(async () => {
    if (!photo) {
      setError('Əvvəlcə məhsul şəklini yükləyin')
      return
    }

    setStage('analyzing')
    setError('')
    setCards([])
    const start = Date.now()

    try {
      const resp = await fetch('/api/tovar-ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoBase64: photo.base64,
          providerDescription: description.trim() || undefined,
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'API error' }))
        throw new Error(err.error || `API ${resp.status}`)
      }

      const data = await resp.json()
      setCards(data.cards || [])
      setCost(data.cost || 0)
      setElapsed(((Date.now() - start) / 1000))
      setStage(data.success ? 'done' : 'error')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Naməlum xəta')
      setStage('error')
      setElapsed(((Date.now() - start) / 1000))
    }
  }, [photo, description])

  // ─── Скачать всё ────────────────────────────────────────────────────────

  const downloadAll = () => {
    cards.forEach(card => {
      const a = document.createElement('a')
      a.href = `data:image/png;base64,${card.imageBase64}`
      a.download = `tapla_card_${card.index}_${card.role}.png`
      a.click()
    })
  }

  const isBusy = stage === 'analyzing' || stage === 'planning' || stage === 'generating' || stage === 'uploading'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Tovar.AI</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
          Bir foto → 3 professional kart şəkli
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* ─── ЛЕВАЯ КОЛОНКА: загрузка + описание ──────────────────────── */}
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

          {/* Кнопка */}
          <button
            onClick={generate}
            disabled={!photo || isBusy}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-8 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center"
          >
            {isBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : stage === 'done' ? (
              <RefreshCw className="h-4 w-4" />
            ) : (
              <span>3 kart şəkli yarat</span>
            )}
            {isBusy ? (
              stage === 'analyzing' ? 'Analiz edilir...' :
              stage === 'planning' ? 'Promtlar hazırlanır...' :
              'Şəkillər yaradılır...'
            ) : stage === 'done' ? 'Yenidən yarat' : null}
          </button>
        </div>

        {/* ─── ПРАВАЯ КОЛОНКА: результат ───────────────────────────────── */}
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
                {cards.map(card => (
                  <div key={card.index} className="flex gap-4 rounded-lg border bg-zinc-50 overflow-hidden p-3">
                    <img
                      src={`data:image/png;base64,${card.imageBase64}`}
                      alt={`Kart ${card.index}`}
                      className="w-28 h-28 rounded-md object-cover border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-800">
                        Kart {card.index}: {ROLE_LABELS[card.role] || card.role}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {ROLE_DESC[card.role] || ''}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        Cəhd {card.attempt} • 1K (1024×1024)
                      </p>
                      <a
                        href={`data:image/png;base64,${card.imageBase64}`}
                        download={`tapla_card_${card.index}_${card.role}.png`}
                        className="text-xs text-black underline mt-1 inline-block"
                      >
                        Yüklə
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {stage === 'done' && (
                <p className="mt-4 text-xs text-zinc-400 text-center">
                  {elapsed.toFixed(0)} saniyə • ~${cost.toFixed(3)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
