"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import style from './content.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import MediaGallery from '@/components/use-client/media-gallery';
import dynamic from 'next/dynamic';
import type { ClassicEditor as Editor } from 'ckeditor5-custom-build';

const CkEditor = dynamic(() => import( '@/components/use-client/ckeditor' ));

export default function Content() {

  const [ thumbnailId, setThumbnailId ] = useState<number | null>( null );
  const [ categoryNode, setCategoryNode ] = useState<CategoryNode | null>( null );
  const [ checkedCategorys, setCheckedCategorys ] = useState<{[key: number]: boolean } | null>( null );
  const [ mediaInsertMode, setMediaInsertMode ] = useState<'ck' | 'thumb'>('thumb');
  const [ thumbnail, setThumbnail ] = useState<React.JSX.Element | null>( null );
  const thumbSelectDialog = useRef<HTMLDialogElement | null>( null );
  const editorRef = useRef<Editor | null>( null );
  const session = useSession();
  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {
        const { searchEdit, selectableList } = await getCategory();
        setCheckedCategorys( selectableList );
        setCategoryNode( searchEdit );

        window.addEventListener('thumb-selected', (e) => {
          setThumbnail(
            <img src={ e.detail.src } width={ 800 } sizes='100vw' loading="lazy" />
          )
          setThumbnailId( Number( e.detail.id ) );
        });
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

  function mediaSelectDialogClose() {

    thumbSelectDialog.current?.close();
  }

  return (
    <div className={ style.wrapper }>
      <h2>新規作成</h2>
      <div className={ style.container }>
        <div className={ style.edit_control }>
          <CkEditor
            editorRef={ editorRef }
            mediaSelectDialog={ thumbSelectDialog }
            setMediaInsertMode={ setMediaInsertMode }
          />
        </div>
        <div className={ style.widgets }>
          <div className={ style.thumbnail }>
            <h3>サムネイル設定</h3>
            <div className={ style.selector }>
              <span className={ style.no_thumb_text }>No thumbnail<br/>追加する</span>
              { thumbnail || <img style={{ display: 'none' }} src="" loading="lazy" /> }
              <button className={ style.select_btn } onClick={() => {
                thumbSelectDialog.current?.showModal();
                setMediaInsertMode('thumb');
              }}>サムネイル追加</button>
            </div>
            {
              thumbnail &&
              <button className={ style.delete }
                onClick={() => {
                  setThumbnail( null );
                  setThumbnailId( null );
                }}
              ><FontAwesomeIcon icon={ faTrashCan }></FontAwesomeIcon>&nbsp;削除</button>
            }
            <dialog ref={ thumbSelectDialog }>
              <div className={ style.thumb_select_dialog }>
                <h3>{ mediaInsertMode === 'thumb' ? 'サムネイルの選択' : 'メディアの挿入' }</h3>
                <button className={ style.close } onClick={() => mediaSelectDialogClose()}>
                  <FontAwesomeIcon fontSize={ "16pt" } icon={ faXmark }></FontAwesomeIcon>&nbsp;閉じる
                </button>
                <div className={ style.gallery_component }>
                  <MediaGallery
                    mode="post_new" thumbSelectDialog={ thumbSelectDialog }
                    mediaInsertMode={ mediaInsertMode }
                  />
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
      <div className={ style.post_push }>
        <button className={ style.draft }
          onClick={() => {
            console.log( editorRef.current?.getData(), session.data?.user?.id );
            console.log( thumbnailId, checkedCategorys );

            fetch('/api/post/create', {
              method: 'POST', body: JSON.stringify({
                
              })
            });
          }}
        >下書き保存</button>
        <button className={ style.publish }>公開</button>
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