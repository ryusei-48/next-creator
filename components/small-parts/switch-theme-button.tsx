"use client";
import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

type UseCookie = 'system' | 'light' | 'dark';

export default function ThemeChangeSwitch({ style }: { style: CSSProperties | undefined }) {

  const [ theme, setTheme ] = useState<UseCookie>('system');
  const [ themeText, setThemeText ] = useState<'Dark' | 'Light' | 'Theme'>( 'Theme' );
  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {
        const useTheme = getCookie('use-theme', { secure: true, sameSite: true }) as UseCookie | undefined;
        if ( useTheme && ["system", "light", "dark"].includes( useTheme ) ) {
          handleThemeChange( useTheme );
          //console.log( theme );
        }
      }
    }
    startFetching();
    return () => { ignore = true };
  }, []);

  const handleThemeChange = ( useTheme?: UseCookie ) => {

    const switchTheme = useTheme || theme;
    console.log( switchTheme );
    switch ( switchTheme ) {
      case 'system':
        setTheme('light'); setThemeText('Light');
        setCookie('use-theme', 'system', { secure: true, sameSite: true });
        document.documentElement.classList.add('light-theme');
        if ( document.documentElement.classList.contains('ck-theme-dark') ) {
          document.documentElement.classList.remove('ck-theme-dark');
        }
        break;
      case 'light':
        setTheme('dark'); setThemeText('Dark');
        setCookie('use-theme', 'light', { secure: true, sameSite: true });
        document.documentElement.classList.replace('light-theme', 'dark-theme');
        if ( !document.documentElement.classList.contains('ck-theme-dark') ) {
          document.documentElement.classList.add('ck-theme-dark');
        }
        break;
      case 'dark':
        setTheme('system'); setThemeText('Theme');
        deleteCookie('use-theme', { secure: true, sameSite: true });
        document.documentElement.classList.remove('dark-theme');
        if ( window.matchMedia('(prefers-color-scheme: dark)').matches ) {
          document.documentElement.classList.add('ck-theme-dark');
        }
        break;
    }
  }

  return (
    <button onClick={() => handleThemeChange()}
      title={ `テーマ：` + ( themeText === "Theme" ? 'Default' : themeText ) }
      aria-label={ `テーマ：` + ( themeText === "Theme" ? 'Default' : themeText ) }
      style={{ ...style, color: 'var( --foreground-color )', margin: '0 5px' }}
    >
      { theme === 'system' && <FontAwesomeIcon width={`20px`} icon={ faCircleHalfStroke }></FontAwesomeIcon> }
      { theme === 'dark' && <FontAwesomeIcon width={`20px`} icon={ faMoon }></FontAwesomeIcon> }
      { theme === 'light' && <FontAwesomeIcon color="black" width={`20px`} icon={ faSun }></FontAwesomeIcon> }
    </button>
  )
}