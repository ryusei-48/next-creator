'use client';
import { useEffect, useRef } from 'react';
import Script from 'next/script';
//import { useRouter, usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: any,
    admaxads: { admax_id: string, type: string }[],
    __admax_tag__: any
  }
}

export default function analyticsScript() {

  useEffect(() => {

    /*(window.admaxads = window.admaxads || []).push({admax_id: "e3cce704a48dbc4d3f2d02a6c335c235",type: "banner"});
    (window.admaxads = window.admaxads || []).push({admax_id: "e3cce704a48dbc4d3f2d02a6c335c235",type: "banner"});
    (window.admaxads = window.admaxads || []).push({admax_id: "e3cce704a48dbc4d3f2d02a6c335c235",type: "banner"});
    (window.admaxads = window.admaxads || []).push({admax_id: "ef7b5aa165cb2626d4364bbeabb3f215",type: "banner"});
    (window.admaxads = window.admaxads || []).push({admax_id: "ef7b5aa165cb2626d4364bbeabb3f215",type: "banner"});

    const tag = document.createElement('script');
    tag.src = 'https://adm.shinobi.jp/st/t.js';
    tag.async = true;
    document.body.appendChild( tag );*/

    const adsbygoogle = document.createElement('script');
    adsbygoogle.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ process.env.NEXT_PUBLIC_CA_PUB || '' }`;
    adsbygoogle.async = true;
    adsbygoogle.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild( adsbygoogle );

    const twitterTimeline = document.createElement('script');
    twitterTimeline.src = 'https://platform.twitter.com/widgets.js';
    twitterTimeline.async = true;
    twitterTimeline.charset = 'utf-8';
    document.body.appendChild( twitterTimeline );

    return () => {
      /*document.body.removeChild (tag );
      window.admaxads = [];
      window["__admax_tag__"] = undefined;*/
      document.head.removeChild( adsbygoogle );
      document.body.removeChild( twitterTimeline );
      //console.log('unmount');
    }
  }, [ /*pathname, searchParams*/ ]);

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