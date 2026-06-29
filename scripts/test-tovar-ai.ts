#!/usr/bin/env npx tsx
// ============================================================================
// Tovar.AI — тестовый CLI скрипт
// Запуск: npx tsx scripts/test-tovar-ai.ts <путь-к-фото> [описание]
// ============================================================================

import * as path from 'node:path'
import * as fs from 'node:fs'

// Загружаем .env.local вручную
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found at', envPath)
    process.exit(1)
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}
loadEnv()

// Динамически импортируем pipeline (после загрузки env)
async function main() {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    console.log('Использование: npx tsx scripts/test-tovar-ai.ts <путь-к-фото> [описание] [--template=auto|default|benefit_solution]')
    console.log('Пример: npx tsx scripts/test-tovar-ai.ts ./test-photo.jpg "Профессиональный фен 2000W"')
    console.log('Пример: npx tsx scripts/test-tovar-ai.ts ./test-photo.jpg "Вентилятор" --template=benefit_solution')
    process.exit(1)
  }

  const photoPath = args[0]
  const description = args[1] && !args[1].startsWith('--') ? args[1] : undefined

  // Парсим --template=... из любого аргумента
  const templateArg = args.find(a => a.startsWith('--template='))
  const template = templateArg
    ? templateArg.split('=')[1] as 'auto' | 'default' | 'benefit_solution'
    : undefined

  if (!fs.existsSync(photoPath)) {
    console.error('❌ Файл не найден:', photoPath)
    process.exit(1)
  }

  console.log('📸 Загрузка фото:', photoPath)
  const photoBuffer = fs.readFileSync(photoPath)
  const photoBase64 = photoBuffer.toString('base64')
  console.log(`   Размер: ${(photoBuffer.length / 1024).toFixed(1)} KB`)

  // Импортируем pipeline
  const { runTovarAIPipeline, TOVAR_AI_CONFIG } = await import(
    '../src/lib/tovar-ai/index.js'
  )

  if (!TOVAR_AI_CONFIG.API_KEY) {
    console.error('❌ OPENROUTER_API_KEY не задан в .env.local')
    console.error('   Добавь: OPENROUTER_API_KEY=sk-or-v1-...')
    process.exit(1)
  }

  console.log('\n🚀 Запуск пайплайна...')
  console.log(`   Vision: ${TOVAR_AI_CONFIG.VISION_MODEL}`)
  console.log(`   Planner: ${TOVAR_AI_CONFIG.PLANNER_MODEL}`)
  console.log(`   Image: ${TOVAR_AI_CONFIG.IMAGE_MODEL}`)
  console.log(`   QA: ${TOVAR_AI_CONFIG.QA_MODEL}`)
  console.log(`   Template: ${template || 'auto'}`)
  console.log(`   Разрешение: ${TOVAR_AI_CONFIG.IMAGE_SIZE}\n`)

  const startTime = Date.now()

  const result = await runTovarAIPipeline(
    {
      photoUrl: `file://${photoPath}`,
      photoBase64,
      providerDescription: description,
      template,
    },
    {
      onStageChange(stage, message) {
        const icons: Record<string, string> = {
          analyzing: '🔍',
          planning: '📝',
          generating: '🎨',
          checking: '✅',
          done: '🏁',
          failed: '❌',
        }
        console.log(`   ${icons[stage] || '•'} [${stage}] ${message}`)
      },
    },
  )

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log(`\n⏱️  Время: ${elapsed}s`)
  console.log(`💰 Примерная стоимость: $${result.cost.toFixed(4)}`)

  if (result.status === 'failed') {
    console.error('\n❌ Пайплайн завершился с ошибкой')
    console.error('   Частичный результат сохранён ниже')
  }

  // Сохраняем результат
  const outDir = path.join(__dirname, '..', '.tovar-ai-output')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  // Сохраняем analysis
  const analysisPath = path.join(outDir, 'product_analysis.json')
  fs.writeFileSync(analysisPath, JSON.stringify(result.product_analysis, null, 2), 'utf-8')
  console.log(`\n📄 Vision анализ: ${analysisPath}`)

  // Сохраняем prompts
  const promptsPath = path.join(outDir, 'prompts.json')
  fs.writeFileSync(promptsPath, JSON.stringify(result.prompts, null, 2), 'utf-8')
  console.log(`📄 Промпты: ${promptsPath}`)

  // Сохраняем карточки
  for (const card of result.cards) {
    const cardPath = path.join(outDir, `card_${card.index}_${card.role}.png`)
    const buffer = Buffer.from(card.imageBase64, 'base64')
    fs.writeFileSync(cardPath, buffer)
    console.log(`🖼️  Карточка ${card.index} (${card.role}): ${cardPath} (${(buffer.length / 1024).toFixed(1)} KB, попытка ${card.attempt})`)
  }

  // Сохраняем QA
  const qaPath = path.join(outDir, 'qa_results.json')
  fs.writeFileSync(qaPath, JSON.stringify(result.qa_results, null, 2), 'utf-8')
  console.log(`📄 QA проверка: ${qaPath}`)

  console.log(`\n✅ Готово! Файлы в: ${outDir}`)
  console.log(`   Открой: open ${outDir}`)
}

main().catch(err => {
  console.error('💥 Критическая ошибка:', err)
  process.exit(1)
})
