"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import style from './content.module.scss';
import { getStrDatetime } from '@/lib/functions.client';

export default function Content({ useLang, defaultLang, locales, localeLabels }: {
  useLang: string, locales: string[], localeLabels: {[key: string]: {[key: string]: string}},
  defaultLang: string
}) {

  const [ postListJSX, setPostListJSX ] = useState<React.JSX.Element[] | null>( null );
  const [ isNext, setIsNext ] = useState<boolean>( false );
  const defaultTakeNum = 20;
  const takedPostNumRef = useRef<number>( 0 );
  let ignore = false;

  useEffect(() => {

    async function startFetching() {
      if ( !ignore ) {
        getPostList();
      }
    }

    startFetching();
    return () => { ignore = true };
  }, []);

  function getPostList() {

    fetch(`/api/post/get-many`, {
      method: 'POST', body: JSON.stringify({
        orderBy: [{ register_date: 'desc' }],
        take: defaultTakeNum, skip: takedPostNumRef.current
      })
    }).then( async (response) => {
      if ( response.ok ) {
        const postList = await response.json() as { isNext: boolean, result: Post.GetPost[] };
        const components: React.JSX.Element[] = []

        takedPostNumRef.current += defaultTakeNum;
        setIsNext( postList.isNext );

        for ( let post of postList.result ) {

          components.push(
            <tr>
              <td className={ style.thumb }>
                <span className={ style.img_wrap }>
                  {
                    post.media ?
                    <img
                      src={ `../../api/media-stream?w=800&id=${ post.media?.id }` }
                      loading="lazy" alt='サムネイル画像'
                    /> :
                    <span className={ style.no_image }>No image</span>
                  }
                </span>
              </td>
              <td>
                { post.title[ useLang ] }
                {
                  post.description &&
                  <span className={ style.description }>
                    { post.description[ useLang ] }
                  </span>
                }
              </td>
              <td>{ post.CategoryPost.map((cat) => {
                return `${ cat.category.name[ useLang ] }`;
              }).join(', ') }</td>
              <td>{ post.user.nameid }</td>
              <td>{ getStrDatetime( 'y-m-d h:mi', post.register_date ) }</td>
              <td>{ getStrDatetime( 'y-m-d h:mi', post.update_date ) }</td>
              <td>
                <Link className={ style.edit } href={`./post?mode=edit&id=${ post.id }`}>編集</Link>
                <button className={ style.trash }>ゴミ箱へ</button>
              </td>
            </tr>
          )
        }

        setPostListJSX((jsx) => {
          if ( jsx ) {
            return [ ...jsx, ...components ];
          }else {
            return components;
          }
        });
      }
    });
  }

  return (
    <div className={ style.wrapper }>
      <h2>投稿一覧</h2>
      <div className={ style.post_list_table }>
        <table>
          <thead>
            <tr>
              <th>サムネイル</th>
              <th>タイトル</th>
              <th>カテゴリー</th>
              <th>作成者</th>
              <th>作成日時</th>
              <th>更新日時</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            { postListJSX }
          </tbody>
        </table>
        {
          isNext &&
          <div className={ style.show_more }>
            <button
              onClick={() => { getPostList() }}
            >更に表示</button>
          </div>
        }
      </div>
    </div>
  )
}