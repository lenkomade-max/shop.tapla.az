export interface ProductData {
  id: string
  slug: string
  title: string
  description: string | null
  price: number
  oldPrice: number | null
  category: string | null
  images: string[]
}

export type SectionName =
  | 'hero'
  | 'benefits'
  | 'ingredients'
  | 'howToUse'
  | 'beforeAfter'
  | 'testimonials'
  | 'faq'
  | 'offer'
  | 'checkout'

export interface SectionConfig {
  name: SectionName
  title?: string
  subtitle?: string
  props?: Record<string, unknown>
}

export interface LandingConfig {
  productSlug: string
  sections: SectionConfig[]
}

export type ThemeName = 'rose' | 'luxuryGold' | 'medical' | 'minimal' | 'organic' | 'beautyPremium'

export interface ThemeColors {
  primary: string
  primaryHover: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  card: string
  cardForeground: string
}

export interface ThemeConfig {
  name: ThemeName
  label: string
  colors: ThemeColors
  fonts: {
    heading: string
    body: string
  }
  borderRadius: string
}
