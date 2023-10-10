import { NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import myConfig from './public.config.json';

export function middleware( request: Request ) {

  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  const urlClass = new URL( request.url );

  requestHeaders.set( 'x-url', process.env.APP_URL! + urlClass.pathname );
  requestHeaders.set( 'base-url', process.env.APP_URL || '' );

  const { isRedirect, url, language } = getLocale( request );
  //console.log( isRedirect, url, language );
  if ( isRedirect && url ) {
    return NextResponse.redirect( url, { headers: requestHeaders });
  }

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    }
  });
}

function getLocale( request: Request ): {
  isRedirect: boolean, language: string, url: string | undefined
} {

  const locals = myConfig.locale['accept-lang'];
  const defaultLocal = myConfig.locale.default;
  const requestedLanguage = new Negotiator({ headers: {
    'accept-language': request.headers.get('accept-language') || undefined
  } }).language() || defaultLocal;

  const language = match( [requestedLanguage], locals, defaultLocal );

  const url = new URL( request.url );
  const rootUrl = url.protocol + '//' + url.host;
  const pathname = url.pathname;
  
  if ( language !== defaultLocal ) {
    return { isRedirect: true, language, url: `${ rootUrl }/${ language + pathname }` };
  } else return { isRedirect: false, language, url: undefined };
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    //"/"
  ],
}