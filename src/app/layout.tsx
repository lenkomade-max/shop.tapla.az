import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { AppProviders } from '@/providers/AppProviders'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyMobileBar } from '@/components/layout/StickyMobileBar'
import { FacebookPixel } from '@/components/layout/FacebookPixel'
import { JsonLd } from '@/components/seo/JsonLd'
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo/schemas/organization-schema'
import { dbService } from '@/services/db'

const FB_PIXEL_ID = '1880811039970349'
const SITE_URL = 'https://shop.tapla.az'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TAPLA MARKETPLACE | Onlayn Elektronika Mağazası',
    template: '%s | TAPLA MARKETPLACE',
  },
  description: 'TAPLA MARKETPLACE — Azərbaycanda ən sərfəli qiymətlərlə elektronika, notebook, telefon, aksesuar və daha çoxu. Sürətli çatdırılma, zəmanət və etibarlı xidmət.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: 'TAPLA MARKETPLACE',
    locale: 'az_AZ',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rootCategories = await dbService.getCategoryTree()

  return (
    <html lang="az" className="scroll-smooth">
      <Script
        id="fb-pixel-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
          `,
        }}
      />
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-neutral-50 text-neutral-900 min-h-screen flex flex-col justify-between`}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <JsonLd data={getOrganizationSchema()} />
        <JsonLd data={getWebSiteSchema()} />
        <FacebookPixel />
        <AppProviders>
          <Header rootCategories={rootCategories} />
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
