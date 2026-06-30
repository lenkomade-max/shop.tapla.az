import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { AppProviders } from '@/providers/AppProviders'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyMobileBar } from '@/components/layout/StickyMobileBar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

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
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
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
fbq('init', '1880811039970349');
fbq('track', 'PageView');
          `,
        }}
      />
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-neutral-50 text-neutral-900 min-h-screen flex flex-col justify-between`}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1880811039970349&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
