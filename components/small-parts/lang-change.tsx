'use client';
import style from './lang-change.module.scss';
import { useEffect, useState } from 'react';
import myConfig from '@/public.config.json';

const selectedLang: AcceptLocales = 'ja';

export default function LangChange({ lang }: { lang: AcceptLocales }) {

  return (
    <div className={ style.lang_selector }>
      {
        ( myConfig.locale['accept-lang'] as AcceptLocales[] ).map((label, index) => {
          return (
            <button key={ index }
              className={ selectedLang === label ? style.selected : undefined }
            >
              { myConfig.locale.labels[ lang ][ label ] }
            </button>
          )
        })
      }
    </div>
  )
}