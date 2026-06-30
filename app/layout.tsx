import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter_Tight, Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'

// Same type stack as MangaShift: Inter Tight (display), Playfair italic
// (accent words via <em>), Inter (body), JetBrains Mono (eyebrows/labels).
const display = Inter_Tight({ variable: '--font-display', subsets: ['latin'], weight: ['500', '600', '700', '800', '900'] })
const serif = Playfair_Display({ variable: '--font-serif', subsets: ['latin'], style: ['italic', 'normal'], weight: ['400', '500', '600'] })
const body = Inter({ variable: '--font-body', subsets: ['latin'], weight: ['300', '400', '500', '600'] })
const mono = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['400', '500'] })

export const metadata: Metadata = {
  title: 'BrandLint — AI brand-compliance check',
  description: 'Paste your brand guidelines and a draft, get an instant on-brand review.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${serif.variable} ${body.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  )
}
