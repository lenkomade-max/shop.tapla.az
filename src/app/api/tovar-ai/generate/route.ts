// ============================================================================
// POST /api/tovar-ai/generate — запуск генерации 3 карточек
// ============================================================================

import { NextResponse } from 'next/server'
import { runTovarAIPipeline } from '@/lib/tovar-ai/pipeline'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { photoUrl, providerDescription, characteristics, photoBase64 } = body

    if (!photoUrl && !photoBase64) {
      return NextResponse.json({ error: 'photoUrl or photoBase64 required' }, { status: 400 })
    }

    const result = await runTovarAIPipeline({
      photoUrl,
      photoBase64,
      providerDescription,
      characteristics,
    })

    return NextResponse.json({
      success: result.status === 'done',
      cards: result.cards.map(c => ({
        index: c.index,
        role: c.role,
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
