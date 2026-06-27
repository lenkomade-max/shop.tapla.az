interface LandingEntry {
  slug: string
  title: string
  subtitle: string | null
  theme: string
  sections: unknown[]
}

const localLandings: Record<string, LandingEntry> = {}

export function getLocalLanding(slug: string): LandingEntry | null {
  return localLandings[slug] ?? null
}

export function getAllLocalLandingSlugs(): string[] {
  return Object.keys(localLandings)
}
