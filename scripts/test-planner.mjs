import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function loadEnv() {
  const envPath = path.join(root, '.env.local')
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}
loadEnv()

const photoPath = process.argv[2]
const photoBase64 = fs.readFileSync(photoPath).toString('base64')
console.log('📸 Photo loaded:', (photoBase64.length / 1024).toFixed(1), 'KB base64')

// Style reference images (from R2)
const STYLE_REF_URLS = [
  'https://pub-3f6b01f6597249d089c3dbb6fb5a8a8b.r2.dev/tovar-ai/style-refs/Example_of_a_single_product1.webp',
  'https://pub-3f6b01f6597249d089c3dbb6fb5a8a8b.r2.dev/tovar-ai/style-refs/Example_of_a_single_product2.webp',
  'https://pub-3f6b01f6597249d089c3dbb6fb5a8a8b.r2.dev/tovar-ai/style-refs/Example_of_a_single_product3.webp',
  'https://pub-3f6b01f6597249d089c3dbb6fb5a8a8b.r2.dev/tovar-ai/style-refs/Example_of_a_single_product4.webp',
  'https://pub-3f6b01f6597249d089c3dbb6fb5a8a8b.r2.dev/tovar-ai/style-refs/Example_of_a_single_product5.webp',
  'https://pub-3f6b01f6597249d089c3dbb6fb5a8a8b.r2.dev/tovar-ai/style-refs/different%20styles1.png',
  'https://pub-3f6b01f6597249d089c3dbb6fb5a8a8b.r2.dev/tovar-ai/style-refs/different%20styles2.png',
  'https://pub-3f6b01f6597249d089c3dbb6fb5a8a8b.r2.dev/tovar-ai/style-refs/different%20styles3.png',
]
console.log('🎨 Style references:', STYLE_REF_URLS.length, 'images (from R2)')

const { analyzeProductImage } = await import('../src/lib/tovar-ai/stage1-vision.js')
const { planCardPromptsV2 } = await import('../src/lib/tovar-ai/stage2-planner-v2.js')

console.log('\n🔍 Stage 1: Vision Analysis...')
const vision = await analyzeProductImage(photoBase64)
console.log('Vision result:', JSON.stringify(vision, null, 2))

console.log('\n📝 Stage 2 V2: Planner...')
const prompts = await planCardPromptsV2(vision, 3, undefined, undefined, STYLE_REF_URLS)
console.log('\n========== PROMPTS OUTPUT ==========')
console.log(JSON.stringify(prompts, null, 2))
