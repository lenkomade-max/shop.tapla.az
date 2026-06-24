import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getLocalLanding } from '@/landings/registry'
import { getTheme } from '@/landings/themes'
import { LandingRenderer } from '@/components/landings/landing-renderer'
import type { ThemeConfig, SectionConfig, ThemeName } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { getAllLocalLandingSlugs } = await import('@/landings/registry')
  return getAllLocalLandingSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const landing = getLocalLanding(slug)
  if (!landing) return {}

  return {
    title: landing.title,
    description: landing.subtitle ?? undefined,
    openGraph: {
      title: landing.title,
      description: landing.subtitle ?? undefined,
    },
  }
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params
  const landing = getLocalLanding(slug)
  if (!landing) notFound()

  const theme = getTheme((landing.theme as ThemeName) || 'rose')

  const landingData = {
    id: '',
    slug: landing.slug,
    title: landing.title,
    subtitle: landing.subtitle,
    theme: landing.theme,
    sections: landing.sections as unknown[],
    config: {},
    product: null,
    images: [],
  }

  return <LandingRenderer landing={landingData} theme={theme} />
}
