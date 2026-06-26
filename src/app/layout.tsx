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
    default: 'ALUNA | Premium Gözəllik və Üz Qulluğu Cihazları',
    template: '%s | ALUNA',
  },
  description: 'Aluna ilə evinizdə lüks salon qulluğu. 7 fərqli LED işıq terapiyası, EMS mikroaxın liftinqi və sonik üz təmizləmə cihazları ilə dərhal gənclik və parlaqlıq.',
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
