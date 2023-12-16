'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[]
  }
}

export default function GoogleAdsense() {

  useEffect(() => {
    const heading_2 = document.body.querySelectorAll('#insert_post_html > h2');
    const firstHeading = heading_2.length !== 0 ? heading_2[0] as HTMLHeadingElement : null;
    const adContainer = document.createElement('div');

    if ( heading_2.length >= 2 && firstHeading ) {
      adContainer.style.width = "100%";
      adContainer.style.padding = "8px";
      adContainer.innerHTML = `
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-3845645533442741"
          data-ad-slot="9579010534"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      `;
      const adsScript = document.createElement('script');
      adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3845645533442741';
      adsScript.async = true;
      adsScript.setAttribute('crossorigin', 'anonymous');
      firstHeading.parentNode!.insertBefore( adContainer, firstHeading );
      adContainer.appendChild( adsScript );
    }

    try {
      ;( window.adsbygoogle = window.adsbygoogle || []).push({} )
    } catch (err) {
      //console.error( err );
    }

    return () => {
      if ( heading_2.length >= 2 && firstHeading ) {
        firstHeading.parentElement!.removeChild( adContainer );
      }
    }
  }, []);

  return <></>
}