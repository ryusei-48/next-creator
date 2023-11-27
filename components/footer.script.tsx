'use client';
import { useEffect } from 'react';

export default function FooterScript() {

  let ignore = false;
  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {
        const footerOpenContactform = document.getElementById('footer-open-contactform');
        footerOpenContactform?.addEventListener('click', () => {
          window.dispatchEvent( new CustomEvent('open-contactform') );
        });
      }
    }
    startFetching();
    return () => { ignore = true }
  }, []);

  return <></>
}