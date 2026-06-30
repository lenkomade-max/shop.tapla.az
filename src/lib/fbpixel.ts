export const FB_PIXEL_ID = '1880811039970349'

export const pageview = () => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    ;(window as any).fbq('track', 'PageView')
  }
}

export const event = (name: string, options: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    ;(window as any).fbq('track', name, options)
  }
}
