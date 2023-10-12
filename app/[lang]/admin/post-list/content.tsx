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

  useEffect(() => {
    getPostList();
  }, []);

  function getPostList() {

    fetch(`/api/post/get-many`, {
      method: 'POST', body: JSON.stringify({
        orderBy: [{ register_date: 'desc' }],
        take: 20, skip: 0
      })
    }).then( async (response) => {
      if ( response.ok ) {
        const postList = await response.json() as { isNext: Boolean, result: Post.GetPost[] };
        const components: React.JSX.Element[] = []

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
              </td>
              <td>{ post.CategoryPost.map((cat) => {
                return `${ cat.category.name[ useLang ] }`;
              }).join(', ') }</td>
              <td>{ post.user.nameid }</td>
              <td>{ getStrDatetime( 'y-m-d h:mi', post.register_date ) }</td>
              <td>{ getStrDatetime( 'y-m-d h:mi', post.update_date ) }</td>
              <td>
                <Link href={`./post?mode=edit&id=${ post.id }`}>編集</Link>
                <button>ゴミ箱へ</button>
              </td>
            </tr>
          )
        }

        setPostListJSX( components );
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
      </div>
    </div>
  )
}