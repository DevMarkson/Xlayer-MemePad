import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🚀 Meme Token Launchpad | X Layer',
  description: 'Create, launch, and trade meme tokens on X Layer with automatic bonding curve mechanics and DEX integration.',
  keywords: 'meme token, launchpad, X Layer, OKX, DeFi, bonding curve, DEX',
  authors: [{ name: 'Meme Token Launchpad Team' }],
  openGraph: {
    title: '🚀 Meme Token Launchpad | X Layer',
    description: 'Create, launch, and trade meme tokens on X Layer with automatic bonding curve mechanics.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  )
}
