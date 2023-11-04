'use client';
import { useEffect } from 'react';

export default function HeaderScrpt() {

  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {

        const menubarMobileTogle = document.getElementById('menubar-mobile-togle');
        const topNavElem = document.getElementById('top-nav-elem');
        const topNavElemUl = topNavElem?.childNodes[0] as HTMLUListElement;
        topNavElem!.inert = true;

        menubarMobileTogle?.addEventListener('click', () => {
          topNavElem!.style.opacity = '1';
          topNavElem!.style.zIndex = '5';
          topNavElemUl.style.transform = 'translateX(0)';
          topNavElem!.inert = false;
        });

        topNavElem?.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          //console.log( e.target );
          if ( ( e.target as HTMLElement ).id === 'top-nav-elem' ) {
            topNavElemUl.style.removeProperty('transform');
            topNavElem!.style.removeProperty('opacity');
            topNavElem!.style.removeProperty('zIndex');
            topNavElem!.inert = true;
          }
        });
      }
    }
    startFetching();
    return () => { ignore = true };
  }, [])

  return <></>
}