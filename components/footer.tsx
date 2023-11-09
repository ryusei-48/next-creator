import style from './footer.module.scss';
import Script from 'next/script';

export default function Footer() {

  return (
    <>
      {/*<span className={ style.spacer }></span>*/}
      <footer className={ style.footer }>
        <small>Copy right © { process.env.NEXT_PUBLIC_SITE_TITLE } All rights reserved.</small>
      </footer>
      <Script
        id="google-analytics-tag"
        src='https://www.googletagmanager.com/gtag/js?id=G-MHFK4R0NEP'
        strategy='afterInteractive'
      >
        {
          `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MHFK4R0NEP');`
        }
      </Script>
    </>
  )
}