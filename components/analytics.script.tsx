'use client';
//import { useEffect, useRef } from 'react';
import Script from 'next/script';
//import { useRouter, usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: any
  }
}

export default function analyticsScript() {

  /*const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstSkip = useRef<number>( 0 );

  useEffect(() => {
    if ( firstSkip.current < 3 ) {
      firstSkip.current += 1;
      return () => { return };
    }
    console.log('first load.', firstSkip.current );
    const url = process.env.NEXT_PUBLIC_APP_URL + pathname + searchParams.toString();
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [ pathname, searchParams ]);*/

  return (
    <>
      <Script
        id="google-analytics-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${ process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID }`}
        strategy='afterInteractive'
      ></Script>
      <Script
        id="google-analytics-tag-script"
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID }');
        `}}
      ></Script>
    </>
  )
}