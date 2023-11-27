import 'animate.css';
import './globals.scss';
import './comon.style.scss';
import { type Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import NextAuthProvider from '@/components/use-client/provider';
import myConfig from '@/public.config.json';

const useFont = Open_Sans({ subsets: ['latin'] })

const langParams: {[key: string]: string} = {}
for ( let lang of myConfig.locale['accept-lang'] ) {
  langParams[ lang ] = `/${ lang }`;
}
langParams['x-default'] = '/';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: process.env.NEXT_PUBLIC_SITE_TITLE,
  referrer: 'origin-when-cross-origin',
  creator: 'Ryusei',
  title: { default: 'Ryusei.IO', template: '%s | Ryusei.IO' },
  description: '弱視のWebプログラマーのブログです。個人開発関連、技術メモ、お役立ち情報を配信します。',
  metadataBase: process.env.APP_URL ? new URL( process.env.APP_URL ) : null,
  alternates: {
    canonical: '/', languages: langParams
  },
  openGraph: {
    title: '弱視のWebプログラマーのブログ｜個人開発関連、技術メモ、お役立ち情報を配信',
    siteName: 'Ryusei.IO',
    description: '弱視のWebプログラマーのブログです。個人開発関連、技術メモ、お役立ち情報を配信します。',
    url: process.env.APP_URL,
    type: 'website',
  },
  other: {
    "google-adsense-account": process.env.NEXT_PUBLIC_CA_PUB || '',
    //"use-language": myConfig.locale.default
  }
}

export default function RootLayout({
  children, params: { lang }
}: {
  children: React.ReactNode, params: { lang: string }
}) {
  return (
    <html lang={ lang }>
      <body className={useFont.className}>
        <NextAuthProvider>{ children }</NextAuthProvider>
      </body>
    </html>
  )
}
