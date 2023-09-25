import { NextResponse } from 'next/server';

export function middleware(request: Request) {

  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  requestHeaders.set('base-url', process.env.APP_URL || '');

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    }
  });
}