// ============================================================================
// Tovar.AI Pipeline — оркестратор всех 4 стадий
// ============================================================================

import { analyzeProductImage } from './stage1-vision'
import { planCardPrompts } from './stage2-planner'
import { generateAllCards } from './stage3-generate'
import { checkCardQuality } from './stage4-qa'
import {
  TOVAR_AI_CONFIG,
  type PipelineInput,
  type PipelineResult,
  type GenerationStatus,
  type VisionOutput,
  type PromptsOutput,
  type CardResult,
  type QAResult,
} from './types'

interface PipelineCallbacks {
  onStageChange?: (stage: GenerationStatus, message: string) => void
  onCardGenerated?: (index: number, total: number) => void
}

/**
 * Главная функция — полный пайплайн генерации карточек товара.
 *
 * @example
 * ```ts
 * const result = await runTovarAIPipeline({
 *   photoUrl: 'https://example.com/photo.jpg',
 *   providerDescription: 'Фен профессиональный 2000W',
 * })
 * // result.cards — 3 сгенерированных карточки
 * // result.product_analysis — VisionOutput (для автопарсинга)
 * ```
 */
export async function runTovarAIPipeline(
  input: PipelineInput,
  callbacks?: PipelineCallbacks,
): Promise<PipelineResult> {
  const config = TOVAR_AI_CONFIG

  if (!config.API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in .env.local')
  }

  // Если нет base64 — фетчим фото по URL и конвертируем
  let photoBase64 = input.photoBase64
  if (!photoBase64 && input.photoUrl) {
    photoBase64 = await fetchPhotoAsBase64(input.photoUrl)
  }
  if (!photoBase64) {
    throw new Error('Either photoBase64 or photoUrl must be provided')
  }

  let status: GenerationStatus = 'pending'
  let productAnalysis: VisionOutput | null = null
  let prompts: PromptsOutput | null = null
  let cards: CardResult[] = []
  let qaResults: QAResult[] = []
  let totalCost = 0

  try {
    // ─── STAGE 1: Vision Analysis ────────────────────────────────────
    status = 'analyzing'
    callbacks?.onStageChange?.(status, 'Analyzing product photo...')
    console.log('[Pipeline] Stage 1 — Vision Analysis')

    productAnalysis = await analyzeProductImage(
      photoBase64,
      input.providerDescription,
      input.characteristics,
    )
    console.log(
      `[Pipeline] Stage 1 ✅ — type: ${productAnalysis.product_type}, category: ${productAnalysis.category}`,
    )

    // ─── STAGE 2: Prompt Planning ────────────────────────────────────
    status = 'planning'
    callbacks?.onStageChange?.(status, 'Creating prompts...')
    console.log('[Pipeline] Stage 2 — Prompt Planning')

    prompts = await planCardPrompts(
      productAnalysis,
      input.providerDescription,
      input.characteristics,
      input.priceAz,
    )
    console.log(
      `[Pipeline] Stage 2 ✅ — ${prompts.cards.length} prompts, roles: ${prompts.roles.join(', ')}, palette: ${JSON.stringify(prompts.color_palette)}`,
    )

    // ─── STAGE 3: Parallel Image Generation ──────────────────────────
    status = 'generating'
    callbacks?.onStageChange?.(status, `Generating ${config.DEFAULT_CARD_COUNT} cards...`)
    console.log('[Pipeline] Stage 3 — Image Generation (parallel)')

    // Берем только нужное количество карточек (по умолчанию 3)
    const cardsToGenerate = prompts.cards.slice(0, config.DEFAULT_CARD_COUNT)

    cards = await generateAllCards(cardsToGenerate, photoBase64)
    console.log(`[Pipeline] Stage 3 ✅ — ${cards.length}/${cardsToGenerate.length} cards generated`)

    if (cards.length === 0) {
      throw new Error('All card generations failed')
    }

    // ─── STAGE 4: Quality Check ──────────────────────────────────────
    status = 'checking'
    callbacks?.onStageChange?.(status, 'Checking quality...')
    console.log('[Pipeline] Stage 4 — Quality Check')

    qaResults = await checkCardQuality(
      {
        product_type: productAnalysis.product_type,
        primary_color: productAnalysis.primary_color,
        material: productAnalysis.material,
      },
      cards,
      input.providerDescription,
    )

    // QA-проверка только репортит результат. Авто-регенерации НЕТ.
    // Админ решает сам, хочет ли пересоздать конкретную карточку.
    const failedQaCount = qaResults.filter(r => !r.passed).length
    if (failedQaCount > 0) {
      console.log(`[Pipeline] Stage 4 — ⚠️ ${failedQaCount} cards below QA threshold (no auto-retry)`)
    }

    // Приблизительная стоимость (OpenRouter цены)
    totalCost = estimateCost(
      config.DEFAULT_CARD_COUNT,
      cards.reduce((sum, c) => sum + c.attempt, 0),
    )

    status = 'done'
    callbacks?.onStageChange?.(status, 'Done!')
    console.log(`[Pipeline] ✅ Done — ${cards.length} cards, ~$${totalCost.toFixed(4)}`)

    return {
      generationId: '', // будет заполнено при сохранении в БД
      status,
      product_analysis: productAnalysis,
      prompts,
      cards,
      qa_results: qaResults,
      cost: totalCost,
    }
  } catch (err) {
    status = 'failed'
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error(`[Pipeline] ❌ Failed at stage "${status}":`, errorMsg)

    // Возвращаем частичный результат — то что успели
    return {
      generationId: '',
      status,
      product_analysis: productAnalysis!,
      prompts: prompts!,
      cards,
      qa_results: qaResults,
      cost: totalCost,
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchPhotoAsBase64(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch photo: ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  return buffer.toString('base64')
}

function estimateCost(cardCount: number, totalAttempts: number): number {
  // Реальные цены OpenRouter на 2026-06 (за токен)
  // Gemma 4 31B free: $0
  // DeepSeek chat: prompt $0.20/M, completion $0.80/M
  // Nano Banana 2 (gemini-3.1-flash-image-preview): prompt $0.50/M, completion $3/M
  // Gemma 4 31B free (Vision): $0
  //
  // Примерный расход токенов на пайплайн:
  const VISION_PROMPT = 0        // Gemma free
  const PLANNER_TOKENS = 0.0015  // ~3000 токенов DeepSeek
  const QA_TOKENS = 0.0005       // ~800 токенов GPT-4o-mini
  // Изображение: completion считается по output токенам, точное число
  // зависит от разрешения, ~2000-4000 output токенов на 1K картинку
  const IMAGE_COST_PER_CARD = TOVAR_AI_CONFIG.IMAGE_SIZE === '2K' ? 0.015 : 0.008

  return VISION_PROMPT + PLANNER_TOKENS + IMAGE_COST_PER_CARD * totalAttempts + QA_TOKENS
}
