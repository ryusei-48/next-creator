"use client";
import style from './heading-table.module.scss';
import 'highlight.js/styles/github-dark.css';
//import 'tocbot/src/scss/tocbot.scss';
import './tocbot-override.scss';
import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableList } from '@fortawesome/free-solid-svg-icons';
import tocbot from 'tocbot';
import codeHighlight from 'highlight.js';
import type { ArticleIndexLocales } from '../sidebar';

const containerWidth = '1100px';

export default function HeadingTable({ lang, localeStack }: {
  lang: string, localeStack: ArticleIndexLocales
}) {

  const tableOfContent = useRef<HTMLDivElement | null>( null );

  useEffect(() => {

    const codeBlocks = document.querySelectorAll<HTMLElement>('pre code');
    const heading_2 = document.body.querySelectorAll('#insert_post_html h2');
    const heading_3 = document.body.querySelectorAll('#insert_post_html h3');
    const heading_4 = document.body.querySelectorAll('#insert_post_html h4');
    const heading_5 = document.body.querySelectorAll('#insert_post_html h5');
    const headings = [
      ...heading_2, ...heading_3, ...heading_4, ...heading_5
    ] as HTMLHeadingElement[];

    for ( let [ index, heading ] of headings.entries() ) {
      heading.id = `tocbot_heading_${ index }`;
    }
    //console.log( codeHighlight.listLanguages() );

    for ( let codeBlock of [...codeBlocks] ) {
      const span = document.createElement('span');
      span.classList.add('lang_name');
      span.textContent = codeBlock.className.split(' ')[1];
      codeBlock.parentElement?.appendChild( span );
      codeHighlight.highlightElement( codeBlock );
    }

    tocbot.init({
      tocSelector: "#tocbot-table",
      contentSelector: "#insert_post_html",
      headingSelector: 'h1, h2, h3',
      hasInnerContainers: true,
      scrollSmoothDuration: 0,
      scrollSmoothOffset: -50,
      headingsOffset: 100,
      //positionFixedSelector: `aside.${ style.heading_table }`,
      //fixedSidebarOffset: -50,
      //disableTocScrollSync: true,
      orderedList: false
    });

    window.addEventListener('resize', () => {
      if ( tableOfContent.current && window.matchMedia(`(max-width: ${ containerWidth })`).matches ) {
        tableOfContent.current.inert = true;
      }
    });

    setTimeout(() => {
      const headingTable = document.body.querySelectorAll<HTMLLinkElement>('div#tocbot-table a');

      if ( location.hash !== '' ) {
        for ( let anker of [...headingTable] ) {
          const ankerHref = new URL( anker.href ).hash;
          if ( ankerHref === location.hash ) {
            anker.click(); break;
          }
        }
      }

      for ( let heading of headings ) {
        heading.addEventListener('click', () => {
          for ( let anker of [...headingTable] ) {
            const ankerHref = new URL( anker.href ).hash;
            if ( ankerHref === "#" + heading.id ) {
              anker.click(); break;
            }
          }
        });
      }
    }, 500);

    return () => tocbot.destroy()
  }, []);

  return (
    <aside className={ style.heading_table }>
      <div ref={ tableOfContent } className={ style.content_wrap }
        onClick={() => {
          if ( window.matchMedia(`(max-width: ${ containerWidth })`).matches ) {
            tableOfContent.current!.classList.remove( style.show );
            tableOfContent.current!.inert = true;
          }
        }}
      >
        <div className={ style.content }>
          <h3>{ localeStack }</h3>
          <div className={ style.table } id="tocbot-table"></div>
        </div>
      </div>
      <span className={ style.mobile_float_icon }>
        <button aria-label='table of contents'
          onClick={() => {
            tableOfContent.current!.classList.add( style.show );
            tableOfContent.current!.inert = false;
          }}
        >
          <FontAwesomeIcon icon={ faTableList }></FontAwesomeIcon>
        </button>
      </span>
    </aside>
  )
}