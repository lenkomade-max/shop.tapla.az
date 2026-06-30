# Kei Proxy Integration: Tovar AI → Nano Banana 2

## Цель

Перенаправить генерацию изображений в Tovar AI (Stage 3) с OpenRouter на Kei Proxy (`n1leads.tapla.az`). Текстовые модели (Stage 1, 1.5, 2, 4) остаются на OpenRouter.

## Архитектура

```
Tovar AI Pipeline (shop.tapla.az)
  ├── Stage 1 (Vision)  → OpenRouter  ← без изменений
  ├── Stage 2 (Prompts) → OpenRouter  ← без изменений
  ├── Stage 3 (Images)  → Kei Proxy (n1leads.tapla.az)  ← ИЗМЕНИТЬ
  │     POST /api/kei-ai/createTask  { model: "nano-banana-2", input: { prompt, image_input[], aspect_ratio } }
  │     → получаем taskId
  │     → polling GET /api/public/status?taskId=xxx&token=yyy
  └── Stage 4 (QA)      → OpenRouter  ← без изменений
```

## Отличия протоколов

| | OpenRouter (сейчас) | Kei Proxy (новый) |
|---|---|---|
| Тип | Синхронный | Асинхронный (createTask → polling) |
| Формат | `/chat/completions` с `modalities: ['image', 'text']` | `POST /api/kei-ai/createTask` body `{ model, input }` |
| Reference фото | Base64 в `messages[].content[].image_url.url` | `image_input[]` массив URL/base64 |
| Ответ | image Base64 в choices[0].message.images[] | taskId → polling → resultUrls |

## Kei Proxy Endpoints

Базовый URL: `https://n1leads.tapla.az`

| Endpoint | Метод | Назначение |
|---|---|---|
| `/api/kei-ai/createTask` | POST | Создать задачу генерации |
| `/api/public/status?taskId=&token=` | GET | Polling статуса (браузер или сервер) |

## Аутентификация

HMAC-SHA256 подпись, формируется через `createSignedHeaders(path, method, body?)`:

```
X-Signature: sha256=<hex>
X-Timestamp: <unix_ms>
X-Nonce: <16 байт hex>
```

Где message = `method\npath\ntimestamp\nnonce\nbody`

**Нужны 2 env переменные:**
```
KEI_PROXY_URL=https://n1leads.tapla.az
PROXY_SECRET=<секрет от kei-proxy>
```

## Изменения в коде

### 1. `src/lib/tovar-ai/types.ts` — добавить конфиг Kei

В `TOVAR_AI_CONFIG` добавить:
```ts
KEI_PROXY_URL: process.env.KEI_PROXY_URL || 'https://n1leads.tapla.az',
PROXY_SECRET: process.env.PROXY_SECRET || '',
```

### 2. `src/lib/tovar-ai/stage3-generate.ts` — дублировать в kei-версию

Создать `src/lib/tovar-ai/stage3-generate-kei.ts`:

```
generateSingleCardViaKei(card, photoBase64) → CardResult
generateAllCardsViaKei(cards, photoBase64) → CardResult[]
```

**Логика `generateSingleCardViaKei`:**

1. Сформировать `image_input[]` — загрузить reference фото на VPS upload endpoint или передать как base64 data URL
2. Вызвать `POST /api/kei-ai/createTask`:
   ```json
   {
     "model": "nano-banana-2",
     "input": {
       "prompt": "<hardRules + card.prompt_en>",
       "aspect_ratio": "4:5",
       "resolution": "1K",
       "output_format": "png",
       "image_input": ["data:image/jpeg;base64,..."]
     }
   }
   ```
3. Получить `taskId` и `_pollingToken`
4. Polling: `GET /api/public/status?taskId=<id>&token=<token>` с exponential backoff (2s, 4s, 8s... max 60s)
5. Когда status = success — извлечь `resultUrls[0]`, скачать изображение, конвертировать в Base64
6. Retry при ошибках (аналогично текущей OpenRouter версии: max 2 попытки)

**Формат ответа createTask:**
```json
{ "code": 200, "msg": "success", "data": { "taskId": "..." }, "_pollingToken": "..." }
```

