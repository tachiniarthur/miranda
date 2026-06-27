import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Miranda',
  description: 'O guarda-roupa obedece.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
