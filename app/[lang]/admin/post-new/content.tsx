"use client";
import React, { useState, useRef, useEffect } from 'react';
import style from './content.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import MediaGallery from '@/components/use-client/media-gallery';
import dynamic from 'next/dynamic';
//import CkEditor from '@/components/use-client/ckeditor';

type CategoryData = {
  id: number, name: string, slug: string,
  rank: number, parent: number, icon: string | null,
  icon_mime: string | null, register_date: string,
  update_date: string
}

type CategoryNode = ({
  children: CategoryNode
} & CategoryData)[]

const CkEditor = dynamic(() => import( '@/components/use-client/ckeditor' ));

export default function Content() {

  const [ thumbnailId, setThumbnailId ] = useState<number | null>( null );
  const [ categoryNode, setCategoryNode ] = useState<CategoryNode | null>( null );
  const [ checkedCategorys, setCheckedCategorys ] = useState<{[key: number]: boolean } | null>( null );
  const checkedCategorysRef = useRef<{[key: number]: boolean } | null>( null );
  const thumbnailRef = useRef<HTMLImageElement | null>( null );
  const thumbSelectDialog = useRef<HTMLDialogElement | null>( null );
  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {
        const { searchEdit, selectableList } = await getCategory();
        checkedCategorysRef.current = selectableList;
        setCheckedCategorys( selectableList );
        setCategoryNode( searchEdit );
        console.log( 'aaaaaaaa' );
      }
    }

    startFetching();
    return () => { ignore = true };
  }, []);

  function getCategoryNode( tree: CategoryNode ) {

    return (
      <ul role="tree" className={ style.category_group }>
        {
          tree.map(( cat ) => {
            return (
              <li role="treeitem" tabIndex={ 0 }>
                <div className={ style.item } onMouseOver={(e) => {
                    e.stopPropagation();
                    if ( !checkedCategorys![ cat.id ] ) {
                      e.currentTarget.classList.add( style.bg_color );
                    }
                  }} onMouseOut={(e) => {
                    e.stopPropagation();
                    if ( !checkedCategorys![ cat.id ] ) {
                      e.currentTarget.classList.remove( style.bg_color );
                    }
                  }}
                >
                  <label htmlFor={ `cat_id_${ cat.id }` } className={ style.select_cat_label }
                    style={{
                      backgroundColor: checkedCategorys![ cat.id ] ? 'var( --primary-color )' : 'transparent'
                    }}
                  >
                    { cat.name } - { cat.slug }
                  </label>
                  <input type="checkbox" name="select_cat" value={ cat.id }
                    id={ `cat_id_${ cat.id }` }
                    checked={ checkedCategorys![ cat.id ] }
                    onClick={(e) => {
                      const id = Number( e.currentTarget.value );
                      //console.log( checkedCategorys![ cat.id ] );
                      setCheckedCategorys((prevChecked) => {
                        const updatedChecked = { ...prevChecked };
                        updatedChecked[id] = !updatedChecked[id];
                        return updatedChecked;
                      });
                    }}
                  />
                  <span  className={ style.icon }>
                    {
                      cat.icon ?
                        <img src={ `../api/media-stream/icon?id=${ cat.id }` } aria-label='アイコン' loading="lazy" /> :
                        <FontAwesomeIcon icon={ faAngleDoubleRight }></FontAwesomeIcon>
                    }
                  </span>
                  { cat.name }
                  <span style={{ marginLeft: '15px', color: 'gray' }}>{ cat.slug }</span>
                </div>
                {
                  cat.children.length > 0 && getCategoryNode( cat.children )
                }
              </li>
            )
          })
        }
      </ul>
    )
  }

  return (
    <div className={ style.wrapper }>
      <h2>新規作成</h2>
      <div className={ style.container }>
        <div className={ style.edit_control }><CkEditor /></div>
        <div className={ style.widgets }>
          <div className={ style.thumbnail }>
            <h3>サムネイル設定</h3>
            <div className={ style.selector }>
              <span className={ style.no_thumb_text }>No thumbnail<br/>追加する</span>
              <img ref={ thumbnailRef } style={{ display: 'none' }} src="" loading="lazy" />
              <button className={ style.select_btn } onClick={() => { thumbSelectDialog.current?.showModal() }}>サムネイル追加</button>
            </div>
            <dialog ref={ thumbSelectDialog }>
              <div className={ style.thumb_select_dialog }>
                <h3>サムネイルの選択</h3>
                <button className={ style.close } onClick={() => { thumbSelectDialog.current?.close() }}>閉じる</button>
                <div className={ style.gallery_component }>
                  <MediaGallery mode="post_new" thumbnailState={ setThumbnailId } />
                </div>
              </div>
            </dialog>
          </div>
          <div className={ style.category }>
            <h3>カテゴリー選択</h3>
            <div className={ style.tree_view }>
              {
                categoryNode && getCategoryNode( categoryNode )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function getCategory() {

  return new Promise<{
    searchEdit: CategoryNode, selectableList: { [key: number]: boolean }
  }>((resolve) => {

    fetch('/api/category/get', { method: 'POST' })
      .then( async (response) => {
        if ( response.ok ) {
          const selectableList: { [key: number]: boolean } = {};
          const categorys = await response.json() as CategoryData[];
          
          const searchEdit = ( categorys: CategoryData[], parent: number = 0 ) => {
            const children: CategoryNode = []
            for ( let [ index, category ] of categorys.entries() ) {
              if ( parent === category.parent ) {
                //categorys.splice( index, 1 );
                selectableList[ category.id ] = false;
                children.push({ ...category, children: searchEdit( categorys, category.id ) });
              }
            }

            return children;
          }

          resolve({ searchEdit: searchEdit( categorys, 0 ), selectableList });
        }
      });
  });
}