'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[]
  }
}

export default function GoogleAdsense() {

  useEffect(() => {
    const adsScript = document.createElement('script');
    adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3845645533442741';
    adsScript.async = true;
    adsScript.setAttribute('crossorigin', 'anonymous');
    document.body.appendChild( adsScript );

    try {
      ;( window.adsbygoogle = window.adsbygoogle || []).push({} )
    } catch (err) {
      //console.error( err );
    }

    return () => {
      document.body.removeChild( adsScript );
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-3845645533442741"
      data-ad-slot="9579010534"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  )
}