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

// --- Aluna v2 types ---

export interface Media {
  url: string;
  alt: string;
  type: 'image' | 'video';
}

export interface Shade {
  name: string;
  colorHex: string;
  isHot?: boolean;
  label?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  category: string;
  benefits: string[];
  howToUse: string;
  ingredients?: string;
  tags?: string[];
  shades?: Shade[];
  isNew?: boolean;
  tryOnEnabled?: boolean;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  location?: string;
  ageRange?: string;
  skinType?: string;
  skinTone?: string;
  verifiedBuyer: boolean;
  images?: string[];
  likes: number;
  dislikes: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stepNumber?: number;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
  isBadge?: boolean;
  badgeText?: string;
}
