// ============================================================================
// POST /api/tovar-ai/regenerate-card — перегенерация одной карточки
// ============================================================================

import { NextResponse } from 'next/server'
import { generateSingleCard } from '@/lib/tovar-ai'
import type { CardPrompt } from '@/lib/tovar-ai/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { photoBase64, cardPrompt } = body

    if (!photoBase64 || !cardPrompt) {
      return NextResponse.json(
        { error: 'photoBase64 and cardPrompt required' },
        { status: 400 },
      )
    }

    // Валидация cardPrompt
    const prompt: CardPrompt = {
      index: cardPrompt.index ?? 0,
      role: cardPrompt.role ?? 'hero',
      prompt_en: cardPrompt.prompt_en ?? '',
      text_overlay_az: cardPrompt.text_overlay_az ?? [],
      composition: cardPrompt.composition ?? 'center',
      needs_model: cardPrompt.needs_model ?? false,
      reference_weight: cardPrompt.reference_weight ?? 0.7,
      creative_style: cardPrompt.creative_style ?? 'cs01',
      marketing_style: cardPrompt.marketing_style ?? 'ms04',
      visual_theme: cardPrompt.visual_theme ?? {
        lighting: 'soft_studio',
        background_style: 'premium_gradient',
        mood: 'minimal_luxury',
        materials: ['matte_glass', 'polished_aluminum'],
        spatial_depth: ['volumetric_light'],
        motion: 'still_precision',
      },
      color_palette: cardPrompt.color_palette ?? ['#0F172A', '#3B82F6', '#1E293B', '#FFFFFF', '#60A5FA'],
    }

    // Генерируем одну карточку
    const result = await generateSingleCard(prompt, photoBase64)

    return NextResponse.json({
      success: true,
      card: {
        index: result.index,
        role: result.role,
        imageBase64: result.imageBase64,
        attempt: result.attempt,
      },
    })
  } catch (err) {
    console.error('[RegenerateCard] API error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
