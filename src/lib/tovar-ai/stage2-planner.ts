// ============================================================================
// Stage 2: Creative Director + Campaign Planner
// Brand Identity Lock — все 3 карточки = единая рекламная кампания
// 3-слойная система + 8 триад ролей + общий Visual Theme + color palette
// ============================================================================

import * as fs from 'node:fs'
import * as path from 'node:path'
import { TOVAR_AI_CONFIG, type VisionOutput, type PromptsOutput, type CardRole, type VisualTheme } from './types'

// ─── ТИПЫ ДЛЯ БИБЛИОТЕК ─────────────────────────────────────────────────────

interface CreativeStyle {
  id: string; name: string; description: string
  prompt_fragment: string; use_for: string[]
  needs_model: boolean; needs_environment: boolean
}

interface MarketingStyle {
  id: string; name: string; description: string
  tone: string; best_for: string[]; prompt_fragment: string
}

interface VisualThemeItem {
  id: string; name: string; description: string; prompt_fragment: string
}

interface MaterialItem { id: string; name: string; description: string; prompt_fragment: string; best_for: string[] }
interface SpatialDepthItem { id: string; name: string; description: string; prompt_fragment: string }
interface MotionItem { id: string; name: string; description: string; prompt_fragment: string }
interface CategoryMatch {
  lighting: string[]; background_style: string[]; mood: string[]
  materials: string[]; spatial_depth: string[]; motion: string[]; atmosphere: string
}

interface VisualThemeCatalog {
  description: string; rule: string
  lighting: VisualThemeItem[]
  background_style: VisualThemeItem[]
  mood: VisualThemeItem[]
  materials: MaterialItem[]
  spatial_depth: SpatialDepthItem[]
  motion: MotionItem[]
  category_matching: Record<string, CategoryMatch>
}

// ─── КОМПЛЕМЕНТАРНЫЕ ТРИАДЫ РОЛЕЙ ──────────────────────────────────────────

interface RoleTriad {
  name: string
  logic: string
  roles: [CardRole, CardRole, CardRole]
}

// Card 1 ВСЕГДА 'hero' — главный промо-шот. Card 2-3 = комплементарные роли.
const ROLE_TRIADS: RoleTriad[] = [
  {
    name: 'product',
    logic: 'Card 1 HERO: stunning first impression. Card 2: real usage scene. Card 3: extreme macro detail. Product tells its story from three angles.',
    roles: ['hero', 'usage', 'close_up'],
  },
  {
    name: 'quality',
    logic: 'Card 1 HERO: premium showcase. Card 2: craftsmanship & quality. Card 3: materials & texture celebration. Premium feel across all.',
    roles: ['hero', 'quality', 'materials'],
  },
  {
    name: 'features',
    logic: 'Card 1 HERO: product dominant. Card 2: feature benefits cards. Card 3: power & performance specs. Spec-driven campaign.',
    roles: ['hero', 'benefits', 'power'],
  },
  {
    name: 'trust',
    logic: 'Card 1 HERO: trust-building main shot. Card 2: comparison vs alternative. Card 3: social proof review. Trust-building through transparency.',
    roles: ['hero', 'comparison', 'review'],
  },
  {
    name: 'premium',
    logic: 'Card 1 HERO: luxury positioning. Card 2: aspirational lifestyle context. Card 3: gift-ready presentation. Premium aspirational campaign.',
    roles: ['hero', 'lifestyle', 'gift'],
  },
  {
    name: 'offer',
    logic: 'Card 1 HERO: product as irresistible offer. Card 2: complete bundle/all included. Card 3: strong CTA conversion. Sales activation campaign.',
    roles: ['hero', 'bundle', 'cta'],
  },
  {
    name: 'problem_solution',
    logic: 'Card 1 HERO: the product as answer. Card 2: problem visualization (before). Card 3: aspirational result (after). Problem-solution story.',
    roles: ['hero', 'problem', 'solution'],
  },
]

// ─── ЦВЕТОВЫЕ ПАЛИТРЫ (по premium_level) ────────────────────────────────────

const COLOR_PALETTES: Record<string, Array<{ name: string; colors: string[]; atmosphere: string; best_for: string[] }>> = {
  luxury: [
    { name: 'Dark Gold', colors: ['#0D0D0D', '#D4AF37', '#1A1A2E', '#FFFFFF', '#C9A84C'], atmosphere: 'Rich black with warm gold accents. Timeless luxury. Heritage and exclusivity.', best_for: ['luxury', 'premium accessories', 'jewelry', 'watches'] },
    { name: 'Midnight Sapphire', colors: ['#0A0E27', '#3B82F6', '#1E1B4B', '#F8FAFC', '#6366F1'], atmosphere: 'Deep midnight blue with electric sapphire glow. Modern royalty. Confident and sophisticated.', best_for: ['premium electronics', 'luxury beauty', 'high-end tech'] },
    { name: 'Emerald Prestige', colors: ['#022C22', '#10B981', '#064E3B', '#F0FDF4', '#34D399'], atmosphere: 'Deep emerald green with fresh mint highlights. Natural luxury. Organic premium.', best_for: ['luxury beauty', 'premium kitchen', 'wellness'] },
    { name: 'Platinum', colors: ['#18181B', '#E4E4E7', '#27272A', '#FAFAFA', '#A1A1AA'], atmosphere: 'Monochromatic platinum and zinc. Understated extreme luxury. Quiet confidence.', best_for: ['premium electronics', 'luxury accessories', 'modern design'] },
  ],
  premium: [
    { name: 'Electric Blue', colors: ['#0F172A', '#3B82F6', '#1E293B', '#FFFFFF', '#60A5FA'], atmosphere: 'Dark slate with electric blue energy. Bold and modern. Technology-forward.', best_for: ['electronics', 'technology', 'gaming', 'sports'] },
    { name: 'Crimson Bold', colors: ['#1C0000', '#DC2626', '#450A0A', '#FEF2F2', '#F87171'], atmosphere: 'Deep crimson with vivid red impact. Powerful and passionate. Demands attention.', best_for: ['sports', 'automotive', 'premium beauty', 'gaming'] },
    { name: 'Violet Impact', colors: ['#1E1B4B', '#8B5CF6', '#2E1065', '#F5F3FF', '#A78BFA'], atmosphere: 'Royal purple with soft violet glow. Creative premium. Imaginative and distinctive.', best_for: ['beauty', 'cosmetics', 'creative tools', 'lifestyle'] },
    { name: 'Teal Modern', colors: ['#042F2E', '#14B8A6', '#134E4A', '#F0FDFA', '#5EEAD4'], atmosphere: 'Deep teal with bright aqua freshness. Modern sophistication. Clean and refreshing.', best_for: ['kitchen', 'home', 'wellness', 'beauty'] },
  ],
  mid: [
    { name: 'Orange Fresh', colors: ['#1C1917', '#F97316', '#431407', '#FFF7ED', '#FB923C'], atmosphere: 'Warm dark base with vibrant orange energy. Friendly and accessible. Energetic value.', best_for: ['kitchen', 'home', 'sports', 'outdoor'] },
    { name: 'Sky Blue', colors: ['#0C1929', '#0EA5E9', '#1E3A5F', '#F0F9FF', '#38BDF8'], atmosphere: 'Deep navy with bright sky blue. Trustworthy and clean. Open and inviting.', best_for: ['electronics', 'office', 'home', 'kids'] },
    { name: 'Green Natural', colors: ['#052E16', '#22C55E', '#14532D', '#F0FDF4', '#4ADE80'], atmosphere: 'Forest green with fresh natural green. Organic and healthy. Earth-connected.', best_for: ['kitchen', 'home', 'sports', 'outdoor', 'wellness'] },
  ],
  budget: [
    { name: 'Clean Blue', colors: ['#1E293B', '#2563EB', '#1E40AF', '#EFF6FF', '#60A5FA'], atmosphere: 'Solid dark blue with clean bright blue. Dependable and straightforward. Great value.', best_for: ['electronics', 'office', 'home', 'general'] },
    { name: 'Warm Red', colors: ['#292524', '#EA580C', '#9A3412', '#FFF7ED', '#FB923C'], atmosphere: 'Warm dark with energetic orange-red. Attention-grabbing value. Bold and direct.', best_for: ['kitchen', 'home', 'sports', 'general'] },
  ],
}

