import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Lora } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Quiet',
  description: 'Am I not at all self-aware?',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Quiet',
    startupImage: '/apple-touch-icon.png',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#8B6D3F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${lora.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-parchment text-ink">{children}</body>
    </html>
  )
}
