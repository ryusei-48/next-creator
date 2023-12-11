"use client";
import React, { useState, useRef, useEffect, createElement } from 'react';
import { useSession } from 'next-auth/react';
import style from './content.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import MediaGallery from '@/components/use-client/media-gallery';
import dynamic from 'next/dynamic';
import type { ClassicEditor as Editor } from 'ckeditor5-custom-build';
import type { Prisma } from '@prisma/client';

const CkEditor = dynamic(() => import( '@/components/use-client/ckeditor' ));

export default function Content({ useLang, defaultLang, locales, localeLabels }: {
  useLang: string, locales: string[], localeLabels: {[key: string]: {[key: string]: string}},
  defaultLang: string
}) {

  const [ mode, setMode ] = useState<'new' | 'edit'>('new');
  const [ postId, setPostId ] = useState<number>(0);
  const [ postStatus, setPostStatus ] = useState<'draft' | 'publish' | 'trash'>('draft');
  const [ thumbnailId, setThumbnailId ] = useState<number | null>( null );
  const [ categoryNode, setCategoryNode ] = useState<CategoryNode | null>( null );
  const [ checkedCategorys, setCheckedCategorys ] = useState<{[key: number]: boolean } | null>( null );
  const [ mediaInsertMode, setMediaInsertMode ] = useState<'ck' | 'thumb'>('thumb');
  const [ thumbnail, setThumbnail ] = useState<React.JSX.Element | null>( null );
  const [ postType, setPostType ] = useState<'post' | 'tips'>("post");
  //const [ inputLoadCounts, setInputLoadCounts ] = useState({ title: 0, editor: 0 });
  const thumbSelectDialog = useRef<HTMLDialogElement | null>( null );
  const titleInputRef = useRef<{[key: string]: HTMLInputElement}>({});
  const editorRef = useRef<{[key: string]: Editor}>({});
  const descInputRef = useRef<{[key: string]: HTMLTextAreaElement}>({});
  const permalinkInput = useRef<HTMLInputElement | null>( null );
  const postData = useRef<GetPostData | null>( null );
  const session = useSession();
  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {
        const searchParams = new URL( location.href ).searchParams;
        setMode( searchParams.get( 'mode' ) as 'new' | 'edit' || 'new' );
        setPostId( Number( searchParams.get( 'id' ) || 0 ) );

        const { searchEdit, selectableList } = await getCategory();
        setCheckedCategorys( selectableList );
        setCategoryNode( searchEdit );

        window.addEventListener('thumb-selected', (e) => {
          setThumbnail(
            <img src={ e.detail.src } width={ 800 } sizes='100vw' loading="lazy" />
          )
          setThumbnailId( Number( e.detail.id ) );
        });

        setTimeout( async () => {
          if (
            mode === 'edit' && postId > 0 &&
            locales.length === Object.keys( titleInputRef.current ).length &&
            locales.length === Object.keys( editorRef.current ).length
          ) {
            
            postData.current = await getPostData( postId );
      
            setPostStatus( postData.current!.status );
      
            for ( let lang of locales ) {
              titleInputRef.current[ lang ].value = postData.current!.title[ lang ]!;
              editorRef.current[ lang ].setData( postData.current!.body[ lang ]! );
              if ( postData.current!.description ) {
                descInputRef.current[ lang ].value = postData.current!.description[ lang ];
              }
            }
      
            if ( postData.current && postData.current.permalink ) {
              setPostType( postData.current.type );
              permalinkInput.current!.value = postData.current.permalink;
            }
      
            setThumbnail(
              <img src={ `../../api/media-stream?id=${ postData.current!.media?.id }&w=800` }
                width={ 800 } sizes='100vw' loading="lazy"
              />
            )
      
            setThumbnailId( postData.current!.media?.id || null )
      
            setCheckedCategorys((checked) => {
              if ( checked && postData.current!.CategoryPost ) {
                for ( let cat of postData.current!.CategoryPost ) {
                  checked[ cat.category.id ] = true;
                }
              }
              return checked;
            })
          }
        }, 400);
      }
    }

    startFetching();
    return () => { ignore = true };
  }, [mode, postId]);

  function getCategoryNode( tree: CategoryNode ) {

    return (
      <ul role="tree" className={ style.category_group }>
        {
          tree.map(( cat ) => {
            return (
              <li key={ cat.id } role="treeitem" tabIndex={ 0 }>
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
                    { cat.name[ useLang ] } - { cat.slug }
                  </label>
                  <input type="checkbox" name="select_cat" defaultValue={ cat.id }
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
                  { cat.name[ useLang ] }
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

  function sendPostData( setStatus: 'draft' | 'publish' | 'trash' ) {

    const title: {[key: string]: string} = {}
    const body: {[key: string]: string} = {}
    const description: {[key: string]: string} = {}
    for ( let lang of locales ) {
      title[ lang ] = titleInputRef.current[ lang ].value;

      const htmlBody = editorRef.current[ lang ].getData();
      const htmlFormater = document.createElement('div');
      htmlFormater.innerHTML = htmlBody;
      const MatchPattern = new RegExp(`^${ process.env.NEXT_PUBLIC_APP_URL }/`);
      const replacePattern = /^(\.\.?\/)+|^https?\:\/\/[^\/]+\//;
      for ( let img of [...htmlFormater.querySelectorAll('img')] ) {
        if ( MatchPattern.test( img.src ) ) {
          img.src = img.src.replace( replacePattern, '{{root-domain-url}}/' );
          for ( let [ index, url ] of img.srcset.split(' ').entries() ) {
            if ( index === 0 || index % 3 === 0 ) {
              const pathname = url.replace( replacePattern, '{{root-domain-url}}/' );
              img.srcset = img.srcset.replace( url, pathname );
            }
          }
        }else console.log( img.src );
      }
      body[ lang ] = htmlFormater.innerHTML;
      description[ lang ] = descInputRef.current[ lang ].value;
    }
  
    const checkedList = checkedCategorys ? Object.keys( checkedCategorys ).filter((id) => {
      return checkedCategorys[ Number( id ) ] ? true : false;
    }) : [];
  
    const CategoryPost: {[key: string]: any} = {}
    if ( checkedCategorys && ( postStatus === 'draft' || postStatus === 'publish' ) && mode === 'edit' ) {
      const createCheckedList = postData.current!.CategoryPost.length !== 0 ? checkedList.filter((cat) => {
        for ( let cat_d of postData.current!.CategoryPost ) {
          if ( cat_d.category.id === Number( cat ) ) return false;
        }
        return true;
      }) : checkedList;
      const deleteCheckedList = postData.current?.CategoryPost.filter((cat) => {
        for ( let cat_d of checkedList ) {
          if ( Number( cat_d ) === cat.category.id ) return false;
        }
        return true;
      })
  
      if ( createCheckedList.length > 0 ) {
        CategoryPost.create = [...createCheckedList.map((id) => {
          return { category: { connect: { id: Number( id ) } } }
        })];
      }
      if ( deleteCheckedList && deleteCheckedList.length > 0 ) {
        CategoryPost.deleteMany = [...deleteCheckedList.map((id) => {
          return { postId: postId, categoryId: Number( id.category.id ) }
        })];
      }
    }else {
      CategoryPost.create = checkedCategorys ? Object.keys( checkedCategorys ).filter((id) => {
        return checkedCategorys[ Number( id ) ] ? true : false;
      }).map((id) => {
        return { category: { connect: { id: Number( id ) } } }
      }) : []
    }

    let permalink: string | null = null;
    if ( permalinkInput.current!.value !== "" ) {
      permalink = permalinkInput.current!.value;
    }
  
    const sendJson: any = {
      title, body, description, permalink, type: postType,
      media: { connect: { id: thumbnailId } }, CategoryPost,
      status: setStatus, user: { connect: { id: Number( session.data?.user?.id ) } }
    }

    if ( !thumbnailId ) delete sendJson.media;
  
    fetch(`/api/post/${ ( postStatus === 'draft' || postStatus === 'publish' ) && mode === 'edit' ? 'update' : 'create' }`, {
      method: 'POST', body: JSON.stringify(
        ( postStatus === 'draft' || postStatus === 'publish' ) && mode === 'edit' ?
          { id: postId, update: sendJson } : sendJson
      )
    }).then((response) => {
      if ( response.ok ) {
        if ( mode === 'new' && setStatus === 'draft' ) {
          alert('新規投稿を下書きとして保存しました。');
        }else if ( mode === 'new' && setStatus === 'publish' ) {
          alert('新規投稿を公開しました。')
        }else if ( mode === 'edit' && postStatus === 'publish' && setStatus === 'draft' ) {
          alert(`公開投稿を下書きに変更しました。`);
        }else if ( mode === 'edit' && postStatus === 'draft' && setStatus === 'publish' ) {
          alert(`下書きを公開しました。`);
        }else if ( mode === 'edit' && postStatus === 'draft' && setStatus === 'draft' ) {
          alert(`下書きを更新しました。`);
        }else if ( mode === 'edit' && postStatus === 'publish' && setStatus === 'publish' ) {
          alert('投稿記事を更新しました。');
        }else if ( mode === 'edit' && setStatus === 'trash' ) {
          alert('記事をゴミ箱に移動しました。');
        }
        location.reload();
      }
    });
  }

  function mediaSelectDialogClose() {

    thumbSelectDialog.current?.close();
  }

  return (
    <div className={ style.wrapper }>
      <h2>
        { mode === 'new' ? '新規作成' : '記事編集' }
        {
          mode === 'edit' &&
          <span className={ style.status }>ステータス：
            { postStatus === 'publish' ? '公開済み' : '下書き' }
          </span>
        }
      </h2>
      <div className={ style.container }>
        <div className={ style.edit_control }>
          <CkEditor
            locales={ locales } defaultLang={ useLang }
            localeLabels={ localeLabels }
            titleInputRef={ titleInputRef }
            editorRef={ editorRef } descInputRef={ descInputRef }
            //loadInputCounts={ setInputLoadCounts }
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
            <dialog className={ style.thumbSelect } ref={ thumbSelectDialog }>
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
          <div className={ style.permalink }>
            <h3>パーマリンク</h3>
            <div className={ style.input }>
              <span>/</span>
              <input ref={ permalinkInput } type="text" placeholder="my-post" />
            </div>
          </div>
          <div className={ style.post_type }>
            <h3>投稿タイプ</h3>
            <div className={ style.input }>
              <span className={ style.radio }>
                <input type="radio" id="post-type-input-post" name="post-type"
                  checked={ postType === 'post' } onChange={() => setPostType("post")}
                />
                <label htmlFor="post-type-input-post">Post</label>
              </span>
              <span className={ style.radio }>
                <input type="radio" id="post-type-input-tips" name="post-type"
                  checked={ postType === 'tips' } onChange={() => setPostType("tips")}
                />
                <label htmlFor="post-type-input-tips">Tips</label>
              </span>
            </div>
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
        {
          mode === 'new' || postStatus === 'draft' ?
          <>
            <button className={ style.draft }
              onClick={() => { sendPostData('draft') }}
            >下書き保存</button>
            <button className={ style.publish }
              onClick={() => { sendPostData('publish') }}
            >公開</button>
          </> :
          <>
            {
              ( postStatus === 'publish' || postStatus === 'trash' ) &&
              <button className={ style.draft }
                onClick={() => { sendPostData('draft') }}
              >下書きに戻す</button>
            }
            {
              postStatus === 'publish' &&
              <button className={ style.update }
                onClick={() => { sendPostData('publish') }}
              >更新</button>
            }
          </>
        }
      </div>
    </div>
  )
}

export async function getCategory() {

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

type GetPostData = {
  body: {[key: string]: string}, title: {[key: string]: string},
  description: {[key: string]: string} | null,
  permalink: string | null, status: 'draft' | 'publish' | 'trash',
  media: { id: number, url: Prisma.JsonValue } | null,
  user: { nameid: string },
  CategoryPost: {
    category: { id: number, name: string }
  }[], type: "post" | "tips"
} | null

async function getPostData( id: number ) {

  return new Promise<GetPostData>((resolve) => {

    fetch('/api/post/get', {
      method: 'POST', body: JSON.stringify({ id })
    }).then( async (response) => {
      if ( response.ok ) {
        resolve( await response.json() );
      }else resolve( null );
    });
  });
}