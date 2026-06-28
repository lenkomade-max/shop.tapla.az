// ============================================================================
// R2 Cloudflare Upload — S3-совместимый клиент для загрузки карточек Tovar.AI
// ============================================================================

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type { CardResult } from '@/lib/tovar-ai/types'
import { addWatermark } from '@/lib/watermark'

// ─── Конфигурация ─────────────────────────────────────────────────────────────

interface R2Config {
  accountId: string
  accessKey: string
  secretKey: string
  bucket: string
  publicUrl: string
}

function getR2Config(): R2Config {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || ''
  const accessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY || ''
  const secretKey = process.env.CLOUDFLARE_R2_SECRET_KEY || ''
  const bucket = process.env.CLOUDFLARE_R2_BUCKET || 'tapla-origin'
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

  const missing: string[] = []
  if (!accountId) missing.push('CLOUDFLARE_ACCOUNT_ID')
  if (!accessKey) missing.push('CLOUDFLARE_R2_ACCESS_KEY')
  if (!secretKey) missing.push('CLOUDFLARE_R2_SECRET_KEY')

  if (missing.length > 0) {
    throw new Error(
      `[R2] Config error — missing env vars: ${missing.join(', ')}. Check .env.local`,
    )
  }

  console.log(
    `[R2] Config OK — account: ${accountId.slice(0, 8)}..., bucket: ${bucket}, publicUrl: ${publicUrl || '(dev mode)'}`,
  )

  return { accountId, accessKey, secretKey, bucket, publicUrl }
}

let _client: S3Client | null = null

function getClient(): S3Client {
  if (_client) return _client
  const { accountId, accessKey, secretKey } = getR2Config()
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`
  console.log(`[R2] S3Client → endpoint: ${endpoint}`)
  _client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    // Добавляем таймаут чтобы не висеть вечно
    requestHandler: {
      requestTimeout: 30_000,
    },
  } as any)
  return _client
}

// ─── Публичный URL ─────────────────────────────────────────────────────────────

/**
 * Формирует публичный URL для файла в R2.
 * Если задан NEXT_PUBLIC_R2_PUBLIC_URL — используется он (напр. cdn.tapla.az).
 * Иначе формируется стандартный R2 dev URL.
 */
function buildPublicUrl(key: string): string {
  const { publicUrl, accountId } = (() => {
    try { return getR2Config() }
    catch { return { publicUrl: '', accountId: '' } as R2Config }
  })()

  if (publicUrl) {
    return `${publicUrl.replace(/\/$/, '')}/${key}`
  }
  // R2 dev URL (нужен dev-paid домен или custom domain)
  return `https://pub-${accountId}.r2.dev/${key}`
}

// ─── Загрузка ──────────────────────────────────────────────────────────────────

/**
 * Загружает один файл (base64) в R2.
 *
 * @param base64      — содержимое файла в base64 (без data: префикса)
 * @param key         — путь в бакете (напр. "products/slug/card_1.png")
 * @param contentType — MIME-тип (по умолч. image/png)
 * @returns публичный URL загруженного файла
 */
export async function uploadImage(
  base64: string,
  key: string,
  contentType: string = 'image/png',
): Promise<string> {
  const startTime = Date.now()
  const client = getClient()
  const { bucket } = getR2Config()

  // Валидация base64
  if (!base64 || base64.length < 100) {
    throw new Error(`[R2] Invalid base64 data for key "${key}": length=${base64?.length || 0}`)
  }

  console.log(`[R2] Uploading "${key}" — ${(base64.length / 1024).toFixed(0)} KB base64`)

  // Watermark — защита фото от кражи
  let watermarkedBase64 = base64
  try {
    watermarkedBase64 = await addWatermark(base64)
    console.log(`[R2] Watermark applied for "${key}"`)
  } catch (wmErr) {
    // Если watermark упал — загружаем оригинал (не блокируем загрузку)
    console.warn(`[R2] Watermark failed for "${key}", uploading original: ${wmErr instanceof Error ? wmErr.message : String(wmErr)}`)
  }

  const buffer = Buffer.from(watermarkedBase64, 'base64')
  console.log(`[R2] Decoded buffer: ${(buffer.length / 1024).toFixed(0)} KB`)

  const upload = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    },
  })

  // Логируем прогресс
  upload.on('httpUploadProgress', (progress) => {
    if (progress.loaded && progress.total) {
      console.log(`[R2] Progress "${key}": ${Math.round((progress.loaded / progress.total) * 100)}%`)
    }
  })

  try {
    const result = await upload.done()
    const elapsed = Date.now() - startTime
    const url = buildPublicUrl(key)
    console.log(`[R2] ✅ Uploaded "${key}" in ${elapsed}ms → ${url}`)
    console.log(`[R2]    Result: ${JSON.stringify({ bucket: result.Bucket, key: result.Key, location: result.Location })}`)
    return url
  } catch (err) {
    const elapsed = Date.now() - startTime
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[R2] ❌ Upload FAILED "${key}" after ${elapsed}ms: ${msg}`)
    throw new Error(`R2 upload failed for "${key}": ${msg}`)
  }
}

/**
 * Загружает все сгенерированные карточки в R2.
 *
 * @returns массив публичных URL (в порядке индексов карточек 1..N)
 */
export async function uploadCardImages(
  cards: CardResult[],
  productSlug: string,
): Promise<string[]> {
  console.log(`[R2] Starting batch upload: ${cards.length} cards → products/${productSlug}/`)

  const results: { index: number; url: string }[] = []

  // Загружаем параллельно
  const uploads = cards.map(async (card) => {
    const key = `products/${productSlug}/card_${card.index}_${card.role}.png`
    console.log(`[R2]   Card ${card.index} (${card.role}) → ${key}`)
    const url = await uploadImage(card.imageBase64, key, 'image/png')
    results.push({ index: card.index, url })
    return url
  })

  await Promise.all(uploads)

  // Сортируем по index и возвращаем URLs
  const sorted = results.sort((a, b) => a.index - b.index).map(r => r.url)
  console.log(`[R2] Batch upload complete: ${sorted.length} URLs → ${JSON.stringify(sorted)}`)
  return sorted
}

/**
 * Удаляет файл из R2.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getClient()
  const { bucket } = getR2Config()

  console.log(`[R2] Deleting "${key}" from bucket "${bucket}"`)
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  )
  console.log(`[R2] ✅ Deleted "${key}"`)
}