**Формат ответа status polling:**
```json
{ "code": 200, "data": { "taskId": "...", "state": "success", "resultJson": "{\"resultUrls\":[\"...\"]}" } }
```

### 3. `src/lib/tovar-ai/pipeline.ts` — переключить Stage 3

Заменить импорт:
```ts
import { generateAllCards } from './stage3-generate-kei'
```

Оставить текстовые стадии на OpenRouter (imports stage1-vision, stage2-planner, stage4-qa не трогать).

### 4. `src/app/api/tovar-ai/regenerate-card/route.ts`

Аналогично переключить `generateSingleCard` на kei-версию.

### 5. `.env.local` — добавить переменные

```
KEI_PROXY_URL=https://n1leads.tapla.az
PROXY_SECRET=<значение из kei-proxy .env>
```

## HMAC-SHA256 подпись (повторить из fenta-tapla)

Создать `src/lib/tovar-ai/proxy-security.ts` — скопировать из fenta-tapla `lib/proxy-security.ts` (там функция `createSignedHeaders`).

Либо inline в stage3-generate-kei.ts:
```ts
function createSignedHeaders(path, method, body?) {
  const { PROXY_SECRET } = TOVAR_AI_CONFIG
  const timestamp = Date.now().toString()
  const nonce = crypto.randomBytes(16).toString('hex')
  const message = `${method}\n${path}\n${timestamp}\n${nonce}\n${body || ''}`
  const signature = crypto.createHmac('sha256', PROXY_SECRET).update(message).digest('hex')
  return {
    'Content-Type': 'application/json',
    'X-Signature': `sha256=${signature}`,
    'X-Timestamp': timestamp,
    'X-Nonce': nonce,
  }
}
```

## Polling Logic

```ts
async function pollTaskStatus(taskId, token, maxWaitMs = 60000) {
  const start = Date.now()
  let delay = 2000
  while (Date.now() - start < maxWaitMs) {
    const url = `${KEI_PROXY_URL}/api/public/status?taskId=${taskId}&token=${token}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.data?.state === 'success') {
      const urls = JSON.parse(data.data.resultJson).resultUrls
      return urls  // string[]
    }
    if (data.data?.state === 'fail') throw new Error(data.data.failMsg)
    await sleep(delay)
    delay = Math.min(delay * 2, 10000)  // exponential backoff, max 10s
  }
  throw new Error('Polling timeout')
}
```

## Загрузка фото в kei-proxy (опционально)

Reference фото можно передать как data URL в `image_input[]`. Если kei-proxy не принимает data URL — загрузить через `POST /api/upload` (см. fenta-tapla `lib/kei-ai/upload.ts`).

Попробовать сначала `image_input: ["data:image/jpeg;base64,..."]` — если работает, отдельная загрузка не нужна.

## Тестирование

```bash
# Dev-mode
KEI_PROXY_URL=https://n1leads.tapla.az PROXY_SECRET=... npm run dev

# Через админку
open http://localhost:3000/admin/tovar-ai
# Загрузить фото → "3 kart şəkli yarat"
# Должно работать: прокси создаёт задачу, поллит, возвращает картинки
```

## Файлы для изменения

| Файл | Действие |
|---|---|
| `src/lib/tovar-ai/types.ts` | Добавить KEI_PROXY_URL, PROXY_SECRET в TOVAR_AI_CONFIG |
| `src/lib/tovar-ai/stage3-generate-kei.ts` | **Новый** — генерация через kei-proxy |
| `src/lib/tovar-ai/pipeline.ts` | Переключить import generateAllCards на kei-версию |
| `src/app/api/tovar-ai/regenerate-card/route.ts` | Переключить на kei-версию generateSingleCard |
| `.env.local` | Добавить KEI_PROXY_URL, PROXY_SECRET |

## Если что-то пойдёт не так

Kei Proxy (сервер на Mac) — проверить:
```bash
curl https://n1leads.tapla.az/health          # должен вернуть {"status":"ok"}
curl https://n1leads.tapla.az/api/prices       # список цен моделей
pm2 logs kei-proxy                              # логи прокси
```

Откат — заменить `stage3-generate-kei` обратно на `stage3-generate` в pipeline.ts.