// ─── РОЛЬ → CREATIVE STYLES ─────────────────────────────────────────────────

const ROLE_CREATIVE_STYLES: Record<CardRole, string[]> = {
  hero:         ['cs01', 'cs12', 'cs25', 'cs37', 'cs27'],
  problem:      ['cs09'],
  solution:     ['cs09', 'cs01'],
  benefits:     ['cs04', 'cs05', 'cs22'],
  usage:        ['cs06', 'cs07'],
  lifestyle:    ['cs08', 'cs11', 'cs29', 'cs34'],
  offer:        ['cs02', 'cs15', 'cs23'],
  bundle:       ['cs13', 'cs30'],
  delivery:     ['cs03'],
  comparison:   ['cs17'],
  quality:      ['cs10', 'cs18', 'cs28'],
  materials:    ['cs18', 'cs10'],
  warranty:     ['cs04', 'cs22', 'cs01'],
  accessories:  ['cs13', 'cs30'],
  close_up:     ['cs10', 'cs16'],
  cta:          ['cs23', 'cs01'],
  dimensions:   ['cs06', 'cs34'],
  power:        ['cs19', 'cs20', 'cs32'],
  premium:      ['cs37', 'cs27', 'cs12', 'cs28'],
  review:       ['cs40', 'cs11'],
  gift:         ['cs31', 'cs24'],
  new_arrival:  ['cs07', 'cs19', 'cs01'],
  best_seller:  ['cs14', 'cs01', 'cs12'],
}

// ─── РОЛЬ → MARKETING STYLES ────────────────────────────────────────────────

const ROLE_MARKETING_STYLES: Record<CardRole, string[]> = {
  hero:         ['ms27', 'ms04', 'ms06'],
  problem:      ['ms21'],
  solution:     ['ms21', 'ms22'],
  benefits:     ['ms03', 'ms04', 'ms05'],
  usage:        ['ms09', 'ms20', 'ms11'],
  lifestyle:    ['ms20', 'ms11'],
  offer:        ['ms02', 'ms29', 'ms30'],
  bundle:       ['ms05', 'ms28'],
  delivery:     ['ms08'],
  comparison:   ['ms03', 'ms15'],
  quality:      ['ms04', 'ms14'],
  materials:    ['ms04', 'ms14'],
  warranty:     ['ms18', 'ms26'],
  accessories:  ['ms05'],
  close_up:     ['ms03', 'ms04'],
  cta:          ['ms30', 'ms29'],
  dimensions:   ['ms12', 'ms09'],
  power:        ['ms15', 'ms16', 'ms17'],
  premium:      ['ms27', 'ms04'],
  review:       ['ms06', 'ms26'],
  gift:         ['ms23', 'ms24'],
  new_arrival:  ['ms07', 'ms16'],
  best_seller:  ['ms06', 'ms29'],
}

// ─── РОЛЬ → VISUAL THEME (дефолт, будет переопределён общим кампанией) ─────

