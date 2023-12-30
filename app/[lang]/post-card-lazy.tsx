'use client';
import styles from './post-card-lazy.module.scss';
import pagesStyles from './page.module.scss';
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getStrDatetime } from '@/lib/functions.client';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';

export default function PostCardLazy({ isNext, skip, access_token, localePathname, type, lang, localeStack }: {
  isNext: boolean, skip: number, access_token: string, type: "post" | "tips",
  localePathname: string, lang: AcceptLocales, localeStack: { "more-post": string  }
}) {

  const [ stateIsNext, setStateIsNext ] = useState<boolean>( false );
  const [ postCards, setPostCards ] = useState<React.JSX.Element[]>( [] );
  const offset = useRef<number>( 0 );

  useEffect(() => {
    setStateIsNext( isNext );
    offset.current = skip;
  }, []);

  async function handleMoreButton() {
    const posts = await getPosts( access_token, offset.current + 1, type );
    if ( posts === null ) return;
    offset.current += 10;
    if ( posts.isNext ) setStateIsNext( true );
    else setStateIsNext( false );
    if ( type === "post" ) {
      setPostCards([ ...postCards, ...posts.result.map((post) => {
        return (
          <article className={ `animate__animated animate__fadeIn ${ pagesStyles.post }` }>
            <Link className={ pagesStyles.link_wrap } href={ post.permalink ? `${ localePathname }/article/${ post.permalink }` : `${ localePathname }/article?id=${ post.id }` }>
              <div className={ pagesStyles.thumbnail }>
                <figure>
                  {
                    post.media ?
                    <img src={ `/api/media-stream?w=800&id=${ post.media.id }` } alt="thumbnail image" loading="lazy" /> :
                    <span className={ pagesStyles.no_image }>No Image</span>
                  }
                </figure>
              </div>
              <div className={ pagesStyles.details }>
                <h3>{ post.title[ lang ] }</h3>
                { post.description && <aside className={ pagesStyles.description }>{ post.description[ lang ] }</aside> }
                <span className={ pagesStyles.datetime }>
                  <FontAwesomeIcon width={`11pt`} icon={ faClock }></FontAwesomeIcon>
                  &nbsp;{ getStrDatetime( "y-m-d h:mi", post.register_date ) }
                </span>
              </div>
            </Link>
          </article>
        )
      })]);
    }else if ( type === "tips" ) {
      setPostCards([ ...postCards, ...posts.result.map((tips) => {
        return (
          <article className={ `animate__animated animate__fadeIn ${ pagesStyles.tips }` }>
            <Link className={ pagesStyles.link_wrap } href={ tips.permalink ? `${ localePathname }/tips/${ tips.permalink }` : `${ localePathname }/tips?id=${ tips.id }` }>
              <div className={ pagesStyles.meta_details }>
                <div className={ pagesStyles.categories }>
                  {
                    tips.CategoryPost.map((cat) => {
                      return (
                        <span>
                          { cat.category.name[ lang ] }
                        </span>
                      )
                    })
                  }
                </div>
                <div className={ pagesStyles.time }>
                  <span>
                    <FontAwesomeIcon width={`11pt`} icon={ faClock }></FontAwesomeIcon>
                    &nbsp;{ getStrDatetime( "y-m-d h:mi", tips.register_date ) }
                  </span>
                </div>
              </div>
              <div className={ pagesStyles.heading }>
                <h3>{ tips.title[ lang ] }</h3>
              </div>
            </Link>
          </article>
        )
      })])
    }
  }

  return (
    <>
      { postCards }
      {stateIsNext && <div className={ styles.more_button_wrap }>
        <button className={ styles.more }
          onClick={ handleMoreButton }
        >{ localeStack['more-post'] }</button>
      </div>}
    </>
  )
}

function getPosts( access_token: string, skip: number, type: "post" | "tips" ):
  Promise<{ result: Post.GetPost[], isNext: boolean } | null> {
  const requestJson: {
    orderBy: Prisma.PostOrderByWithRelationInput[],
    where?: Prisma.PostWhereInput,
    take: number, skip: number
  } = {
    orderBy: [ { register_date: 'desc' } ], take: 10, skip,
    where: { status: 'publish', type }
  };

  return new Promise((resolve) => {
    fetch( `/api/post/get-many`, {
      method: 'POST', body: JSON.stringify( requestJson ),
      headers: {
        'Content-Type': 'application/json', 'API_ACCESS_TOKEN': access_token
      },
    }).then( async (response) => {
      if ( response.ok ) {
        resolve( await response.json() );
      } else {
        resolve( null );
      }
    });
  })
}