import { lashSerumConfig } from './lash-serum/config'
import { collagenMaskConfig } from './collagen-mask/config'
import { essentialLashSerumConfig } from './essential-lash-serum/config'

const localLandings: Record<string, {
  slug: string
  title: string
  subtitle: string | null
  theme: string
  sections: unknown[]
}> = {
  'lash-serum': {
    slug: lashSerumConfig.slug,
    title: lashSerumConfig.title,
    subtitle: lashSerumConfig.subtitle,
    theme: lashSerumConfig.theme,
    sections: lashSerumConfig.sections,
  },
  'collagen-mask': {
    slug: collagenMaskConfig.slug,
    title: collagenMaskConfig.title,
    subtitle: collagenMaskConfig.subtitle,
    theme: collagenMaskConfig.theme,
    sections: collagenMaskConfig.sections,
  },
  'essential-lash-serum': {
    slug: essentialLashSerumConfig.slug,
    title: essentialLashSerumConfig.title,
    subtitle: essentialLashSerumConfig.subtitle,
    theme: essentialLashSerumConfig.theme,
    sections: essentialLashSerumConfig.sections,
  },
}

export function getLocalLanding(slug: string) {
  return localLandings[slug] ?? null
}

export function getAllLocalLandingSlugs() {
  return Object.keys(localLandings)
}
