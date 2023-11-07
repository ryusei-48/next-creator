'use client';
import style from './header.script.module.scss';
import LanguageSelector from './small-parts/lang-change';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark, faChevronRight, faGlobe, faHouse, faTags, faToolbox, faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import type { MobileMenuLocales, LanguageDropdownLocales } from './header';
import type { FlagsSVG } from '../locales/country-flags';

const containerWidth = '1100px';

export default function HeaderScrpt({
  lang, localeStack, flagsSVG, langChangeLocaleStack
}: {
  lang: AcceptLocales, localeStack: MobileMenuLocales,
  flagsSVG: FlagsSVG, langChangeLocaleStack: LanguageDropdownLocales
}) {

  const [ isMenuVisible, setIsMenuVisible ] = useState( false );
  const [ isAddShowClass, setIsAddShowClass ] = useState( false );
  const langChangeRef = useRef<HTMLLIElement | null>( null );
  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {

        const menubarMobileTogle = document.getElementById('menubar-mobile-togle');
        menubarMobileTogle?.addEventListener('click', () => {
          setIsAddShowClass( true );
        });

        window.addEventListener('resize', openMenuHandle );
        openMenuHandle();

        function openMenuHandle() {
          if ( window.matchMedia(`(max-width: ${ containerWidth })`).matches ) {
            setIsMenuVisible( true );
          }else setIsMenuVisible( false );
        }

        setTimeout(() => {
          setExpandContent( langChangeRef );
        }, 300);
      }
    }
    startFetching();
    return () => { ignore = true };
  }, []);

  function setExpandContent( target: React.MutableRefObject<HTMLLIElement | null> ) {

    const togle = target.current?.querySelector<HTMLSpanElement>( 'span.' + style.name );
    const contentWrap = target.current?.querySelector<HTMLDivElement>( 'div.' + style.content_expand );
    const content = contentWrap?.childNodes[0] as HTMLDialogElement | undefined;
    if ( togle && contentWrap && content ) {
      togle.dataset.opened = 'false';
      togle.addEventListener('click', () => {
        if ( togle.dataset.opened === 'false' ) {
          contentWrap.style.height = `${ content.clientHeight }px`;
          contentWrap.style.transform = `scaleY(1)`;
          togle.dataset.opened = 'true';
        }else {
          contentWrap.style.removeProperty('transform');
          contentWrap.style.removeProperty('height');
          togle.dataset.opened = 'false';
        }
      });
    }
  }

  return !isMenuVisible ? <></> :
    <div inert={ isAddShowClass ? undefined : '' }
      className={ style.mobile_menu_wrap + ( isAddShowClass ? ' ' + style.show : '' ) }
      onClick={({ target }) => {
        if ( (target as HTMLDivElement).classList.contains( style.mobile_menu_wrap ) ) {
          setIsAddShowClass( false );
        }
      }}
    >
      <nav className={ style.mobile_menu + ( isAddShowClass ? ' ' + style.show : '' ) }>
        <header>
          <span className={ style.brand_name }>
            { process.env.NEXT_PUBLIC_SITE_TITLE }
          </span>
          <button aria-label='menu close' className={ style.close } onClick={() => setIsAddShowClass( false )}>
            <FontAwesomeIcon icon={ faXmark }></FontAwesomeIcon>
          </button>
        </header>
        <ul>
          <li>
            <div className={ style.expand_togle }>
              <span className={ style.name }>
                <a href="/">
                  <FontAwesomeIcon icon={ faHouse }></FontAwesomeIcon>
                  &nbsp;{ localeStack.home }
                </a>
              </span>
              <span className={ style.expand_icon }>
                <FontAwesomeIcon icon={ faChevronRight }></FontAwesomeIcon>
              </span>
            </div>
          </li>
          <li>
            <div className={ style.expand_togle }>
              <span className={ style.name }>
                <button>
                  <FontAwesomeIcon icon={ faTags }></FontAwesomeIcon>
                  &nbsp;{ localeStack.category }
                </button>
              </span>
              <span className={ style.expand_icon }>
                <FontAwesomeIcon icon={ faChevronRight }></FontAwesomeIcon>
              </span>
            </div>
          </li>
          <li>
            <div className={ style.expand_togle }>
              <span className={ style.name }>
                <button>
                  <FontAwesomeIcon icon={ faToolbox }></FontAwesomeIcon>
                  &nbsp;{ localeStack.product }
                </button>
              </span>
              <span className={ style.expand_icon }>
                <FontAwesomeIcon icon={ faChevronRight }></FontAwesomeIcon>
              </span>
            </div>
          </li>
          <li>
            <div className={ style.expand_togle }>
              <span className={ style.name }>
                <button onClick={() => {
                  setIsAddShowClass( false );
                  if ( 'undefined' !== typeof window ) {
                    window.dispatchEvent( new CustomEvent('open-contactform') );
                  }
                }}>
                  <FontAwesomeIcon icon={ faEnvelope }></FontAwesomeIcon>
                  &nbsp;{ localeStack.contact }
                </button>
              </span>
              <span className={ style.expand_icon }>
                <FontAwesomeIcon icon={ faChevronRight }></FontAwesomeIcon>
              </span>
            </div>
          </li>
          <li ref={ langChangeRef }>
            <div className={ style.expand_togle }>
              <span className={ style.name }>
                <button data-opened='false'>
                  <FontAwesomeIcon icon={ faGlobe }></FontAwesomeIcon>
                  &nbsp;{ localeStack['language-selector'] }
                </button>
              </span>
              <span className={ style.expand_icon }>
                <FontAwesomeIcon icon={ faChevronRight }></FontAwesomeIcon>
              </span>
            </div>
            <div className={ style.content_expand }>
              <LanguageSelector
                lang={ lang } flagsSVG={ flagsSVG }
                localeStack={ langChangeLocaleStack } isMobile
              />
            </div>
          </li>
        </ul>
      </nav>
    </div>
}