"use client";
import React, { useEffect, useState, useRef } from 'react';
import style from './media-gallery.module.scss';

type ImageTagAttr = { src: string, srcset?: string, width?: number, sizes?: string };
type mediaInfo = {
  mediaList: {
    id: number, name: string; url: { paths: {[key: string]: string}},
    mime: string, memo: string | null;
    register_date: Date, update_date: Date;
  }[], isNext: boolean
}

export default function MediaGallery() {

  const [ mediaViews, setMediaViews ] = useState<React.JSX.Element[] | null>( null );
  const [ isNext, setIsNext ] = useState( false );
  const mediaOffset = useRef( 0 );
  const mediaSort = useRef<'asc' | 'desc'>( 'desc' );
  //const baseUrl = location.protocol + '//' + location.host;
  const mediaTake = 30;

  useEffect(() => loadMediaInfo( 0, mediaTake ), []);

  function loadMediaInfo( skip: number, take: number, sort: 'asc' | 'desc' = 'desc' ) {

    fetch('/api/get-media', {
      method: 'POST', cache: 'no-store',
      body: JSON.stringify({ skip, take, sort })
    }).then( async (response) => {
      if ( response.ok ) {
        const mediaInfo = await response.json() as mediaInfo;
        setIsNext( mediaInfo.isNext );
        mediaSort.current = sort;
        setMediaViews([
          ...mediaOffset.current !== 0 ? mediaViews! : [],
          ...mediaInfo.mediaList.map((info) => {
            return MediaViewLiConponent({
              src: '../../api/media-stream?id=' + info.id + '&w=800',
              srcset: Object.keys(info.url.paths)
                .filter( key => key !== 'default' )
                .map( size => '../../api/media-stream?id=' + info.id + '&w=' + size + ` ${ size }w, ` )
                .join(' ').replace(/,\s$/, ''),
              width: Number( Object.keys(info.url.paths).slice(-2)[0] ), sizes: '800px'
            });
        })]);
        mediaOffset.current = 0;
      }
    });
  }

  async function mediaUpload( e: React.ChangeEvent<HTMLInputElement> ) {

    if ( e.currentTarget.files ) {
      const sendData = new FormData();
      sendData.set( 'upload', e.currentTarget.files[0] );
      
      const result = await fetch('/api/upload', {
        method: 'POST', body: sendData
      });

      if ( result.ok ) {
        loadMediaInfo( 0, mediaTake );
        mediaOffset.current = 0;
      }else alert( "アップロードに失敗しました。" );
    }
  }

  function moreGetMedia( offset: number ) {

    mediaOffset.current = offset + mediaTake;
    loadMediaInfo( mediaOffset.current, mediaTake, mediaSort.current );
    console.log( mediaSort.current );
  }

  return (
    <div className={ style.gallery_wrapper }>
      <div className={ style.view_control }>
        <label className={ style.media_upload_label } htmlFor='media-upload-trigger'>アップロード</label>
        <input id="media-upload-trigger" type="file" onChange={ mediaUpload } />
        <input type="datetime-local" />
        <label htmlFor="view-control-sort">並び替え</label>
        <select
          id="view-control-sort"
          onChange={(e) => loadMediaInfo( 0, mediaTake, e.target.value as any )}
        >
          <option value="desc">新しい順</option>
          <option value="asc">古い順</option>
        </select>
      </div>
      <ul>{ mediaViews && mediaViews }</ul>
      <div className={ style.media_get_more } hidden={ !isNext }>
        <button onClick={() => { moreGetMedia( mediaOffset.current ) }}>さらに表示▶</button>
      </div>
    </div>
  )
}

function MediaViewLiConponent({ src, srcset, width, sizes }: ImageTagAttr ) {

  return (
    <li>
      <div className={ style.media_wrapper }>
        <img src={ src } srcSet={ srcset } sizes={ sizes } width={ width } loading="lazy" />
      </div>
    </li>
  )
}