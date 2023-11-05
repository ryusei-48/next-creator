'use client';
import style from './header.module.scss';
import { useEffect } from 'react';

const containerWidth = '1100px';

export default function HeaderScrpt() {

  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {

        /*const menubarMobileTogle = document.getElementById('menubar-mobile-togle');
        const topNavElem = document.getElementById('top-nav-elem');
        const topNavElemUl = topNavElem?.childNodes[0] as HTMLUListElement;

        window.addEventListener('resize', () => {
          if ( window.matchMedia(`(max-width: ${ containerWidth })`).matches ) {
            topNavElem!.inert = true;
          }
        });

        const brandLi = document.createElement('li');
        brandLi.classList.add( style['mobile-brand-head'] );
        const brandText = document.createElement('span');
        brandText.classList.add( style['brand-text'] );
        brandText.textContent = process.env.NEXT_PUBLIC_SITE_TITLE || '';
        const closetogle = document.createElement('button');
        closetogle.classList.add( style.close );
        closetogle.innerHTML = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em" viewBox="0 0 384 512">
            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        `;
        closetogle.ariaLabel = 'menu close';
        brandLi.append( brandText, closetogle );
        topNavElemUl.append( brandLi );

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

        topNavElemUl.querySelector('button#open-contactform')
          ?.addEventListener('click', () => {
            topNavElemUl.style.removeProperty('transform');
            topNavElem!.style.removeProperty('opacity');
            topNavElem!.style.removeProperty('zIndex');
            topNavElem!.inert = true;
          });*/
      }
    }
    startFetching();
    return () => { ignore = true };
  }, [])

  return <></>
}