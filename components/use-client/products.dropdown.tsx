'use client';
import style from './products.dropdown.module.scss';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import NextCreatorPNG from '@/public/static-img/next-creator.png';
import TwitterSpaceDownloaderPNG from '@/public/static-img/twitter-space-downloader.jpg';
import TranscriberPNG from '@/public/static-img/transcriber.png';
import GoogleSearchWithDuckDuckGoPNG from '@/public/static-img/google-search-with-duckduckgo.jpg';

export default function ProductsDropdown({ lang, isMobile }: { lang: AcceptLocales, isMobile?: true }) {

  const [ isVisible, setIsVisible ] = useState<boolean>( false );
  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {
        const togle = document.getElementById('open-product-list') as HTMLButtonElement | null;
        const parentTogle = togle?.parentElement as HTMLLIElement | null | undefined;
        if ( togle && parentTogle ) {
          parentTogle.addEventListener('mouseover', () => { setIsVisible( true ) });
          parentTogle.addEventListener('mouseout', () => { setIsVisible( false ) });
        }
      }
    }
    startFetching();
    return () => { ignore = true }
  }, []);

  return (
    <div inert={ !isMobile && !isVisible ? "" : undefined } className={ style.products_wrap }>
      <ul className={ style.products }>
        <li>
          <a className={ style.link_box } target="_blank" href="https://github.com/ryusei-48/next-creator">
            <div className={ style.thumbnail }>
              <span className={ style.wrapper }>
                <Image width="150" height="75" src={ NextCreatorPNG } alt="Next Creator" />
              </span>
            </div>
            <div className={ style.details }>
              <span className={ style.title }>Next Creator</span>
              <span className={ style.description }>
                {
                  lang === 'en' ?
                  `This is a blog template with Next.js posting functionality.
                  The source code of this site is available as is.` :
                  `Next.jsの投稿機能を搭載したブログテンプレートです。
                  当サイトのソースコードそのまま公開しています。` 
                }
              </span>
            </div>
          </a>
        </li>
        <li>
          <a className={ style.link_box } target="_blank" href="https://twspace-dl.tools.ryusei.io">
            <div className={ style.thumbnail }>
              <span className={ style.wrapper }>
                <Image width="150" height="75" src={ TwitterSpaceDownloaderPNG } alt="Twitter Space Downloader" />
              </span>
            </div>
            <div className={ style.details }>
              <span className={ style.title }>Twitter Space Downloader</span>
              <span className={ style.description }>
                {
                  lang === 'en' ?
                  `This web tool allows you to download archives of public X-space (formerly Twitter) recordings as audio files in "m4a" format.` :
                  `本Webツールは、Xスペース（旧Twitter）の公開済み録音アーカイブを、 「m4a」形式の音声ファイルとしてダウンロードできます。`                   
                }
              </span>
            </div>
          </a>
        </li>
        <li>
          <a className={ style.link_box } target="_blank" href="https://transcriber.tools.ryusei.io">
            <div className={ style.thumbnail }>
              <span className={ style.wrapper }>
                <Image width="150" height="75" src={ TranscriberPNG } alt="transcriber" />
              </span>
            </div>
            <div className={ style.details }>
              <span className={ style.title }>TRANSCRIBER</span>
              <span className={ style.description }>
                {
                  lang === 'en' ?
                  `This is a service that allows you to come and translate video and audio text and watch media for basically free!` :
                  `基本無料で動画や音声の文字お越し・翻訳、メディアの視聴ができるサービスです。`                   
                }
              </span>
            </div>
          </a>
        </li>
        <li>
          <a className={ style.link_box } target="_blank" href="https://chrome.google.com/webstore/detail/google-search-with-duckdu/gagkgkcgcfmbgnapiajgkljenmegdpgm?hl=ja">
            <div className={ style.thumbnail }>
              <span className={ style.wrapper }>
                <Image width="150" height="75" src={ GoogleSearchWithDuckDuckGoPNG } alt="Google Search With DuckduckGo" />
              </span>
            </div>
            <div className={ style.details }>
              <span className={ style.title }>Google Search With DuckduckGo</span>
              <span className={ style.description }>
                {
                  lang === 'en' ?
                  `DuckduckGo search results in addition to Google search results. (Chrome extension)` :
                  `Google検索での検索結果に加えて、DuckduckGoの検索結果も表示します。（Chrome拡張）`
                }
              </span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  )
}