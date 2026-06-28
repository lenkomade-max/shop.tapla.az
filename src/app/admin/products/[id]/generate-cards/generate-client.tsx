'use client'

import React, { useState, useCallback } from 'react'
import { Loader2, CheckCircle2, XCircle, ImageIcon, RefreshCw } from 'lucide-react'

type Stage = 'idle' | 'analyzing' | 'planning' | 'generating' | 'done' | 'error'

interface CardData {
  index: number
  role: string
  imageBase64: string
  attempt: number
}

interface Props {
  productId: string
  productName: string
  mainImage: string | null
}

const ROLE_LABELS: Record<string, string> = {
  hero: 'Hero', problem: 'Problem', solution: 'Həll',
  benefits: 'Üstünlüklər', usage: 'İstifadə', lifestyle: 'Lifestyle',
  offer: 'Təklif', bundle: 'Komplekt', delivery: 'Çatdırılma',
  comparison: 'Müqayisə', quality: 'Keyfiyyət', materials: 'Materiallar',
  warranty: 'Zəmanət', accessories: 'Aksessuarlar', close_up: 'Makro',
  cta: 'CTA', dimensions: 'Ölçülər', power: 'Güc', premium: 'Premium',
  review: 'Rəylər', gift: 'Hədiyyə', new_arrival: 'Yeni', best_seller: 'Best Seller',
}

const STAGE_LABELS: Record<Stage, string> = {
  idle: '',
  analyzing: 'Foto analiz edilir...',
  planning: 'Promtlar hazırlanır...',
  generating: '3 kart şəkli yaradılır...',
  done: '✅ Hazırdır!',
  error: 'Xəta baş verdi',
}

export function GenerateCardsClient({ productId, productName, mainImage }: Props) {
  const [stage, setStage] = useState<Stage>('idle')
  const [cards, setCards] = useState<CardData[]>([])
  const [error, setError] = useState('')
  const [cost, setCost] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const generate = useCallback(async () => {
    if (!mainImage) {
      setError('Məhsulun şəkili yoxdur. Əvvəlcə şəkil əlavə edin.')
      return
    }

    setStage('analyzing')
    setError('')
    setCards([])
    const start = Date.now()

    try {
      // Отправляем URL фото — сервер сам скачает (Buffer работает на сервере)
      const resp = await fetch('/api/tovar-ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          photoUrl: mainImage,
          providerDescription: description || undefined,
          priceAz: price.trim() || undefined,
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
  }, [mainImage, productId, description, price])

  return (
    <div className="space-y-6">
      {/* Входные данные */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
          Mənbə məlumatları
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="mb-1 text-xs font-medium text-zinc-600">Məhsulun əsas şəkili</p>
            {mainImage ? (
              <img
                src={mainImage}
                alt={productName}
                className="w-full max-w-xs rounded-lg border object-cover aspect-square"
              />
            ) : (
              <div className="w-full max-w-xs aspect-square rounded-lg border bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm">
                Şəkil yoxdur
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Təsvir (məcburi deyil)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Məsələn: LED işıqlandırma, pult ilə..."
              rows={5}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black resize-none"
            />
          </div>

          {/* Qiymət */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Qiymət (ixtiyari)
            </label>
            <input
              type="text"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Məsələn: 29 AZN"
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <p className="mt-1 text-xs text-zinc-400">Yalnız real qiymət varsa doldurun.</p>
          </div>
        </div>
      </div>

      {/* Кнопка запуска */}
      <div className="flex items-center gap-4">
        <button
          onClick={generate}
          disabled={stage !== 'idle' && stage !== 'done' && stage !== 'error'}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {stage === 'idle' && <ImageIcon className="h-4 w-4" />}
          {(stage === 'analyzing' || stage === 'planning') && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {stage === 'done' && <RefreshCw className="h-4 w-4" />}
          {stage === 'error' && <RefreshCw className="h-4 w-4" />}
          {stage === 'idle' && '3 kart şəkli yarat'}
          {stage === 'analyzing' && 'Analiz edilir...'}
          {stage === 'planning' && 'Promtlar hazırlanır...'}
          {stage === 'done' && 'Yenidən yarat'}
          {stage === 'error' && 'Təkrar cəhd et'}
        </button>

        {stage === 'done' && (
          <span className="text-sm text-zinc-400">
            {elapsed.toFixed(0)}s • ~${cost.toFixed(4)}
          </span>
        )}
      </div>

      {/* Статус */}
      {stage !== 'idle' && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
            Status
          </h3>

          <div className="space-y-2 text-sm">
            {(['analyzing', 'planning'] as Stage[]).map(s => (
              <div key={s} className="flex items-center gap-2">
                {(stage === s) ? (
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                ) : stage === 'done' || stage === 'generating' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : stage === 'error' ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border" />
                )}
                <span className={stage === s ? 'text-black font-medium' : 'text-zinc-400'}>
                  {STAGE_LABELS[s]}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
        </div>
      )}

      {/* Результат */}
      {cards.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
            Nəticə — {cards.length} kart şəkli
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {cards.map(card => (
              <div key={card.index} className="rounded-lg border bg-zinc-50 overflow-hidden">
                <img
                  src={`data:image/png;base64,${card.imageBase64}`}
                  alt={`Card ${card.index}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3 border-t bg-white">
                  <p className="text-xs font-medium text-zinc-700">
                    Kart {card.index}: {ROLE_LABELS[card.role] || card.role}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Cəhd {card.attempt} • 1024×1024
                  </p>
                  <a
                    href={`data:image/png;base64,${card.imageBase64}`}
                    download={`card_${card.index}_${card.role}.png`}
                    className="text-xs text-black underline mt-1 inline-block"
                  >
                    Yüklə
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
