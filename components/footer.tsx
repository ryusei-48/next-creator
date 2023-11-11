import style from './footer.module.scss';
import AnalyticsScript from './analytics.script';
import Link from 'next/link';
import Script from 'next/script';
import LocaleDict from '@/locales/dictionaries';

export default async function Footer({ lang }: { lang: AcceptLocales }) {

  const localeStack = await LocaleDict[ lang ].footer();

  return (
    <>
      {/*<span className={ style.spacer }></span>*/}
      <footer className={ style.footer }>
        <div className={ 'container ' + style.flex }>
          <nav>
            <ul>
              <li><Link href="/">{ localeStack.navigation.home }</Link></li>
              <li><Link href="/privacy-policy">{ localeStack.navigation['policy-page'] }</Link></li>
              <li>
                <button aria-label='お問い合わせ' id="footer-open-contactform">
                  { localeStack.navigation.contact }
                </button>
              </li>
            </ul>
          </nav>
          <small>Copy right © { process.env.NEXT_PUBLIC_SITE_TITLE } All rights reserved.</small>
        </div>
      </footer>
      <Script id="footer-script" strategy='lazyOnload' src='/scripts/footer.js'></Script>
      <AnalyticsScript />
    </>
  )
}