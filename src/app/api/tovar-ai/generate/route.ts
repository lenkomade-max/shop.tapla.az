// ============================================================================
// POST /api/tovar-ai/generate — запуск генерации 3 карточек
// ============================================================================

import { NextResponse } from 'next/server'
import { runTovarAIPipeline, TOVAR_AI_CONFIG } from '@/lib/tovar-ai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { photoUrl, providerDescription, characteristics, photoBase64, priceAz, mode, supplierUrl, cardCount, template } = body

    if (!photoUrl && !photoBase64) {
      return NextResponse.json({ error: 'photoUrl or photoBase64 required' }, { status: 400 })
    }

    const result = await runTovarAIPipeline({
      photoUrl,
      photoBase64,
      providerDescription,
      characteristics,
      priceAz,
      mode: mode || 'test',
      supplierUrl: supplierUrl || undefined,
      cardCount: typeof cardCount === 'number' ? cardCount : undefined,
      template: template || undefined,
    })

    // Возвращаем также cardPrompts — данные промптов для каждой карточки,
    // чтобы фронтенд мог перегенерировать конкретную карточку
    const requestedCount = typeof cardCount === 'number' ? cardCount : TOVAR_AI_CONFIG.DEFAULT_CARD_COUNT
    const cardPrompts = result.prompts?.cards
      ?.slice(0, requestedCount)
      ?.map(p => ({
        index: p.index,
        role: p.role,
        prompt_en: p.prompt_en,
        text_overlay_az: p.text_overlay_az,
        composition: p.composition,
        needs_model: p.needs_model,
        reference_weight: p.reference_weight,
        creative_style: p.creative_style,
        marketing_style: p.marketing_style,
        visual_theme: p.visual_theme,
        color_palette: p.color_palette,
      })) ?? []

    return NextResponse.json({
      success: result.status === 'done',
      cards: result.cards.map(c => ({
        index: c.index,
        role: c.role,
        imageBase64: c.imageBase64,
        attempt: c.attempt,
      })),
      cardPrompts, // данные для регенерации отдельных карточек
      product_analysis: result.product_analysis,
      qa_results: result.qa_results,
      cost: result.cost,
      status: result.status,
      // Product mode — данные товара и R2 URLs
      productData: result.productData ?? null,
      imageUrls: result.imageUrls ?? null,
      // Stage 1.5 — AI-обогащённые данные товара (до мержа)
      enrichedData: result.enrichedData ?? null,
    })
  } catch (err) {
    console.error('[TovarAI] API error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