// Роли задают только lighting/background_style/mood. Материалы/глубина/движение — из категории.
const ROLE_VISUAL_THEMES: Record<CardRole, Pick<VisualTheme, 'lighting' | 'background_style' | 'mood'>> = {
  hero:         { lighting: 'soft_studio', background_style: 'premium_gradient', mood: 'minimal_luxury' },
  problem:      { lighting: 'dark_moody', background_style: 'environmental', mood: 'industrial_premium' },
  solution:     { lighting: 'golden_hour', background_style: 'environmental', mood: 'warm_cozy' },
  benefits:     { lighting: 'softbox_diffused', background_style: 'dark_studio', mood: 'tech_innovation' },
  usage:        { lighting: 'natural_daylight', background_style: 'environmental', mood: 'warm_cozy' },
  lifestyle:    { lighting: 'golden_hour', background_style: 'environmental', mood: 'editorial_vogue' },
  offer:        { lighting: 'high_contrast', background_style: 'premium_gradient', mood: 'dynamic_action' },
  bundle:       { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  delivery:     { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  comparison:   { lighting: 'softbox_diffused', background_style: 'pure_white', mood: 'clean_clinical' },
  quality:      { lighting: 'dramatic_spotlight', background_style: 'dark_studio', mood: 'classic_luxury' },
  materials:    { lighting: 'dramatic_spotlight', background_style: 'marble_surface', mood: 'classic_luxury' },
  warranty:     { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  accessories:  { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  close_up:     { lighting: 'rim_light', background_style: 'dark_studio', mood: 'modern_sleek' },
  cta:          { lighting: 'high_contrast', background_style: 'premium_gradient', mood: 'dynamic_action' },
  dimensions:   { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  power:        { lighting: 'dramatic_spotlight', background_style: 'abstract_tech', mood: 'tech_innovation' },
  premium:      { lighting: 'soft_studio', background_style: 'premium_gradient', mood: 'minimal_luxury' },
  review:       { lighting: 'natural_daylight', background_style: 'editorial_backdrop', mood: 'editorial_vogue' },
  gift:         { lighting: 'golden_hour', background_style: 'editorial_backdrop', mood: 'warm_cozy' },
  new_arrival:  { lighting: 'rim_light', background_style: 'abstract_tech', mood: 'tech_innovation' },
  best_seller:  { lighting: 'soft_studio', background_style: 'premium_gradient', mood: 'minimal_luxury' },
}

// ─── ОПИСАНИЯ РОЛЕЙ ─────────────────────────────────────────────────────────

const ROLE_DESCRIPTIONS: Record<CardRole, string> = {
  hero: 'Stunning first impression. Scroll-stopper. Magazine quality. Product dominant with headline.',
  problem: 'Show a common problem visually. The product is the answer. Creates recognition.',
  solution: 'The product as the immediate solution. Visible transformation or benefit.',
  benefits: 'Product centered with feature/benefit cards arranged around it. Icons and thin connection lines.',
  usage: 'Real person naturally using the product. Authentic interaction. Shows real-world application.',
  lifestyle: 'Beautiful aspirational environment. No people or subtle human presence. Magazine quality.',
  offer: 'Promotion card prominent. Discount emphasis. Urgency. Limited-time feeling.',
  bundle: 'Show everything included. All accessories visible. Complete package presentation.',
  delivery: 'Fast delivery message prominent. Product remains focus. Shipping iconography.',
  comparison: 'Product compared against standard alternative. Clean visual comparison showing superiority.',
  quality: 'Focus on materials and craftsmanship. Premium macro details. Luxury texture visible.',
  materials: 'Extreme focus on materials: metal, glass, leather, wood. Craftsmanship celebration.',
  warranty: 'Trust and reliability message. Warranty badge prominent. Professional confidence.',
  accessories: 'All included accessories displayed. Perfect alignment. Complete set presentation.',
  close_up: 'Extreme macro detail of key feature. Texture, materials, premium reflections. Very shallow depth of field.',
  cta: 'Large clear Call To Action. Minimal supporting text. Hero product. Designed for conversion.',
  dimensions: 'Show actual size and scale. Product in hand or with size reference. Portability emphasis.',
  power: 'Performance focus. Energy, speed, efficiency. Technology-inspired. Dynamic lighting.',
  premium: 'Luxury positioning. Minimal but vibrant. High-end brand aesthetic. Very expensive feeling.',
  review: 'Testimonial feeling. Trust and social proof. Magazine editorial quality with review stars.',
  gift: 'Gift-ready presentation. Premium packaging visible. Holiday or special occasion feeling.',
  new_arrival: 'Fresh and cutting-edge. Latest technology. Modern and innovative. Just launched feeling.',
  best_seller: 'Popular choice. Bestseller badge. Social proof through popularity. Most purchased.',
}

// ─── РОЛЬ → КОММЕРЧЕСКАЯ ПЛОТНОСТЬ ──────────────────────────────────────────
// Минимум 3-6 блоков на ЛЮБОЙ карточке. Нет пустых зон. Вся площадь работает.
// Разница между ролями — ЧТО в блоках, а не СКОЛЬКО блоков.

const ROLE_COMMERCIAL_DENSITY: Record<CardRole, { blocks: string; instruction: string }> = {
  hero:         { blocks: '4-6', instruction: '4-6 blocks: headline + 3-5 feature/value cards + CTA. Product dominant but surrounded by selling points. Information-rich hero — not a minimal poster.' },
  problem:      { blocks: '3-5', instruction: '3-5 blocks: problem headline + 2-3 pain-point cards + solution hint + CTA. The problem visualization dominates, but cards explain why it matters.' },
  solution:     { blocks: '4-6', instruction: '4-6 blocks: transformation headline + 3-5 result/benefit cards + CTA. The product as hero solver, surrounded by proof cards.' },
  benefits:     { blocks: '5-8', instruction: '5-8 information blocks arranged around the product. Maximum density. Multiple feature cards with thin connection lines. Every feature gets a card. This is the most information-dense card.' },
  usage:        { blocks: '3-5', instruction: '3-5 blocks integrated into the environment. The human interaction is the main visual, but commercial cards (features, delivery, warranty, CTA) are visible and readable.' },
  lifestyle:    { blocks: '3-5', instruction: '3-5 blocks. Aspirational environment + multiple lifestyle benefit cards. Magazine quality BUT with commercial density. Beautiful AND informative.' },
  offer:        { blocks: '4-6', instruction: '4-6 blocks: promo headline + price/discount cards + 2-3 benefit cards + urgency element + CTA. Aggressive promotional density.' },
  bundle:       { blocks: '4-7', instruction: '4-7 blocks: each included item labeled + value summary + price (if given) + CTA. Complete package communication.' },
  delivery:     { blocks: '3-5', instruction: '3-5 blocks: delivery headline + speed badge + coverage map hint + 1-2 trust elements + CTA. Fast delivery is the hero but supported by density.' },
  comparison:   { blocks: '4-6', instruction: '4-6 blocks: vs headline + 3-5 comparison data points + verdict card + CTA. This vs That presented with full information density.' },
  quality:      { blocks: '4-6', instruction: '4-6 blocks: craftsmanship headline + material/quality callout cards arranged near highlighted product areas + certification badge + CTA.' },
  materials:    { blocks: '4-6', instruction: '4-6 material callout cards. Each material highlighted with a label near the corresponding product area. Texture is the hero but information is dense.' },
  warranty:     { blocks: '3-5', instruction: '3-5 blocks: warranty headline + coverage details + trust badges + support info + CTA. Trust density.' },
  accessories:  { blocks: '4-7', instruction: '4-7 blocks: each accessory labeled + usage hints + value cards. Complete set information.' },
  close_up:     { blocks: '3-5', instruction: '3-5 blocks: macro detail headline + 2-4 feature callouts pointing to specific areas of the extreme close-up + CTA. The detail is the hero but blocks explain it.' },
  cta:          { blocks: '3-5', instruction: '3-5 blocks: CTA headline + 2-3 urgency/reason cards + action button. Conversion-focused density. Every element supports the action.' },
  dimensions:   { blocks: '3-5', instruction: '3-5 blocks: size headline + dimension specs + comparison object + portability/placement cards + CTA. Scale communicated with density.' },
  power:        { blocks: '5-8', instruction: '5-8 spec blocks. Performance metrics everywhere. Speed, power, efficiency — each gets a card. Technology-inspired maximum density.' },
  premium:      { blocks: '3-5', instruction: '3-5 blocks: premium headline + 2-4 luxury feature cards + exclusivity badge + CTA. Less than benefits but still substantially informative. High-end density, not empty minimalism.' },
  review:       { blocks: '4-6', instruction: '4-6 blocks: review headline + star rating + 2-3 testimonial snippets + trust badges + CTA. Social proof density.' },
  gift:         { blocks: '3-5', instruction: '3-5 blocks: gift headline + occasion badges + 2-3 product highlights + packaging showcase + CTA. Gift-ready communication.' },
  new_arrival:  { blocks: '4-6', instruction: '4-6 blocks: NEW badge + innovation headline + 2-4 feature cards + availability + CTA. Fresh and information-dense.' },
  best_seller:  { blocks: '4-6', instruction: '4-6 blocks: bestseller badge + popularity headline + 2-4 selling points + social proof + CTA. Popularity communicated through density.' },
}

// ─── КОМПОЗИЦИОННАЯ ВАРИАТИВНОСТЬ ──────────────────────────────────────────
// Каждая карточка получает СЛУЧАЙНЫЙ композиционный приём из этого списка.
// Это гарантирует что 3 карточки выглядят как работа РАЗНЫХ дизайнеров.

interface CompositionVariation {
  id: string; name: string; description: string; prompt_fragment: string
}

const COMPOSITION_VARIATIONS: CompositionVariation[] = [
  {
    id: 'asymmetric_left',
    name: 'Асимметрия влево',
    description: 'Продукт смещён вправо, все карточки и текст — слева. Динамичный дисбаланс.',
    prompt_fragment: 'Asymmetric composition: product positioned in the right 60% of the frame. All information cards, headline, and CTA occupy the left 40%. Strong visual imbalance creates energy and interest. Editorial magazine quality.',
  },
  {
    id: 'asymmetric_right',
    name: 'Асимметрия вправо',
    description: 'Продукт смещён влево, все карточки и текст — справа.',
    prompt_fragment: 'Asymmetric composition: product positioned in the left 60% of the frame. All information cards, headline, and CTA occupy the right 40%. The imbalance draws the eye across the image dynamically.',
  },
  {
    id: 'diagonal_flow',
    name: 'Диагональный поток',
    description: 'Продукт в центре, карточки по диагонали сверху-слева вниз-вправо.',
    prompt_fragment: 'Diagonal composition: product centered. Information cards arranged along a strong diagonal line from top-left to bottom-right. The diagonal creates natural eye movement. Headline top-left, product center, cards flowing down-right to CTA.',
  },
  {
    id: 'diagonal_reverse',
    name: 'Обратная диагональ',
    description: 'Продукт в центре, карточки по диагонали сверху-справа вниз-влево.',
    prompt_fragment: 'Reverse diagonal composition: product centered. Cards flow from top-right to bottom-left. Headline top-right, product center, feature cards cascading down-left to CTA bottom-left. Unexpected and fresh.',
  },
  {
    id: 'product_oversized',
    name: 'Гигантский продукт',
    description: 'Продукт занимает 80% кадра. Карточки наложены поверх продукта в углах и по краям.',
    prompt_fragment: 'Oversized product composition: product occupies 80% of the frame — truly massive. Information cards are smaller and overlaid at the edges and corners, partially overlapping the product. The product IS the background. Bold aggressive e-commerce style.',
  },
  {
    id: 'grid_cards',
    name: 'Сетка карточек',
    description: 'Продукт сверху, снизу сетка 2×2 или 3×2 из коммерческих карточек.',
    prompt_fragment: 'Grid composition: product in the upper 40%. Below it, a clean grid of 4-6 rounded commercial cards (2×2 or 3×2). Each card contains one selling point with icon. Organized, scannable, information-dense. Marketplace grid style.',
  },
  {
    id: 'vertical_stack',
    name: 'Вертикальный стек',
    description: 'Всё выстроено вертикально: заголовок → продукт → карточки одна под другой → CTA.',
    prompt_fragment: 'Vertical stack composition: everything flows top-to-bottom. Headline at very top, large product center, 3-5 cards stacked vertically below with clear separation, CTA at bottom. Mobile-optimized vertical reading pattern. Instagram Story aesthetic adapted to square.',
  },
  {
    id: 'product_left_strip',
    name: 'Левая полоса',
    description: 'Продукт в узкой вертикальной полосе слева. Вся правая часть — карточки.',
    prompt_fragment: 'Left-strip composition: product in a narrow vertical column on the left (30% width). The remaining 70% on the right contains stacked headline, feature cards, price, and CTA. Product is the anchor, information is the content. Marketplace sidebar style.',
  },
  {
    id: 'floating_chaos',
    name: 'Управляемый хаос',
    description: 'Продукт в центре, карточки разных размеров хаотично разбросаны по кадру, но сбалансированы.',
    prompt_fragment: 'Controlled chaos composition: product centered. Information cards of varying sizes scattered seemingly randomly around the product — some large, some small, some overlapping decorative elements. The scattering feels energetic and alive but is visually balanced. Modern dynamic e-commerce style.',
  },
  {
    id: 'top_heavy',
    name: 'Тяжёлый верх',
    description: 'Крупный заголовок и 2-3 карточки сверху, продукт снизу занимает нижнюю половину.',
    prompt_fragment: 'Top-heavy composition: large headline and 2-3 prominent cards occupying the top 50% of the frame. Product in the bottom 50%. CTA integrated near the product. The commercial message hits first, then the product confirms the promise. Reverse hierarchy.',
  },
  {
    id: 'framed_product',
    name: 'Продукт в рамке',
    description: 'Карточки образуют визуальную рамку вокруг продукта по периметру.',
    prompt_fragment: 'Framed composition: 4-6 information cards arranged around the edges of the frame creating a visual border. Product sits in the center opening — framed and emphasized by the surrounding commercial cards. Cards form an incomplete rectangle/ring. Gallery-wall commercial style.',
  },
  {
    id: 'exploded_technical',
    name: 'Технический взрыв',
    description: 'Продукт в центре, от него расходятся линии к карточкам как техническая схема.',
    prompt_fragment: 'Exploded technical composition: product centered with thin glowing connection lines radiating outward to 4-6 specification cards. Like an engineering diagram but premium and commercial. Each line connects a product feature to its explanatory card. Technical authority style.',
  },
]

// ─── ЗАГРУЗКА БИБЛИОТЕК ─────────────────────────────────────────────────────

const TOLER_AI_DIR = path.join(process.cwd(), 'src/lib/tovar-ai')
const DESIGN_DIR = path.join(TOLER_AI_DIR, 'design')

function loadCreativeStyles(): CreativeStyle[] {
  const raw = fs.readFileSync(path.join(DESIGN_DIR, 'creative-styles.json'), 'utf-8')
  return (JSON.parse(raw) as { styles: CreativeStyle[] }).styles
}

function loadMarketingStyles(): MarketingStyle[] {
  const raw = fs.readFileSync(path.join(DESIGN_DIR, 'marketing-styles.json'), 'utf-8')
  return (JSON.parse(raw) as { styles: MarketingStyle[] }).styles
}

function loadVisualThemes(): VisualThemeCatalog {
  const raw = fs.readFileSync(path.join(DESIGN_DIR, 'visual-themes.json'), 'utf-8')
  return JSON.parse(raw) as VisualThemeCatalog
}

function loadDesignLibrary(name: string): string {
  return fs.readFileSync(path.join(DESIGN_DIR, name), 'utf-8')
}

// ─── BASE PROMPT — рекламный + Brand Identity Lock ──────────────────────────
// Порядок по приоритетам Nano Banana: ЗАПРЕТЫ (94% compliance) → КОММЕРЦИЯ → ПРОДУКТ → ЦВЕТ → СТИЛЬ

const BASE_PROMPT = `Generate one aggressive e-commerce advertisement for Meta Ads / Trendyol. NOT a poster. NOT a catalog photo. NOT a minimal editorial.

## ⛔ CRITICAL PROHIBITIONS

LANGUAGE: ALL visible text MUST be in Azerbaijani Latin script only. NEVER English. NEVER Russian. NEVER Cyrillic.

NO COLOR CODES: NEVER render hex codes (#XXXXXX) as visible elements. They are metadata — invisible.

NO INVENTED DATA: Never invent prices, discounts, percentages, "free delivery", warranty terms, or specs not explicitly stated. Fast delivery ("SÜRƏTLİ ÇATDIRILMA") is allowed as a generic marketplace claim. But NEVER "pulsuz" (free) unless stated.

NO REFERENCE COPYING: Never copy logos, brand names, shop names, price stickers, barcodes, watermarks, or packaging text from reference photo.

ONE IMAGE ONLY: Never collages, split panels, or before/after.

## ADVERTISING SCENARIO FIRST — THEN LAYOUT

Your process must be: advertising scenario → layout → visual design.

NOT: "here is a product, here is text, arrange nicely."

Ask yourself: "What advertising scenario best sells THIS product in THIS role right now?"

Only after the scenario is clear, build the layout. Then apply visual polish.

## AGGRESSIVE E-COMMERCE STYLE — NO EMPTY ZONES

This is a paid advertisement. Every pixel must work. No dead space. No "breathing room" minimalism. Fill the frame with commercial content: headline, product, feature cards, price cards, delivery badges, warranty seals, CTA buttons, decorative elements that support the offer. 6-10 visible information elements per image. The viewer scans and understands the full offer in 2 seconds.

## PRODUCT DOMINANCE
Product dominates (60-70% area). The undisputed hero. Never small. Never secondary. Never change product shape.

## COLORS
Use campaign palette. Vibrant backgrounds, bold gradients, high contrast. Never pale minimal.

## DEPTH
Multi-layered: foreground (product + cards), midground (decorative), background (gradient/surface). Soft shadows, reflections, gradient lighting. Never flat.

## DIFFERENT COMPOSITION FROM OTHER CARDS
This is one of 3 campaign images. Same colors/lighting/mood. DIFFERENT composition, product position, layout. Each card = different designer's work.

## QUALITY
Photorealistic. Studio quality. Ultra realistic. 8K. Category-appropriate environment.`

// ─── SYSTEM PROMPT — Creative Director с Campaign Brief ──────────────────────

// ─── SYSTEM PROMPT — Creative Director с Campaign Brief ──────────────────────

const SYSTEM_PROMPT = `You are a Creative Director for TAPLA MARKETPLACE (Azerbaijan). You design 3-image advertising CAMPAIGNS — not isolated images, but a cohesive set that shares visual DNA.

## YOUR GOAL
Maximize click-through rate (CTR). Create a CAMPAIGN of 3 images that:
- Share ONE visual identity (colors, lighting, mood, design language)
- Each have a DISTINCT composition, product angle, and message
- Together tell a complete product story

## THE PROCESS: SCENARIO → LAYOUT → DESIGN

CRITICAL — follow this order for EVERY card. Never skip. Never reverse.

### Step 1: ADVERTISING SCENARIO
"What advertising scenario best sells THIS product in THIS role right now?"
The scenario determines what the card communicates — not the visual treatment.

### Step 2: COMPOSITION / LAYOUT
Each card is assigned a specific composition. Execute it FAITHFULLY — do not default to "product centered + 2 cards below." The composition is the skeleton. Different cards = different skeletons.

### Step 3: VISUAL DESIGN
Apply color palette, lighting, mood, materials, effects to the already-built layout. Design serves the scenario — not the other way around.

## ⛔ BANNED PATTERNS
- "Headline top → product center → 2 cards below" — BANNED. Each card must use a DIFFERENT composition.
- 70% empty gradient with small product and one line of text — BANNED. Fill the frame.
- All 3 cards sharing the same composition template — BANNED. Radically different layouts each time.
- Posters — BANNED. Generate advertisements. A poster says "look at this." An ad says "BUY this, here is why, here is how."

## AGGRESSIVE E-COMMERCE STYLE
Meta Ads compete with thousands of other ads in the feed. Your images must:
- Contain 6-10 visible commercial elements (headline, price if given, features ×3-6, delivery, warranty, CTA)
- Have ZERO dead zones — every area contains information or supporting design
- Prominent, readable text — this is an advertisement, text drives conversion
- Asymmetric, dynamic, varied compositions
- Information cards that feel INTEGRATED with the product, not floating glass decorations on an empty poster

## CAMPAIGN BRIEF — DO THIS FIRST
Before designing individual cards, establish the CAMPAIGN-LEVEL shared identity:

1. **Color Palette** — You are assigned a color palette. USE IT for all 3 cards.
2. **Visual Theme** — You are assigned ONE lighting + ONE background style + ONE mood. ALL 3 cards use this same visual theme.
3. **Design Language** — Same rounded corner style, same shadow type, same font feel across all 3 cards.

## THEN DESIGN 3 DISTINCT CARDS — RADICALLY DIFFERENT COMPOSITIONS
Within the shared campaign identity, design 3 cards that look like 3 DIFFERENT DESIGNERS each created one ad:

- **Card 1**: The assigned role. Different product angle from cards 2 and 3.
- **Card 2**: The assigned role. Different layout from cards 1 and 3.
- **Card 3**: The assigned role. Different supporting elements from cards 1 and 2.

### How to make cards DISTINCT (while sharing visual DNA):
- Use DIFFERENT product positions (center vs 45° vs macro vs in-hand vs top-down)
- Use DIFFERENT layouts (A through H, features_row)
- Use DIFFERENT commercial block arrangements
- Use DIFFERENT focal points
- BUT always with the SAME color palette, SAME lighting, SAME mood

## CARD ROLE → COMMERCIAL DENSITY
Every role gets 3-8 commercial blocks. MINIMUM: 3 blocks per card. Cards with fewer are REJECTED.
The difference between roles is WHAT the blocks contain, not whether they exist:

- Benefits / Power: 5-8 blocks — feature cards with connection lines. Maximum spec density.
- Hero / Premium / Quality / Materials: 4-6 blocks — headline + feature cards + quality badges + CTA.
- Offer / CTA / Delivery: 4-6 blocks — promo headline + price/delivery cards + urgency + CTA.
- Usage / Lifestyle: 3-5 blocks — environment + integrated feature cards.
- Bundle / Accessories: 4-7 blocks — each item labeled.
- Comparison / Review / Best-seller / New-arrival: 4-6 blocks — data/social proof density.
- Problem / Solution / Gift / Warranty / Close-up / Dimensions: 3-5 blocks — role-specific communication.

## COMMERCIAL BLOCK TYPES
Pick based on role + product data (MUST fill the frame). ONLY use blocks that are supported by provider data:
- Features (from provider description or product type): "3 SÜRƏT REJİMİ", "GÜCLÜ HAVA AXINI", "USB ŞARJ"
- Quality: "PREMIUM MATERİAL", "ORİJİNAL KEYFİYYƏT", "YÜNGÜL DİZAYN"
- Delivery: "SÜRƏTLİ ÇATDIRILMA" (generic marketplace — allowed). NEVER "pulsuz" unless stated.
- Warranty: ONLY if explicitly mentioned in provider description. Never invent "zəmanət".
- Price: ONLY if explicitly provided (never invent!)
- CTA: "İNDİ AL", "SƏBƏTƏ AT"
- Badges: "YENİ", "BESTSELLER", "PREMIUM"

## CARD-PRODUCT CONNECTION
Cards and product must form one integrated composition. Use thin connection lines from product features to cards. Cards flow around the product — not floating isolated in empty space. The product and information blocks work together as one commercial unit.

## COMPOSITIONAL VARIATION (per card)
Do NOT default to center symmetry. Vary aggressively across the 3 cards:
- Product position: center / left / right / top / bottom / corner
- Product size: 60% / 70% / 80% / 85% of frame
- Headline placement: top-left / top-center / top-right / overlaid on product
- Card arrangement: grid / diagonal / stack / ring around product / scattered / sidebar
- CTA placement: bottom-right / bottom-center / overlaid / side panel
- Composition direction: top→bottom / left→right / diagonal / radial from center

Each card must feel like a DIFFERENT DESIGNER created it.

## 3-LAYER SYSTEM

### Layer 1 — Creative Style (WHAT is in the frame)
You are ASSIGNED one creative style per card — execute it faithfully.

### Layer 2 — Marketing Style (WHAT message we communicate)
Pick ONE per card from the Marketing Style Library.
The marketing style should fit the card's role.

### Layer 3 — Visual Theme (HOW it looks)
SHARED across all 3 cards — do NOT change per card.

## COLOR PALETTE RULES
- Studio/product-only cards: build entire composition from the assigned color palette.
- Environmental/model cards: palette colors go on GRAPHIC ELEMENTS ONLY (cards, badges, buttons, text containers). Walls, furniture, skin, nature stay natural and realistic — not palette-tinted.

## TEXT RULES
- ALL visible text: AZERBAIJANI LATIN SCRIPT ONLY. NEVER English. NEVER Russian. NEVER Cyrillic.
- Short: 3-5 words per headline. Examples: "LED TERAPİYA", "3 REJİM", "PULSUZ ÇATDIRILMA"
- Text goes inside rounded commercial blocks/cards — never floating without container
- If the product has a REAL price provided, display it. If no price is given, do NOT invent one.

## OUTPUT FORMAT
Return JSON with campaign-level settings + 3 cards:

{
  "campaign": {
    "color_palette_name": "Electric Blue",
    "design_language": "Dark premium with blue accents, glass-morphism cards, soft box shadows"
  },
  "cards": [
    {
      "index": 1,
      "role": "...",
      "creative_style": "...",
      "marketing_style": "...",
      "layout": "...",
      "product_position": "...",
      "background": "...",
      "visual_effects": [...],
      "creative_director_passed": true,
      "prompt_en": "...",
      "text_overlay_az": [...],
      "commercial_blocks": [...],
      "needs_model": false,
      "distinct_from_other_cards": "How this card differs compositionally from cards 2 and 3"
    },
    ... (cards 2, 3)
  ]
}

Each prompt_en must describe a commercial advertisement, not a catalog photo.
Respond ONLY with the JSON.`

// ─── USER PROMPT — CAMPAIGN-LEVEL ───────────────────────────────────────────

function buildUserPrompt(
  triad: RoleTriad,
  cs: CreativeStyle[],
  colorPalette: { name: string; colors: string[]; atmosphere?: string },
  sharedVt: VisualTheme,
  analysis: VisionOutput,
  providerDescription?: string,
  characteristics?: Record<string, string>,
  priceAz?: string,
): string {
  const CREATIVE_STYLES = loadCreativeStyles()
  const MARKETING_STYLES = loadMarketingStyles()
  const VISUAL_THEMES = loadVisualThemes()

  // Category atmosphere — из category_matching
  const categoryMatch = VISUAL_THEMES.category_matching?.[analysis.category]
  const categoryAtmosphere = categoryMatch?.atmosphere || ''

  const DESIGN = {
    layouts: loadDesignLibrary('layouts.json'),
    positions: loadDesignLibrary('positions.json'),
    backgrounds: loadDesignLibrary('backgrounds.json'),
    visual_effects: loadDesignLibrary('visual-effects.json'),
    composition_rules: loadDesignLibrary('composition-rules.json'),
    marketplace_rules: loadDesignLibrary('marketplace-rules.json'),
    creative_director: loadDesignLibrary('creative-director.json'),
  }

  return [
    'Create a 3-image advertising CAMPAIGN for this product. All 3 cards must share ONE visual identity.',
    '',
    '## CAMPAIGN STRATEGY',
    `Triad: "${triad.name}" — ${triad.logic}`,
    '',
    '## CATEGORY ARTISTIC DIRECTION',
    `Product category: ${analysis.category}`,
    categoryAtmosphere ? `Atmosphere: ${categoryAtmosphere}` : '',
    'Use this artistic direction to guide ALL visual decisions — materials, lighting mood, spatial depth, and motion must feel coherent with this category.',
    '',
    '## SHARED CAMPAIGN IDENTITY (applies to ALL 3 cards)',
    '',
    '### Color Palette (campaign-wide)',
    `Name: ${colorPalette.name}`,
    `Colors: ${JSON.stringify(colorPalette.colors)}`,
    colorPalette.atmosphere ? `Palette Atmosphere: ${colorPalette.atmosphere}` : '',
    '',
    '### Shared Visual Theme',
    `Lighting: ${sharedVt.lighting}`,
    `Background Style: ${sharedVt.background_style}`,
    `Mood: ${sharedVt.mood}`,
    `Scene Materials (use for backdrop/surfaces): ${sharedVt.materials.join(', ')}`,
    `Spatial Depth (create layers with): ${sharedVt.spatial_depth.join(', ')}`,
    `Motion Energy: ${sharedVt.motion}`,
    'ALL 3 cards share this exact visual theme — same lighting, mood, materials, depth, and motion energy.',
    '',
    '## CARD ROLES (do NOT change)',
    `Card 1 — Role: "${triad.roles[0]}" → ${ROLE_DESCRIPTIONS[triad.roles[0]]}`,
    `Card 2 — Role: "${triad.roles[1]}" → ${ROLE_DESCRIPTIONS[triad.roles[1]]}`,
    `Card 3 — Role: "${triad.roles[2]}" → ${ROLE_DESCRIPTIONS[triad.roles[2]]}`,
    '',
    '### CRITICAL: Make cards COMPOSITIONALLY DISTINCT',
    'Card 1, 2, and 3 must have DIFFERENT: product positions, layouts, focal points, and commercial block arrangements.',
    'They share colors/lighting/mood but NOT composition.',
    '',
    '## LAYER 1 — Creative Style Library (40 styles)',
    JSON.stringify(CREATIVE_STYLES, null, 2),
    '',
    '## LAYER 2 — Marketing Style Library (30 styles)',
    JSON.stringify(MARKETING_STYLES, null, 2),
    '',
    '## LAYER 3 — Visual Theme Library (for reference)',
    JSON.stringify(VISUAL_THEMES, null, 2),
    '',
    '## SCENE MATERIALS (use these for backdrop construction, pedestals, surfaces)',
    JSON.stringify(VISUAL_THEMES.materials, null, 2),
    '',
    '## SPATIAL DEPTH TECHNIQUES (how to create multi-layer depth in the image)',
    JSON.stringify(VISUAL_THEMES.spatial_depth, null, 2),
    '',
    '## MOTION & DYNAMIC ENERGY (how to add movement around the static product)',
    JSON.stringify(VISUAL_THEMES.motion, null, 2),
    '',
    '## SUPPORTING DESIGN LIBRARIES',
    '',
    '### Layouts (pick DIFFERENT ones per card)',
    DESIGN.layouts,
    '',
    '### Product Positions (pick DIFFERENT ones per card)',
    DESIGN.positions,
    '',
    '### Backgrounds',
    DESIGN.backgrounds,
    '',
    '### Visual Effects',
    DESIGN.visual_effects,
    '',
    '### Composition Rules (MUST follow)',
    DESIGN.composition_rules,
    '',
    '### Marketplace Rules (MUST follow)',
    DESIGN.marketplace_rules,
    '',
    '### Creative Director Self-Review (MUST pass all 6)',
    DESIGN.creative_director,
    '',
    '## CREATIVE STYLES ASSIGNED (do NOT change)',
    `Card 1: ${cs[0].id} — ${cs[0].name} — ${cs[0].prompt_fragment}`,
    `Card 2: ${cs[1].id} — ${cs[1].name} — ${cs[1].prompt_fragment}`,
    `Card 3: ${cs[2].id} — ${cs[2].name} — ${cs[2].prompt_fragment}`,
    '',
    '## Product Analysis',
    JSON.stringify(analysis, null, 2),
    '',
    '## Provider Description',
    providerDescription || 'Not provided',
    '',
    '## Product Price (ONLY if explicitly provided)',
    priceAz || 'NO PRICE — do NOT invent any price',
    '',
    '## Delivery & Warranty Rules',
    'Fast delivery ("SÜRƏTLİ ÇATDIRILMA") is a generic marketplace claim — allowed.',
    'NEVER claim "pulsuz çatdırılma" or "free delivery" unless provider says so.',
    'Warranty: ONLY if provider description mentions warranty. Never invent "zəmanət".',
    '',
    '## Characteristics',
    (characteristics && Object.keys(characteristics).length > 0 ? JSON.stringify(characteristics) : 'None'),
    '',
    'Return JSON with campaign-level settings + 3 cards:',
    '{',
    '  "campaign": {',
    `    "color_palette_name": "${colorPalette.name}",`,
    '    "design_language": "Describe the shared design language for all 3 cards"',
    '  },',
    '  "cards": [',
    `    {`,
    `      "index": 1,`,
    `      "role": "${triad.roles[0]}",`,
    `      "creative_style": "${cs[0].id}",`,
    `      "marketing_style": "ms04",`,
    `      "layout": "...",`,
    `      "product_position": "...",`,
    `      "background": "...",`,
    `      "visual_effects": [...],`,
    `      "creative_director_passed": true,`,
    `      "prompt_en": "<300 words. Full advertising scene. Use color palette ${colorPalette.name}. Different composition from cards 2 and 3.>",`,
    `      "text_overlay_az": ["HEADLINE AZ"],`,
    `      "commercial_blocks": ["feature card", "delivery badge"],`,
    `      "needs_model": ${String(cs[0].needs_model)},`,
    `      "distinct_from_other_cards": "How this card differs from cards 2 and 3"`,
    `    },`,
    `    {`,
    `      "index": 2,`,
    `      "role": "${triad.roles[1]}",`,
    `      "creative_style": "${cs[1].id}",`,
    `      "marketing_style": "ms20",`,
    `      "layout": "...",`,
    `      "product_position": "...",`,
    `      "background": "...",`,
    `      "visual_effects": [...],`,
    `      "creative_director_passed": true,`,
    `      "prompt_en": "<300 words. Full advertising scene. Use color palette ${colorPalette.name}. Different composition from cards 1 and 3.>",`,
    `      "text_overlay_az": [],`,
    `      "commercial_blocks": [],`,
    `      "needs_model": ${String(cs[1].needs_model)},`,
    `      "distinct_from_other_cards": "How this card differs from cards 1 and 3"`,
    `    },`,
    `    {`,
    `      "index": 3,`,
    `      "role": "${triad.roles[2]}",`,
    `      "creative_style": "${cs[2].id}",`,
    `      "marketing_style": "ms03",`,
    `      "layout": "...",`,
    `      "product_position": "...",`,
    `      "background": "...",`,
    `      "visual_effects": [...],`,
    `      "creative_director_passed": true,`,
    `      "prompt_en": "<300 words. Full advertising scene. Use color palette ${colorPalette.name}. Different composition from cards 1 and 2.>",`,
    `      "text_overlay_az": ["FEATURE AZ"],`,
    `      "commercial_blocks": ["feature cards"],`,
    `      "needs_model": ${String(cs[2].needs_model)},`,
    `      "distinct_from_other_cards": "How this card differs from cards 1 and 2"`,
    `    }`,
    '  ]',
    '}',
    '',
    'RULES:',
    '- All 3 cards MUST share the same color palette, lighting, background_style, and mood.',
    '- Cards must have DIFFERENT product positions, layouts, and focal points.',
    '- text_overlay_az: AZERBAIJANI LATIN ONLY. Empty array [] if no text.',
    '- Every card must have creative_director_passed = true.',
    '- One image = one advertising message.',
    '- The images must look like a cohesive paid Meta Ads / Trendyol campaign.',
    '',
    'Respond ONLY with the JSON.',
  ].join('\n')
}

// ─── ВЫБОР ТРИАДЫ ───────────────────────────────────────────────────────────

function selectTriad(vision: VisionOutput): RoleTriad {
  // Фильтруем триады, требующие модель, если товар без неё
  const availableTriads = ROLE_TRIADS.filter(triad => {
    const hasUsageRole = triad.roles.some(r => r === 'usage')
    if (!vision.needs_human_model && hasUsageRole) {
      // usage-триады всё ещё доступны — просто будет использован другой creative style
    }
    return true
  })

  return availableTriads[Math.floor(Math.random() * availableTriads.length)]
}

// ─── ВЫБОР ЦВЕТОВОЙ ПАЛИТРЫ ─────────────────────────────────────────────────

function selectColorPalette(premiumLevel: string, category?: string): { name: string; colors: string[]; atmosphere: string } {
  const palettes = COLOR_PALETTES[premiumLevel] || COLOR_PALETTES.mid

  // Пробуем подобрать палитру под категорию товара
  if (category) {
    const matching = palettes.filter(p =>
      p.best_for.some(c => category.toLowerCase().includes(c.toLowerCase()))
    )
    if (matching.length > 0) {
      return matching[Math.floor(Math.random() * matching.length)]
    }
  }

  return palettes[Math.floor(Math.random() * palettes.length)]
}

// ─── PICK FUNCTIONS ─────────────────────────────────────────────────────────

function pickCreativeStyleForRole(
  role: CardRole,
  vision: VisionOutput,
  styles: CreativeStyle[],
  excludeId?: string, // чтобы не повторять стиль между карточками
): CreativeStyle {
  const preferredIds = ROLE_CREATIVE_STYLES[role] || ['cs01']
  const candidates = preferredIds
    .map(id => styles.find(s => s.id === id))
    .filter(Boolean) as CreativeStyle[]

  const filtered = candidates.filter(s => {
    if (excludeId && s.id === excludeId) return false
    if (!vision.needs_human_model && s.needs_model) return false
    if (!vision.needs_lifestyle_scene && s.needs_environment) return false
    return true
  })

  const pool = filtered.length > 0 ? filtered : candidates
  return pool[0] || styles[0]
}

function pickMarketingStyleForRole(
  role: CardRole,
  _vision: VisionOutput,
  styles: MarketingStyle[],
): MarketingStyle {
  const preferredIds = ROLE_MARKETING_STYLES[role] || ['ms04']
  for (const id of preferredIds) {
    const found = styles.find(s => s.id === id)
    if (found) return found
  }
  return styles[0]
}

function pickSharedVisualTheme(
  triad: RoleTriad,
  vision: VisionOutput,
  visualThemes: VisualThemeCatalog,
): VisualTheme {
  // Role-based defaults
  const anchorRole = triad.roles[0]
  const roleDefaults = ROLE_VISUAL_THEMES[anchorRole] || {
    lighting: 'soft_studio',
    background_style: 'premium_gradient',
    mood: 'minimal_luxury',
  }

  // Category matching
  const cm = visualThemes.category_matching?.[vision.category]

  // Lighting / background / mood: role default если есть в category списке, иначе random из category
  const lighting = cm && cm.lighting.includes(roleDefaults.lighting)
    ? roleDefaults.lighting
    : (cm ? cm.lighting[Math.floor(Math.random() * cm.lighting.length)] : roleDefaults.lighting)

  const background_style = cm && cm.background_style.includes(roleDefaults.background_style)
    ? roleDefaults.background_style
    : (cm ? cm.background_style[Math.floor(Math.random() * cm.background_style.length)] : roleDefaults.background_style)

  const mood = cm && cm.mood.includes(roleDefaults.mood)
    ? roleDefaults.mood
    : (cm ? cm.mood[Math.floor(Math.random() * cm.mood.length)] : roleDefaults.mood)

  // Materials (1-2), spatial depth (1-2), motion — из category matching
  const materials = cm?.materials?.slice(0, 2) || ['matte_glass', 'polished_aluminum']
  const spatial_depth = cm?.spatial_depth?.slice(0, 2) || ['acrylic_light_halos', 'volumetric_light']
  const motion = cm?.motion?.[Math.floor(Math.random() * (cm.motion.length || 1))] || 'still_precision'

  return { lighting, background_style, mood, materials, spatial_depth, motion }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export async function planCardPrompts(
  analysis: VisionOutput,
  providerDescription?: string,
  characteristics?: Record<string, string>,
  priceAz?: string,
): Promise<PromptsOutput> {
  const config = TOVAR_AI_CONFIG
  const creativeStyles = loadCreativeStyles()
  const marketingStyles = loadMarketingStyles()
  const visualThemes = loadVisualThemes()

  // 1. Выбор триады (комплементарные роли)
  const triad = selectTriad(analysis)

  // 2. Выбор ОБЩЕЙ цветовой палитры (одна на все карточки) — с учётом категории
  const colorPalette = selectColorPalette(analysis.premium_level, analysis.category)

  // 3. Выбор ОБЩЕГО Visual Theme (один на все карточки — Brand Identity Lock) — с учётом категории
  const sharedVt = pickSharedVisualTheme(triad, analysis, visualThemes)

  // 4. Creative Styles под роли (разные, не повторяются)
  const cs0 = pickCreativeStyleForRole(triad.roles[0], analysis, creativeStyles)
  const cs1 = pickCreativeStyleForRole(triad.roles[1], analysis, creativeStyles, cs0.id)
  const cs2 = pickCreativeStyleForRole(triad.roles[2], analysis, creativeStyles, cs0.id)
  const cs = [cs0, cs1, cs2]

  // 5. Marketing Styles под роли
  const ms = triad.roles.map(r => pickMarketingStyleForRole(r, analysis, marketingStyles))

  console.log(`[Stage 2] Campaign Triad: "${triad.name}" — ${triad.logic}`)
  console.log(`[Stage 2] Color Palette: "${colorPalette.name}" ${JSON.stringify(colorPalette.colors)} (${colorPalette.atmosphere})`)
  console.log(`[Stage 2] Shared Visual Theme: lighting=${sharedVt.lighting}, bg=${sharedVt.background_style}, mood=${sharedVt.mood}`)
  console.log(`[Stage 2] Scene: materials=${sharedVt.materials.join('+')}, depth=${sharedVt.spatial_depth.join('+')}, motion=${sharedVt.motion}`)
  console.log(`[Stage 2] Roles: ${triad.roles.join(', ')}`)
  console.log(`[Stage 2] Creative Styles: ${cs.map((s, i) => `${i + 1}=${s.id}`).join(', ')}`)

  const userPrompt = buildUserPrompt(triad, cs, colorPalette, sharedVt, analysis, providerDescription, characteristics, priceAz)

  const body = {
    model: config.PLANNER_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 8192,
  }

  const response = await fetch(`${config.OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Stage 2 Planner API error ${response.status}: ${errText.slice(0, 500)}`)
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content || ''
  const parsed = parseJSON<{
    campaign?: { color_palette_name: string; design_language: string }
    cards: Array<{
      index: number; role: string
      creative_style?: string; marketing_style?: string
      layout?: string; product_position?: string; background?: string
      visual_effects?: string[]; commercial_blocks?: string[]
      creative_director_passed?: boolean
      prompt_en: string; text_overlay_az: string[]; needs_model: boolean
      distinct_from_other_cards?: string
    }>
  }>(raw)

  if (!Array.isArray(parsed.cards) || parsed.cards.length < 3) {
    throw new Error(`Stage 2: Expected 3 cards, got ${parsed.cards?.length || 0}`)
  }

  const campaign = parsed.campaign

  // Set для исключения повторяющихся композиционных приёмов
  const usedCompositionIds = new Set<string>()

  // Сборка финального промпта: [BASE] + [CAMPAIGN IDENTITY] + [Card-specific] + [LLM content]
  for (const card of parsed.cards) {
    const cardCs = card.creative_style
      ? creativeStyles.find(s => s.id === card.creative_style) || cs[card.index - 1]
      : cs[card.index - 1]
    const cardMs = card.marketing_style
      ? marketingStyles.find(m => m.id === card.marketing_style) || ms[card.index - 1]
      : ms[card.index - 1]

    const hasProviderPrice = Boolean(priceAz)

    // Гарантия — только если явно указана в описании
    const desc = (providerDescription || '').toLowerCase()
    const hasWarranty = /zəmanət|гарант|warranty|garanti|zemanet/i.test(desc)

    const densityInfo = ROLE_COMMERCIAL_DENSITY[card.role as CardRole] || { blocks: '3-5', instruction: '3-5 commercial information blocks.' }

    // Случайный композиционный приём — исключаем уже использованные
    const availableVariations = COMPOSITION_VARIATIONS.filter(v => !usedCompositionIds.has(v.id))
    const variation = availableVariations.length > 0
      ? availableVariations[Math.floor(Math.random() * availableVariations.length)]
      : COMPOSITION_VARIATIONS[Math.floor(Math.random() * COMPOSITION_VARIATIONS.length)]
    usedCompositionIds.add(variation.id)

    const lightingItem = visualThemes.lighting.find(l => l.id === sharedVt.lighting)
    const bgItem = visualThemes.background_style.find(b => b.id === sharedVt.background_style)
    const moodItem = visualThemes.mood.find(m => m.id === sharedVt.mood)

    // Для карточек с окружением или моделью — палитра мягче (естественные цвета среды важнее)
    const isEnvironmentalCard = cardCs.needs_environment || card.needs_model
    const colorInstruction = isEnvironmentalCard
      ? [
          `CAMPAIGN COLORS: ${colorPalette.name} — ${colorPalette.atmosphere}`,
          `Use these colors for cards, badges, text overlays, and accent elements.`,
          `Keep the environment/background colors natural and realistic — do NOT force palette colors onto walls, furniture, skin tones, or natural surroundings.`,
          `The environment should look like a real professional photo, with palette colors appearing only in designed graphic elements (cards, badges, CTA buttons, text containers).`,
          campaign?.design_language ? `Design Language: ${campaign.design_language}.` : '',
        ].filter(Boolean).join(' ')
      : [
          `CAMPAIGN COLORS: ${colorPalette.name} — ${colorPalette.atmosphere}`,
          `Build the entire composition from this palette: backgrounds, gradients, cards, text, accents.`,
          campaign?.design_language ? `Design Language: ${campaign.design_language}.` : '',
        ].filter(Boolean).join(' ')

    const commercialBlocks = Array.isArray(card.commercial_blocks) && card.commercial_blocks.length > 0
      ? `Commercial blocks: ${card.commercial_blocks.join(', ')}. Use premium rounded cards with soft shadows in the campaign color palette.`
      : ''

    const distinctNote = card.distinct_from_other_cards
      ? `This card differs from others in the campaign: ${card.distinct_from_other_cards}.`
      : ''

    const materialsItem = visualThemes.materials.find(m => m.id === sharedVt.materials[0])
    const depthItem = visualThemes.spatial_depth.find(d => d.id === sharedVt.spatial_depth[0])
    const motionItem = visualThemes.motion.find(m => m.id === sharedVt.motion)

    const designDecisions = [
      colorInstruction,
      `CAMPAIGN SHARED IDENTITY — Lighting: ${lightingItem?.prompt_fragment || sharedVt.lighting}.`,
      `CAMPAIGN SHARED IDENTITY — Background: ${bgItem?.prompt_fragment || sharedVt.background_style}.`,
      `CAMPAIGN SHARED IDENTITY — Mood: ${moodItem?.prompt_fragment || sharedVt.mood}.`,
      `Scene Materials: ${materialsItem?.prompt_fragment || sharedVt.materials.join(', ')}.`,
      `Spatial Depth: ${depthItem?.prompt_fragment || sharedVt.spatial_depth.join(', ')}.`,
      `Motion Energy: ${motionItem?.prompt_fragment || sharedVt.motion}.`,
      `COMPOSITION VARIATION: ${variation.name} — ${variation.prompt_fragment}`,
      `COMMERCIAL DENSITY for this role: ${densityInfo.instruction} Use ${densityInfo.blocks} commercial blocks. Fill the frame — no dead zones.`,
      hasProviderPrice ? `PRODUCT PRICE: ${priceAz}. Display this price on price-related cards (offer, bundle, hero, cta). Use it in commercial blocks.` : '⛔ NO PRICE: Do NOT invent or display any price on any card.',
      !hasWarranty ? '⛔ NO WARRANTY: Description does NOT mention warranty. Do NOT invent warranty terms ("2 il zəmanət", "14 gün geri qaytarma").' : `WARRANTY mentioned in description — can display.`,
      'Delivery: Generic fast delivery claim is OK ("SÜRƏTLİ ÇATDIRILMA"). NEVER claim "pulsuz" or "free" unless explicitly stated.',
      `ADVERTISING ROLE: ${card.role}. ${ROLE_DESCRIPTIONS[card.role as CardRole] || card.role}.`,
      `Creative Style: ${cardCs.name}. ${cardCs.prompt_fragment}`,
      `Marketing Style: ${cardMs.name}. ${cardMs.prompt_fragment}`,
      commercialBlocks,
      distinctNote,
      card.layout ? `Layout: ${card.layout}.` : '',
      card.product_position ? `Product position: ${card.product_position}.` : '',
      card.background ? `Environment: ${card.background}.` : '',
      Array.isArray(card.visual_effects) && card.visual_effects.length > 0
        ? `Visual effects: ${card.visual_effects.join(', ')}.` : '',
    ].filter(Boolean).join(' ')

    const textInstruction = card.text_overlay_az.length > 0
      ? `Azerbaijani Latin text to render inside rounded commercial blocks (MUST be Azerbaijani, NEVER English/Russian): ${card.text_overlay_az.join(' — ')}.`
      : ''

    card.prompt_en = [
      BASE_PROMPT,
      designDecisions,
      textInstruction,
      card.prompt_en,
    ].filter(Boolean).join(' ')
  }

  // Clean cards
  const cleanCards = parsed.cards.map(c => ({
    index: c.index,
    role: (c.role || triad.roles[c.index - 1]) as CardRole,
    prompt_en: c.prompt_en,
    text_overlay_az: c.text_overlay_az,
    needs_model: c.needs_model,
    composition: c.layout || 'center',
    reference_weight: c.role === 'hero' ? 0.7 : c.needs_model ? 0.5 : 0.7,
    creative_style: c.creative_style || cs[c.index - 1].id,
    marketing_style: c.marketing_style || ms[c.index - 1].id,
    visual_theme: sharedVt,                            // ОБЩИЙ на все
    color_palette: colorPalette.colors,                  // ОБЩАЯ на все
  }))

  return {
    style_name: cs.map(s => s.id).join('+'),
    roles: triad.roles,
    marketing_styles: ms.map(s => s.id),
    visual_theme: sharedVt,                              // один объект
    color_palette: colorPalette.colors,                   // один массив
    cards: cleanCards,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseJSON<T>(raw: string): T {
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned) as T
}
