'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import * as pixel from '@/lib/fbpixel'

export function FacebookPixel() {
  const pathname = usePathname()

  useEffect(() => {
    pixel.pageview()
  }, [pathname])

  return null
}
