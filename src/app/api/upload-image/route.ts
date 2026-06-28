// ============================================================================
// POST /api/upload-image — загрузка изображения в R2
// ============================================================================

import { NextResponse } from 'next/server'
import { uploadImage } from '@/lib/r2/upload'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'products'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
    }

    // Проверка размера (20 MB)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 })
    }

    // Читаем файл как base64
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')

    // Генерируем уникальный ключ
    const ext = file.type.split('/')[1] || 'png'
    const timestamp = Date.now()
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.[^.]+$/, '')
      .slice(0, 50)
    const key = `${folder}/${timestamp}_${sanitizedName}.${ext}`

    // Загружаем в R2
    const url = await uploadImage(base64, key, file.type)

    return NextResponse.json({ success: true, url, key })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[Upload API] Error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
