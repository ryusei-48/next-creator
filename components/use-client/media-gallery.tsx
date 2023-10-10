"use client";
import React, { useEffect, useState, useRef, type SetStateAction } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import style from './media-gallery.module.scss';
import { getStrDatetime } from '@/lib/functions.client';
import i18n from "@/locales/ja.dict.json";

type ImageTagAttr = {
  src: string, srcset?: string, width?: number, sizes?: string,
  name: string, id: number, mode: 'default' | 'post_new' | 'post_edit',
  thumbSelectDialog?: React.MutableRefObject<HTMLDialogElement | null>,
  mediaInsertMode?: 'ck' | 'thumb',
  deleteFunc: ( id: string, name: string ) => void,
  showDetailFunc: ( id: string ) => void
};

type mediaInfo = {
  mediaList: mediaInfoOne[], isNext: boolean
}

type mediaInfoOne = {
  id: number, name: string; url: { paths: {[key: string]: string}},
  mime: string, memo: string | null;
  register_date: Date, update_date: Date;
}

export default function MediaGallery({
  mode = 'default', thumbSelectDialog, mediaInsertMode
}: {
  mode: 'default' | 'post_new' | 'post_edit', mediaInsertMode?: 'ck' | 'thumb',
  thumbSelectDialog?: React.MutableRefObject<HTMLDialogElement | null>
}) {

  const [ mediaViews, setMediaViews ] = useState<React.JSX.Element[] | null>( null );
  const [ modalMediaView, setModalMediaView ] = useState<React.JSX.Element | null>( null )
  const [ isVisibleMediaModal, setIsVisibleMediaModal ] = useState( false );
  const [ isNext, setIsNext ] = useState( false );
  const mediaOffset = useRef( 0 );
  const mediaSort = useRef<'asc' | 'desc'>( 'desc' );
  //const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const mediaTake = 30;

  useEffect(() => {
    loadMediaInfo( 0, mediaTake );
  }, [mediaInsertMode]);

  function loadMediaInfo(
    skip: number, take: number, sort: 'asc' | 'desc' = 'desc',
    startDate?: Date, endDate?: Date
  ) {

    fetch('/api/get-media', {
      method: 'POST', cache: 'no-store',
      body: JSON.stringify({ skip, take, sort }),
    }).then( async (response) => {
      if ( response.ok ) {
        const mediaInfo = await response.json() as mediaInfo;
        setIsNext( mediaInfo.isNext );
        mediaSort.current = sort;
        setMediaViews([
          ...mediaOffset.current !== 0 ? mediaViews! : [],
          ...mediaInfo.mediaList.map((info) => {
            return MediaViewLiConponent({
              id: info.id, name: info.name,
              src: '../../api/media-stream?id=' + info.id + '&w=800',
              srcset: Object.keys(info.url.paths)
                .filter( key => key !== 'default' )
                .map( size => '../../api/media-stream?id=' + info.id + '&w=' + size + ` ${ size }w, ` )
                .join(' ').replace(/,\s$/, ''),
              width: Number( Object.keys(info.url.paths).slice(-2)[0] ), sizes: '800px',
              deleteFunc: deleteMedia, showDetailFunc: showMediaDetailModal,
              thumbSelectDialog, mode, mediaInsertMode
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
        method: 'POST', body: sendData, cache: 'no-cache'
      });

      if ( result.ok ) {
        loadMediaInfo( 0, mediaTake );
        mediaOffset.current = 0;
        //console.log( await result.json() );
      }else alert( "アップロードに失敗しました。" );
    }
  }

  function deleteMedia( id: string, name: string ) {

    if ( confirm( `ファイル「${ name }」を削除しますか？` ) ) {

      fetch('/api/rm-media', {
        method: 'POST', body: JSON.stringify({ id }),
        cache: 'no-store'
      }).then((response) => {
        if ( response.ok ) {
          loadMediaInfo( 0, mediaTake, mediaSort.current );
        }else alert( '処理に失敗しました。' );
      });
    }
  }

  function moreGetMedia( offset: number ) {

    mediaOffset.current = offset + mediaTake;
    loadMediaInfo( mediaOffset.current, mediaTake, mediaSort.current );
    //console.log( mediaSort.current );
  }

  function showMediaDetailModal( id: string ) {

    fetch('/api/get-media-first', {
      method: 'POST', body: JSON.stringify({ id })
    }).then( async (response) => {
      if ( response.ok ) {
        const mediaInfo = await response.json() as mediaInfoOne;
        setModalMediaView(
          <img
          src={ `../../api/media-stream?w=800&id=${ mediaInfo.id }` }
          srcSet={ Object.keys(mediaInfo.url.paths)
            .filter( key => key !== 'default' )
            .map( size => '../../api/media-stream?id=' + mediaInfo.id + '&w=' + size + ` ${ size }w, ` )
            .join(' ').replace(/,\s$/, '')
          }
          width={ Number( Object.keys(mediaInfo.url.paths).slice(-2)[0] ) }
          sizes='100vw' loading="lazy"
          />
        )
        setIsVisibleMediaModal( true );
      }
    });
  }

  return (
    <div className={ style.gallery_wrapper }>
      <div className={ style.view_control + ` ${ mode === 'post_new' && style.block }` }>
        <label className={ style.media_upload_label } htmlFor='media-upload-trigger'>アップロード</label>
        <input id="media-upload-trigger" type="file" aria-label='アップロードする' role="button" onChange={ mediaUpload } />
        <fieldset>
          <legend>期間</legend>
          <input type="datetime-local" value={ getStrDatetime() } />&nbsp;～&nbsp;
          <input type="datetime-local" max={ getStrDatetime() } value={ getStrDatetime() } />
        </fieldset>
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
      <div
        className={ `${ style.media_viewr_modal_back } ${ isVisibleMediaModal ? style.show : "" }` }
        inert={ isVisibleMediaModal ? undefined : "" } data-modal="wrapper"
        onClick={(e) => {
          const dataset = ( e.target as HTMLDivElement ).dataset;
          if ( dataset.modal ) {
            setIsVisibleMediaModal( false );
          }
        }}
      >
        <div className={ style.media_viewr_modal }>
          <button className={ style.close } title='閉じる' aria-label='閉じる' onClick={() => setIsVisibleMediaModal( false )}>
            <FontAwesomeIcon icon={ faXmark }></FontAwesomeIcon>
          </button>
          <div className={ style.media_view }>{ modalMediaView && modalMediaView }</div>
        </div>
      </div>
    </div>
  )
}

function MediaViewLiConponent({
  id, name, src, srcset, width, sizes, mode, showDetailFunc, deleteFunc,
  thumbSelectDialog, mediaInsertMode
}: ImageTagAttr ) {

  return (
    <li
      tabIndex={ 0 } aria-label={ name } data-id={ id } key={ id }
      onClick={(e) => { showDetailFunc( e.currentTarget.dataset.id! ) }}
      onKeyDown={(e) => {
        e.code === 'Enter' && showDetailFunc( e.currentTarget.dataset.id! )
      }}
    >
      <div className={ style.media_wrapper }>
        <img src={ src } srcSet={ srcset } sizes={ sizes } width={ width } loading="lazy" />
        <span className={ style.name } title={ name }>{ name }</span>
        {
          mode === 'post_new' && mediaInsertMode === 'ck' &&
          <button
            className={ style.insert } data-width={ width }
            data-id={ id } data-src={ src } data-srcset={ srcset || '' }
            onClick={(e) => {
              e.stopPropagation();
              const sendEvent = new CustomEvent('media-selected', { detail: {
                src: e.currentTarget.dataset.src, srcset: e.currentTarget.dataset.srcset,
                width: e.currentTarget.dataset.width
              }});
              window.dispatchEvent( sendEvent );
              thumbSelectDialog?.current?.close();
            }}
          >挿入</button>
        }
        {
          mode === 'post_new' && mediaInsertMode === 'thumb' &&
          <button
            className={ style.insert } data-width={ width }
            data-id={ id } data-src={ src } data-srcset={ srcset || '' }
            onClick={(e) => {
              e.stopPropagation();
              const sendEvent = new CustomEvent('thumb-selected', {
                detail: {
                  src: `../../api/media-stream?id=${ e.currentTarget.dataset.id! }&w=800`,
                  id: e.currentTarget.dataset.id
                }
              });
              window.dispatchEvent( sendEvent );
              thumbSelectDialog?.current?.close();
            }}
          >選択</button>
        }
        <button
          className={ style.delete }
          data-id={ id }
          data-name={ name }
          onClick={(e) => {
            e.stopPropagation();
            const dataset = e.currentTarget.dataset;
            console.log( mode, mediaInsertMode );
            console.log( mode === 'post_new' && mediaInsertMode === 'thumb' && 'goog' );
            deleteFunc( dataset.id!, dataset.name! );
          }}
        >
          <FontAwesomeIcon icon={ faTrashCan }></FontAwesomeIcon>
          &nbsp;削除
        </button>
      </div>
    </li>
  )
}