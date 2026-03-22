import type { Metadata } from 'next'
import { NextAuthSessionProvider } from '@/components/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Proclaim Canada',
  description: 'Connecting preachers with churches across Canada',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  )
}
