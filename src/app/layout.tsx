import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/providers/AppProviders'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyMobileBar } from '@/components/layout/StickyMobileBar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'TAPLA MARKETPLACE | Onlayn Elektronika Mağazası',
    template: '%s | TAPLA MARKETPLACE',
  },
  description: 'TAPLA MARKETPLACE — Azərbaycanda ən sərfəli qiymətlərlə elektronika, notebook, telefon, aksesuar və daha çoxu. Sürətli çatdırılma, zəmanət və etibarlı xidmət.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-white text-neutral-900 min-h-screen flex flex-col justify-between`}>
        <AppProviders>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <StickyMobileBar />
        </AppProviders>
      </body>
    </html>
  )
}
