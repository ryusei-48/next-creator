"use client";
import { useState, CSSProperties } from 'react';

export default function ThemeChangeSwitch({ style }: { style: CSSProperties | undefined }) {

  const [ theme, setTheme ] = useState<'system' | 'light' | 'dark'>('system');

  const handleThemeChange = () => {

    switch ( theme ) {
      case 'system':
        setTheme('light');
        document.documentElement.classList.add('light-theme');
        if ( document.documentElement.classList.contains('ck-theme-dark') ) {
          document.documentElement.classList.remove('ck-theme-dark');
        }
        break;
      case 'light':
        setTheme('dark');
        document.documentElement.classList.replace('light-theme', 'dark-theme');
        if ( !document.documentElement.classList.contains('ck-theme-dark') ) {
          document.documentElement.classList.add('ck-theme-dark');
        }
        break;
      case 'dark':
        setTheme('system');
        document.documentElement.classList.remove('dark-theme');
        if ( window.matchMedia('(prefers-color-scheme: dark)').matches ) {
          document.documentElement.classList.add('ck-theme-dark');
        }
        break;
    }
  }

  return (
    <button style={ style } onClick={ handleThemeChange }>{ 'テーマ：' + theme }</button>
  )
}