// ============================================================================
// Tovar.AI Pipeline — оркестратор всех 4 стадий
// ============================================================================

import { analyzeProductImage } from './stage1-vision'
import { enrichProductData } from './stage1.5-enricher'
import { planCardPrompts } from './stage2-planner'
import { planCardPromptsV2 } from './stage2-planner-v2'
import { generateAllCards } from './stage3-generate'
import { checkCardQuality } from './stage4-qa'
import { visionToProductData } from './vision-to-product'
import type { ProductDraftData } from './vision-to-product'
import {
  TOVAR_AI_CONFIG,
  type PipelineInput,
  type PipelineResult,
  type GenerationStatus,
  type VisionOutput,
  type PromptsOutput,
  type CardResult,
  type QAResult,
  type EnricherOutput,
} from './types'

// ════════════════════════════════════════════════════════════════════════════
// STAGE 2 MODE: 'v1' = старая система с JSON-библиотеками (по умолчанию)
//              'v2' = новый LLM-driven Creative Director
// ════════════════════════════════════════════════════════════════════════════
const STAGE2_MODE: 'v1' | 'v2' = 'v1'

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
  let productData: ProductDraftData | undefined
  let imageUrls: string[] | undefined
  let enrichedData: EnricherOutput | undefined

  const isProductMode = input.mode === 'product'
  const cardCount = clampCardCount(input.cardCount ?? config.DEFAULT_CARD_COUNT)

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

    // ─── PRODUCT MODE: Stage 1.5 параллельно с генерацией карточек ──
    if (isProductMode) {
      status = 'planning'
      callbacks?.onStageChange?.(status, 'Enriching data + generating cards...')
      console.log('[Pipeline] Product mode — parallel: Enricher (1.5) || Stages 2→3→4')

      // Запускаем параллельно:
      //   Path A: Stage 1.5 Data Enricher (улучшение данных)
      //   Path B: Stage 2 → Stage 3 → Stage 4 (генерация карточек)
      const [enrichedContent, cardGenResult] = await Promise.all([
        enrichProductData(
          photoBase64,
          productAnalysis,
          input.providerDescription,
          input.characteristics,
        ),
        (async () => {
          // ─── STAGE 2: Prompt Planning ──────────────────────────────
          console.log('[Pipeline] Stage 2 — Prompt Planning')
          const p = STAGE2_MODE === 'v2'
            ? await planCardPromptsV2(productAnalysis, cardCount, input.providerDescription, input.priceAz)
            : await planCardPrompts(productAnalysis, input.providerDescription, input.characteristics, input.priceAz, input.template)
          console.log(
            `[Pipeline] Stage 2 (${STAGE2_MODE}) ✅ — ${p.cards.length} prompts, roles: ${p.roles.join(', ')}, palette: ${JSON.stringify(p.color_palette)}`,
          )

          // ─── STAGE 3: Parallel Image Generation ────────────────────
          console.log('[Pipeline] Stage 3 — Image Generation (parallel)')
          const cardsToGen = p.cards.slice(0, cardCount)
          const c = await generateAllCards(cardsToGen, photoBase64)
          console.log(`[Pipeline] Stage 3 ✅ — ${c.length}/${cardsToGen.length} cards generated`)

          if (c.length === 0) {
            throw new Error('All card generations failed')
          }

          // ─── STAGE 4: Quality Check ────────────────────────────────
          console.log('[Pipeline] Stage 4 — Quality Check')
          const q = await checkCardQuality(
            {
              product_type: productAnalysis.product_type,
              primary_color: productAnalysis.primary_color,
              material: productAnalysis.material,
            },
            c,
            input.providerDescription,
          )

          return { prompts: p, cards: c, qaResults: q }
        })(),
      ])

      // Оба пути завершены — собираем результаты
      prompts = cardGenResult.prompts
      cards = cardGenResult.cards
      qaResults = cardGenResult.qaResults
      enrichedData = enrichedContent

      // Мержим EnricherOutput + VisionOutput → ProductDraftData
      productData = mergeEnrichedData(
        enrichedContent,
        productAnalysis,
        input.providerDescription,
        input.priceAz,
        input.supplierUrl,
      )
      console.log(
        `[Pipeline] Stage 1.5 ✅ — data enriched: "${productData.name}", ${productData.benefits.length} benefits, ${productData.tags.length} tags`,
      )

      // Матчинг AI-категории → БД categories
      try {
        const { matchCategoryFromAI } = await import('@/lib/supabase/categories')
        const matched = await matchCategoryFromAI(productAnalysis.category)
        if (matched) {
          productData.category_id = matched.id
          productData.category = matched.title
          productData.category_slug = matched.slug
          console.log(`[Pipeline] Category matched: "${productAnalysis.category}" → ${matched.title} (${matched.id})`)
        } else {
          console.log(`[Pipeline] Category NOT matched for: "${productAnalysis.category}" — adмин выберет вручную`)
        }
      } catch (catErr) {
        console.warn('[Pipeline] Category matching skipped:', catErr instanceof Error ? catErr.message : String(catErr))
      }

      // Загружаем карточки в R2
      const { uploadCardImages } = await import('@/lib/r2/upload')
      imageUrls = await uploadCardImages(cards, productData.slug)
      console.log(`[Pipeline] R2 upload ✅ — ${imageUrls.length} cards uploaded`)

    } else {
      // ─── TEST MODE: sequential Stages 2→3→4 (без enricher) ────────

      // ─── STAGE 2: Prompt Planning ──────────────────────────────────
      status = 'planning'
      callbacks?.onStageChange?.(status, 'Creating prompts...')
      console.log('[Pipeline] Stage 2 — Prompt Planning')

      prompts = STAGE2_MODE === 'v2'
        ? await planCardPromptsV2(productAnalysis, cardCount, input.providerDescription, input.priceAz)
        : await planCardPrompts(productAnalysis, input.providerDescription, input.characteristics, input.priceAz, input.template)
      console.log(
        `[Pipeline] Stage 2 ✅ — ${prompts.cards.length} prompts, roles: ${prompts.roles.join(', ')}, palette: ${JSON.stringify(prompts.color_palette)}`,
      )

      // ─── STAGE 3: Parallel Image Generation ────────────────────────
      status = 'generating'
      callbacks?.onStageChange?.(status, `Generating ${cardCount} cards...`)
      console.log('[Pipeline] Stage 3 — Image Generation (parallel)')

      const cardsToGenerate = prompts.cards.slice(0, cardCount)

      cards = await generateAllCards(cardsToGenerate, photoBase64)
      console.log(`[Pipeline] Stage 3 ✅ — ${cards.length}/${cardsToGenerate.length} cards generated`)

      if (cards.length === 0) {
        throw new Error('All card generations failed')
      }

      // ─── STAGE 4: Quality Check ────────────────────────────────────
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
    }

    // QA-проверка только репортит результат. Авто-регенерации НЕТ.
    // Админ решает сам, хочет ли пересоздать конкретную карточку.
    const failedQaCount = qaResults.filter(r => !r.passed).length
    if (failedQaCount > 0) {
      console.log(`[Pipeline] Stage 4 — ⚠️ ${failedQaCount} cards below QA threshold (no auto-retry)`)
    }

    // Приблизительная стоимость (OpenRouter цены)
    totalCost = estimateCost(
      cardCount,
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
      ...(productData ? { productData } : {}),
      ...(imageUrls ? { imageUrls } : {}),
      ...(enrichedData ? { enrichedData } : {}),
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
      ...(productData ? { productData } : {}),
      ...(imageUrls ? { imageUrls } : {}),
      ...(enrichedData ? { enrichedData } : {}),
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

/**
 * Мержит EnricherOutput + VisionOutput + опциональные поля → ProductDraftData.
 * AI-контент из Enricher поверх детерминированных полей VisionOutput.
 */
function mergeEnrichedData(
  enriched: EnricherOutput,
  analysis: VisionOutput,
  providerDescription?: string,
  priceAz?: string,
  supplierUrl?: string,
): ProductDraftData {
  const name = enriched.name_az || providerDescription || capitalizeFirst(analysis.product_type)
  const title = enriched.title_az || name
  const subtitle = enriched.subtitle_az || analysis.key_selling_points[0] || ''
  const description = enriched.description_az || buildDescription(analysis)
  const category = analysis.category
  const price = parsePrice(priceAz) || estimatePrice(analysis.premium_level)
  const benefits = enriched.benefits_az.length > 0
    ? enriched.benefits_az
    : analysis.key_selling_points.slice(0, 6)
  const how_to_use = enriched.how_to_use_az || analysis.intended_use
  const ingredients = analysis.category === 'Kosmetika'
    ? (enriched.ingredients_az || analysis.package_contents.join(', ') || null)
    : null
  const tags = enriched.tags_az.length > 0
    ? enriched.tags_az
    : [analysis.product_type, analysis.material, ...analysis.possible_functions.slice(0, 4)].filter(Boolean)
  const slug = enriched.slug && enriched.slug.length >= 3
    ? enriched.slug
    : seoSlug(analysis, providerDescription)

  return {
    name,
    slug,
    title,
    subtitle,
    description,
    category,
    price,
    benefits,
    how_to_use,
    ingredients,
    tags,
    images: [],
    supplier_url: supplierUrl,
    is_new: true,
    shades: enriched.shades || [],
    try_on_enabled: enriched.try_on_enabled ?? false,
    features: enriched.features_az?.length ? enriched.features_az : undefined,
    ideal_for: enriched.ideal_for_az || undefined,
    use_cases: enriched.use_cases_az?.length ? enriched.use_cases_az : undefined,
    care_instructions: enriched.care_instructions_az || undefined,
    compatibility: enriched.compatibility_az || undefined,
    faq: enriched.faq_az?.length ? enriched.faq_az : undefined,
    search_keywords: enriched.search_keywords_az?.length ? enriched.search_keywords_az : undefined,
  }
}

// ─── Shared helpers (from vision-to-product.ts, duplicated to avoid circular dep) ──

function capitalizeFirst(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function buildDescription(analysis: VisionOutput): string {
  const parts: string[] = []
  if (analysis.intended_use) parts.push(analysis.intended_use + '.')
  if (analysis.key_selling_points.length > 0)
    parts.push('Əsas üstünlüklər: ' + analysis.key_selling_points.join(', ') + '.')
  if (analysis.material) parts.push(`Material: ${analysis.material}.`)
  if (analysis.package_contents.length > 0)
    parts.push('Dəstə daxildir: ' + analysis.package_contents.join(', ') + '.')
  if (analysis.possible_functions.length > 0)
    parts.push('Funksiyalar: ' + analysis.possible_functions.join(', ') + '.')
  return parts.join('\n\n') || `${analysis.product_type} — TAPLA Marketplace`
}

function parsePrice(priceStr?: string): number | null {
  if (!priceStr) return null
  const match = priceStr.match(/(\d+(?:[.,]\d+)?)/)
  if (!match) return null
  return parseFloat(match[1].replace(',', '.'))
}

function estimatePrice(premiumLevel: VisionOutput['premium_level']): number {
  switch (premiumLevel) {
    case 'luxury': return 199
    case 'premium': return 79
    case 'mid': return 29
    case 'budget': return 9
    default: return 0
  }
}

const AZ_STOP_WORDS = new Set([
  'və', 'ilə', 'üçün', 'bu', 'bir', 'də', 'ki', 'o', 'öz',
  'var', 'yox', 'amma', 'lakin', 'hər', 'hansı', 'necə', 'nə',
  'harada', 'niyə', 'kim', 'çox', 'az', 'daha', 'ən', 'artıq',
  'sonra', 'indi', 'belə', 'elə', 'ancaq', 'bütün', 'digər',
  'həm', 'həmçinin', 'hələ', 'heç', 'isə', 'görə', 'kimi',
  'qədər', 'haqqında', 'barədə', 'sizə', 'mənə', 'ona', 'bunu',
  'bilər', 'olsun', 'edir', 'olur', 'edən', 'olan', 'ilə',
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
  'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'from', 'by', 'as', 'it', 'its', 'no', 'not',
])

function seoSlug(analysis: VisionOutput, providerDescription?: string): string {
  const keywords: string[] = []
  if (analysis.brand && analysis.brand.length < 20) keywords.push(analysis.brand)
  if (analysis.product_type) keywords.push(analysis.product_type)
  const shortFeatures = analysis.key_selling_points
    .filter(f => f.length < 25)
    .slice(0, 2)
  keywords.push(...shortFeatures)

  let raw = keywords.length >= 2
    ? keywords.join(' ')
    : (providerDescription || analysis.product_type)

  const words = raw.split(/\s+/).filter(w => w.length > 1)
  const limitedWords = words.slice(0, 5)
  raw = limitedWords.join(' ')

  return cleanSlug(raw)
}

function cleanSlug(raw: string): string {
  const transliterated = raw.toLowerCase().trim()
    .replace(/ə/g, 'e').replace(/ç/g, 'c').replace(/ş/g, 's')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ').trim()

  const words = transliterated.split(' ').filter(w => !AZ_STOP_WORDS.has(w))
  let slug = words.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  if (slug.length > 60) slug = slug.slice(0, 60).replace(/-[^-]*$/, '')
  if (!slug || slug.length < 2) slug = 'mehsul'
  return slug
}

function clampCardCount(n: number): number {
  if (!Number.isFinite(n) || n < 1) return TOVAR_AI_CONFIG.DEFAULT_CARD_COUNT
  return Math.min(Math.round(n), 10)
}
