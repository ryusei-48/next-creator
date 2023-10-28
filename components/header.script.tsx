'use client';
import { useEffect } from 'react';

export default function HeaderScrpt() {

  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {

        const menubarMobileTogle = document.getElementById('menubar-mobile-togle');
        const topNavElem = document.getElementById('top-nav-elem');
        const menuHight = (topNavElem?.childNodes[0] as HTMLUListElement).clientHeight;

        menubarMobileTogle?.addEventListener('click', () => {
          if ( menubarMobileTogle.dataset.open === "false" ) {
            topNavElem!.style.height = `${ menuHight }px`;
            topNavElem!.style.transform = `scaleY( 1 )`;
            menubarMobileTogle.dataset.open = "true";
          }else {
            topNavElem!.style.removeProperty('height');
            topNavElem!.style.removeProperty('transform');
            menubarMobileTogle.dataset.open = "false";
          }
        });
      }
    }
    startFetching();
    return () => { ignore = true };
  }, [])

  return <></>
}