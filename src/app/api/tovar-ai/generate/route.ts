// ============================================================================
// POST /api/tovar-ai/generate — запуск генерации 3 карточек
// ============================================================================

import { NextResponse } from 'next/server'
import { runTovarAIPipeline } from '@/lib/tovar-ai/pipeline'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, photoUrl, providerDescription, characteristics, photoBase64 } = body

    if (!photoUrl && !photoBase64) {
      return NextResponse.json({ error: 'photoUrl or photoBase64 required' }, { status: 400 })
    }

    // Запускаем пайплайн
    const result = await runTovarAIPipeline({
      photoUrl,
      photoBase64,
      providerDescription,
      characteristics,
    })

    // Сохраняем в БД
    const { data: genRecord, error: dbError } = await supabaseAdmin
      .from('tovar_ai_generations')
      .insert({
        product_id: productId || null,
        source_photo: photoUrl || '',
        product_analysis: result.product_analysis,
        prompts_json: result.prompts,
        cards: result.cards.map(c => ({
          index: c.index,
          purpose: c.purpose,
          imageBase64: c.imageBase64,
          attempt: c.attempt,
        })),
        qa_results: result.qa_results,
        status: result.status,
        error: result.status === 'failed' ? 'Pipeline failed' : null,
        cost: result.cost,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('[TovarAI] DB save error:', dbError)
    }

    return NextResponse.json({
      success: result.status === 'done',
      generationId: genRecord?.id || '',
      cards: result.cards.map(c => ({
        index: c.index,
        purpose: c.purpose,
        imageBase64: c.imageBase64,
        attempt: c.attempt,
      })),
      product_analysis: result.product_analysis,
      qa_results: result.qa_results,
      cost: result.cost,
      status: result.status,
    })
  } catch (err) {
    console.error('[TovarAI] API error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
