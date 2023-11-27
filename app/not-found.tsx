import Header from '@/components/header';
import Container from '@/components/container';
import Footer from '@/components/footer';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { headers } from 'next/headers';
import Link from 'next/link';
import myConfig from '@/public.config.json';

const defaultLocal = myConfig.locale.default as AcceptLocales;
const locals = myConfig.locale['accept-lang'];

export default async function NotFound() {

  const headersList = headers();
  const requestUrl = headersList.get('x-url');
  const requestedLanguage = new Negotiator({ headers: {
    'accept-language': headersList.get('accept-language') || undefined
  } }).language() || defaultLocal;
  let language: AcceptLocales;
  try {
    language = match( [requestedLanguage], locals, defaultLocal ) as AcceptLocales;
  }catch (err) {
    language = defaultLocal;
  }

  /*for ( let [ key, value ] of headersList.entries() ) {
    console.log( 'key: ', key, 'value: ', value );
  }*/

  return (
    <>
      <Header lang={ language } />
      <Container type='div' styleInit>
        <div style={{
          display: 'block', padding: '10px',
          width: '100%', textAlign: 'center'
        }}>
          <p style={{ fontSize: '30pt', fontWeight: 'bold' }}>404 not found.</p>
          {
            language === 'ja' ?
            <>
              <p>リクエストされたURL：{ requestUrl || '不明' }</p>
              <p>ページが見つかりません。存在しないか、移動されました。</p>
            </> :
            <>
              <p>Requested URL：{ requestUrl || '不明' }</p>
              <p>Page not found. It does not exist or has been moved.</p>
            </>
          }
        </div>
      </Container>
      <Footer lang={ language } />
    </>
  )
}