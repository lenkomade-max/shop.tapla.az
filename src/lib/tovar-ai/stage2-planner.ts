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

const ROLE_TRIADS: RoleTriad[] = [
  {
    name: 'product',
    logic: 'Main hero shot → Real usage scene → Extreme detail close-up. Product tells its story.',
    roles: ['hero', 'usage', 'close_up'],
  },
  {
    name: 'quality',
    logic: 'Premium hero → Craftsmanship & quality → Materials & texture. Premium feel.',
    roles: ['hero', 'quality', 'materials'],
  },
  {
    name: 'story',
    logic: 'Problem context → Product as solution → Aspirational lifestyle result.',
    roles: ['problem', 'solution', 'lifestyle'],
  },
  {
    name: 'trust',
    logic: 'Hero product → Comparison vs alternative → Social proof review. Trust-building.',
    roles: ['hero', 'comparison', 'review'],
  },
  {
    name: 'features',
    logic: 'Product hero → Feature benefits → Power & performance. Spec-driven.',
    roles: ['hero', 'benefits', 'power'],
  },
  {
    name: 'promo',
    logic: 'Special offer → Complete bundle → Strong CTA. Sales activation.',
    roles: ['offer', 'bundle', 'cta'],
  },
  {
    name: 'premium',
    logic: 'Luxury positioning → Lifestyle context → Gift presentation. Aspirational.',
    roles: ['premium', 'lifestyle', 'gift'],
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

const ROLE_COMMERCIAL_DENSITY: Record<CardRole, { blocks: string; instruction: string }> = {
  hero:         { blocks: '1-2', instruction: '1-2 big impact blocks. Large headline. Product is the main story. Clean and focused.' },
  problem:      { blocks: '1-2', instruction: '1-2 blocks. The problem visualization is the main communication. Minimal text — the image tells the story.' },
  solution:     { blocks: '2-3', instruction: '2-3 blocks. Show the transformation. The product + result are the message. Supporting info minimal.' },
  benefits:     { blocks: '4-6', instruction: '4-6 information blocks arranged around the product. High density. Multiple feature cards with thin connection lines. Information-rich.' },
  usage:        { blocks: '1-3', instruction: '1-3 blocks integrated naturally into the scene. The human interaction is the message. Cards appear contextual, not dominant.' },
  lifestyle:    { blocks: '1-2', instruction: '1-2 subtle blocks. The aspirational environment is the message. Cards minimal and elegant. Magazine quality.' },
  offer:        { blocks: '2-3', instruction: '2-3 prominent blocks. One clear action-driving message. Promotional. Urgency feeling.' },
  bundle:       { blocks: '3-5', instruction: '3-5 blocks showing all included items. Each accessory/component labeled. Completeness is the message.' },
  delivery:     { blocks: '1-2', instruction: '1-2 blocks. Delivery speed is the hero message. Product remains focus. Clean and direct.' },
  comparison:   { blocks: '2-4', instruction: '2-4 blocks. Comparison data presented cleanly. This vs That. Trust-building through transparency.' },
  quality:      { blocks: '2-3', instruction: '2-3 small subtle blocks. The product detail is the hero. Craftsmanship labels minimal and elegant.' },
  materials:    { blocks: '2-3', instruction: '2-3 material callout labels. The texture is the message. Subtle material tags near highlighted areas.' },
  warranty:     { blocks: '1-2', instruction: '1-2 trust badges. Warranty seal prominent. Professional confidence. Clean.' },
  accessories:  { blocks: '3-5', instruction: '3-5 blocks. Each accessory labeled. Perfect alignment. Complete set presentation.' },
  close_up:     { blocks: '0-1', instruction: '0-1 small label. The macro detail is the entire message. Extreme close-up speaks for itself.' },
  cta:          { blocks: '1-2', instruction: '1-2 blocks. Large CTA is the hero. Minimal supporting info. Designed for conversion.' },
  dimensions:   { blocks: '1-2', instruction: '1-2 blocks. Size reference + key dimension. Clean. The scale comparison is the message.' },
  power:        { blocks: '3-5', instruction: '3-5 spec blocks. Performance metrics prominent. Energy and speed visualized. Technology-inspired density.' },
  premium:      { blocks: '1-2', instruction: '1-2 elegant blocks. Luxury feel. Less is more — but what is there must be premium. High-end brand aesthetic.' },
  review:       { blocks: '2-3', instruction: '2-3 blocks. Review stars + testimonial snippet. Social proof is the message. Trust-building.' },
  gift:         { blocks: '1-3', instruction: '1-3 blocks. Gift-ready presentation. Premium packaging visible. Occasion feeling.' },
  new_arrival:  { blocks: '2-3', instruction: '2-3 blocks. "New" badge + key innovation. Fresh and cutting-edge message.' },
  best_seller:  { blocks: '2-3', instruction: '2-3 blocks. Popularity badge + key selling points. Social proof through sales volume.' },
}

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

const BASE_PROMPT = `Generate one photorealistic marketplace advertisement image for a paid Meta Ads / Trendyol campaign. Not a catalog photo, not a minimal poster — a conversion-optimized commercial advertisement.

## ⛔ CRITICAL PROHIBITIONS — IMAGE WILL BE REJECTED IF VIOLATED

LANGUAGE: ALL visible text MUST be in Azerbaijani Latin script only. NEVER English. NEVER Russian. NEVER Cyrillic. If you cannot write Azerbaijani correctly, use NO text.

NO COLOR CODES: NEVER render hex color codes (#XXXXXX) as visible text or design elements. They are metadata — invisible.

NO INVENTED DATA: NEVER invent prices, discounts, percentages, or specifications not explicitly stated. No price → no price shown. No discount → no discount shown.

NO REFERENCE COPYING: NEVER copy logos, brand names, shop names, price stickers, barcodes, watermarks, or packaging text from the reference photo. Create an entirely new scene.

ONE IMAGE ONLY: Never collages, split panels, or before/after. One image = one advertising message.

## PRODUCT DOMINANCE
The product dominates the frame (60-70% area). It is the undisputed hero. Never make the product small or secondary. Do not change the product shape. Do not invent new product parts.

## MARKETPLACE FEEL
The image must feel like a paid commercial offer — like what a customer would see on Trendyol, Amazon, or a high-performing Meta ad. Not an art poster. Not an Apple keynote. The viewer should immediately recognize this as an advertisement from a marketplace where they can buy the product.

## COLORS (words only — DO NOT use hex codes visually)
Use the campaign color palette for all elements. Vibrant commercial backgrounds, bold gradients, high contrast. Avoid pale minimalist palettes.

## DEPTH & LAYERS
Multi-layered: foreground (product + information cards), midground (decorative elements), background (gradient/surface). Soft shadows, reflections, gradient lighting. Commercial visual depth — never flat.

## CAMPAIGN COHERENCE
This is one of 3 images in a single campaign. All 3 share the exact same color palette, lighting, mood, and visual DNA. But this card has a DISTINCT composition, product angle, and layout from the other 2.

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

## CORE PRINCIPLE: COMMERCIAL COMMUNICATION ≠ MINIMALISM
You are designing marketplace advertisements, not art posters. The objective is maximum commercial communication. The viewer has 2 seconds to understand the offer. Every major empty area should either contain useful selling information or visually support the product. The images should look like something a customer sees on Trendyol, Amazon, or a high-performing Meta ad — not an Apple keynote, not a luxury editorial.

## CAMPAIGN BRIEF — DO THIS FIRST
Before designing individual cards, establish the CAMPAIGN-LEVEL shared identity:

1. **Color Palette** — You are assigned a color palette. USE IT for all 3 cards.
   Apply these colors to backgrounds, gradients, cards, text, accents, decorative elements.
   The palette creates instant brand recognition across all 3 images.

2. **Visual Theme** — You are assigned ONE lighting + ONE background style + ONE mood.
   ALL 3 cards use this same visual theme. This is the campaign's atmosphere.

3. **Design Language** — Define how cards, shadows, typography will look.
   Same rounded corner style, same shadow type, same font feel across all 3 cards.

## THEN DESIGN 3 DISTINCT CARDS
Within the shared campaign identity, design 3 cards that are COMPOSITIONALLY DIFFERENT:

- **Card 1**: The assigned role. Different product angle from cards 2 and 3.
- **Card 2**: The assigned role. Different layout from cards 1 and 3.
- **Card 3**: The assigned role. Different supporting elements from cards 1 and 2.

### How to make cards DISTINCT (while sharing visual DNA):
- Use DIFFERENT product positions (center vs 45° vs macro vs in-hand vs top-down)
- Use DIFFERENT layouts (A through H, features_row)
- Use DIFFERENT commercial block arrangements
- Use DIFFERENT focal points
- BUT always with the SAME color palette, SAME lighting, SAME mood

## CARD ROLE → COMMERCIAL DENSITY (CRITICAL — makes cards different)
Each role has its own commercial density. Do NOT apply the same density to all cards:

- **Hero / Premium**: 1-2 big impact blocks. Large headline. Product is the main story. Clean and focused — less is more.
- **Benefits / Features / Power / Specifications**: 4-6 information blocks. High density. Multiple feature cards arranged around/connected to the product. Information-rich — the viewer scans multiple value props.
- **Quality / Materials / Close-up / Dimensions**: 2-3 small subtle blocks. The product detail is the hero. Supporting info minimal and elegant.
- **Usage / Lifestyle / Problem / Solution**: 1-3 blocks integrated into the scene. Environment or human model carries the story. Cards appear naturally in context.
- **Offer / CTA / Delivery / Warranty / Gift**: 2-3 prominent blocks. One clear action-driving message. Promotional feel.
- **Review / Comparison / Best-seller / New-arrival**: 2-4 blocks. Social proof or comparison data. Trust-building density.
- **Bundle / Accessories / Gift**: 3-5 blocks showing included items. Completeness is the message.

## COMMERCIAL BLOCK EXAMPLES
Selling points to use (pick based on role + provider data):
- Product features: "3 SÜRƏT REJİMİ", "GÜCLÜ HAVA AXINI", "USB ŞARJ"
- Quality: "PREMIUM MATERİAL", "ORİJİNAL KEYFİYYƏT"
- Delivery: "PULSUZ ÇATDIRILMA", "1 GÜNƏ ÇATDIRILIR"
- Warranty: "2 İL ZƏMANƏT", "14 GÜN GERİ QAYTARMA"
- Price (ONLY IF given in product data): "29 AZN" (never invent)
- CTA: "İNDİ AL", "SƏBƏTƏ AT"

## CARD-PRODUCT CONNECTION
Information cards should visually INTERACT with the product — use thin connection lines from product features to their cards, or arrange cards flowing naturally around the product. Cards should not float disconnected in empty space. The product and information blocks form one integrated commercial composition.

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
    '## Product Price (ONLY if explicitly provided — show on price-related cards)',
    priceAz || 'NO PRICE — do NOT invent or display any price, discount, or cost figure on any card',
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

  // Сборка финального промпта: [BASE] + [CAMPAIGN IDENTITY] + [Card-specific] + [LLM content]
  for (const card of parsed.cards) {
    const cardCs = card.creative_style
      ? creativeStyles.find(s => s.id === card.creative_style) || cs[card.index - 1]
      : cs[card.index - 1]
    const cardMs = card.marketing_style
      ? marketingStyles.find(m => m.id === card.marketing_style) || ms[card.index - 1]
      : ms[card.index - 1]

    const hasProviderPrice = Boolean(priceAz)

    const densityInfo = ROLE_COMMERCIAL_DENSITY[card.role as CardRole] || { blocks: '2-3', instruction: '2-3 commercial information blocks.' }

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
      `COMMERCIAL DENSITY for this role: ${densityInfo.instruction} Use ${densityInfo.blocks} commercial blocks. Cards must visually connect to the product.`,
      hasProviderPrice ? `PRODUCT PRICE: ${priceAz}. Display this price on price-related cards (offer, bundle, hero, cta). Use it in commercial blocks.` : '⛔ NO PRICE: Do NOT invent or display any price, discount, or cost figure on any card.',
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
