// ============================================================================
// R2 Cloudflare Upload — S3-совместимый клиент для загрузки карточек Tovar.AI
// ============================================================================

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type { CardResult } from '@/lib/tovar-ai/types'

// ─── Конфигурация ─────────────────────────────────────────────────────────────

function getR2Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || ''
  const accessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY || ''
  const secretKey = process.env.CLOUDFLARE_R2_SECRET_KEY || ''
  const bucket = process.env.CLOUDFLARE_R2_BUCKET || 'tapla-origin'
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

  if (!accountId || !accessKey || !secretKey) {
    throw new Error(
      'R2 config missing. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY, CLOUDFLARE_R2_SECRET_KEY in .env.local',
    )
  }

  return { accountId, accessKey, secretKey, bucket, publicUrl }
}

let _client: S3Client | null = null

function getClient(): S3Client {
  if (_client) return _client
  const { accountId, accessKey, secretKey } = getR2Config()
  _client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  })
  return _client
}

// ─── Публичный URL ─────────────────────────────────────────────────────────────

/**
 * Формирует публичный URL для файла в R2.
 * Если задан NEXT_PUBLIC_R2_PUBLIC_URL — используется он (напр. cdn.tapla.az).
 * Иначе формируется стандартный R2 dev URL.
 */
export function getPublicUrl(key: string): string {
  const { publicUrl, accountId, bucket } = (() => {
    try { return getR2Config() }
    catch { return { publicUrl: '', accountId: '', bucket: 'tapla-origin' } as ReturnType<typeof getR2Config> }
  })()

  if (publicUrl) {
    return `${publicUrl.replace(/\/$/, '')}/${key}`
  }
  // Fallback: R2 dev URL (если publicUrl не задан)
  return `https://pub-${accountId}.r2.dev/${key}`
}

// ─── Загрузка ──────────────────────────────────────────────────────────────────

/**
 * Загружает один файл (base64) в R2.
 *
 * @param base64  — содержимое файла в base64 (без data: префикса)
 * @param key     — путь в бакете (напр. "products/slug/card_1.png")
 * @param contentType — MIME-тип (по умолч. image/png)
 * @returns публичный URL загруженного файла
 */
export async function uploadImage(
  base64: string,
  key: string,
  contentType: string = 'image/png',
): Promise<string> {
  const client = getClient()
  const { bucket } = getR2Config()

  // Декодируем base64 → Buffer
  const buffer = Buffer.from(base64, 'base64')

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

  await upload.done()
  return getPublicUrl(key)
}

/**
 * Загружает все сгенерированные карточки в R2.
 *
 * @param cards       — массив CardResult (с imageBase64)
 * @param productSlug — slug товара для пути (напр. "professionalnyy-fen-2000w")
 * @returns массив публичных URL (в порядке карточек)
 */
export async function uploadCardImages(
  cards: CardResult[],
  productSlug: string,
): Promise<string[]> {
  const urls: string[] = []

  // Загружаем параллельно — каждая карточка в своём файле
  const uploads = cards.map(async (card, i) => {
    const key = `products/${productSlug}/card_${card.index}_${card.role}.png`
    const url = await uploadImage(card.imageBase64, key, 'image/png')
    urls[i] = url
  })

  await Promise.all(uploads)
  return urls
}

/**
 * Удаляет файл из R2.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getClient()
  const { bucket } = getR2Config()

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  )
}
