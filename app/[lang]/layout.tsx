import './globals.scss'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextAuthProvider from '@/components/use-client/provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ryusei.IO',
  description: '弱視のWebプログラマーのブログです。個人開発関連、技術メモ、お役立ち情報を配信します。',
}

export default function RootLayout({
  children, params: { lang }
}: {
  children: React.ReactNode, params: { lang: string }
}) {
  return (
    <html lang={ lang }>
      <body className={inter.className}>
        <NextAuthProvider>{ children }</NextAuthProvider>
      </body>
    </html>
  )
}
