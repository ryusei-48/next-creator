"use client";
import style from './heading-table.module.scss';
import 'highlight.js/styles/stackoverflow-dark.css';
//import 'tocbot/src/scss/tocbot.scss';
import './tocbot-override.scss';
import { useEffect } from 'react';
import tocbot from 'tocbot';
import codeHighlight from 'highlight.js';

export default function HeadingTable() {

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
      <h3>記事の目次</h3>
      <div className={ style.table } id="tocbot-table"></div>
    </aside>
  )
}