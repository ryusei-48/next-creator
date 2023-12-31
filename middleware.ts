import { NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { getCookie } from 'cookies-next';
import myConfig from './public.config.json';

export function middleware( request: Request ) {

  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  const urlClass = new URL( request.url );

  requestHeaders.set( 'x-url', process.env.APP_URL! + urlClass.pathname + urlClass.search );
  requestHeaders.set( 'base-url', process.env.APP_URL || '' );

  //const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  //script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
  //style-src 'self' 'nonce-${nonce}';
  const cspHeader = `
    default-src 'self';
    script-src 'self' https://* 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    style-src-elem 'self' https://fonts.googleapis.com 'unsafe-inline';
    img-src 'self' https://* blob: data:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self' *;
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;

  //requestHeaders.set( 'x-nonce', nonce );
  requestHeaders.set(
    'Content-Security-Policy',
    // Replace newline characters and spaces
    //cspHeader.replace(/\s{2,}/g, ' ').trim()
    "default-src * 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes'"
  );

  const { isRedirect, url, language } = getLocale( request );
  //console.log( isRedirect, url, language );
  if ( isRedirect && url ) {
    return NextResponse.redirect( url, { headers: requestHeaders });
  }

  return NextResponse.next({
    headers: requestHeaders,
    request: {
      // Apply new request headers
      headers: requestHeaders,
    }
  });
}

const langParamRexExp = new RegExp(`^\/(${ myConfig.locale['accept-lang'].join('|') })(\/|$)`);
const exceptionPattern = /\/(static-icons|static-img|script)\/|\/(ads\.txt|robots\.txt)/;

function getLocale( request: Request ): {
  isRedirect: boolean, language: string, url: string | undefined
} {

  const url = new URL( request.url );
  //const rootUrl = url.protocol + '//' + url.host;
  const pathname = url.pathname;
  let language: string = '';
  let isRedirect: boolean = false;

  if ( exceptionPattern.test( pathname ) ) {
    return { isRedirect: false, language, url: undefined };
  }

  const locals = myConfig.locale['accept-lang'];
  const defaultLocal = myConfig.locale.default;
  const matchLang = pathname.match( langParamRexExp );
  const useLanguage = matchLang ? matchLang[0].replaceAll('/', '') : defaultLocal;
  const useLanguageCookie = getCookie('use-language', { secure: true, sameSite: 'lax', req: request })
  if ( useLanguageCookie ) {
    isRedirect = useLanguage !== useLanguageCookie ? true : false;
    language = match( [useLanguageCookie], locals, defaultLocal );
    if ( isRedirect ) {
      const redirectUrl = process.env.APP_URL + ( defaultLocal !== language ? '/' + language : '' ) + pathname.replace( langParamRexExp, '' );
      //console.log( 'exist cookie: ', isRedirect, language, redirectUrl );
      return { isRedirect, language, url: redirectUrl };
    }
  }else {
    try {
      const requestedLanguage = new Negotiator({ headers: {
        'accept-language': request.headers.get('accept-language') || undefined
      } }).language() || defaultLocal;
      //console.log( request.headers.get('accept-language') );
      //console.log( 'request URL: ', request.url );
      //console.log( 'requestedLanguage: ', requestedLanguage );
  
      language = match( [requestedLanguage], locals, defaultLocal );
  
      if ( !matchLang && useLanguage !== defaultLocal ) {
        const redirectUrl = process.env.APP_URL + ( defaultLocal !== language ? '/' + language : '' ) + pathname.replace( langParamRexExp, '/' );
        isRedirect = true;
        //console.log( 'none cookie: ', isRedirect, language, redirectUrl );
        return { isRedirect, language, url: redirectUrl };
      }
    }catch (e) {
      //console.log( e );
      return { isRedirect: false, language, url: undefined };
    }
  }

  return { isRedirect, language, url: undefined };
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|sitemap.xml|robots.txt).*)'
    //"/"
  ],
}