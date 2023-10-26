'use client';
import style from './lang-change.module.scss';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import myConfig from '@/public.config.json';
import type { FlagsSVG } from '@/locales/country-flags';
import type { LanguageDropdownLocales } from '../header';

export default function LangChange({ lang, flagsSVG, localeStack }: {
  lang: AcceptLocales, flagsSVG: FlagsSVG, localeStack: LanguageDropdownLocales
}) {

  const languageChangeToggle = useRef<HTMLButtonElement | null>( null );
  const [ isVisible, setIsVisible ] = useState<boolean>( false );
  const [ useLanguage, setUseLanguage ] = useState<AcceptLocales | undefined>( undefined );
  const [ selectedLang, setSelectedLang ] = useState<AcceptLocales>( lang );
  const pathname = usePathname();
  const searchParam = useSearchParams().toString();
  const pathnameRegExp = new RegExp(`^\/(${ myConfig.locale['accept-lang'].join('|') })(\/\\w+|$)`);
  const langParamRexExp = new RegExp(`^\/(${ myConfig.locale['accept-lang'].join('|') })(\/|$)`);
  const router = useRouter();

  useEffect(() => {
    languageChangeToggle.current = document.getElementById('language-change-toggle') as HTMLButtonElement;
    languageChangeToggle.current.addEventListener('click', () => {
      setIsVisible( true );
      setTimeout(() => {
        document.body.addEventListener('click', selectorUnVisible );
      }, 200);
    });

    const useLanguageCookie = getCookie('use-language') as AcceptLocales | undefined;
    setUseLanguage( useLanguageCookie );
    setSelectedLang( useLanguageCookie ?? lang );
    //console.log( useLanguageCookie );

    //setCookie('test', 'cookie set.', { secure: true, sameSite: "lax" });
    //deleteCookie('test', { secure: true });
    //console.log( getCookie('use-language') );
  }, []);

  function selectorUnVisible() {
    setIsVisible( false );
    document.body.removeEventListener('click', selectorUnVisible );
  }

  return (
    <div className={ `${ style.lang_selector } ${ isVisible ? style.visible : '' }` }>
      <button className={ !useLanguage ? style.selected : undefined }
        onClick={() => {
          deleteCookie('use-language', { secure: true, sameSite: 'lax' });
          location.reload();
        }}
      >
        <FontAwesomeIcon icon={ faGlobe }></FontAwesomeIcon>
        &nbsp;{ localeStack.default }
      </button>
      {
        ( myConfig.locale['accept-lang'] as AcceptLocales[] ).map((label, index) => {
          return (
            <button key={ index }
              className={ selectedLang === label && useLanguage ? style.selected : undefined }
              onClick={(e) => {
                e.stopPropagation();
                let newPathname = pathname;
                if ( pathnameRegExp.test( pathname ) ) {
                  newPathname = newPathname.replace( langParamRexExp, '/' );
                }
                const redirectPath = ( myConfig.locale.default === label ? '' : '/' + label ) + newPathname + ( searchParam === '' ? '' : '?' + searchParam );
                setCookie('use-language', label, { secure: true, sameSite: 'lax' });
                setSelectedLang( label );
                setUseLanguage( label );
                //console.log( redirectPath );
                router.push( redirectPath );
              }}
            >
              <span className={ style.flag }>
                <Image className={ style.image } src={ flagsSVG[ label ] } alt={ localeStack['flag-icon-alt'] } />
              </span>
              &nbsp;{ myConfig.locale.labels[ lang ][ label ] }
            </button>
          )
        })
      }
    </div>
  )
}